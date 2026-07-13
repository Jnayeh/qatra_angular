# Frontend Implementation Instructions — Qatra Blood Donation Platform

> **Audience:** An LLM (or human) continuing frontend development.
> **Goal:** Complete a production-ready, mobile-first, responsive Angular 20 frontend that
> covers every use case, looks polished, and works seamlessly on mobile, tablet, and desktop.

---

## 0. Current State Summary

| Aspect | Status |
|--------|--------|
| Framework | Angular 20.3 — standalone components, signals, new control flow (`@if`/`@for`/`@defer`) |
| UI Library | PrimeNG 20.5 LTS (Aura preset, light mode only) |
| CSS | Tailwind CSS v4 + PrimeIcons v7 |
| State | @ngrx/signals 20.1 — one SignalStore per feature |
| Validation | Zod 3.23 schemas with Angular form integration |
| Maps | Leaflet with OpenStreetMap |
| Charts | Chart.js |
| QR | html5-qrcode |
| CSV | PapaParse |
| WebSocket | @stomp/stompjs + SockJS (STOMP) |
| Mock Backend | Complete in-memory mock interceptor (1176 lines, all entities, all CRUD) |
| Real Backend | Spring Boot `:8080`, Notification WS `:8081` |
| Build | Vite via @angular/build 20 — **production build passes (zero errors)** |

### What exists
- Full route tree with lazy loading for all features
- Auth (login, register, forgot/reset password, verify email) — functional with mock
- Donor dashboard, profile, blood type, location, availability, health questionnaire, impact, certificates, notification prefs — pages exist, mostly functional with mock
- Center list with Leaflet map, center detail, slot booking — basic pages exist
- Emergency list, detail, create, history — basic pages exist
- Appointment booking, my appointments, staff queue, check-in, screening, completion, donation history — pages exist with varying completeness
- Notification center — basic page exists, WebSocket store exists
- Admin dashboard, user management, center approval, audit logs, reports — basic pages exist
- Shared components: status-badge, notification-bell, loading-spinner, empty-state
- Layout: sidebar + toolbar with role-based navigation
- Mock interceptor handles ALL API endpoints end-to-end

### What needs work
1. **Mobile responsiveness** — most pages are desktop-only layouts, need mobile-first redesign
2. **Landing page** — needs more sections, better design, mobile layout
3. **Appointment booking page** — placeholder, needs full calendar/slot selection flow
4. **Donor appointments page** — empty states, needs actual appointment cards
5. **Staff queue page** — basic, needs real data flow and actions
6. **Check-in page** — QR scanner exists but full flow needs completion
7. **Admin pages** — many are basic tables, need full mobile layouts and actions
8. **Center manage page** — placeholder, needs staff management, closures, analytics
9. **Notification bell** — not connected to store, needs real WebSocket integration
10. **Charts** — some admin charts use Chart.js but need proper responsive handling
11. **Empty states** — some pages lack proper empty/loading states
12. **Forms** — some forms lack proper validation feedback
13. **Dark mode** — not requested but mentioned as nice-to-have; skip unless asked
14. **PWA** — service worker, manifest, offline support not yet configured


---

## 1. Architecture & Conventions (MUST follow)

### Tech Stack (do not change)
```
Angular 20.3 (standalone only, no NgModules)
@ngrx/signals 20.1 (SignalStore, one per feature)
PrimeNG 20.5 LTS (Aura theme, light mode)
Tailwind CSS v4
PrimeIcons v7
Zod 3.23 (validation schemas)
Chart.js (charts)
Leaflet (maps)
html5-qrcode (QR scanning)
PapaParse (CSV export)
@stomp/stompjs + SockJS (WebSocket)
```

### Code Style Rules
- **Standalone components only** — never create an NgModule
- **Signals over Subjects** — use `signal()`, `computed()`, `linkedSignal()`, `effect()`
- **`inject()` instead of constructor injection**
- **Control flow syntax** — `@if`, `@for`, `@switch`, `@defer` (never `*ngIf`, `*ngFor`)
- **OnPush change detection** on every component
- **No `any`** — strict typing everywhere
- **Readonly properties** where possible
- **Keep components focused** — move business logic into services or signal stores
- **One service per feature** — never put HTTP calls in components
- **Zod schemas** for all form validation — use `zodToValidators()` from `shared/utils/form-utils.ts`

### Folder Structure (do NOT restructure)

