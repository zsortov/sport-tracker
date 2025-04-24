import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Chart from 'chart.js/auto';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatError } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatLineModule, MatOptionModule } from '@angular/material/core';
import { MatListModule } from '@angular/material/list';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatSidenavModule,
    MatSelectModule,
    MatOptionModule,
    MatLineModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatError,
    NgIf
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  workouts: any[] = [];
  exercises: any[] = [];
  newExerciseId = '';
  newDuration = 0;
  message = '';

  constructor(private api: ApiService, private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.loadWorkouts();
    this.api.getExercises().subscribe({
      next: (data: any) => this.exercises = data
    });
  }

  loadWorkouts() {
    this.api.getWorkouts().subscribe({
      next: (data: any) => {
        this.workouts = data;
        this.initChart(); // важно: построить график после загрузки
      },
      error: () => this.message = 'Ошибка загрузки тренировок'
    });
  }

  getExerciseName(id: number): string {
    const ex = this.exercises.find(e => e.id === id);
    return ex ? ex.name : 'Неизвестно';
  }

  addWorkout() {
    const date = new Date().toISOString().split('T')[0];
    this.api.createWorkout({
      exercise: this.newExerciseId,
      duration: this.newDuration,
      date
    }).subscribe(() => {
      this.newDuration = 0;
      this.newExerciseId = '';
      this.loadWorkouts();
    });
  }

  logout() {
    const refresh = this.auth.getRefreshToken();
    if (refresh) {
      this.auth.logout(refresh).subscribe(() => {
        this.auth.clearTokens();
        this.router.navigate(['/login']);
      });
    }
  }

  deleteWorkout(id: number) {
    this.api.deleteWorkout(id).subscribe(() => {
      this.workouts = this.workouts.filter(w => w.id !== id);
    });
  }

  initChart() {
    setTimeout(() => {
      const ctx = document.getElementById('workoutChart') as HTMLCanvasElement;
      if (ctx) {
        const data = this.workouts.reduce((acc: any, w: any) => {
          acc[w.date] = (acc[w.date] || 0) + w.duration;
          return acc;
        }, {});

        const labels = Object.keys(data);
        const durations = Object.values(data);

        new Chart(ctx, {
          type: 'line',
          data: {
            labels,
            datasets: [{
              label: 'Минуты тренировок',
              data: durations,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              tension: 0.3,
              fill: true
            }]
          }
        });
      }
    }, 300);
  }
}
