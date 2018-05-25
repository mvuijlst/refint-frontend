import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-stepper-dense',
  templateUrl: './stepper-dense.component.html',
  styleUrls: ['./stepper-dense.component.scss']
})
export class StepperDenseComponent implements OnInit {

  @Input() details:any[];
  resortedDetails:any[]=[];
  constructor(
    public dialog:MatDialog
  ) { }

  
  ngOnInit() {
    this.details.sort((deta, detb) => {
      return deta.created.getTime() - detb.created.getTime();
    })

    let resortedDetails:any[] = []
    let lastDetail: any;
    this.details.forEach(detail => {
      if (!lastDetail || lastDetail.detailType.shortname !== detail.detailType.shortname){
        resortedDetails.push(detail)
      }
      lastDetail = detail
    });
    this.resortedDetails = resortedDetails;

  }
}
