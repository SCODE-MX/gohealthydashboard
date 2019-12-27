import { AuthService } from 'src/app/auth/auth.service';
import { DatabaseService } from 'src/app/services/database.service';
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
  public loading;

  constructor(
    private db: DatabaseService,
    public dialogRef: MatDialogRef<PopupComponent>,
    public auth: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private stripe: StripeService,
  ) {
    this.user = this.stripe.user$;
  }

  public async onCancelSubscription(subscriptionId: string) {
    this.loading = true;
    const success = await this.stripe.cancelSubscription(subscriptionId);
    this.loading = false;
    if (!success) {
      alert('Something went wrong, please try again');
    }
    this.dialogRef.close('cancelPlan');
  }

}
