import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { account } from '../../_model/account.model';
import { AccountService } from '../../_service/account.service';
import { TransactionService } from '../../_service/transaction.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { transaction } from '../../_model/transaction.model';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgbDateStruct, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { person } from '../../_model/person.model';
import { PersonService } from '../../_service/person.service';
import Swal from 'sweetalert2';

import { AppTableComponent } from '../apptable/apptable.component';
@Component({
  selector: 'app-transactionedit',
  standalone: true,
  imports: [ReactiveFormsModule,FormsModule,CommonModule,NgbModule,AppTableComponent],
  templateUrl: './transactionedit.component.html',
  styleUrl: './transactionedit.component.css'
})
export class TransactioneditComponent {
 transactionForm: FormGroup = new FormGroup({
    account: new FormControl(''),
    transactionDate: new FormControl(''),
    amount: new FormControl(''),
    description: new FormControl('')
  });

  submitted = false;
  accountCode:number | undefined;
  transactionCode:number=0;
  accountList: account[] = [];
  account:account | undefined;
  selectedAccount:account | undefined;
  accountNumber:string | undefined;
  transactionDate:NgbDateStruct | undefined; 
  test:Date = new Date('2024-02-02')
  selectedDate = new FormControl(new Date('2024-02-02'));
  amount:number | undefined; 
  description:string | undefined; 

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private transactionService: TransactionService,
    private router: Router,
    private route:ActivatedRoute,
    private toastr: ToastrService
  ) {
    this.transactionForm = this.fb.group({
      account: [this.account, Validators.required],
      transactionDate: [this.transactionDate, Validators.required],
      amount: [this.amount, [Validators.required,Validators.pattern('/^-?(?!0)\d*\.\d+$/')]],
      description: [this.description, Validators.required]
    });
   
    this.transactionCode = Number(this.route.snapshot.paramMap.get("code"));

    this.transactionService.getByCode(this.transactionCode).subscribe((response)=> {        
      this.accountService.getAll(0).subscribe((result) => {
        this.accountList = result;
        this.selectedAccount = this.accountList.find(a=>a.code==response.accountCode);
        this.account = this.selectedAccount;
        // this.selectedDate.setValue(new Date(response.transactionDate));
         // this.transactionDate =this.convertToDateStruct( response.transactionDate);
         // this.transactionForm.patchValue({ transactionDate:  this.convertToNgbDate(new Date(response.transactionDate.toDateString())) });
          this.transactionForm.patchValue({ amount: response.amount });
          this.transactionForm.patchValue({ description: response.description });
          this.transactionForm.updateValueAndValidity();
          this.transactionForm.clearValidators();
      });
    });   
  }

 convertToNgbDate(date: Date): NgbDateStruct {
    const year = date.getFullYear();
    // Add 1 because JavaScript counts months from 0
    const month = date.getMonth() + 1;
    const day = date.getDate();
  
    return { year, month, day };
  }

  get f(): { [key: string]: AbstractControl } {
    return this.transactionForm.controls;
  }

  updateTransaction(): void {
    this.submitted = true;

    if (this.transactionForm.valid)
      {
        const aCode = this.selectedAccount?.code;
        const amt = this.transactionForm.value.amount;

        const transactionDt = this.transactionForm.value.transactionDate;
        const pickedDate: NgbDateStruct =transactionDt; // Your picked date here
        // Convert NgbDateStruct to ISO string
        const isoDateString = `${pickedDate.year}-${String(pickedDate.month).padStart(2, '0')}-${String(pickedDate.day).padStart(2, '0')}T00:00:00Z`;

        const desc = this.transactionForm.value.description;
        const t:transaction = {
          code: this.transactionCode,
          accountCode: 0,
          amount: 0, 
          transactionDate: new Date(),
          captureDate: new Date(),
          description: ""
        };

        t.accountCode = aCode??0;
        t.amount =amt;
        t.transactionDate =new Date(isoDateString);
        t.description = desc;

        this.transactionService.updateTransaction(t).subscribe(response => {
          let resp : any = response;     
          if (resp.responseCode==200 || resp.responseCode==201)
          {
              this.router.navigateByUrl('/account/edit/'+ t.accountCode);                
          }
          this.toastr.info(resp.message);
        });
      }
  }

  onReset(): void {
    this.submitted = false;
    this.transactionForm.reset();
  }

  onCancel(): void {
    console.log('Cancel clicked');
    this.router.navigateByUrl('/account/edit/'+ this.account?.code);
  }
}
