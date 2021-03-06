import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material/material/material.module';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { FoodModule } from './modules/food/food.module';
import { FormComponent } from './modules/form/form.component';
import { Form2Component } from './modules/form2/form2.component';
import { Form3Component } from './modules/form3/form3.component';
import { TableComponent } from './modules/table/table.component';
import { NavComponent } from './nav/nav.component';

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
    HttpClientModule,
    AppRoutingModule,
    MaterialModule,
    FoodModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
