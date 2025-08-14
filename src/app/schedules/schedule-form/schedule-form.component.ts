import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ScheduleService } from '../../services/schedule.service';
import { EventService } from '../../services/event.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-schedule-form',
  standalone: false,
  templateUrl: './schedule-form.component.html',
  styleUrls: ['./schedule-form.component.css']
})
export class ScheduleFormComponent implements OnInit {
  scheduleForm!: FormGroup;
  isEditMode = false;
  scheduleId!: number;
  eventId!: number;
  events: any[] = [];
  currentUser: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private scheduleService: ScheduleService,
    private eventService: EventService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.scheduleForm = this.fb.group({
      event_id: [null, Validators.required],
      activity_name: ['', [Validators.required, Validators.maxLength(100)]],
      start_time: ['', Validators.required],
      end_time: ['', Validators.required],
      location_description: ['', [Validators.required, Validators.maxLength(150)]],
    });

    this.scheduleId = Number(this.route.snapshot.paramMap.get('id'));
    this.eventId = Number(this.route.snapshot.queryParamMap.get('event_id'));

    if (this.scheduleId) {
      this.isEditMode = true;
      this.scheduleService.getSchedule(this.scheduleId).subscribe({
        next: (schedule) => {
          this.scheduleForm.patchValue(schedule);
          this.eventId = schedule.event_id;
        }
      });
    } else {
      if (this.eventId) {
        this.scheduleForm.patchValue({ event_id: this.eventId });
      } else {
        this.loadEvents();
      }
    }
  }

  loadEvents(): void {
    if (this.currentUser?.role === 'admin') {
        this.eventService.getEvents().subscribe({
          next: (events) => {
            this.events = events;
          },
          error: (err) => {
            console.error('Error cargando eventos', err);
          }
        });
    } else {
        this.eventService.getMyEvents().subscribe({
          next: (events) => {
            this.events = events;
          },
          error: (err) => {
            console.error('Error cargando eventos', err);
          }
        });
    }

  }

  onSubmit(): void {
    if (this.scheduleForm.invalid) return;

    const data = this.scheduleForm.value;

    if (this.isEditMode) {
      this.scheduleService.updateSchedule(this.scheduleId, data).subscribe({
        next: () => {
          localStorage.setItem('successMessage', 'Actividad actualizada con éxito');
          this.router.navigate(['/schedules', this.eventId]);
        }
      });
    } else {
      this.scheduleService.createSchedule(data).subscribe({
        next: () => {
          localStorage.setItem('successMessage', 'Actividad creada con éxito');
          this.router.navigate(['/schedules', this.eventId || data.event_id]);
        }
      });
    }
  }
}
