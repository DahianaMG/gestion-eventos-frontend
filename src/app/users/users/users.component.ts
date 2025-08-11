import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-users',
  standalone: false,
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  errorMessage: string | null = null;
  isLoading: boolean = true;

  constructor(
    private userService: UserService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (!user || user.role !== 'admin') {
        this.router.navigate(['/']);
      }
    });

    this.userService.getUsers().subscribe({
      next: data => {
        this.isLoading = false;
        this.users = data;
      },
      error: err => {
        this.isLoading = false;
        console.error('Error al obtener usuarios:', err);
        this.errorMessage = 'No se pudieron cargar los usuarios.';
      }
    });
  }

  getUserEvents(userId: number) {
    this.router.navigate(['/user-events', userId]);
  }
}
