import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveFormService } from './reactive-form.service';

export const gameSize = 5;
const createGameObject = (x, y) => ({ x, y });

// Partial application and Currying
const add = (a: number) => (b: number) => a + b;
const ten = add(5)(5);
const add10 = add(10);
const result = add10(5);

// Function composition
enum Gender {
  Female = 'Female',
  Male = 'Male',
  Other = 'Other',
}

interface Student {
  name: string;
  lastName: string;
  gender: Gender;
  university: string;
}

const students: Student[] = [
  {
    name: 'Sue',
    lastName: 'Mary',
    gender: Gender.Female,
    university: 'Union College',
  },
  {
    name: 'Suzan',
    lastName: 'Proty',
    gender: Gender.Female,
    university: 'Union College',
  },
  {
    name: 'Abbie',
    lastName: 'Hughes',
    gender: Gender.Female,
    university: 'Union College',
  },
  {
    name: 'Sue',
    lastName: 'Mary',
    gender: Gender.Other,
    university: 'Union College',
  },
];

const select =
  <T, K extends keyof T & string = any>(key: keyof T, value: T[K]) =>
  (obj: T) =>
    obj[key] === value;

const isWoman = select<Student>('gender', Gender.Female);
const isFromUnionCollege = select<Student>('university', 'Union College');

const selectWomenFrom = (students: Array<Student>) => students.filter(isWoman);
const selectFromUnionCollege = (students: Array<Student>) => students.filter(isFromUnionCollege);

const womenAndFromUnionCollege = selectWomenFrom(students).filter(isFromUnionCollege);
const fromUnionCollegeAndWoman = selectFromUnionCollege(students).filter(isWoman);
const sameOnlyWithFilter = students.filter(isWoman).filter(isFromUnionCollege);

@Component({
  selector: 'app-reactive-form',
  templateUrl: './reactive-form.component.html',
  styleUrls: ['./reactive-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReactiveFormComponent {
  constructor(private fb: FormBuilder, public formService: ReactiveFormService) {
    // console.log(result);
    // console.log(womenAndFromUnionCollege);
    // console.log(fromUnionCollegeAndWoman);
    // console.log(sameOnlyWithFilter);

    formService.getPosts();
  }

  onSubmit(form: FormGroup) {
    console.log(form.getRawValue());
  }

  onInputChange(control: string, form: FormGroup) {
    console.log(form.get(control).value);
    this.formService.setFormValue(control, form.get(control).value);
  }

  // generateFirst$ = generate({
  //   initialState: 1,
  //   condition: (x) => x < 8,
  //   iterate: (x) => x + 1,
  //   resultSelector: () => 2,
  //   scheduler: asyncScheduler,
  // });

  // generateSecond$ = (r) =>
  //   generate({
  //     initialState: r % 2 === 0 ? 1 : 0,
  //     condition: (x) => x < gameSize,
  //     iterate: (x) => x + 2,
  //   }).pipe(map((c) => createGameObject(r, c)));

  // bricks$ = this.generateFirst$.pipe(
  //   mergeMap(this.generateSecond$)
  //   // toArray()
  // );
  // .subscribe(console.log);
}
