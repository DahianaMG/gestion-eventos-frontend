import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RegistrationService } from '../../services/registration.service';
import { AuthService } from '../../services/auth.service';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-registration-form',
  standalone: false,
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.css']
})
export class RegistrationFormComponent implements OnInit {
  registrationForm!: FormGroup;
  isEditMode = false;
  currentUser: any;
  isAdmin = false;
  isOrganizerFlag = false;
  events: any[] = [];
  registrationId!: number;
  loadedRegistration: any;
  successMessage = '';
  errorMessage = '';
  eventIdParam!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private registrationService: RegistrationService,
    private authService: AuthService,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.registrationId = Number(this.route.snapshot.paramMap.get('id'));
    this.eventIdParam = Number(this.route.snapshot.queryParamMap.get('eventId'));
    console.log(this.eventIdParam)
    this.isEditMode = !!this.registrationId;

    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isAdmin = this.currentUser?.role === 'admin';

      if (this.isAdmin) {
        this.eventService.getEvents().subscribe(data => (this.events = data));
      }

      this.buildForm();

      if (this.isEditMode) {
        this.loadRegistration();
      } else {
        this.setRoleFlags();
        this.applyPermissionsForCreate();
      }
    });
  }

  buildForm(): void {
    const integerPositive = [Validators.required, Validators.min(1), Validators.pattern(/^[0-9]+$/)];
    const shortText = [Validators.required, Validators.maxLength(20)];

    this.registrationForm = this.fb.group({
      user_id: [{ value: '', disabled: true }, integerPositive],
      event_id: ['', integerPositive],
      role_in_event: ['', shortText],
      status: ['', Validators.maxLength(20)]
    });
  }

  private setRoleFlags(): void {
    this.isAdmin = this.currentUser?.role === 'admin';
    this.isOrganizerFlag = this.currentUser?.id === this.loadedRegistration?.event?.organizer_id;
  }

  private applyPermissionsForCreate(): void {
    if (this.isAdmin) {
      this.registrationForm.get('user_id')?.enable();
      this.registrationForm.get('event_id')?.enable();
      this.registrationForm.get('status')?.enable();
      this.registrationForm.get('role_in_event')?.enable();
      return;
    }

    this.registrationForm.get('user_id')?.setValue(this.currentUser?.id);
    this.registrationForm.get('user_id')?.disable();

    if (this.eventIdParam) {
      this.registrationForm.get('event_id')?.setValue(this.eventIdParam);
      this.registrationForm.get('event_id')?.disable();
    } else {
      this.registrationForm.get('event_id')?.disable();
    }

    this.registrationForm.get('status')?.disable();
    this.registrationForm.get('role_in_event')?.enable();
  }

  private loadRegistration(): void {
    this.registrationService.getRegistrationById(this.registrationId).subscribe({
      next: reg => {
        this.loadedRegistration = reg;

        this.registrationForm.patchValue({
          user_id: reg.user.id,
          event_id: reg.event.id,
          role_in_event: reg.role_in_event,
          status: reg.status
        });

        this.setRoleFlags();
        this.applyPermissionsForEdit();
      },
      error: err => {
        console.error('Error al cargar inscripción', err);
        this.errorMessage = 'No se pudo cargar la inscripción.';
      }
    });
  }

  private applyPermissionsForEdit(): void {
    if (this.isAdmin) {
      this.registrationForm.get('user_id')?.enable();
      this.registrationForm.get('event_id')?.enable();
      this.registrationForm.get('status')?.enable();
      this.registrationForm.get('role_in_event')?.enable();
      return;
    }

    if (this.isOrganizerFlag) {
      this.registrationForm.get('status')?.enable();
      this.registrationForm.get('role_in_event')?.disable();
      this.registrationForm.get('user_id')?.disable();
      this.registrationForm.get('event_id')?.disable();
      return;
    }

    this.registrationForm.get('status')?.disable();
    this.registrationForm.get('role_in_event')?.enable();
    this.registrationForm.get('user_id')?.disable();
    this.registrationForm.get('event_id')?.disable();
  }

  private buildPayload(): any {
    if (this.isEditMode || this.isAdmin) {
      return this.registrationForm.value;
    }

    return {
      user_id: this.currentUser?.id,
      event_id: this.registrationForm.get('event_id')?.value,
      role_in_event: this.registrationForm.get('role_in_event')?.value
    };
  }

  onSubmit(): void {
    if (this.registrationForm.invalid) return;

    const body = this.buildPayload();

    const request$ = this.isEditMode
      ? this.registrationService.updateRegistration(this.registrationId, body)
      : this.registrationService.createRegistration(body);

    request$.subscribe({
      next: () => this.redirectAfterSave(),
      error: err => {
        console.error('Error al guardar inscripción', err);
        this.errorMessage = 'Ocurrió un error al procesar la solicitud. Revise los campos.';
      }
    });
  }

  private redirectAfterSave(): void {
    const message = this.isEditMode
      ? 'Inscripción actualizada con éxito'
      : 'Inscripción creada con éxito';
    localStorage.setItem('successMessage', message);

    if (this.isAdmin) {
      this.router.navigate(['/registrations']);
    } else if (this.isOrganizerFlag) {
      this.router.navigate([`/event-registrations/${this.loadedRegistration.event.id}`]);
    } else {
      this.router.navigate(['/my-registrations']);
    }
  }
}
