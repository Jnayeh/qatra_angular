# Blood Donation Platform - Development Guidelines

> This document provides implementation guidelines for building a modern **Blood Donation Platform** using **Angular 20**, **Standalone Components**, **Signals**, **PrimeNG**, and **PWA** support.
>
> The goal is **production-ready**, **mobile-first**, **highly responsive**, **accessible**, and **maintainable** architecture.

---

# Tech Stack

## Frontend

- Angular 20
- Standalone Components
- Angular Signals
- Angular Router
- Angular HttpClient
- RxJS only where necessary
- PrimeNG
- PrimeIcons
- Angular Service Worker (PWA)
- Angular Animations
- SCSS
- CSS Variables
- Typed Reactive Forms

---

# UI Theme

Use the provided primary palette.

```scss
@import "primeicons/primeicons.css" layer(primeng);

:root {
  --p-primary-50: #fce4e4;
  --p-primary-100: #f8baba;
  --p-primary-200: #f28b8b;
  --p-primary-300: #eb5c5c;
  --p-primary-400: #e63939;
  --p-primary-500: #cc0000;
  --p-primary-600: #b30000;
  --p-primary-700: #990000;
  --p-primary-800: #7a0000;
  --p-primary-900: #5c0000;
}
```

Primary color should always represent blood donation.

Accent colors should remain minimal.

Use plenty of white space.

Rounded corners:

- 16px cards
- 12px inputs
- 12px buttons

Soft shadows only.

Avoid heavy gradients.

---

# Design Inspiration

The application should combine these inspirations:

- Modern charity donation pages
- Blood donation management systems
- Mobile blood donation applications

Visual characteristics:

- Clean
- Friendly
- Healthcare feeling
- Minimal
- Card-based UI
- Large hero sections
- Soft shadows
- Large illustrations
- Red primary color
- White background
- Light gray secondary backgrounds

---

# Design System

## Typography

Font:

- Inter

Fallback:

- sans-serif

Sizes

```
12 caption
14 small
16 body
18 subtitle
20 h5
24 h4
32 h3
40 h2
48 hero
```

---

## Spacing

Use an 8px spacing system.

```
4
8
12
16
24
32
40
48
64
96
```

---

## Border Radius

```
Input: 12
Button: 12
Card: 16
Dialog: 20
Hero images: 20
```

---

# Responsive Strategy

The application MUST be mobile-first.

Breakpoints:

```
xs 0
sm 576
md 768
lg 992
xl 1200
xxl 1400
```

Desktop should never simply shrink.

Every section must have dedicated layouts.

Example:

Desktop

```
Hero
-------------------------------------
Text             Illustration
```

Tablet

```
Hero
Illustration

Text
```

Mobile

```
Illustration

Text

Buttons
```

Cards should become stacked.

Tables become cards.

Sidebars become drawers.

Filters become bottom sheets.

---

# Layout

Use CSS Grid for pages.

Use Flex only inside components.

Maximum content width

```
1400px
```

Container

```
width: min(100%, 1400px);
margin: auto;
padding-inline: clamp(16px,3vw,40px);
```

---

# Pages

## Landing

Contains:

Hero

Benefits

Statistics

Why donate

Donation process

Emergency requests

Testimonials

Latest campaigns

Nearby donation centers

Footer

---

## Authentication

Login

Register

Forgot password

OTP verification

Reset password

Beautiful illustration on desktop.

Single column on mobile.

---

## Dashboard

Different dashboards depending on role.

Donor

Hospital

Blood Center

Administrator

Dashboard cards:

Upcoming appointments

Donation history

Eligibility

Emergency requests

Nearby centers

Achievements

Notifications

---

## Donor Profile

Editable profile

Medical information

Blood type

Weight

Eligibility

Donation history

Certificates

Achievements

Settings

---

## Blood Requests

Cards on mobile.

Grid on desktop.

Each request displays

Hospital

Urgency

Distance

Blood type

Units

Time remaining

CTA

Donate

---

## Donation Centers

Map

Search

Filters

Cards

Directions

Available blood types

Opening hours

Contact

---

## Appointment Booking

Calendar

Available slots

Confirmation

QR code

Reminder

---

## Donation History

Timeline

Statistics

Certificates

Rewards

---

## Community Feed

Posts

Images

Comments

Likes

Share

---

## Notifications

Realtime style

Grouped

Read/unread

---

## Administration

Users

Hospitals

Blood Centers

Campaigns

Blood Inventory

Analytics

Settings

Audit Logs

---

# Component Library

Create reusable standalone components.

Examples

