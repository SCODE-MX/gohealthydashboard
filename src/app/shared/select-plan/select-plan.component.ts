import { Plan } from 'src/app/models/interfaces/plan.interface';

import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-select-plan',
  templateUrl: './select-plan.component.html',
  styleUrls: ['./select-plan.component.scss']
})
export class SelectPlanComponent {

  private plans: Plan[] = [
    {
      id: 'plan_GY3WrNTWwexCrr',
      name: 'BÁSICO',
      cost: 14999,
      slots: 1,
    },
    {
      id: 'plan_FmpGElUUFBzVry',
      name: 'ESTÁNDAR',
      cost: 19999,
      slots: 2,
    },
    {
      id: 'plan_GY3ZMpHPklRgq0',
      name: 'PREMIUM',
      cost: 24999,
      slots: 5,
    },
  ];
  private selectedPlan: Plan;

  constructor(
    public dialogRef: MatDialogRef<SelectPlanComponent>,
  ) { }

  public onSelectPlanButtonClick() {
    if (!this.selectedPlan) {
      alert('Por favor seleccione un plan');
      return;
    }

    this.dialogRef.close(this.selectedPlan);
  }

}
