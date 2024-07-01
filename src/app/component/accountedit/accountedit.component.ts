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
import Swal from 'sweetalert2';
import { transaction } from '../../_model/transaction.model';
import { TransactionService } from '../../_service/transaction.service';
import { AppTableComponent } from '../apptable/apptable.component';
import { AccountStatusService } from '../../_service/accountStatus.service';
import { accountStatus } from '../../_model/accountStatus.model';

@Component({
  selector: 'app-accountedit',
  standalone: true,
  imports: [ReactiveFormsModule,FormsModule,CommonModule,NgbModule,AppTableComponent],
  templateUrl: './accountedit.component.html',
  styleUrl: './accountedit.component.css'
})

export class AccounteditComponent {
  accountForm: FormGroup = new FormGroup({
    person: new FormControl(''),
    accountNumber: new FormControl('')
  });

  submitted = false;
  personCode:number | undefined;
  accountCode:number | 0;
  personList: person[] = [];
  person:person | undefined;
  selectedPerson:person | undefined;
  accountStatusList: accountStatus[] = [];
  accountStatus: accountStatus | undefined ;
  selectedAccountStatus: accountStatus|undefined; 
  accountNumber:string | undefined;

  searchTerm: string = '';
  page = 1;
  pageSize = 10;
  collectionSize: number = 100;
  currentRate = 8;

  transactions: transaction[] = [];
  alltransaction: transaction[] = [];
  _response:any;
 
  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private personService: PersonService,
    private transactionService: TransactionService,
    private accountStatusService: AccountStatusService,
    private router: Router,
    private route:ActivatedRoute,
    private toastr: ToastrService
  ) {
    this.accountForm = this.fb.group({
      person: [this.person, Validators.required],
      accountStatus: [this.accountStatus, Validators.required],
      accountNumber: [this.accountNumber, [Validators.required]]
    }); 
    //get the person and the account
   // this.personCode = Number(this.route.snapshot.paramMap.get("personCode"));
    this.accountCode = Number(this.route.snapshot.paramMap.get("code"));
    this.personService.getAll(0).subscribe((result) => {
      this.personList = result;
      this.accountService.getByCode(this.accountCode).subscribe(response => {

        this.accountStatusService.getAll().subscribe(sResponse=>{
            this.accountStatusList = sResponse;             
            this.selectedAccountStatus = this.accountStatusList.find(s=>s.id==response.statusId);
            this.accountNumber = response.accountNumber;
            this.selectedPerson = this.personList.find(p=>p.code==response.personCode);
            this.person = this.selectedPerson;
            this.accountForm.patchValue({ accountNumber: response.accountNumber });
            this.accountForm.updateValueAndValidity();
            this.accountForm.clearValidators();   
        });             
      });             
    });        
  }

  get f(): { [key: string]: AbstractControl } {
    return this.accountForm.controls;
  }

  updateAccount(): void {
    this.submitted = true;

    if (this.accountForm.valid)
      {
        const pCode = this.accountForm.value.person.code;
        const accNumber = this.accountForm.value.accountNumber;
        const accStatusId = this.accountForm.value.accountStatus.id; 
        const a:account = {
          code: 0,
          personCode: 0,
          outstandingBalance: 0, 
          accountNumber: "",
          statusId:1
        };
        a.code = this.accountCode;
        a.personCode = pCode;
        a.accountNumber =accNumber;
        a.statusId = accStatusId;  
        this.accountService.updateAccount(a).subscribe(response => {
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
    this.router.navigateByUrl('/person/edit/'+ this.person?.code);
  }
  

  ngOnInit(): void {
    this.loadTransactions();
  }

  addNewTransaction() : void {
    this.router.navigateByUrl('/transaction/add/'+this.accountCode);
  }

  loadTransactions() : void {
    this.transactionService.getAll(this.accountCode)
      .subscribe((data: transaction[]) => {
        debugger
        this.collectionSize = data.length;
        this.transactions = data;
        this.alltransaction = this.transactions;
      });

  }

  editTransaction(event: any): void {
    let trn : transaction = event as transaction;   
    this.router.navigateByUrl('/transaction/edit/'+ trn.code)
  }

  deleteTransaction(event: any): void {
    let trn : transaction = event as transaction;
    this.confirmDelete(trn);  
  }

  confirmDelete(trn:any): void {
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
        this.transactionService.deleteTransaction(trn.code).subscribe(item=>{
          this._response=item;
          if (this._response.result === 'pass') {
            this.toastr.success('Deleted successfully', 'Success');
            this.loadTransactions();
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
}