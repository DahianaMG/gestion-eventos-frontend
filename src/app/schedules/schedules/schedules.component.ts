import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ScheduleService } from '../../services/schedule.service';
import { EventService } from '../../services/event.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-schedules',
  standalone: false,
  templateUrl: './schedules.component.html',
  styleUrls: ['./schedules.component.css']
})
export class SchedulesComponent implements OnInit {
  title = 'Actividades'
  eventId!: number;
  schedules: any[] = [];
  isLoading = true;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  currentUser: any;
  event: any;

  constructor(
    private route: ActivatedRoute,
    private scheduleService: ScheduleService,
    private eventService: EventService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.successMessage = localStorage.getItem('successMessage');
    if (this.successMessage) {
      localStorage.removeItem('successMessage');
    }

    this.eventId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.eventId) {
      this.eventService.getEventById(this.eventId).subscribe({
        next: (data) => {
          this.event = data;
          console.log(this.event)
        },
        error: (err) => {
          console.error(err);
        }
      });
    } else {
      this.errorMessage = 'ID de evento no válido.';
      this.isLoading = false;
    }

    this.scheduleService.getSchedules(this.eventId).subscribe({
      next: (data) => {
        this.schedules = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al obtener actividades', err);
        this.errorMessage = 'No se pudieron cargar las actividades.';
        this.isLoading = false;
      }
    });
  }

  canEditOrDelete(event: any): boolean {
    return this.currentUser?.role === 'admin' || this.currentUser?.id === event.user_id;
  }

  deleteSchedule(id: number): void {
    if (confirm('¿Estás seguro de querer eliminar esta actividad?')) {
      this.scheduleService.deleteSchedule(id).subscribe({
        next: () => {
          this.schedules = this.schedules.filter(schedule => schedule.id !== id);
          this.successMessage = 'Actividad eliminada correctamente.';
        },
        error: (err) => {
          console.error('Error al eliminar actividad:', err);
          this.errorMessage = 'Hubo un error al intentar eliminar la actividad.';
        }
      });
    }
  }
}
