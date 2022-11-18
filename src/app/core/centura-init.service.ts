import { Injectable } from "@angular/core";
import { CenturaInit } from "@app/shared/models/CenturaInit";

@Injectable({
  providedIn: "root",
})
export class CenturaInitService {
  centuraInit: CenturaInit;

  constructor() {}

  getCenturaInit(): CenturaInit {
    return this.centuraInit;
  }

  setCenturaInit(centuraInit: CenturaInit) {
    this.centuraInit = centuraInit;
  }
}
