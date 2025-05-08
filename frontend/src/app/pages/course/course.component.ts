import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { AssignmentFormComponent } from '../../components/assignment-form/assignment-form.component';

interface Assignment {
  _id: string;
  name: string;
  dueDate: Date;
  grade: number;
}

@Component({
  selector: 'app-course',
  standalone: true,
  imports: [CommonModule, AssignmentFormComponent],
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {
  courseName: string = '';
  assignments: Assignment[] = [];
  selectedAssignment: Assignment | null = null;
  selectedIndex: number = -1;
  editing: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    const courseId = this.route.snapshot.paramMap.get('id');
    if (courseId) {
      this.loadCourse(courseId);
      this.loadAssignments(courseId);
    }
  }

  loadCourse(courseId: string) {
    this.apiService.getCourse(courseId).subscribe({
      next: (course) => {
        this.courseName = course.name;
      },
      error: (error: Error) => {
        console.error('Failed to load course:', error);
      }
    });
  }

  loadAssignments(courseId: string) {
    this.apiService.getAssignments(courseId).subscribe({
      next: (assignments) => {
        this.assignments = assignments;
      },
      error: (error: Error) => {
        console.error('Failed to load assignments:', error);
      }
    });
  }

  startEdit(index: number): void {
    this.selectedAssignment = { ...this.assignments[index] };
    this.selectedIndex = index;
    this.editing = true;
  }

  deleteAssignment(index: number): void {
    const assignmentId = this.assignments[index]._id;
    this.apiService.deleteAssignment(assignmentId).subscribe({
      next: () => {
        this.assignments.splice(index, 1);
        this.selectedIndex = -1;
        this.selectedAssignment = null;
        this.editing = false;
      },
      error: (error: Error) => {
        console.error('Failed to delete assignment:', error);
      }
    });
  }

  handleSubmitAssignment(data: any): void {
    const courseId = this.route.snapshot.paramMap.get('id');
    if (!courseId) return;

    if (data.index !== undefined && data.index >= 0) {
      const assignmentId = this.assignments[data.index]._id;
      this.apiService.updateAssignment(assignmentId, data).subscribe({
        next: (updatedAssignment) => {
          this.assignments[data.index] = updatedAssignment;
          this.editing = false;
          this.selectedIndex = -1;
          this.selectedAssignment = null;
        },
        error: (error: Error) => {
          console.error('Failed to update assignment:', error);
        }
      });
    } else {
      this.apiService.createAssignment({ ...data, courseId }).subscribe({
        next: (newAssignment) => {
          this.assignments.push(newAssignment);
          this.editing = false;
          this.selectedIndex = -1;
          this.selectedAssignment = null;
        },
        error: (error: Error) => {
          console.error('Failed to create assignment:', error);
        }
      });
    }
  }
}
