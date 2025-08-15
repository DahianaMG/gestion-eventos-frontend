import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { VendorService } from '../../services/vendor.service';
import { EventService } from '../../services/event.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-vendor-form',
  standalone: false,
  templateUrl: './vendor-form.component.html',
  styleUrls: ['./vendor-form.component.css']
})
export class VendorFormComponent implements OnInit {
  isLoading = true;
  vendorForm!: FormGroup;
  isEditMode = false;
  vendorId!: number;
  eventId!: number;
  events: any[] = [];
  currentUser: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private vendorService: VendorService,
    private eventService: EventService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;

      // Inicializamos el formulario
      this.vendorForm = this.fb.group({
        user_id: ['', Validators.required],
        event_id: ['', Validators.required],
        stand_name: ['', [Validators.required, Validators.maxLength(100)]],
        stand_description: ['', Validators.required],
        stand_location: ['', [Validators.required, Validators.maxLength(100)]],
      });

      this.vendorId = Number(this.route.snapshot.paramMap.get('id'));
      this.eventId = Number(this.route.snapshot.queryParamMap.get('event_id'));
      this.isEditMode = !!this.vendorId;

      const events$ = this.currentUser.role === 'admin'
        ? this.eventService.getEvents()
        : this.eventService.getMyEvents();

      if (this.isEditMode) {
        const vendor$ = this.vendorService.getVendor(this.vendorId).pipe(
          catchError(err => {
            console.error('Error cargando vendor', err);
            return of(null);
          })
        );

        forkJoin([events$, vendor$]).subscribe({
          next: ([events, vendor]) => {
            this.events = events;
            if (vendor) {
              this.vendorForm.patchValue(vendor);
              this.eventId = vendor.event_id;
            }
            if (!this.isEditMode && this.eventId) {
              this.vendorForm.patchValue({ event_id: this.eventId });
            }
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Error cargando datos', err);
            this.isLoading = false;
          }
        });

      } else {
        events$.subscribe({
          next: (events) => {
            this.events = events;
            if (this.eventId) {
              this.vendorForm.patchValue({ event_id: this.eventId });
            }
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Error cargando eventos', err);
            this.isLoading = false;
          }
        });
      }
    });
  }

  onSubmit(): void {
    if (this.vendorForm.invalid) return;

    const data = this.vendorForm.value;

    const request$ = this.isEditMode
      ? this.vendorService.updateVendor(this.vendorId, data)
      : this.vendorService.createVendor(data);

    request$.subscribe({
      next: () => {
        localStorage.setItem(
          'successMessage',
          this.isEditMode ? 'Stand actualizado con éxito' : 'Stand creado con éxito'
        );
        this.router.navigate(['/vendors', this.eventId || data.event_id]);
      },
      error: (err) => console.error('Error guardando vendor', err)
    });
  }
}
