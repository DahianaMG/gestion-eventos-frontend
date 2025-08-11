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

const routes: Routes = [
  { path: '', redirectTo: 'events', pathMatch: 'full' },

  //Users (admin)
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

  { path: '**', component: EventsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
