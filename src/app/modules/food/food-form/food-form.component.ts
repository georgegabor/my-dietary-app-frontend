import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-food-form',
  templateUrl: './food-form.component.html',
  styleUrls: ['./food-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FoodFormComponent implements OnInit {
  foodForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.foodForm = this.fb.group({
      name: ['', Validators.required],
      energyInKcal: ['', [Validators.required, Validators.min(0)]],
      totalFat: ['', [Validators.required, Validators.min(0)]],
      saturatedFat: ['', [Validators.required, Validators.min(0)]],
      totalCarbohydrate: ['', [Validators.required, Validators.min(0)]],
      sugar: ['', [Validators.required, Validators.min(0)]],
      protein: ['', [Validators.required, Validators.min(0)]],
      salt: ['', [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit() {}

  onSubmit(form: FormGroup) {
    console.log('form: ', form.value);
  }

  getErrorMessage(controlName: string): string {
    if (this.foodForm.controls[controlName].hasError('required')) {
      return 'Field required';
    } else if (this.foodForm.controls[controlName].hasError('min')) {
      return 'Can not be negative';
    } else return '';
  }

  get name() {
    return this.foodForm.get('name');
  }

  get energyInKcal() {
    return this.foodForm.get('energyInKcal')?.value;
  }

  get totalFat() {
    return this.foodForm.get('totalFat')?.value;
  }

  get saturatedFat() {
    return this.foodForm.get('saturatedFat')?.value;
  }

  get totalCarbohydrate() {
    return this.foodForm.get('totalCarbohydrate')?.value;
  }

  get sugar() {
    return this.foodForm.get('sugar')?.value;
  }

  get protein() {
    return this.foodForm.get('protein')?.value;
  }

  get salt() {
    return this.foodForm.get('salt')?.value;
  }
}
