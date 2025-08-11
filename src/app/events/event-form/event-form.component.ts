import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
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
      title: ['', [Validators.required, Validators.maxLength(150)]],
      description: ['', Validators.required],
      date_time: ['', [Validators.required, this.futureDateValidator]],
      location: ['', [Validators.required, Validators.maxLength(150)]],
      has_fair: [false],
      capacity: [0, [Validators.required, Validators.min(1), Validators.pattern(/^\d+$/)]],
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

  futureDateValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const selectedDate = new Date(value);
    const now = new Date();

    if (selectedDate <= now) {
      return { notFutureDate: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.eventForm.invalid) return;

    const eventData = this.eventForm.value;

    if (this.isEditMode) {
      this.eventService.updateEvent(this.eventId, eventData).subscribe({
        next: () => {
          localStorage.setItem('successMessage', 'Evento actualizado con éxito');
          this.router.navigate(['/my-events']);
        },
        error: (err) => {
          console.error('Error al actualizar', err);
        }
      });
    } else {
      this.eventService.createEvent(eventData).subscribe({
        next: () => {
          localStorage.setItem('successMessage', 'Evento creado con éxito');
          this.router.navigate(['/my-events']);
        },
        error: (err) => {
          console.error('Error al crear evento', err);
        }
      });
    }
  }
}
