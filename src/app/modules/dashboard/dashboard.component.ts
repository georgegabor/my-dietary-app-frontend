import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import {
  combineLatest,
  concat,
  concatMap,
  delay,
  delayWhen,
  expand,
  first,
  forkJoin,
  from,
  fromEvent,
  interval,
  map,
  mapTo,
  materialize,
  mergeMap,
  Observable,
  of,
  share,
  switchMap,
  take,
  tap,
  timeInterval,
  timeout,
  timeoutWith,
  timer,
  withLatestFrom,
  zip,
} from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { ApiService, State } from './../../shared/services/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  card1 = { title: 'Base Info', cols: 2, rows: 1 };
  card2 = { title: 'Books', cols: 1, rows: 3 };
  card3 = { title: 'Characters', cols: 1, rows: 3 };
  card4 = { title: 'Houses', cols: 1, rows: 3 };

  gotBaseInfo$ = this.apiService.gotBaseInfo$;
  gotBooks$ = this.apiService.gotBooks$;
  gotCharacters$ = this.apiService.gotCharacters$;
  gotHouses$ = this.apiService.gotHouses$;

  state$: Observable<State> = combineLatest({
    gotBaseInfo: this.gotBaseInfo$,
    gotBooks: this.gotBooks$,
    gotCharacters: this.gotCharacters$,
    gotHouses: this.gotHouses$,
  });

  forkJoin$ = forkJoin({
    google: ajax.getJSON('https://api.github.com/users/google'),
    microsoft: ajax.getJSON('https://api.github.com/users/microsoft'),
    users: ajax.getJSON('https://api.github.com/users'),
  }).pipe(
    tap(() => console.log('forkJoin$')),
    tap(console.log)
  );

  zip$ = zip(
    ajax.getJSON('https://api.github.com/users/google'),
    ajax.getJSON('https://api.github.com/users/microsoft'),
    ajax.getJSON('https://api.github.com/users')
  ).pipe(
    tap(() => console.log('zip$')),
    tap(console.log)
  );

  concat$ = concat(
    ajax.getJSON('https://api.github.com/users/google'),
    ajax.getJSON('https://api.github.com/users/microsoft'),
    ajax.getJSON('https://api.github.com/users')
  ).pipe(
    tap(() => console.log('concat$')),
    tap(console.log)
  );

  constructor(private breakpointObserver: BreakpointObserver, private readonly apiService: ApiService) {
    // this.forkJoin$.subscribe();
    // this.zip$.subscribe();
    // this.concat$.subscribe();
  }

  someThing(xValues: any[]) {
    const xRangeInSecs = Math.max(...xValues) - Math.min(...xValues);
    // prettier-ignore
    const xAxisScaleFactor =
    (xRangeInSecs <= 60)       ? 'seconds' :
    (xRangeInSecs <= 3600)     ? 'minutes' :
    (xRangeInSecs <= 86400)    ? 'hours'   :
    (xRangeInSecs <= 2592000)  ? 'days'    :
    (xRangeInSecs <= 31536000) ? 'months'  :
    /* otherwise */              'years';
  }

  clicks$ = fromEvent(document, 'click');
  powersOfTwo = this.clicks$
    .pipe(
      mapTo(2),
      expand((x) => of(2 * x), 2),
      take(10)
    )
    .subscribe((x) => console.log(x));

  a$ = interval(2000).pipe(
    share(),
    // tap(() => console.log('a$')),
    take(10)
  );

  b$ = timer(0, 1400).pipe(
    // tap(() => console.log('b$')),
    take(7)
  );

  c$ = timer(0, 1300).pipe(
    // tap(() => console.log('b$')),
    take(7)
  );

  withLatestFrom$ = this.a$.pipe(
    withLatestFrom(this.b$, this.c$, (source, one, two) => ({ source: source, one: one, two: two }))
    // timeInterval()
    // materialize()
  );

  timeoutWith$ = this.a$.pipe(
    timeout({
      each: 900,
      with: () => this.b$,
    })
  );

  first$ = this.a$.pipe(first((x) => x === 3));

  source$ = of(1500, 2000, 2500, 500, 1000);

  delayed$ = this.source$.pipe(concatMap((val) => of(val).pipe(delay(val))));

  ngOnInit(): void {
    this.withLatestFrom$.subscribe(console.log);
    // this.timeoutWith$.subscribe(console.log);
    // this.first$.subscribe((x) => console.log('First: ', x));
    // this.delayed$.subscribe((x) => console.log('delayed: ', x));
  }
}

/**
 * This function returns an observable that will emit the next frame once the
 * browser has returned an animation frame step. Given the previous frame it calculates
 * the delta time, and we also clamp it to 30FPS in case we get long frames.
 */
const calculateStep = (prevFrame: IFrameData) => {
  return new Observable((observer) => {
    requestAnimationFrame((frameStartTime) => {
      const deltaTime = prevFrame ? (frameStartTime - prevFrame.frameStartTime) / 1000 : 0;
      observer.next({
        frameStartTime,
        deltaTime,
      });
    });
  }).pipe(map(clampTo30FPS));
};

export const clampTo30FPS = (frame: IFrameData) => {
  if (frame.deltaTime > 1 / 30) {
    frame.deltaTime = 1 / 30;
  }
  return frame;
};

export interface IFrameData {
  frameStartTime: number;
  deltaTime: number;
}
