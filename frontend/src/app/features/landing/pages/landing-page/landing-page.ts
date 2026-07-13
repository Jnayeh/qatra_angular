import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import maplibregl from 'maplibre-gl';
import { CenterStore } from '@/app/features/center/center.store';
import { PublicNavbarComponent } from '@/app/shared/components/public-navbar/public-navbar';
import { initMapLibre } from '@/app/shared/utils/map-init';

interface StatItem {
  label: string;
  target: number;
  suffix: string;
  current: number;
}

interface FeatureItem {
  icon: string;
  title: string;
  desc: string;
}

interface StepItem {
  icon: string;
  title: string;
  desc: string;
}

interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

interface EmergencyItem {
  bloodType: string;
  units: number;
  urgency: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  city: string;
  time: string;
}

interface CampaignItem {
  title: string;
  location: string;
  date: string;
  slots: number;
}

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [RouterLink, PublicNavbarComponent],
  templateUrl: 'landing-page.html',
  styleUrl: 'landing-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingPageComponent implements OnInit, AfterViewInit {
  private readonly centerStore = inject(CenterStore);
  protected readonly centers = this.centerStore.centers;

  /* ── Group 1: Intro ── */
  protected readonly stats = signal<StatItem[]>([
    { label: 'Active Donors', target: 10000, suffix: '+', current: 0 },
    { label: 'Partner Centers', target: 50, suffix: '+', current: 0 },
    { label: 'Donations / Month', target: 5000, suffix: '+', current: 0 },
    { label: 'Lives Impacted', target: 30000, suffix: '+', current: 0 },
  ]);

  /* ── Group 2: Value proposition ── */
  protected readonly benefits: FeatureItem[] = [
    { icon: 'pi-bolt', title: 'Instant Emergency Alerts', desc: 'Get notified when your blood type is urgently needed nearby.' },
    { icon: 'pi-calendar-plus', title: 'Easy Scheduling', desc: 'Book donation slots at centers across Tunisia in seconds.' },
    { icon: 'pi-chart-line', title: 'Track Your Impact', desc: 'See how many lives you have helped save with every donation.' },
  ];

  protected readonly steps: StepItem[] = [
    { icon: 'pi-search', title: 'Find a Center', desc: 'Locate donation centers near you with real-time availability.' },
    { icon: 'pi-calendar', title: 'Book a Slot', desc: 'Pick a date and time that works for your schedule.' },
    { icon: 'pi-bell', title: 'Save Lives', desc: 'Donate regularly and respond to emergency alerts.' },
  ];

  protected readonly whyDonatePoints = [
    'Takes only 45 minutes',
    'No waiting in line',
    'Free health screening included',
    'Replenishes in 56 days',
  ];

  /* ── Group 3: Social proof ── */
  protected readonly emergencyFeed: EmergencyItem[] = [
    { bloodType: 'O-', units: 5, urgency: 'CRITICAL', city: 'Tunis', time: '12 min ago' },
    { bloodType: 'A+', units: 3, urgency: 'HIGH', city: 'Sfax', time: '45 min ago' },
    { bloodType: 'B-', units: 2, urgency: 'MEDIUM', city: 'Sousse', time: '2 hrs ago' },
  ];

  protected readonly testimonialIndex = signal(0);
  protected readonly testimonials: Testimonial[] = [
    { quote: 'Qatra made it so easy to find a center and book my donation. I feel proud knowing I can help save lives.', name: 'Fatima El Amrani', role: 'Regular Donor, Tunis' },
    { quote: 'When our hospital had an emergency, Qatra connected us with donors in minutes. It truly saves lives.', name: 'Dr. Youssef Benkirane', role: 'Center Staff, Sfax' },
    { quote: 'The emergency alerts let me respond quickly when my blood type is needed. A simple app with real impact.', name: 'Karim Idrissi', role: 'Donor, Sousse' },
  ];

  /* ── Group 4: Discover ── */
  protected readonly campaigns: CampaignItem[] = [
    { title: 'Ramadan Blood Drive', location: 'Tunis', date: 'Mar 2026', slots: 120 },
    { title: 'World Donor Day', location: 'Nationwide', date: 'Jun 2026', slots: 500 },
    { title: 'Mobile Unit Tour', location: 'Kairouan', date: 'Apr 2026', slots: 80 },
  ];

  private readonly statsSection = viewChild<ElementRef<HTMLElement>>('statsSection');
  private statsAnimated = false;
  private map: maplibregl.Map | null = null;

  ngOnInit(): void {
    this.centerStore.loadCenters({ page: 0, size: 10, status: 'ACTIVE' });
  }

  ngAfterViewInit(): void {
    const el = this.statsSection()?.nativeElement;
    if (el) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !this.statsAnimated) {
            this.statsAnimated = true;
            this.animateStats();
          }
        },
        { threshold: 0.3 },
      );
      observer.observe(el);
    }
    setTimeout(() => this.initMap(), 400);
  }

  protected urgencyBadgeClass(urgency: string): string {
    const base = 'text-[0.6875rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0';
    if (urgency === 'CRITICAL') return `${base} bg-red-100 text-red-700`;
    if (urgency === 'HIGH') return `${base} bg-orange-100 text-orange-700`;
    return `${base} bg-yellow-100 text-yellow-700`;
  }

  protected prevTestimonial(): void {
    this.testimonialIndex.update((i) => (i === 0 ? this.testimonials.length - 1 : i - 1));
  }

  protected nextTestimonial(): void {
    this.testimonialIndex.update((i) => (i + 1) % this.testimonials.length);
  }

  private animateStats(): void {
    const duration = 1500;
    const start = performance.now();
    const targets = this.stats().map((s) => s.target);

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      this.stats.update((items) =>
        items.map((item, i) => ({ ...item, current: Math.round(targets[i] * eased) })),
      );
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  private initMap(): void {
    initMapLibre();
    const container = document.getElementById('landing-map');
    if (!container || this.map) return;

    const DEFAULT_ZOOM = 7;

    const style = getComputedStyle(document.documentElement);
    const primary500 = style.getPropertyValue('--p-primary-500').trim() || '#cc0000';

    this.map = new maplibregl.Map({
      container,
      style: 'https://tiles.openfreemap.org/styles/liberty',
      center: [10.1815, 36.8065],
      zoom: DEFAULT_ZOOM,
      attributionControl: false,
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          this.map?.setCenter([pos.coords.longitude, pos.coords.latitude]);
          this.map?.setZoom(10);
        },
        () => {},
        { timeout: 5000, maximumAge: 600000 },
      );
    }

    const coords: [number, number][] = [
      [10.1815, 36.8065], [10.7603, 34.7406], [10.6405, 35.8288], [10.0999, 35.6781],
    ];
    coords.forEach(([lng, lat], i) => {
      const el = document.createElement('div');
      el.style.cssText = `width:14px;height:14px;border-radius:50%;background:${primary500};border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.3);cursor:pointer;`;
      const popup = new maplibregl.Popup({ offset: 15 }).setHTML(`<div dir="auto"><b>${this.centers()[i]?.name ?? ''}</b></div>`);
      new maplibregl.Marker({ element: el })
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(this.map!);
    });
    setTimeout(() => this.map?.resize(), 200);
  }
}
