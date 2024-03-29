import { mapTo } from 'rxjs/operators';
import { Subject, tap, merge } from 'rxjs';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { User, UserFacadeService, UserState } from './user-facade.service';

/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
  selector: 'table-overview-example',
  styleUrls: ['table.component.scss'],
  templateUrl: 'table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'progress', 'fruit'];
  dataSource = new MatTableDataSource<User>();
  users: User[] = [];
  pageSize!: number;
  pageIndex = 0;

  createClick$ = new Subject<void>();
  editClick$ = new Subject<void>();
  cancelClick$ = new Subject<void>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  @ViewChild(MatTable) table!: MatTable<any>;

  constructor(
    public readonly userFacadeService: UserFacadeService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) {}

  appLogic = (state: UserState) => {
    this.pageSize = state.pagination.pageSize;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.data = state.users;

    this.paginator.page.next({
      pageIndex: this.paginator.pageIndex,
      pageSize: (this.paginator.pageSize = this.pageSize),
      length: this.paginator.length,
    });
  };

  ngOnInit(): void {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.userFacadeService.state$.subscribe(this.appLogic);
    });

    merge(
      this.createClick$.pipe(tap(this.create)),
      this.editClick$.pipe(tap(this.update)),
      this.cancelClick$.pipe(tap(this.cancel))
    ).subscribe();

    // this.cdr.detach();
  }

  // update() {
  //   this.cdr.detectChanges();
  // }

  update() {
    // this.zone.run(() => {
    // this.userFacadeService.updateUser();
    // });
    console.log('update');
  }

  create() {
    console.log('create');
  }

  cancel() {
    console.log('cancel');
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  changeSearchCriteria() {
    this.userFacadeService.updateSearchCriteria('new text');
  }

  changePagination() {
    this.userFacadeService.updatePagination(10);
  }
}
