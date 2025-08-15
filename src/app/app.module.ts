import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { EventsComponent } from './events/events/events.component';
import { EventDetailComponent } from './events/event-detail/event-detail.component';
import { EventFormComponent } from './events/event-form/event-form.component';
import { MyEventsComponent } from './events/my-events/my-events.component';
import { UserEventsComponent } from './events/user-events/user-events.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './ui/header/header.component';
import { FooterComponent } from './ui/footer/footer.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './services/auth.interceptor';
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

@NgModule({
  declarations: [
    AppComponent,
    EventsComponent,
    EventDetailComponent,
    EventFormComponent,
    MyEventsComponent,
    UserEventsComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    RegisterComponent,
    UsersComponent,
    RegistrationsComponent,
    RegistrationDetailComponent,
    RegistrationFormComponent,
    MyRegistrationsComponent,
    EventRegistrationsComponent,
    UserRegistrationsComponent,
    SchedulesComponent,
    ScheduleFormComponent,
    VendorsComponent,
    VendorFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
