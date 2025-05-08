import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CourseFormComponent } from '../../components/course-form/course-form.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, CourseFormComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  courses = [
    { id: 1, name: 'Math 101', instructor: 'Mr. Smith' },
    { id: 2, name: 'English 201', instructor: 'Mrs. Johnson' },
    { id: 3, name: 'History 301', instructor: 'Dr. Lee' }
  ];

  editing: boolean = false;
  selectedCourse: { name: string; instructor: string } | null = null;
  selectedIndex: number = -1;

  constructor(private router: Router) {}

  viewCourse(courseId: number): void {
    this.router.navigate(['/course', courseId]);
  }

  startEdit(index: number): void {
    this.selectedCourse = { ...this.courses[index] };
    this.selectedIndex = index;
    this.editing = true;
  }

  deleteCourse(index: number): void {
    this.courses.splice(index, 1);
    this.selectedIndex = -1;
    this.selectedCourse = null;
    this.editing = false;
  }

  handleSubmitCourse(data: { name: string; instructor: string; index?: number }): void {
    if (data.index !== undefined && data.index >= 0) {
      this.courses[data.index] = {
        ...this.courses[data.index],
        name: data.name,
        instructor: data.instructor
      };
    } else {
      const newId = this.courses.length ? Math.max(...this.courses.map(c => c.id)) + 1 : 1;
      this.courses.push({
        id: newId,
        name: data.name,
        instructor: data.instructor
      });
    }

    this.editing = false;
    this.selectedIndex = -1;
    this.selectedCourse = null;
  }
}
