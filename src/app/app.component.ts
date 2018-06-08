import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

 
  public BASE_URL: string = "http://13.75.89.123:8081/pooling/api/";
  title = 'app';
  constructor(private router: Router) { }


  ngOnInit() {
    this.router.navigate([''])
  }

 
}
