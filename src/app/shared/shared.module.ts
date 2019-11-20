import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { CardComponent } from './card/card.component';
import { PopupComponent } from './popup/popup.component';



@NgModule({
  declarations: [NavbarComponent, CardComponent, PopupComponent],
  imports: [
    CommonModule
  ],
  exports:[
    NavbarComponent,
    CardComponent,
    PopupComponent
  ]
})
export class SharedModule { }
