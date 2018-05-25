import { SideNavService } from './../../shared/services/sidenav.service';
import { JobService } from './../../shared/services/job.service';
import { Job } from './../../shared/models/job.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-job-card',
  templateUrl: './job-card.component.html',
  styleUrls: ['./job-card.component.scss']
})
export class JobCardComponent implements OnInit, OnDestroy {


  job: Job;
  jobSubscription: Subscription = Subscription.EMPTY;
  heightSubscription: Subscription = Subscription.EMPTY;

  tabheight = 500;

  constructor(
    private jobService: JobService,
    private sideNavService: SideNavService
  ) { }

  closeMe(){
    this.sideNavService.toggleRightNav('close');
  }

  ngOnInit() 
  {
    this.jobSubscription = this.jobService.selectedJob.subscribe((job)=> {
      this.job = job;
      }
    );
    this.heightSubscription = this.sideNavService.tabHeight.subscribe(height=> this.tabheight = height)
    this.sideNavService.setTabHeight();
  
    }

  ngOnDestroy(){
    this.jobSubscription.unsubscribe();
    this.sideNavService.toggleRightNav('close');
    this.heightSubscription.unsubscribe();
  }

}
