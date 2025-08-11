import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {

    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      password_confirmation: ['', [Validators.required, Validators.minLength(8)]]
    },
    { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
  const password = form.get('password')?.value;
  const confirmPassword = form.get('password_confirmation')?.value;

  return password === confirmPassword ? null : { passwordMismatch: true };
}

  onSubmit() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.router.navigate(['/events']);
        },
        error: err => {
          console.error('Error en registro', err);
          this.errorMessage = 'Error en el registro. Verifique los datos e intente nuevamente.';
        }
      });
    } else {
      {
        console.error('Error de validación');
        this.errorMessage = 'Complete los campos correctamente';
      }
    }
  }
}
