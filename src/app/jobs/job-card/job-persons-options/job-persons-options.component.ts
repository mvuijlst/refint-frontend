import { filter } from 'rxjs/operators';
import { Person } from './../../../shared/models/person.model';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { PersonService } from '../../../shared/services/person.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-job-persons-options',
  templateUrl: './job-persons-options.component.html',
  styleUrls: ['./job-persons-options.component.scss']
})
export class JobPersonsOptionsComponent implements OnInit, OnDestroy {


  persons: Person[];
  personSubcription: Subscription = Subscription.EMPTY;
  @Input() jobTypeid: number;

  constructor(
    private personService: PersonService,
  ) { }

  filterPersons(){
    this.persons = this.persons.filter(pers => pers.jobpool1 ? pers.jobpool1.id === this.jobTypeid : false).sort(
      (a,b) =>{
        return (a.lastName > b.lastName) ? -1 : 1;
      })

  }


  ngOnInit() {
    this.personSubcription = this.personService.persons.subscribe(pers => 
      {
          this.persons = pers;
          this.filterPersons();
      }
    );
  }
  ngOnDestroy(){
    this.personSubcription.unsubscribe();
  }
}
