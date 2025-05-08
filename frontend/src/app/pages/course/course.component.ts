import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AssignmentFormComponent } from '../../components/assignment-form/assignment-form.component';

@Component({
  selector: 'app-course',
  standalone: true,
  imports: [CommonModule, AssignmentFormComponent],
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {
  courseId: number = 0;
  courseName: string = '';
  assignments: any[] = [];

  selectedAssignment: { title: string; grade: number; dueDate: string } | null = null;
  selectedIndex: number = -1;
  editing: boolean = false;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.courseId = Number(this.route.snapshot.paramMap.get('id'));

    // Mock course data with due dates
    if (this.courseId === 1) {
      this.courseName = 'Math 101';
      this.assignments = [
        { title: 'Homework 1', grade: 95, dueDate: '2025-05-10' },
        { title: 'Quiz 1', grade: 88, dueDate: '2025-05-12' },
      ];
    } else if (this.courseId === 2) {
      this.courseName = 'English 201';
      this.assignments = [
        { title: 'Essay 1', grade: 92, dueDate: '2025-05-14' },
        { title: 'Reading Quiz', grade: 85, dueDate: '2025-05-16' },
      ];
    }
  }

  startEdit(index: number): void {
    this.selectedAssignment = { ...this.assignments[index] };
    this.selectedIndex = index;
    this.editing = true;
  }

  deleteAssignment(index: number): void {
    this.assignments.splice(index, 1);

    // Clear form if the deleted one was being edited
    if (this.selectedIndex === index) {
      this.selectedAssignment = null;
      this.selectedIndex = -1;
      this.editing = false;
    }
  }

  handleSubmitAssignment(data: { title: string; grade: number; dueDate: string; index?: number }): void {
    const assignment = { title: data.title, grade: data.grade, dueDate: data.dueDate };

    if (data.index !== undefined && data.index >= 0) {
      this.assignments[data.index] = assignment;
    } else {
      this.assignments.push(assignment);
    }

    this.selectedAssignment = null;
    this.selectedIndex = -1;
    this.editing = false;
  }
}
