import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, OnDestroy, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { ProgressSpinner } from 'primeng/progressspinner';
import { Html5Qrcode } from 'html5-qrcode';
import { Appointment } from '@/app/shared/models/appointment.model';
import { AppointmentService } from '@/app/features/appointment/appointment.service';

@Component({
  selector: 'app-checkin-page',
  standalone: true,
  imports: [
    FormsModule,
    Button,
    InputText,
    ProgressSpinner,
  ],
  templateUrl: './checkin-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckinPageComponent implements AfterViewInit, OnDestroy {
  private readonly appointmentService = inject(AppointmentService);
  private html5QrCode: Html5Qrcode | null = null;

  protected readonly scannerContainer = viewChild<ElementRef<HTMLDivElement>>('scannerContainer');
  protected readonly scannerReady = signal(false);
  protected readonly scanning = signal(false);
  protected readonly scanError = signal('');
  protected readonly checkingIn = signal(false);
  protected readonly manualAppointmentId = signal<number | null>(null);
  protected readonly result = signal<Appointment | null>(null);

  ngAfterViewInit(): void {
    const el = this.scannerContainer()?.nativeElement;
    if (el) {
      el.id = el.id || 'qr-scanner-' + Date.now();
      this.html5QrCode = new Html5Qrcode(el.id);
    }
  }

  ngOnDestroy(): void {
    if (this.html5QrCode) {
      this.html5QrCode.stop().catch(() => {}).finally(() => {
        this.html5QrCode?.clear();
        this.html5QrCode = null;
      });
    }
  }

  protected async startScanner(): Promise<void> {
    if (!this.html5QrCode) return;
    this.scanning.set(true);
    this.scanError.set('');
    try {
      await this.html5QrCode.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          this.handleScanResult(decodedText);
        },
        () => {},
      );
      this.scannerReady.set(true);
    } catch (err) {
      this.scanError.set('Camera access denied or unavailable');
      this.scanning.set(false);
    }
  }

  protected stopScanner(): void {
    this.html5QrCode?.stop().then(() => {
      this.scannerReady.set(false);
      this.scanning.set(false);
    });
  }

  protected manualCheckIn(): void {
    const id = this.manualAppointmentId();
    if (!id) return;
    this.doCheckIn(id);
  }

  private handleScanResult(value: string): void {
    const id = Number(value);
    if (!isNaN(id) && id > 0) {
      this.doCheckIn(id);
    }
  }

  private doCheckIn(appointmentId: number): void {
    this.checkingIn.set(true);
    this.appointmentService.checkIn(appointmentId).subscribe({
      next: (res) => {
        this.result.set(res.data);
        this.checkingIn.set(false);
        this.stopScanner();
      },
      error: (err: any) => {
        this.scanError.set(err.friendlyMessage ?? 'Check-in failed');
        this.checkingIn.set(false);
      },
    });
  }
}
