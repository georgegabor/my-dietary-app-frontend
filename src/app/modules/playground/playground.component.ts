import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable, pipe, scan, Subject } from 'rxjs';
import { filter, map, mapTo, startWith, tap, withLatestFrom } from 'rxjs/operators';

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

interface Btn {
  button: string;
}

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaygroundComponent {
  // _click$ = new BehaviorSubject({ button: '' });
  _click$ = new Subject<Btn>();

  click(s: string) {
    this._click$.next({ button: s });
  }

  counter$ = this._click$.pipe(
    mapTo(1),
    scan((acc, curr) => acc + curr, initialState.clickCounter)
  );
  prevClick$ = this._click$.pipe(scan((acc, curr) => curr.button + acc, ''));
  customPipe$ = this.counter$.pipe(startWith(0), discardOddDoubleEven());
  customPipe2$ = this.counter$.pipe(oddOrEven());

  // counterState$: Observable<UserState> = combineLatest(
  //   [this._click$, this.counter$, this.prevClick$, this.customPipe$, this.customPipe2$],
  //   (clicks, counter, prevClick, customPipe, customPipe2) => {
  //     return {
  //       button: clicks.button,
  //       clickCounter: counter,
  //       prevClicks: prevClick,
  //       customPipe: customPipe,
  //       customPipe2: customPipe2,
  //     };
  //   }
  // ).pipe(startWith(initialState));

  counterState2$: Observable<UserState> = this._click$.pipe(
    tap(console.log),
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
    pipe(startWith(initialState)),
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