### API Layer
- Base URL: `/api/v1` (proxied to `localhost:8080`)
- WebSocket: `/ws` (proxied to `localhost:8081`) ==> Check the other .md file
- All API calls go through `ApiService` in `core/http/api.service.ts`
- Mock interceptor intercepts `/api/v1/` requests when `USE_MOCK=true` (default)
- Response envelope: `{ success: boolean, data: T, message?: string, timestamp: string }` with paging field
- Paginated responses: `{ content: T[], totalPages, totalElements, size, number, first, last, empty }` ==> Wrong, the right one in instructions diag check file

### State Management Pattern
Each feature store follows this pattern:
```typescript
export const XStore = signalStore(
  withState<XState>({ ... }),
  withComputed(({ ... }) => ({ ... })),
  withMethods(({ ... }, xService: XService = inject(XService)) => ({
    async loadX() { ... },
    async updateX(data: XUpdate) { ... },
  })),
);
```

### Design System
- **Font:** Inter (loaded via Google Fonts)
- **Primary color:** Blood red palette (`--p-primary-50` through `--p-primary-900`)
- **Border radius:** Cards 16px, Inputs 12px, Buttons 12px, Dialogs 20px
- **Spacing:** 8px grid (4, 8, 12, 16, 24, 32, 40, 48, 64, 96)
- **Shadows:** Soft only (e.g., `shadow-sm`, `shadow-md`)
- **Max content width:** 1400px
- **Container:** `width: min(100%, 1400px); margin: auto; padding-inline: clamp(16px, 3vw, 40px);`

---

## 2. Responsive Strategy (CRITICAL)

The app MUST be mobile-first. Every page must work on screens from 320px to 1400px+.

### Breakpoints
```
xs: 0px      (mobile portrait)
sm: 576px    (mobile landscape)
md: 768px    (tablet)
lg: 992px    (desktop)
xl: 1200px   (large desktop)
xxl: 1400px  (extra large)
```

### Layout Rules
- **Mobile:** Single column, stacked elements, bottom navigation or hamburger menu
- **Tablet:** 2-column grids, sidebar collapses to drawer
- **Desktop:** Full sidebar + content area, multi-column grids

### Component Behavior by Breakpoint
| Component | Mobile | Tablet | Desktop |
|-----------|--------|--------|---------|
| Sidebar | Hidden (drawer) | Hidden (drawer) | Visible (264px fixed) |
| Toolbar | Hamburger + title | Hamburger + title | Sidebar toggle + title |
| Cards | Full width stacked | 2-column grid | 3-4 column grid |
| Tables | Card layout | Scrollable table | Full table |
| Filters | Bottom sheet | Side panel | Inline |
| Dialogs | Full screen | Centered modal | Centered modal |
| Forms | Full width, stacked | 2-column | 2-3 column |
| Hero sections | Illustration on top, text below | Side by side | Side by side |
| Charts | Full width | Half width | Third width |

### CSS Approach
Use Tailwind responsive prefixes consistently:
```html
<!-- Mobile first: base = mobile, md: = tablet, lg: = desktop -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
```

For sidebar visibility, use the existing `sidebarOpen` signal pattern in `MainLayoutComponent`.

---

## 3. Pages to Implement / Complete

### Priority 1 — Core User Flows (must work end-to-end)

#### 3.1 Landing Page (`features/landing/`)
**Current:** Basic hero + stats + 3 steps + CTA + footer.
**Required:**
- Mobile layout: illustration on top, text below, stacked sections
- Desktop layout: side-by-side hero, multi-column features
- Sections: Hero, Benefits (3 cards), Statistics (animated counters), Why Donate (illustration + text), Donation Process (3 steps with icons), Emergency Requests (live feed), Testimonials (carousel), Latest Campaigns, Nearby Centers (map preview), Footer with links
- All sections must be responsive
- Use PrimeNG Carousel for testimonials
- Use Leaflet mini-map for nearby centers section
- Animated stat counters on scroll (use IntersectionObserver)

#### 3.2 Appointment Booking (`features/appointment/appointment-booking-page.ts`)
**Current:** Placeholder component.
**Required:**
- Step 1: Select center (search + map view + card list)
- Step 2: Select date (PrimeNG Calendar, show available dates)
- Step 3: Select time slot (grid of slot cards showing time, capacity, availability)
- Step 4: Confirm & book (summary card + confirm button)
- Show QR code after successful booking
- Mobile: full-width steps, stacked
- Desktop: stepper component with side panel showing selection summary
- Use PrimeNG Stepper for the flow

