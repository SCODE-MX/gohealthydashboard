import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MaterialModule } from '../material.module';
import { CardComponent } from './card/card.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { NavbarComponent } from './navbar/navbar.component';
import { PopupComponent } from './popup/popup.component';
import { SelectCardComponent } from './select-card/select-card.component';

@NgModule({
  declarations: [
    NavbarComponent,
    CardComponent,
    PopupComponent,
    SelectCardComponent,
    CheckoutComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule
  ],
  exports: [
    NavbarComponent,
    CardComponent,
    PopupComponent,
    CheckoutComponent,
    SelectCardComponent
  ]
})
export class SharedModule { }