```
app-navbar

app-footer

app-card

app-stat-card

app-blood-card

app-request-card

app-center-card

app-map

app-avatar

app-profile-card

app-notification

app-badge

app-empty-state

app-loading

app-confirm-dialog

app-search

app-filter

app-pagination

app-calendar

app-stepper

app-chart

app-blood-type-chip

app-status-chip
```

---

# Folder Structure

```
src/

 app/

   core/

      interceptors/

      guards/

      services/

      config/

      layouts/

   shared/

      components/

      pipes/

      directives/

      utils/

      models/

      constants/

   features/

      auth/

      landing/

      donor/

      hospital/

      blood-center/

      admin/

      appointments/

      donations/

      emergency/

      notifications/

   store/

   assets/

```

---

# State Management

Prefer Signals.

Example

```
signal()

computed()

linkedSignal()

effect()
```

Avoid global state unless necessary.

Use injectable stores.

Example

```
UserStore

DonationStore

AppointmentStore

NotificationStore

EmergencyStore
```

---

# API Layer

One service per feature.

Example

```
DonationService

UserService

AppointmentService

HospitalService

NotificationService
```

Never place HTTP inside components.

---

# Forms

Use strictly typed Reactive Forms.

Validation

Real-time validation

Inline errors

Accessible labels

Loading state

Disabled submit while invalid

---

# Accessibility

WCAG AA

Keyboard navigation

ARIA labels

High contrast

Focus rings

Screen reader support

Large touch targets

Minimum button size

44px

---

# Animations

Use Angular animations sparingly.

Fade

Slide

Expand

Card hover

Button ripple

Skeleton loading

Avoid excessive animations.

---

# Images

Lazy load all images.

Use responsive images.

Modern formats

```
webp

avif
```

Fallback to png.

---

# Performance

Use:

OnPush by default.

Signals.

Lazy routes.

Deferrable views.

Image optimization.

TrackBy.

Virtual scrolling.

Prefetch important routes.

Bundle splitting.

---

# PWA

The application must behave like a native application.

Features

- Installable
- Offline support
- Background sync
- Push notifications
- Splash screen
- App shortcuts
- Adaptive icons
- Theme color
- Cache assets
- Cache API responses
- Automatic updates
- Offline fallback page

Manifest

```
name

short_name

theme_color

background_color

display: standalone

orientation: portrait

icons
```

Service Worker

Cache

- assets
- fonts
- images
- api responses
- shell

Implement update notifications when a new version is available.

---

# Security

JWT authentication.

Refresh tokens.

HTTP interceptor.

Role-based guards.

Sanitize HTML.

Secure storage.

Avoid localStorage for sensitive information when possible.

---

# Error Handling

Global error handler.

Friendly error pages.

Offline detection.

Retry transient API failures.

Toast notifications.

---

# PrimeNG Components

Preferred components

```
Button

Card

Avatar

Badge

Tag

Toolbar

Dialog

Drawer

Tabs

Stepper

Panel

Accordion

Carousel

Timeline

DataView

Table

TreeTable

Calendar

InputText

InputMask

InputNumber

Password

Textarea

Dropdown

AutoComplete

Toast

ConfirmDialog

Skeleton

ProgressSpinner

ProgressBar

Chip

ScrollPanel

Menu

SpeedDial

SplitButton
```

Use PrimeNG theming consistently.

---

# Icons

Use PrimeIcons.

Examples

Blood

Hospital

Heart

Calendar

Bell

Profile

Map

Search

History

Emergency

Notification

Settings

Admin

---

# Coding Standards

Use standalone components only.

No NgModules.

Use Signals over Subjects whenever possible.

Use `inject()` instead of constructor injection.

Use control flow syntax.

```
@if

@for

@switch

@defer
```

Prefer readonly properties.

Strict typing everywhere.

No `any`.

Avoid duplicated logic.

Keep components focused.

Move business logic into services or signal stores.

---

# UX Principles

The application should feel:

- Fast
- Friendly
- Trustworthy
- Calm
- Professional
- Accessible

Users should always know:

- Their eligibility
- Next appointment
- Nearby donation centers
- Active emergency requests
- Donation impact
- Personal history

The UI should prioritize clarity over decoration and provide a seamless experience across desktop, tablet, and mobile devices.

---

# Nice-to-Have Features

- Dark mode
- Geolocation for nearby donation centers
- QR code check-in
- Blood donation streaks
- Donation impact dashboard
- Real-time emergency alerts
- Calendar synchronization
- PDF donation certificates
- Multi-language support (i18n)
- Theme customization
- Analytics dashboard
- Infinite scrolling for feeds
- Skeleton placeholders throughout the application
