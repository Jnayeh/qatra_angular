import { ChangeDetectionStrategy, Component, inject, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Card } from 'primeng/card';
import { Button } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { Tag } from 'primeng/tag';
import { Dialog } from 'primeng/dialog';
import { Textarea } from 'primeng/textarea';
import { ActivatedRoute } from '@angular/router';
import { CenterService } from '@/app/features/center/center.service';
import { formatTime } from '@/app/shared/utils/date-utils';
import type { Slot, CenterDetail } from '@/app/shared/models/center.model';
import type { OperatingHours, DaySchedule } from '@/app/shared/models/operating-hours.model';
import { LoadingSpinnerComponent } from '@/app/shared/components/loading-spinner/loading-spinner';
import { EmptyStateComponent } from '@/app/shared/components/empty-state/empty-state';

@Component({
  selector: 'app-slot-management-page',
  standalone: true,
  imports: [FormsModule, Card, Button, DatePicker, Tag, Dialog, Textarea, LoadingSpinnerComponent, EmptyStateComponent],
  templateUrl: './slot-management-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlotManagementPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly centerService = inject(CenterService);

  protected readonly isLoading = signal(true);
  protected readonly center = signal<CenterDetail | null>(null);
  protected readonly allSlots = signal<Slot[]>([]);
  protected readonly selectedDate = signal<Date>(new Date());
  protected readonly activeDay = signal(0);
  protected readonly closureDialogOpen = signal(false);
  protected readonly closureReason = signal('');
  protected readonly closureAllDay = signal(true);
  protected readonly isSaving = signal(false);

  private centerId = 0;

  protected readonly weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  protected readonly weekDayKeys: (keyof Omit<OperatingHours, 'closedWindows'>)[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  protected readonly operatingHours = computed(() => this.center()?.operatingHours ?? null);

  protected readonly daySchedule = computed(() => {
    const hours = this.operatingHours();
    if (!hours) return null;
    return hours[this.weekDayKeys[this.activeDay()]] as DaySchedule | null;
  });

  protected readonly filteredSlots = computed(() => {
    const dayIndex = this.activeDay();
    const dayName = this.weekDayKeys[dayIndex];
    const all = this.allSlots();
    return all
      .filter((s) => {
        const d = new Date(s.date);
        const jsDay = d.getDay();
        const mappedDay = jsDay === 0 ? 6 : jsDay - 1;
        return mappedDay === dayIndex;
      })
      .sort((a, b) => {
        const dateCmp = a.date.localeCompare(b.date);
        if (dateCmp !== 0) return dateCmp;
        return a.startTime.localeCompare(b.startTime);
      });
  });

  ngOnInit(): void {
    this.centerId = Number(this.route.snapshot.params['id']);
    if (this.centerId) {
      this.loadCenter();
    }
  }

  private loadCenter(): void {
    this.centerService.getCenter(this.centerId).subscribe({
      next: (res) => {
        this.center.set(res.data);
        this.loadSlots();
      },
      error: () => this.isLoading.set(false),
    });
  }

  private loadSlots(): void {
    const start = new Date(this.selectedDate());
    start.setDate(start.getDate() - start.getDay() + 1);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);

    const params: Record<string, string | number | boolean | undefined> = {
      dateFrom: start.toISOString().split('T')[0],
      dateTo: end.toISOString().split('T')[0],
    };

    this.centerService.getSlots(this.centerId, params).subscribe({
      next: (res) => {
        this.allSlots.set(res.data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  protected onDayChange(index: number): void {
    this.activeDay.set(index);
  }

  protected onWeekChange(date: Date): void {
    this.selectedDate.set(date);
    this.isLoading.set(true);
    this.loadSlots();
  }

  protected toggleBlock(slot: Slot): void {
    this.centerService.blockSlot(this.centerId, slot.id, !slot.isBlocked).subscribe({
      next: (res) => {
        this.allSlots.update((slots) =>
          slots.map((s) => (s.id === res.data.id ? res.data : s)),
        );
      },
    });
  }

  protected openClosureDialog(): void {
    this.closureDialogOpen.set(true);
    this.closureReason.set('');
    this.closureAllDay.set(true);
  }

  protected submitClosure(): void {
    const dayDate = this.getWeekDates()[this.activeDay()];
    if (!dayDate || !this.closureReason()) return;

    this.isSaving.set(true);
    this.centerService.addClosure(this.centerId, {
      date: dayDate,
      allDay: this.closureAllDay(),
      reason: this.closureReason(),
    }).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.closureDialogOpen.set(false);
        this.loadSlots();
      },
      error: () => this.isSaving.set(false),
    });
  }

  protected getWeekDates(): string[] {
    const start = new Date(this.selectedDate());
    start.setDate(start.getDate() - start.getDay() + 1);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      return d.toISOString().split('T')[0];
    });
  }

  protected dayAvailableSlots(dayIndex: number): number {
    const dayDate = this.getWeekDates()[dayIndex];
    return this.allSlots().filter((s) => s.date === dayDate && !s.isBlocked && s.bookedCount < s.maxBookings).length;
  }

  protected readonly formatTime = formatTime;
}
