import { NgModule } from '@angular/core';
import { MaterialModule } from 'src/app/material/material/material.module';
import { EditableTableComponent } from 'src/app/shared/components/editable-table/editable-table/editable-table.component';
import { NostroaccountFilterFormComponent } from './components/nostroaccount/nostroaccount-filter-form/nostroaccount-filter-form.component';
import { NostroaccountListComponent } from './components/nostroaccount/nostroaccount-list/nostroaccount-list.component';

const NOSTRO_ACCOUNT_COMPONENTS = [NostroaccountFilterFormComponent, NostroaccountListComponent];

@NgModule({
  declarations: [NOSTRO_ACCOUNT_COMPONENTS, EditableTableComponent],
  exports: [NOSTRO_ACCOUNT_COMPONENTS],
  entryComponents: [],
  imports: [MaterialModule],
})
export class NostroAccountModule {}
