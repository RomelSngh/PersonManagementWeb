
import { CommonModule, JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbAlertModule, NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AccountService } from '../../_service/account.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { account } from '../../_model/account.model';
import { person } from '../../_model/person.model';
import { PersonService } from '../../_service/person.service';
import { transaction } from '../../_model/transaction.model';
import { TransactionService } from '../../_service/transaction.service';
import { MaterialModule } from '../../material.module';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-transactioncreate',
  standalone: true,
  imports: [MaterialModule,ReactiveFormsModule,FormsModule,CommonModule,NgbModule,NgbDatepickerModule, NgbAlertModule, FormsModule, JsonPipe],
  templateUrl: './transactioncreate.component.html',
  styleUrl: './transactioncreate.component.css'
})

export class TransactioncreateComponent {
  transactionForm: FormGroup = new FormGroup({
    account: new FormControl(''),
    transactionDate: new FormControl(''),
    amount: new FormControl(''),
    description: new FormControl('')
  });

  submitted = false;
  accountCode:number | undefined;
  accountList: account[] = [];
  account:account | undefined;
  selectedAccount:account | undefined;
  accountNumber:string | undefined;
  transactionDate:Date | undefined; 
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
    let dateTimeString = "2024-06-30T15:00:00";
    this.transactionDate = new Date(dateTimeString);
    this.transactionForm = this.fb.group({
      account: [this.account, Validators.required],
      transactionDate: [this.transactionDate, Validators.required],
      amount: [this.amount, [Validators.required, Validators.pattern('/^-?(?!0)\d*\.\d+$/')]],
      description: [this.description, Validators.required]
    });

    this.accountCode = Number(this.route.snapshot.paramMap.get("accountCode"));
    this.accountService.getAll(0).subscribe((result) => {
      this.accountList = result; 
      this.selectedAccount = this.accountList.find(p=>p.code==this.accountCode);
    });
    
  }

  get f(): { [key: string]: AbstractControl } {
    return this.transactionForm.controls;
  }

  createTransaction(): void {
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
          code: 0,
          accountCode: 0,
          amount: 0, 
          transactionDate: new Date(),
          captureDate: new Date(),
          description: ""
        };

        t.accountCode = aCode??0;
        t.amount =amt;
        t.transactionDate = new Date(isoDateString);
        t.description = desc;
        t.captureDate = new Date();

        this.transactionService.createTransaction(t).subscribe(response => {
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
    this.router.navigateByUrl('/account/edit/'+ this.accountCode);
  }
  
}