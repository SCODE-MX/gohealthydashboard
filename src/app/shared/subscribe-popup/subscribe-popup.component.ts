


import { ToastrService } from 'ngx-toastr';
import { StripeService } from 'src/app/services/stripe.service';
import { environment } from 'src/environments/environment';

import { Component, HostListener, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

declare var StripeCheckout: StripeCheckoutStatic;

@Component({
  selector: 'app-subscribe-popup',
  templateUrl: './subscribe-popup.component.html',
  styleUrls: ['./subscribe-popup.component.scss']
})
export class SubscribePopupComponent {
  private selectedCard: string;
  public loading = false;
  private handler: StripeCheckoutHandler;
  public cards: any[];

  constructor(
    public dialogRef: MatDialogRef<SubscribePopupComponent>,
    private stripe: StripeService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.cards = data.cards;
  }

  public onCardSelected(selectedCard: string): void {
    this.selectedCard = selectedCard;
  }

  public async onAddCardButtonClick(event) {
    try {
      const customer: any = await this.checkout(event);
      this.cards = customer.sources.data;
    } catch (error) {
      this.toastr.error('No se pudo agregar la tarjeta');
    }
  }

  private async checkout(event) {
    const user = await this.stripe.getUser();

    return new Promise((resolve, reject) => {
      this.handler = StripeCheckout.configure({
        key: environment.stripe.key,
        locale: 'es',
        currency: 'mxn',
        allowRememberMe: false,
        source: async (source) => {
          try {
            this.loading = true;
            const customer = await this.stripe.attachSource(source.id).toPromise();
            resolve(customer);
          } catch (error) {
            reject(error);
          } finally {
            this.loading = false;
          }
        }
      });

      this.handler.open({
        name: 'Registro de tarjeta',
        description: 'Ingrese los datos su tarjeta',
        email: user.email,
        panelLabel: 'Agregar Tarjeta'
      });
      event.preventDefault();
    });
  }

  public async onPayButtonClick() {
    if (!this.selectedCard) {
      alert('Elija una tarjeta para continuar');
      return;
    }
    this.loading = true;
    const confirmation = await this.stripe.subscribeToPlan('plan_FmpGElUUFBzVry', this.selectedCard).toPromise();
    this.loading = false;

    this.dialogRef.close(confirmation);
  }

  // Close on navigate
  @HostListener('window:popstate')
  onPopState() {
    this.handler.close();
  }

}
