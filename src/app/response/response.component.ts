import { Component, ViewChild, OnInit } from '@angular/core';
import { DataService } from "../data.service";
@Component({
  selector: 'app-response',
  templateUrl: './response.component.html',
  styleUrls: ['./response.component.css']
})
export class ResponseComponent implements OnInit {
  name: string;



  constructor(private data: DataService) {}

  ngOnInit() {
    this.data.currentName.subscribe(fullname => this.name = fullname)
  }

}
