import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Card } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';
import { Select } from 'primeng/select';
import { DatePicker } from 'primeng/datepicker';
import type { AuditLogEntry } from '@/app/shared/models/analytics.model';
import { AdminService } from '@/app/features/admin/admin.service';
import { LoadingSpinnerComponent } from '@/app/shared/components/loading-spinner/loading-spinner';
import { EmptyStateComponent } from '@/app/shared/components/empty-state/empty-state';
import { createPaginationState } from '@/app/shared/utils/pagination-utils';

const AUDIT_ACTIONS = [
  { value: null, label: 'All Actions' },
  { value: 'APPOINTMENT_BOOKED', label: 'Appointment Booked' },
  { value: 'APPOINTMENT_COMPLETED', label: 'Appointment Completed' },
  { value: 'APPOINTMENT_CANCELLED', label: 'Appointment Cancelled' },
  { value: 'APPOINTMENT_NO_SHOW', label: 'Appointment No-Show' },
  { value: 'APPOINTMENT_RESCHEDULED', label: 'Appointment Rescheduled' },
  { value: 'EMERGENCY_CREATED', label: 'Emergency Created' },
  { value: 'EMERGENCY_FULFILLED', label: 'Emergency Fulfilled' },
  { value: 'EMERGENCY_CANCELLED', label: 'Emergency Cancelled' },
  { value: 'EMERGENCY_ESCALATED', label: 'Emergency Escalated' },
  { value: 'DONOR_RESPONSE', label: 'Donor Response' },
  { value: 'SCREENING_SAVED', label: 'Screening Saved' },
  { value: 'DONOR_PROFILE_UPDATED', label: 'Donor Profile Updated' },
  { value: 'DONOR_BLOOD_TYPE_UPDATED', label: 'Donor Blood Type Updated' },
  { value: 'DONOR_LOCATION_UPDATED', label: 'Donor Location Updated' },
  { value: 'DONOR_AVAILABILITY_UPDATED', label: 'Donor Availability Updated' },
  { value: 'DONOR_RESTRICTION_UPDATED', label: 'Donor Restriction Updated' },
  { value: 'DONOR_DELETION_REQUESTED', label: 'Donor Deletion Requested' },
  { value: 'CENTER_CREATED', label: 'Center Created' },
  { value: 'CENTER_UPDATED', label: 'Center Updated' },
  { value: 'CENTER_APPROVED', label: 'Center Approved' },
  { value: 'STAFF_ADDED', label: 'Staff Added' },
  { value: 'STAFF_REMOVED', label: 'Staff Removed' },
  { value: 'SLOT_BLOCKED', label: 'Slot Blocked' },
  { value: 'CLOSURE_ADDED', label: 'Closure Added' },
  { value: 'USER_CREATED', label: 'User Created' },
  { value: 'USER_DELETED', label: 'User Deleted' },
  { value: 'USER_STATUS_CHANGED', label: 'User Status Changed' },
  { value: 'ROLE_ASSIGNED', label: 'Role Assigned' },
  { value: 'ROLE_REVOKED', label: 'Role Revoked' },
  { value: 'HEALTH_QUESTIONNAIRE_UPDATED', label: 'Health Questionnaire Updated' },
  { value: 'GDPR_DELETION_REQUESTED', label: 'GDPR Deletion Requested' },
  { value: 'GDPR_ANONYMIZATION_COMPLETED', label: 'GDPR Anonymization Completed' },
];

@Component({
  selector: 'app-audit-logs-page',
  standalone: true,
  imports: [DatePipe, FormsModule, Card, TableModule, Button, Select, DatePicker, LoadingSpinnerComponent, EmptyStateComponent],
  templateUrl: './audit-logs-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditLogsPageComponent implements OnInit {
  private readonly adminService = inject(AdminService);
  protected readonly logs = signal<AuditLogEntry[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly actionOptions = AUDIT_ACTIONS;

  protected readonly pagination = createPaginationState(20);

  protected selectedAction: { value: string | null; label: string } | null = null;
  protected dateFrom: Date | null = null;
  protected dateTo: Date | null = null;

  ngOnInit(): void {
    this.loadLogs();
  }

  protected loadLogs(): void {
    this.isLoading.set(true);
    const params: Record<string, string | number | boolean | undefined> = {
      page: this.pagination.page(),
      size: this.pagination.size(),
    };

    if (this.selectedAction?.value) {
      params['action'] = this.selectedAction.value;
    }
    if (this.dateFrom) {
      params['fromDate'] = this.toIsoDate(this.dateFrom);
    }
    if (this.dateTo) {
      params['toDate'] = this.toIsoDate(this.dateTo);
    }

    this.adminService.getAuditLogs(params).subscribe({
      next: (res) => {
        const sorted = [...res.data].sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        );
        this.logs.set(sorted);
        if (res.page) {
          this.pagination.setTotalPages(res.page.totalPages);
          this.pagination.setTotalElements(res.page.totalElements);
        }
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  protected applyFilters(): void {
    this.pagination.setPage(0);
    this.loadLogs();
  }

  protected clearFilters(): void {
    this.selectedAction = null;
    this.dateFrom = null;
    this.dateTo = null;
    this.pagination.setPage(0);
    this.loadLogs();
  }

  protected prevPage(): void {
    this.pagination.prevPage();
    this.loadLogs();
  }

  protected nextPage(): void {
    this.pagination.nextPage();
    this.loadLogs();
  }

  private toIsoDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
