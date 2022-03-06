import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { DashboardComponent } from './modules/dashboard/dashboard.component'
import { FormComponent } from './modules/form/form.component'
import { Form2Component } from './modules/form2/form2.component'
import { NavComponent } from './modules/nav/nav.component'
import { TableComponent } from './modules/table/table.component'

const routes: Routes = [
  { path: '', redirectTo: '/nav', pathMatch: 'full' },
  {
    path: 'nav',
    component: NavComponent,
    children: [
      { path: 'table', component: TableComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'events', component: FormComponent },
      { path: 'ingredients', component: Form2Component },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
