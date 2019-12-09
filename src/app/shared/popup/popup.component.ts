import { StripeService } from 'src/app/services/stripe.service';

import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface DialogData {
  animal: string;
  name: string;
}
@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent {
  public user;
  public something;

  constructor(
    public dialogRef: MatDialogRef<PopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private stripe: StripeService,
  ) {
    this.user = this.stripe.user$;
  }

  public onCancelSubscription = async (subscriptionId: string) => this.stripe.cancelSubscription(subscriptionId);

}
