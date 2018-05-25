import { PersonJob } from './../models/personjob.model';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { environment } from './../../../environments/environment';
import { map } from 'rxjs/operators';
import { Job } from './../models/job.model';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';

@Injectable()
export class JobService implements OnInit {

    private jobSubscription: Subscription = Subscription.EMPTY;
    public jobsLoaded:  BehaviorSubject<boolean> = new BehaviorSubject(false);

    public selectedJob: BehaviorSubject<Job> = new BehaviorSubject(new Job({}));
    public selectedPersonJobs: BehaviorSubject<PersonJob[]> = new BehaviorSubject([]);
    public jobs: BehaviorSubject<Job[]> = new BehaviorSubject([]);

    private jobsUrl = environment.apiUrl + '/interim/API/jobs/';

    private _jobs: Job[] = []
    private _personJobs: PersonJob[] = [];
    ngOnInit(): void {
    }
    
    constructor(private httpClient: HttpClient) {
        this.jobSubscription = this.getJobs().subscribe((jobs) => 
            {
                this.jobs.next(jobs);
                this.jobsLoaded.next(true);
            });        
    }

    getJobs(): Observable<Job[]> {
        return this.httpClient.get<Job[]>(this.jobsUrl).pipe(
            map(
                (jobs) => {
                    for (const job of jobs) {
                        this._jobs.push(new Job(job));
                    }
                    return this._jobs;
                }
            ));
    }

    getJob(jobId: number) : Job {
        return this._jobs.find(job => job.id === jobId);
    }
    
    setPersonJobs(personJobs: PersonJob[]){
        this._personJobs = personJobs;
        this.selectedPersonJobs.next(this._personJobs);
    }
    addPersonJob(pJob:PersonJob) {
        this._personJobs.push(pJob);
        this.selectedPersonJobs.next(this._personJobs);
    }
}
