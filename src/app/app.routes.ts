import { Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { LoginComponent } from './component/login/login.component';

import { RegisterComponent } from './component/register/register.component';
import { authGuard } from './_guard/auth.guard';

import { PersonComponent } from './component/person/person.component';
import { PersonCreateComponent } from './component/personcreate/personcreate.component';
import { PersonUpdateComponent } from './component/personupdate/personupdate.component';
import { AccountcreateComponent } from './component/accountcreate/accountcreate.component';
import { AccounteditComponent } from './component/accountedit/accountedit.component';
import { TransactioncreateComponent } from './component/transactioncreate/transactioncreate.component';
import { TransactioneditComponent } from './component/transactionedit/transactionedit.component';
import { AboutusComponent } from './component/aboutus/aboutus.component';
import { ContactUsComponent } from './component/contactus/contactus.component';

export const routes: Routes = [
    {path:'',component:HomeComponent},
    {path:'register',component:RegisterComponent},
    {path:'login',component:LoginComponent},
    {path:'home',component:HomeComponent},
    {path:'aboutus',component:AboutusComponent},
    {path:'contactus',component:ContactUsComponent},
    {path:'person',component:PersonComponent,canActivate:[authGuard]},
    {path:'person/add',component:PersonCreateComponent,canActivate:[authGuard]},
    {path:'person/edit/:code',component:PersonUpdateComponent,canActivate:[authGuard]},
    {path:'account/add/:personCode',component:AccountcreateComponent,canActivate:[authGuard]},
    {path:'account/edit/:code',component:AccounteditComponent,canActivate:[authGuard]},
    {path:'transaction/add/:accountCode',component:TransactioncreateComponent,canActivate:[authGuard]},
    {path:'transaction/edit/:code',component:TransactioneditComponent,canActivate:[authGuard]},

];
