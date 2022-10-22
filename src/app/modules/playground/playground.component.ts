import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, mapTo, merge, scan, Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

export interface UserState {
  clickCounter: number;
  button: string;
  prevClicks: string;
}

let _state: UserState = {
  clickCounter: 0,
  button: '',
  prevClicks: '',
};

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss'],
})
export class PlaygroundComponent implements OnInit, OnDestroy {
  store$ = new BehaviorSubject<UserState>(_state);
  _subscription = new Subscription();

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

  all$ = combineLatest([this.clicks$, this.counter$, this.prevClick$]).pipe(
    map(([clicks, counters, prevClicks]) => {
      this.store$.next({
        ..._state,
        button: clicks.button,
        clickCounter: counters,
        prevClicks: prevClicks,
      });
    })
  );

  constructor() {}

  ngOnInit() {
    // this._subscription = this.all$.subscribe();
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
