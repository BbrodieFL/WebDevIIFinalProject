import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CourseFormComponent } from '../../components/course-form/course-form.component';
import { ApiService } from '../../services/api.service';

interface Course {
  _id: string;
  name: string;
  instructor: string;
  assignments?: string[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, CourseFormComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  courses: Course[] = [];
  editing: boolean = false;
  selectedCourse: Course | null = null;
  selectedIndex: number = -1;

  constructor(
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    console.log('Dashboard component initialized');
    const userId = localStorage.getItem('userId');
    console.log('UserId from localStorage:', userId);
    
    if (userId) {
      this.loadCourses(userId);
    } else {
      console.error('No userId found in localStorage');
    }
  }

  loadCourses(userId: string) {
    console.log('Fetching courses for userId:', userId);
    this.apiService.getCourses(userId).subscribe({
      next: (courses: Course[]) => {
        console.log('Received courses:', courses);
        this.courses = courses;
      },
      error: (error: Error) => {
        console.error('Failed to load courses:', error);
      }
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
    console.log('Deleting course:', courseId);
    
    this.apiService.deleteCourse(courseId).subscribe({
      next: () => {
        console.log('Course deleted successfully');
        this.courses.splice(index, 1);
        this.selectedIndex = -1;
        this.selectedCourse = null;
        this.editing = false;
      },
      error: (error: Error) => {
        console.error('Failed to delete course:', error);
      }
    });
  }

  handleSubmitCourse(data: { name: string; instructor: string; index?: number }): void {
    if (data.index !== undefined && data.index >= 0) {
      const courseId = this.courses[data.index]._id;
      console.log('Updating course:', courseId, data);
      
      this.apiService.updateCourse(courseId, data).subscribe({
        next: (updatedCourse: Course) => {
          console.log('Course updated successfully:', updatedCourse);
          if (data.index !== undefined) {
            this.courses[data.index] = updatedCourse;
          }
          this.editing = false;
          this.selectedIndex = -1;
          this.selectedCourse = null;
        },
        error: (error: Error) => {
          console.error('Failed to update course:', error);
        }
      });
    } else {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        console.error('No userId found in localStorage');
        return;
      }
  
      const courseData = {
        name: data.name,
        instructor: data.instructor,
        userId: userId
      };
  
      console.log('Submitting course data:', courseData);
  
      this.apiService.createCourse(courseData).subscribe({
        next: (newCourse: Course) => {
          console.log('Course created successfully:', newCourse);
          this.courses.push(newCourse);
          this.editing = false;
          this.selectedIndex = -1;
          this.selectedCourse = null;
        },
        error: (error: any) => {
          console.error('Create course error details:', error);
          if (error.error) {
            console.error('Server error message:', error.error.message);
          }
        }
      });
    }
  }
}