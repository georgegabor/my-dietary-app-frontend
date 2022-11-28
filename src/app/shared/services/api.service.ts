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
  gotBaseInfo$: Observable<any[]> = this.select((state) => state.gotBaseInfo);
  gotBooks$: Observable<any[]> = this.select((state) => state.gotBooks);
  gotCharacters$: Observable<any[]> = this.select((state) => state.gotCharacters);
  gotHouses$: Observable<any[]> = this.select((state) => state.gotHouses);

  constructor(private readonly http: HttpClient) {
    super(initialState);

    this.load();
  }

  load() {
    // this.http.get<any[]>(GOT_URL).subscribe(
    //   (res) => this.setState({ gotBaseInfo: res }),
    //   () => noop,
    //   () => console.log(GOT_URL + ' completed')
    // );
    // this.http.get<any[]>(GOT_BOOKS_URL).subscribe((res) => this.setState({ gotBooks: res }));
    // this.http.get<any[]>(GOT_CHARACTERS_URL).subscribe((res) => this.setState({ gotCharacters: res }));
    // this.http.get<any[]>(GOT_HOUSES_URL).subscribe((res) => this.setState({ gotHouses: res }));

    forkJoin({
      gotBaseInfo: this.http.get<any[]>(GOT_URL).pipe(tap(() => console.log('gotBaseInfo'))),
      gotBooks: this.http.get<any[]>(GOT_BOOKS_URL).pipe(tap(() => console.log('gotBooks'))),
      gotCharacters: this.http.get<any[]>(GOT_CHARACTERS_URL).pipe(tap(() => console.log('gotCharacters'))),
      gotHouses: this.http.get<any[]>(GOT_HOUSES_URL).pipe(tap(() => console.log('gotHouses'))),
    })
      .pipe(tap(() => console.log(this)))
      .subscribe((res) => this.setState(res));
  }
}
