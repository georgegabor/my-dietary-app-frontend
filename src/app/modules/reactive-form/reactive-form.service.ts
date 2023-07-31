import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, Subject, map, merge, share } from 'rxjs';
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
  setNewValue$ = new Subject<ReactiveForm>();

  constructor(private fb: FormBuilder) {}

  post$ = ajax.getJSON('https://api.github.com/users/google').pipe(
    map((post) => ({
      form: this.fb.group(post),
      keys: Object.keys(post),
    }))
  );

  form$: Observable<ReactiveForm> = merge(this.post$, this.setNewValue$).pipe(share());

  setFormValue(field: string, form: FormGroup, keys: string[]) {
    form.get(field).patchValue(form.get(field).value);

    this.setNewValue$.next({
      form: form,
      keys: keys,
    });
  }
}
