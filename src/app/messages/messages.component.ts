import { Component, OnInit } from '@angular/core';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  // must be public because you need to bind to it in the template
  // the template = HTML code
  // so to expose the service to be binded in the HTML (like when u click something happens)
  // you have to set it to public

  constructor(public messageService: MessageService) { }

  ngOnInit(): void {
  }

}
