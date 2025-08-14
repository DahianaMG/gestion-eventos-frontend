import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RegistrationService } from '../../services/registration.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-event-registrations',
  standalone: false,
  templateUrl: './event-registrations.component.html',
  styleUrls: ['./event-registrations.component.css']
})
export class EventRegistrationsComponent implements OnInit {
  eventId!: number;
  eventTitle: string = '';
  registrations: any[] = [];
  isLoading: boolean = true;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  currentUser: any;

  constructor(
    private route: ActivatedRoute,
    private registrationService: RegistrationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => this.currentUser = user);

    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.eventId = +idParam;
        this.loadRegistrations();
      } else {
        this.errorMessage = 'ID de evento no válido';
        this.isLoading = false;
      }
    });

    this.successMessage = localStorage.getItem('successMessage');
    if (this.successMessage) {
      localStorage.removeItem('successMessage');
    }
  }

  loadRegistrations(): void {
    this.registrationService.getRegistrationsByEvent(this.eventId).subscribe({
      next: (data: any) => {
        this.eventTitle = data.event;
        this.registrations = data.registrations;
        this.isLoading = false;
        console.log('Inscripciones cargadas:', data);
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar las inscripciones del evento.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  deleteRegistration(registrationId: number): void {
    if (!confirm('¿Está seguro de eliminar esta inscripción?')) return;

    this.registrationService.deleteRegistration(registrationId).subscribe({
      next: () => {
        this.registrations = this.registrations.filter(r => r.id !== registrationId);
      },
      error: (err) => {
        console.error('Error al eliminar inscripción:', err);
        this.errorMessage = 'No se pudo eliminar la inscripción.';
      }
    });
  }
}
