import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-food-form',
  templateUrl: './food-form.component.html',
  styleUrls: ['./food-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FoodFormComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
