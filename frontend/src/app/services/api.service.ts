import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

interface Course {
  _id: string;
  name: string;
  instructor: string;
}

interface Assignment {
  _id: string;
  name: string;
  dueDate: Date;
  grade: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Auth endpoints
  register(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register`, userData);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, credentials);
  }

  // Course endpoints
  getCourses(userId: string): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.baseUrl}/courses/${userId}`, {
      headers: this.getHeaders()
    }).pipe(
      tap((courses: Course[]) => console.log('Fetched courses:', courses)),
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching courses:', error);
        throw error;
      })
    );
  }

  getCourse(courseId: string): Observable<Course> {
    return this.http.get<Course>(`${this.baseUrl}/courses/${courseId}`, {
      headers: this.getHeaders()
    }).pipe(
      tap((course: Course) => console.log('Fetched course:', course)),
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching course:', error);
        throw error;
      })
    );
  }

  createCourse(courseData: { name: string; instructor: string; userId: string }): Observable<Course> {
    console.log('Creating course with data:', courseData);
    return this.http.post<Course>(`${this.baseUrl}/courses`, courseData, {
      headers: this.getHeaders()
    }).pipe(
      tap((response: Course) => console.log('Server response:', response)),
      catchError((error: HttpErrorResponse) => {
        console.error('Server error details:', error.error);
        throw error;
      })
    );
  }

  updateCourse(courseId: string, courseData: { name: string; instructor: string }): Observable<Course> {
    return this.http.put<Course>(`${this.baseUrl}/courses/${courseId}`, courseData, {
      headers: this.getHeaders()
    }).pipe(
      tap((course: Course) => console.log('Updated course:', course)),
      catchError((error: HttpErrorResponse) => {
        console.error('Error updating course:', error);
        throw error;
      })
    );
  }

  deleteCourse(courseId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/courses/${courseId}`, {
      headers: this.getHeaders()
    }).pipe(
      tap(() => console.log('Deleted course:', courseId)),
      catchError((error: HttpErrorResponse) => {
        console.error('Error deleting course:', error);
        throw error;
      })
    );
  }

  // Assignment endpoints
  getAssignments(courseId: string): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(`${this.baseUrl}/assignments/${courseId}`, {
      headers: this.getHeaders()
    }).pipe(
      tap((assignments: Assignment[]) => console.log('Fetched assignments:', assignments)),
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching assignments:', error);
        throw error;
      })
    );
  }

  createAssignment(assignmentData: any): Observable<Assignment> {
    return this.http.post<Assignment>(`${this.baseUrl}/assignments`, assignmentData, {
      headers: this.getHeaders()
    }).pipe(
      tap((assignment: Assignment) => console.log('Created assignment:', assignment)),
      catchError((error: HttpErrorResponse) => {
        console.error('Error creating assignment:', error);
        throw error;
      })
    );
  }

  updateAssignment(assignmentId: string, assignmentData: any): Observable<Assignment> {
    return this.http.put<Assignment>(`${this.baseUrl}/assignments/${assignmentId}`, assignmentData, {
      headers: this.getHeaders()
    }).pipe(
      tap((assignment: Assignment) => console.log('Updated assignment:', assignment)),
      catchError((error: HttpErrorResponse) => {
        console.error('Error updating assignment:', error);
        throw error;
      })
    );
  }

  deleteAssignment(assignmentId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/assignments/${assignmentId}`, {
      headers: this.getHeaders()
    }).pipe(
      tap(() => console.log('Deleted assignment:', assignmentId)),
      catchError((error: HttpErrorResponse) => {
        console.error('Error deleting assignment:', error);
        throw error;
      })
    );
  }
}
