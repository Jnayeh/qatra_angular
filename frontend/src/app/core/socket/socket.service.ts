import { inject, Injectable, OnDestroy } from '@angular/core';
import { AuthStore } from '../auth/auth.store';
import { Client, type IMessage } from '@stomp/stompjs';

@Injectable({ providedIn: 'root' })
export class SocketService implements OnDestroy {
  private client: Client | null = null;
  private readonly authStore = inject(AuthStore);
  private subscriptions: Map<string, (msg: IMessage) => void> = new Map();

  connect(): void {
    if (this.client?.active) return;

    const token = this.authStore.accessToken() ?? localStorage.getItem('accessToken');
    if (!token) return;

    this.client = new Client({
      brokerURL: `ws://${location.host}/notification-service/ws`,
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 5000,
      onConnect: () => {
        for (const [destination, callback] of this.subscriptions) {
          this.client?.subscribe(destination, callback);
        }
      },
      onStompError: (frame) => {
        console.error('[Socket] STOMP error:', frame.headers['message']);
      },
    });

    this.client.activate();
  }

  disconnect(): void {
    this.client?.deactivate();
    this.client = null;
  }

  subscribe(destination: string, callback: (msg: IMessage) => void): void {
    this.subscriptions.set(destination, callback);
    if (this.client?.active) {
      this.client.subscribe(destination, callback);
    }
  }

  unsubscribe(destination: string): void {
    this.subscriptions.delete(destination);
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}
