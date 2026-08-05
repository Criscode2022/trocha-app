import { Injectable, inject } from '@angular/core';
import { ApiService, DeliveryStop, StopStatus } from './api.service';

const QUEUE_KEY = 'trocha_status_queue';
const CACHE_KEY = 'trocha_stops_cache';

export interface QueuedStatus {
  id: string;
  status: StopStatus;
  queuedAt: string;
}

/**
 * Offline-first helpers for courier field work (research: parking/basement dead zones).
 * Caches last stop list; queues PATCH status when offline or request fails with network error.
 */
@Injectable({ providedIn: 'root' })
export class OfflineQueueService {
  private api = inject(ApiService);
  online = typeof navigator !== 'undefined' ? navigator.onLine : true;
  pendingCount = 0;

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.online = true;
        this.flush();
      });
      window.addEventListener('offline', () => {
        this.online = false;
      });
      this.pendingCount = this.readQueue().length;
    }
  }

  cacheStops(stops: DeliveryStop[]) {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ at: new Date().toISOString(), stops }));
  }

  readCache(): DeliveryStop[] | null {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    try {
      return (JSON.parse(raw) as { stops: DeliveryStop[] }).stops;
    } catch {
      return null;
    }
  }

  private readQueue(): QueuedStatus[] {
    try {
      return JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
    } catch {
      return [];
    }
  }

  private writeQueue(q: QueuedStatus[]) {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(q));
    this.pendingCount = q.length;
  }

  enqueue(id: string, status: StopStatus) {
    const q = this.readQueue().filter((x) => x.id !== id);
    q.push({ id, status, queuedAt: new Date().toISOString() });
    this.writeQueue(q);
  }

  /** Optimistic local patch on cached list. */
  patchCacheStatus(id: string, status: StopStatus) {
    const stops = this.readCache();
    if (!stops) return;
    const next = stops.map((s) => (s.id === id ? { ...s, status, updatedAt: new Date().toISOString() } : s));
    this.cacheStops(next);
  }

  flush(): Promise<number> {
    if (!this.online || !this.api.getToken()) return Promise.resolve(0);
    const q = this.readQueue();
    if (!q.length) return Promise.resolve(0);
    let done = 0;
    const rest: QueuedStatus[] = [];
    return (async () => {
      for (const item of q) {
        try {
          await new Promise<void>((resolve, reject) => {
            this.api.updateStatus(item.id, item.status).subscribe({
              next: () => resolve(),
              error: (e) => reject(e),
            });
          });
          done += 1;
        } catch {
          rest.push(item);
        }
      }
      this.writeQueue(rest);
      return done;
    })();
  }
}
