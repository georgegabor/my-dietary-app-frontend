import { Component } from '@angular/core'
import { FormArray, FormBuilder, Validators } from '@angular/forms'

@Component({
  selector: 'app-form2',
  templateUrl: './form2.component.html',
  styleUrls: ['./form2.component.scss'],
})
export class Form2Component {
  form = this.fb.group({
    lessons: this.fb.array([]),
  })

  constructor(private fb: FormBuilder) {}

  get lessons() {
    return this.form.controls['lessons'] as FormArray
  }

  addLesson() {
    const lessonForm = this.fb.group({
      title: ['', Validators.required],
      level: ['beginner', Validators.required],
    })
    this.lessons.push(lessonForm)
  }

  deleteLesson(lessonIndex: number) {
    this.lessons.removeAt(lessonIndex)
  }
}
