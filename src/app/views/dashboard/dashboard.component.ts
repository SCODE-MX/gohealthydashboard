import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { IUser } from '../../models/interfaces/general.interfaces';
import { Observable } from 'rxjs';
import { DatabaseService } from '../../services/database.service';
import { take } from 'rxjs/operators';
import { normalizeString } from '../../models/functions/general.functions';
import { MatDialog } from '@angular/material';
import { RequestComponent } from './request/request.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  // providers: [HttpClient]
})
export class DashboardComponent implements OnInit {

  userInfo: IUser;
  places: any;
  endpoint: 'https://laFuncionChida';

  constructor(public auth: AuthService,
    private database: DatabaseService,
    public dialog: MatDialog,
    private http: HttpClient
    ) {}

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
  openRequest() {
    console.log('open request code');
    this.openDialog().then(result => {
      if (result) {
        console.log('from dialog', {result}, this.userInfo);
        const data = {...this.userInfo, ...result};
        console.log({data});
        // this.http.post(this.endpoint, data).subscribe();
      }
    });
  }
  openDialog(): Promise<any> {
    const options = { width: '50%', height: '70%', hasBackdrop: true };
    const dialogRef = this.dialog.open(RequestComponent, options);
    return dialogRef.afterClosed().toPromise();
  }
}
