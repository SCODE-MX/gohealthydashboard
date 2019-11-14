import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { IUser } from '../../models/interfaces/general.interfaces';
import { Observable } from 'rxjs';
import { DatabaseService } from '../../services/database.service';
import { take } from 'rxjs/operators';
import { normalizeString } from '../../models/functions/general.functions';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  userInfo: IUser;
  places: any;

  constructor(public auth: AuthService,
    private database: DatabaseService) {}

  ngOnInit() {
    console.log('this is dashboard');
    // this.userInfo = this.auth.user;
    this.auth.user.pipe(take(1)).subscribe(data => {
      console.log('from dash', {data: data[0]});
      this.userInfo = data[0];
      this.database.getPlaces(normalizeString(this.userInfo.estado), this.userInfo.id).pipe(take(1)).subscribe(places => {
        console.log('places in dash', places);
        this.places = places;
      });
    });
  }

}
