import { TableComponent } from './table/table.component';
import { NavComponent } from './nav/nav.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  { path: '', redirectTo: '/nav', pathMatch: 'full' },
  { path: 'nav', component: NavComponent,
  children: [
    { path: 'table', component: TableComponent },
    { path: 'dashboard', component: DashboardComponent },
  ]
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
