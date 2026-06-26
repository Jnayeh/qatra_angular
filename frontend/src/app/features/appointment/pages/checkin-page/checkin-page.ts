import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Html5Qrcode } from 'html5-qrcode';
import { CheckInResult } from '../../../../shared/models/appointment.model';
import { AppointmentService } from '../../appointment.service';

@Component({
  selector: 'app-checkin-page',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './checkin-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckinPageComponent implements AfterViewInit {
  private readonly appointmentService = inject(AppointmentService);
  private html5QrCode: Html5Qrcode | null = null;

  protected readonly scannerContainer = viewChild<ElementRef<HTMLDivElement>>('scannerContainer');
  protected readonly scannerReady = signal(false);
  protected readonly scanning = signal(false);
  protected readonly scanError = signal('');
  protected readonly checkingIn = signal(false);
  protected readonly manualAppointmentId = signal<number | null>(null);
  protected readonly result = signal<CheckInResult | null>(null);

  ngAfterViewInit(): void {
    const el = this.scannerContainer()?.nativeElement;
    if (el) {
      el.id = el.id || 'qr-scanner-' + Date.now();
      this.html5QrCode = new Html5Qrcode(el.id);
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
    this.handleScanResult(String(id));
  }

  private handleScanResult(value: string): void {
    this.checkingIn.set(true);
    const isNumeric = /^\d+$/.test(value);
    this.appointmentService.checkIn(isNumeric ? { appointmentId: Number(value) } : { qrCode: value }).subscribe({
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
