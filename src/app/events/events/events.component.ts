import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event.service';

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

  constructor(private eventService: EventService) { }

  ngOnInit(): void {
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
        this.errorMessage = 'Error al cargar eventos. Por favor, inténtalo de nuevo más tarde.';
        this.isLoading = false;
        console.error('Error al cargar eventos:', err);
      }
    });
  }

  deleteEvent(id: number): void {
    if (confirm('¿Estás seguro de que querés eliminar este evento?')) {
      this.eventService.deleteEvent(id).subscribe({
        next: () => {
          this.events = this.events.filter(event => event.id !== id);
          alert('Evento eliminado correctamente.');
        },
        error: (err) => {
          console.error('Error al eliminar evento:', err);
          alert('Hubo un error al intentar eliminar el evento.');
        }
      });
    }
  }
}
