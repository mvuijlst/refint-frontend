import { Remark } from './../../../shared/models/remark.model';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-last-remark',
  templateUrl: './last-remark.component.html',
  styleUrls: ['./last-remark.component.scss']
})
export class LastRemarkComponent implements OnInit {

  constructor() { }

  @Input() remarks:Remark[];
  @Input() subject?:string = 'all';
  @Input() onlySticky:boolean[];
  lastSticky: Remark;

  ngOnInit() {
    this.remarks.sort((remA: Remark, remB: Remark) => {
      return remB.created.getTime() - remA.created.getTime();
    });

    this.lastSticky = this.subject === 'all' ? this.remarks.find(rem => rem.sticky === true) : 
      this.remarks.find(rem => rem.sticky === true && rem.subject === this.subject);
    if (!this.lastSticky && !this.onlySticky){
        this.lastSticky = this.subject === 'all' ? this.remarks[0] : 
          this.remarks.find(rem => rem.subject === this.subject)
      ;
    }
  }

}
