import { ChangeDetectionStrategy, Component, ElementRef, inject, OnInit, OnDestroy, AfterViewInit, signal, computed, viewChild } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Card } from 'primeng/card';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { Tag } from 'primeng/tag';
import { Textarea } from 'primeng/textarea';
import { ProgressSpinner } from 'primeng/progressspinner';
import { EmptyStateComponent } from '@/app/shared/components/empty-state/empty-state';
import { StatusBadgeComponent } from '@/app/shared/components/status-badge/status-badge';
import { NotificationStore } from '@/app/features/notifications/notification.store';
import { EmergencyService } from '@/app/features/emergency/emergency.service';
import { CenterService } from '@/app/features/center/center.service';
import { AppointmentService } from '@/app/features/appointment/appointment.service';
import { DonorStore } from '@/app/features/donor/donor.store';
import type { Notification } from '@/app/shared/models/notification.model';
import type { EmergencyNotificationSummary, EmergencyDetail } from '@/app/shared/models/emergency.model';
import type { Slot } from '@/app/shared/models/center.model';
import { formatTime } from '@/app/shared/utils/date-utils';

@Component({
  selector: 'app-notification-center-page',
  standalone: true,
  imports: [DecimalPipe, FormsModule, Card, Button, Dialog, Tag, Textarea, ProgressSpinner, EmptyStateComponent, StatusBadgeComponent],
  templateUrl: './notification-center-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationCenterPageComponent implements OnInit, AfterViewInit, OnDestroy {
  protected readonly store = inject(NotificationStore);
  private readonly emergencyService = inject(EmergencyService);
  private readonly centerService = inject(CenterService);
  private readonly appointmentService = inject(AppointmentService);
  private readonly donorStore = inject(DonorStore);
  private readonly scrollContainer = viewChild<ElementRef<HTMLDivElement>>('scrollContainer');
  private observer: IntersectionObserver | null = null;
  private sentinelEl: HTMLElement | null = null;

  protected readonly showConfirmModal = signal(false);
  protected readonly showRejectDialog = signal(false);
  protected readonly showDetailsModal = signal(false);
  protected readonly isLoadingSlots = signal(false);
  protected readonly isConfirming = signal(false);
  protected readonly isDeclining = signal(false);
  protected readonly availableSlots = signal<Slot[]>([]);
  protected readonly selectedSlotId = signal<number | null>(null);
  protected readonly activeEmergency = signal<EmergencyDetail | null>(null);
  protected readonly activeNotification = signal<Notification | null>(null);
  protected readonly rejectReason = signal('');
  protected readonly bookingResult = signal<{ appointmentId: number; qrCode: string } | null>(null);
  private readonly responseStatuses = new Map<number, 'ACCEPTED' | 'DECLINED'>();

  protected readonly emergencyData = computed(() => {
    const n = this.activeNotification();
    if (!n || n.type !== 'EMERGENCY_ALERT') return null;
    return (n.data as unknown as EmergencyNotificationSummary) ?? null;
  });

  ngOnInit(): void {
    this.store.loadNotifications();
  }

  ngAfterViewInit(): void {
    this.setupInfiniteScroll();
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private setupInfiniteScroll(): void {
    const container = this.scrollContainer()?.nativeElement;
    if (!container) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          this.store.loadMore();
        }
      },
      { root: container, threshold: 0.1 },
    );

    setTimeout(() => {
      this.sentinelEl = container.querySelector('#scroll-sentinel');
      if (this.sentinelEl && this.observer) {
        this.observer.observe(this.sentinelEl);
      }
    }, 300);
  }

  protected isEmergency(n: Notification): boolean {
    return n.type === 'EMERGENCY_ALERT';
  }

  protected getData(n: Notification): EmergencyNotificationSummary | null {
    if (!n.data) return null;
    return n.data as unknown as EmergencyNotificationSummary;
  }

  protected emergencyId(n: Notification): number | undefined {
    return this.getData(n)?.emergencyId ?? (n as any).emergencyId;
  }

  protected getResponseStatus(n: Notification): string | undefined {
    return this.responseStatuses.get(n.id);
  }

  protected isExpired(n: Notification): boolean {
    const data = this.getData(n);
    if (!data?.expiresAt) return false;
    return new Date(data.expiresAt) < new Date();
  }

  protected urgencySeverity(urgency: string): 'danger' | 'warn' | 'info' | 'success' {
    switch (urgency) {
      case 'CRITICAL': return 'danger';
      case 'HIGH': return 'warn';
      case 'MEDIUM': return 'info';
      default: return 'success';
    }
  }

  protected openConfirmModal(n: Notification): void {
    const data = this.getData(n);
    if (!data || this.getResponseStatus(n) === 'ACCEPTED' || this.isExpired(n)) return;

    this.activeNotification.set(n);
    this.selectedSlotId.set(null);
    this.bookingResult.set(null);
    this.showConfirmModal.set(true);
    this.loadEmergencyDetail(data.emergencyId);
    this.loadSlots(data.emergencyId);
  }

  private loadEmergencyDetail(emergencyId: number): void {
    this.emergencyService.getDetail(emergencyId).subscribe({
      next: (res) => this.activeEmergency.set(res.data),
    });
  }

  private loadSlots(emergencyId: number): void {
    this.isLoadingSlots.set(true);
    this.emergencyService.getDetail(emergencyId).subscribe({
      next: (res) => {
        const detail = res.data;
        const now = new Date();
        const today = now.toISOString().split('T')[0];

        this.centerService.getSlots(detail.centerId, { date: today }).subscribe({
          next: (slotRes) => {
            const available = slotRes.data.filter(
              (s) => !s.isBlocked && s.bookedCount < s.maxBookings && new Date(`${s.date}T${s.endTime}`) > now,
            );
            this.availableSlots.set(available);
            this.isLoadingSlots.set(false);
          },
          error: () => this.isLoadingSlots.set(false),
        });
      },
      error: () => this.isLoadingSlots.set(false),
    });
  }

  protected selectSlot(slotId: number): void {
    this.selectedSlotId.set(this.selectedSlotId() === slotId ? null : slotId);
  }

  protected confirmSlot(): void {
    const n = this.activeNotification();
    const data = this.emergencyData();
    const slotId = this.selectedSlotId();
    if (!n || !data) return;

    this.isConfirming.set(true);

    this.emergencyService.accept(data.emergencyId).subscribe({
      next: () => {
        if (slotId) {
          this.appointmentService.create({
            donorId: this.donorStore.profile()?.id ?? 0,
            slotId,
            type: 'EMERGENCY',
            emergencyId: data.emergencyId,
          }).subscribe({
            next: (apptRes) => {
              this.bookingResult.set({ appointmentId: apptRes.data.id, qrCode: apptRes.data.qrCode });
              this.isConfirming.set(false);
              this.updateNotificationData(n, 'ACCEPTED');
            },
            error: () => this.isConfirming.set(false),
          });
        } else {
          this.bookingResult.set({ appointmentId: 0, qrCode: 'Staff will contact you to schedule' });
          this.isConfirming.set(false);
          this.updateNotificationData(n, 'ACCEPTED');
        }
      },
      error: () => this.isConfirming.set(false),
    });
  }

  protected closeConfirmModal(): void {
    this.showConfirmModal.set(false);
    this.activeNotification.set(null);
    this.activeEmergency.set(null);
    this.availableSlots.set([]);
    this.selectedSlotId.set(null);
    this.bookingResult.set(null);
  }

  protected openRejectDialog(n: Notification): void {
    const data = this.getData(n);
    if (!data || this.getResponseStatus(n) === 'ACCEPTED' || this.isExpired(n)) return;

    this.activeNotification.set(n);
    this.rejectReason.set('');
    this.showRejectDialog.set(true);
  }

  protected confirmReject(): void {
    const n = this.activeNotification();
    const data = this.emergencyData();
    if (!n || !data) return;

    this.isDeclining.set(true);

    this.emergencyService.decline(data.emergencyId, this.rejectReason()).subscribe({
      next: () => {
        this.isDeclining.set(false);
        this.showRejectDialog.set(false);
        this.updateNotificationData(n, 'DECLINED');
        this.activeNotification.set(null);
      },
      error: () => this.isDeclining.set(false),
    });
  }

  protected openDetailsModal(n: Notification): void {
    const data = this.getData(n);
    if (!data) return;

    this.activeNotification.set(n);
    this.showDetailsModal.set(true);
    this.loadEmergencyDetail(data.emergencyId);
    this.loadSlots(data.emergencyId);
  }

  protected closeDetailsModal(): void {
    this.showDetailsModal.set(false);
    this.activeNotification.set(null);
    this.activeEmergency.set(null);
    this.availableSlots.set([]);
    this.selectedSlotId.set(null);
    this.bookingResult.set(null);
  }

  private updateNotificationData(n: Notification, status: 'ACCEPTED' | 'DECLINED'): void {
    this.responseStatuses.set(n.id, status);
  }

  protected notificationIcon(type: string): string {
    const icons: Record<string, string> = {
      EMERGENCY_ALERT: 'pi-exclamation-triangle',
      APPOINTMENT_REMINDER: 'pi-calendar',
      ELIGIBILITY_REMINDER: 'pi-heart',
      PROFILE_COMPLETION: 'pi-check-circle',
      PASSWORD_RESET: 'pi-envelope',
      GENERAL: 'pi-bell',
    };
    return icons[type] ?? 'pi-bell';
  }

  protected formatTime(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    if (diffDay < 7) return `${diffDay}d ago`;
    return date.toLocaleDateString();
  }

  protected formatSlotTime(slot: Slot): string {
    return `${slot.startTime} – ${slot.endTime}`;
  }

  protected formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleString();
  }

  protected readonly formatTimeSlot = formatTime;
}
