import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { CardComponent } from './card/card.component';
import { MaterialModule } from '../material.module';
import { DropzoneComponent } from './dropzone/dropzone.component';
import { DeleteImageComponent } from './delete-image/delete-image.component';
import { NgxDropzoneModule } from 'ngx-dropzone';

@NgModule({
  declarations: [NavbarComponent, CardComponent, DropzoneComponent, DeleteImageComponent],
  imports: [
    CommonModule,
    MaterialModule,
    NgxDropzoneModule
  ],
  exports: [
    NavbarComponent,
    CardComponent,
    DropzoneComponent,
  ]
})
export class SharedModule { }
