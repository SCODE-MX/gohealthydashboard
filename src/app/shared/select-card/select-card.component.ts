import { ToastrService } from 'ngx-toastr';

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { StripeService } from '../../services/stripe.service';

@Component({
  selector: 'app-select-card',
  templateUrl: './select-card.component.html',
  styleUrls: ['./select-card.component.scss']
})
export class SelectCardComponent {
  @Input() cards: any[];
  @Output() cardSelected = new EventEmitter<string>();

  public selectedCard: string;
  public loading = false;

  constructor(
    private stripe: StripeService,
    private toastr: ToastrService
  ) { }

  public onSelectionChange() {
    this.cardSelected.emit(this.selectedCard);
  }

  public async onDeleteCard(cardId: string, remainingCards: number) {
    if (remainingCards === 1) {
      alert('Debe tener al menos una tarjeta registrada');
      return;
    }

    try {
      this.loading = true;
      const removedCard = await this.stripe.dettachSource(cardId).toPromise();
      this.cards = this.cards.filter( ({id}) => id !== removedCard.id);
    } catch (error) {
      this.toastr.error('No se pudo eliminar su tarjeta');
    } finally {
      this.loading = false;
    }
  }

}
