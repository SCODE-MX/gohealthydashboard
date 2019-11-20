import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';


const routes: Routes = [
  { path: 'dashboard', loadChildren : () => import('../../views/dashboard/dashboard.module').then(m => m.DashboardModule)},
  { path: '', redirectTo: 'dashboard' },
];
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class AdminLayoutModule { }
