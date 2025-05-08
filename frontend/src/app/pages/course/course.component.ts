import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AssignmentFormComponent } from '../../components/assignment-form/assignment-form.component';
import { ApiService } from '../../services/api.service';
import { Course, Assignment } from '../../services/api.service';

@Component({
  selector: 'app-course',
  standalone: true,
  imports: [CommonModule, AssignmentFormComponent],
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {
  courseId: string = '';
  courseName: string = '';
  assignments: Assignment[] = [];

  selectedAssignment: Assignment | null = null;
  selectedIndex: number = -1;
  editing: boolean = false;

  constructor(private route: ActivatedRoute, private api: ApiService) {}

  ngOnInit() {
    this.courseId = this.route.snapshot.paramMap.get('id') || '';
    // Fetch course details
    this.api.getCourses('USER_ID').subscribe({
      next: (courses: Course[]) => {
        const course = courses.find((c: Course) => c._id === this.courseId);
        if (course) {
          this.courseName = course.name;
        }
      },
      error: (err) => console.error('Failed to load course', err)
    });
    // Fetch assignments for this course
    this.api.getAssignments(this.courseId).subscribe({
      next: (assignments: Assignment[]) => this.assignments = assignments,
      error: (err) => console.error('Failed to load assignments', err)
    });
  }

  startEdit(index: number): void {
    this.selectedAssignment = { ...this.assignments[index] };
    this.selectedIndex = index;
    this.editing = true;
  }

  deleteAssignment(index: number): void {
    this.assignments.splice(index, 1);
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
