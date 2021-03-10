import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CustomValidationService {

  validateMoney(control: AbstractControl): { [key: string]: any } | null {
    const errorMessage = 'Only Number';
    if (control.value.length == 0) return null

    const regexPattern = /\-?\d*\.?\d/;
    const valid = regexPattern.test(control.value);
    return valid ? null : { invalidPassword: true, message: errorMessage };
  }
}
