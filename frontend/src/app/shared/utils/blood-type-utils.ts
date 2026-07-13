import type { BloodType } from '@/app/shared/models/donor.model';

export const BLOOD_TYPE_NAMES: Record<BloodType, string> = {
  A_POSITIVE: 'A+',
  A_NEGATIVE: 'A-',
  B_POSITIVE: 'B+',
  B_NEGATIVE: 'B-',
  AB_POSITIVE: 'AB+',
  AB_NEGATIVE: 'AB-',
  O_POSITIVE: 'O+',
  O_NEGATIVE: 'O-',
  UNKNOWN: 'Unknown',
};

export const BLOOD_TYPE_COMPATIBILITY: Record<string, string[]> = {
  O_NEGATIVE: ['O_NEGATIVE'],
  O_POSITIVE: ['O_NEGATIVE', 'O_POSITIVE'],
  A_NEGATIVE: ['A_NEGATIVE', 'A_POSITIVE', 'AB_NEGATIVE', 'AB_POSITIVE'],
  A_POSITIVE: ['A_POSITIVE', 'AB_POSITIVE'],
  B_NEGATIVE: ['B_NEGATIVE', 'B_POSITIVE', 'AB_NEGATIVE', 'AB_POSITIVE'],
  B_POSITIVE: ['B_POSITIVE', 'AB_POSITIVE'],
  AB_NEGATIVE: ['AB_NEGATIVE', 'AB_POSITIVE'],
  AB_POSITIVE: ['AB_POSITIVE'],
};

export function canDonateTo(donor: BloodType, recipient: BloodType): boolean {
  return BLOOD_TYPE_COMPATIBILITY[donor]?.includes(recipient) ?? false;
}

export function isRareBloodType(type: BloodType): boolean {
  return type === 'O_NEGATIVE' || type === 'O_POSITIVE';
}

export function formatBloodType(type: BloodType): string {
  return BLOOD_TYPE_NAMES[type] ?? type;
}
