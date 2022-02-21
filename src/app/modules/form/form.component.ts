import { Component, OnInit } from '@angular/core'
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms'
import { BehaviorSubject } from 'rxjs'

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  carboValue$ = new BehaviorSubject<number>(0)

  myForm: FormGroup
  lessonForm = this.fb.group({
    ingredient: '',
    amount: '',
  })

  ingredients: any[] = [
    { name: 'Bulgur', carbo: 20 },
    { name: 'Potato', carbo: 17 },
    { name: 'Rice', carbo: 20 },
    { name: 'Falafel', carbo: 23 },
    { name: 'Steamed Vegetables', carbo: 10 },
    { name: 'Protein', carbo: 1.5 },
    { name: 'Actimel Zero', carbo: 3.6 },
    { name: 'Smoothie', carbo: 11.0 },
    { name: 'Mixed Frozen Fruit', carbo: 10.0 },
  ]

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
      message: ['', [Validators.required, Validators.minLength(10)]],
      team: [''],
      address: this.fb.group({
        street: [''],
        city: [''],
        state: [''],
        zip: [''],
      }),
      aliases: this.fb.array([]),
    })
  }

  ngOnInit() {
    this.myForm.get('aliases')?.valueChanges.subscribe((x) => {
      console.log('valueChanges: ' + JSON.stringify(x))
      let v = this.myForm.get('aliases')?.value
      console.log('v: ' + JSON.stringify(v))
      let am = 0
      for (var i of v) {
        console.log('i.ingredient?.carbo: ' + i.ingredient?.carbo)
        console.log('i?.amount: ' + i?.amount)
        if (i.ingredient?.carbo !== undefined && i?.amount !== null) {
          am += i.ingredient?.carbo * (i?.amount / 100)
        }
      }
      this.carboValue$.next(am)
    })
  }

  onSubmit(form: FormGroup) {
    console.log('onSubmit')
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
    const form = this.fb.group({
      ingredient: '',
      amount: '',
    })
    this.aliases.push(form)
  }

  deleteAlias(index: number) {
    this.aliases.removeAt(index)
  }
}
