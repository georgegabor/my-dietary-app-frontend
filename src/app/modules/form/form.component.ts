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

  date = new Date()

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

  constructor(private fb: FormBuilder) {
    this.myForm = this.fb.group({
      type: ['', Validators.required],
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
    console.log('type', form.value.type)
    console.log('Aliases', form.value.aliases)
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
