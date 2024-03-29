import { State } from './State';

/**
 * The Context defines the interface of interest to clients. It also maintains a
 * reference to an instance of a State subclass, which represents the current
 * state of the Context.
 */
export class Context {
  /**
   * @type {State} A reference to the current state of the Context.
   */
  private _state: State;

  constructor(state: State) {
    this.transitionTo(state);
  }

  /**
   * The Context allows changing the State object at runtime.
   */
  public transitionTo(state: State): void {
    console.log(`Context: Transition to ${(<any>state).constructor.name}.`);
    this._state = state;
    this._state.setContext(this);
  }

  /**
   * The Context delegates part of its behavior to the current State object.
   */
  public execute(): void {
    this._state.execute();
  }
}
