import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-event-form',
  standalone: false,
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent implements OnInit {
  eventForm!: FormGroup;
  isEditMode: boolean = false;
  eventId!: number;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      date_time: ['', Validators.required],
      location: ['', Validators.required],
      has_fair: [false],
      capacity: [0, [Validators.required, Validators.min(1)]],
    });

    this.eventId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.eventId) {
      this.isEditMode = true;
      this.eventService.getEventById(this.eventId).subscribe({
        next: (event) => {
          this.eventForm.patchValue(event);
        },
        error: (err) => {
          console.error('Error al cargar el evento', err);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.eventForm.invalid) return;

    const eventData = this.eventForm.value;

    if (this.isEditMode) {
      this.eventService.updateEvent(this.eventId, eventData).subscribe({
        next: () => {
          alert('Evento actualizado con éxito');
          this.router.navigate(['/events']);
        },
        error: (err) => {
          console.error('Error al actualizar', err);
        }
      });
    } else {
      this.eventService.createEvent(eventData).subscribe({
        next: () => {
          alert('Evento creado con éxito');
          this.router.navigate(['/events']);
        },
        error: (err) => {
          console.error('Error al crear evento', err);
        }
      });
    }
  }
}
