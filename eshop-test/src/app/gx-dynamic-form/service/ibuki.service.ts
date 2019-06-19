import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

@Injectable()
export class IbukiService {
  subject: Subject<any>;
  behSubject: BehaviorSubject<any>;
  settings: any = {};
  messages = {
    idNotMappedToUrl: 'Message id is not mapped to http url in config.ts file at application root.',
    httpGetUnknownError: 'Unknown error encountered while making http get request'
  };

  constructor(private httpClient: HttpClient) {
    this.subject = new Subject();
    this.behSubject = new BehaviorSubject(0);
  }

  emit(id: string, options?: any) {
    this
      .subject
      .next({ id: id, data: options });
  }

  filterOn(id: string): Observable<any> {
    return (this.subject.filter(d => (d.id === id)));
  }

  behEmit(id: string, options?: any) {
    this.behSubject.next({ id: id, data: options });
  }

  behFilterOn(id: string) {
    return (this.behSubject.filter(d => (d.id === id)));
  }

  httpPost$(url: string) {
    const obs = this.httpClient
      .post(url, null);
    return (obs);
  }

  httpPost(id: string, body?: any, queryParams?: {}, carryBag?: any) {
    const url = this.getHttpUrl(id);
    body = body || {};
    const a = body.id || (body.id = id);
    if (queryParams) {
      let httpParams = new HttpParams();
      httpParams = Object
        .keys(queryParams)
        .reduce((prev, x, i) => {
          httpParams = httpParams.append(x, queryParams[x]);
          return (httpParams);
        }, httpParams);
      queryParams = httpParams;
    }
    this
      .httpClient
      .post(url, body, { params: queryParams })
      .subscribe(d => {
        this
          .subject
          .next({ id: id, data: d, body: body, carryBag: carryBag });
      }, err => {
        this
          .subject
          .next({ id: id, error: err });
      });
  }

  init(_settings) {
    this.settings = _settings;
  }
  getHttpUrl = (id) => {
    const host = this.settings.host.replace(/\/$/, '');
    let url = this.settings[id];
    const a = url || (url = this.settings['defaultEndPoint']);
    const b = url && (url = url.replace(/^,/, ''));
    url = host.concat('/', url);
    return (url);
  }

  httpGet(id: string, queryParams?: {}) {
    try {
      const url = this.getHttpUrl(id);
      let httpParams = new HttpParams();
      httpParams = queryParams && (Object.keys(queryParams).reduce((prevValue, x, i) => {
        httpParams = httpParams.append(x, queryParams[x]);
        return (httpParams);
      }, httpParams));
      if (url) {
        this
          .httpClient
          .get(url, { params: httpParams })
          .subscribe(d => {
            this
              .subject
              .next({ id: id, data: d });
          }, err => {
            this.subject.next({ id: id, error: err });
          });
      } else {
        this
          .subject
          .next({ id: id, error: this.messages.idNotMappedToUrl });
      }
    } catch (err) {
      this
        .subject
        .next({ id: id, error: this.messages.httpGetUnknownError });
    }
  }
}
