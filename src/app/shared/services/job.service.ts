import { Job } from './../models/job.model';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class JobService {
    constructor(private httpClient: HttpClient) {}
    private jobsUrl = '/interim/API/jobs';



    getJobs(): Observable<Job[]> {
        return this.httpClient.get<Job[]>(this.jobsUrl)
            .map(
                (jobs) => {
                    const jobsTmp: Job[] = [];
                    for (const job of jobs) {
                        const jobTmp: Job = new Job(job);
                        jobsTmp.push(jobTmp);
                    }
                    return jobsTmp;
                }
            );
    }
}
