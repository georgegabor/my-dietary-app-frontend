import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { MaterialModule } from './material/material/material.module'
import { DashboardComponent } from './modules/dashboard/dashboard.component'
import { FormComponent } from './modules/form/form.component'
import { NavComponent } from './modules/nav/nav.component'
import { TableComponent } from './modules/table/table.component'

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    DashboardComponent,
    TableComponent,
    FormComponent,
  ],
  imports: [AppRoutingModule, MaterialModule, ReactiveFormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
