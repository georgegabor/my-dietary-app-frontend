import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  map,
  Observable,
  of,
  switchMap,
} from 'rxjs';

export interface User {
  id: string;
  name: string;
  progress: string;
  fruit: string;
}

interface Pagination {
  currentPage: number;
  selectedSize: number;
  pageSizes: number[];
}

export interface UserState {
  users: User[];
  pagination: Pagination;
  criteria: string;
}

let _state: UserState = {
  users: [],
  pagination: {
    currentPage: 0,
    selectedSize: 5,
    pageSizes: [5, 10, 20],
  },
  criteria: 'ngDominican',
};

@Injectable({
  providedIn: 'root',
})
export class UserFacadeService {
  private store$ = new BehaviorSubject<UserState>(_state);
  public state$ = this.store$.asObservable();

  criteria$ = this.state$.pipe(
    map((state) => state.criteria),
    distinctUntilChanged()
  );
  pagination$ = this.state$.pipe(
    map((state) => state.pagination),
    distinctUntilChanged()
  );
  users$ = this.state$.pipe(
    map((state) => state.users),
    distinctUntilChanged()
  );

  constructor(private http: HttpClient) {
    combineLatest(this.criteria$, this.pagination$)
      .pipe(
        switchMap(([criteria, pagination]) => {
          return this.findAllUsers(criteria, pagination);
        })
      )
      .subscribe((users) => {
        this.store$.next((_state = { ..._state, users }));
      });
  }

  findAllUsers(criteria: string, pagination: Pagination): Observable<User[]> {
    let c = criteria;
    let p = pagination;
    return of([
      {
        id: '0',
        name: 'Bopg',
        progress: '100',
        fruit: 'Orange',
      },
    ]);
  }

  updateSearchCriteria(criteria: string) {
    this.store$.next((_state = { ..._state, criteria }));
  }

  updatePagination(selectedSize: number, currentPage: number = 0) {
    const pagination = { ..._state.pagination, currentPage, selectedSize };
    this.store$.next((_state = { ..._state, pagination }));
  }

  addNewUser() {
    const user: User = {
      id: '5',
      name: 'New User',
      progress: '67',
      fruit: 'PineAplle',
    };
    const users = [..._state.users, user];

    this.store$.next((_state = { ..._state, users }));
  }

  updateUser() {
    _state.users[0] = {
      id: '7',
      name: 'Malek',
      progress: '34',
      fruit: 'Kiwi',
    };

    this.store$.next(_state);
  }

  removeFirst() {
    _state.users.splice(0, 1);
    this.store$.next(_state);
  }
}
