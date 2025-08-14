import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { RegistrationService } from '../../services/registration.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration-detail',
  standalone: false,
  templateUrl: './registration-detail.component.html',
  styleUrls: ['./registration-detail.component.css']
})
export class RegistrationDetailComponent implements OnInit {
  currentUser: any;
  registration: any;
  isLoading = true;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private registrationService: RegistrationService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.successMessage = localStorage.getItem('successMessage');
    if (this.successMessage) {
      localStorage.removeItem('successMessage');
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.registrationService.getRegistrationById(+id).subscribe({
        next: data => {
          this.registration = data;
          this.isLoading = false;
        },
        error: err => {
          this.errorMessage = 'Error al cargar la inscripción.';
          this.isLoading = false;
          console.error(err);
        }
      });
    } else {
      this.errorMessage = 'ID de inscripción no válido.';
      this.isLoading = false;
    }
  }

  deleteRegistration(): void {
    if (!this.registration) return;
    if (!confirm('¿Seguro que querés cancelar esta inscripción?')) return;

    this.registrationService.deleteRegistration(this.registration.id).subscribe({
      next: () => {
        localStorage.setItem('successMessage', 'Inscripción eliminada correctamente');
        this.router.navigate(['/my-registrations']);
      },
      error: (err) => {
        console.error('Error al eliminar inscripción:', err);
        this.errorMessage = 'Hubo un error al intentar eliminar la inscripción.';
      }
    });
  }
}
