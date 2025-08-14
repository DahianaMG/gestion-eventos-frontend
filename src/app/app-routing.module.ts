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

const routes: Routes = [
  { path: '', redirectTo: 'events', pathMatch: 'full' },

  //Users
  { path: 'users', component: UsersComponent },

  //Login
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },

  //Events
  { path: 'events', component: EventsComponent },
  { path: 'event/:id', component: EventDetailComponent },
  { path: 'create-event', component: EventFormComponent },
  { path: 'edit-event/:id', component: EventFormComponent },
  { path: 'my-events', component: MyEventsComponent },
  { path: 'user-events/:id', component: UserEventsComponent },

  //Registrations
  { path: 'registrations', component: RegistrationsComponent },
  { path: 'registration/:id', component: RegistrationDetailComponent },
  { path: 'create-registration', component: RegistrationFormComponent },
  { path: 'edit-registration/:id', component: RegistrationFormComponent },
  { path: 'my-registrations', component: MyRegistrationsComponent },
  { path: 'event-registrations/:id', component: EventRegistrationsComponent },
  { path: 'user-registrations/:id', component: UserRegistrationsComponent },

  //Schedules
  { path: 'schedules/:id', component: SchedulesComponent },
  { path: 'create-schedule', component: ScheduleFormComponent },
  { path: 'edit-schedule/:id', component: ScheduleFormComponent },

  { path: '**', component: EventsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
