import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-events',
  standalone: false,
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  title = '¡Bienvenido!';
  events: any[] = [];
  isLoading: boolean = true;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  currentUser: any;

  constructor(
    private eventService: EventService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;

      if (user !== null || !this.authService.getToken()) {
      this.loadEvents();
    }
    });

    this.successMessage = localStorage.getItem('successMessage');
    if (this.successMessage) {
      localStorage.removeItem('successMessage');
    }
  }

    loadEvents(): void {
      this.eventService.getEvents().subscribe({
        next: (data) => {
          this.events = data.map((event: any) => ({
            ...event,
            has_fair_text: event.has_fair ? 'Sí' : 'No'
          }));
          this.isLoading = false;
          console.log('Eventos cargados:', this.events);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = 'Error al cargar eventos. Por favor, intente de nuevo más tarde.';
          console.error('Error al cargar eventos:', err);
        }
      });
    }


  canEditOrDelete(event: any): boolean {
    return this.currentUser?.role === 'admin' || this.currentUser?.id === event.user_id;
  }

  deleteEvent(id: number): void {
    const eventToDelete = this.events.find(e => e.id === id);

    if (!this.canEditOrDelete(eventToDelete)) {
      this.errorMessage = 'No tiene permisos para eliminar este evento.';
      return;
    }

    if (confirm('¿Esta seguro de querer eliminar este evento?')) {
      this.eventService.deleteEvent(id).subscribe({
        next: () => {
          this.events = this.events.filter(event => event.id !== id);
          localStorage.setItem('successMessage', 'Evento eliminado correctamente');
          window.location.reload();
        },
        error: (err) => {
          console.error('Error al eliminar evento:', err);
          this.errorMessage = 'Hubo un error al intentar eliminar el evento.';
        }
      });
    }
  }
}
