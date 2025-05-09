import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AssignmentFormComponent } from '../../components/assignment-form/assignment-form.component';
import { ApiService } from '../../services/api.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-course',
  standalone: true,
  imports: [CommonModule, AssignmentFormComponent, MatCardModule, MatButtonModule],
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {
  courseId: string = '';
  courseName: string = '';
  assignments: any[] = [];
  selectedAssignment: { title: string; grade: number; dueDate: string } | null = null;
  selectedIndex: number = -1;
  editing: boolean = false;
  
  constructor(private route: ActivatedRoute, private router: Router, private api: ApiService) {}
  
  ngOnInit() {
    this.courseId = this.route.snapshot.paramMap.get('id') || '';
    // Fetch course details
    const userId = localStorage.getItem('userId') || '';
    this.api.getCourses(userId).subscribe({
      next: (courses) => {
        const course = courses.find((c: any) => c._id === this.courseId || c.id === +this.courseId);
        if (course) {
          this.courseName = course.name;
        }
      },
      error: (err) => console.error('Failed to load course', err)
    });
    // Fetch assignments for this course
    this.api.getAssignments(this.courseId).subscribe({
      next: (assignments) => this.assignments = assignments,
      error: (err) => console.error('Failed to load assignments', err)
    });
  }
  
  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
  
  startEdit(index: number): void {
    this.selectedAssignment = { ...this.assignments[index] };
    this.selectedIndex = index;
    this.editing = true;
  }
  
  deleteAssignment(index: number): void {
    const assignmentId = this.assignments[index]._id;
    if (assignmentId) {
      // Delete from the database
      this.api.deleteAssignment(assignmentId).subscribe({
        next: () => {
          console.log('Assignment deleted from database');
          // Update the UI
          this.assignments.splice(index, 1);
          if (this.selectedIndex === index) {
            this.selectedAssignment = null;
            this.selectedIndex = -1;
            this.editing = false;
          }
        },
        error: (err) => console.error('Failed to delete assignment', err)
      });
    } else {
      // Just update the UI if there's no ID (not saved to database yet)
      this.assignments.splice(index, 1);
      if (this.selectedIndex === index) {
        this.selectedAssignment = null;
        this.selectedIndex = -1;
        this.editing = false;
      }
    }
  }
  
  handleSubmitAssignment(data: { title: string; grade: number; dueDate: string; index?: number }): void {
    const assignment = { title: data.title, grade: data.grade, dueDate: data.dueDate };
    
    // Update the UI first
    if (data.index !== undefined && data.index >= 0) {
      this.assignments[data.index] = assignment;
    } else {
      this.assignments.push(assignment);
    }
    
    // Then save to database
    if (data.index !== undefined && data.index >= 0) {
      // Update existing assignment
      const assignmentId = this.assignments[data.index]._id;
      
      if (assignmentId) {
        this.api.updateAssignment(assignmentId, {
          name: data.title,
          grade: data.grade,
          dueDate: new Date(data.dueDate)
        }).subscribe({
          next: () => console.log('Assignment updated in database'),
          error: (err) => console.error('Failed to update assignment', err)
        });
      }
    } else {
      // Create new assignment
      this.api.createAssignment({
        name: data.title,
        grade: data.grade,
        dueDate: new Date(data.dueDate),
        courseId: this.courseId
      }).subscribe({
        next: () => console.log('Assignment saved to database'),
        error: (err) => console.error('Failed to save assignment', err)
      });
    }
    
    this.selectedAssignment = null;
    this.selectedIndex = -1;
    this.editing = false;
  }
}