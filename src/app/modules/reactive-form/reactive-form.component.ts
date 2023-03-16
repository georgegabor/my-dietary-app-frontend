import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { combineLatest, map, Observable, share } from 'rxjs';
import { ajax } from 'rxjs/ajax';

@Component({
  selector: 'app-reactive-form',
  templateUrl: './reactive-form.component.html',
  styleUrls: ['./reactive-form.component.scss'],
})
export class ReactiveFormComponent {
  constructor(private fb: FormBuilder) {}

  post$ = ajax.getJSON('https://api.github.com/users/google').pipe(share());
  keys$: Observable<any[]> = this.post$.pipe(map((post) => Object.keys(post)));
  form$: Observable<FormGroup> = this.post$.pipe(map((post) => this.fb.group(post)));

  vm$: Observable<any> = combineLatest({
    form: this.form$,
    keys: this.keys$,
  });

  onSubmit(form: FormGroup) {
    console.log(form.getRawValue());
  }
}