#### 3.3 Donor My Appointments (`features/appointment/donor-appointments-page.ts`)
**Current:** Tabbed view with empty states.
**Required:**
- Tabs: Upcoming / Past / Cancelled
- Each appointment as a card showing: center name, date/time, status badge, type badge
- Actions: Reschedule, Cancel (for upcoming), View QR code, Download certificate (for past)
- Mobile: stacked cards
- Desktop: grid of cards or table view toggle
- Pagination

#### 3.4 Staff Queue (`features/appointment/staff-queue-page.ts`)
**Current:** Basic tabbed view.
**Required:**
- Tabs: Checked In / In Screening / Scheduled / Completed
- Each item shows: donor name, blood type, appointment time, status
- Actions: Check In, Start Screening, View Donor Profile
- Real-time updates via WebSocket
- Mobile: card layout
- Desktop: table layout

#### 3.5 Center Slot Booking (`features/center/slot-booking-page.ts`)
**Current:** Basic date picker + slot grid.
**Required:**
- Calendar date selector (highlight days with available slots)
- Slot grid showing: time range, available/total capacity, blocked status
- Click slot to book
- Show booking confirmation dialog
- Mobile: scrollable time list
- Desktop: grid layout

### Priority 2 — Staff & Admin Operations

#### 3.6 Center Manage (`features/center/center-manage-page.ts`)
**Current:** Basic detail display.
**Required:**
- Tabs: Overview / Staff / Schedule / Closures / Analytics
- Overview: edit center info form, capacity settings
- Staff: list of staff members, add/remove staff
- Schedule: daily/weekly schedule view with appointments
- Closures: add closure windows, list existing closures
- Analytics: peak hours chart, blood type trends, donation stats
- Mobile: stacked tabs, scrollable
- Desktop: sidebar tabs + content area

#### 3.7 Admin Dashboard (`features/admin/dashboard-page.ts`)
**Current:** Basic stat cards + charts.
**Required:**
- Stat cards: Active Emergencies, Total Donors, Response Rate, Active Centers
- Charts: bar (top centers), doughnut (response rate), line (donations over time)
- Recent alerts feed
- Quick action buttons
- Mobile: stacked cards, full-width charts
- Desktop: grid layout, charts in columns

#### 3.8 Admin User Management (`features/admin/user-management-page.ts`)
**Current:** Basic PrimeNG Table.
**Required:**
- Search + filter (by role, status)
- Table with: name, email, status badge, roles, actions
- Actions: View detail, Suspend/Activate, Delete
- User detail page with full info + role management
- Mobile: card layout instead of table
- Desktop: full table with pagination

#### 3.9 Admin Audit Logs (`features/admin/audit-logs-page.ts`)
**Current:** Basic table.
**Required:**
- Filter by: date range, user, action type, entity type
- Table with: timestamp, action, entity, user, details
- Export to CSV
- Mobile: scrollable table or card layout
- Desktop: full table

### Priority 3 — Polish & Completeness

#### 3.10 Notification Bell (`shared/components/notification-bell/`)
**Current:** Placeholder with static data.
**Required:**
- Connect to `NotificationStore` for real unread count
- Show recent notifications in dropdown
- Mark as read on click
- Badge with unread count
- Mobile: full notification panel
- Desktop: dropdown

#### 3.11 Check-in Page (`features/appointment/checkin-page.ts`)
**Current:** QR scanner + manual entry.
**Required:**
- Camera-based QR scanner (already using html5-qrcode)
- Manual appointment ID entry as fallback
- After scan: show donor profile, eligibility, appointment details
- Actions: Confirm check-in, Mark as no-show
- Mobile: full-screen scanner
- Desktop: scanner in left panel, results in right panel

#### 3.12 Screening Page (`features/appointment/screening-page.ts`)
**Current:** Form with Zod validation.
**Required:**
- Vitals form: temperature, hemoglobin, blood pressure, pulse
- Medical check toggle
- Notes textarea
- Submit → creates health screening record
- Show pass/fail result
- Mobile: stacked form fields
- Desktop: 2-column form

#### 3.13 Completion Page (`features/appointment/completion-page.ts`)
**Current:** Form with Zod validation.
**Required:**
- Volume collected (ml) input
- Blood type (optional, for verification)
- Notes
- Submit → completes appointment, shows certificate
- Mobile: simple form
- Desktop: form + summary panel

