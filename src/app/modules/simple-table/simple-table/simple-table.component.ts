import { ChangeDetectionStrategy, Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { interval, take, tap } from 'rxjs';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

@Component({
  selector: 'app-simple-table',
  templateUrl: './simple-table.component.html',
  styleUrls: ['./simple-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleTableComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  // dataSource = new MatTableDataSource();
  dataSource = new MatTableDataSource(ELEMENT_DATA.slice(0, 4));

  constructor(public cdf: ChangeDetectorRef) {}

  ngOnInit() {}

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    // const obs$ = interval().pipe(
    //   take(500),
    //   // tap(console.log),
    //   tap((v) => {
    //     const ds = new MatTableDataSource();
    //     ds.sort = this.sort;
    //     ds.paginator = this.paginator;
    //     ds.data = [...this.dataSource.data, ELEMENT_DATA[v % 10]];

    //     this.dataSource = ds;
    //   })
    // );

    // obs$.subscribe();

    const obs$ = interval(10000).pipe(
      take(1),
      // tap(console.log),
      tap((v) => {
        const ds = new MatTableDataSource<PeriodicElement>();
        ds.sort = this.sort;
        ds.paginator = this.paginator;
        console.log(v + ' ' + (9 - v));
        this.dataSource.data[v] = { ...ELEMENT_DATA[9 - v] };
        ds.data = [...this.dataSource.data];

        // console.log(this.dataSource.data[v]);
        this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA.slice(4));
        // this.cdf.markForCheck();
        // console.log(this.dataSource.data[v]);
      })
    );

    obs$.subscribe();
  }

  announceSortChange(sortState: Sort) {
    console.log(sortState);
  }
}
