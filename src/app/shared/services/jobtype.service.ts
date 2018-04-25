import { Injectable } from '@angular/core';
import { JobType } from './../models/jobtype.model';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class JobTypeService {
    constructor (private httpClient: HttpClient) {}
    private jobtypeUrl = 'interim/API/jobtypes/';

    getJobTypes(): Observable<JobType[]> {
        return this.httpClient.get<JobType[]>(this.jobtypeUrl);
    }
}
