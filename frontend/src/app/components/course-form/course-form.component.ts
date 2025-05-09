import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.css']
})
export class CourseFormComponent implements OnChanges {
  @Input() course: { name: string; instructor: string } | null = null;
  @Input() isEditing: boolean = false;
  @Input() index: number = -1;
  @Output() submitCourse = new EventEmitter<{ name: string; instructor: string; index?: number }>();
  name: string = '';
  instructor: string = '';
  ngOnChanges(changes: SimpleChanges): void {
    if (this.course) {
      this.name = this.course.name;
      this.instructor = this.course.instructor;
    }
  }
  submitForm(): void {
    if (!this.name || !this.instructor) return;
    
    console.log('Course form submitting:', {
      name: this.name,
      instructor: this.instructor,
      index: this.isEditing ? this.index : undefined
    }); // Added logging
    
    this.submitCourse.emit({
      name: this.name,
      instructor: this.instructor,
      index: this.isEditing ? this.index : undefined
    });
    this.name = '';
    this.instructor = '';
  }
}