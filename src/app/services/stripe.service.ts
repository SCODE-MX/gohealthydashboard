/// <reference types="stripe-checkout"/>

import { Observable, of } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

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
  public checkout: {
    isLoading: boolean;
    confirmation: string;
    open: Function;
  };

  private handler: StripeCheckoutHandler;

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
      const planName = user.planId ? 'PREMIUM' : 'GRATUITO';
      const status = user.stateSub === 'inactive' ? 'INACTIVO' : 'ACTIVO';
      return {
        planName,
        status,
        subscriptionId: user.subId,
      };
    };

    this.user$ = dbUser.pipe(
      map(userMapper)
    );

    this.handler = StripeCheckout.configure({
      key: environment.stripe.key,
      locale: 'es',
      currency: 'mxn',
      allowRememberMe: false,
      source: async (source) => {
        this.checkout.isLoading = true;
        this.checkout.confirmation = await this.subscribeToPlan('plan_FmpGElUUFBzVry', source.id).toPromise();
        this.checkout.isLoading = false;
      }
    });

    this.checkout = {
      isLoading: false,
      confirmation: '',
      open: this.openAddCardCheckout,
    };

  }

  private openAddCardCheckout = async (event) => {
    const user = await this.getUser();
    this.handler.open({
      name: 'Registro de tarjeta',
      description: 'Ingrese los datos su tarjeta',
      email: user.email,
      panelLabel: 'Agregar Tarjeta'
    });
    event.preventDefault();
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
