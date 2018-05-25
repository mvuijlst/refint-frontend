import { PersonService } from './../../shared/services/person.service';
import { Person } from './../../shared/models/person.model';
import { Job } from './../../shared/models/job.model';
import { Component, OnInit, Input, OnChanges, SimpleChange } from '@angular/core';

@Component({
  selector: 'app-job-card-basic',
  templateUrl: './job-card-basic.component.html',
  styleUrls: ['./job-card-basic.component.scss']
})
export class JobCardBasicComponent implements OnInit {

  // @Input() job:Job;
  persons:any[] = [];
  jobke:Job;
  @Input()
  set job(job: Job) {
    this.jobke = job;
  }
  @Input()
  set personids(ids: any[]){
    if (ids.length > 0) {
      ids.forEach (id => {
        this.persons.push(this.personService.getPerson(id))
      })
    }
  }
  get personids(): any[] {
     return this.persons; 
    }
  

  constructor(
    private personService: PersonService
  ) { }

  ngOnInit() {
  //   if (this.job.personsId.length > 0) {
  //     this.job.personsId.forEach (id => {
  //       this.persons.push(this.personService.getPerson(id))
  //     })
  //   }
  // console.log(this.persons)
  }
  // ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
  //   console.log(changes);
  //   // let log: string[] = [];
  //   // for (let propName in changes) {
  //   //   let changedProp = changes[propName];
  //   //   let to = JSON.stringify(changedProp.currentValue);
  //   //   if (changedProp.isFirstChange()) {
  //   //     log.push(`Initial value of ${propName} set to ${to}`);
  //   //   } else {
  //   //     let from = JSON.stringify(changedProp.previousValue);
  //   //     log.push(`${propName} changed from ${from} to ${to}`);
  //   //   }
  //   // }
  //   // this.changeLog.push(log.join(', '));
  // }
}
