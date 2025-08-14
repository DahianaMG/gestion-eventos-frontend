import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-my-events',
  standalone: false,
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.css']
})
export class MyEventsComponent implements OnInit {
  title = 'Mis eventos';
  events: any[] = [];
  isLoading: boolean = true;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.successMessage = localStorage.getItem('successMessage');
    if (this.successMessage) {
      localStorage.removeItem('successMessage');
    }

    this.eventService.getMyEvents().subscribe({
      next: (data) => {
        this.events = data.map((event: any) => ({
          ...event,
          has_fair_text: event.has_fair ? 'Sí' : 'No'
        }));
        this.isLoading = false;
        console.log('Mis eventos cargados:', this.events);
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar tus eventos. Asegúrate de haber iniciado sesión.';
        this.isLoading = false;
        console.error('Error al cargar mis eventos:', err);
      }
    });
  }

  deleteEvent(id: number): void {
    if (confirm('¿Estás seguro de querer eliminar este evento?')) {
      this.eventService.deleteEvent(id).subscribe({
        next: () => {
          this.events = this.events.filter(event => event.id !== id);
          this.successMessage = 'Evento eliminado correctamente.';
        },
        error: (err) => {
          console.error('Error al eliminar evento:', err);
          this.errorMessage = 'Hubo un error al intentar eliminar el evento.';
        }
      });
    }
  }
}
