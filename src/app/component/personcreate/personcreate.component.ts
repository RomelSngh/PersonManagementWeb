import { Component } from '@angular/core';
import { PersonService } from '../../_service/person.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { person } from "../../_model/person.model"
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-personcreate',
  standalone: true,
  imports: [  ReactiveFormsModule,FormsModule,CommonModule,NgbModule],
  templateUrl: './personcreate.component.html',
  styleUrl: './personcreate.component.css'
})
export class PersonCreateComponent {

  personForm: FormGroup = new FormGroup({
    name: new FormControl(''),
    surname: new FormControl(''),
    idNumber: new FormControl('')
  });
  
  submitted = false;
  name:string | undefined;
  surname:string | undefined;
  idNumber:string | undefined;
  constructor(
    private fb: FormBuilder,
    private personService: PersonService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.personForm = this.fb.group({
      name: ["", Validators.required],
      surname: ["", Validators.required], 
      idNumber: ["", [Validators.required, Validators.pattern(/^\d{13}$/)]]
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.personForm.controls;
  }

  createPerson(): void {
    this.submitted = true;

    if (this.personForm.valid)
      {
        const name = this.personForm.value.name;
        const surname = this.personForm.value.surname;
        const idNumber = this.personForm.value.idNumber;
        const p:person = {
          code: 0,
          name: "",
          surname: "",
          idNumber: ""
        };

        p.name = name;
        p.surname =surname;
        p.idNumber = idNumber;

        this.personService.createPerson(p).subscribe(response => {
          let resp : any = response;     
          if (resp.responseCode==200 || resp.responseCode==201)
          {
              this.router.navigateByUrl('/person');                
          }
          this.toastr.info(resp.message);
        });
      }
  }

  onReset(): void {
    this.submitted = false;
    this.personForm.reset();
  }

  onCancel(): void {
    console.log('Cancel clicked');
    this.router.navigateByUrl('/person');
  }
  
}
