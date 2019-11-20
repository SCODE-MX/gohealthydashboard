import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { CardComponent } from './card/card.component';
import { PopupComponent } from './popup/popup.component';
import { MaterialModule } from '../material.module';



@NgModule({
  declarations: [NavbarComponent, CardComponent, PopupComponent],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    NavbarComponent,
    CardComponent,
    PopupComponent
  ]
})
export class SharedModule { }
