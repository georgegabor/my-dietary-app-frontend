import { outerActions, TableAction } from './../table-extends-subject/table-extends-subject.component';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { filter, tap } from 'rxjs';
import { InnerActions, TableExtendsSubjectComponent } from '../table-extends-subject/table-extends-subject.component';

@Component({
  selector: 'app-reactive-component',
  template: `
    <p>ReactiveComponent</p>
    <table-extends-subject></table-extends-subject>
  `,
  styleUrls: ['./reactive-component.component.scss'],
})
export class ReactiveComponentComponent implements AfterViewInit {
  constructor() {}

  @ViewChild(TableExtendsSubjectComponent)
  private _table: TableExtendsSubjectComponent;

  ngAfterViewInit(): void {
    this._table
      .pipe(
        tap(() => console.log('--- Component Received ----')),
        tap(console.log),
        filter((action: TableAction) => action.type === outerActions.LOAD_ROW)
      )
      .subscribe((received: TableAction) => {
        this._table.next({
          type: InnerActions.LOAD_ROW_SUCCESS,
          payload: { ...received.payload, pageActual: Math.random() },
        });
      });
  }
}
