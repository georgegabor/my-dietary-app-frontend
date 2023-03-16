import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

export enum outerActions {
  LOAD_ROW = 'LOW_ROW',
  LOAD_CONFIG = 'LOAD_CONFIG',
  ROW_SELECTED = 'ROW_SELECTED',
}

export enum InnerActions {
  LOAD_ROW_SUCCESS = 'LOAD_ROW_SUCCESS',
  LOAD_CONFIG_SUCCESS = 'LOAD_CONFIG_SUCCESS',
}

export interface TableAction {
  type: outerActions | InnerActions;
  payload?: any;
}

export interface ConfigColumn {
  header: string;
  value: string;
}

export type Config = ConfigColumn[];

export interface DataTable<T> {
  pageActual: number;
  lastPage: number;
  data: T[];
  config?: Config;
  size: number;
}

export const DEFAULT_VALUE: DataTable<any> = {
  pageActual: 0,
  lastPage: 0,
  data: [],
  config: [],
  size: 5,
};

@Component({
  selector: 'table-extends-subject',
  templateUrl: './table-extends-subject.component.html',
  styleUrls: ['./table-extends-subject.component.scss'],
})
export class TableExtendsSubjectComponent extends Subject<TableAction> implements OnInit {
  public state$ = new BehaviorSubject<DataTable<any>>(DEFAULT_VALUE);

  constructor() {
    super();
  }

  ngOnInit() {
    this.subscribe((action: TableAction) => {
      console.log('--- Table Received ----');
      console.log(action);
      this.state$.next(this.reduce(action, this.state$.value));
    });

    this.next({
      type: outerActions.LOAD_CONFIG,
    });

    this.next({
      type: outerActions.LOAD_ROW,
      payload: {
        page: 0,
        size: 5,
      },
    });
  }

  ngOnDestroy() {
    this.state$.complete();
    this.complete();
  }

  public reduce(action: TableAction, state: DataTable<any>): DataTable<any> {
    let newState = { ...state };

    switch (action.type) {
      case InnerActions.LOAD_CONFIG_SUCCESS:
        newState.config = [...action.payload.config];
        break;
      case InnerActions.LOAD_ROW_SUCCESS:
        newState.lastPage = action.payload.lastPage;
        newState.pageActual = action.payload.pageActual;
        newState.data = [...action.payload.data];
        break;
    }

    return newState;
  }

  public changePage(pageNum: number) {
    const state = this.state$.value;
    const num = pageNum < 0 ? 0 : pageNum >= state.lastPage ? state.lastPage - 1 : pageNum;

    this.next({
      type: outerActions.LOAD_ROW,
      payload: DEFAULT_VALUE,
    });
  }
}
