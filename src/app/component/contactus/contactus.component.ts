import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-contact-us',
  standalone:true,
  imports: [CommonModule,FormsModule],
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.css']
})
export class ContactUsComponent {
  formData = {
    name: '',
    email: '',
    message: ''
  };

  onSubmit() {
    // Email sending logic goes here
  }
}
