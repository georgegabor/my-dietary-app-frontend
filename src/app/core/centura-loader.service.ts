import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CenturaLoaderService {
  isLoading = new Subject<boolean>();

  show() {
    // setTimeout is needed in order to prevent ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      this.isLoading.next(true);
    }, 0);
  }

  hide() {
    // same here
    setTimeout(() => {
      this.isLoading.next(false);
    }, 0);
  }
}
