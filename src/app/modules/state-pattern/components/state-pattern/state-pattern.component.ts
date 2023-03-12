import { Component } from '@angular/core';
import { StatePatternService } from './../../services/state-pattern.service';

@Component({
  selector: 'app-state-pattern',
  templateUrl: './state-pattern.component.html',
  styleUrls: ['./state-pattern.component.scss'],
  providers: [StatePatternService],
})
export class StatePatternComponent {
  constructor(private readonly statePatternService: StatePatternService) {}

  onCreate() {
    this.statePatternService.create();
  }

  onEdit() {
    this.statePatternService.edit();
  }
}
