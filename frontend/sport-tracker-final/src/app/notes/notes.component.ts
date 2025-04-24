
import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent {
  notes: any[] = [];
  newNote = '';

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadNotes();
  }

  loadNotes() {
    this.api.getNotes().subscribe({
      next: (data: any) => this.notes = data
    });
  }

  addNote() {
    if (this.newNote.trim()) {
      this.api.createNote({ text: this.newNote }).subscribe(() => {
        this.newNote = '';
        this.loadNotes();
      });
    }
  }
}
