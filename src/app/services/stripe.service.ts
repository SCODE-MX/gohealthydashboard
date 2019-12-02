import { Observable, of } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  public user$: Observable<any>;

  constructor(
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
    // 4mu5enOwKGUSVeJyT2Gw071enyF3
    this.user$ = dbUser.pipe(
      map(userMapper)
    );

  }

  async getUser() {
    return this.afAuth.authState.pipe(first()).toPromise();
  }

  public createCharge = (source: string, amount: number) => this.functions.httpsCallable('stripeCreateCharge')({source, amount});

  public getSources = () => this.functions.httpsCallable('stripeGetSources')({});

  public subscribeToPlan = (plan: string, source: string) => this.functions.httpsCallable('stripeCreateSubscription')({plan, source});

  public cancelSubscription = (subscriptionId: string) => this.functions.httpsCallable('stripeCancelSubscription')({plan: subscriptionId});

}
