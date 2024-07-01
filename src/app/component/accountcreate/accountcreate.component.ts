import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AccountService } from '../../_service/account.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { account } from '../../_model/account.model';
import { person } from '../../_model/person.model';
import { PersonService } from '../../_service/person.service';

@Component({
  selector: 'app-accountcreate',
  standalone: true,
  imports: [ReactiveFormsModule,FormsModule,CommonModule,NgbModule],
  templateUrl: './accountcreate.component.html',
  styleUrl: './accountcreate.component.css'
})

export class AccountcreateComponent {
  accountForm: FormGroup = new FormGroup({
    person: new FormControl(''),
    accountNumber: new FormControl('')
  });

  submitted = false;
  personCode:number | undefined;
  personList: person[] = [];
  person:person | undefined;
  selectedPerson:person | undefined;
  accountNumber:string | undefined;
 
  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private personService: PersonService,
    private router: Router,
    private route:ActivatedRoute,
    private toastr: ToastrService
  ) {
    this.accountForm = this.fb.group({
      person: [this.person, Validators.required],
      accountNumber: [this.accountNumber, Validators.required]
    });

    this.personCode = Number(this.route.snapshot.paramMap.get("personCode"));
    this.personService.getAll(0).subscribe((result) => {
      this.personList = result; 
      this.selectedPerson = this.personList.find(p=>p.code==this.personCode);
      //this.person=this.selectedPerson;
    });
    
  }

  get f(): { [key: string]: AbstractControl } {
    return this.accountForm.controls;
  }

  createAccount(): void {
    this.submitted = true;

    if (this.accountForm.valid)
      {
        const pCode = this.accountForm.value.person.code;
        const accNumber = this.accountForm.value.accountNumber;
        const a:account = {
          code: 0,
          personCode: 0,
          outstandingBalance: 0, 
          accountNumber: "",
          statusId: 1
        };

        a.personCode = pCode;
        a.accountNumber =accNumber;

        this.accountService.createAccount(a).subscribe(response => {
          let resp : any = response;     
          if (resp.responseCode==200 || resp.responseCode==201)
          {
              this.router.navigateByUrl('/person/edit/'+ a.personCode);                
          }
          this.toastr.info(resp.message);
        });
      }
  }

  onReset(): void {
    this.submitted = false;
    this.accountForm.reset();
  }

  onCancel(): void {
    console.log('Cancel clicked');
    this.router.navigateByUrl('/person/edit/'+ this.personCode);
  }
  
}