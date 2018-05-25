import { Person } from './../../shared/models/person.model';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-person-tile',
  templateUrl: './person-tile.component.html',
  styleUrls: ['./person-tile.component.scss']
})
export class PersonTileComponent implements OnInit {

  @Input() person: Person;
  @Input()
  set ready(isReady: boolean) {
    if (isReady) {
      // console.log('ready');
      this.done.emit(true);
    }
  }
  @Output() done: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

}
