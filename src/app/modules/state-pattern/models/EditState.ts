import { State } from './State';

/**
 * Concrete States implement various behaviors, associated with a state of the
 * Context.
 */
export class EditState extends State {
  public execute(): void {
    console.log('EditState handles');
  }
}
