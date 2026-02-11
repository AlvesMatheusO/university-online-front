// apps/frontend/src/app/components/class-card/class-card.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Class } from '../../models/class.model';

@Component({
  selector: 'app-class-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="class-card">
      <div class="card-header">
        <span class="class-code">{{ class.code }}</span>
        @if (class.credits) {
          <span class="credits">{{ class.credits }} créditos</span>
        }
      </div>
      
      <h4 class="class-name">{{ class.name }}</h4>
      
      @if (class.description) {
        <p class="class-description">{{ class.description }}</p>
      }
      
      <div class="class-footer">
        @if (class.workload) {
          <span class="info-tag">
            <i class="pi pi-clock"></i>
            {{ class.workload }}h
          </span>
        }
        @if (class.semester) {
          <span class="info-tag">
            <i class="pi pi-calendar"></i>
            {{ class.semester }}º sem
          </span>
        }
      </div>
    </div>
  `,
  styles: [`
    .class-card {
      background: white;
      border-radius: 8px;
      padding: 1.25rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .class-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }

    .class-code {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .credits {
      font-size: 0.75rem;
      color: #64748b;
      font-weight: 500;
    }

    .class-name {
      font-size: 1rem;
      font-weight: 600;
      margin: 0 0 0.5rem 0;
      color: #1e293b;
      line-height: 1.4;
    }

    .class-description {
      font-size: 0.875rem;
      color: #64748b;
      margin: 0 0 1rem 0;
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      flex: 1;
    }

    .class-footer {
      display: flex;
      gap: 0.75rem;
      margin-top: auto;
    }

    .info-tag {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      font-size: 0.75rem;
      color: #64748b;
    }

    .info-tag i {
      font-size: 0.875rem;
      color: #667eea;
    }
  `]
})
export class ClassCardComponent {
  @Input({ required: true }) class!: Class;
}