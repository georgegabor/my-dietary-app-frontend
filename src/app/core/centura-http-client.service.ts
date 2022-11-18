import { formatDate } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigService } from '@app/app.config';
import { CenturaConstants } from '@app/core/util/CenturaConstants';
import * as moment from 'moment';
import { Cookie } from 'ng2-cookies';
import { Observable, of } from 'rxjs';
import { Trade } from '@app/modules/trade/models/Trade';



@Injectable({
  providedIn: 'root',
})
@Injectable()
export class CenturaHttpClientService {
  protected apiServer = AppConfigService.settings.apiServer;

  restRoot = '';

  constructor(private http: HttpClient) {}

  getListByRequestParams(url: string, form: any): Observable<any[]> {
    const httpHeaders = this.manageHeaders();
    const httpParams = this.manageParams(form);
    return this.http.get<any>(this.apiServer.baseUrl + this.restRoot + '/' + url, {
      headers: httpHeaders,
      params: httpParams,
    });
  }

  getList(url: string): Observable<any[]> {
    const httpHeaders = this.manageHeaders();
    console.log(this.apiServer.baseUrl + this.restRoot + '/' + url);
    
    return this.http.get<any>(this.apiServer.baseUrl + this.restRoot + '/' + url, { headers: httpHeaders });
  }

  getListPost(url: string, model: any): Observable<any[]> {
    const httpHeaders = this.manageHeaders();
    return this.http.post<any>(this.apiServer.baseUrl + this.restRoot + '/' + url, model, { headers: httpHeaders });
  }

  get(url: string): Observable<any> {
    const httpHeaders = this.manageHeaders();
    return this.http.get<any>(this.apiServer.baseUrl + this.restRoot + '/' + url, { headers: httpHeaders });
  }

  getByRequestParams(url: string, form: any): Observable<any> {
    const httpHeaders = this.manageHeaders();
    const httpParams = this.manageParams(form);
    return this.http.get<any>(this.apiServer.baseUrl + this.restRoot + '/' + url, {
      headers: httpHeaders,
      params: httpParams,
    });
  }

  post(url: string, model: any): Observable<any> {
    const httpHeaders = this.manageHeaders();
    return this.http.post<any>(this.apiServer.baseUrl + this.restRoot + '/' + url, model, { headers: httpHeaders });
  }

  put(url: string, id: any, model: any): Observable<any> {
    const httpHeaders = this.manageHeaders();
    return this.http.put<any>(this.apiServer.baseUrl + this.restRoot + '/' + url + '/' + id, model, {
      headers: httpHeaders,
    });
  }

  delete(url: string, form: any): Observable<any> {
    const httpHeaders = this.manageHeaders();
    return this.http.request('DELETE', this.apiServer.baseUrl + this.restRoot + '/' + url, {
      body: form,
      headers: httpHeaders,
    });
  }

  

  deleteById(url: string): Observable<any> {
    const httpHeaders = this.manageHeaders();
    return this.http.delete<any>(this.apiServer.baseUrl + this.restRoot + '/' + url, { headers: httpHeaders });
  }

  private manageHeaders(): HttpHeaders {
    // Cache-control: "no-cache" ?
    const httpHeaders = new HttpHeaders({
      Authorization: 'Bearer ' + Cookie.get(CenturaConstants.TOKEN_NAME),
      Pragma: 'no-cache',
      Expires: 'Sat, 01 Jan 2000 00:00:00 GMT',
    });
    return httpHeaders;
  }

  private manageParams(form: any): HttpParams {
    let httpParams = new HttpParams();
    for (const key in form) {
      if (form[key] !== undefined && form[key] !== null && key !== 'constructor') {
        const value = form[key];
        if (value instanceof Date) {
          const valueS = formatDate(value, 'dd.MM.yyyy', 'EN');
          httpParams = httpParams.append(key, valueS);
        } else if (moment.isMoment(value)) {
          const valueDate: Date = moment(value).toDate();
          const valueS = formatDate(valueDate, 'dd.MM.yyyy', 'EN');
          httpParams = httpParams.append(key, valueS);
        } else {
          httpParams = httpParams.append(key, form[key]);
        }
      }
    }
    return httpParams;
  }



  getTradeList_TEST(url: string): Observable<Trade[]> {


    var routingData : Trade[] = [];


    for (let i = 1; i <= 30; i++) {
      let routing = new Trade();
      routing.tradeId = "Trade-" + i;
      routing.tradeCurrency ="USD-" + i;
      routingData.push(routing);
   //   console.log("trade-id, ", routing.tradeId);
    }

 //   return routingData;
    return of( routingData );
  


    const httpHeaders = this.manageHeaders();
    return this.http.get<any>(this.apiServer.baseUrl + this.restRoot + '/' + url, { headers: httpHeaders });
  }
}
