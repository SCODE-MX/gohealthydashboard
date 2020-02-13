import { Plan } from './plan.interface';

export interface StripeUser {
    id: string;
    plan: Plan;
    status: string;
    subscriptionId: string;
    usedSlots: number;
    availableSlots: number;
}
