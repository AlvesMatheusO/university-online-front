export interface Subject {
  id: number;
  code: string;
  name: string;
  workload: number;
  credits: number;
  description: string;
}

export interface Professor {
  id: number;
  registration: string;
  name: string;
  email: string;
  title: string;
  department: string;
}

export interface Schedule {
  id: number;
  dayOfWeek: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
  startTime: string;
  endTime: string;
  period: 'MANHA' | 'TARDE' | 'NOITE';
}

export interface Course {
  id: number;
  code: string;
  name: string;
  department: string;
  duration: number;
  active: boolean;
}

export interface Class {
  id: number;
  code: string;
  subject: Subject;
  professor: Professor;
  schedule: Schedule;
  course: Course;
  maxCapacity: number;
  enrolledStudents: number;
  semester: string;
  status: 'ATIVA' | 'INATIVA' | 'ENCERRADA';
  availableSlots: number;
}