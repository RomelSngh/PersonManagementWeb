import { Component } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { person } from '../../_model/person.model';
import { PersonService } from '../../_service/person.service';
import { ToastrService } from 'ngx-toastr';
import { AppTableComponent } from '../apptable/apptable.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-person',
  standalone: true,
  imports: [RouterLink,CommonModule,NgbModule,FormsModule,AppTableComponent],
  templateUrl: './person.component.html',
  styleUrl: './person.component.css'
})
export class PersonComponent {
  searchTerm: string = '';
  page = 1;
  pageSize = 10;
  collectionSize: number = 100;
  currentRate = 8;
  persons: person[] = [];
  allPersons: person[] = [];
  _response:any;

  constructor(private service: PersonService, private toastr: ToastrService,
    private router: Router) {

  }

  ngOnInit(): void {
    this.loadPersons();
  }

  addNewPerson() : void {
    this.router.navigateByUrl('/person/add');
  }

  loadPersons() : void {
    this.service.getAll(0)
      .subscribe((data: person[]) => {
        debugger
        this.collectionSize = data.length;
        this.persons = data;
        this.allPersons = this.persons;
      });

  }

  editPerson(event: any): void {
    let persn : person = event as person; 
    //alert(persn.idNumber);
   // this.router.navigate(["person", "edit"],{ queryParams: { personId: persn.code } });  
    this.router.navigateByUrl('/person/edit/' + persn.code)
  }

  deletePerson(event: any): void {
    let persn : person = event as person;
    this.confirmDelete(persn);  
  //  if (confirm('Are you sure?')) {

   // }
  }

  confirmDelete(person:any): void {
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
        this.service.deletePerson(person.code).subscribe(item=>{
          this._response=item;
          if (this._response.result === 'pass') {
            this.toastr.success('Deleted successfully', 'Success');
            this.loadPersons();
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
    this.persons = this.allPersons.filter((val) =>
      val.name.toLowerCase().includes(searchFilter)
    );
    this.collectionSize = this.persons.length;
  }

}
