import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';

@Injectable()
export class ErrorService {

    public handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
          // TODO: send the error to remote logging infrastructure
          console.log((<Error>error).message); // log to console instead
          // Let the app keep running by returning an empty result.
            result['error'] = (<Error>error).message;
          return of(result as T);
        };
      }
    }
