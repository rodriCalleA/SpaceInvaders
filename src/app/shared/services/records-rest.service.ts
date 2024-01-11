import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Record } from '../model/app.record';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class RecordsRestService {
  constructor(private http: HttpClient, private auth: AuthService) {}

  getRecords(): Observable<Record[]> {
    let url = 'http://wd.etsisi.upm.es:10000/records';
    return this.http
      .get<any[]>(url)
      .pipe(map((data) => data.map((recordData) => new Record(recordData))));
  }

  getRecordsByUserName(): Observable<Record[]> | null {
    let authorization = this.auth.getLocalAuthorization();
    if (authorization == null) {
      return null;
    }
    let url = `http://wd.etsisi.upm.es:10000/records/${authorization.username}`;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', authorization.token);
    try {
      return this.http.get<any[]>(url, { headers }).pipe(
        map((data) => data.map((recordData) => new Record(recordData))),
        catchError((error: any) => {
          console.error(error);
          throw error;
        })
      );
    } catch (error) {
      return null;
    }
  }

  postUserRecords(record: any): Observable<any> | null {
    let authorization = this.auth.getLocalAuthorization();
    if (authorization == null) {
      return null;
    }
    let url = `http://wd.etsisi.upm.es:10000/records`;
    let headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', authorization.token);
      console.log(record);
    return this.http.post(url, record, { headers });
  }

  deleteUserRecords(): Observable<any> | null {
    let authorization = this.auth.getLocalAuthorization();
    if (authorization == null) {
      return null;
    }
    let url = `http://wd.etsisi.upm.es:10000/records`;
    let headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', authorization.token);
    return this.http.delete(url, { headers });
  }
}
