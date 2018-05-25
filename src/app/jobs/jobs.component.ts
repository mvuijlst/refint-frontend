import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Organisation } from './../shared/models/organisation.model';
import { SideNavService } from './../shared/services/sidenav.service';
import { Subscription } from 'rxjs/Subscription';
import { JobService } from './../shared/services/job.service';
import { Job } from './../shared/models/job.model';
import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { ITdDataTableColumn, ITdDataTableSortChangeEvent, TdDataTableService, TdDataTableSortingOrder } from '@covalent/core/data-table';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss']
})
export class JobsComponent implements OnInit, OnDestroy {

  // @ViewChild(MatSort) sort: MatSort;
  jobSearchForm: FormGroup;
  rightNavOpened = false;
  rightNavWidth = 0;
  tableHeight = 400;
  fromDate: Date = new Date();
  toDate: Date = new Date();

  jobs: Job[] = []
  filteredJobs: Job[] = []
  sortBy = 'datefrom';
  sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Descending;
  searchTerm = '';

  jobsSubscription: Subscription = Subscription.EMPTY;
  jobsLoadedSubscription: Subscription = Subscription.EMPTY;
  rightNavOpenedSubscription: Subscription = Subscription.EMPTY;
  rightNavWidthSubscription: Subscription = Subscription.EMPTY;
  tableHeightSubscription: Subscription = Subscription.EMPTY;
  
  constructor(
    private jobService:JobService,
    private sideNavService: SideNavService,
    private datapipe: DatePipe,
    private dataTableService: TdDataTableService,
    private router: Router

  ) { }

  
  columns: ITdDataTableColumn[] = [
    { name: 'status.name', label: 'status', sortable: true, width: 80, filter: false, nested: true, },
    { name: 'datefrom', label: 'Van', sortable: true, width: 80, filter: false, format: v => this.datapipe.transform(v, 'dd/MM/yy') },
    { name: 'dateuntil', label: 'Tot', sortable: true, width: 80, filter: false, format: v => this.datapipe.transform(v, 'dd/MM/yy') },
    { name: 'name', label: 'job', sortable: true, width: 250, filter: true },
    { name: 'organisation.name', label: 'organisatie', sortable: true, filter: false, nested: true, },
    { name: 'description', label: 'desc', sortable: false, width: 80, filter: true, hidden:true, },
  ];

  search(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.filter();
  }
  sort(sortEvent: ITdDataTableSortChangeEvent): void {
    this.sortBy = sortEvent.name;
    this.sortOrder = sortEvent.order;
    this.filter();
  }

  filterdate(e, b){
    this.fromDate = new Date(this.jobSearchForm.value['dateFrom'])
    this.toDate = new Date(this.jobSearchForm.value['dateTo'])
    this.filter();
  }

  rowClick(e) {
    this.jobService.selectedJob.next(e.row);
    this.sideNavService.toggleRightNav('job');
    this.router.navigate(['jobs', 'job'], { queryParams: { id: e.row.id }, queryParamsHandling: 'merge' });
  }



  filter(){
    let newData: Job[] = this.jobs;
    // console.log(this.jobs[0].status)
    let excludedColumns: string[] = this.columns
      .filter((column: ITdDataTableColumn) => {
        return ((column.filter === undefined && column.hidden === true) ||
                (column.filter !== undefined && column.filter === false));
      }).map((column: ITdDataTableColumn) => {
        return column.name;
      });
    
    newData = newData.filter((job) => {
      return (job.datefrom.getTime() > this.fromDate.getTime() && job.datefrom.getTime() < this.toDate.getTime())
    })
    if (this.sortBy === 'organisation.name'){
      newData = newData.sort((jobA:Job, jobB: Job) => {
        if (this.sortOrder === 'DESC'){
          if(jobA.organisation.name < jobB.organisation.name) return -1;
          if(jobA.organisation.name > jobB.organisation.name) return 1;
          return 0;
          // return jobA.organisation.name.localeCompare(jobB.organisation.name)
        } else {
          if(jobA.organisation.name > jobB.organisation.name) return -1;
          if(jobA.organisation.name < jobB.organisation.name) return 1;
          return 0;
        }
      })
    }
    else if (this.sortBy === 'status.name') {
      newData = newData.sort((jobA:Job, jobB: Job) => {
      if (this.sortOrder === 'DESC'){
        if(jobA.status.name < jobB.status.name) return -1;
        if(jobA.status.name > jobB.status.name) return 1;
        return 0;
        // return jobA.organisation.name.localeCompare(jobB.organisation.name)
      } else {
        if(jobA.status.name > jobB.status.name) return -1;
        if(jobA.status.name < jobB.status.name) return 1;
        return 0;
      }
    })}
    else {
      newData = this.dataTableService.sortData(newData, this.sortBy, this.sortOrder);
    }
    newData = this.dataTableService.pageData(newData, 1, 1 * 3000);

    this.filteredJobs = newData;
  }


  ngOnInit() {
    const date = new Date()
    this.fromDate = new Date(date.getFullYear(), 0, 1);
    this.toDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    this.jobSearchForm = new FormGroup({
      'dateFrom' : new FormControl(this.fromDate),
      'dateTo' : new FormControl(this.toDate),
    })
    this.jobService

    this.jobsLoadedSubscription = this.jobService.jobsLoaded.subscribe((e) => {
      this.jobsSubscription = this.jobService.jobs.subscribe(jobs=> {
        this.jobs = jobs;
        this.filter();
      });
    })
    this.rightNavOpenedSubscription = this.sideNavService.rightNavOpened.subscribe(open => this.rightNavOpened = open);
    this.rightNavWidthSubscription = this.sideNavService.rightNavWidth.subscribe(width => this.rightNavWidth = width)
    this.tableHeightSubscription = this.sideNavService.tableHeight.subscribe(
      height=> this.tableHeight = height)
    this.sideNavService.windowResize();
  }
  ngOnDestroy() {
    this.rightNavOpenedSubscription.unsubscribe();
    this.rightNavWidthSubscription.unsubscribe();
    this.jobsSubscription.unsubscribe();
    this.tableHeightSubscription.unsubscribe();
    this.jobsLoadedSubscription.unsubscribe();
  }
}
