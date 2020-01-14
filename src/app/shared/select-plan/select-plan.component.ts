import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-select-plan',
  templateUrl: './select-plan.component.html',
  styleUrls: ['./select-plan.component.scss']
})
export class SelectPlanComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<SelectPlanComponent>,
  ) { }

  ngOnInit() {
  }

  public close() {
    this.dialogRef.close('Closed');
  }

}
