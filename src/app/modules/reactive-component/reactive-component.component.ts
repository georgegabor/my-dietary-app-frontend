import { outerActions, TableAction } from './../table-extends-subject/table-extends-subject.component';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {
  asyncScheduler,
  BehaviorSubject,
  delay,
  EMPTY,
  expand,
  filter,
  map,
  mergeAll,
  NEVER,
  of,
  Subject,
  take,
  tap,
  timer,
  windowToggle,
} from 'rxjs';
import { InnerActions, TableExtendsSubjectComponent } from '../table-extends-subject/table-extends-subject.component';

const T = 5;

@Component({
  selector: 'app-reactive-component',
  template: `
    <div>
      <p>ReactiveComponent</p>
      <table-extends-subject></table-extends-subject>
    </div>

    <div style="display: flex; justify-content: center;">
      <button mat-button color="primary" (click)="on$.next()">ON</button>
      <button mat-button color="primary" (click)="off$.next()">OFF</button>
    </div>
  `,
  styleUrls: ['./reactive-component.component.scss'],
})
export class ReactiveComponentComponent implements AfterViewInit {
  constructor() {
    const source$ = timer(0, 1000).pipe(take(50));

    source$
      .pipe(
        windowToggle(this.on$, () => this.off$),
        mergeAll()
      )
      .subscribe(console.log);

    // const powersOfTwo = this.on$.pipe(
    //   map(() => 1),
    //   expand((x) => of(2 * x).pipe(delay(1000))),
    //   take(10)
    // );
    // powersOfTwo.subscribe((x) => console.log(x));

    const getCharacters$ = (retryCount: number = 0) => of(retryCount);

    const charactersWithRetry$ = getCharacters$().pipe(
      expand((result) => (result < 5 ? getCharacters$(result + 1) : EMPTY), Infinity, asyncScheduler)
    );

    charactersWithRetry$.subscribe(console.log);
  }

  on$ = new Subject<void>();
  off$ = new Subject<void>();

  @ViewChild(TableExtendsSubjectComponent)
  private _table: TableExtendsSubjectComponent;

  ngAfterViewInit(): void {
    this._table
      .pipe(
        tap(() => console.log('--- Component Received ----')),
        tap(console.log),
        filter((action: TableAction) => action.type === outerActions.LOAD_ROW)
      )
      .subscribe((received: TableAction) => {
        this._table.next({
          type: InnerActions.LOAD_ROW_SUCCESS,
          payload: { ...received.payload, pageActual: Math.random() },
        });
      });
  }
}
