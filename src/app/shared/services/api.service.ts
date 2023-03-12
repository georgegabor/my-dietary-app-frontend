import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, noop, Observable, tap } from 'rxjs';
import { StateService } from './state.service';

const GOT_URL = 'https://www.anapioficeandfire.com/api';
const GOT_BOOKS_URL = GOT_URL + '/books';
const GOT_CHARACTERS_URL = GOT_URL + '/characters';
const GOT_HOUSES_URL = GOT_URL + '/houses';

export interface State {
  gotBaseInfo: any[];
  gotBooks: any[];
  gotCharacters: any[];
  gotHouses: any[];
}

const initialState: State = {
  gotBaseInfo: [],
  gotBooks: [],
  gotCharacters: [],
  gotHouses: [],
};

@Injectable({
  providedIn: 'root',
})
export class ApiService extends StateService<State> {
  gotBaseInfo$ = this.select((state) => state.gotBaseInfo);
  gotBooks$ = this.select((state) => state.gotBooks);
  gotCharacters$ = this.select((state) => state.gotCharacters);
  gotHouses$ = this.select((state) => state.gotHouses);

  constructor(private readonly http: HttpClient) {
    super(initialState);

    this.load();
  }

  load() {
    forkJoin({
      gotBaseInfo: this.http.get<any[]>(GOT_URL),
      gotBooks: this.http.get<any[]>(GOT_BOOKS_URL),
      gotCharacters: this.http.get<any[]>(GOT_CHARACTERS_URL),
      gotHouses: this.http.get<any[]>(GOT_HOUSES_URL),
    })
      .pipe(tap((res) => this.setState(res)))
      .subscribe();
  }
}
