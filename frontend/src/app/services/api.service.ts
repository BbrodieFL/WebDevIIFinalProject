import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// Add interfaces
export interface User {
  _id?: string;
  username: string;
  email: string;
  password?: string;
  courses?: Course[];
}

export interface Course {
  _id?: string;
  userId?: string;
  name: string;
  instructor: string;
  assignments?: Assignment[];
}

export interface Assignment {
  _id?: string;
  courseId?: string;
  title: string;
  dueDate: string;
  grade: number;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Auth endpoints
  register(userData: Partial<User>): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.baseUrl}/auth/register`, userData);
  }

  login(credentials: { email: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/auth/login`, credentials);
  }

  // Course endpoints
  getCourses(userId: string): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.baseUrl}/courses/${userId}`);
  }

  createCourse(courseData: Partial<Course>): Observable<Course> {
    return this.http.post<Course>(`${this.baseUrl}/courses`, courseData);
  }

  // Assignment endpoints
  getAssignments(courseId: string): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(`${this.baseUrl}/assignments/${courseId}`);
  }

  createAssignment(assignmentData: Partial<Assignment>): Observable<Assignment> {
    return this.http.post<Assignment>(`${this.baseUrl}/assignments`, assignmentData);
  }
}
