import { Message } from './../../../shared/models/message.model';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-message-card',
  templateUrl: './message-card.component.html',
  styleUrls: ['./message-card.component.scss']
})
export class MessageCardComponent implements OnInit {

  @Input() message: Message;

  constructor() { }

  ngOnInit() {
    console.log(this.message)
  }

}
