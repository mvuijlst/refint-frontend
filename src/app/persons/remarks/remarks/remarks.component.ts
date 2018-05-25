import { Remark } from './../../../shared/models/remark.model';
import { Person } from './../../../shared/models/person.model';
import { Subscription } from 'rxjs/Subscription';
import { PersonService } from './../../../shared/services/person.service';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-remarks',
  templateUrl: './remarks.component.html',
  styleUrls: ['./remarks.component.scss']
})
export class RemarksComponent implements OnInit, OnDestroy {

  person: Person;
  remarks: Remark[] = [];
  stickies: Remark[] = [];
  @Input() subject: string;
  personSubscription: Subscription = Subscription.EMPTY;


  constructor(
    private personService: PersonService,
  ) { }

  ngOnInit() {
    this.personSubscription = this.personService.selectedPerson.subscribe(
      (pers) => {
        this.person = pers;
        this.remarks = this.person.personremarks.filter(rem => rem.subject === this.subject && rem.sticky === false)
          .sort((remA, remB) => {return remA.created.getTime() - remB.created.getTime()} );
        this.stickies = this.person.personremarks.filter(rem => rem.subject === this.subject && rem.sticky === true)
          .sort((remA, remB) => {return remA.created.getTime() - remB.created.getTime()} );
      });
  }
  ngOnDestroy() {
    this.personSubscription.unsubscribe();
  }
}
