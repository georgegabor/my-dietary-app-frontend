import { Injectable, NgZone } from '@angular/core';
import { filter, map, merge, pairwise, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChangeDetectionProfilerService {
  constructor(private zone: NgZone) {
    const unstableLatest$ = zone.onUnstable.pipe(
      map(() => {
        return {
          type: 'unstable',
          time: performance.now(),
        };
      })
    );

    const stableLatest$ = zone.onStable.pipe(
      map(() => {
        return {
          type: 'stable',
          time: performance.now(),
        };
      })
    );

    merge(unstableLatest$, stableLatest$)
      .pipe(
        pairwise(),
        filter((eventPair) => eventPair[1].type === 'stable'),
        map((eventPair) => eventPair[1].time - eventPair[0].time),
        // tap(() => console.log(this)),
        tap((timing) => {
          console.log(`Change Detection took ${timing.toLocaleString()} ms`);
        })
      )
      .subscribe();
  }
}
