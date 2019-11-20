import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { DetalleComponent } from '../detalle/detalle.component';

const routes: Routes = [
  { path: '', component:  DashboardComponent},
  { path: 'detalle', component:  DetalleComponent},
];
@NgModule({
  declarations: [DashboardComponent, DetalleComponent],

  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class DashboardModule { }
