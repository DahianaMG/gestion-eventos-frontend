import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-event-detail',
  standalone: false,
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {
  event: any;
  id: any;
  isLoading: boolean = true;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.eventService.getEventById(this.id).subscribe({
        next: (data) => {
          this.event = {
            ...data,
            has_fair_text: data.has_fair ? 'Sí' : 'No'
          };
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = 'Error al cargar el evento.';
          this.isLoading = false;
          console.error(err);
        }
      });
    } else {
      this.errorMessage = 'ID de evento no válido.';
      this.isLoading = false;
    }
  }
}
