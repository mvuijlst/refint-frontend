import { TimelineDialogComponent } from './../../persons/person-card/timeline-dialog/timeline-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-message-stepper',
  templateUrl: './message-stepper.component.html',
  styleUrls: ['./message-stepper.component.scss']
})
export class MessageStepperComponent implements OnInit {

  @Input() details:any[];
  constructor(
    public dialog:MatDialog
  ) { }

  showLogDetail(detail) {
    let dialogref = this.dialog.open(TimelineDialogComponent, {
      data : detail
    })
    

  }
  
  ngOnInit() {
    this.details.sort((deta, detb) => {
      return deta.created.getTime() - detb.created.getTime();
    })
  }

}
