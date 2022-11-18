import { Component, EventEmitter, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { NostroAccountFilter } from '../../../models/nostro-account-filter';

@Component({
  selector: 'app-nostroaccount-filter-form',
  templateUrl: './nostroaccount-filter-form.component.html',
  styleUrls: ['./nostroaccount-filter-form.component.scss'],
})
export class NostroaccountFilterFormComponent {
  @Output() submitClicked = new EventEmitter<NostroAccountFilter>();

  nostroAccountFilterForm: FormGroup = new FormGroup({
    bbgCode: new FormControl('', Validators.maxLength(20)),
    cpty: new FormControl('', Validators.maxLength(20)),
    secAcc: new FormControl('', Validators.maxLength(20)),
  });

  constructor() {}

  onSubmit() {
    if (this.nostroAccountFilterForm.invalid) {
      const error = this.getFormValidationErrors(this.nostroAccountFilterForm.controls);
      console.log('errors: ' + JSON.stringify(error));
    }

    this.submitClicked.emit(this.nostroAccountFilterForm.value);
  }

  onReset() {
    this.nostroAccountFilterForm.reset();
  }

  clearField(fieldName: string) {
    // this.nostroAccountFilterForm.get(fieldName).reset();
  }

  getFormValidationErrors(controls: { [x: string]: AbstractControl | { errors: ValidationErrors } }) {
    let errors: any[] = [];
    Object.keys(controls).forEach((key) => {
      const control = controls[key];
      if (control instanceof FormGroup) {
        errors = errors.concat(this.getFormValidationErrors(control.controls));
      }
      const controlErrors: ValidationErrors | null = controls[key].errors;
      if (controlErrors !== null) {
        Object.keys(controlErrors).forEach((keyError) => {
          errors.push({
            control_name: key,
            error_name: keyError,
            error_value: controlErrors[keyError],
          });
        });
      }
    });
    return errors;
  }
}