---

## 4. Component Implementation Details

### 4.1 Shared Components to Enhance

#### `status-badge` — already exists, enhance
- Add more status color mappings
- Support `size` input: `sm`, `md`, `lg`
- Add icon option

#### `notification-bell` — needs rewrite
- Remove placeholder data
- Connect to NotificationStore
- Show unread count badge (red dot for count > 0)
- Dropdown with recent 5 notifications
- "Mark all as read" button
- "View all" link to notification center

#### New: `appointment-card` — create
- Inputs: appointment, userRole, showActions
- Display: center name, date/time, status, type, blood type
- Actions based on role and status
- Mobile: full-width card
- Desktop: compact card

#### New: `emergency-card` — create
- Inputs: emergency, showActions
- Display: blood type badge, units needed, urgency badge, status, distance
- Actions: View, Respond (for donors)
- Pulsing red border for CRITICAL urgency

#### New: `center-card` — create
- Inputs: center, distance
- Display: name, address, status badge, operating hours, distance
- Actions: View, Book
- Map preview on hover (desktop)

#### New: `stat-card` — create
- Inputs: label, value, icon, trend, color
- Display: icon + value + label + optional trend arrow
- Responsive sizing

#### New: `empty-state` — already exists, enhance
- Add illustration option
- Support different sizes
- Add action button

#### New: `loading-skeleton` — create
- Generic skeleton placeholder for cards, tables, lists
- Use PrimeNG Skeleton

### 4.2 New Components to Create

#### `bottom-sheet` — for mobile filters
- Slide-up panel from bottom
- Used for filter options on mobile
- PrimeNG Dialog with `styleClass="bottom-sheet"`

#### `confirm-dialog` — for destructive actions
- Wrapper around PrimeNG ConfirmDialog
- Consistent styling for delete/suspend/cancel actions

---

## 5. Feature-Specific Implementation Guide

### 5.1 Auth Pages

#### Login Page
- Dynamic title based on `intendedRole` route data
- Email + password form with Zod validation
- "Forgot password?" link
- "Register" link (for donors)
- Post-login redirect based on role:
  - DONOR → `/donor/dashboard`
  - CENTER_STAFF → `/appointments/staff-queue`
  - CENTER_ADMIN → `/centers/list`
  - SYSTEM_ADMIN → `/admin/dashboard`
- Mobile: full-width form, illustration on top
- Desktop: split layout with illustration on right

#### Register Page
- Form: displayName, email, phone, password, confirmPassword
- Password strength indicator
- Terms acceptance checkbox
- Post-register: show "Check your email" message

### 5.2 Donor Pages

#### Dashboard
- 4 stat cards in a grid (blood type, eligibility, reliability score, lives saved)
- Quick action buttons (Find Center, My Appointments, Emergency Responses, View Impact)
- Profile completion checklist (animated progress ring)
- Recent activity feed
- Mobile: 2-column stat cards, stacked sections
- Desktop: 4-column stat cards, side-by-side sections

#### Health Questionnaire
- Toggle switches for each condition
- Conditional detail textareas
- Save button with loading state
- Show current status at top
- Mobile: stacked toggles
- Desktop: grouped toggles with descriptions

#### Blood Type Selection
- 3x3 grid of blood type buttons
- Show verified state with lock icon
- Disable selection when verified
- Mobile: 3-column grid
- Desktop: centered 3x3 grid with descriptions

### 5.3 Emergency Pages

#### Emergency List
- Filter by: status, urgency, blood type
- Each card shows: blood type, units, urgency, status, distance
- CRITICAL urgency: pulsing red border
- "New Emergency" button (staff only)
- Mobile: stacked cards
- Desktop: grid layout

#### Emergency Detail
- Two-column layout
- Left: emergency info (blood type, units, urgency, status, deadline)
- Right: matched donors list, response stats
- Donor actions: "I'm Willing" + "Decline" buttons
- After willing: show available slots to select
- Mobile: stacked columns
- Desktop: side-by-side

### 5.4 Admin Pages

#### Reports
- Date range picker
- Report type selector (Platform, Region, Blood Type)
- Generate button
- Results in PrimeNG Table
- Export to CSV button
- Mobile: stacked filters, scrollable table
- Desktop: inline filters, full table

