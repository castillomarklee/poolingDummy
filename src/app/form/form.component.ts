import { Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';
import { DataService } from "../data.service";
import { AppComponent } from "../app.component";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
  
export class FormComponent implements OnInit {
  buttonDisabled: boolean = false;
  conflictEmail : boolean = false;
	title = 'app';
  ListSkill = [];
  selectedSkills = [];
	firstname : string;
	lastname : string;
	contact : string;
	email : string;
  address: string;
	files : File ;
  setOfSkills: string = "";
  filename: string = "*Choose file...";
  baseUrl: string;
  BASE_URL: string = "https://devpartners.co/pooling/api/";
 


  constructor(private httpClient: HttpClient, private router: Router, private userinformation: DataService) {
   
  }


  getSkills() {
   

    this.httpClient.get(this.BASE_URL + 'Skill')
      .subscribe((data: any[]) => {
        this.ListSkill = data;
      });
  }
  convertSetSkills(){
    this.setOfSkills = "";
    for (var item of this.selectedSkills) {
        if (!this.setOfSkills) {
          this.setOfSkills += item;
        } else {
          this.setOfSkills += `,${item}`;
        }
      }
  }
  setFormdata(firstname :string,lastname: string,email: string ,contact:string ,address:string,files: File,setOfSkills:string) : FormData {
      var applicant = new FormData();
	    var headers = new Headers();
      headers.append('Content-Type', 'multipart/form-data');
	    applicant.append("FirstName", firstname);
      applicant.append("LastName", lastname);
	    applicant.append("Email", email);
	    applicant.append("Phone", contact);
	    applicant.append("Address", address);
	    applicant.append("Filename", files);
      applicant.append("Skills", setOfSkills);
      return applicant;
}
  getFullName() : string {
      return this.firstname + " " + this.lastname;
  }
  processApplication() {
    this.convertSetSkills();
    var paramData = this.setFormdata(this.firstname,this.lastname,this.email, this.contact ,this.address,this.files,this.setOfSkills);
	  this.userinformation.changeName(this.getFullName());
    this.postUser(paramData);
  }
  
  postUser(param: FormData) {
    this.loading(true);
    this.httpClient.post(this.BASE_URL + 'User', param)
          .subscribe(
      (res: any[]) => {
            this.loading(false);
            this.conflictEmail = false;
            this.router.navigate(['response']);
         },
      err => {
            this.loading(false);
            console.log(err);
           if(err.statusText == "Conflict"){this.conflictEmail = true;}
          }
        );
  }
  loading(check: boolean) {
    if (check) {
      document.getElementById("overlay").style.visibility = "visible";
    }
    else {
      document.getElementById("overlay").style.visibility = "hidden";
    }
    
  }

	addSkills(event : any){
		 false === this.selectedSkills.includes(event.target.value) ?  this.selectedSkills.push(event.target.value) : this.selectedSkills= this.selectedSkills.filter(item => item !== event.target.value);
		 console.log(this.selectedSkills);
    }



    setFirstName(event: any) { this.firstname = event.target.value; this.SubmitChecker();}
    setLastName(event: any) { this.lastname = event.target.value; this.SubmitChecker();}
    setContact(event: any) { this.contact = event.target.value; this.SubmitChecker();}
    setEmail(event: any) { this.email = event.target.value; this.SubmitChecker();}
    setAddress(event: any) { this.address = event.target.value; this.SubmitChecker(); }
    setFiles(pdf: FileList) { this.files = pdf.item(0); this.SubmitChecker(); this.filename = this.files.name; }

    SubmitChecker() {
      if (this.firstname == "" || this.firstname == null) { this.buttonDisabled = false; }
      else if (this.lastname == "" || this.lastname == null) { this.buttonDisabled = false; }
      else if (this.contact == "" || this.contact == null) { this.buttonDisabled = false; }
      else if (this.email == "" || this.email == null || !this.email.includes("@")) { this.buttonDisabled = false; }
      else if (this.address == "" || this.address == null) { this.buttonDisabled = false; }
      else if (this.files == null) { this.buttonDisabled = false; }
      else { this.buttonDisabled = true; }
    }
    getName() {
      return this.firstname + " " + this.lastname;
    }
    ngOnInit() {
      this.getSkills();
    }

}
