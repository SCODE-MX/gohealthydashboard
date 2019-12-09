


import { StripeService } from 'src/app/services/stripe.service';

import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

declare var StripeCheckout: StripeCheckoutStatic;

@Component({
  selector: 'app-subscribe-popup',
  templateUrl: './subscribe-popup.component.html',
  styleUrls: ['./subscribe-popup.component.scss']
})
export class SubscribePopupComponent implements OnInit {
  private selectedCard: string;
  private confirmation: any;
  public handler: StripeCheckoutHandler;

  constructor(public dialogRef: MatDialogRef<SubscribePopupComponent>, private stripe: StripeService) { }

  ngOnInit() {
  }

  public onCardSelected(selectedCard: string): void {
    this.selectedCard = selectedCard;
  }

  public onAddCardButtonClick(event) {
    this.stripe.checkout.open(event);
  }

  public async onPayButtonClick() {
    if (!this.selectedCard) {
      alert('Elija una tarjeta para continuar');
      return;
    }
    this.confirmation = await this.stripe.subscribeToPlan('plan_FmpGElUUFBzVry', this.selectedCard).toPromise();
    console.log('this.confirmation :', this.confirmation);
  }

}
