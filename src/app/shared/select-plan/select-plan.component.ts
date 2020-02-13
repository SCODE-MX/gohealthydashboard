import { map } from 'rxjs/operators';
import { Plan } from 'src/app/models/interfaces/plan.interface';
import { StripeService } from 'src/app/services/stripe.service';

import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-select-plan',
  templateUrl: './select-plan.component.html',
  styleUrls: ['./select-plan.component.scss']
})
export class SelectPlanComponent {
  private plans: Plan[];
  public loading = false;
  private selectedPlan: Plan;

  constructor(
    private stripeService: StripeService,
    public dialogRef: MatDialogRef<SelectPlanComponent>,
  ) {

    this.loading = true;

    stripeService.getPlans().pipe(
      map(plans => plans.sort((a, b) => a.slots - b.slots))
    ).toPromise()
    .then(plans => {
      this.plans = plans;
      this.loading = false;
    });

  }

  public onSelectPlanButtonClick() {
    if (!this.selectedPlan) {
      alert('Por favor seleccione un plan');
      return;
    }

    this.dialogRef.close(this.selectedPlan);
  }

}
