import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NostroAccountFilter } from '../models/nostro-account-filter';
import { NostroAccount } from '../models/NostroAccount';

const NOSTROACCOUNT_SEARCH_URL = 'http://localhost:8080/nostros';

@Injectable({
  providedIn: 'root',
})
export class NostroaccountService {
  private _filter: NostroAccountFilter = new NostroAccountFilter();

  constructor(private readonly httpClientService: HttpClient) {}

  private _nostroAccountListSub = new BehaviorSubject<NostroAccount[]>([]);
  public readonly nostroAccountList$: Observable<NostroAccount[]> = this._nostroAccountListSub.asObservable().pipe(
    map((x) =>
      x.sort(
        (a, b) => (a.nostroId < b.nostroId ? 1 : -1) // descending order
      )
    )
  );

  getList(nostroAccountFilter: NostroAccountFilter): void {
    this._filter = nostroAccountFilter;
    const http$ = this.httpClientService.get<NostroAccount[]>(NOSTROACCOUNT_SEARCH_URL);

    http$.subscribe((res) => {
      this._nostroAccountListSub.next(res);
    });
  }

  create(model: any) {
    const http$ = this.httpClientService.post(NOSTROACCOUNT_SEARCH_URL + '/new', model);

    http$.subscribe(() => {
      this.getList(this._filter);
    });
  }

  update(nostroAccountId: string, model: any): void {
    const http$ = this.httpClientService.put(NOSTROACCOUNT_SEARCH_URL, nostroAccountId, model);

    http$.subscribe(() => {
      this.getList(this._filter);
    });
  }

  delete(nostroAccountId: string, model: any) {
    const http$ = this.httpClientService.delete(NOSTROACCOUNT_SEARCH_URL + '/' + nostroAccountId, model);

    http$.subscribe(() => {
      this.getList(this._filter);
    });
  }
}
