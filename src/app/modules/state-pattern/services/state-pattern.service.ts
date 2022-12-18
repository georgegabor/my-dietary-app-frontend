import { Injectable } from '@angular/core';
import { Context } from '../models/Context';
import { State } from '../models/State';

@Injectable()
export class StatePatternService {
  private _context: Context;

  constructor() {}

  setState<T extends State>(state: T) {
    this._context = new Context(state);
  }

  request1() {
    this._context.request1();
  }

  request2() {
    this._context.request2();
  }
}
