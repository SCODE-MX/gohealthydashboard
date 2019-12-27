import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { DetalleComponent } from '../detalle/detalle.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RequestComponent } from './request/request.component';
import { MaterialModule } from '../../material.module';
import { HttpClientModule } from '@angular/common/http';


const routes: Routes = [
  { path: '', component:  DashboardComponent},
  { path: 'detalle/:estado/:id', component:  DetalleComponent},
];
@NgModule({
  declarations: [DashboardComponent, DetalleComponent, RequestComponent],

  imports: [
    CommonModule,
    SharedModule,
    NgxChartsModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    HttpClientModule
  ],

  exports: [
    SharedModule,
    NgxChartsModule,
    ReactiveFormsModule,
    FormsModule
  ],
  entryComponents: [
    RequestComponent
  ]
})
export class DashboardModule { }
