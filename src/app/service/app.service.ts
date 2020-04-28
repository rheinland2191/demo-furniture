import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  constructor(
    private http: HttpClient,
  ) {

  }

  // getData() {
  //   return this.http.get('http://www.mocky.io/v2/5c9105cb330000112b649af8')     
  //   .pipe(
  //      retry(1),
  //      catchError(this.handleError)
  //    );;
  // }

  
  getData() {
    return this.http.get('http://www.mocky.io/v2/5c9105cb330000112b649af8',{observe: 'response'});
  }
   handleError(error) {
   let errorMessage = '';
   if (error.error instanceof ErrorEvent) {
     // client-side error
     errorMessage = `Error: ${error.error.message}`;
   } else {
     // server-side error
     errorMessage = `${error.error.details}`;
   }
   window.alert(errorMessage);
   return throwError(errorMessage);
 }
}
