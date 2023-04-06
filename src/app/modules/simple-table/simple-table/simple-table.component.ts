import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';

interface TableState {
  state: State;
  data: any[];
}

const initialState: TableState = {
  state: 'read',
  data: [{ type: 'initial' }],
};

type State = 'read' | 'edit' | 'create';
type ActionType = 'edit' | 'create' | 'cancel';
type Action = (value: TableState) => void;

const record: Record<ActionType, Action> = {
  edit: (value) =>
    Object.assign(value, {
      data: [...value.data, { type: 'edited' }],
      state: 'edit',
    }),
  create: (value) =>
    Object.assign(value, {
      data: [...value.data, { type: 'created' }],
      state: 'create',
    }),
  cancel: (value) =>
    Object.assign(value, {
      data: [...value.data, { type: 'cancelled' }],
      state: 'read',
    }),
};

@Component({
  selector: 'app-simple-table',
  templateUrl: './simple-table.component.html',
  styleUrls: ['./simple-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleTableComponent {
  constructor(public cdf: ChangeDetectorRef) {}

  state = initialState;

  onClick(value: ActionType) {
    record[value](this.state);
  }
}
