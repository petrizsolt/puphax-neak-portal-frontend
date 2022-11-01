import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { environment } from './../environments/environment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PuphaxDataService {

  constructor(private http:HttpClient) { }

  public getTotalPagable<ENTITY>(page:number, size:number, tableName:string, field:string, value:string) : Observable<Array<ENTITY>> {
    let req = this.getUrlAndParamsPagable(page, size, tableName, field, value);
    let params = req.params;
    return this.http.get<Array<ENTITY>>(req.url, {params});
  }

  public getTableSize(tableName:string, field:string, value:string) : Observable<number> {
    const fullUrl = environment.portalApiUrl + environment.portalTableSize.replace('{tableName}', tableName);
    if(field !== null && value !== null) {
      const params = new HttpParams()
        .set('field', field)
        .set('value', value);
      return this.http.get<number>(fullUrl, {params});
    } 
    return this.http.get<number>(fullUrl);
  }

  private getUrlAndParamsPagable(page :number, size :number, tableName :string, field:string, value:string) {
    var params = new HttpParams()
      .set('page', page)
      .set('size', size);

    console.log('Params:'+ field + ' ' + value)  ;
    if(field !== null && value !== null) {
      params = params.set('field', field);
      params = params.set('value', value);

    }
    const endpoint = environment.portalPageData.replace('{tableName}', tableName) + '?';

    const fullUrl = environment.portalApiUrl + endpoint;
    return {params: params, url: fullUrl};
  }




}
