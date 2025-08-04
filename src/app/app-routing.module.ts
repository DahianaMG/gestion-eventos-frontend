import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  /*{ path: '', redirectTo: '/events', pathMatch: 'full' },
  { path: 'events', component: HomeComponent },
  { path: 'event/:id', component: AdoptarComponent },
  { path: 'register', component: AboutComponent },
  { path: 'login', component: ContactoComponent },
  { path: '**', component: EventsComponent }*/
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
