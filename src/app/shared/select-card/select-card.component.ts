import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { StripeService } from '../../services/stripe.service';

@Component({
  selector: 'app-select-card',
  templateUrl: './select-card.component.html',
  styleUrls: ['./select-card.component.scss']
})
export class SelectCardComponent implements OnInit {
  @Output() cardSelected = new EventEmitter<string>();

  public cards$: any;
  public selectedCard: string;

  constructor(private stripe: StripeService) { }

  async ngOnInit() {
    this.cards$ = this.stripe.getSources();
  }

  public onSelectionChange() {
    this.cardSelected.emit(this.selectedCard);
  }

  public onDeleteCard(cardId: string) {
    this.stripe.dettachSource(cardId);
  }

}
