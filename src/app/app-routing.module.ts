import { ReactiveComponentComponent } from './modules/reactive-component/reactive-component.component';
import { ReactiveFormComponent } from './modules/reactive-form/reactive-form.component';
import { StatePatternComponent } from './modules/state-pattern/components/state-pattern/state-pattern.component';
import { SimpleTableComponent } from './modules/simple-table/simple-table/simple-table.component';
import { NostroaccountListComponent } from './modules/nostro-account/components/nostroaccount/nostroaccount-list/nostroaccount-list.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CdComponent } from './modules/cd/cd/cd.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { FacadesWithRxjsComponent } from './modules/facadesWithRxjs/facadesWithRxjs.component';
import { FoodFormComponent } from './modules/food/food-form/food-form.component';
import { FoodListComponent } from './modules/food/food-list/food-list.component';
import { FormComponent } from './modules/form/form.component';
import { PlaygroundComponent } from './modules/playground/playground.component';
import { TableComponent } from './modules/table/table.component';
import { NavComponent } from './nav/nav.component';
import { MemoryGameComponent } from './modules/memory-game/memory-game.component';

const routes: Routes = [
  { path: '', redirectTo: '/nav', pathMatch: 'full' },
  {
    path: 'nav',
    component: NavComponent,
    children: [
      { path: 'table', component: TableComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'events', component: FormComponent },
      { path: 'reactive-form', component: ReactiveFormComponent },
      { path: 'reactive-component', component: ReactiveComponentComponent },
      { path: 'food', component: FoodListComponent },
      { path: 'food/add', component: FoodFormComponent },
      { path: 'playground', component: PlaygroundComponent },
      { path: 'facade', component: FacadesWithRxjsComponent },
      { path: 'ngZone', component: CdComponent },
      { path: 'nostro', component: NostroaccountListComponent },
      { path: 'memory', component: MemoryGameComponent },
      { path: 'simpleTable', component: SimpleTableComponent },
      { path: 'statepattern', component: StatePatternComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
