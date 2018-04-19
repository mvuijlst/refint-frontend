import { Person } from '../models/person.model';
import { Interviewer } from '../models/interviewer.model';
import { Country } from '../models/country.models';
import { RefuType } from '../models/refutype.model';
import { JobType } from '../models/jobtype.model';
import { FamilySituation } from '../models/familysituation.model';
import { Contact } from '../models/contact.model';
import { ContactMethod } from '../models/contactmethods.model';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
@Injectable()
export class PersonService {
    private personsUrl = '/interim/API/persons';
    public selectedPerson: Subject<Person> = new Subject();

    getPersons(): Observable<Person[]> {
        return this.http.get<Person[]>(this.personsUrl)
            .map(
                (persons) => {
                    const persons2: Person[] = [];
                    for (const person of persons) {
                        const person2: Person = new Person(person);
                        persons2.push(person2);
                    }
                    return persons2;
                }
            );
    }

    constructor(private http: HttpClient) { }

}
