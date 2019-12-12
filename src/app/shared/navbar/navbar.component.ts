import { ToastrService } from 'ngx-toastr';
import { reject } from 'q';
import { first } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { StripeService } from 'src/app/services/stripe.service';
import { environment } from 'src/environments/environment';

import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { NoCardPopupComponent } from '../no-card-popup/no-card-popup.component';
import { PopupComponent } from '../popup/popup.component';
import { SubscribePopupComponent } from '../subscribe-popup/subscribe-popup.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public name: string;
  public loading = false;
  public confirmation: any;
  private handler: StripeCheckoutHandler;

  constructor(
    private stripe: StripeService,
    public auth: AuthService,
    public dialog: MatDialog,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
  }

  async openCurrentPlanDialog(event): Promise<void> {
    const dialogRef = this.dialog.open(PopupComponent, {
      width: '400px',
      data: { }
    });

    const result = await dialogRef.afterClosed().toPromise();

    if (result === 'changeToPremium') {
      this.loading = true;
      const cards = await this.stripe.getSources().pipe(first()).toPromise();
      this.loading = false;

      if (cards.length === 0) {
        const addedCard = await this.openNoCardPopUp(event);
        if (!addedCard) {
          return;
        }
      }

      await this.openSubscribePopUp(cards);

    } else if (result === 'cancelPlan') {
      this.toastr.success('Su plan ha sido cancelado', 'Actualización');
    }

  }

  async openNoCardPopUp(event): Promise<boolean> {
    const dialogRef = this.dialog.open(NoCardPopupComponent, {
      width: '400px',
      data: { }
    });

    const result = await dialogRef.afterClosed().toPromise();

    if (result === 'addCard') {
      try {
        await this.checkout(event);
        return true;
      } catch (error) {
        // Something went wrong while adding card.
        return false;
      }
    }
    return false;
  }

  // Open the checkout handler
  async checkout(event) {
    const user = await this.stripe.getUser();

    return new Promise((resolve, reject) => {
      const handler = StripeCheckout.configure({
        key: environment.stripe.key,
        locale: 'es',
        currency: 'mxn',
        allowRememberMe: false,
        source: async (source) => {
          try {
            this.loading = true;
            this.confirmation = await this.stripe.attachSource(source.id).toPromise();
            resolve(this.confirmation);
          } catch (error) {
            reject(error);
          } finally {
            this.loading = false;
          }
        }
      });

      handler.open({
        name: 'Registro de tarjeta',
        description: 'Ingrese los datos su tarjeta',
        email: user.email,
        panelLabel: 'Agregar Tarjeta'
      });
      event.preventDefault();
    });
  }

  async openSubscribePopUp(cards: any[]): Promise<void> {
    const dialogRef = this.dialog.open(SubscribePopupComponent, {
      width: '400px',
      data: { cards }
    });

    const success = await dialogRef.afterClosed().toPromise();
    if (success) {
      this.toastr.success('Se ha actualizado su plan', 'Actualización');
    }
  }

}
