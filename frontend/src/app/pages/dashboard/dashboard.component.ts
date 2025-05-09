import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { CourseFormComponent } from '../../components/course-form/course-form.component';
import { HttpErrorResponse } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
interface Course {
  _id: string;
  name: string;
  instructor: string;
  userId?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CourseFormComponent, MatCardModule, MatButtonModule],
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
    console.log('Dashboard initialized');
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('No userId found in localStorage');
      this.router.navigate(['/login']);
      return;
    }
    this.loadCourses(userId);
  }

  loadCourses(userId: string) {
    console.log('Loading courses for user:', userId);
    this.api.getCourses(userId).subscribe({
      next: (courses: Course[]) => {
        console.log('Courses loaded:', courses);
        this.courses = courses;
      },
      error: (err: HttpErrorResponse) => console.error('Failed to load courses', err)
    });
  }

  viewCourse(courseId: string): void {
    console.log('Navigating to course:', courseId);
    this.router.navigate(['/course', courseId]);
  }

  startEdit(index: number): void {
    console.log('Starting edit for course index:', index);
    this.selectedCourse = { ...this.courses[index] };
    this.selectedIndex = index;
    this.editing = true;
  }

deleteCourse(index: number): void {
  const courseId = this.courses[index]._id;
  console.log('Attempting to delete course:', courseId);

  this.api.deleteCourse(courseId).subscribe({
    next: () => {
      console.log('Course deleted successfully');
      // Use filter instead of splice for immutability
      this.courses = this.courses.filter((_, i) => i !== index);
      this.selectedIndex = -1;
      this.selectedCourse = null;
      this.editing = false;
    },
    error: (err) => {
      console.error('Failed to delete course:', err);
      // Optionally add user feedback here
      alert('Failed to delete course. Please try again.');
    }
  });
}

  handleSubmitCourse(data: { name: string; instructor: string; index?: number }): void {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('No userId found');
      return;
    }

    if (data.index !== undefined && data.index >= 0) {
      const courseId = this.courses[data.index]._id;
      console.log('Updating course:', courseId, data);
      
      this.api.updateCourse(courseId, data).subscribe({
        next: (updatedCourse: Course) => {
          console.log('Course updated successfully:', updatedCourse);
          if (typeof data.index === 'number') {
            this.courses[data.index] = updatedCourse;
          }
          this.editing = false;
          this.selectedIndex = -1;
          this.selectedCourse = null;
        },
        error: (err: HttpErrorResponse) => console.error('Failed to update course', err)
      });
    } else {
      console.log('Creating new course:', data);
      this.api.createCourse({ ...data, userId }).subscribe({
        next: (newCourse: Course) => {
          console.log('Course created successfully:', newCourse);
          this.courses.push(newCourse);
          this.editing = false;
          this.selectedIndex = -1;
          this.selectedCourse = null;
        },
        error: (err: HttpErrorResponse) => console.error('Failed to create course', err)
      });
    }
  }

  logout(): void {
    console.log('Logging out');
    this.api.logout();
    this.router.navigate(['/login']);
  }
}