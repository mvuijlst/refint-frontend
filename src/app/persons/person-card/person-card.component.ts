import { PersonService } from './../../shared/services/person.service';
import { Person } from './../../shared/models/person.model';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/Rx';

@Component({
  selector: 'app-person-card',
  templateUrl: './person-card.component.html',
  styleUrls: ['./person-card.component.scss']
})
export class PersonCardComponent implements OnInit, OnDestroy {

  person: Person;
  personSubsription: Subscription;
  constructor(private personService: PersonService) { }

  ngOnInit() {
    this.personSubsription =  this.personService.selectedPerson.subscribe(
      (pers: Person) => {this.person = pers; console.log(pers); });
  }
  ngOnDestroy(){
    this.personSubsription.unsubscribe();
  }
}
