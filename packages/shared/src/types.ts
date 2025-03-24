export interface TimeEntry {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime?: Date;
  projectId?: string;
  tags?: string[];
  userId: string;
  checkInNotes?: string;
  checkOutNotes?: string;
  breakTime?: number; // Total break time in milliseconds
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  color?: string;
  userId: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
