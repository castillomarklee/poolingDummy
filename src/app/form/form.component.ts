import { Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';
import { DataService } from "../data.service";
import { AppComponent } from "../app.component";
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn, FormArray } from '@angular/forms';


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
  // BASE_URL: string = "https://devpartners.co/pooling/api/";
  BASE_URL: string = "http://13.75.89.123:8081/pooling/api/";
  userForm = [];
  sample: any = [];
  samplearray = [];
  userFormgroup: FormGroup;
  fileNameCV: string = "";
  skillsTempArray = [];
 
  

  constructor(private httpClient: HttpClient, private router: Router, private userinformation: DataService, private fb: FormBuilder) {
   
  }

  get userSkills(): FormArray {
    return <FormArray>this.userFormgroup.get('userSkills');
}

  getSkills() {
   

    this.httpClient.get(this.BASE_URL + 'Skill')
      .subscribe((data: any[]) => {
        this.ListSkill = data;
      });
  }

  setSkills(setSkillId: boolean, value: string): void {
    false === setSkillId ? this.userSkills.push(this.buildSkills(value)) && this.skillsTempArray.push(value) : this.userSkills.removeAt(Number(this.skillsTempArray.filter(item => item !== value)));
  }

  buildSkills(skillId: string): FormGroup {
    return this.fb.group({
      skillName: [skillId, Validators.required]
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
      this.userForm =[{
        'firstname': firstname,
        'lastname': lastname,
        'email': email,
        'contact': contact,
        'address': address,
        'files': files,
        'setOfSkills': setOfSkills
      }];
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

  //Original code do not remove if necessary
  // processApplication() {
  //   this.convertSetSkills();
  //   var paramData = this.setFormdata(this.firstname,this.lastname,this.email, this.contact ,this.address,this.files,this.setOfSkills);
  //   this.userinformation.changeName(this.getFullName());
  //   console.log(this.userinformation.changeName(this.getFullName()));
  //   this.postUser(paramData);
  // }
  
  processApplication() {
    this.convertSetSkills();
    var paramData = this.setFormdata(this.firstname,this.lastname,this.email, this.contact ,this.address,this.files,this.setOfSkills);
    this.userinformation.changeName(this.getFullName());  
    console.log(this.userinformation.changeName(this.getFullName()));
    // this.postUser(paramData);
    localStorage.setItem('userForm', JSON.stringify(this.userForm));
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
    console.log(event.target.value);
     false === this.selectedSkills.includes(event.target.value) ?  this.selectedSkills.push(event.target.value) : this.selectedSkills= this.selectedSkills.filter(item => item !== event.target.value);
     console.log(this.selectedSkills);
     this.setSkills(false === this.selectedSkills.includes(event.target.value), event.target.value);
    }



    setFirstName(event: any) { this.firstname = event.target.value; this.SubmitChecker();}
    setLastName(event: any) { this.lastname = event.target.value; this.SubmitChecker();}
    setContact(event: any) { this.contact = event.target.value; this.SubmitChecker();}
    setEmail(event: any) { this.email = event.target.value; this.SubmitChecker();}
    setAddress(event: any) { this.address = event.target.value; this.SubmitChecker(); }
    setFiles(pdf: FileList) { this.filename = this.userFormgroup.get('fileCV').value; }


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
    submitUserForm() {
        localStorage.setItem('firstForm', JSON.stringify(this.userFormgroup.value));
        console.log(this.userFormgroup.controls.userSkills.value);
        console.log('Saved: ' + JSON.stringify(this.userFormgroup.value));
    }
    ngOnInit() {
      this.getSkills();
      
      this.userFormgroup = this.fb.group({
        firstname: ['', Validators.required],
        lastname: ['', Validators.required],
        userContact: ['', Validators.required],
        email: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+')]],
        address: ['', Validators.required],
        fileCV: ['', Validators.required],
        userSkills: this.fb.array([])
      });
    }

}