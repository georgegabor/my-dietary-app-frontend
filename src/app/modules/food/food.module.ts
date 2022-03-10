import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FoodFormComponent } from './food-form/food-form.component'
import { FoodListComponent } from './food-list/food-list.component'

const COMPONENTS = [FoodListComponent, FoodFormComponent]

@NgModule({
  imports: [CommonModule],
  exports: [COMPONENTS],
  declarations: [COMPONENTS],
})
export class FoodModule {}
