import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RegistrationService } from '../../services/registration.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-events',
  standalone: false,
  templateUrl: './user-registrations.component.html',
  styleUrls: ['./user-registrations.component.css']
})
export class UserRegistrationsComponent implements OnInit {
  title = 'Eventos a los que se inscribió el usuario';
  registrations: any[] = [];
  isLoading: boolean = true;
  errorMessage: string | null = null;
  userId!: number;
  userName = '';

  constructor(
    private registrationService: RegistrationService,
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.userId) {
      this.errorMessage = 'ID de usuario no válido.';
      this.isLoading = false;
      return;
    }

    this.userService.getUser(this.userId).subscribe(user => {
      this.userName = user.name;
    });

    this.registrationService.getRegistrationsByUser(this.userId).subscribe({
      next: (data) => {
        this.registrations = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar eventos del usuario.';
        this.isLoading = false;
        console.error('Error:', err);
      }
    });
  }
}
