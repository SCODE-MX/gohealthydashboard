import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { CardComponent } from './card/card.component';
import { MaterialModule } from '../material.module';
import { DropzoneComponent } from './dropzone/dropzone.component';
import { DeleteImageComponent } from './delete-image/delete-image.component';



@NgModule({
  declarations: [NavbarComponent, CardComponent, DropzoneComponent, DeleteImageComponent],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    NavbarComponent,
    CardComponent,
    DropzoneComponent,
  ]
})
export class SharedModule { }
