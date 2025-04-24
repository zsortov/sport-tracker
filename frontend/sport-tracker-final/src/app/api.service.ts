
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  getWorkouts() {
    return this.http.get(`${this.apiUrl}/workouts/`);
  }

  createWorkout(data: any) {
    return this.http.post(`${this.apiUrl}/workouts/`, data);
  }

  getExercises() {
    return this.http.get(`${this.apiUrl}/exercises/`);
  }

  createExercise(data: any) {
    return this.http.post(`${this.apiUrl}/exercises/`, data);
  }

  getNotes() {
    return this.http.get(`${this.apiUrl}/notes/`);
  }

  createNote(data: any) {
    return this.http.post(`${this.apiUrl}/notes/`, data);
  }

  createCategory(data: any) {
    return this.http.post(`${this.apiUrl}/categories/`, data);
  }

  deleteWorkout(id: number) {
    return this.http.delete(`${this.apiUrl}/workouts/${id}/`);
  }
}

export interface Workout {
  id: number;
  user: number;
  exercise: number;
  duration: number;
  date: string;
}