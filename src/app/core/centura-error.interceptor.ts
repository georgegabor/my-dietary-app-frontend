import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { EMPTY, Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { CenturaErrorHandlerService } from "./centura-error-handler.service";

@Injectable()
export class CenturaErrorInterceptor implements HttpInterceptor {
  constructor(public errorHandlerService: CenturaErrorHandlerService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        this.errorHandlerService.handleError(error);
        return EMPTY;
      })
    );
  }
}
