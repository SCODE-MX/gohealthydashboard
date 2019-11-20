import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
import { take, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminGuardService implements CanActivate {

  constructor(private authService: AuthService) { }
  canActivate() {
    return this.authService.user.pipe(
     take(1),
      map(user => {
        console.log('admin guard', {validation: !!user, user});
        return  !!user[0];
      }),
      );
  }
}
