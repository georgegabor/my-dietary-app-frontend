import { Component } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, pipe, scan } from 'rxjs';
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
  _click$ = new BehaviorSubject({ button: '' });

  click(s: string) {
    this._click$.next({ button: s });
  }

  counter$ = this._click$.pipe(scan((acc) => (acc += 1), -1));
  prevClick$ = this._click$.pipe(scan((acc, curr) => curr.button + acc, ''));
  customPipe$ = this.counter$.pipe(discardOddDoubleEven());
  customPipe2$ = this.counter$.pipe(oddOrEven());

  counterState$: Observable<UserState> = combineLatest(
    [this._click$, this.counter$, this.prevClick$, this.customPipe$, this.customPipe2$],
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

  counterState2$ = this._click$.pipe(
    withLatestFrom(
      this.counter$,
      this.prevClick$,
      this.customPipe$,
      this.customPipe2$,
      (click, counter, prevClick, customPipe, customPipe2) => {
        return {
          button: click.button,
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
