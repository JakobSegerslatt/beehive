import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private gameService: GameService = inject(GameService);
  private router: Router = inject(Router);

  form = new FormGroup({
    name: new FormControl('', Validators.required),
  });

  submit() {
    if (this.form.invalid) return;

    const name: string = this.form.value.name!.trim();

    this.gameService
      .createUser(name)
      ?.then(() => this.router.navigate(['/play']));
  }
}
