import { NgModule } from '@angular/core'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { DashboardComponent } from './dashboard/dashboard.component'
import { MaterialModule } from './material/material/material.module'
import { NavComponent } from './nav/nav.component'
import { TableComponent } from './table/table.component'

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    DashboardComponent,
    TableComponent,
  ],
  imports: [AppRoutingModule, MaterialModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
