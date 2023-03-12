import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, BehaviorSubject, Subscription, Subject, map, tap, merge, startWith, scan } from 'rxjs';
import { Action } from 'rxjs/internal/scheduler/Action';

export interface TableState {
  data: any[];
  newClassInstance: any;
  dropdownData: any;
}

const initialState: TableState = {
  data: [],
  newClassInstance: {},
  dropdownData: {},
};

const reduceState = (tableState: TableState, input: Partial<TableState>): TableState => ({
  ...tableState,
  ...input,
});

@Component({
  selector: 'editable-table',
  templateUrl: './editable-table.component.html',
  styleUrls: ['./editable-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditableTableComponent implements OnDestroy {
  // The config of table columns
  @Input() tableConfig: any[];
  // Data to be displayed
  @Input() data$ = new Observable<any[]>();
  // Custom sort to override default sort behaviour
  @Input() customSort: (data: any, sortHeaderId: string) => string | number;
  /* Custom filterPredicate to override default one.
  In case column's data is an object, default filter wouldn't work */
  @Input() customFilterPredicate: (data: any, filter: string) => boolean;

  // A new instance of the actual class which needed upon create
  @Input() newClassInstance$: Observable<any> = new Observable();
  // The form instance in case of edit or create
  @Input() form: FormGroup = new FormGroup({});
  // Data if form contains dropdown menu
  @Input() dropdownData$: Observable<any> = new Observable();

  // Whether active/inactive switch should be displayed
  @Input() activeSwitch: any;
  // Whether search row should be hidden
  @Input() isSearchRowHidden = false;
  // Whether table row has click event
  @Input() isRowClickable = false;
  // Whether to show View icon
  @Input() isViewable = false;
  // Whether to show Edit icon
  @Input() isEditable = true;
  // Whether to show Delete icon
  @Input() isDeletable = true;
  // Whether action column should be hidden
  @Input() isActionColumnHidden = false;
  // Delete Icon's matToolTip
  @Input() deleteIconText = 'Delete';

  // Emits an event happens in table's action column
  @Output() public actionClicked = new EventEmitter<any>();
  // Emits an event happens in dropdown field
  @Output() public dropdownClicked = new EventEmitter<any>();
  // Emits an event when active/inactive switch clicked
  @Output() public activeSwitchClicked = new EventEmitter<any>();
  // Emits an event when view icon is clicked
  @Output() public viewClicked = new EventEmitter<any>();
  // Emits an event when table row is clicked
  @Output() public rowClicked = new EventEmitter<any>();

  @ViewChild(MatPaginator)
  set paginator(value: MatPaginator) {
    if (this.dataSource) {
      this.dataSource.paginator = value;
    }
  }

  @ViewChild(MatSort)
  set sorting(value: MatSort) {
    if (this.dataSource) {
      this.dataSource.sort = value;
      // this.dataSource.sortingDataAccessor = this.customSort ? this.customSort : Utils.sortCaseInsesitivly;
    }
  }

  formFieldAppearence = 'outline';
  formFieldColor = 'primary';
  filterText = '';

  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[];
  newClass: any;
  rowBeforeEdit: any;
  dropdownData: any;
  isEmpty$ = new BehaviorSubject<boolean>(true);

  /* Variable to indicate whether row is being edited.
  Equals to -1 if no editing is going on, otherwise
  equals to the index of the object in this.dataSource.data  */
  private _indexOfEditedRow = -1;
  private _isCreateInProgress = false;
  private _isEditInProgress = false;

  private _subscription = new Subscription();
  private _dataChanged$ = new Subject<any>();

  private _mapResult = (tableState: TableState) => {
    this.newClass = tableState.newClassInstance;
    this.dropdownData = tableState.dropdownData;
    this.dataSource.data = tableState.data;
    this.isEmpty$.next(this.dataSource.data.length === 0);
  };

  private _setToInitialValues = () => {
    this._isCreateInProgress = false;
    this._isEditInProgress = false;
    this._indexOfEditedRow = -1;
  };

  constructor() {}

  ngAfterViewInit() {
    this.displayedColumns = this.isActionColumnHidden
      ? this.tableConfig.map((x) => x.columnDef)
      : this.tableConfig.map((x) => x.columnDef).concat('actions');

    if (this.customFilterPredicate) this.dataSource.filterPredicate = this.customFilterPredicate;

    const observables = [
      this._dataChanged$.pipe(map((x) => ({ data: x }))),
      this.data$.pipe(
        tap(this._setToInitialValues),
        map((x) => ({ data: x }))
      ),
      this.newClassInstance$.pipe(map((v) => ({ newClassInstance: v }))),
      this.dropdownData$.pipe(map((v) => ({ dropdownData: v }))),
    ];

    this._subscription = merge(...observables)
      .pipe(startWith(initialState), scan(reduceState), tap(this._mapResult))
      .subscribe();
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  onSlideToggle(toggle: any) {
    // this._cancelIfRowIsBeingEdited();
    // this.activeSwitchClicked.emit(toggle);
  }

  applyFilter(filterValue: any) {
    // this.filterText = filterValue.trim();
    // this.dataSource.filter = this.filterText.toLowerCase();
  }

  onSearchClear() {
    // this.filterText = '';
    // this.applyFilter(this.filterText);
  }

  onSelectionChange(column: string, data: any, event: any) {
    if (event.isUserInput) this.dropdownClicked.emit({ column, data });
  }

  onCreate() {
    if (!this._isCreateInProgress) {
      if (this._isEditInProgress) this._finishEdit();
      // this.actionClicked.emit({ type: ActionType.CREATE_STARTED });
      this.dataSource.data.unshift({ ...this.newClass });
      // this._setRowEditable(0, ActionType.CREATE_STARTED);
    }
  }

  onRowClick(row: any) {
    if (!row.isBeingEdited) this.rowClicked.emit(row);
  }

  onView(row: any) {
    this.viewClicked.emit(row);
  }

  onDelete(row: any) {
    this._cancelIfRowIsBeingEdited();

    // this.dialogService
    //   .openConfirmDialog(OrsConstants.CONFIRM_DIALOG_TEXT_DELETE)
    //   .afterClosed()
    //   .subscribe((result) => {
    //     if (result) {
    // this.actionClicked.emit({ type: ActionType.DELETE, payload: row });
    // }
    // });
  }

  onReActivate(row: any) {
    this._cancelIfRowIsBeingEdited();
    // this.actionClicked.emit({ type: ActionType.REACTIVATE, payload: row });
  }

  onEdit(row: any) {
    // this.actionClicked.emit({ type: ActionType.EDIT_STARTED, payload: row });
    this._cancelIfRowIsBeingEdited();
    // this._setRowEditable(this._getIndex(row), ActionType.EDIT_STARTED);
  }

  onCancel() {
    this._cancelIfRowIsBeingEdited();
  }

  onSubmit(row: any) {
    // this.form.valid
    //   ? this.actionClicked.emit({
    //       type: this._isCreateInProgress ? ActionType.CREATE_SUBMITTED : ActionType.EDIT_SUBMITTED,
    //       payload: row,
    //     })
    //   : this._displayFormErrors();
  }

  private _displayFormErrors() {
    this.form.markAllAsTouched();
  }

  private _cancelIfRowIsBeingEdited() {
    if (this._isCreateInProgress) this._cancelCreate();
    if (this._isEditInProgress) this._cancelEdit();
  }

  private _setRowEditable(index: number, actionType: any) {
    // if (actionType === ActionType.EDIT_STARTED) {
    //   this._isEditInProgress = true;
    //   this._indexOfEditedRow = index;
    //   this.rowBeforeEdit = { ...this.dataSource.data[index] };
    // } else if (actionType === ActionType.CREATE_STARTED) this._isCreateInProgress = true;

    this.dataSource.data[index].isBeingEdited = true;
    this._dataChanged$.next(this.dataSource.data);
  }

  private _cancelCreate() {
    this._isCreateInProgress = false;
    this.dataSource.data.splice(this._getIndexOfBeingEdited(), 1);
    this._dataChanged$.next(this.dataSource.data);
  }

  private _cancelEdit() {
    this.dataSource.data[this._indexOfEditedRow] = this.rowBeforeEdit;
    this._finishEdit();
  }

  private _finishEdit() {
    if (this._isEditInProgress) {
      this.form.reset();
      this.dataSource.data[this._indexOfEditedRow].isBeingEdited = false;
      this._indexOfEditedRow = -1;
      this._isEditInProgress = false;
      this._dataChanged$.next(this.dataSource.data);
    }
  }

  private _getIndexOfBeingEdited(): number {
    return this.dataSource.data.findIndex((x) => x.isBeingEdited === true);
  }

  private _getIndex(row: any): number {
    return this.dataSource.data.findIndex((x) => x === row);
  }
}
