import { Component } from '@angular/core';
import { combineLatest, mapTo, merge, Observable, scan, Subject } from 'rxjs';
import { startWith, tap } from 'rxjs/operators';

export interface UserState {
  clickCounter: number;
  button: string;
  prevClicks: string;
}

let initialState: UserState = {
  clickCounter: 0,
  button: '',
  prevClicks: '',
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
  );

  counter$ = this.clicks$.pipe(scan((acc) => (acc += 1), 0));
  prevClick$ = this.clicks$.pipe(scan((acc, curr) => curr.button + acc, ''));
  counterState$: Observable<UserState> = combineLatest(
    [this.clicks$, this.counter$, this.prevClick$],
    (clicks, counter, prevClick) => {
      return { button: clicks.button, clickCounter: counter, prevClicks: prevClick };
    }
  ).pipe(startWith(initialState), tap(console.log));
}
