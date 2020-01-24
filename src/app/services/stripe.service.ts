/// <reference types="stripe-checkout"/>

import { Observable, of } from 'rxjs';
import { first, mergeMap, switchMap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';

import { AuthService } from '../auth/auth.service';
import { normalizeString } from '../models/functions/general.functions';
import { IUser } from '../models/interfaces/general.interfaces';
import { StripeUser } from '../models/interfaces/stripeUser.interface';

declare var StripeCheckout: StripeCheckoutStatic;
@Injectable({
  providedIn: 'root'
})
export class StripeService {
  public user$: Observable<any>;

  constructor(
    private auth: AuthService,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private functions: AngularFireFunctions
  ) {
    const dbUser = this.afAuth.authState.pipe(
      switchMap(user => user ? this.afs.doc(`users/${user.uid}`).snapshotChanges() : of(null))
    );

    const userMapper = async (snapshot): Promise<StripeUser> => {
      const user = {
        id: snapshot.payload.id,
        ...snapshot.payload.data(),
      };
      const plans = await this.getPlans().toPromise();
      let userPlan = plans.find(plan => plan.id === user.planId);

      const status = user.stateSub === 'inactive' ? 'INACTIVO' : 'ACTIVO';
      if (!userPlan || user.stateSub === 'inactive') {
        userPlan = {
          id: '',
          name: 'GRATUITO',
          slots: 0,
          cost: 0,
        };
      }

      userPlan.name =  userPlan.name.toUpperCase();

      return {
        id: user.id,
        plan: userPlan,
        status,
        usedSlots: user.slots || 0,
        availableSlots: userPlan.slots - (user.slots || 0),
        subscriptionId: user.subId,
      };
    };

    this.user$ = dbUser.pipe(
      mergeMap(userMapper)
    );
  }

  public getUser() {
    return this.afAuth.authState.pipe(first()).toPromise();
  }

  public createCharge = (source: string, amount: number) => this.functions.httpsCallable('stripeCreateCharge')({source, amount});

  public getSources = () => this.functions.httpsCallable('stripeGetSources')({});

  public getPlans = () => this.functions.httpsCallable('stripeGetPlans')({});

  public attachSource = (source: string) => this.functions.httpsCallable('stripeAttachSource')({source});

  public dettachSource = (source: string) => this.functions.httpsCallable('stripeDettachSource')({source});

  public subscribeToPlan = (plan: string, source: string) => this.functions.httpsCallable('stripeCreateSubscription')({plan, source});

  public async cancelSubscription(subscriptionId: string): Promise<boolean> {
    try {
      const owners = await this.auth.user.pipe(first()).toPromise();
      const stripeUser = await this.user$.pipe(first()).toPromise();

      await Promise.all([
        this.afs.doc(`users/${stripeUser.id}`).update({slots: 0}),
        this.setUserPlacesToNotVisible(owners[0]),
        this.functions.httpsCallable('stripeCancelSubscription')({plan: subscriptionId})
      ]);
      return true;
    } catch (error) {
      // TODO: Handle error when something goes wrong while updating
      return false;
    }
  }

  private async setUserPlacesToNotVisible({estado, id}: IUser): Promise<void> {
    const placesCollection = this.afs.collection(
      `Directorio/Estados/${normalizeString(estado)}/`,
      ref => ref.where('propietario', '==', id)
    );
    const places = await placesCollection.snapshotChanges().pipe(first()).toPromise();
    const batch = this.afs.firestore.batch();
    places.forEach(place => batch.update(place.payload.doc.ref, { visible: false}));
    return batch.commit();
  }
}
