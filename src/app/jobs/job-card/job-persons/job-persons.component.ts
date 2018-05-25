import { SideNavService } from './../../../shared/services/sidenav.service';
import { Router } from '@angular/router';
import { PersonJob } from './../../../shared/models/personjob.model';
import { PersonJobService } from './../../../shared/services/personjob.service';
import { PersonService } from './../../../shared/services/person.service';
import { Person } from './../../../shared/models/person.model';
import { JobService } from './../../../shared/services/job.service';
import { Job } from './../../../shared/models/job.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-job-persons',
  templateUrl: './job-persons.component.html',
  styleUrls: ['./job-persons.component.scss']
})
export class JobPersonsComponent implements OnInit, OnDestroy {

  job: Job;
  linkedPersons: Person[] = [];
  personJobs: PersonJob[] =[];
  jobSubcription: Subscription = Subscription.EMPTY;
  personJobSubcription: Subscription = Subscription.EMPTY;

  constructor(
    private jobService: JobService,
    public personService: PersonService,
    private personJobService: PersonJobService,
    private router: Router,
    private sideNavService: SideNavService,
    ) { }


  private getPersonJobs(){
    this.personJobSubcription = this.personJobService.getJobPersonJobs(this.job.id).subscribe(pJobs=>{
      this.personJobs = pJobs;
      this.jobService.setPersonJobs(this.personJobs);
    })
  }
  contactPersons(){
    let selectedPersons: Person[] = [];
    this.sideNavService.onlySelectedPersons.next(true);
    this.personJobs.forEach(pJob => {
      selectedPersons.push(this.personService.getPerson(pJob.person));
    })
    this.personService.selectedPersons.next(selectedPersons);
    this.router.navigate(['persons', 'contact'],{ queryParams: { jobid: this.job.id } } )
    
  }
  
  ngOnInit() {
    this.jobSubcription = this.jobService.selectedJob.subscribe(job => {
      this.job = job;
      this.job.personsId.forEach(
        (id) => this.linkedPersons.push(this.personService.getPerson(id))
      );
      this.getPersonJobs();
    });
  }
  
  ngOnDestroy(){
    this.jobSubcription.unsubscribe();
  }
}
