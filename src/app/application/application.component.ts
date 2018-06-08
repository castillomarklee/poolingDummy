import { Component, OnInit } from '@angular/core';
import { DataService } from "../data.service";
@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.css']
})
export class ApplicationComponent implements OnInit {

  constructor(private data: DataService) { }

  ngOnInit() {
  }

}
