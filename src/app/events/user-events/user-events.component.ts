import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-user-events',
  standalone: false,
  templateUrl: './user-events.component.html',
  styleUrls: ['./user-events.component.css']
})
export class UserEventsComponent implements OnInit {
  title = 'Eventos del usuario';
  events: any[] = [];
  isLoading: boolean = true;
  errorMessage: string | null = null;
  userId!: number;

  constructor(
    private eventService: EventService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.userId) {
      this.errorMessage = 'ID de usuario no válido.';
      this.isLoading = false;
      return;
    }

    this.eventService.getEventsByUser(this.userId).subscribe({
      next: (data) => {
        this.events = data.map((event: any) => ({
          ...event,
          has_fair_text: event.has_fair ? 'Sí' : 'No'
        }));
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar eventos del usuario.';
        this.isLoading = false;
        console.error('Error:', err);
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
