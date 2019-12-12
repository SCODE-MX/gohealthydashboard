/// <reference types="stripe-checkout"/>

import { Observable, of } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';

import { AuthService } from '../auth/auth.service';
import { normalizeString } from '../models/functions/general.functions';
import { IUser } from '../models/interfaces/general.interfaces';

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
      switchMap(user => user ? this.afs.doc(`users/${user.uid}`).valueChanges() : of(null))
    );

    const userMapper = user => {
      const status = user.stateSub === 'inactive' ? 'INACTIVO' : 'ACTIVO';
      const planName = user.stateSub === 'ACTIVO' ? 'PREMIUM' : 'GRATUITO';
      return {
        planName,
        status,
        subscriptionId: user.subId,
      };
    };

    this.user$ = dbUser.pipe(
      map(userMapper)
    );
  }

  public getUser() {
    return this.afAuth.authState.pipe(first()).toPromise();
  }

  public createCharge = (source: string, amount: number) => this.functions.httpsCallable('stripeCreateCharge')({source, amount});

  public getSources = () => this.functions.httpsCallable('stripeGetSources')({});

  public attachSource = (source: string) => this.functions.httpsCallable('stripeAttachSource')({source});

  public dettachSource = (source: string) => this.functions.httpsCallable('stripeDettachSource')({source});

  public subscribeToPlan = (plan: string, source: string) => this.functions.httpsCallable('stripeCreateSubscription')({plan, source});

  public async cancelSubscription(subscriptionId: string): Promise<boolean> {
    try {
      const owners = await this.auth.user.pipe(first()).toPromise();
      await Promise.all([
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
