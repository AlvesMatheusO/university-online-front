import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Class } from '../../models/class.model';

@Component({
  selector: 'app-class-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="class-card" [class.full]="isFull">
      <!-- Header com imagem/banner -->
      <div class="card-banner" [style.background]="getBannerColor()">
        <div class="subject-code">{{ class.subject.code }}</div>
      </div>

      <!-- Conteúdo -->
      <div class="card-content">
        <!-- Nome da disciplina -->
        <h3 class="subject-name">{{ class.subject.name }}</h3>

        <!-- Informações do professor -->
        <div class="professor-info">
          <i class="pi pi-user"></i>
          <span>{{ class.professor.name }}</span>
        </div>

        <!-- Semestre -->
        <div class="semester">{{ class.semester }}</div>

        <!-- Progresso/Vagas -->
        <div class="enrollment-info">
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              [style.width.%]="getEnrollmentPercentage()">
            </div>
          </div>
          <div class="enrollment-text">
            <span>{{ class.enrolledStudents }}/{{ class.maxCapacity }} alunos</span>
            <span class="percentage">{{ getEnrollmentPercentage() }}% completo</span>
          </div>
        </div>

        <!-- Footer com horário -->
        <div class="card-footer">
          <div class="schedule-info">
            <i class="pi pi-clock"></i>
            <span>{{ getDayOfWeek() }} {{ formatTime(class.schedule.startTime) }} - {{ formatTime(class.schedule.endTime) }}</span>
          </div>
          <div class="status-badge" [class]="getStatusClass()">
            {{ class.status }}
          </div>
        </div>
      </div>

      <!-- Menu de ações -->
      <div class="card-actions">
        <button class="action-btn">
          <i class="pi pi-ellipsis-v"></i>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .class-card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      position: relative;
      cursor: pointer;
    }

    .class-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
    }

    .class-card.full {
      opacity: 0.9;
    }

    .card-banner {
      height: 120px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .subject-code {
      color: white;
      font-size: 1.5rem;
      font-weight: 700;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .card-content {
      padding: 1.25rem;
    }

    .subject-name {
      font-size: 1.125rem;
      font-weight: 600;
      margin: 0 0 1rem 0;
      color: #1e293b;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .professor-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
      color: #64748b;
      font-size: 0.875rem;
    }

    .professor-info i {
      color: #667eea;
      font-size: 1rem;
    }

    .semester {
      display: inline-block;
      background: #f1f5f9;
      color: #475569;
      padding: 0.25rem 0.75rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
      margin-bottom: 1rem;
    }

    .enrollment-info {
      margin-bottom: 1rem;
    }

    .progress-bar {
      height: 6px;
      background: #e2e8f0;
      border-radius: 3px;
      overflow: hidden;
      margin-bottom: 0.5rem;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
      transition: width 0.3s ease;
    }

    .enrollment-text {
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
      color: #64748b;
    }

    .percentage {
      font-weight: 600;
      color: #667eea;
    }

    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 1rem;
      border-top: 1px solid #e2e8f0;
    }

    .schedule-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.75rem;
      color: #64748b;
    }

    .schedule-info i {
      color: #667eea;
    }

    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .status-badge.ativa {
      background: #dcfce7;
      color: #166534;
    }

    .status-badge.inativa {
      background: #fee2e2;
      color: #991b1b;
    }

    .status-badge.encerrada {
      background: #f1f5f9;
      color: #475569;
    }

    .card-actions {
      position: absolute;
      top: 0.75rem;
      right: 0.75rem;
    }

    .action-btn {
      background: rgba(255, 255, 255, 0.9);
      border: none;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .action-btn:hover {
      background: white;
      transform: scale(1.1);
    }

    .action-btn i {
      color: #475569;
    }
  `]
})
export class ClassCardComponent {
  @Input({ required: true }) class!: Class;

  getBannerColor(): string {
    const colors = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    ];
    
    const index = this.class.id % colors.length;
    return colors[index];
  }

  getEnrollmentPercentage(): number {
    if (this.class.maxCapacity === 0) return 0;
    return Math.round((this.class.enrolledStudents / this.class.maxCapacity) * 100);
  }

  get isFull(): boolean {
    return this.class.availableSlots === 0;
  }

  getDayOfWeek(): string {
    const days: Record<string, string> = {
      'MONDAY': 'Seg',
      'TUESDAY': 'Ter',
      'WEDNESDAY': 'Qua',
      'THURSDAY': 'Qui',
      'FRIDAY': 'Sex',
      'SATURDAY': 'Sáb',
      'SUNDAY': 'Dom'
    };
    return days[this.class.schedule.dayOfWeek] || this.class.schedule.dayOfWeek;
  }

  formatTime(time: string): string {
    // Formato: "13:45:30.123456789" -> "13:45"
    return time.substring(0, 5);
  }

  getStatusClass(): string {
    return this.class.status.toLowerCase();
  }
}