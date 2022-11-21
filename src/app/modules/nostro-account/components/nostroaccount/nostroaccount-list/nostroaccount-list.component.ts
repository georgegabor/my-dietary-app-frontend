import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, Subscription, tap, merge, switchMap, of, Observable } from 'rxjs';
import { NostroAccountFilter } from '../../../models/nostro-account-filter';
import { NostroAccount } from '../../../models/NostroAccount';
import { NostroaccountService } from '../../../services/nostroaccount.service';

@Component({
  selector: 'app-nostroaccount-list',
  templateUrl: './nostroaccount-list.component.html',
  styleUrls: ['./nostroaccount-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NostroaccountListComponent {
  @ViewChild(MatSort)
  sort: MatSort = new MatSort();

  @ViewChild(MatPaginator)
  paginator: MatPaginator | null = null;

  isReload$ = new Subject<boolean>();
  title = 'Nostro Account';
  editNostroAccountId = -1;
  nostroAccountForm: FormGroup;
  isEditableNew: boolean = true;
  displayedColumns: string[] = ['bbgCode', 'secAcc', 'cpty', 'action'];
  private subscription = new Subscription();
  public dataSource = new MatTableDataSource<any>();

  constructor(public readonly nostroAccountService: NostroaccountService, private fb: FormBuilder) {
    this.nostroAccountForm = this.fb.group({
      nostroAccountRows: this.fb.array([]),
    });
  }

  processData$ = (data: NostroAccount[]): Observable<NostroAccount[]> => {
    this.nostroAccountForm = this.fb.group({
      nostroAccountRows: this.fb.array(
        data.map((val) =>
          this.fb.group({
            nostroId: new FormControl(val.nostroId),
            bbgCode: new FormControl(val.bbgCode, Validators.required),
            secAcc: new FormControl(val.secAcc),
            cpty: new FormControl(val.cpty),
            usrIns: new FormControl(val.usrIns),
            datIns: new FormControl(val.datIns),
            usrUpd: new FormControl(val.usrUpd),
            datUpd: new FormControl(val.datUpd),
            stat: new FormControl(val.stat),
            action: new FormControl('existingRecord'),
            isEditable: new FormControl(true),
            isNewRow: new FormControl(false),
          })
        )
      ),
    });

    this.dataSource.sort = this.sort;
    // this.dataSource.sortingDataAccessor = Utils.sortFormGroupCaseInsesitivly;
    this.dataSource.paginator = this.paginator;

    setTimeout(() => (this.dataSource.data = (this.nostroAccountForm.get('nostroAccountRows') as FormArray).controls));

    return of(data);
  };

  editClicked$ = new Subject<any>();
  addClicked$ = new Subject<void>();

  manipulateData$ = (data: NostroAccount[], row: any): Observable<NostroAccount[]> => {
    data.unshift(new NostroAccount());
    return of(data);
  };

  takeInput$ = (data: any[]) =>
    merge(
      this.editClicked$.pipe(switchMap((row) => this.manipulateData$(data, row))),
      this.addClicked$.pipe(switchMap((_) => this.manipulateData$(data, _)))
    ).pipe(switchMap(this.processData$));

  merged$ = this.nostroAccountService.nostroAccountList$.pipe(
    tap(this.processData$),
    switchMap((data) => this.takeInput$(data))
  );

  ngAfterViewInit() {
    this.subscription = this.merged$.subscribe();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSubmit(e: NostroAccountFilter) {
    this.isReload$.next(true);
    this.nostroAccountService.getList(e);
  }

  editNostrAccount(nostroAccountElement: any, i: any) {
    nostroAccountElement.get('nostroAccountRows').at(i).get('isEditable').patchValue(false);
    this.editNostroAccountId = nostroAccountElement.get('nostroAccountRows').at(i).get('nostroId').value;
  }

  isEditingNostroAccount(nostroId: number): boolean {
    return this.editNostroAccountId === nostroId;
  }

  // On click of correct button in table (after click on edit) this method will call
  saveNostrAccount(nostroAccountElement: any, i: any) {
    // nostroAccountElement.get('nostroAccountRows').at(i).get('isEditable').patchValue(true);

    const nostroAccount = nostroAccountElement.get('nostroAccountRows').at(i).value;
    if (nostroAccount.nostroId != -1) {
      nostroAccount.usrUpd = 'USER';
      nostroAccount.datUpd = new Date();
      this.nostroAccountService.update(nostroAccount.nostroId, nostroAccount);
    } else {
      this.nostroAccountService.create(nostroAccount);
    }

    this.editNostroAccountId = -1;
  }

  // On click of cancel button in the table (after click on edit) this method will call and reset the previous data
  cancelEditing(nostroAccountElement: any, i: any) {
    nostroAccountElement.get('nostroAccountRows').at(i).get('isEditable').patchValue(true);
    if (this.editNostroAccountId === -1) {
      this.dataSource.data.splice(i, 1);
      this.dataSource = new MatTableDataSource<NostroAccount>(this.dataSource.data);
    }

    this.editNostroAccountId = -1;
  }

  addNewNostroAccount() {
    const nostroAccount = this.nostroAccountForm.get('nostroAccountRows') as FormArray;

    // Check if other nostro account in edit mode
    if (this.editNostroAccountId != -1) {
      nostroAccount.at(0).get('isEditable')!.patchValue(true);
      this.editNostroAccountId = -1;
    }

    nostroAccount.insert(0, this.initForm());
    this.dataSource = new MatTableDataSource(nostroAccount.controls);
  }

  deleteNostroAccount(nostroAccountElement: any, i: any) {
    this.nostroAccountService.delete(
      nostroAccountElement.get('nostroAccountRows').at(i).value.nostroId,
      nostroAccountElement.get('nostroAccountRows').at(i).value
    );
  }

  getvalidator(nostroAccountElement: any, i: any) {
    const validator = nostroAccountElement
      .get('nostroAccountRows')
      .at(i)
      .get('bbgCode')
      .validator({} as AbstractControl);

    if (validator && validator.required) {
      return true;
    }
  }

  initForm(): FormGroup {
    return this.fb.group({
      nostroId: new FormControl(-1),
      bbgCode: new FormControl(''),
      secAcc: new FormControl(''),
      cpty: new FormControl(''),
      usrIns: new FormControl('USER'),
      datIns: new FormControl(new Date()),
      usrUpd: new FormControl(null),
      datUpd: new FormControl(null),
      stat: new FormControl('A'),
      action: new FormControl('newRecord'),
      isEditable: new FormControl(false),
      isNewRow: new FormControl(true),
    });
  }
}
