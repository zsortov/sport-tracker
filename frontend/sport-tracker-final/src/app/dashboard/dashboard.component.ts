import { Component, OnInit } from '@angular/core';
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
import { MatSelectModule } from '@angular/material/select';
import { MatLineModule, MatOptionModule } from '@angular/material/core';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
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
    MatProgressBarModule,
    MatLineModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    NgIf
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  workouts: any[] = [];
  exercises: any[] = [];
  chart: Chart | null = null;
  startTime: number | null = null;
  newExerciseId = '';
  newDuration = 0;
  message = '';
  goal = 840
  done = 0
  elapsedTime = '';
  details = ''; // детали упражнений (типа сколько км, сколько жимов сделал и так далее)
  private timerInterval: any;
  reps: number = 0;
  distance: number = 0;


  constructor(private api: ApiService, private auth: AuthService, private router: Router) {}

  startWorkout() {
    if (!this.newExerciseId) return;
    this.startTime = Date.now();

    this.timerInterval = setInterval(() => {
      this.elapsedTime = this.getElapsedTime();
    }, 1000);
  }

  stopWorkout() {
    if (!this.startTime) return;
    const endTime = Date.now();
    const duration = Math.round((endTime - this.startTime) / 60000);
  
    const workout = {
      exercise: this.newExerciseId,
      duration,
      date: new Date().toISOString().split('T')[0],
      details: this.details
    };
  
    this.api.createWorkout(workout).subscribe(() => {
      this.startTime = null;
      this.newExerciseId = '';
      this.details = ''; // очистка
      this.loadWorkouts();
      this.getCoachTip(duration, this.getExerciseName(Number(workout.exercise)));
    });
  }
  

  
  addWorkout() {
    const date = new Date().toISOString().split('T')[0];
    this.api.createWorkout({
      exercise: this.newExerciseId,
      duration: this.newDuration,
      date,
      details: this.details
    }).subscribe(() => {
      this.newDuration = 0;
      this.newExerciseId = '';
      this.details = ''; // очистка
      this.loadWorkouts();
    });
  }
  

  getElapsedTime(): string {
    if (!this.startTime) return '';
    const ms = Date.now() - this.startTime;
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min} мин ${sec} сек`;
  }

  getCoachTip(duration: number, name: string) {
    const tips: string[] = [];

    if (duration < 15) {
      tips.push("Добавь ещё 10-15 минут для лучшего эффекта 💪");
    } else if (duration > 45) {
      tips.push("Отличная работа! Не забудь восстановиться 🧘");
    }

    const lower = name.toLowerCase();
    if (!lower.includes("run") && !lower.includes("cardio") && !lower.includes("stretch")) {
      tips.push("Добавь немного кардио завтра для баланса 🏃");
    }

    this.message = tips.join(" ");
  }

  resetWorkout() {
    this.startTime = null;
    this.elapsedTime = '';
    clearInterval(this.timerInterval);
  }

  skipWorkout() {
    this.startTime = null;
    this.elapsedTime = '';
    this.message = 'Тренировка пропущена 🚫';
    clearInterval(this.timerInterval);
  }

  getExerciseIcon(name: string): string {
    const n = name.toLowerCase();
    if (n.includes('push')) return '💪';
    if (n.includes('run')) return '🏃';
    if (n.includes('stretch')) return '🧘';
    if (n.includes('cycle')) return '🚴';
    return '🏋️';
  }

  ngOnInit() {
    this.updateProgress();
    this.loadWorkouts();
    this.initChart();
    this.api.getExercises().subscribe({
      next: (data: any) => this.exercises = data
    });
  }

  updateProgress() {
    this.done = this.workouts.reduce((total, w) => total + w.duration, 0);
  }

  loadWorkouts() {
    this.api.getWorkouts().subscribe((data: any) => {
      this.workouts = data as any[];
      this.updateProgress();
      this.initChart();
    });    
  }

  getProgressValue(): number {
    return this.goal > 0 ? Math.min((this.done / this.goal) * 100, 100) : 0;
  }

  getExerciseName(id: number): string {
    const ex = this.exercises.find(e => e.id === id);
    return ex ? ex.name : 'Неизвестно';
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
      this.loadWorkouts();
    });
  }

  initChart() {
    const ctx = document.getElementById('workoutChart') as HTMLCanvasElement;
    if (!ctx) return;

    if (this.chart) {
      this.chart.destroy();
    }

    const grouped: { [date: string]: number } = {};
    this.workouts.forEach(w => {
      grouped[w.date] = (grouped[w.date] || 0) + w.duration;
    });

    const labels = Object.keys(grouped);
    const durations = Object.values(grouped);

    if (!labels.length) return;

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Минуты тренировок',
          data: durations,
          backgroundColor: 'rgba(75, 192, 192, 0.5)'
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        plugins: {
          legend: { display: true }
        },
        scales: {
          x: {
            beginAtZero: true
          }
        }
      }
    });
  }
}