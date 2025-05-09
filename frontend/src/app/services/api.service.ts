import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Course {
  _id: string;
  name: string;
  instructor: string;
  userId: string;
}

export interface Assignment {
  _id?: string;
  name: string;
  grade: number;
  dueDate: Date;
  courseId: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
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
  register(userData: RegisterData): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register`, userData);
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, credentials);
  }

  // Course endpoints
  getCourses(userId: string): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.baseUrl}/courses/${userId}`, {
      headers: this.getHeaders()
    });
  }

  createCourse(courseData: { name: string; instructor: string; userId: string }): Observable<Course> {
    return this.http.post<Course>(`${this.baseUrl}/courses`, courseData, {
      headers: this.getHeaders()
    });
  }

  updateCourse(courseId: string, courseData: { name: string; instructor: string }): Observable<Course> {
    return this.http.put<Course>(`${this.baseUrl}/courses/${courseId}`, courseData, {
      headers: this.getHeaders()
    });
  }

deleteCourse(courseId: string): Observable<void> {
  console.log('Delete request for course:', courseId);
  return this.http.delete<void>(`${this.baseUrl}/courses/${courseId}`, {
    headers: this.getHeaders()
  });
}

  // Assignment endpoints
  getAssignments(courseId: string): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(`${this.baseUrl}/assignments/${courseId}`, {
      headers: this.getHeaders()
    });
  }

createAssignment(assignment: { 
  name: string; 
  grade: number; 
  dueDate: Date;  // Changed to Date
  courseId: string 
}): Observable<Assignment> {
  console.log('API Service: Creating assignment with:', assignment);
  
  // Ensure dueDate is sent as ISOString for the API
  const payload = {
    ...assignment,
    dueDate: assignment.dueDate.toISOString()
  };

  return this.http.post<Assignment>(`${this.baseUrl}/assignments`, payload, {
    headers: this.getHeaders()
  });
}

updateAssignment(assignmentId: string, assignmentData: Partial<Assignment>): Observable<Assignment> {
  // Convert Date to ISOString if present
  const payload = {
    ...assignmentData,
    dueDate: assignmentData.dueDate instanceof Date ? 
      assignmentData.dueDate.toISOString() : 
      assignmentData.dueDate
  };

  return this.http.put<Assignment>(
    `${this.baseUrl}/assignments/${assignmentId}`, 
    payload,
    { headers: this.getHeaders() }
  );
}

  deleteAssignment(assignmentId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/assignments/${assignmentId}`, {
      headers: this.getHeaders()
    });
  }

  logout(): void {
    localStorage.clear();
    console.log('Logged out');
  }
}