---

## 6. Implementation Order

Implement in this order to deliver working flows incrementally:

### Phase 1: Core Donor Flow (Days 1-2)
1. Fix landing page mobile layout
2. Complete appointment booking page
3. Complete donor my-appointments page
4. Connect notification bell to store
5. Polish donor dashboard mobile layout

### Phase 2: Staff Flow (Days 3-4)
1. Complete staff queue page with real data
2. Complete check-in page flow
3. Complete screening page
4. Complete completion page
5. Polish center manage page

### Phase 3: Admin Flow (Days 5-6)
1. Complete admin dashboard with responsive charts
2. Complete user management with mobile layout
3. Complete center approval page
4. Complete audit logs with filters
5. Complete reports with CSV export

### Phase 4: Polish & Edge Cases (Day 7)
1. Empty states for all pages
2. Loading skeletons for all data-heavy pages
3. Error states and retry logic
4. Accessibility pass (ARIA labels, keyboard nav)
5. Final responsive testing

---

## 7. API Endpoints Reference

All endpoints use the `/api/v1` prefix. The mock interceptor handles these.

### Auth (`/api/v1/auth`)
```
POST /register          → { userId, email, emailVerificationSent }
POST /verify-email      → { message }
POST /login             → { accessToken, refreshToken, expiresIn }
POST /logout            → { message }
POST /refresh           → { accessToken, refreshToken, expiresIn }
POST /forgot-password   → { message }
POST /reset-password    → { message }
```

### Donors (`/api/v1/donors`)
```
GET  /me                        → DonorProfileResponse
PUT  /me                        → DonorProfileResponse
PUT  /me/blood-type             → { bloodType, bloodTypeVerified }
PUT  /me/location               → { latitude, longitude, city, country }
PUT  /me/availability           → { availability }
PUT  /me/notification-prefs     → NotificationPreferences
GET  /me/health-questionnaire   → HealthQuestionnaireResponse
PUT  /me/health-questionnaire   → HealthQuestionnaireResponse
GET  /me/eligibility            → { eligible, nextEligibleDate, reason }
GET  /me/impact                 → { totalDonations, estimatedLivesSaved, milestones }
GET  /me/certificates           → [ { donationDate, centerId, centerName, mlCollected, certificateUrl } ]
DELETE /me                      → { message, requestId }
GET  /{id}                      → DonorDetail
GET  /{id}/eligibility          → EligibilityStatus
```

### Centers (`/api/v1/centers`)
```
GET  /                          → Page<CenterSummary>
GET  /{id}                      → CenterDetail
POST /                          → CenterResponse
PUT  /{id}                      → CenterResponse
GET  /{id}/slots                → [ SlotResponse ]
POST /{id}/closures             → { blockedSlotCount, date, reason }
GET  /{id}/staff                → [ StaffSummary ]
POST /{id}/staff                → StaffSummary
DELETE /{id}/staff/{userId}     → { message }
GET  /{id}/schedule             → DailySchedule
GET  /{id}/analytics            → CenterAnalytics
GET  /{id}/reports              → CenterReport
GET  /pending                   → Page<CenterSummary>
PATCH /{id}/approve             → CenterResponse
PATCH /{id}/status              → CenterResponse
PATCH /{id}/slots/{slotId}/block → SlotResponse
```

### Emergencies (`/api/v1/emergencies`)
```
POST /                          → EmergencyDetail
GET  /                          → Page<EmergencySummary>
GET  /{id}                      → EmergencyDetail
PATCH /{id}/status              → EmergencyDetail
POST /{id}/resolve              → EmergencyDetail
GET  /{id}/matches              → [ MatchResult ]
POST /{id}/respond              → EmergencyRespondResult
GET  /history                   → Page<EmergencySummary>
GET  /my-responses              → [ EmergencyNotificationSummary ]
```

### Appointments (`/api/v1/appointments`)
```
POST /                          → AppointmentResponse
GET  /                          → Page<AppointmentSummary>
GET  /{id}                      → AppointmentDetail
PATCH /{id}/reschedule          → AppointmentResponse
DELETE /{id}                    → { message }
POST /checkin                   → CheckInResult
POST /{id}/no-show              → AppointmentResponse
POST /{id}/screening            → HealthScreeningResponse
POST /{id}/complete             → AppointmentResponse
GET  /{id}/screening            → HealthScreeningResponse
GET  /my                        → Page<AppointmentSummary>
GET  /my/donations              → Page<DonationHistoryEntry>
GET  /staff/queue               → [ AppointmentTask ]
```

