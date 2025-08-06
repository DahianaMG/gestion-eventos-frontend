import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-my-events',
  standalone: false,
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.css']
})
export class MyEventsComponent implements OnInit {
  title = 'Mis eventos creados';
  events: any[] = [];
  isLoading: boolean = true;
  errorMessage: string | null = null;

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
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
}
