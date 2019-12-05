import { NgxDropzoneModule } from 'ngx-dropzone';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MaterialModule } from '../material.module';
import { CardComponent } from './card/card.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { DeleteImageComponent } from './delete-image/delete-image.component';
import { DropzoneComponent } from './dropzone/dropzone.component';
import { NavbarComponent } from './navbar/navbar.component';
import { PopupComponent } from './popup/popup.component';
import { SelectCardComponent } from './select-card/select-card.component';

@NgModule({
  declarations: [
    NavbarComponent,
    CardComponent,
    PopupComponent,
    SelectCardComponent,
    CheckoutComponent,
    DropzoneComponent,
    DeleteImageComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    NgxDropzoneModule
  ],
  exports: [
    NavbarComponent,
    CardComponent,
    PopupComponent,
    CheckoutComponent,
    SelectCardComponent,
    DropzoneComponent
  ]
})
export class SharedModule { }
