import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-timeline-dialog',
  templateUrl: './timeline-dialog.component.html',
  styleUrls: ['./timeline-dialog.component.scss']
})
export class TimelineDialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

}
