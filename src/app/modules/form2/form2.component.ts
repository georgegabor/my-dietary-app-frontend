import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ReactiveFormService } from '../reactive-form/reactive-form.service';

@Component({
  selector: 'app-form2',
  templateUrl: './form2.component.html',
  styleUrls: ['./form2.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Form2Component implements OnInit {
  constructor(public formService: ReactiveFormService) {}

  ngOnInit(): void {}

  onSubmit(form: FormGroup) {
    console.log(form.getRawValue());
  }

  onInputChange(control: string, form: FormGroup, keys: string[]) {
    this.formService.setFormValue(control, form, keys);
  }
}
