import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxLoadingModule } from 'ngx-loading';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MaterialModule } from '../material.module';
import { CardComponent } from './card/card.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { DeleteImageComponent } from './delete-image/delete-image.component';
import { DropzoneComponent } from './dropzone/dropzone.component';
import { LoadingOverlayComponent } from './loading-overlay/loading-overlay.component';
import { NavbarComponent } from './navbar/navbar.component';
import { NoCardPopupComponent } from './no-card-popup/no-card-popup.component';
import { PopupComponent } from './popup/popup.component';
import { SelectCardComponent } from './select-card/select-card.component';
import { SubscribePopupComponent } from './subscribe-popup/subscribe-popup.component';
import { SelectPlanComponent } from './select-plan/select-plan.component';

@NgModule({
  declarations: [
    NavbarComponent,
    CardComponent,
    PopupComponent,
    SelectCardComponent,
    CheckoutComponent,
    DropzoneComponent,
    DeleteImageComponent,
    NoCardPopupComponent,
    SubscribePopupComponent,
    LoadingOverlayComponent,
    SelectPlanComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    NgxDropzoneModule,
    NgxLoadingModule,
  ],
  exports: [
    NavbarComponent,
    CardComponent,
    PopupComponent,
    CheckoutComponent,
    SelectCardComponent,
    DropzoneComponent,
    NgxLoadingModule,
    LoadingOverlayComponent
  ]
})
export class SharedModule { }
