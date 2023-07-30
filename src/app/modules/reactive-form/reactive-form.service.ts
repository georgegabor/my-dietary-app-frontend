import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ajax } from 'rxjs/ajax';

class ReactiveForm {
  form: FormGroup;
  keys: string[];
}

const initialReactiveForm: ReactiveForm = {
  form: new FormGroup({}),
  keys: [],
};
@Injectable({
  providedIn: 'root',
})
export class ReactiveFormService {
  formSub$ = new BehaviorSubject<ReactiveForm>(initialReactiveForm);
  form: FormGroup = this.fb.group({});
  keys: string[] = [];

  constructor(private fb: FormBuilder) {}

  post$ = ajax.getJSON('https://api.github.com/users/google');

  getPosts() {
    this.post$.subscribe((post) => {
      this.form = this.fb.group(post);
      this.keys = Object.keys(post);

      this.formSub$.next({
        form: this.form,
        keys: this.keys,
      });
    });
  }

  setFormValue(field: string, value: string | number) {
    this.form.get(field).patchValue(value);
  }
}
