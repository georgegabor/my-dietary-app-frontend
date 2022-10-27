import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

export class StateService<T> {
  private _state$: BehaviorSubject<T>;

  constructor(initialState: T) {
    this._state$ = new BehaviorSubject<T>(initialState);
  }

  protected get state(): T {
    return this._state$.getValue();
  }

  protected setState(newState: Partial<T>) {
    this._state$.next({
      ...this.state,
      ...newState,
    });
  }

  protected select<K>(mapFn: (state: T) => K): Observable<K> {
    return this._state$.asObservable().pipe(
      map((state: T) => mapFn(state)),
      distinctUntilChanged()
    );
  }
}
