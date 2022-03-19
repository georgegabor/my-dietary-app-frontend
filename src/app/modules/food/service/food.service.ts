import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Food } from '../model/Food';

const FOOD_URL = 'http://localhost:8080/foods';

@Injectable({
  providedIn: 'root',
})
export class FoodService {
  constructor(private readonly http: HttpClient) {}

  foodList$: Observable<Food[]> = this.http.get<Food[]>(FOOD_URL);

  create(food: Food) {
    this.http.post<Food>(FOOD_URL, food).subscribe();
  }
}
