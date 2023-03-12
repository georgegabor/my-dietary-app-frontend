import { EditState } from './../models/EditState';
import { Injectable } from '@angular/core';
import { Context } from '../models/Context';
import { CreateState } from '../models/CreateState';
import { State } from '../models/State';

@Injectable()
export class StatePatternService {
  private _context: Context;

  private _do<T extends State>(state: T) {
    this._context = new Context(state);
    this._context.execute();
  }

  create() {
    this._do(new CreateState());
  }

  edit() {
    this._do(new EditState());
  }
}
