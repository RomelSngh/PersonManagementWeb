import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AppmenuComponent } from './component/appmenu/appmenu.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppTableComponent } from './component/apptable/apptable.component';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet,AppmenuComponent,AppTableComponent,NgbModule,ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'authapp';
}
