import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Food } from './../model/Food';
import { FoodService } from './../service/food.service';

@Component({
  selector: 'app-food',
  templateUrl: './food-list.component.html',
  styleUrls: ['./food-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FoodListComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  subscription = new Subscription();
  dataSource = new MatTableDataSource<Food>([]);

  displayedColumns = [
    'name',
    'energyInKcal',
    'totalFat',
    'saturatedFat',
    'totalCarbohydrate',
    'sugar',
    'protein',
    'salt',
  ];

  tables = [0];
  constructor(
    private readonly foodService: FoodService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.subscription = this.foodService.foodList$.subscribe((res: Food[]) => {
      this.dataSource.data = res;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  add() {
    this.router.navigate(['add'], { relativeTo: this.route });
  }
}
