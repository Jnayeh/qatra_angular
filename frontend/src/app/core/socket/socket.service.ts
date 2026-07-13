import { inject, Injectable, OnDestroy } from '@angular/core';
import { io, type Socket } from 'socket.io-client';
import { AuthStore } from '@/app/core/auth/auth.store';
import { environment } from '@/environments/environment';

@Injectable({ providedIn: 'root' })
export class SocketService implements OnDestroy {
  private socket: Socket | null = null;
  private readonly authStore = inject(AuthStore);
  private readonly listeners = new Map<string, (data: unknown) => void>();

  connect(): void {
    if (this.socket?.connected) return;

    const token = this.authStore.accessToken() ?? localStorage.getItem('accessToken');
    if (!token) return;

    this.socket = io(environment.wsBaseUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 5000,
    });

    this.socket.on('connect', () => {
      for (const [event, callback] of this.listeners) {
        this.socket?.on(event, callback);
      }
    });

    this.socket.on('disconnect', (reason) => {
      console.warn('[Socket] Disconnected:', reason);
    });

    this.socket.on('connect_error', (err) => {
      console.error('[Socket] Connection error:', err.message);
    });
  }

  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
  }

  subscribe(event: string, callback: (data: unknown) => void): void {
    this.listeners.set(event, callback);
    if (this.socket?.connected) {
      this.socket.on(event, callback);
    }
  }

  unsubscribe(event: string): void {
    const callback = this.listeners.get(event);
    if (callback) {
      this.socket?.off(event, callback);
      this.listeners.delete(event);
    }
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}
