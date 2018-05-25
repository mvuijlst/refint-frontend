import { ErrorService } from './error.service';
import { environment } from './../../../environments/environment';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
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
import { map, catchError } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class PersonService {
    private personsUrl = environment.apiUrl + '/interim/API/persons/';

    public selectedPerson: BehaviorSubject<Person> = new BehaviorSubject(new Person({}));
    public selectedPersons: BehaviorSubject<Person[]> = new BehaviorSubject([]);
    public persons: BehaviorSubject<Person[]> = new BehaviorSubject([]);
    public personsLoaded : BehaviorSubject<boolean> = new BehaviorSubject(false);
    private _persons: Person[] = [];
    private personsSubscription: Subscription = Subscription.EMPTY;

    getPersons(): Observable<Person[]> {
        return this.http.get<Person[]>(this.personsUrl).pipe(
            map(
                (persons) => {
                    const _persons: Person[] = [];
                    for (const person of persons) {
                        _persons.push(new Person(person));
                    }
                    return _persons;
                }
            ),
            catchError(this.errorService.handleError<Person[]>('getPersons', [])),
        );
    }


    getPerson(personId: number): Person {
        return this._persons.find(p => p.id === personId);
    }

    getPersonName(personId: number) : string {
        const pers = this._persons.find(p => p.id === personId)
        return pers.firstName + ' ' + pers.lastName;
    }

    constructor(
        private http: HttpClient,
        private errorService: ErrorService
    ) {
        this.personsSubscription = this.getPersons().subscribe(
            (pers) => {
                if (pers.length>0){
                    this._persons = pers;
                    this.personsLoaded.next(true);
                    this.persons.next(this._persons)
                }
            }
        )
    }

}
