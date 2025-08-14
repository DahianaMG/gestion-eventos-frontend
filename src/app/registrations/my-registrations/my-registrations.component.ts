import { Component, OnInit } from '@angular/core';
import { RegistrationService } from '../../services/registration.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-registrations',
  standalone: false,
  templateUrl: './my-registrations.component.html',
  styleUrls: ['./my-registrations.component.css']
})
export class MyRegistrationsComponent implements OnInit {
  title = 'Mis inscripciones';
  registrations: any[] = [];
  isLoading: boolean = true;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private registrationService: RegistrationService, private router: Router) {}

  ngOnInit(): void {
    this.successMessage = localStorage.getItem('successMessage');
    if (this.successMessage) {
      localStorage.removeItem('successMessage');
    }

    this.registrationService.getMyRegistrations().subscribe({
      next: (data) => {
        this.registrations = data;
        this.isLoading = false;
        console.log('Inscripciones cargadas:');
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar tus inscripciones. Asegúrate de haber iniciado sesión.';
        this.isLoading = false;
        console.error('Error al cargar inscripciones:', err);
      }
    });
  }
}
