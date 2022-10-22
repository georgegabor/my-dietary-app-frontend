import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { UserFacade, UserState } from './user.facade';

@Component({
  selector: 'app-facadesWithRxjs',
  templateUrl: './facadesWithRxjs.component.html',
  styleUrls: ['./facadesWithRxjs.component.scss'],
})
export class FacadesWithRxjsComponent implements OnInit {
  searchTerm!: FormControl;
  showButton = true;
  vm$: Observable<UserState> = this.facade.vm$;

  constructor(public facade: UserFacade) {}

  ngOnInit() {
    const { criteria } = this.facade.getStateSnapshot();

    this.searchTerm = this.facade.buildSearchTermControl();
    this.searchTerm.patchValue(criteria, { emitEvent: false });
  }

  getPageSize() {
    this.showButton = false;
  }
}
