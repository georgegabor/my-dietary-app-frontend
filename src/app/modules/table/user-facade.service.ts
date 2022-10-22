import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { BehaviorSubject, combineLatest, distinctUntilChanged, map, Observable, of, switchMap } from 'rxjs';

/** Constants used to fill up our data base. */
const FRUITS: string[] = ['blueberry', 'lychee', 'kiwi', 'mango', 'peach', 'lime', 'pomegranate', 'pineapple'];
const NAMES: string[] = [
  'Maia',
  'Asher',
  'Olivia',
  'Atticus',
  'Amelia',
  'Jack',
  'Charlotte',
  'Theodore',
  'Isla',
  'Oliver',
  'Isabella',
  'Jasper',
  'Cora',
  'Levi',
  'Violet',
  'Arthur',
  'Mia',
  'Thomas',
  'Elizabeth',
];

export interface User {
  id: string;
  name: string;
  progress: string;
  fruit: string;
}

// export interface Pagination {
//   currentPage: number;
//   selectedSize: number;
//   pageSize: number;
// }

export interface UserState {
  users: User[];
  pagination: PageEvent;
  criteria: string;
}

let _state: UserState = {
  users: [],
  pagination: {
    pageIndex: 0,
    pageSize: 5,
    length: 0,
  },
  criteria: 'ngDominican',
};

/** Builds and returns a new User. */
function createNewUser(id: number) {
  const name =
    NAMES[Math.round(Math.random() * (NAMES.length - 1))] +
    ' ' +
    NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) +
    '.';

  return {
    id: id.toString(),
    name: name,
    progress: Math.round(Math.random() * 100).toString(),
    fruit: FRUITS[Math.round(Math.random() * (FRUITS.length - 1))],
  };
}

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
    combineLatest([this.criteria$, this.pagination$])
      .pipe(
        switchMap(([criteria, pagination]) => {
          return this.findAllUsers(criteria, pagination);
        })
      )
      .subscribe((users) => {
        this.store$.next((_state = { ..._state, users }));
      });
  }

  findAllUsers(criteria: string, pagination: PageEvent): Observable<User[]> {
    let c = criteria;
    let p = pagination;
    return of(Array.from({ length: 100 }, (_, k) => createNewUser(k + 1)));
  }

  updateSearchCriteria(criteria: string) {
    this.store$.next((_state = { ..._state, criteria }));
  }

  updatePagination(pageSize: number, currentPage: number = 0) {
    const pagination = { ..._state.pagination, pageSize };
    this.store$.next((_state = { ..._state, pagination }));
  }

  addNewUser() {
    const users = [..._state.users, createNewUser(_state.users.length)];

    this.store$.next((_state = { ..._state, users }));
  }

  updateUser() {
    _state.users[0] = {
      id: _state.users[0].id,
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
