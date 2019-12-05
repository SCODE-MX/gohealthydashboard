import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-no-card-popup',
  templateUrl: './no-card-popup.component.html',
  styleUrls: ['./no-card-popup.component.scss']
})
export class NoCardPopupComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<NoCardPopupComponent>,
    ) { }

  ngOnInit() {
  }

}
