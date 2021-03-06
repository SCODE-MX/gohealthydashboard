import { ToastrService } from 'ngx-toastr';
import { reject } from 'q';
import { first } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { Plan } from 'src/app/models/interfaces/plan.interface';
import { StripeService } from 'src/app/services/stripe.service';
import { environment } from 'src/environments/environment';

import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { NoCardPopupComponent } from '../no-card-popup/no-card-popup.component';
import { PopupComponent } from '../popup/popup.component';
import { SelectPlanComponent } from '../select-plan/select-plan.component';
import { SubscribePopupComponent } from '../subscribe-popup/subscribe-popup.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public name: string;
  public loading = false;
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

    if (result === 'changePlan') {
      const selectedPlan = await this.openSelectPlanPopUp();

      if (!selectedPlan) {
        return;
      }

      this.loading = true;
      let cards = await this.stripe.getSources().pipe(first()).toPromise();
      this.loading = false;

      if (cards.length === 0) {
        const customer = await this.openNoCardPopUp(event);
        if (!customer) {
          return;
        }
        cards = customer.sources.data;
      }

      await this.openSubscribePopUp(cards, selectedPlan);

    } else if (result === 'cancelPlan') {
      this.toastr.success('Su plan ha sido cancelado', 'Actualización');
    }

  }

  async openSelectPlanPopUp(): Promise<any> {
    const dialogRef = this.dialog.open(SelectPlanComponent, {
      width: '400px',
      data: { }
    });
    const result = await dialogRef.afterClosed().toPromise();
    return result;
  }

  async openNoCardPopUp(event): Promise<any> {
    const dialogRef = this.dialog.open(NoCardPopupComponent, {
      width: '400px',
      data: { }
    });

    const result = await dialogRef.afterClosed().toPromise();

    if (result === 'addCard') {
      try {
        const customer = await this.checkout(event);
        return customer;
      } catch (error) {
        // Something went wrong while adding card.
        return false;
      }
    }
    return false;
  }

  // Open the checkout handler
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

  private async openSubscribePopUp(cards: any[], plan: Plan): Promise<void> {
    const dialogRef = this.dialog.open(SubscribePopupComponent, {
      width: '400px',
      data: { cards, plan }
    });

    const success = await dialogRef.afterClosed().toPromise();
    if (success) {
      this.toastr.success('Se ha actualizado su plan', 'Actualización');
    }
  }

  // Close on navigate
  @HostListener('window:popstate')
  onPopState() {
    this.handler.close();
  }

}
