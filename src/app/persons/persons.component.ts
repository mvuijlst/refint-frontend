import { environment } from './../../environments/environment';
import { Status } from './../shared/models/status.model';
import { SideNavService } from './../shared/services/sidenav.service';
import { JobType } from './../shared/models/jobtype.model';
import { JobTypeService } from './../shared/services/jobtype.service';
import { Observable } from 'rxjs/Observable';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { PersonService } from './../shared/services/person.service';
import { Component, OnInit, OnDestroy, AfterViewInit, SimpleChanges, OnChanges } from '@angular/core';
import { Person } from '../shared/models/person.model';
import {
  ITdDataTableColumn,
  TdDataTableComponent,
  ITdDataTableSortChangeEvent,
  TdDataTableSortingOrder,
  TdDataTableService,
  ITdDataTableRowClickEvent,
  ITdDataTableSelectEvent,
  ITdDataTableSelectAllEvent
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
export class PersonsComponent implements OnInit, OnDestroy{

  persons: Person[] = [];
  filteredPersons: Person[] = [];
  jobTypes: JobType[] = [];
  selectedJobTypes: JobType[] = [];
  selectedPersons: Person[] = [];

  filteredTotal: number = this.persons.length;
  baseUrl = environment.apiUrl;
  
  //toolbar
  onlyActive = true;
  onlySelected = false;
  searchTerm = '';

  //navigation stuff
  rightNavOpened = false;
  rightNavWidth = 0;
  tableHeight = 400;


  sortBy = 'firstName';
  sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Descending;
  // find out if needed
  // currentPage = 1;
  // fromRow = 1;
  // pageSize = 500;
  // personSelected = false;


  gridView = true;
  gridCols = 4;
  gridFinished = false;
  
  private personsSubscription: Subscription = Subscription.EMPTY;
  private selectedPersonsSubscription: Subscription = Subscription.EMPTY;
  private onlySelectedSubscription: Subscription = Subscription.EMPTY;
  private jobtypesSubscription: Subscription = Subscription.EMPTY;
  private sidenavSubscription: Subscription = Subscription.EMPTY;
  private gridColsSubscription: Subscription = Subscription.EMPTY;
  private rightNavWidthSubscription: Subscription = Subscription.EMPTY;
  private gridViewSubscrption: Subscription = Subscription.EMPTY;
  private tableHeightSubscrption: Subscription = Subscription.EMPTY;


  
  // datatable stuff
  // @ViewChild('dataTable') private datatable: TdDataTableComponent;
  // @ViewChild('endNav') private endNav: MatSidenav;


  columns: ITdDataTableColumn[] = [
    { name: 'number', label: 'NR', sortable: true, width: 80, filter: false },
    { name: 'firstName', label: 'Voornaam', sortable: true, width: 250, filter: false },
    { name: 'lastName', label: 'Achternaam', sortable: true, width: 250, filter: false },
    { name: 'status', label: 'status', sortable: true, width: 80, filter: false },
    { name: 'defaultMobile', label: 'GSM', sortable: true, width: 180, filter: false },
    { name: 'defaultMail', label: 'EMAIL', sortable: true, filter: false, hidden: false },

  ];
  constructor(
    private media: TdMediaService,
    private personService: PersonService,
    private _dataTableService: TdDataTableService,
    // private ngZone: NgZone,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private jobtypeService: JobTypeService,
    private sideNavService: SideNavService,
  ) { }

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
    this.filter();
  }
  filterSelected(e): void {
    this.sideNavService.onlySelectedPersons.next(!this.onlySelected);
    // this.onlySelected = !this.onlySelected;
    this.filter();
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
    this.filteredPersons = newData;
  }

  rowClick(person): void {
    const pers:Person = person.row ? person.row : person;
    this.personService.selectedPerson.next(pers);
    this.router.navigate(['persons', 'person']);
    this.sideNavService.toggleRightNav('person-card');
  }

  
  toggleContact(): void {
    this.router.navigate(['persons', 'contact']);
    this.sideNavService.toggleRightNav('contact');
    this.onlySelected = true;
    this.filter();
    this.personService.selectedPersons.next(this.selectedPersons); 
  }

  toggleView() {
    this.gridFinished = false;
    this.sideNavService.toggleGridView();
  }

  // getStatusColor(person: Person) {
  //   return 'grid_status ' + person.status;
  // }


  checkSelectedRows(e): boolean{
    return this.selectedPersons.findIndex(person => person === e) !== -1;
  }


  // handleJobTypeChange(e) {
  //   this.filter();
  // }

  private handleSelectPerson(checked: boolean, person: Person){
    if (checked) {
      if (this.selectedPersons.findIndex(pers => pers === person) === -1) {
        this.selectedPersons.push(person);
      }
    } else {
      const ind = this.selectedPersons.findIndex(pers => pers === person);
      if (ind !== -1) {
        this.selectedPersons.splice(ind, 1);
      }
    }
    this.personService.selectedPersons.next(this.selectedPersons);
    this.filter();

  }

  selectAll(event: ITdDataTableSelectAllEvent) {
    if (event.selected){
      this.selectedPersons = event.rows;
    } else{
      this.selectedPersons = []
    }

    this.personService.selectedPersons.next(this.selectedPersons);

  }

  rowSelect(e, pers: Person): void {
    this.handleSelectPerson(e.selected, pers);
  }

  cbxClick(cbx: MatCheckbox, pers: Person): void {
    this.handleSelectPerson(cbx.checked, pers);
  }

  ngOnInit() {
    this.personsSubscription = this.personService.persons.subscribe(
        (persons: Person[]) => {this.persons = persons; this.filter(); }
    );

    this.jobtypesSubscription = this.jobtypeService.jobTypes.subscribe(
      (jobtypes: JobType[]) => {this.jobTypes = jobtypes; }
    );
    this.selectedPersonsSubscription = this.personService.selectedPersons.subscribe(
      selPers => this.selectedPersons = selPers
    )
    this.sidenavSubscription = this.sideNavService.rightNavOpened.subscribe(opened => this.rightNavOpened = opened);
    
    this.gridColsSubscription = this.sideNavService.gridCols.subscribe(nr => this.gridCols = nr);
    
    this.rightNavWidthSubscription = this.sideNavService.rightNavWidth.subscribe(
      (nr) => {
        this.rightNavWidth = nr;
      });
    
    
    this.gridViewSubscrption = this.sideNavService.gridView.subscribe(opened => this.gridView = opened);
    
    this.tableHeightSubscrption = this.sideNavService.tableHeight.subscribe(height => this.tableHeight = height);
    
    this.sideNavService.windowResize();

    this.onlySelectedSubscription = this.sideNavService.onlySelectedPersons.subscribe(only => {
      this.onlySelected = only;
      this.filter();  
   })
  }
  gridfinished(){
    setTimeout(() => {
      this.gridFinished = true;
    },1000); 
  }

  ngOnDestroy() {
    this.sideNavService.toggleRightNav('close');
    this.personsSubscription.unsubscribe();
    this.jobtypesSubscription.unsubscribe();
    this.sidenavSubscription.unsubscribe();
    this.gridColsSubscription.unsubscribe();
    this.tableHeightSubscrption.unsubscribe();
    this.gridViewSubscrption.unsubscribe();
    this.rightNavWidthSubscription.unsubscribe();
    this.selectedPersonsSubscription.unsubscribe();
  }
}
