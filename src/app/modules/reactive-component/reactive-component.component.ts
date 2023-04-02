import { outerActions, TableAction } from './../table-extends-subject/table-extends-subject.component';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {
  asyncScheduler,
  BehaviorSubject,
  concatMap,
  defer,
  delay,
  EMPTY,
  expand,
  filter,
  map,
  mergeAll,
  NEVER,
  Observable,
  of,
  Subject,
  take,
  tap,
  timer,
  windowToggle,
} from 'rxjs';
import { InnerActions, TableExtendsSubjectComponent } from '../table-extends-subject/table-extends-subject.component';

export function bufferConcatMap<T, R>(project: (val: T[], index: number, bufferIndex: number) => Observable<R>) {
  return (sourceObservable: Observable<T>) => {
    // buld the Observable returned by this operator
    return defer(() => {
      // this function will be called each time this Observable is subscribed to.

      // initialize the state - these variables will hold the state for every subscripition of the returned Observable
      let bufferedNotifications = [] as T[];
      let processing = false;
      let _index = -1; // index of the notification from upstream
      let _bufferIndex = 0; // index of the buffer passed to the project function
      return sourceObservable.pipe(
        tap((val) => {
          // every value notified by the source is stored in the buffer
          bufferedNotifications.push(val);
          _index++;
        }),
        concatMap(() => {
          // if processing or if there are no items in the buffer just complete without notifying anything
          if (processing || bufferedNotifications.length === 0) {
            return EMPTY;
          }
          // create a copy of the buffer to be passed to the project function so that the bufferedNotifications array
          // can be safely reset
          const _buffer = [...bufferedNotifications];
          // update the state: now processing start and the bufferedNotifications needs to be reset
          processing = true;
          bufferedNotifications = [];
          // return the result of the project function invoked with the buffer of values stored
          return project(_buffer, _index, _bufferIndex).pipe(
            tap({
              // when the Observable returned by the project function completes it
              // means that there is no processing on the fly
              complete: () => {
                _bufferIndex++;
                processing = false;
              },
            })
          );
        })
      );
    });
  };
}

const T = 5;

export function log<T>(): (source$: Observable<T>) => Observable<T> {
  return (source$) => source$.pipe(tap(console.log));
}

function modulo(number: number) {
  return (source$: Observable<number>) => {
    let state = true;
    let counter = 1;
    return source$.pipe(
      map((res) => ({ mod: res % number === 0 ? 0 : res, counter: counter++, state: (state = !state) }))
    );
  };
}

function whatever(x: number) {
  let res = 1;
  return (y: number) => {
    console.log(`res ${res}`);
    res++;
    return x * y;
  };
}

const curriedFunction = (x: number) => (y: number) => x * y;

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
    const source$ = timer(0, 1000).pipe(take(6));

    source$
      .pipe(
        // windowToggle(this.on$, () => this.off$),
        // mergeAll(),
        // map((x) => x * 2),
        modulo(3),
        tap({
          // when the Observable returned by the project function completes it
          // means that there is no processing on the fly
          // next: console.log,
          // error: console.log,
          complete: () => {
            console.log('Completed !');
          },
        }),
        log()
      )
      .subscribe();

    // const powersOfTwo = this.on$.pipe(
    //   map(() => 1),
    //   expand((x) => of(2 * x).pipe(delay(1000))),
    //   take(10)
    // );
    // powersOfTwo.subscribe((x) => console.log(x));

    const getCharacters$ = (retryCount: number = 0) => of(retryCount);

    const charactersWithRetry$ = getCharacters$().pipe(
      expand(
        (result) => (result < 5 ? timer(result * 1000).pipe(concatMap(() => getCharacters$(result + 1))) : EMPTY),
        Infinity,
        asyncScheduler
      )
    );

    const one = whatever(10);
    const two = one(2);
    const three = one(2);

    const multi10 = curriedFunction(10);
    const result = multi10(2);

    console.log(`curried f res ${result}`);

    // charactersWithRetry$.subscribe(console.log);
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
