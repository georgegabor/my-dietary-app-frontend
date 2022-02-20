import { Component, OnInit } from '@angular/core'
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms'

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  myForm: FormGroup

  teams: any[] = [
    { name: 'Liverpool' },
    { name: 'Manchester City' },
    { name: 'Manchester United' },
    { name: 'Arsenal' },
    { name: 'Leicester City' },
    { name: 'Chelsea' },
    { name: 'Tottenham Hotspur' },
  ]

  constructor(private fb: FormBuilder) {
    this.myForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(15)]],
      team: [''],
      address: this.fb.group({
        street: [''],
        city: [''],
        state: [''],
        zip: [''],
      }),
      aliases: this.fb.array([this.fb.control('')]),
    })
  }

  ngOnInit() {}

  onSubmit(form: FormGroup) {
    console.log('Valid?', form.valid) // true or false
    console.log('Name', form.value.name)
    console.log('Email', form.value.email)
    console.log('Message', form.value.message)
    console.log('Team', form.value.team)
    console.log('Address', form.value.address)
    console.log('Aliases', form.value.aliases)
  }

  addName() {
    this.myForm.get('name')?.setValue('Sammy')
  }

  addEmail() {
    this.myForm.get('email')?.setValue('sammy@email.com')
  }

  addMessage() {
    this.myForm.get('message')?.setValue('Sammy has a long message for you')
  }

  likeClicked() {
    window.alert('likeClicked')
  }

  shareClicked() {
    window.alert('shareClicked')
  }

  get aliases() {
    return this.myForm.get('aliases') as FormArray
  }

  addAlias() {
    this.aliases.push(this.fb.control(''))
  }
}
