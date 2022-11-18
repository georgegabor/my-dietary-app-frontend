import { NgModule } from '@angular/core';
import { MaterialModule } from 'src/app/material/material/material.module';
import { NostroaccountFilterFormComponent } from './components/nostroaccount/nostroaccount-filter-form/nostroaccount-filter-form.component';
import { NostroaccountListComponent } from './components/nostroaccount/nostroaccount-list/nostroaccount-list.component';

const NOSTRO_ACCOUNT_COMPONENTS = [NostroaccountFilterFormComponent, NostroaccountListComponent];

@NgModule({
  declarations: [NOSTRO_ACCOUNT_COMPONENTS],
  imports: [MaterialModule],
  exports: [NOSTRO_ACCOUNT_COMPONENTS],
  entryComponents: [],
})
export class NostroAccountModule {}
