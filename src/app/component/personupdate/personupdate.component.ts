import { Component } from '@angular/core';
import { PersonService } from '../../_service/person.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { person } from "../../_model/person.model"
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AccountService } from '../../_service/account.service';
import { account } from '../../_model/account.model';
import Swal from 'sweetalert2';
import { AppTableComponent } from '../apptable/apptable.component';

@Component({
  selector: 'app-personupdate',
  standalone: true,
  imports: [  ReactiveFormsModule,FormsModule,CommonModule,NgbModule,AppTableComponent],
  templateUrl: './personupdate.component.html',
  styleUrl: './personupdate.component.css'
})
export class PersonUpdateComponent {

  personForm: FormGroup = new FormGroup({
    name: new FormControl(''),
    surname: new FormControl(''),
    idNumber: new FormControl('')
  });

  submitted = false;
  name:string ="";
  surname:string ="";
  idNumber:string ="";
  personId:number=0;

  searchTerm: string = '';
  page = 1;
  pageSize = 10;
  collectionSize: number = 100;
  currentRate = 8;
  accounts: account[] = [];
  allAccounts: account[] = [];
  _response:any;

  constructor(
    private fb: FormBuilder,
    private personService: PersonService,
    private accountService: AccountService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {
    this.personForm = this.fb.group({
      name: [this.name, Validators.required],
      surname: [this.surname, Validators.required], 
      idNumber: [this.idNumber, [Validators.required, Validators.pattern(/^\d{13}$/)]]
    });

    this.personId = Number(this.route.snapshot.paramMap.get("code"));
    this.loadPerson(this.personId);
  }

loadPerson(personId:number) {
  this.personService.getByCode(personId).subscribe(response => {
      this.name = response.name,
      this.surname = response.surname,
      this.idNumber = response.idNumber,
      this.personForm.patchValue(response);
      this.personForm.updateValueAndValidity();   
  });
  this.personForm.clearValidators();
}

  get f(): { [key: string]: AbstractControl } {
    return this.personForm.controls;
  }

  updatePerson(): void {
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

        p.code = this.personId;
        p.name = name;
        p.surname =surname;
        p.idNumber = idNumber;

        // message
        // : 
        // null
        // responseCode
        // : 
        // 200
        // result
        // : 
        // "pass"
        this.personService.updatePerson(p).subscribe(response => {
            console.log('Response:', response);
            let resp : any = response; 
            
            if (resp.responseCode==200)
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
  
  ngOnInit(): void {
    this.loadAccounts();
  }

  addNewAccount() : void {
    this.router.navigateByUrl('/account/add/'+this.personId);
  }

  loadAccounts() : void {
    this.accountService.getAll(this.personId)
      .subscribe((data: account[]) => {
        debugger
        this.collectionSize = data.length;
        this.accounts = data;
        this.allAccounts = this.accounts;
      });

  }

  editAccount(event: any): void {
    let acc : account = event as account;   
    this.router.navigateByUrl('/account/edit/'+ acc.code)
  }

  deleteAccount(event: any): void {
    let acc : account = event as account;
    this.confirmDelete(acc);  
  }

  confirmDelete(account:any): void {
    Swal.fire({
      title: 'Are you sure you want to remove this person?',
      text: 'You will not be able to recover this person!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.accountService.deleteAccount(account.code).subscribe(item=>{
          this._response=item;
          if (this._response.result === 'pass') {
            this.toastr.success('Deleted successfully', 'Success');
            this.loadAccounts();
          } else {
            this.toastr.error('Due to:' + this._response.message, 'Failed');
          }
        })
        Swal.fire(
          'Deleted!',
          'Person has been deleted.',
          'success'
        )
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire(
          'Cancelled',
          'No action taken :)',
          'error'
        )
      }
    })
  }
  
  search(event: any): void {
    const searchFilter = event.target?.value;
    this.accounts = this.allAccounts.filter((val) =>
      val.accountNumber.toLowerCase().includes(searchFilter)
    );
    this.collectionSize = this.accounts.length;
  }

}
