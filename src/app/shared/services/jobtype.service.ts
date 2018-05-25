import { catchError } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { environment } from './../../../environments/environment';
import { Injectable, OnDestroy } from '@angular/core';
import { JobType } from './../models/jobtype.model';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { ErrorService } from './error.service';


@Injectable()
export class JobTypeService {

    private jobtypeUrl = environment.apiUrl + '/interim/API/jobtypes/';
    private _jobtypes: JobType[] = [];    
    private jobtypesSubscription: Subscription = Subscription.EMPTY;
    public jobTypes: BehaviorSubject<JobType[]> = new BehaviorSubject([]);


    getJobTypes(): Observable<JobType[]> {
        return this.httpClient.get<JobType[]>(this.jobtypeUrl).pipe(
            catchError(this.errorService.handleError('getJobTypes', []))
        );
    }

    constructor (
        private httpClient: HttpClient,
        private errorService: ErrorService
    ) {
        this.jobtypesSubscription = this.getJobTypes().subscribe(
            jobtypes => {
                this._jobtypes = jobtypes;
                this.jobTypes.next(this._jobtypes);
            }
        )
    }

}
