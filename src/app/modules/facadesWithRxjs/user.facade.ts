import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';

import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
} from 'rxjs/operators';

export interface User {
  gender: string;
  name: {
    first: string;
    last: string;
  };
}

export interface Pagination {
  selectedSize: number;
  currentPage: number;
  pageSizes: number[];
}

export interface RandomUserResponse {
  results: User[];
}

export interface UserState {
  users: User[];
  pagination: Pagination;
  criteria: string;
  loading: boolean;
}

let _state: UserState = {
  users: [],
  criteria: '',
  pagination: {
    currentPage: 0,
    selectedSize: 5,
    pageSizes: [5, 10, 20, 50],
  },
  loading: false,
};

@Injectable({
  providedIn: 'root',
})
export class UserFacade {
  private store = new BehaviorSubject<UserState>(_state);
  private state$ = this.store.asObservable();

  users$ = this.state$.pipe(
    map((state) => state.users),
    distinctUntilChanged()
  );
  criteria$ = this.state$.pipe(
    map((state) => state.criteria),
    distinctUntilChanged()
  );
  pagination$ = this.state$.pipe(
    map((state) => state.pagination),
    distinctUntilChanged()
  );
  loading$ = this.state$.pipe(map((state) => state.loading));

  /**
   * Viewmodel that resolves once all the data is ready (or updated)...
   */
  vm$: Observable<UserState> = combineLatest(
    this.pagination$,
    this.criteria$,
    this.users$,
    this.loading$
  ).pipe(
    map(([pagination, criteria, users, loading]) => {
      return { pagination, criteria, users, loading };
    })
  );

  /**
   * Watch 2 streams to trigger user loads and state updates
   */
  constructor(private http: HttpClient) {
    combineLatest(this.criteria$, this.pagination$)
      .pipe(
        switchMap(([criteria, pagination]) => {
          return this.findAllUsers(criteria, pagination);
        })
      )
      .subscribe((users) => {
        this.updateState({ ..._state, users, loading: false });
      });
  }

  // ------- Public Methods ------------------------

  // Allows quick snapshot access to data for ngOnInit() purposes
  getStateSnapshot(): UserState {
    return { ..._state, pagination: { ..._state.pagination } };
  }

  buildSearchTermControl(): FormControl {
    const searchTerm = new FormControl();
    searchTerm.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => this.updateSearchCriteria(value));

    return searchTerm;
  }

  updateSearchCriteria(criteria: string) {
    this.updateState({ ..._state, criteria, loading: true });
  }

  updatePagination(selectedSize: number, currentPage: number = 0) {
    const pagination = { ..._state.pagination, currentPage, selectedSize };
    this.updateState({ ..._state, pagination, loading: true });
  }

  // ------- Private Methods ------------------------

  /** Update internal state cache and emit from store... */
  private updateState(state: UserState) {
    this.store.next((_state = state));
  }

  /** RandomUser REST call */
  private findAllUsers(
    criteria: string,
    pagination: Pagination
  ): Observable<User[]> {
    const url = buildUserUrl(criteria, pagination);
    return this.http.get<RandomUserResponse>(url).pipe(
      map((response) => response.results),
      map(filterWithCriteria(criteria))
    );
  }
}

function buildUserUrl(criteria: string, pagination: Pagination): string {
  const URL = 'https://randomuser.me/api/';
  const currentPage = `page=${pagination.currentPage}`;
  const pageSize = `results=${pagination.selectedSize}&`;
  const searchFor = `seed=mindspaceDemo&inc=gender,name,nat`;

  return `${URL}?${searchFor}&${pageSize}&${currentPage}`;
}

// ******************************************
// Filter Utilities
// ******************************************

function contains(src: any, part: string) {
  return (src || '').toLowerCase().indexOf(part.toLowerCase()) > -1;
}
function matchUser(who: { first: any; last: any }, criteria: any) {
  const inFirst = contains(who.first, criteria);
  const inLast = contains(who.last, criteria);

  return !!criteria ? inFirst || inLast : true;
}

function filterWithCriteria(criteria: string) {
  return (list: any[]) => {
    return list.filter((it: { name: any }) => {
      return matchUser(it.name, criteria);
    });
  };
}
