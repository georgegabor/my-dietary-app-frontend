import { NgModule } from '@angular/core'
import { FlexLayoutModule } from '@angular/flex-layout'
import { ReactiveFormsModule } from '@angular/forms'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { MaterialModule } from './material/material/material.module'
import { DashboardComponent } from './modules/dashboard/dashboard.component'
import { FormComponent } from './modules/form/form.component'
import { Form2Component } from './modules/form2/form2.component'
import { Form3Component } from './modules/form3/form3.component'
import { NavComponent } from './modules/nav/nav.component'
import { TableComponent } from './modules/table/table.component'

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    DashboardComponent,
    TableComponent,
    FormComponent,
    Form2Component,
    Form3Component,
  ],
  imports: [
    AppRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FlexLayoutModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
