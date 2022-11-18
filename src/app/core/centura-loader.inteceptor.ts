import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { combineLatest, Observable, timer } from "rxjs";
import { finalize, map } from "rxjs/operators";
import { CenturaLoaderService } from "./centura-loader.service";

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  private activeRequests: number;
  private delay = 500;

  constructor(public loaderService: CenturaLoaderService) {
    this.activeRequests = 0;
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.activeRequests === 0) {
      this.loaderService.show();
    }

    this.activeRequests++;

    /* Adds a bit of delay. If the backend response is too fast, the loader/spinner appears then disappears too quickly which has this very annoying/flickering/stroboscopic effect */
    return combineLatest([timer(this.delay), next.handle(req)]).pipe(
      map((x) => x[1]),
      finalize(() => {
        this.activeRequests--;

        console.log("finalize " + req.url);

        if (this.activeRequests === 0) {
          this.loaderService.hide();
        }
      })
    );
  }
}
