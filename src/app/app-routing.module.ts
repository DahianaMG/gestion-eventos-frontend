import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventsComponent } from './events/events/events.component';
import { EventDetailComponent } from './events/event-detail/event-detail.component';
import { EventFormComponent } from './events/event-form/event-form.component';
import { MyEventsComponent } from './events/my-events/my-events.component';
import { UserEventsComponent } from './events/user-events/user-events.component';
import { LoginComponent } from './login/login/login.component';
import { RegisterComponent } from './login/register/register.component';
import { UsersComponent } from './users/users/users.component';
import { RegistrationsComponent } from './registrations/registrations/registrations.component';
import { RegistrationDetailComponent } from './registrations/registration-detail/registration-detail.component';
import { RegistrationFormComponent } from './registrations/registration-form/registration-form.component';
import { MyRegistrationsComponent } from './registrations/my-registrations/my-registrations.component';
import { EventRegistrationsComponent } from './registrations/event-registrations/event-registrations.component';
import { UserRegistrationsComponent } from './registrations/user-registrations/user-registrations.component';
import { SchedulesComponent } from './schedules/schedules/schedules.component';
import { ScheduleFormComponent } from './schedules/schedule-form/schedule-form.component';
import { VendorsComponent } from './vendors/vendors/vendors.component';
import { VendorFormComponent } from './vendors/vendor-form/vendor-form.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

const routes: Routes = [
  { path: '', redirectTo: 'events', pathMatch: 'full' },

  //Users
  { path: 'users', component: UsersComponent, canActivate: [AdminGuard] },

  //Login
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },

  //Events
  { path: 'events', component: EventsComponent },
  { path: 'event/:id', component: EventDetailComponent },
  { path: 'create-event', component: EventFormComponent, canActivate: [AuthGuard] },
  { path: 'edit-event/:id', component: EventFormComponent, canActivate: [AuthGuard] },
  { path: 'my-events', component: MyEventsComponent, canActivate: [AuthGuard] },
  { path: 'user-events/:id', component: UserEventsComponent, canActivate: [AdminGuard] },

  //Registrations
  { path: 'registrations', component: RegistrationsComponent, canActivate: [AdminGuard] },
  { path: 'registration/:id', component: RegistrationDetailComponent, canActivate: [AuthGuard] },
  { path: 'create-registration', component: RegistrationFormComponent, canActivate: [AuthGuard] },
  { path: 'edit-registration/:id', component: RegistrationFormComponent, canActivate: [AuthGuard] },
  { path: 'my-registrations', component: MyRegistrationsComponent, canActivate: [AuthGuard] },
  { path: 'event-registrations/:id', component: EventRegistrationsComponent, canActivate: [AuthGuard] },
  { path: 'user-registrations/:id', component: UserRegistrationsComponent, canActivate: [AdminGuard] },

  //Schedules
  { path: 'schedules/:id', component: SchedulesComponent, canActivate: [AuthGuard] },
  { path: 'create-schedule', component: ScheduleFormComponent, canActivate: [AuthGuard] },
  { path: 'edit-schedule/:id', component: ScheduleFormComponent, canActivate: [AuthGuard] },

  //Vendors
  { path: 'vendors/:id', component: VendorsComponent, canActivate: [AuthGuard] },
  { path: 'create-vendor', component: VendorFormComponent, canActivate: [AuthGuard] },
  { path: 'edit-vendor/:id', component: VendorFormComponent, canActivate: [AuthGuard] },

  { path: '**', component: EventsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
