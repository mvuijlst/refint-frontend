import { environment } from './../../../environments/environment';
import { map, tap, shareReplay } from 'rxjs/operators';
import { PersonJob } from './../models/personjob.model';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';

@Injectable()
export class PersonJobService {

    
    private personJobsUrl = environment.apiUrl + '/interim/API/personjobs/';
    
    constructor(private httpClient: HttpClient,
        private datepipe: DatePipe
) {}

    getPersonJobs(personid: number): Observable<PersonJob[]> {
        return this.httpClient.get<PersonJob[]>(this.personJobsUrl + '?id=' + personid.toString()).pipe(
            map(
                (personjobs) => {
                    const jobs: PersonJob[] = [];
                    for (const job of personjobs) {
                        jobs.push(new PersonJob(job));
                    }
                    return jobs;
                }
            ),
        );
    }

    getJobPersonJobs(jobid: number): Observable<PersonJob[]>{
        return this.httpClient.get<PersonJob[]>(this.personJobsUrl + '?jobid=' + jobid.toString()).pipe(
            map(
                (personjobs) => {
                    const jobs: PersonJob[] = [];
                    for (const job of personjobs) {
                        jobs.push(new PersonJob(job));
                    }
                    return jobs;
                }
            ),
        );
        
    }

    savePersonJob(personjob:any): Observable<any>{
        const newpj = personjob
        newpj['datefrom'] = this.datepipe.transform(personjob.datefrom, "yyyy-MM-dd");
        newpj['dateuntil'] = this.datepipe.transform(personjob.dateuntil, "yyyy-MM-dd");
        newpj['job'] = personjob.job.id;
        return this.httpClient.post(this.personJobsUrl, newpj);

    }
}