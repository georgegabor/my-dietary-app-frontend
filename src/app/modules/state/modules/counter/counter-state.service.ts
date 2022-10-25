import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StateService } from '../../shared/state.service';

interface CounterState {
  count: number;
}

const initialState: CounterState = {
  count: 42,
};

@Injectable({
  providedIn: 'root',
})
export class CounterStateService extends StateService<CounterState> {
  $count: Observable<number> = this.select((state) => state.count);

  constructor() {
    super(initialState);
  }

  increment() {
    this.setState({ count: this.state.count + 1 });
  }

  decrement() {
    this.setState({ count: this.state.count - 1 });
  }
}
