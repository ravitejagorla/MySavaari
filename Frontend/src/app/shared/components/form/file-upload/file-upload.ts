import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ras-image-upload',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Button],
  templateUrl: './file-upload.html',

})
export class RAsImageUploadComponent {

  @Input() form!: FormGroup;
  @Input() controlName!: string;
  @Input() label: string = 'Upload Image';
  @Input() employeeId!: string;

  @Output() fileChanged = new EventEmitter<File>();
  @Output() cameraOpen = new EventEmitter<void>();
  @Output() whatsappSend = new EventEmitter<string>();

  preview: string | null = null;
  uploadLink: string | null = null;

  get control(): AbstractControl | null {
    return this.form.get(this.controlName);
  }

  onFileSelect(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.control?.setValue(file);
    this.control?.markAsTouched();
    this.fileChanged.emit(file);

    const reader = new FileReader();
    reader.onload = () => this.preview = reader.result as string;
    reader.readAsDataURL(file);
  }

  removeImage() {
    this.preview = null;
    this.control?.setValue(null);
  }

  generateUploadLink() {
    this.uploadLink = `${window.location.origin}/upload/profile-image/${this.employeeId}`;
  }

  sendWhatsappLink() {
    if (!this.uploadLink) return;

    const encoded = encodeURIComponent(
      `Please upload your profile image using this link:\n${this.uploadLink}`
    );

    this.whatsappSend.emit(this.uploadLink);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  }

  openCamera() {
    this.cameraOpen.emit();
  }
}
