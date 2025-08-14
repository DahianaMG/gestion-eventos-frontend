import { Component, OnInit } from '@angular/core';
import { RegistrationService } from '../../services/registration.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registrations',
  standalone: false,
  templateUrl: './registrations.component.html',
  styleUrls: ['./registrations.component.css']
})
export class RegistrationsComponent implements OnInit {
  registrations: any[] = [];
  isLoading = true;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  currentUser: any;

  constructor(
    private registrationService: RegistrationService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (!user || user.role !== 'admin') {
        this.router.navigate(['/']);
      } else {
        this.loadRegistrations();
      }
    });

    this.successMessage = localStorage.getItem('successMessage');
    if (this.successMessage) {
      localStorage.removeItem('successMessage');
    }
  }

  loadRegistrations(): void {
    this.registrationService.getRegistrations().subscribe({
      next: data => {
        this.registrations = data;
        this.isLoading = false;
      },
      error: err => {
        this.errorMessage = 'Error al cargar las inscripciones.';
        this.isLoading = false;
        console.error('Error al cargar inscripciones:', err);
      }
    });
  }

  deleteRegistration(id: number): void {
  if (confirm('¿Está seguro de querer eliminar esta inscripción?')) {
    this.registrationService.deleteRegistration(id).subscribe({
      next: () => {
        this.registrations = this.registrations.filter(reg => reg.id !== id);
        localStorage.setItem('successMessage', 'Inscripción eliminada correctamente');
        window.location.reload();
      },
      error: (err) => {
        console.error('Error al eliminar inscripción:', err);
        this.errorMessage = 'Hubo un error al intentar eliminar la inscripción.';
      }
    });
  }
}

}
