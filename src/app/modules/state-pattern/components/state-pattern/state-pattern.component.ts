import { StatePatternService } from './../../services/state-pattern.service';
import { Component, OnInit } from '@angular/core';
import { ConcreteStateA } from '../../models/ConcreteStateA';

@Component({
  selector: 'app-state-pattern',
  templateUrl: './state-pattern.component.html',
  styleUrls: ['./state-pattern.component.scss'],
  providers: [StatePatternService],
})
export class StatePatternComponent implements OnInit {
  constructor(private readonly statePatternService: StatePatternService) {}

  ngOnInit() {
    this.statePatternService.setState(new ConcreteStateA());
    this.statePatternService.request1();
    this.statePatternService.request2();
  }
}
