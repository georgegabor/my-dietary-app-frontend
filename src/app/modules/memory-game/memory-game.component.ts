import { takeUntil } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  EMPTY,
  from,
  fromEvent,
  generate,
  interval,
  map,
  merge,
  noop,
  pluck,
  scan,
  sequenceEqual,
  Subject,
  Subscription,
  switchMap,
  take,
  tap,
} from 'rxjs';

@Component({
  selector: 'app-memory-game',
  templateUrl: './memory-game.component.html',
  styleUrls: ['./memory-game.component.scss'],
})
export class MemoryGameComponent implements OnInit, OnDestroy {
  private _destroy = new Subject<void>();
  constructor(@Inject(DOCUMENT) private _document: Document) {}

  ngOnInit() {
    const random = (): number => Math.floor(Math.random() * Math.floor(8));
    const setInfo = (text: string) => (this._document.getElementById('info').innerHTML = text);
    const displayLevelChange = () =>
      this._document.querySelectorAll('.child').forEach((c: HTMLElement) => (c.style.background = 'gray'));

    const checkIfGameOver$ = (randomSequence: number[], userSequence: number[]) => {
      console.log('randomSequence: ' + randomSequence);
      console.log('userSequence: ' + userSequence);

      return from(userSequence).pipe(
        sequenceEqual(from(randomSequence)),
        tap((match) => (!match && userSequence.length === randomSequence.length ? setInfo('GAME OVER!') : noop))
      );
    };

    const takePlayerInput$ = (randomSequence: number[]) =>
      fromEvent(this._document, 'click').pipe(
        take(randomSequence.length),
        scan((acc: number[], curr: MouseEvent) => [...acc, parseInt(curr.target['id'])], []),
        switchMap((userSequence) => checkIfGameOver$(randomSequence, userSequence)),
        switchMap((result) => (result ? (displayLevelChange(), memoryGame$(randomSequence.length + 1)) : EMPTY))
      );

    const showSequenceToMemorize$ = (memorySize: number, randomSequence: number[]) =>
      interval(1000).pipe(
        // tap(console.log),
        tap((i) => setInfo(i === memorySize - 1 ? `YOUR TURN` : `${memorySize - i} elements`)),
        take(randomSequence.length),
        map((index) => randomSequence[index]),
        tap((value) => this._document.getElementById(`${value}`).click()),
        switchMap(() => takePlayerInput$(randomSequence))
      );

    const memoryGame$ = (memorySize) =>
      generate(
        1,
        (x) => x <= memorySize,
        (x) => x + 1
      ).pipe(
        scan((acc: number[], _: number): number[] => [...acc, random() + 1], []),
        switchMap((randomSequence) => showSequenceToMemorize$(memorySize, randomSequence))
      );

    const elementClick$ = (event: string, color: string) =>
      fromEvent(this._document.querySelectorAll('.child'), event).pipe(
        pluck('srcElement'),
        tap((e: HTMLElement) => (e.style.background = color))
      );

    const clicks$ = merge(elementClick$('click', 'lightgray'), elementClick$('transitionend', 'white'));

    const game$ = merge(clicks$, memoryGame$(2));
    game$.pipe(takeUntil(this._destroy)).subscribe();
  }

  ngOnDestroy(): void {
    this._destroy.next();
  }
}
