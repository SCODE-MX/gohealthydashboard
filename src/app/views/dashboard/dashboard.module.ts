import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { DetalleComponent } from '../detalle/detalle.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';


const routes: Routes = [
  { path: '', component:  DashboardComponent},
  { path: 'detalle/:estado/:id', component:  DetalleComponent},
];
@NgModule({
  declarations: [DashboardComponent, DetalleComponent],

  imports: [
    CommonModule,
    SharedModule,
    NgxChartsModule,
    RouterModule.forChild(routes)
  ],

  exports: [
    SharedModule,
    NgxChartsModule,
  ],
})
export class DashboardModule { }
