import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatSelectionListChange } from '@angular/material/list';

import { StripeService } from '../../services/stripe.service';

@Component({
  selector: 'app-select-card',
  templateUrl: './select-card.component.html',
  styleUrls: ['./select-card.component.scss']
})
export class SelectCardComponent implements OnInit {
  @Output() cardSelected = new EventEmitter<string>();

  public cards$: any;
  public selectedCard: any;
  public confirmation: any;

  constructor(private stripe: StripeService) { }

  async ngOnInit() {
    this.cards$ = this.stripe.getSources();
  }

  public onSelectionChange(event: MatSelectionListChange) {
    this.selectedCard = event.option.value;
    this.cardSelected.emit(this.selectedCard);

  }

  public async onPayButtonClick() {
    if (!this.selectedCard) {
      alert('Please choose a payment method');
      return;
    }
    this.confirmation = await this.stripe.createCharge(this.selectedCard, 2000).toPromise();
    console.log('this.confirmation :', this.confirmation);
  }

}
