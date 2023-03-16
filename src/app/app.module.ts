import { TableExtendsSubjectComponent } from './modules/table-extends-subject/table-extends-subject.component';
import { SimpleTableComponent } from './modules/simple-table/simple-table/simple-table.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApplicationRef, NgModule } from '@angular/core';
import { DefaultValueAccessor } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material/material/material.module';
import { CdComponent } from './modules/cd/cd/cd.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { FacadesWithRxjsComponent } from './modules/facadesWithRxjs/facadesWithRxjs.component';
import { FoodModule } from './modules/food/food.module';
import { FormComponent } from './modules/form/form.component';
import { Form2Component } from './modules/form2/form2.component';
import { Form3Component } from './modules/form3/form3.component';
import { MemoryGameComponent } from './modules/memory-game/memory-game.component';
import { NostroAccountModule } from './modules/nostro-account/nostro-account.module';
import { PlaygroundComponent } from './modules/playground/playground.component';
import { TableComponent } from './modules/table/table.component';
import { NavComponent } from './nav/nav.component';
import { ChangeDetectionProfilerService } from './shared/services/change-detection-profiler.service';
import { LoaderInterceptor } from './core/centura-loader.inteceptor';
import { CenturaErrorInterceptor } from './core/centura-error.interceptor';
import { StatePatternComponent } from './modules/state-pattern/components/state-pattern/state-pattern.component';
import { EditableTableComponent } from './shared/components/editable-table/editable-table/editable-table.component';
import { ReactiveFormComponent } from './modules/reactive-form/reactive-form.component';
import { ReactiveComponentComponent } from './modules/reactive-component/reactive-component.component';

const original = DefaultValueAccessor.prototype.registerOnChange;

DefaultValueAccessor.prototype.registerOnChange = function (fn) {
  return original.call(this, (value) => {
    const trimmed = typeof value === 'string' ? value.trim() : value;
    return fn(trimmed);
  });
};

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    DashboardComponent,
    TableComponent,
    FormComponent,
    Form2Component,
    Form3Component,
    PlaygroundComponent,
    FacadesWithRxjsComponent,
    CdComponent,
    MemoryGameComponent,
    SimpleTableComponent,
    StatePatternComponent,
    ReactiveFormComponent,
    ReactiveComponentComponent,
    TableExtendsSubjectComponent,
  ],
  imports: [
    HttpClientModule,
    AppRoutingModule,
    MaterialModule,
    FoodModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    NostroAccountModule,
  ],
  exports: [],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CenturaErrorInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  // constructor(private cd: ChangeDetectionProfilerService) {}
  // in Devtools use cmd:
  // ng.probe($0).injector.get(ng.coreTokens.ApplicationRef).tick()
  // constructor(applicationRef: ApplicationRef) {
  //   const originalTick = applicationRef.tick;
  //   applicationRef.tick = function () {
  //     const windowPerfomance = window.performance;
  //     const before = windowPerfomance.now();
  //     const retValue = originalTick.apply(this, []);
  //     const after = windowPerfomance.now();
  //     const runTime = after - before;
  //     window.console.log('CHANGE DETECTION TIME', runTime);
  //     return retValue;
  //   };
  // }
}
