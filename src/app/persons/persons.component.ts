import { JobType } from './../shared/models/jobtype.model';
import { JobTypeService } from './../shared/services/jobtype.service';
import { Observable } from 'rxjs/Observable';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { PersonService } from './../shared/services/person.service';
import { Component, OnInit, ViewChild, NgZone, OnDestroy } from '@angular/core';
import { Person } from '../shared/models/person.model';
import {
  ITdDataTableColumn,
  TdDataTableComponent,
  ITdDataTableSortChangeEvent,
  TdDataTableSortingOrder,
  TdDataTableService,
  ITdDataTableRowClickEvent,
  ITdDataTableSelectEvent
} from '@covalent/core/data-table';
import { TdMediaService } from '@covalent/core/media';
import { Subscription } from 'rxjs/Subscription';
import { MatCheckbox } from '@angular/material/checkbox';
import { Router, ActivatedRoute } from '@angular/router';
import { TdLayoutManageListToggleDirective } from '@covalent/core/layout';


@Component({
  selector: 'app-persons',
  templateUrl: './persons.component.html',
  styleUrls: ['./persons.component.scss']
})
export class PersonsComponent implements OnInit, OnDestroy {
  persons: Person[] = [];
  filteredPersons: Person[] = [];
  jobTypes: JobType[] = [];
  filteredTotal: number = this.persons.length;

  gridCols = 4;

  private personsSubscription: Subscription = Subscription.EMPTY;
  private screenSubscription: Subscription = Subscription.EMPTY;
  private selectedPersonsSubscription: Subscription = Subscription.EMPTY;
  private jobtypesSubscription: Subscription = Subscription.EMPTY;

  selectedJobTypes: JobType[] = [];
  onlyActive = true;
  onlySelected = false;
  searchTerm = '';
  currentPage = 1;
  fromRow = 1;
  pageSize = 500;
  selectedPersons: Person[] = [];
  gridView = true;
  personSelected = false;

  // datatable stuff
  @ViewChild('dataTable') private datatable: TdDataTableComponent;
  @ViewChild('endNav') private endNav: MatSidenav;

  sortBy = 'firstName';
  sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Descending;

  columns: ITdDataTableColumn[] = [
    { name: 'number', label: 'NR', sortable: true, width: 80, filter: false },
    { name: 'firstName', label: 'Voornaam', sortable: true, width: 250, filter: false },
    { name: 'lastName', label: 'Achternaam', sortable: true, width: 250, filter: false },
    { name: 'status', label: 'status', sortable: true, width: 80, filter: false },
    { name: 'defaultMobile', label: 'GSM', sortable: true, width: 180, filter: false },
    { name: 'defaultMail', label: 'EMAIL', sortable: true, filter: false, hidden: false },

  ];

  sort(sortEvent: ITdDataTableSortChangeEvent): void {
    this.sortBy = sortEvent.name;
    this.sortOrder = sortEvent.order;
    this.filter();
  }

  search(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.filter();
  }

  filterActive(): void {
    this.onlyActive = !this.onlyActive;
    console.log('filter');
    this.filter();
  }
  filterSelected(e): void {
    this.onlySelected = !this.onlySelected;
    this.filter();
    console.log(e);
  }

