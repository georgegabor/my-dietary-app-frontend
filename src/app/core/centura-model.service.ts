import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CenturaHttpClientService } from './centura-http-client.service';

@Injectable({
  providedIn: 'root',
})
export abstract class CenturaModelService<M> {
  centuraHttpClientService: CenturaHttpClientService;

  constructor(centuraHttpClientService: CenturaHttpClientService) {
    this.centuraHttpClientService = centuraHttpClientService;
  }

  getList(url: string): Observable<M[]> {
    return this.centuraHttpClientService.getList(url);
  }

  getListByRequestParams(url: string, form: any): Observable<M[]> {
    return this.centuraHttpClientService.getByRequestParams(url, form);
  }

  get(url: string): Observable<M> {
    return this.centuraHttpClientService.get(url);
  }

  getByRequestParams(url: string, form: any): Observable<M> {
    return this.centuraHttpClientService.getByRequestParams(url, form);
  }

  create(url: string, model: M): Observable<M> {
    return this.centuraHttpClientService.post(url, model);
  }

  update(url: string, id: number, model: M): Observable<M> {
    return this.centuraHttpClientService.put(url, id, model);
  }

  delete(url: string, model: M): Observable<string> {
    return this.centuraHttpClientService.delete(url, model);
  }

  deleteById(url: string): Observable<string> {
    return this.centuraHttpClientService.deleteById(url);
  }
}
