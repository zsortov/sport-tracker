
import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  categoryName = '';
  exerciseName = '';
  exerciseCategoryId = '';

  constructor(private api: ApiService) {}

  createCategory() {
    if (this.categoryName.trim()) {
      this.api.createCategory({ name: this.categoryName }).subscribe(() => {
        this.categoryName = '';
      });
    }
  }

  createExercise() {
    if (this.exerciseName.trim() && this.exerciseCategoryId) {
      this.api.createExercise({
        name: this.exerciseName,
        category: parseInt(this.exerciseCategoryId, 10)
      }).subscribe(() => {
        this.exerciseName = '';
        this.exerciseCategoryId = '';
      });
    }
  }
}
