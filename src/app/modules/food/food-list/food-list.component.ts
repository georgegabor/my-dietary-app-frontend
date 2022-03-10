import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Food } from './../model/Food';
import { FoodService } from './../service/food.service';

@Component({
  selector: 'app-food',
  templateUrl: './food-list.component.html',
  styleUrls: ['./food-list.component.scss'],
})
export class FoodListComponent implements OnInit, OnDestroy {
  subscription = new Subscription();
  constructor(private readonly foodService: FoodService) {}

  ngOnInit() {
    this.subscription = this.foodService.foodList$.subscribe((res: Food[]) => {
      console.log(res);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
