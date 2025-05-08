import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { CourseFormComponent } from '../../components/course-form/course-form.component';
import { Course } from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CourseFormComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  courses: Course[] = [];
  editing: boolean = false;
  selectedCourse: Course | null = null;
  selectedIndex: number = -1;

  constructor(private router: Router, private api: ApiService) {}

  ngOnInit() {
    const userId = localStorage.getItem('userId') || '';
    this.api.getCourses(userId).subscribe({
      next: (courses: Course[]) => this.courses = courses,
      error: (err) => console.error('Failed to load courses', err)
    });
  }

  viewCourse(courseId: string | undefined): void {
    this.router.navigate(['/course', courseId || '']);
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
      // This should be replaced with an API call to create a course
      this.courses.push({
        name: data.name,
        instructor: data.instructor
      });
    }
    this.editing = false;
    this.selectedIndex = -1;
    this.selectedCourse = null;
  }
}
