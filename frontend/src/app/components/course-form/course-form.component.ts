import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Course {
  _id?: string;
  name: string;
  instructor: string;
}

@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.css']
})
export class CourseFormComponent {
  @Input() course: Course | null = null;
  @Input() isEditing = false;
  @Input() index?: number;
  @Output() submitCourse = new EventEmitter<any>();

  courseData: Course = {
    name: '',
    instructor: ''
  };

  ngOnInit() {
    if (this.course) {
      this.courseData = { ...this.course };
    }
  }

  submitForm() {
    console.log('Submitting course data:', this.courseData);
    this.submitCourse.emit({
      ...this.courseData,
      index: this.index
    });
    this.resetForm();
  }

  private resetForm() {
    this.courseData = {
      name: '',
      instructor: ''
    };
  }
}