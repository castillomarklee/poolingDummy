import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class DataService {
  private fullnameSource = new BehaviorSubject<string>("");
  currentName = this.fullnameSource.asObservable();
  constructor(private http: HttpClient) { }

  changeName(name: string) {
    this.fullnameSource.next(name);
  }

}