### Notifications (`/api/v1/notifications`)
```
GET  /                          → Page<NotificationResponse>
PATCH /{id}/read                → { id, readAt }
PATCH /read-all                 → { markedCount }
GET  /unread-count              → { count }
```

### Admin (`/api/v1/admin`)
```
GET  /dashboard                 → SystemDashboard
GET  /users                     → Page<UserSummary>
GET  /users/{id}                → UserDetail
PATCH /users/{id}/status        → UserSummary
PATCH /users/{id}/roles         → { userId, roles }
DELETE /users/{id}              → { message }
GET  /audit-logs                → Page<AuditLogEntry>
GET  /audit-logs/export         → CSV/JSON file
GET  /config                    → [ SystemConfigEntry ]
PUT  /config/{key}              → SystemConfigEntry
GET  /feature-flags             → [ FeatureFlag ]
PUT  /feature-flags/{name}      → FeatureFlag
GET  /deletion-requests         → Page<DeletionRequest>
POST /deletion-requests/{id}/process → DeletionRequest
GET  /reports                   → PlatformReport
GET  /forecasts                 → [ DemandForecast ]
GET  /metrics/system            → SystemHealth
```

---

## 8. Mock Backend Details

The mock interceptor at `core/mock/mock.interceptor.ts` handles ALL API calls. It:
- Intercepts requests to `/api/v1/**`
- Routes to handler functions based on URL pattern and HTTP method
- Returns realistic mock data with simulated delay (200-600ms)
- Supports pagination, filtering, and CRUD operations
- Stores state in memory (mutations persist during session)

### Key Mock Data
- 3 users: donor@example.com / password, staff@example.com / password, admin@example.com / password
- 4 centers across Morocco (Casablanca, Rabat, Marrakech, Tangier)
- Auto-generated slots for 14 days
- 1 donor profile with impact summary
- 3 appointments (scheduled, completed, cancelled)
- 2 emergencies (open, in-progress)
- 5 notifications
- System config, feature flags, audit logs

### Switching to Real Backend
To switch from mock to real backend:
1. Set `USE_MOCK = false` in `core/mock/mock.interceptor.ts`
2. Ensure Spring Boot backend is running on `localhost:8080`
3. Ensure notification service is running on `localhost:8081`
4. The proxy config already routes `/api/*` and `/ws`

---

## 9. Responsive Layout Templates

### Mobile-First Page Template
```html
<div class="min-h-screen bg-gray-50">
  <!-- Page Header -->
  <div class="px-4 py-6 sm:px-6 lg:px-8">
    <h1 class="text-2xl font-bold text-gray-900">Page Title</h1>
    <p class="mt-1 text-sm text-gray-500">Description</p>
  </div>

  <!-- Content -->
  <div class="px-4 sm:px-6 lg:px-8 pb-24 md:pb-8">
    <!-- Mobile: stacked, Tablet+: grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <!-- Cards here -->
    </div>
  </div>
</div>
```

### Dashboard Stat Cards Template
```html
<div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
  @for (stat of stats(); track stat.label) {
    <div class="bg-white rounded-2xl p-4 sm:p-6 shadow-sm">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary-50 flex items-center justify-center">
          <i [class]="stat.icon" class="text-primary-500 text-lg sm:text-xl"></i>
        </div>
        <div>
          <p class="text-2xl sm:text-3xl font-bold text-gray-900">{{ stat.value }}</p>
          <p class="text-xs sm:text-sm text-gray-500">{{ stat.label }}</p>
        </div>
      </div>
    </div>
  }
</div>
```

### Card List Template
```html
<!-- Mobile: stacked cards -->
<div class="space-y-3 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4">
  @for (item of items(); track item.id) {
    <div class="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
         (click)="viewItem(item)">
      <!-- Card content -->
    </div>
  }
</div>
```

### Table → Mobile Card Pattern
```html
<!-- Desktop table -->
<div class="hidden md:block">
  <p-table [value]="items()" ...>
    <!-- Table columns -->
  </p-table>
</div>

<!-- Mobile cards -->
<div class="md:hidden space-y-3">
  @for (item of items(); track item.id) {
    <div class="bg-white rounded-2xl p-4 shadow-sm">
      <!-- Card version of table row -->
    </div>
  }
</div>
```

