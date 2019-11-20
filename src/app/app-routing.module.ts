import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { AdminGuardService } from './auth/admin-guard.service';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

const routes: Routes = [
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
    },
    {
      path: '',
      component: AdminLayoutComponent,
      canActivate: [AdminGuardService],
      children: [
        {
          path: '',
          loadChildren: () => import('../app/layouts/admin-layout/admin-layout.module').then(m => m.AdminLayoutModule)
        }
      ]
    }, {
      path: '',
      component: AuthLayoutComponent,
      children: [
        {
          path: '',
          loadChildren: () => import('../app/layouts//auth-layout/auth-layout.module').then(m => m.AuthLayoutModule)
        }
      ]
    },
    {
      path: '**',
      redirectTo: 'dashboard'
    }
  ];


@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