  filter(): void {
    let newData: Person[] = this.onlySelected ? this.selectedPersons : this.persons;
    const excludedColumns: string[] = this.columns
      .filter((column: ITdDataTableColumn) => {
        return ((column.filter === undefined && column.hidden === true) ||
          (column.filter !== undefined && column.filter === false));
      }).map((column: ITdDataTableColumn) => {
        return column.name;
      });
      const sTerm = this.searchTerm;
      const onlyActive = this.onlyActive;
      newData = newData.filter(function (d) {
        return ((d.status === (onlyActive ? 'A' : d.status)) &&
          (d.firstName.toLowerCase().indexOf(sTerm) !== -1 ||
          d.lastName.toLowerCase().indexOf(sTerm) !== -1 ||
          d.defaultMail.toLowerCase().indexOf(sTerm) !== -1
          || !sTerm));
      });
      const jobtypes = this.selectedJobTypes;
      if (jobtypes.length > 0) {
        console.log('extra filter');

        newData = newData.filter(function(d) {
          let personfound = false;
          personfound = !personfound ? d.jobpool1 ? jobtypes.some(j => j.id === d.jobpool1.id) : false : true;
          personfound = !personfound ? d.jobpool2 ? jobtypes.some(j => j.id === d.jobpool2.id) : false : true;
          personfound = !personfound ? d.jobpool3 ? jobtypes.some(j => j.id === d.jobpool3.id) : false : true;
          return personfound;
        });
        }
    this.filteredTotal = newData.length;
    newData = this._dataTableService.sortData(newData, this.sortBy, this.sortOrder);
    newData = this._dataTableService.pageData(newData, this.fromRow, this.currentPage * this.pageSize);
    this.filteredPersons = newData;
    console.log(this.filteredPersons);
  }

  rowCLick(person): void {
    this.router.navigate(['persons', 'person']);
    console.log(person.row);
    setTimeout(() => {this.personService.selectedPerson.next(person.row); }, 100 );
    if (!this.endNav.opened){
      this.personSelected = true;
        this.endNav.toggle();
    }
  }
  toggleContact(): void{
    this.router.navigate(['persons', 'contact']);
    console.log('togglecontact');
    this.onlySelected = true;
    this.filter();
    setTimeout(() => {this.personService.selectedPersons.next(this.selectedPersons); }, 100 );
    if (!this.endNav.opened){ this.endNav.open();}
  }

  toggleView() {
    this.gridView = !this.gridView;
  }

  watchScreen(): void {
    this.screenSubscription = this.media.registerQuery('xs').subscribe((matches: boolean) => {
      this.ngZone.run(() => {
        this.gridCols = matches ? 1 : 2;
      });
    });
  }

  checkSelectedRows(e): boolean{
    return this.selectedPersons.findIndex(person => person === e) !== -1;
  }

  handleJobTypeChange(e) {
    console.log('jobtype');
    console.log(this.selectedJobTypes);
    console.log(e);
    this.filter();
  }
  private handleSelectPerson(checked: boolean, person: Person){
    console.log(this.selectedPersons);
    if (checked) {
      if (this.selectedPersons.findIndex(pers => pers === person) === -1) {
        this.selectedPersons.push(person);
      }
    } else {
      const ind = this.selectedPersons.findIndex(pers => pers === person);
      console.log(ind);
      console.log(this.selectedPersons);
      if (ind !== -1) {
        console.log('slice');
        this.selectedPersons.splice(ind, 1);
      }
    }
    console.log(this.selectedPersons);
    this.personService.selectedPersons.next(this.selectedPersons);
    console.log(this.personService.selectedPersons);
    this.filter();

  }

  rowClick(event: ITdDataTableSelectEvent) {
    this.handleSelectPerson(event.selected, event.row);
  }

  cbxClick(cbx: MatCheckbox, pers: Person): void {
    this.handleSelectPerson(cbx.checked, pers);
  }

  constructor(
    private media: TdMediaService,
    private personService: PersonService,
    private _dataTableService: TdDataTableService,
    private ngZone: NgZone,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private jobtypeService: JobTypeService
  ) { }

  ngOnInit() {
    this.personsSubscription = this.personService.getPersons().subscribe(
        (persons: Person[]) => {this.persons = persons; this.filter(); this.watchScreen(); }
      );
    this.jobtypesSubscription = this.jobtypeService.getJobTypes().subscribe(
      (jobtypes: JobType[]) => {this.jobTypes = jobtypes; }
    );
  }
  ngOnDestroy(){
    if (this.personsSubscription){
      this.personsSubscription.unsubscribe();
    }
    if (this.screenSubscription){
    this.screenSubscription.unsubscribe();
    }
    this.jobtypesSubscription.unsubscribe();
  }
}
