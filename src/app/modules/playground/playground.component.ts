import { Component } from '@angular/core';
import { combineLatest, distinctUntilChanged, mapTo, merge, Observable, pipe, scan, Subject } from 'rxjs';
import { filter, map, startWith, tap, withLatestFrom } from 'rxjs/operators';

export interface UserState {
  clickCounter: number;
  button: string;
  prevClicks: string;
  customPipe: number;
  customPipe2: string;
}

let initialState: UserState = {
  clickCounter: 0,
  button: '',
  prevClicks: '',
  customPipe: 0,
  customPipe2: '',
};

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss'],
})
export class PlaygroundComponent {
  a$ = new Subject<void>();
  b$ = new Subject<void>();
  c$ = new Subject<void>();
  d$ = new Subject<void>();
  f$ = new Subject<void>();
  g$ = new Subject<void>();
  h$ = new Subject<void>();
  i$ = new Subject<void>();
  j$ = new Subject<void>();

  clicks$ = merge(
    this.a$.pipe(mapTo({ button: 'a' })),
    this.b$.pipe(mapTo({ button: 'b' })),
    this.c$.pipe(mapTo({ button: 'c' })),
    this.d$.pipe(mapTo({ button: 'd' })),
    this.f$.pipe(mapTo({ button: 'f' })),
    this.g$.pipe(mapTo({ button: 'g' })),
    this.h$.pipe(mapTo({ button: 'h' })),
    this.i$.pipe(mapTo({ button: 'i' })),
    this.j$.pipe(mapTo({ button: 'j' }))
  ).pipe(distinctUntilChanged());

  counter$ = this.clicks$.pipe(
    scan((acc) => (acc += 1), 0),
    startWith(0)
  );
  prevClick$ = this.clicks$.pipe(scan((acc, curr) => curr.button + acc, ''));
  customPipe$ = this.counter$.pipe(discardOddDoubleEven());
  customPipe2$ = this.counter$.pipe(oddOrEven());

  counterState$: Observable<UserState> = combineLatest(
    [this.clicks$, this.counter$, this.prevClick$, this.customPipe$, this.customPipe2$],
    (clicks, counter, prevClick, customPipe, customPipe2) => {
      return {
        button: clicks.button,
        clickCounter: counter,
        prevClicks: prevClick,
        customPipe: customPipe,
        customPipe2: customPipe2,
      };
    }
  ).pipe(startWith(initialState));

  counterState2$ = this.clicks$.pipe(
    withLatestFrom(
      this.counter$,
      this.prevClick$,
      this.customPipe$,
      this.customPipe2$,
      (clicks, counter, prevClick, customPipe, customPipe2) => {
        return {
          button: clicks.button,
          clickCounter: counter,
          prevClicks: prevClick,
          customPipe: customPipe,
          customPipe2: customPipe2,
        };
      }
    ),
    tap(console.log)
  );
}

function discardOddDoubleEven() {
  return pipe(
    filter((v: number) => !(v % 2)),
    map((v) => v + v)
  );
}

function oddOrEven() {
  return pipe(map(isOddOrEven));
}

const isOddOrEven = (v: number) => (v % 2 === 0 ? 'EVEN' : 'ODD');
