import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Assignment } from '../../services/api.service';

@Component({
  selector: 'app-assignment-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './assignment-form.component.html',
  styleUrls: ['./assignment-form.component.css']
})
export class AssignmentFormComponent implements OnChanges {
  @Input() assignment: Assignment | null = null;
  @Input() isEditing: boolean = false;
  @Input() index: number = -1;

  @Output() submitAssignment = new EventEmitter<Assignment & { index?: number }>();

  title: string = '';
  grade: number | null = null;
  dueDate: string = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (this.assignment) {
      this.title = this.assignment.title;
      this.grade = this.assignment.grade;
      this.dueDate = this.assignment.dueDate;
    }
  }

  submitForm(): void {
    if (!this.title || this.grade === null || !this.dueDate) return;

    this.submitAssignment.emit({
      title: this.title,
      grade: this.grade,
      dueDate: this.dueDate,
      index: this.isEditing ? this.index : undefined
    } as Assignment & { index?: number });

    this.title = '';
    this.grade = null;
    this.dueDate = '';
  }
}
