import { BreakpointObserver } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { combineLatest, concat, forkJoin, Observable, tap, zip } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { ApiService, State } from './../../shared/services/api.service';

/** Based on the screen size, switch from standard to one column per row
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Card 1', cols: 1, rows: 1 },
          { title: 'Card 2', cols: 1, rows: 1 },
          { title: 'Card 3', cols: 1, rows: 1 },
          { title: 'Card 4', cols: 1, rows: 1 },
        ];
      }

      return [
        { title: 'Card 1', cols: 2, rows: 1 },
        { title: 'Card 2', cols: 1, rows: 1 },
        { title: 'Card 3', cols: 1, rows: 2 },
        { title: 'Card 4', cols: 1, rows: 1 },
      ];
    })
  ); */

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  card1 = { title: 'Base Info', cols: 2, rows: 1 };
  card2 = { title: 'Books', cols: 1, rows: 3 };
  card3 = { title: 'Characters', cols: 1, rows: 3 };
  card4 = { title: 'Houses', cols: 1, rows: 3 };

  gotBaseInfo$: Observable<any[]> = this.apiService.gotBaseInfo$;
  gotBooks$: Observable<any[]> = this.apiService.gotBooks$;
  gotCharacters$: Observable<any[]> = this.apiService.gotCharacters$;
  gotHouses$: Observable<any[]> = this.apiService.gotHouses$;

  state$: Observable<State> = combineLatest(
    [this.gotBaseInfo$, this.gotBooks$, this.gotCharacters$, this.gotHouses$],
    (gotBaseInfo, gotBooks, gotCharacters, gotHouses) => {
      return {
        gotBaseInfo: gotBaseInfo,
        gotBooks: gotBooks,
        gotCharacters: gotCharacters,
        gotHouses: gotHouses,
      };
    }
  );

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
}
