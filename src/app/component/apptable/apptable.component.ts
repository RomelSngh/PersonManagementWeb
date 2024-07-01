import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-table',
  standalone: true,
  templateUrl: './apptable.component.html',
  imports: [RouterLink,CommonModule,NgbModule,FormsModule],
  styleUrls: ['./apptable.component.css']
})
export class AppTableComponent {
  @Input() items: any[] = [];
  @Input() fields: string[] = [];
  @Input() headers: string[] = [];
  @Input() enableSearch : boolean = false; 
  @Input() collectionName : string = ""; 
  @Output() rowEditted = new EventEmitter<any>();
  @Output() rowDeleted = new EventEmitter<any>();
  @Output() addNewRow = new EventEmitter();

  searchTerm: string = '';
  filterText = '';
  page = 1;
  pageSize = 10;
  collectionSize: number = 100;
  currentRate = 8;
  allItems: any[] = [];

  ngOnInit(): void {
    this.collectionSize = this.items.length;
    this.allItems = this.items;
  }

  addNew() {
    this.addNewRow.emit();
  }
  // Example method implementations
  editItem(item: any) {
    console.log(`Editing item at index ${item}`);
    this.rowEditted.emit(item);
    // Implement your logic here
  }

  deleteItem(item: any) {
    console.log(`Deleting item ${item}`);
   // this.items.splice(item.index, 1);
    this.rowDeleted.emit(item);
  }

  get filteredData(): any[] {
    if (!this.searchTerm) return this.items;

    if (this.fields.includes('idNumber')) {
      return this.items.filter((val) =>
        val.name.toLowerCase().includes(this.searchTerm) || 
        val.idNumber.toLowerCase().includes(this.searchTerm) ||
        val.surname.toLowerCase().includes(this.searchTerm)
      );     
    } else if (this.fields.includes('accountNumber')){
      return this.items.filter((val) =>
        val.accountNumber.toLowerCase().includes(this.searchTerm) 
      );     
    } else return this.items;
   
  }

  search(event: any): void {
    const searchFilter = event.target?.value;
    if(searchFilter!== null && searchFilter.trim()!== '')
    {
      this.allItems = this.items;
      this.items = this.allItems.filter((val) =>
        val.name.toLowerCase().includes(searchFilter)
      );
      this.collectionSize = this.items.length;
    }
    else 
    {

    }
  }
}

