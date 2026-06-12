import { type AbstractControl, FormControl, FormGroup, Validators, type ValidatorFn } from '@angular/forms';
import { z } from 'zod';

function zodToValidators(schema: z.ZodType): ValidatorFn[] {
  const validators: ValidatorFn[] = [];

  if (schema instanceof z.ZodString) {
    const minCheck = (schema._def as any).checks?.find((c: { kind: string }) => c.kind === 'min');
    const maxCheck = (schema._def as any).checks?.find((c: { kind: string }) => c.kind === 'max');
    if (minCheck) validators.push(Validators.minLength(minCheck.value));
    if (maxCheck) validators.push(Validators.maxLength(maxCheck.value));
    if (schema.isNullable?.() === false && !schema.isOptional?.()) validators.push(Validators.required);
  }

  if (schema instanceof z.ZodNumber) {
    const minCheck = (schema._def as any).checks?.find((c: { kind: string }) => c.kind === 'min');
    const maxCheck = (schema._def as any).checks?.find((c: { kind: string }) => c.kind === 'max');
    if (minCheck) validators.push(Validators.min(minCheck.value));
    if (maxCheck) validators.push(Validators.max(maxCheck.value));
  }

  if (schema instanceof z.ZodEnum) {
    validators.push(Validators.required);
  }

  return validators;
}

export function formControlFor(schema: z.ZodType, defaultValue: unknown = ''): FormControl {
  const validators = zodToValidators(schema);

  const isRequired = schema.isNullable?.() === false
    && schema.isOptional?.() === false
    && !(schema instanceof z.ZodDefault);

  return new FormControl(
    { value: defaultValue, disabled: false },
    { nonNullable: isRequired, validators: validators.length > 0 ? Validators.compose(validators) ?? undefined : undefined },
  );
}

function getDefaultValue(schema: z.ZodType): unknown {
  if (schema instanceof z.ZodString) return '';
  if (schema instanceof z.ZodNumber) return null;
  if (schema instanceof z.ZodBoolean) return false;
  if (schema instanceof z.ZodEnum) return null;
  if (schema instanceof z.ZodNullable) return null;
  if (schema instanceof z.ZodOptional) return undefined;
  if (schema instanceof z.ZodDefault) return (schema._def as any).defaultValue();
  if (schema instanceof z.ZodArray) return [];
  return null;
}

export function zodToFormGroup<T extends Record<string, z.ZodType>>(
  shape: T,
): FormGroup {
  const controls: Record<string, AbstractControl> = {};

  for (const [key, def] of Object.entries(shape)) {
    controls[key] = formControlFor(def as z.ZodType, getDefaultValue(def as z.ZodType));
  }

  return new FormGroup(controls);
}