---

## 10. Performance Checklist

- [ ] Use `@defer` for heavy components (charts, maps, QR scanner)
- [ ] Lazy load all feature routes (already done in `app.routes.ts`)
- [ ] Use `trackBy` / `track` in all `@for` loops
- [ ] OnPush change detection on all components
- [ ] Signals for all reactive state (no BehaviorSubjects)
- [ ] Image lazy loading (`loading="lazy"`)
- [ ] Virtual scrolling for long lists (PrimeNG `p-virtualScroller`)
- [ ] Prefetch auth route on app load
- [ ] Prefetch donor dashboard after login
- [ ] Avoid unnecessary re-renders with `computed()` signals

---

## 11. Accessibility Checklist

- [ ] All interactive elements have `aria-label`
- [ ] Forms have associated labels
- [ ] Color is not the only way to convey information (add icons/text)
- [ ] Focus rings visible on all interactive elements
- [ ] Keyboard navigation works for all menus and dialogs
- [ ] Minimum touch target size: 44px on mobile
- [ ] Skip-to-content link
- [ ] Proper heading hierarchy (h1 → h2 → h3)
- [ ] Alt text on all images
- [ ] ARIA live regions for dynamic content (notifications, errors)

---

## 12. Common Pitfalls to Avoid

1. **Do not create NgModules** — standalone components only
2. **Do not use `any` type** — always type your signals, observables, and function parameters
3. **Do not put HTTP calls in components** — always use the feature service
4. **Do not use RxJS Subjects for state** — use @ngrx/signals SignalStore
5. **Do not forget `track` in `@for` loops** — performance will degrade
6. **Do not use `*ngIf` / `*ngFor`** — use `@if` / `@for` control flow
7. **Do not hardcode colors** — use the CSS variables / Tailwind theme
8. **Do not skip mobile layouts** — every page must work on 320px screens
9. **Do not use heavy animations** — keep them subtle (fade, slide, scale)
10. **Do not commit secrets** — no API keys, passwords, or tokens in code

---

## 13. Files to Reference

| Purpose | File Path |
|---------|-----------|
| Routes | `src/app/app.routes.ts` |
| App config | `src/app/app.config.ts` |
| Auth store | `src/app/core/auth/auth.store.ts` |
| Auth service | `src/app/core/auth/auth.service.ts` |
| API service | `src/app/core/http/api.service.ts` |
| Mock data | `src/app/core/mock/mock-data.ts` |
| Mock interceptor | `src/app/core/mock/mock.interceptor.ts` |
| WebSocket | `src/app/core/socket/socket.service.ts` |
| Layout | `src/app/layouts/main-layout/main-layout.ts` |
| Sidebar | `src/app/layouts/main-layout/sidebar/sidebar.ts` |
| Toolbar | `src/app/layouts/main-layout/toolbar/toolbar.ts` |
| Zod helpers | `src/app/shared/utils/form-utils.ts` |
| Blood type utils | `src/app/shared/utils/blood-type-utils.ts` |
| Date utils | `src/app/shared/utils/date-utils.ts` |
| Pagination utils | `src/app/shared/utils/pagination-utils.ts` |
| Status badge | `src/app/shared/components/status-badge/status-badge.ts` |
| Notification bell | `src/app/shared/components/notification-bell/notification-bell.ts` |
| Empty state | `src/app/shared/components/empty-state/empty-state.ts` |
| Loading spinner | `src/app/shared/components/loading-spinner/loading-spinner.ts` |
| Proxy config | `proxy.conf.json` |
| Tailwind config | `src/tailwind.css` |
| Global styles | `src/styles.css` |

---

## 14. Definition of Done

A page is complete when:
1. It renders correctly on mobile (320px), tablet (768px), and desktop (1200px+)
2. All data comes from the store (no hardcoded data)
3. Loading state shows skeleton or spinner
4. Empty state shows helpful message with action
5. Error state shows retry option
6. Forms have real-time validation with inline errors
7. All interactive elements are keyboard accessible
8. ARIA labels are present on interactive elements
9. The page works with both mock and real backend
10. No TypeScript errors or warnings

---

*This document is the single source of truth for frontend implementation.
All design decisions, conventions, and requirements above supersede
any implicit assumptions. When in doubt, check the backend API contract
in the Qatra instructions.md before adding any field or endpoint.*
