import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Assignment {
  _id?: string;
  name: string;
  dueDate: Date;  // Keep as Date type to match Course component
  grade: number;
}

@Component({
  selector: 'app-assignment-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './assignment-form.component.html',
  styleUrls: ['./assignment-form.component.css']
})
export class AssignmentFormComponent {
  @Input() assignment: Assignment | null = null;
  @Input() isEditing: boolean = false;
  @Input() index?: number;

  @Output() submitAssignment = new EventEmitter<any>();

  assignmentData: Assignment = {
    name: '',
    dueDate: new Date(),  // Initialize as Date object
    grade: 0
  };

  ngOnInit() {
    if (this.assignment) {
      // Ensure dueDate is a Date object when receiving from parent
      this.assignmentData = {
        ...this.assignment,
        dueDate: new Date(this.assignment.dueDate)
      };
    }
  }

  onSubmit() {
    this.submitAssignment.emit({
      ...this.assignmentData,
      index: this.index
    });
    this.resetForm();
  }

  private resetForm() {
    this.assignmentData = {
      name: '',
      dueDate: new Date(),
      grade: 0
    };
  }
}