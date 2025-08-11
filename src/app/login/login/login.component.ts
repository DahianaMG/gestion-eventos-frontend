import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.successMessage = localStorage.getItem('successMessage');
    if (this.successMessage) {
      localStorage.removeItem('successMessage');
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: () => this.router.navigate(['/events']),
        error: err => {
          console.error('Error en login', err);
          this.errorMessage = 'Correo o contraseña incorrecta.';
        }
      });
    } else {
      {
        console.error('Error de validación');
        this.errorMessage = 'Complete los campos correctamente.';
      }
    }
  }
}
