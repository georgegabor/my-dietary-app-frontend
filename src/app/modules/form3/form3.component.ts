import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper'
import { Component } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

@Component({
  selector: 'app-form3',
  templateUrl: './form3.component.html',
  styleUrls: ['./form3.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
})
export class Form3Component {
  firstFormGroup: FormGroup
  secondFormGroup: FormGroup

  constructor(private _formBuilder: FormBuilder) {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
    })
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required],
    })
  }
}
