import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VendorService } from '../../services/vendor.service';
import { EventService } from '../../services/event.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-vendors',
  standalone: false,
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.css']
})
export class VendorsComponent implements OnInit {
  title = 'Stands'
  eventId!: number;
  vendors: any[] = [];
  isLoading = true;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  currentUser: any;
  event: any;

  constructor(
    private route: ActivatedRoute,
    private vendorService: VendorService,
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
        },
        error: (err) => {
          console.error(err);
        }
      });
    } else {
      this.errorMessage = 'ID de evento no válido.';
      this.isLoading = false;
    }

    this.vendorService.getVendors(this.eventId).subscribe({
      next: (data) => {
        this.vendors = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al obtener stands', err);
        this.errorMessage = 'No se pudieron cargar los stands.';
        this.isLoading = false;
      }
    });
  }

  canEditOrDelete(event: any, vendorId: number): boolean {
    return this.currentUser?.role === 'admin' || this.currentUser?.id === event.user_id || this.currentUser?.id === vendorId;
  }

  canCreate(event: any): boolean {
    return this.currentUser?.role === 'admin' || this.currentUser?.id === event.user_id;
  }

  deleteVendor(id: number): void {
    if (confirm('¿Estás seguro de querer eliminar esta actividad?')) {
      this.vendorService.deleteVendor(id).subscribe({
        next: () => {
          this.vendors = this.vendors.filter(vendor => vendor.id !== id);
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
