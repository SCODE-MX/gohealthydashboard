import { StripeService } from 'src/app/services/stripe.service';

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.scss']
})
export class SubscribeComponent implements OnInit {
  private selectedCard: string;
  private confirmation: any;

  constructor(private stripe: StripeService) { }

  ngOnInit() {
  }

  public onCardSelected(selectedCard: string): void {
    this.selectedCard = selectedCard;
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
