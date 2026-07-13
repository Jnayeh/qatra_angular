# USE CASES:
````

1. DONOR
Authentication & Onboarding
UC-D01 Register with email or phone

UC-D02 Verify email address

UC-D03 Login

UC-D04 Logout

UC-D05 Reset password

UC-D06 Complete health profile & questionnaire

UC-D07 Set blood type (or mark unknown)

UC-D08 Set notification preferences (including quiet hours via JSON)

UC-D09 Set location (manual or GPS)

UC-D10 Set availability status

UC-D11 Request account deletion (GDPR)

Profile Management
UC-D12 View donor dashboard

UC-D13 Update personal information

UC-D14 Update health questionnaire

UC-D15 Update location & availability

UC-D16 View eligibility status & next eligible date

UC-D17 View reliability score

UC-D18 View impact dashboard (milestones)

UC-D19 Download donation certificates

Emergency Response
UC-D20 Receive emergency notification

UC-D21 View emergency details (center, distance, blood type, urgency)

UC-D22 Accept emergency request

UC-D23 Decline emergency request (with optional reason)

Appointment Management
UC-D24 Browse nearby donation centers

UC-D25 View center details and operating hours

UC-D26 Schedule appointment (regular or emergency)

UC-D27 Reschedule or cancel appointment

UC-D28 Check in at donation center (QR scan â†’ staff views appointment details, or staff selects from list)

UC-D29 View appointment & donation history

UC-D30 Receive appointment & eligibility reminders

2. CENTER STAFF
Authentication
UC-CS01 Login, logout & reset password

Emergency Management
UC-CS02 Create emergency (blood type, units, urgency, deadline)

UC-CS03 Track emergency progress (escalate, extend, cancel)

UC-CS04 Resolve emergency

UC-CS05 View emergency history

Appointment & Donor Operations
UC-CS06 View daily schedule & own task queue

UC-CS07 Check in donor on arrival (QR scan shows appointment details; otherwise select from list)

UC-CS08 View donor eligibility & health profile

UC-CS09 Conduct & record health screening

UC-CS10 Complete appointment (record ml collected)

UC-CS11 Mark donor as no-show

3. CENTER ADMIN
Authentication
UC-CA01 Login, logout & reset password

Center Management
UC-CA02 Submit center registration request (approved by super admin)

UC-CA03 Update center info (address, hours, contact)

UC-CA04 Configure Center capacity & appointment slots

UC-CA05 Set special closures & operating hour exceptions

Staff Management
UC-CA06 Add or remove center staff

UC-CA07 View staff activity log

Reporting & Oversight

UC-CA09 View analytics (trends, peak hours, blood type inventory)

UC-CA10 Generate & export center report

4. SUPER ADMIN
Authentication
UC-SA01 Login, logout & reset password

User Management
UC-SA02 View, search & filter all users

UC-SA03 Activate, suspend or delete accounts

UC-SA04 Approve or reject center registration requests

UC-SA05 Assign & revoke roles

UC-SA06 Process GDPR data deletion requests

UC-SA07 Review & override permanent health restrictions



Monitoring & Reporting
UC-SA10 View system dashboard (emergencies, response rates, donor stats)

UC-SA11 Monitor system health (services, error logs, API usage)

UC-SA12 View & export audit logs

UC-SA13 Generate platform reports

5. SYSTEM (Automated)
Authentication & Sessions
UC-SYS01 Issue, refresh & expire sessions

UC-SYS02 Issue & expire verification tokens

Matching Engine
UC-SYS03 Scan & filter eligible donors on emergency creation

UC-SYS04 Score & rank matched donors (reliability, distance, history)

UC-SYS05 Execute tiered matching & escalate radius if needed

Notification Engine
UC-SYS06 Send emergency alert (channel routing, quiet hours, frequency limits)

UC-SYS07 Track delivery & retry failed notifications

UC-SYS08 Send appointment, eligibility & profile nudge reminders

Eligibility Management
UC-SYS09 Mark ineligible after donation & set eligible-from date

UC-SYS10 Auto-restore eligibility when cooldown passes

UC-SYS11 Flag permanent restrictions from health questionnaire

Reliability Scoring
UC-SYS12 Adjust reliability score (0â€“100) on donation completed, no-show, or repeated emergency declines while available

Three consecutive declines with no accept in between â†’ soft flag for manual review

Accept resets the consecutive decline counter

Declining alone carries no penalty

Slot Management
UC-SYS13 Release, block or free slots automatically

UC-SYS14 Expire unresolved emergencies past deadline

Analytics
UC-SYS15 Record real-time metrics & run batch analytics

UC-SYS16 Forecast blood type demand by region

UC-SYS17 Generate audit log on every state-changing action


````
# CLASS DIAGRAM:
````
---
config:
  layout: elk
---
classDiagram
direction LR
class User {
+Long id
+String email
+boolean emailVerified
+String phone
+String hashedPassword
+String displayName
+String firstName
+String familyName
+UserStatus status
+Instant createdAt
+Instant lastActiveAt
+Instant deletedAt
+Instant deletionRequestedAt
+verifyEmail()

    }
    class UserStatus {
		<<enumeration>>
	    ACTIVE
	    INACTIVE
	    SUSPENDED
	    PENDING_VERIFICATION
		PENDING_DELETION
	    DELETED
    }

    class UserRole {
	    +Long id
	    +Long userId
	    +Role role
	    +Instant assignedAt
    }

    class Role {
		<<enumeration>>
	    SUPER_ADMIN
	    CENTER_ADMIN
	    CENTER_STAFF
	    DONOR
    }

    class Session {
	    +Long id
	    +Long userId
	    +String accessTokenHash
	    +String refreshTokenHash
	    +String ipAddress
	    +String userAgent
	    +Instant expiresAt
	    +Instant createdAt
	    +validate()
	    +refresh()
	    +revoke()
    }

    class VerificationToken {
	    +Long id
	    +Long userId
	    +String tokenHash
	    +VerificationTokenType type
	    +Instant expiresAt
	    +Instant createdAt
	    +validate()
	    +consume()
    }

    class VerificationTokenType {
		<<enumeration>>
	    EMAIL_VERIFICATION
	    PASSWORD_RESET
    }
	class GDPRDeletionRequest {
		+Long id
		+Long userId
		+String reason
		+GDPRDeletionStatus status
		+Instant requestedAt
		+Instant processedAt
		+complete()
	}

	class GDPRDeletionStatus {
		<<enumeration>>
		IN_PROGRESS
		CANCELED
		COMPLETED
	}

    class AuditLog {
	    +Long id
	    +Long userId
	    +String action
	    +String entityType
	    +Long entityId
	    +JSON oldValue
	    +JSON newValue
	    +String ipAddress
	    +Instant timestamp
    }

    class DonorProfile {
	    +Long id
	    +Long userId
	    +BloodType bloodType
	    +Boolean bloodTypeVerified
	    +Boolean profileComplete
    	+DonorStatus status
	    +Double latitude
	    +Double longitude
	    +String city
	    +AvailabilityStatus availability
	    +LocalDate lastDonationDate
	    +LocalDate eligibleFromDate
	    +NotificationPreferences notificationPreferences
	    +Boolean allowEmergencyNotifications
	    +Integer consecutiveEmergencyDeclines
	    +Boolean flaggedForManualReview
	    +Boolean permanentlyRestricted
	    +String restrictionReason
	    +Double reliabilityScore
    	+int totalDonations
	    +Instant createdAt
	    +Instant updatedAt
	    +Instant lastAcceptAt
        +Instant deletedAt
        +Instant deletionRequestedAt
	    +canDonate()
	    +calculateEligibility()
	    +updateLocation()
	    +resetConsecutiveDeclinesOnAccept()
    }

	class QuietHours {
		+LocalTime start
		+LocalTime end
	}
    class NotificationFrequency {
		<<enumeration>>
	    IMMEDIATE
	    DAILY_DIGEST
	    EMERGENCY_ONLY
	    DISABLED
    }

	class NotificationPreferences {
		+NotificationFrequency frequency
		+QuietHours quietHours
		+boolean allowEmergencyNotifications
		+int maxNotificationDistanceKm
		+isQuietNow() boolean
	}

    class BloodType {
		<<enumeration>>
	    A_POSITIVE
	    A_NEGATIVE
	    B_POSITIVE
	    B_NEGATIVE
	    AB_POSITIVE
	    AB_NEGATIVE
	    O_POSITIVE
	    O_NEGATIVE
	    UNKNOWN
    }
    
	class DonorStatus {
		<<enumeration>>
		ACTIVE
		PENDING_DELETION
		INACTIVE
		DELETED
	}
    
	class AvailabilityStatus {
		<<enumeration>>
	    AVAILABLE
	    TEMPORARILY_UNAVAILABLE
	    VACATION_MODE
	    PERMANENTLY_RESTRICTED
    }
    
    class HealthQuestionnaire {
	    +Long id
	    +Long donorId
	    +Boolean hasChronicIllness
	    +Instant lastSurgeryAt
	    +Instant lastTravelAt
	    +Instant lastTattooOrPiercingAt
	    +Boolean onMedication
		+String medicalConditionsDetails
		+String medicationDetails
	    +Instant createdAt
	    +Instant updatedAt
    }

    class CenterStaffProfile {
	    +Long id
	    +Long userId
	    +Long centerId
	    +Boolean verified
	    +Instant createdAt
    }

    class CenterAdminProfile {
	    +Long id
	    +Long userId
	    +Long centerId
	    +Instant createdAt
    }

    class DonationCenter {
	    +Long id
	    +Long createdByUserId
	    +String name
	    +Double latitude
	    +Double longitude
	    +String address
	    +String city
	    +String country
	    +String postalCode
	    +String phone
	    +String email
	    +OperatingHours operatingHours
	    +Integer totalCapacity
	    +Integer maxRegular
	    +Integer slotPeriod
	    +FacilityType facilityType
	    +CenterStatus status
	    +Instant createdAt
    	+Instant updatedAt
	    +isOperatingNow()
	    +getAvailableSlots()
    }
	class OperatingHours {
		+DaySchedule monday
		+DaySchedule tuesday
		+DaySchedule wednesday
		+DaySchedule thursday
		+DaySchedule friday
		+DaySchedule saturday
		+DaySchedule sunday
		+List~ClosureWindow~ closedWindows
	}

	class DaySchedule {
		+LocalTime opens
		+LocalTime closes
	}
	class ClosureWindow {
		+LocalDate date
		+LocalTime startTime
		+LocalTime endTime
		+boolean allDay
		+String reason
	}
	 
    class CenterStatus {
		<<enumeration>>
	    PENDING_APPROVAL
	    ACTIVE
	    SUSPENDED
	    CLOSED
    }
	
    class FacilityType {
		<<enumeration>>
	    HOSPITAL
	    BLOOD_BANK
	    MOBILE_UNIT
	    COMMUNITY_CENTER
	    CLINIC
    }

    class Slot {
	    +Long id
	    +Long centerId
	    +LocalDate date
	    +LocalTime startTime
	    +LocalTime endTime
	    +Integer maxBookings
	    +Integer maxRegularBookings
	    +Integer bookedCount
	    +Integer regularBookedCount
	    +Boolean isBlocked
	    +Instant createdAt
	    +isAvailable()
    	+isAvailableForRegular() boolean
    }

    class Appointment {
	    +Long id
	    +Long slotId
	    +Long donorId
	    +Long centerId
	    +Long emergencyId
	    +Long completedByStaffId
	    +AppointmentStatus status
	    +AppointmentType appointmentType
	    +BloodType bloodType
	    +Integer mlCollected
	    +String notes
	    +String qrCode
	    +Instant createdAt
    	+Instant updatedAt
	    +Instant checkedInAt
    	+Instant startedAt
	    +Instant completedAt
	    +Instant cancelledAt
	    +String cancellationReason
    	+DonationOutcome outcome
		+checkIn()
		+startScreening()
	    +complete()
	    +cancel()
	    +reschedule()
    }

    class AppointmentStatus {
		<<enumeration>>
	    SCHEDULED
	    CHECKED_IN
		IN_SCREENING
	    COMPLETED
	    CANCELLED
	    NO_SHOW
	    RESCHEDULED
    }

    class AppointmentType {
		<<enumeration>>
	    REGULAR
	    EMERGENCY
    }
	class DonationOutcome {
		<<enumeration>>
		COMPLETED
		CANCELLED
	}
    class HealthScreening {
	    +Long id
	    +Long appointmentId
	    +Long donorId
		+Double weight
		+String bloodPressure
		+Double hemoglobin
	    +Long   screenedByStaffId
	    +Double temperature
	    +String notes
    	+Boolean eligible
	    +Instant screenedAt
    }

    class EmergencyRequest {
	    +Long id
	    +Long centerId
	    +Long createdByStaffId
	    +BloodType bloodType
	    +Integer unitsNeeded
	    +EmergencyUrgency urgency
	    +String contactPhone
	    +EmergencyStatus status
	    +Integer matchRadius
	    +Integer escalationLevel
	    +Instant expiresAt
	    +Instant createdAt
	    +Instant updatedAt
	    +Instant resolvedAt
	    +Long resolvedByUserId
	    +matchDonors()
	    +updateStatus()
	    +resolve()
		+cancel()
		+fulfill()
    }

    class MatchResult {
	    +Long id
	    +Long emergencyId
	    +Long centerId
	    +Long donorId
	    +Long radius
	    +MatchStatus status
	    +BloodType bloodType
	    +Integer escalationLevel
	    +Instant createdAt
	    +Instant respondedAt
    }

	class MatchStatus {
		<<enumeration>>
		PENDING
		RESPONDED
		EXPIRED
	}
	
	class EmergencyUrgency {
		<<enumeration>>
		CRITICAL
		HIGH
		MEDIUM
		LOW
	}

    class EmergencyStatus {
		<<enumeration>>
	    OPEN
		FULFILLED
		CANCELLED
		EXPIRED
    }

	class DonorResponse {
		+Long id
		+Long emergencyId
		+Long donorId
		+Long slotId
		+ResponseStatus status
		+String reason
		+Instant respondedAt
		+accept(Long slotId)
		+decline()
	}


	class ResponseStatus {
		<<enumeration>>
		ACCEPTED
		DECLINED
	}

    class Notification {
	    +Long id
	    +Long userId
	    +Long emergencyId
	    +Long appointmentId
	    +String email
	    +NotificationType type
	    +String title
	    +String body
	    +JSON data
    	+String correlationId
	    +NotificationChannel channel
	    +NotificationStatus status
	    +Instant createdAt
	    +Instant sentAt
	    +Instant readAt
		+markSent()
		+markRead()
		+markFailed()
    }
    class NotificationType {
		<<enumeration>>
	    EMERGENCY_ALERT
	    APPOINTMENT_REMINDER
	    ELIGIBILITY_REMINDER
	    PROFILE_COMPLETION
	    PASSWORD_RESET
	    GENERAL
    }

    class NotificationChannel {
		<<enumeration>>
	    IN_APP
	    PUSH
	    EMAIL
    }
	

    class NotificationStatus {
		<<enumeration>>
	    PENDING
	    SENT
	    DELIVERED
	    READ
	    FAILED
    }


    User "1" -- "*" Session : has
    User "1" -- "*" VerificationToken : has
    User "1" -- "*" UserRole : has
    User "1" -- "*" AuditLog : generates
    User "1" *-- "0..1" DonorProfile : has
    User "1" *-- "0..1" CenterStaffProfile : has
    User "1" *-- "0..1" CenterAdminProfile : has
    User "1" -- "0..1" GDPRDeletionRequest : requests
    DonorProfile "1" *-- "0..1" HealthQuestionnaire : has
    DonorProfile "1" -- "*" Appointment : makes
    DonorProfile "1" -- "*" DonorResponse : sends
    CenterStaffProfile "*" -- "1" DonationCenter : belongs to
    CenterStaffProfile "1" -- "*" EmergencyRequest : creates
    CenterStaffProfile "1" -- "*" Appointment : manages
    CenterAdminProfile "*" -- "1" DonationCenter : manages
    DonationCenter "1" -- "*" EmergencyRequest : handles
    DonationCenter "1" -- "*" Slot : offers
    Slot "1" -- "*" Appointment : fills
    Appointment "1" -- "0..1" HealthScreening : has
    EmergencyRequest "0..1" -- "*" Appointment : results in
    EmergencyRequest "1" *-- "*" MatchResult : triggers
    EmergencyRequest "0..1" -- "*" Notification : triggers
````

USER FLOWS:

**Donor Registration & Onboarding Flow**
â”ƒ - User signs up via email/phone, creating a `User` record in `PENDING_VERIFICATION` status and creating a `DonorProfile` in INACTIVE status.
â”ƒ - System generates an `EMAIL_VERIFICATION` token and sends a notification.
â”ƒ - User verifies email, transitioning `User` and `DonorProfile` status to `ACTIVE`.
â”ƒ - User completes their health profile, creating a `HealthQuestionnaire` and setting blood type/location.
â”ƒ - System checks the questionnaire; if safe, marks `DonorProfile.profileComplete` as true.

**Donor Scheduling Flow**
â”ƒ - Donor browses nearby `DonationCenter`s and views available `Slot`s.
â”ƒ - Donor books a slot, creating an `Appointment` in `SCHEDULED` status,  of type `REGULAR`,  and incrementing the `Slot.bookedCount` and the `Slot.regularBookedCount`.
â”ƒ - System schedules automated `APPOINTMENT_REMINDER` notifications based on the donor's `NotificationPreferences`.
â”ƒ - On arrival, staff scans the QR code or selects the donor, calling `Appointment.checkIn()` to set status to `CHECKED_IN`.
â”ƒ - Staff conducts a `HealthScreening`, calling `Appointment.startScreening()`.
â”ƒ - Staff records the volume drawn, calling `Appointment.complete()` which sets status to `COMPLETED`.
â”ƒ - System automatically recalculates the donor's `reliabilityScore`, increments `totalDonations`, and sets `eligibleFromDate` (e.g., 56 days out), temporarily making `canDonate()` false.

**Emergency Creation & Matching Flow**
â”ƒ - Staff creates an `EmergencyRequest` with required blood type, units, and urgency.
â”ƒ - System scans for `DonorProfile`s where blood type matches, `canDonate()` is true, and location is within the initial `matchRadius`, and is active.
â”ƒ - System scores and ranks donors by reliability and distance, creating `MatchResult` records.
â”ƒ - System generates `EMERGENCY_ALERT` notifications for matched donors, respecting `quietHours` and routing rules.
â”ƒ - Donor views alert and submits a `DonorResponse` (accept or decline).
â”ƒ - If accepted, system links a `Slot`, creates an `Appointment` of type `EMERGENCY`, and resets the donor's `consecutiveEmergencyDeclines` counter.
â”ƒ - If declined, system increments the decline counter; if it hits 3 consecutively, system sets `flaggedForManualReview` to true.

**Emergency Escalation & Resolution Flow**
â”ƒ - System monitors the emergency deadline and fulfilled unit count.
â”ƒ - If units are not met within a set timeframe (e.g., 30 mins), system increments `escalationLevel` and widens the `matchRadius`.
â”ƒ - System runs the matching engine again for the new radius, skipping donors with existing `MatchResult`s for this emergency.
â”ƒ - If staff manually fulfills the request or enough appointments are completed, system calls `EmergencyRequest.resolve()`, setting status to `FULFILLED`.
â”ƒ - If the deadline passes without enough units, system automatically sets status to `EXPIRED`.

**Staff No-Show & Penalty Flow**
â”ƒ - If a scheduled appointment time passes without a `checkIn()`, staff marks it as a `NO_SHOW`.
â”ƒ - System detects the `NO_SHOW` status and deducts points from the donor's `reliabilityScore`.

**Center Registration & Admin Approval Flow**
â”ƒ - User with `CENTER_ADMIN` role submits a `DonationCenter` registration, setting status to `PENDING_APPROVAL`.
â”ƒ - Super Admin views pending requests and approves, changing center status to `ACTIVE`.
â”ƒ - Center Admin configures `OperatingHours`, `Slot` generation rules, and adds `CENTER_STAFF` users.

**GDPR Account Deletion Flow**
â”ƒ - Donor requests deletion, creating a `GDPRDeletionRequest` in `IN_PROGRESS`.
â”ƒ - System automatically changes DonorProfile status to `PENDING_DELETION` and sets `User.status` to `PENDING_DELETION`, and logs the actions in `AuditLog`.
â”ƒ - After 30 days, system anonymizes PII in `User` and `DonorProfile`, sets status to `DELETED`, sets `GDPRDeletionRequest` to `COMPLETED`, and logs the actions in `AuditLog`.
â”ƒ - If donor logins again before 30 days, system resets `User.status` to `ACTIVE` and `DonorProfile.status` to `ACTIVE`, sets `GDPRDeletionRequest` to `CANCELLED` , and logs the action in `AuditLog`.

**System Audit & Health Flow**
â”ƒ - Every state-changing action (create, update, delete) across all entities automatically triggers an `AuditLog` entry.
â”ƒ - System aggregates real-time data into `MetricsSnapshot` for dashboard views.
â”ƒ - System runs batch jobs to generate `DemandForecast` records by region and blood type based on historical emergency data.



**Authentication & Session Management Flow**
â”ƒ - If donor logins again before 30 days, system resets `User.status` to `ACTIVE` and `DonorProfile.status` to `ACTIVE`, sets `GDPRDeletionRequest` to `CANCELLED` , and logs the action in `AuditLog`.
â”ƒ - User submits credentials; system verifies against `User.hashedPassword` and checks `User.status` is not `SUSPENDED` nor `DELETED`.
â”ƒ - System creates a `Session`, generates access/refresh tokens, and hashes them before storing.
â”ƒ - User makes requests; system validates `Session.accessTokenHash` and checks `expiresAt`.
â”ƒ - If the access token expires, system validates the `refreshTokenHash` and calls `Session.refresh()`.
â”ƒ - User logs out or system revokes the session, calling `Session.revoke()`.

**Password Reset Flow**
â”ƒ - User requests a password reset; system creates a `PASSWORD_RESET` `VerificationToken` and sends a notification.
â”ƒ - User clicks the secure link; system calls `VerificationToken.validate()` and `consume()`.
â”ƒ - User submits a new password; system updates `User.hashedPassword` and invalidates all existing `Session`s for that user.

**Donor Profile & Settings Update Flow**
â”ƒ - Donor updates personal info, location, or `AvailabilityStatus`; system updates `DonorProfile` and logs old/new values in `AuditLog`.
â”ƒ - Donor updates `NotificationPreferences` (frequency, `QuietHours`, max distance); system saves the JSON preferences, which are subsequently referenced by the notification engine.
â”ƒ - Donor updates their `HealthQuestionnaire`; system saves changes and re-evaluates `permanentlyRestricted` and `profileComplete` flags.

**Donor Dashboard & Impact Flow**
â”ƒ - Donor accesses dashboard; system fetches `DonorProfile.reliabilityScore`, `eligibleFromDate`, and `canDonate()` status.
â”ƒ - System calculates impact metrics (milestones) by querying the donor's `Appointment` history where status is `COMPLETED`.
â”ƒ - Donor requests a certificate; system generates a downloadable document for a specific completed `Appointment`.

**Permanent Health Restriction Flow**
â”ƒ - During onboarding or a `HealthQuestionnaire` update, system detects a disqualifying condition (UCâ€‘SYS11).
â”ƒ - System sets `DonorProfile.permanentlyRestricted` to true, sets `restrictionReason`, and changes `AvailabilityStatus` to `PERMANENTLY_RESTRICTED`.
â”ƒ - System flags the profile for Super Admin review and creates a notification/alert for the admin team.

**Super Admin Override Flow**
â”ƒ - Super Admin reviews the flagged permanent restriction (UCâ€‘SA07) and checks the donor's medical details.
â”ƒ - If deemed safe or in error, Super Admin overrides the restriction, setting `permanentlyRestricted` to false and restoring `AvailabilityStatus`.
â”ƒ - System logs the override action, reason, and actor in the `AuditLog`.

**Appointment Reschedule & Cancellation Flow**
â”ƒ - Donor calls `Appointment.cancel()` or `Appointment.reschedule()`, providing an optional `cancellationReason`.
â”ƒ - System sets `Appointment.status` to `CANCELLED` or `RESCHEDULED`, and records `cancelledAt`.
â”ƒ - System automatically decrements `Slot.bookedCount` (and `regularBookedCount` if applicable), freeing up the capacity (UCâ€‘SYS13).
â”ƒ - If rescheduling, system finds a new available `Slot`, links it to the `Appointment`, and increments the new slot's counts.

**Failed Health Screening Flow**
â”ƒ - During `Appointment.startScreening()`, staff records vitals in `HealthScreening` and marks `eligible` as false.
â”ƒ - System automatically calls `Appointment.cancel()` with the screening failure as the reason.
â”ƒ - System releases the reserved `Slot` capacity and logs the deferral in the `AuditLog`.
â”ƒ - If the condition is temporary, system sets `DonorProfile.eligibleFromDate`; if permanent, triggers the Permanent Health Restriction Flow.

**Emergency Slot Allocation Flow**
â”ƒ - When a donor accepts an emergency (`DonorResponse.accept()`), system searches for an available `Slot` at the requesting `DonationCenter`.
â”ƒ - If no slots are available locally, system searches nearby centers within a reasonable radius.
â”ƒ - System creates the emergency `Appointment`, links the `Slot`, and increments booking counts.
â”ƒ - If absolutely no slots are found, system alerts center staff to manually create capacity or handle the walk-in.

**Emergency Fulfillment Tracking Flow**
â”ƒ - As emergency `Appointment`s are completed, system sums the `mlCollected` from all linked appointments for that `EmergencyRequest`.
â”ƒ - System converts the total milliliters into standard blood units and compares against `unitsNeeded`.
â”ƒ - Once the collected units meet or exceed the target, system automatically triggers `EmergencyRequest.resolve()`, setting status to `FULFILLED`.

**Manual Emergency Management Flow**
â”ƒ - Center staff extends the deadline or widens the radius manually via UCâ€‘CS03; system updates `expiresAt` or `matchRadius` and logs the change.
â”ƒ - Center staff cancels the emergency early (e.g., blood secured from another source); system calls `EmergencyRequest.cancel()`, setting status to `CANCELLED` and invalidating any pending `DonorResponse`s.

**Staff Donor Intake Flow**
â”ƒ - Before screening, staff views the donor's `HealthQuestionnaire`, `DonorProfile.permanentlyRestricted` flag, and `eligibleFromDate` (UCâ€‘CS08).

**Center Admin Ongoing Management Flow**
â”ƒ - Center Admin updates center info, hours, or adds `ClosureWindow`s to `OperatingHours` (UCâ€‘CA03, CA05).
â”ƒ - System automatically blocks or releases `Slot`s that fall within newly added closure windows (UCâ€‘SYS13).
â”ƒ - Center Admin adjusts capacity settings; system regenerates or updates future `Slot` max bookings accordingly (UCâ€‘CA04).
â”ƒ - Center Admin views `AuditLog` filtered by their center's staff to review staff activity (UCâ€‘CA07).

**Super Admin User Management Flow**
â”ƒ - Super Admin searches and filters all `User`s (UCâ€‘SA02).
â”ƒ - Super Admin suspends, activates, or deletes accounts (UCâ€‘SA03), updating `User.status` and revoking active `Session`s.
â”ƒ - Super Admin assigns or revokes `UserRole`s (UCâ€‘SA05), granting or removing access to specific system features.

**Super Admin System Monitoring Flow**
â”ƒ - Super Admin views the system dashboard populated by `MetricsSnapshot` data (UCâ€‘SA10).
â”ƒ - Super Admin monitors API usage, error rates, and service health.
â”ƒ - Super Admin queries and exports `AuditLog` records for compliance (UCâ€‘SA12) and generates platform-wide reports (UCâ€‘SA13).

**Automated Eligibility Restoration Flow**
â”ƒ - A scheduled system job scans for `DonorProfile`s where `eligibleFromDate` has passed.
â”ƒ - System automatically clears the `eligibleFromDate` (or sets it to the past), restoring `canDonate()` to true (UCâ€‘SYS10).
â”ƒ - System sends an `ELIGIBILITY_REMINDER` notification to the donor to schedule a new appointment.
---


Donation backend API:
{"openapi":"3.1.0","info":{"title":"OpenAPI definition","version":"v0"},"servers":[{"url":"http://localhost:8080","description":"Generated server url"}],"paths":{"/api/v1/emergencies/{id}":{"get":{"tags":["emergency-controller"],"operationId":"getById","parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"integer","format":"int64"}}],"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseEmergencyResponse"}}}}}},"put":{"tags":["emergency-controller"],"operationId":"update","parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"integer","format":"int64"}}],"requestBody":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/UpdateEmergencyRequest"}}},"required":true},"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseEmergencyResponse"}}}}}}},"/api/v1/donors/me":{"get":{"tags":["donor-controller"],"operationId":"getMyProfile","responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseDonorProfileResponse"}}}}}},"put":{"tags":["donor-controller"],"operationId":"updateProfile","requestBody":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/UpdateDonorRequest"}}},"required":true},"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseDonorProfileResponse"}}}}}}},"/api/v1/donors/me/notification-prefs":{"put":{"tags":["donor-controller"],"operationId":"updateNotificationPrefs","requestBody":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/UpdateNotificationPrefsRequest"}}},"required":true},"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseDonorProfileResponse"}}}}}}},"/api/v1/donors/me/location":{"put":{"tags":["donor-controller"],"operationId":"updateLocation","requestBody":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/UpdateLocationRequest"}}},"required":true},"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseDonorProfileResponse"}}}}}}},"/api/v1/donors/me/health-questionnaire":{"get":{"tags":["donor-controller"],"operationId":"getHealthQuestionnaire","responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseDonorHealthResponse"}}}}}},"put":{"tags":["donor-controller"],"operationId":"updateHealthQuestionnaire","requestBody":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/HealthQuestionnaireRequest"}}},"required":true},"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseDonorHealthResponse"}}}}}}},"/api/v1/donors/me/blood-type":{"put":{"tags":["donor-controller"],"operationId":"updateBloodType","requestBody":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/UpdateBloodTypeRequest"}}},"required":true},"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseDonorProfileResponse"}}}}}}},"/api/v1/donors/me/availability":{"put":{"tags":["donor-controller"],"operationId":"updateAvailability","requestBody":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/UpdateAvailabilityRequest"}}},"required":true},"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseDonorProfileResponse"}}}}}}},"/api/v1/centers/{id}":{"get":{"tags":["center-controller"],"operationId":"getById_1","parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"integer","format":"int64"}},{"name":"fetchJoins","in":"query","required":false,"schema":{"type":"boolean","default":false}}],"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseCenterResponse"}}}}}},"put":{"tags":["center-controller"],"operationId":"update_1","parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"integer","format":"int64"}}],"requestBody":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/UpdateCenterRequest"}}},"required":true},"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseCenterResponse"}}}}}},"delete":{"tags":["center-controller"],"operationId":"delete","parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"integer","format":"int64"}}],"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseString"}}}}}}},"/api/v1/appointments/{id}/reschedule":{"put":{"tags":["appointment-controller"],"operationId":"reschedule","parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"integer","format":"int64"}}],"requestBody":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/RescheduleAppointmentRequest"}}},"required":true},"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseAppointmentResponse"}}}}}}},"/api/admin/users/{id}":{"get":{"tags":["user-controller"],"operationId":"getDetails","parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"integer","format":"int64"}}],"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseUserDetailResponse"}}}}}},"put":{"tags":["user-controller"],"operationId":"update_2","parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"integer","format":"int64"}}],"requestBody":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/UpdateUserRequest"}}},"required":true},"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseUserDetailResponse"}}}}}},"delete":{"tags":["user-controller"],"operationId":"delete_1","parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"integer","format":"int64"}}],"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseString"}}}}}}},"/api/v1/system/gdpr/{id}/complete":{"post":{"tags":["system-controller"],"operationId":"completeDeletion","parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"integer","format":"int64"}}],"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseGDPRDeletionResponse"}}}}}}},"/api/v1/system/gdpr/{id}/cancel":{"post":{"tags":["system-controller"],"operationId":"cancelDeletion","parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"integer","format":"int64"}}],"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseGDPRDeletionResponse"}}}}}}},"/api/v1/system/gdpr/request":{"post":{"tags":["system-controller"],"operationId":"requestDeletion","requestBody":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/GDPRRequestDeletionRequest"}}},"required":true},"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseGDPRDeletionResponse"}}}}}}},"/api/v1/emergencies":{"get":{"tags":["emergency-controller"],"operationId":"getAll","parameters":[{"name":"page","in":"query","required":false,"schema":{"type":"integer","format":"int32","default":0}},{"name":"size","in":"query","required":false,"schema":{"type":"integer","format":"int32","default":20}}],"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseListEmergencyResponse"}}}}}},"post":{"tags":["emergency-controller"],"operationId":"create","requestBody":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/CreateEmergencyRequest"}}},"required":true},"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseEmergencyResponse"}}}}}}},"/api/v1/emergencies/{id}/cancel":{"post":{"tags":["emergency-controller"],"operationId":"cancel","parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"integer","format":"int64"}}],"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseEmergencyResponse"}}}}}}},"/api/v1/emergencies/{emergencyId}/responses/decline":{"post":{"tags":["emergency-controller"],"operationId":"declineResponse","parameters":[{"name":"emergencyId","in":"path","required":true,"schema":{"type":"integer","format":"int64"}}],"requestBody":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/DeclineResponseRequest"}}},"required":true},"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseDonorResponseDTO"}}}}}}},"/api/v1/emergencies/{emergencyId}/responses/accept":{"post":{"tags":["emergency-controller"],"operationId":"acceptResponse","parameters":[{"name":"emergencyId","in":"path","required":true,"schema":{"type":"integer","format":"int64"}}],"requestBody":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/AcceptResponseRequest"}}},"required":true},"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseDonorResponseDTO"}}}}}}},"/api/v1/centers":{"get":{"tags":["center-controller"],"operationId":"getAll_1","parameters":[{"name":"sortBy","in":"query","required":false,"schema":{"type":"string","default":"id"}},{"name":"sortDirection","in":"query","required":false,"schema":{"type":"string","default":"asc"}},{"name":"page","in":"query","required":false,"schema":{"type":"integer","format":"int32","default":1}},{"name":"size","in":"query","required":false,"schema":{"type":"integer","format":"int32","default":20}},{"name":"search","in":"query","required":false,"schema":{"type":"string"}}],"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseListCenterResponse"}}}}}},"post":{"tags":["center-controller"],"operationId":"create_1","requestBody":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/CreateCenterRequest"}}},"required":true},"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseCenterResponse"}}}}}}},"/api/v1/centers/{id}/staff":{"get":{"tags":["center-controller"],"operationId":"getStaff","parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"integer","format":"int64"}}],"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseListStaffSummaryResponse"}}}}}},"post":{"tags":["center-controller"],"operationId":"addStaff","parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"integer","format":"int64"}}],"requestBody":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/AddStaffRequest"}}},"required":true},"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseStaffSummaryResponse"}}}}}}},"/api/v1/centers/{id}/closures":{"post":{"tags":["center-controller"],"operationId":"addClosure","parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"integer","format":"int64"}}],"requestBody":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/CreateClosureRequest"}}},"required":true},"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseClosureResponse"}}}}}}},"/api/v1/appointments":{"get":{"tags":["appointment-controller"],"operationId":"getAll_2","parameters":[{"name":"page","in":"query","required":false,"schema":{"type":"integer","format":"int32","default":0}},{"name":"size","in":"query","required":false,"schema":{"type":"integer","format":"int32","default":20}}],"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseListAppointmentResponse"}}}}}},"post":{"tags":["appointment-controller"],"operationId":"book","requestBody":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/CreateAppointmentRequest"}}},"required":true},"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseAppointmentResponse"}}}}}}},"/api/v1/appointments/{id}/screening":{"get":{"tags":["appointment-controller"],"operationId":"getScreening","parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"integer","format":"int64"}}],"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseHealthScreeningResponse"}}}}}},"post":{"tags":["appointment-controller"],"operationId":"startScreening","parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"integer","format":"int64"}}],"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseHealthScreeningResponse"}}}}}}},"/api/v1/appointments/{id}/screening-results":{"post":{"tags":["appointment-controller"],"operationId":"saveScreening","parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"integer","format":"int64"}}],"requestBody":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/ScreeningRequest"}}},"required":true},"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseHealthScreeningResponse"}}}}}}},"/api/v1/appointments/{id}/no-show":{"post":{"tags":["appointment-controller"],"operationId":"markNoShow","parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"integer","format":"int64"}}],"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseAppointmentResponse"}}}}}}},"/api/v1/appointments/{id}/complete":{"post":{"tags":["appointment-controller"],"operationId":"complete","parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"integer","format":"int64"}}],"requestBody":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/CompleteAppointmentRequest"}}},"required":true},"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseAppointmentResponse"}}}}}}},"/api/v1/appointments/{id}/check-in":{"post":{"tags":["appointment-controller"],"operationId":"checkIn","parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"integer","format":"int64"}}],"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseAppointmentResponse"}}}}}}},"/api/v1/appointments/{id}/cancel":{"post":{"tags":["appointment-controller"],"operationId":"cancel_1","parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"integer","format":"int64"}}],"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseAppointmentResponse"}}}}}}},"/api/auth/verify-email":{"post":{"tags":["auth-controller"],"operationId":"verifyEmail","requestBody":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/VerifyEmailRequest"}}},"required":true},"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseVerifyEmailResponse"}}}}}}},"/api/auth/signup":{"post":{"tags":["auth-controller"],"operationId":"signup","parameters":[{"name":"User-Agent","in":"header","required":false,"schema":{"type":"string"}},{"name":"X-Forwarded-For","in":"header","required":false,"schema":{"type":"string"}}],"requestBody":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/SignupRequest"}}},"required":true},"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseLoginResponse"}}}}}}},"/api/auth/reset-password":{"post":{"tags":["auth-controller"],"operationId":"resetPassword","requestBody":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/ResetPasswordRequest"}}},"required":true},"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseVoid"}}}}}}},"/api/auth/request-verification":{"post":{"tags":["auth-controller"],"operationId":"requestVerification","responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseVerifyEmailResponse"}}}}}}},"/api/auth/refresh":{"post":{"tags":["auth-controller"],"operationId":"refresh","requestBody":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/RefreshTokenRequest"}}},"required":true},"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseLoginResponse"}}}}}}},"/api/auth/logout":{"post":{"tags":["auth-controller"],"operationId":"logout","parameters":[{"name":"Authorization","in":"header","required":true,"schema":{"type":"string"}}],"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseVoid"}}}}}}},"/api/auth/login":{"post":{"tags":["auth-controller"],"operationId":"login","parameters":[{"name":"User-Agent","in":"header","required":false,"schema":{"type":"string"}},{"name":"X-Forwarded-For","in":"header","required":false,"schema":{"type":"string"}}],"requestBody":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/LoginRequest"}}},"required":true},"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseLoginResponse"}}}}}}},"/api/auth/forgot-password":{"post":{"tags":["auth-controller"],"operationId":"forgotPassword","requestBody":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/ForgotPasswordRequest"}}},"required":true},"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseVoid"}}}}}}},"/api/admin/users":{"get":{"tags":["user-controller"],"operationId":"listAll","parameters":[{"name":"search","in":"query","required":false,"schema":{"type":"string"}},{"name":"sortBy","in":"query","required":false,"schema":{"type":"string","default":"id"}},{"name":"sortDirection","in":"query","required":false,"schema":{"type":"string","default":"asc"}},{"name":"page","in":"query","required":false,"schema":{"type":"integer","format":"int32","default":1}},{"name":"size","in":"query","required":false,"schema":{"type":"integer","format":"int32","default":20}}],"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseListUserDetailResponse"}}}}}},"post":{"tags":["user-controller"],"operationId":"create_2","requestBody":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/CreateUserRequest"}}},"required":true},"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseUserDetailResponse"}}}}}}},"/api/admin/users/{id}/roles":{"post":{"tags":["user-controller"],"operationId":"assignRole","parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"integer","format":"int64"}}],"requestBody":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/AssignRoleRequest"}}},"required":true},"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseVoid"}}}}}},"delete":{"tags":["user-controller"],"operationId":"revokeRole","parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"integer","format":"int64"}}],"requestBody":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/RevokeRoleRequest"}}},"required":true},"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseString"}}}}}}},"/api/v1/donors/{id}/restriction":{"patch":{"tags":["donor-controller"],"operationId":"updateRestriction","parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"integer","format":"int64"}}],"requestBody":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/UpdateRestrictionRequest"}}},"required":true},"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseDonorProfileResponse"}}}}}}},"/api/v1/donors/{id}/flag":{"patch":{"tags":["donor-controller"],"operationId":"updateFlag","parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"integer","format":"int64"}}],"requestBody":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/UpdateFlagRequest"}}},"required":true},"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseDonorProfileResponse"}}}}}}},"/api/v1/centers/{id}/status":{"patch":{"tags":["center-controller"],"operationId":"updateStatus","parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"integer","format":"int64"}}],"requestBody":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/UpdateCenterStatusRequest"}}},"required":true},"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseVoid"}}}}}}},"/api/v1/centers/{id}/slots/{slotId}/block":{"patch":{"tags":["center-controller"],"operationId":"blockSlot","parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"integer","format":"int64"}},{"name":"slotId","in":"path","required":true,"schema":{"type":"integer","format":"int64"}}],"requestBody":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/BlockSlotRequest"}}},"required":true},"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseSlotResponse"}}}}}}},"/api/v1/centers/{id}/approve":{"patch":{"tags":["center-controller"],"operationId":"approve","parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"integer","format":"int64"}}],"requestBody":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/ApproveCenterRequest"}}},"required":true},"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseCenterResponse"}}}}}}},"/api/admin/users/{id}/status":{"patch":{"tags":["user-controller"],"operationId":"updateStatus_1","parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"integer","format":"int64"}}],"requestBody":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/UpdateUserStatusRequest"}}},"required":true},"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseVoid"}}}}}}},"/api/v1/system/gdpr":{"get":{"tags":["system-controller"],"operationId":"getAllDeletionRequests","responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseListGDPRDeletionResponse"}}}}}}},"/api/v1/system/gdpr/{id}":{"get":{"tags":["system-controller"],"operationId":"getDeletionRequest","parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"integer","format":"int64"}}],"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseGDPRDeletionResponse"}}}}}}},"/api/v1/emergencies/{id}/responses":{"get":{"tags":["emergency-controller"],"operationId":"getResponses","parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"integer","format":"int64"}}],"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseListDonorResponseDTO"}}}}}}},"/api/v1/emergencies/responses/donor/{donorId}":{"get":{"tags":["emergency-controller"],"operationId":"getDonorResponses","parameters":[{"name":"donorId","in":"path","required":true,"schema":{"type":"integer","format":"int64"}}],"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseListDonorResponseDTO"}}}}}}},"/api/v1/emergencies/open/{bloodType}":{"get":{"tags":["emergency-controller"],"operationId":"getOpenByBloodType","parameters":[{"name":"bloodType","in":"path","required":true,"schema":{"type":"string","enum":["A_POSITIVE","A_NEGATIVE","B_POSITIVE","B_NEGATIVE","AB_POSITIVE","AB_NEGATIVE","O_POSITIVE","O_NEGATIVE","UNKNOWN"]}}],"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseListEmergencyResponse"}}}}}}},"/api/v1/emergencies/nearby":{"get":{"tags":["emergency-controller"],"operationId":"getNearby","parameters":[{"name":"latitude","in":"query","required":true,"schema":{"type":"number","format":"double"}},{"name":"longitude","in":"query","required":true,"schema":{"type":"number","format":"double"}},{"name":"radiusKm","in":"query","required":false,"schema":{"type":"number","format":"double","default":50.0}}],"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseListEmergencyResponse"}}}}}}},"/api/v1/donors/{id}":{"get":{"tags":["donor-controller"],"operationId":"getDonorById","parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"integer","format":"int64"}}],"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseDonorDetailResponse"}}}}}}},"/api/v1/donors/{id}/eligibility":{"get":{"tags":["donor-controller"],"operationId":"getDonorEligibility","parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"integer","format":"int64"}}],"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseEligibilityDetailResponse"}}}}}}},"/api/v1/donors/me/impact":{"get":{"tags":["donor-controller"],"operationId":"getImpact","responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseImpactResponse"}}}}}}},"/api/v1/donors/me/eligibility":{"get":{"tags":["donor-controller"],"operationId":"getEligibility","responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseEligibilityResponse"}}}}}}},"/api/v1/donors/me/certificates":{"get":{"tags":["donor-controller"],"operationId":"getCertificates","responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseListCertificateResponse"}}}}}}},"/api/v1/donors/me/certificates/{id}/download":{"get":{"tags":["donor-controller"],"operationId":"downloadCertificate","parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"integer","format":"int64"}}],"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"type":"string","format":"byte"}}}}}}},"/api/v1/centers/{id}/slots":{"get":{"tags":["center-controller"],"operationId":"getSlots","parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"integer","format":"int64"}},{"name":"date","in":"query","required":false,"schema":{"type":"string","format":"date"}},{"name":"slotType","in":"query","required":false,"schema":{"type":"string"}},{"name":"fetchJoins","in":"query","required":false,"schema":{"type":"boolean","default":false}}],"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseListSlotResponse"}}}}}}},"/api/v1/centers/{id}/report":{"get":{"tags":["center-controller"],"operationId":"getReport","parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"integer","format":"int64"}},{"name":"startDate","in":"query","required":true,"schema":{"type":"string","format":"date"}},{"name":"endDate","in":"query","required":true,"schema":{"type":"string","format":"date"}}],"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"type":"string","format":"byte"}}}}}}},"/api/v1/centers/pending":{"get":{"tags":["center-controller"],"operationId":"getPending","parameters":[{"name":"sortBy","in":"query","required":false,"schema":{"type":"string","default":"id"}},{"name":"sortDirection","in":"query","required":false,"schema":{"type":"string","default":"asc"}},{"name":"page","in":"query","required":false,"schema":{"type":"integer","format":"int32","default":1}},{"name":"size","in":"query","required":false,"schema":{"type":"integer","format":"int32","default":20}}],"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseListCenterResponse"}}}}}}},"/api/v1/appointments/{id}":{"get":{"tags":["appointment-controller"],"operationId":"getById_2","parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"integer","format":"int64"}}],"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseAppointmentResponse"}}}}}}},"/api/v1/appointments/by-donor/{donorId}":{"get":{"tags":["appointment-controller"],"operationId":"getByDonor","parameters":[{"name":"donorId","in":"path","required":true,"schema":{"type":"integer","format":"int64"}}],"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseListAppointmentResponse"}}}}}}},"/api/v1/appointments/by-center/{centerId}":{"get":{"tags":["appointment-controller"],"operationId":"getByCenterAndDate","parameters":[{"name":"centerId","in":"path","required":true,"schema":{"type":"integer","format":"int64"}},{"name":"date","in":"query","required":true,"schema":{"type":"string","format":"date"}}],"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseListAppointmentResponse"}}}}}}},"/api/v1/analytics/metrics":{"get":{"tags":["analytics-controller"],"operationId":"getMetrics","responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseListMetricsResponse"}}}}}}},"/api/v1/analytics/audit-logs":{"get":{"tags":["analytics-controller"],"operationId":"getAuditLogs","parameters":[{"name":"page","in":"query","required":false,"schema":{"type":"integer","format":"int32","default":0}},{"name":"size","in":"query","required":false,"schema":{"type":"integer","format":"int32","default":20}}],"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseListAuditLogResponse"}}}}}}},"/api/v1/analytics/audit-logs/by-user/{userId}":{"get":{"tags":["analytics-controller"],"operationId":"getByUser","parameters":[{"name":"userId","in":"path","required":true,"schema":{"type":"integer","format":"int64"}}],"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseListAuditLogResponse"}}}}}}},"/api/v1/analytics/audit-logs/by-action/{action}":{"get":{"tags":["analytics-controller"],"operationId":"getByAction","parameters":[{"name":"action","in":"path","required":true,"schema":{"type":"string"}}],"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseListAuditLogResponse"}}}}}}},"/api/internal/users/{id}":{"get":{"tags":["internal-user-controller"],"operationId":"findById","parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"integer","format":"int64"}}],"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseUserSummary"}}}}}}},"/api/internal/users/{id}/roles":{"get":{"tags":["internal-user-controller"],"operationId":"getRoles","parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"integer","format":"int64"}}],"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseListRole"}}}}}}},"/api/internal/users/exists/by-phone":{"get":{"tags":["internal-user-controller"],"operationId":"existsByPhone","parameters":[{"name":"phone","in":"query","required":true,"schema":{"type":"string"}}],"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseBoolean"}}}}}}},"/api/internal/users/exists/by-email":{"get":{"tags":["internal-user-controller"],"operationId":"existsByEmail","parameters":[{"name":"email","in":"query","required":true,"schema":{"type":"string"}}],"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseBoolean"}}}}}}},"/api/internal/users/by-phone":{"get":{"tags":["internal-user-controller"],"operationId":"findByPhone","parameters":[{"name":"phone","in":"query","required":true,"schema":{"type":"string"}}],"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseUserSummary"}}}}}}},"/api/internal/users/by-email":{"get":{"tags":["internal-user-controller"],"operationId":"findByEmail","parameters":[{"name":"email","in":"query","required":true,"schema":{"type":"string"}}],"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseUserSummary"}}}}}}},"/api/v1/centers/{id}/staff/{userId}":{"delete":{"tags":["center-controller"],"operationId":"removeStaff","parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"integer","format":"int64"}},{"name":"userId","in":"path","required":true,"schema":{"type":"integer","format":"int64"}}],"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/ApiResponseString"}}}}}}}},"components":{"schemas":{"UpdateEmergencyRequest":{"type":"object","properties":{"centerId":{"type":"integer","format":"int64"},"bloodType":{"type":"string","enum":["A_POSITIVE","A_NEGATIVE","B_POSITIVE","B_NEGATIVE","AB_POSITIVE","AB_NEGATIVE","O_POSITIVE","O_NEGATIVE","UNKNOWN"]},"unitsNeeded":{"type":"integer","format":"int32"},"urgency":{"type":"string","enum":["CRITICAL","HIGH","MEDIUM","LOW"]},"matchRadius":{"type":"integer","format":"int32"},"contactPhone":{"type":"string"}},"required":["bloodType","centerId","matchRadius","unitsNeeded","urgency"]},"ApiResponseEmergencyResponse":{"type":"object","properties":{"success":{"type":"boolean"},"data":{"$ref":"#/components/schemas/EmergencyResponse"},"page":{"$ref":"#/components/schemas/Paginated"},"message":{"type":"string"},"code":{"type":"string"},"timestamp":{"type":"string","format":"date-time"}}},"EmergencyResponse":{"type":"object","properties":{"id":{"type":"integer","format":"int64"},"centerId":{"type":"integer","format":"int64"},"bloodType":{"type":"string","enum":["A_POSITIVE","A_NEGATIVE","B_POSITIVE","B_NEGATIVE","AB_POSITIVE","AB_NEGATIVE","O_POSITIVE","O_NEGATIVE","UNKNOWN"]},"unitsNeeded":{"type":"integer","format":"int32"},"urgency":{"type":"string","enum":["CRITICAL","HIGH","MEDIUM","LOW"]},"matchRadius":{"type":"integer","format":"int32"},"escalationLevel":{"type":"integer","format":"int32"},"contactPhone":{"type":"string"},"status":{"type":"string","enum":["OPEN","FULFILLED","CANCELLED","EXPIRED"]},"createdAt":{"type":"string","format":"date-time"},"updatedAt":{"type":"string","format":"date-time"},"expiresAt":{"type":"string","format":"date-time"},"resolvedAt":{"type":"string","format":"date-time"},"resolvedByUserId":{"type":"integer","format":"int64"}}},"Paginated":{"type":"object","properties":{"number":{"type":"integer","format":"int32"},"size":{"type":"integer","format":"int32"},"totalElements":{"type":"integer","format":"int64"},"totalPages":{"type":"integer","format":"int32"}}},"UpdateDonorRequest":{"type":"object","properties":{"displayName":{"type":"string"},"phone":{"type":"string"}}},"ApiResponseDonorProfileResponse":{"type":"object","properties":{"success":{"type":"boolean"},"data":{"$ref":"#/components/schemas/DonorProfileResponse"},"page":{"$ref":"#/components/schemas/Paginated"},"message":{"type":"string"},"code":{"type":"string"},"timestamp":{"type":"string","format":"date-time"}}},"DonorProfileResponse":{"type":"object","properties":{"id":{"type":"integer","format":"int64"},"userId":{"type":"integer","format":"int64"},"bloodType":{"type":"string","enum":["A_POSITIVE","A_NEGATIVE","B_POSITIVE","B_NEGATIVE","AB_POSITIVE","AB_NEGATIVE","O_POSITIVE","O_NEGATIVE","UNKNOWN"]},"bloodTypeVerified":{"type":"boolean"},"latitude":{"type":"number","format":"double"},"longitude":{"type":"number","format":"double"},"city":{"type":"string"},"availability":{"type":"string","enum":["AVAILABLE","TEMPORARILY_UNAVAILABLE","VACATION_MODE","PERMANENTLY_RESTRICTED"]},"notificationPreferences":{"$ref":"#/components/schemas/NotificationPreferences"},"permanentlyRestricted":{"type":"boolean"},"restrictionReason":{"type":"string"},"flaggedForManualReview":{"type":"boolean"},"reliabilityScore":{"type":"number","format":"double"},"eligibleFromDate":{"type":"string","format":"date"},"profileComplete":{"type":"boolean"},"totalDonations":{"type":"integer","format":"int32"},"createdAt":{"type":"string","format":"date-time"},"updatedAt":{"type":"string","format":"date-time"}}},"NotificationPreferences":{"type":"object","properties":{"frequency":{"type":"string","enum":["IMMEDIATE","DAILY_DIGEST","EMERGENCY_ONLY","DISABLED"]},"quietHours":{"$ref":"#/components/schemas/QuietHours"},"allowEmergencyNotifications":{"type":"boolean"},"maxNotificationDistanceKm":{"type":"integer","format":"int32"}}},"QuietHours":{"type":"object","properties":{"start":{"type":"string","example":"14:30:00"},"end":{"type":"string","example":"14:30:00"}}},"UpdateNotificationPrefsRequest":{"type":"object","properties":{"preferences":{"$ref":"#/components/schemas/NotificationPreferences"}},"required":["preferences"]},"UpdateLocationRequest":{"type":"object","properties":{"latitude":{"type":"number","format":"double"},"longitude":{"type":"number","format":"double"},"city":{"type":"string"},"country":{"type":"string"}},"required":["latitude","longitude"]},"HealthQuestionnaireRequest":{"type":"object","properties":{"hasChronicIllness":{"type":"boolean"},"medicalConditionsDetails":{"type":"string"},"onMedication":{"type":"boolean"},"medicationDetails":{"type":"string"},"lastSurgeryAt":{"type":"string","format":"date-time"},"lastTravelAt":{"type":"string","format":"date-time"},"lastTattooOrPiercingAt":{"type":"string","format":"date-time"}},"required":["hasChronicIllness","onMedication"]},"ApiResponseDonorHealthResponse":{"type":"object","properties":{"success":{"type":"boolean"},"data":{"$ref":"#/components/schemas/DonorHealthResponse"},"page":{"$ref":"#/components/schemas/Paginated"},"message":{"type":"string"},"code":{"type":"string"},"timestamp":{"type":"string","format":"date-time"}}},"DonorHealthResponse":{"type":"object","properties":{"id":{"type":"integer","format":"int64"},"donorId":{"type":"integer","format":"int64"},"hasChronicIllness":{"type":"boolean"},"medicalConditionsDetails":{"type":"string"},"onMedication":{"type":"boolean"},"medicationDetails":{"type":"string"},"lastSurgeryAt":{"type":"string","format":"date-time"},"lastTravelAt":{"type":"string","format":"date-time"},"lastTattooOrPiercingAt":{"type":"string","format":"date-time"},"createdAt":{"type":"string","format":"date-time"},"updatedAt":{"type":"string","format":"date-time"}}},"UpdateBloodTypeRequest":{"type":"object","properties":{"bloodType":{"type":"string","enum":["A_POSITIVE","A_NEGATIVE","B_POSITIVE","B_NEGATIVE","AB_POSITIVE","AB_NEGATIVE","O_POSITIVE","O_NEGATIVE","UNKNOWN"]}},"required":["bloodType"]},"UpdateAvailabilityRequest":{"type":"object","properties":{"status":{"type":"string","enum":["AVAILABLE","TEMPORARILY_UNAVAILABLE","VACATION_MODE","PERMANENTLY_RESTRICTED"]}},"required":["status"]},"ClosureWindow":{"type":"object","properties":{"date":{"type":"string","format":"date"},"startTime":{"type":"string","example":"14:30:00"},"endTime":{"type":"string","example":"14:30:00"},"allDay":{"type":"boolean"},"reason":{"type":"string"}}},"DaySchedule":{"type":"object","properties":{"opens":{"type":"string","example":"14:30:00"},"closes":{"type":"string","example":"14:30:00"}}},"OperatingHours":{"type":"object","properties":{"monday":{"$ref":"#/components/schemas/DaySchedule"},"tuesday":{"$ref":"#/components/schemas/DaySchedule"},"wednesday":{"$ref":"#/components/schemas/DaySchedule"},"thursday":{"$ref":"#/components/schemas/DaySchedule"},"friday":{"$ref":"#/components/schemas/DaySchedule"},"saturday":{"$ref":"#/components/schemas/DaySchedule"},"sunday":{"$ref":"#/components/schemas/DaySchedule"},"closedWindows":{"type":"array","items":{"$ref":"#/components/schemas/ClosureWindow"}}}},"UpdateCenterRequest":{"type":"object","properties":{"name":{"type":"string","minLength":1},"address":{"type":"string","minLength":1},"city":{"type":"string","minLength":1},"country":{"type":"string","minLength":1},"postalCode":{"type":"string"},"phone":{"type":"string","minLength":1},"email":{"type":"string","minLength":1},"latitude":{"type":"number","format":"double"},"longitude":{"type":"number","format":"double"},"facilityType":{"type":"string","enum":["BLOOD_BANK","HOSPITAL","CLINIC","MOBILE_UNIT","COMMUNITY_CENTER"]},"operatingHours":{"$ref":"#/components/schemas/OperatingHours"},"totalCapacity":{"type":"integer","format":"int32"},"maxRegular":{"type":"integer","format":"int32"},"slotPeriod":{"type":"integer","format":"int32"}},"required":["facilityType","latitude","longitude","maxRegular","operatingHours","slotPeriod","totalCapacity"]},"ApiResponseCenterResponse":{"type":"object","properties":{"success":{"type":"boolean"},"data":{"$ref":"#/components/schemas/CenterResponse"},"page":{"$ref":"#/components/schemas/Paginated"},"message":{"type":"string"},"code":{"type":"string"},"timestamp":{"type":"string","format":"date-time"}}},"CenterResponse":{"type":"object","properties":{"id":{"type":"integer","format":"int64"},"name":{"type":"string"},"address":{"type":"string"},"city":{"type":"string"},"country":{"type":"string"},"postalCode":{"type":"string"},"phone":{"type":"string"},"email":{"type":"string"},"latitude":{"type":"number","format":"double"},"longitude":{"type":"number","format":"double"},"facilityType":{"type":"string","enum":["BLOOD_BANK","HOSPITAL","CLINIC","MOBILE_UNIT","COMMUNITY_CENTER"]},"operatingHours":{"$ref":"#/components/schemas/OperatingHours"},"status":{"type":"string","enum":["PENDING_APPROVAL","ACTIVE","SUSPENDED","CLOSED"]},"totalCapacity":{"type":"integer","format":"int32"},"maxRegular":{"type":"integer","format":"int32"},"slotPeriod":{"type":"integer","format":"int32"},"createdAt":{"type":"string","format":"date-time"},"updatedAt":{"type":"string","format":"date-time"}}},"RescheduleAppointmentRequest":{"type":"object","properties":{"slotId":{"type":"integer","format":"int64"}},"required":["slotId"]},"ApiResponseAppointmentResponse":{"type":"object","properties":{"success":{"type":"boolean"},"data":{"$ref":"#/components/schemas/AppointmentResponse"},"page":{"$ref":"#/components/schemas/Paginated"},"message":{"type":"string"},"code":{"type":"string"},"timestamp":{"type":"string","format":"date-time"}}},"AppointmentResponse":{"type":"object","properties":{"id":{"type":"integer","format":"int64"},"donorId":{"type":"integer","format":"int64"},"slotId":{"type":"integer","format":"int64"},"centerId":{"type":"integer","format":"int64"},"emergencyId":{"type":"integer","format":"int64"},"completedByStaffId":{"type":"integer","format":"int64"},"appointmentType":{"type":"string","enum":["REGULAR","EMERGENCY"]},"status":{"type":"string","enum":["SCHEDULED","CHECKED_IN","IN_SCREENING","COMPLETED","CANCELLED","NO_SHOW","RESCHEDULED"]},"bloodType":{"type":"string","enum":["A_POSITIVE","A_NEGATIVE","B_POSITIVE","B_NEGATIVE","AB_POSITIVE","AB_NEGATIVE","O_POSITIVE","O_NEGATIVE","UNKNOWN"]},"outcome":{"type":"string","enum":["COMPLETED","CANCELLED"]},"mlCollected":{"type":"integer","format":"int32"},"qrCode":{"type":"string"},"checkedInAt":{"type":"string","format":"date-time"},"startedAt":{"type":"string","format":"date-time"},"completedAt":{"type":"string","format":"date-time"},"cancelledAt":{"type":"string","format":"date-time"},"cancellationReason":{"type":"string"},"notes":{"type":"string"},"createdAt":{"type":"string","format":"date-time"},"updatedAt":{"type":"string","format":"date-time"}}},"UpdateUserRequest":{"type":"object","properties":{"email":{"type":"string","minLength":1},"phone":{"type":"string","minLength":1},"displayName":{"type":"string","minLength":1}}},"ApiResponseUserDetailResponse":{"type":"object","properties":{"success":{"type":"boolean"},"data":{"$ref":"#/components/schemas/UserDetailResponse"},"page":{"$ref":"#/components/schemas/Paginated"},"message":{"type":"string"},"code":{"type":"string"},"timestamp":{"type":"string","format":"date-time"}}},"UserDetailResponse":{"type":"object","properties":{"id":{"type":"integer","format":"int64"},"email":{"type":"string"},"phone":{"type":"string"},"displayName":{"type":"string"},"status":{"type":"string","enum":["ACTIVE","INACTIVE","SUSPENDED","PENDING_VERIFICATION","PENDING_DELETION","DELETED"]},"emailVerified":{"type":"boolean"},"roles":{"type":"array","items":{"type":"string","enum":["SUPER_ADMIN","CENTER_ADMIN","CENTER_STAFF","DONOR"]}},"createdAt":{"type":"string","format":"date-time"},"deletionRequestedAt":{"type":"string","format":"date-time"},"deletedAt":{"type":"string","format":"date-time"},"lastActiveAt":{"type":"string","format":"date-time"}}},"ApiResponseGDPRDeletionResponse":{"type":"object","properties":{"success":{"type":"boolean"},"data":{"$ref":"#/components/schemas/GDPRDeletionResponse"},"page":{"$ref":"#/components/schemas/Paginated"},"message":{"type":"string"},"code":{"type":"string"},"timestamp":{"type":"string","format":"date-time"}}},"GDPRDeletionResponse":{"type":"object","properties":{"id":{"type":"integer","format":"int64"},"userId":{"type":"integer","format":"int64"},"reason":{"type":"string"},"status":{"type":"string","enum":["IN_PROGRESS","CANCELED","COMPLETED"]},"requestedAt":{"type":"string","format":"date-time"},"processedAt":{"type":"string","format":"date-time"}}},"GDPRRequestDeletionRequest":{"type":"object","properties":{"userId":{"type":"integer","format":"int64"},"reason":{"type":"string"}},"required":["userId"]},"CreateEmergencyRequest":{"type":"object","properties":{"centerId":{"type":"integer","format":"int64"},"bloodType":{"type":"string","enum":["A_POSITIVE","A_NEGATIVE","B_POSITIVE","B_NEGATIVE","AB_POSITIVE","AB_NEGATIVE","O_POSITIVE","O_NEGATIVE","UNKNOWN"]},"unitsNeeded":{"type":"integer","format":"int32"},"urgency":{"type":"string","enum":["CRITICAL","HIGH","MEDIUM","LOW"]},"matchRadius":{"type":"integer","format":"int32"},"contactPhone":{"type":"string"}},"required":["bloodType","centerId","matchRadius","unitsNeeded","urgency"]},"DeclineResponseRequest":{"type":"object","properties":{"reason":{"type":"string"}}},"ApiResponseDonorResponseDTO":{"type":"object","properties":{"success":{"type":"boolean"},"data":{"$ref":"#/components/schemas/DonorResponseDTO"},"page":{"$ref":"#/components/schemas/Paginated"},"message":{"type":"string"},"code":{"type":"string"},"timestamp":{"type":"string","format":"date-time"}}},"DonorResponseDTO":{"type":"object","properties":{"id":{"type":"integer","format":"int64"},"emergencyId":{"type":"integer","format":"int64"},"donorId":{"type":"integer","format":"int64"},"slotId":{"type":"integer","format":"int64"},"status":{"type":"string","enum":["ACCEPTED","DECLINED"]},"respondedAt":{"type":"string","format":"date-time"}}},"AcceptResponseRequest":{"type":"object","properties":{"slotId":{"type":"integer","format":"int64"}},"required":["slotId"]},"CreateCenterRequest":{"type":"object","properties":{"name":{"type":"string","minLength":1},"address":{"type":"string","minLength":1},"city":{"type":"string","minLength":1},"country":{"type":"string","minLength":1},"postalCode":{"type":"string"},"phone":{"type":"string","minLength":1},"email":{"type":"string","minLength":1},"latitude":{"type":"number","format":"double"},"longitude":{"type":"number","format":"double"},"facilityType":{"type":"string","enum":["BLOOD_BANK","HOSPITAL","CLINIC","MOBILE_UNIT","COMMUNITY_CENTER"]},"operatingHours":{"$ref":"#/components/schemas/OperatingHours"},"totalCapacity":{"type":"integer","format":"int32"},"maxRegular":{"type":"integer","format":"int32"},"slotPeriod":{"type":"integer","format":"int32"}},"required":["facilityType","latitude","longitude","maxRegular","operatingHours","slotPeriod","totalCapacity"]},"AddStaffRequest":{"type":"object","properties":{"userId":{"type":"integer","format":"int64"}},"required":["userId"]},"ApiResponseStaffSummaryResponse":{"type":"object","properties":{"success":{"type":"boolean"},"data":{"$ref":"#/components/schemas/StaffSummaryResponse"},"page":{"$ref":"#/components/schemas/Paginated"},"message":{"type":"string"},"code":{"type":"string"},"timestamp":{"type":"string","format":"date-time"}}},"StaffSummaryResponse":{"type":"object","properties":{"id":{"type":"integer","format":"int64"},"userId":{"type":"integer","format":"int64"},"centerId":{"type":"integer","format":"int64"},"verified":{"type":"boolean"},"createdAt":{"type":"string","format":"date-time"}}},"CreateClosureRequest":{"type":"object","properties":{"date":{"type":"string","format":"date"},"startTime":{"type":"string"},"endTime":{"type":"string"},"allDay":{"type":"boolean"},"reason":{"type":"string","minLength":1}},"required":["date"]},"ApiResponseClosureResponse":{"type":"object","properties":{"success":{"type":"boolean"},"data":{"$ref":"#/components/schemas/ClosureResponse"},"page":{"$ref":"#/components/schemas/Paginated"},"message":{"type":"string"},"code":{"type":"string"},"timestamp":{"type":"string","format":"date-time"}}},"ClosureResponse":{"type":"object","properties":{"blockedSlotCount":{"type":"integer","format":"int32"},"date":{"type":"string","format":"date"},"reason":{"type":"string"}}},"CreateAppointmentRequest":{"type":"object","properties":{"type":{"type":"string","enum":["REGULAR","EMERGENCY"]},"donorId":{"type":"integer","format":"int64"},"slotId":{"type":"integer","format":"int64"},"emergencyId":{"type":"integer","format":"int64"}},"required":["donorId","slotId","type"]},"ApiResponseHealthScreeningResponse":{"type":"object","properties":{"success":{"type":"boolean"},"data":{"$ref":"#/components/schemas/HealthScreeningResponse"},"page":{"$ref":"#/components/schemas/Paginated"},"message":{"type":"string"},"code":{"type":"string"},"timestamp":{"type":"string","format":"date-time"}}},"HealthScreeningResponse":{"type":"object","properties":{"id":{"type":"integer","format":"int64"},"appointmentId":{"type":"integer","format":"int64"},"donorId":{"type":"integer","format":"int64"},"screenedByStaffId":{"type":"integer","format":"int64"},"weight":{"type":"number","format":"double"},"bloodPressure":{"type":"string"},"hemoglobin":{"type":"number","format":"double"},"temperature":{"type":"number","format":"double"},"eligible":{"type":"boolean"},"notes":{"type":"string"},"screenedAt":{"type":"string","format":"date-time"}}},"ScreeningRequest":{"type":"object","properties":{"weight":{"type":"number","format":"double"},"bloodPressure":{"type":"string"},"hemoglobin":{"type":"number","format":"double"},"temperature":{"type":"number","format":"double"},"eligible":{"type":"boolean"},"notes":{"type":"string"}},"required":["eligible","hemoglobin","temperature","weight"]},"CompleteAppointmentRequest":{"type":"object","properties":{"outcome":{"type":"string"},"notes":{"type":"string"}},"required":["outcome"]},"VerifyEmailRequest":{"type":"object","properties":{"token":{"type":"string","minLength":1}}},"ApiResponseVerifyEmailResponse":{"type":"object","properties":{"success":{"type":"boolean"},"data":{"$ref":"#/components/schemas/VerifyEmailResponse"},"page":{"$ref":"#/components/schemas/Paginated"},"message":{"type":"string"},"code":{"type":"string"},"timestamp":{"type":"string","format":"date-time"}}},"VerifyEmailResponse":{"type":"object","properties":{"message":{"type":"string"}}},"SignupRequest":{"type":"object","properties":{"email":{"type":"string","minLength":1},"phone":{"type":"string"},"password":{"type":"string","maxLength":2147483647,"minLength":8},"firstName":{"type":"string","minLength":1},"familyName":{"type":"string","minLength":1},"displayName":{"type":"string"}}},"ApiResponseLoginResponse":{"type":"object","properties":{"success":{"type":"boolean"},"data":{"$ref":"#/components/schemas/LoginResponse"},"page":{"$ref":"#/components/schemas/Paginated"},"message":{"type":"string"},"code":{"type":"string"},"timestamp":{"type":"string","format":"date-time"}}},"LoginResponse":{"type":"object","properties":{"token":{"type":"string"},"tokenType":{"type":"string"},"refreshToken":{"type":"string"},"userId":{"type":"integer","format":"int64"},"email":{"type":"string"},"displayName":{"type":"string"},"roles":{"type":"array","items":{"type":"string","enum":["SUPER_ADMIN","CENTER_ADMIN","CENTER_STAFF","DONOR"]}}}},"ResetPasswordRequest":{"type":"object","properties":{"token":{"type":"string","minLength":1},"newPassword":{"type":"string","maxLength":2147483647,"minLength":8}}},"ApiResponseVoid":{"type":"object","properties":{"success":{"type":"boolean"},"data":{"type":"object"},"page":{"$ref":"#/components/schemas/Paginated"},"message":{"type":"string"},"code":{"type":"string"},"timestamp":{"type":"string","format":"date-time"}}},"RefreshTokenRequest":{"type":"object","properties":{"refreshToken":{"type":"string","minLength":1}}},"LoginRequest":{"type":"object","properties":{"email":{"type":"string","minLength":1},"password":{"type":"string","minLength":1}}},"ForgotPasswordRequest":{"type":"object","properties":{"email":{"type":"string","minLength":1}}},"CreateUserRequest":{"type":"object","properties":{"email":{"type":"string","minLength":1},"phone":{"type":"string","minLength":1},"password":{"type":"string","maxLength":2147483647,"minLength":8},"firstName":{"type":"string","minLength":1},"familyName":{"type":"string","minLength":1},"displayName":{"type":"string"}}},"AssignRoleRequest":{"type":"object","properties":{"role":{"type":"string","enum":["SUPER_ADMIN","CENTER_ADMIN","CENTER_STAFF","DONOR"]}},"required":["role"]},"UpdateRestrictionRequest":{"type":"object","properties":{"permanentlyRestricted":{"type":"boolean"},"restrictionReason":{"type":"string"}},"required":["permanentlyRestricted"]},"UpdateFlagRequest":{"type":"object","properties":{"flaggedForManualReview":{"type":"boolean"}},"required":["flaggedForManualReview"]},"UpdateCenterStatusRequest":{"type":"object","properties":{"status":{"type":"string","enum":["PENDING_APPROVAL","ACTIVE","SUSPENDED","CLOSED"]}},"required":["status"]},"BlockSlotRequest":{"type":"object","properties":{"isBlocked":{"type":"boolean"}},"required":["isBlocked"]},"ApiResponseSlotResponse":{"type":"object","properties":{"success":{"type":"boolean"},"data":{"$ref":"#/components/schemas/SlotResponse"},"page":{"$ref":"#/components/schemas/Paginated"},"message":{"type":"string"},"code":{"type":"string"},"timestamp":{"type":"string","format":"date-time"}}},"SlotResponse":{"type":"object","properties":{"id":{"type":"integer","format":"int64"},"centerId":{"type":"integer","format":"int64"},"date":{"type":"string","format":"date"},"startTime":{"type":"string","example":"14:30:00"},"endTime":{"type":"string","example":"14:30:00"},"maxBookings":{"type":"integer","format":"int32"},"maxRegularBookings":{"type":"integer","format":"int32"},"bookedCount":{"type":"integer","format":"int32"},"regularBookedCount":{"type":"integer","format":"int32"},"isBlocked":{"type":"boolean"}}},"ApproveCenterRequest":{"type":"object","properties":{"approved":{"type":"boolean"},"reason":{"type":"string"}},"required":["approved"]},"UpdateUserStatusRequest":{"type":"object","properties":{"status":{"type":"string","enum":["ACTIVE","INACTIVE","SUSPENDED","PENDING_VERIFICATION","PENDING_DELETION","DELETED"]}},"required":["status"]},"ApiResponseListGDPRDeletionResponse":{"type":"object","properties":{"success":{"type":"boolean"},"data":{"type":"array","items":{"$ref":"#/components/schemas/GDPRDeletionResponse"}},"page":{"$ref":"#/components/schemas/Paginated"},"message":{"type":"string"},"code":{"type":"string"},"timestamp":{"type":"string","format":"date-time"}}},"ApiResponseListEmergencyResponse":{"type":"object","properties":{"success":{"type":"boolean"},"data":{"type":"array","items":{"$ref":"#/components/schemas/EmergencyResponse"}},"page":{"$ref":"#/components/schemas/Paginated"},"message":{"type":"string"},"code":{"type":"string"},"timestamp":{"type":"string","format":"date-time"}}},"ApiResponseListDonorResponseDTO":{"type":"object","properties":{"success":{"type":"boolean"},"data":{"type":"array","items":{"$ref":"#/components/schemas/DonorResponseDTO"}},"page":{"$ref":"#/components/schemas/Paginated"},"message":{"type":"string"},"code":{"type":"string"},"timestamp":{"type":"string","format":"date-time"}}},"ApiResponseDonorDetailResponse":{"type":"object","properties":{"success":{"type":"boolean"},"data":{"$ref":"#/components/schemas/DonorDetailResponse"},"page":{"$ref":"#/components/schemas/Paginated"},"message":{"type":"string"},"code":{"type":"string"},"timestamp":{"type":"string","format":"date-time"}}},"DonorDetailResponse":{"type":"object","properties":{"id":{"type":"integer","format":"int64"},"userId":{"type":"integer","format":"int64"},"bloodType":{"type":"string","enum":["A_POSITIVE","A_NEGATIVE","B_POSITIVE","B_NEGATIVE","AB_POSITIVE","AB_NEGATIVE","O_POSITIVE","O_NEGATIVE","UNKNOWN"]},"bloodTypeVerified":{"type":"boolean"},"latitude":{"type":"number","format":"double"},"longitude":{"type":"number","format":"double"},"city":{"type":"string"},"availability":{"type":"string","enum":["AVAILABLE","TEMPORARILY_UNAVAILABLE","VACATION_MODE","PERMANENTLY_RESTRICTED"]},"notificationPreferences":{"$ref":"#/components/schemas/NotificationPreferences"},"permanentlyRestricted":{"type":"boolean"},"restrictionReason":{"type":"string"},"flaggedForManualReview":{"type":"boolean"},"reliabilityScore":{"type":"number","format":"double"},"eligibleFromDate":{"type":"string","format":"date"},"profileComplete":{"type":"boolean"},"totalDonations":{"type":"integer","format":"int32"},"healthQuestionnaire":{"$ref":"#/components/schemas/DonorHealthResponse"},"createdAt":{"type":"string","format":"date-time"},"updatedAt":{"type":"string","format":"date-time"}}},"ApiResponseEligibilityDetailResponse":{"type":"object","properties":{"success":{"type":"boolean"},"data":{"$ref":"#/components/schemas/EligibilityDetailResponse"},"page":{"$ref":"#/components/schemas/Paginated"},"message":{"type":"string"},"code":{"type":"string"},"timestamp":{"type":"string","format":"date-time"}}},"EligibilityDetailResponse":{"type":"object","properties":{"eligible":{"type":"boolean"},"eligibleFromDate":{"type":"string","format":"date"},"permanentlyRestricted":{"type":"boolean"},"reason":{"type":"string"}}},"ApiResponseImpactResponse":{"type":"object","properties":{"success":{"type":"boolean"},"data":{"$ref":"#/components/schemas/ImpactResponse"},"page":{"$ref":"#/components/schemas/Paginated"},"message":{"type":"string"},"code":{"type":"string"},"timestamp":{"type":"string","format":"date-time"}}},"ImpactResponse":{"type":"object","properties":{"totalDonations":{"type":"integer","format":"int32"},"milestones":{"type":"array","items":{"type":"string"}}}},"ApiResponseEligibilityResponse":{"type":"object","properties":{"success":{"type":"boolean"},"data":{"$ref":"#/components/schemas/EligibilityResponse"},"page":{"$ref":"#/components/schemas/Paginated"},"message":{"type":"string"},"code":{"type":"string"},"timestamp":{"type":"string","format":"date-time"}}},"EligibilityResponse":{"type":"object","properties":{"eligible":{"type":"boolean"},"eligibleFromDate":{"type":"string","format":"date"},"reason":{"type":"string"}}},"ApiResponseListCertificateResponse":{"type":"object","properties":{"success":{"type":"boolean"},"data":{"type":"array","items":{"$ref":"#/components/schemas/CertificateResponse"}},"page":{"$ref":"#/components/schemas/Paginated"},"message":{"type":"string"},"code":{"type":"string"},"timestamp":{"type":"string","format":"date-time"}}},"CertificateResponse":{"type":"object","properties":{"id":{"type":"integer","format":"int64"},"appointmentId":{"type":"integer","format":"int64"},"donorName":{"type":"string"},"centerName":{"type":"string"},"mlCollected":{"type":"integer","format":"int32"},"donationDate":{"type":"string","format":"date"},"downloadUrl":{"type":"string"}}},"ApiResponseListCenterResponse":{"type":"object","properties":{"success":{"type":"boolean"},"data":{"type":"array","items":{"$ref":"#/components/schemas/CenterResponse"}},"page":{"$ref":"#/components/schemas/Paginated"},"message":{"type":"string"},"code":{"type":"string"},"timestamp":{"type":"string","format":"date-time"}}},"ApiResponseListStaffSummaryResponse":{"type":"object","properties":{"success":{"type":"boolean"},"data":{"type":"array","items":{"$ref":"#/components/schemas/StaffSummaryResponse"}},"page":{"$ref":"#/components/schemas/Paginated"},"message":{"type":"string"},"code":{"type":"string"},"timestamp":{"type":"string","format":"date-time"}}},"ApiResponseListSlotResponse":{"type":"object","properties":{"success":{"type":"boolean"},"data":{"type":"array","items":{"$ref":"#/components/schemas/SlotResponse"}},"page":{"$ref":"#/components/schemas/Paginated"},"message":{"type":"string"},"code":{"type":"string"},"timestamp":{"type":"string","format":"date-time"}}},"ApiResponseListAppointmentResponse":{"type":"object","properties":{"success":{"type":"boolean"},"data":{"type":"array","items":{"$ref":"#/components/schemas/AppointmentResponse"}},"page":{"$ref":"#/components/schemas/Paginated"},"message":{"type":"string"},"code":{"type":"string"},"timestamp":{"type":"string","format":"date-time"}}},"ApiResponseListMetricsResponse":{"type":"object","properties":{"success":{"type":"boolean"},"data":{"type":"array","items":{"$ref":"#/components/schemas/MetricsResponse"}},"page":{"$ref":"#/components/schemas/Paginated"},"message":{"type":"string"},"code":{"type":"string"},"timestamp":{"type":"string","format":"date-time"}}},"MetricsResponse":{"type":"object","properties":{"metricName":{"type":"string"},"total":{"type":"integer","format":"int64"},"today":{"type":"integer","format":"int64"},"thisWeek":{"type":"integer","format":"int64"},"thisMonth":{"type":"integer","format":"int64"}}},"ApiResponseListAuditLogResponse":{"type":"object","properties":{"success":{"type":"boolean"},"data":{"type":"array","items":{"$ref":"#/components/schemas/AuditLogResponse"}},"page":{"$ref":"#/components/schemas/Paginated"},"message":{"type":"string"},"code":{"type":"string"},"timestamp":{"type":"string","format":"date-time"}}},"AuditLogResponse":{"type":"object","properties":{"id":{"type":"integer","format":"int64"},"userId":{"type":"integer","format":"int64"},"action":{"type":"string"},"entityType":{"type":"string"},"entityId":{"type":"integer","format":"int64"},"oldValue":{"type":"object","additionalProperties":{"type":"object"}},"newValue":{"type":"object","additionalProperties":{"type":"object"}},"ipAddress":{"type":"string"},"timestamp":{"type":"string","format":"date-time"}}},"ApiResponseUserSummary":{"type":"object","properties":{"success":{"type":"boolean"},"data":{"$ref":"#/components/schemas/UserSummary"},"page":{"$ref":"#/components/schemas/Paginated"},"message":{"type":"string"},"code":{"type":"string"},"timestamp":{"type":"string","format":"date-time"}}},"UserSummary":{"type":"object","properties":{"id":{"type":"integer","format":"int64"},"email":{"type":"string"},"phone":{"type":"string"},"displayName":{"type":"string"},"status":{"type":"string","enum":["ACTIVE","INACTIVE","SUSPENDED","PENDING_VERIFICATION","PENDING_DELETION","DELETED"]}}},"ApiResponseListRole":{"type":"object","properties":{"success":{"type":"boolean"},"data":{"type":"array","items":{"type":"string","enum":["SUPER_ADMIN","CENTER_ADMIN","CENTER_STAFF","DONOR"]}},"page":{"$ref":"#/components/schemas/Paginated"},"message":{"type":"string"},"code":{"type":"string"},"timestamp":{"type":"string","format":"date-time"}}},"ApiResponseBoolean":{"type":"object","properties":{"success":{"type":"boolean"},"data":{"type":"boolean"},"page":{"$ref":"#/components/schemas/Paginated"},"message":{"type":"string"},"code":{"type":"string"},"timestamp":{"type":"string","format":"date-time"}}},"ApiResponseListUserDetailResponse":{"type":"object","properties":{"success":{"type":"boolean"},"data":{"type":"array","items":{"$ref":"#/components/schemas/UserDetailResponse"}},"page":{"$ref":"#/components/schemas/Paginated"},"message":{"type":"string"},"code":{"type":"string"},"timestamp":{"type":"string","format":"date-time"}}},"ApiResponseString":{"type":"object","properties":{"success":{"type":"boolean"},"data":{"type":"string"},"page":{"$ref":"#/components/schemas/Paginated"},"message":{"type":"string"},"code":{"type":"string"},"timestamp":{"type":"string","format":"date-time"}}},"RevokeRoleRequest":{"type":"object","properties":{"role":{"type":"string","enum":["SUPER_ADMIN","CENTER_ADMIN","CENTER_STAFF","DONOR"]}},"required":["role"]}}}}



Notification backend API:

{"openapi":"3.1.0","info":{"title":"Qatra Notification Service API","description":"Internal and external APIs for the Qatra notification microservice","contact":{"name":"Qatra Team"},"version":"1.0.0"},"servers":[{"url":"/","description":"Default server URL"}],"tags":[{"name":"Internal Notification API","description":"Endpoints for nginx / inter-service communication"}],"paths":{"/api/v1/notifications/{id}/read":{"patch":{"tags":["notification-controller"],"operationId":"markAsRead","parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"integer","format":"int64"}}],"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/NotificationResponse"}}}}}}},"/api/v1/notifications/read-all":{"patch":{"tags":["notification-controller"],"operationId":"markAllAsRead","responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"type":"object","additionalProperties":{"type":"integer","format":"int32"}}}}}}}},"/api/v1/notifications/internal/{id}/read":{"patch":{"tags":["Internal Notification API"],"summary":"Mark a specific notification as read","operationId":"markAsRead_1","parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"integer","format":"int64"}},{"name":"userId","in":"query","required":true,"schema":{"type":"integer","format":"int64"}}],"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"$ref":"#/components/schemas/NotificationResponse"}}}}}}},"/api/v1/notifications/internal/user/{userId}/read-all":{"patch":{"tags":["Internal Notification API"],"summary":"Mark all notifications as read for a user","operationId":"markAllAsRead_1","parameters":[{"name":"userId","in":"path","required":true,"schema":{"type":"integer","format":"int64"}}],"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"type":"object","additionalProperties":{"type":"integer","format":"int32"}}}}}}}},"/api/v1/notifications":{"get":{"tags":["notification-controller"],"operationId":"listNotifications","parameters":[{"name":"type","in":"query","required":false,"schema":{"type":"string"}},{"name":"read","in":"query","required":false,"schema":{"type":"boolean"}},{"name":"page","in":"query","required":false,"schema":{"type":"integer","format":"int32","default":0}},{"name":"size","in":"query","required":false,"schema":{"type":"integer","format":"int32","default":20}}],"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"type":"object","additionalProperties":{"type":"object"}}}}}}}},"/api/v1/notifications/unread-count":{"get":{"tags":["notification-controller"],"operationId":"unreadCount","responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"type":"object","additionalProperties":{"type":"integer","format":"int64"}}}}}}}},"/api/v1/notifications/internal/user/{userId}":{"get":{"tags":["Internal Notification API"],"summary":"Get notifications for a specific user","operationId":"listNotifications_1","parameters":[{"name":"userId","in":"path","required":true,"schema":{"type":"integer","format":"int64"}},{"name":"type","in":"query","required":false,"schema":{"type":"string"}},{"name":"read","in":"query","required":false,"schema":{"type":"boolean"}},{"name":"page","in":"query","required":false,"schema":{"type":"integer","format":"int32","default":0}},{"name":"size","in":"query","required":false,"schema":{"type":"integer","format":"int32","default":20}}],"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"type":"object","additionalProperties":{"type":"object"}}}}}}}},"/api/v1/notifications/internal/user/{userId}/unread-count":{"get":{"tags":["Internal Notification API"],"summary":"Get unread notification count for a user","operationId":"unreadCount_1","parameters":[{"name":"userId","in":"path","required":true,"schema":{"type":"integer","format":"int64"}}],"responses":{"200":{"description":"OK","content":{"*/*":{"schema":{"type":"object","additionalProperties":{"type":"integer","format":"int64"}}}}}}}}},"components":{"schemas":{"NotificationResponse":{"type":"object","properties":{"id":{"type":"integer","format":"int64"},"userId":{"type":"integer","format":"int64"},"emergencyId":{"type":"integer","format":"int64"},"appointmentId":{"type":"integer","format":"int64"},"type":{"type":"string","enum":["EMERGENCY_ALERT","APPOINTMENT_REMINDER","ELIGIBILITY_REMINDER","EMAIL_VERIFICATION","PASSWORD_RESET","GENERAL"]},"channel":{"type":"string","enum":["IN_APP","PUSH","EMAIL"]},"title":{"type":"string"},"body":{"type":"string"},"data":{"type":"object","additionalProperties":{"type":"object"}},"status":{"type":"string"},"createdAt":{"type":"string","format":"date-time"},"sentAt":{"type":"string","format":"date-time"},"readAt":{"type":"string","format":"date-time"}}}}}}



Nginx:
## Nginx Routing Overview

| Nginx Path | Upstream Service | Port | Description |
|------------|-----------------|------|-------------|
| `GET /` | — | — | Redirects (302) to `/health` |
| `/health` | donation-service | 8080 | Proxied to `/actuator/health` |
| `/api/v1/notifications/**` | notification-service | 8082 | Notification REST API (matched first) |
| `/ws/**` | notification-service | 8082 | WebSocket (STOMP/SockJS), `ws/` prefix stripped |
| `/ws/notifications/info` | notification-service | 8082 | SockJS info/iframe endpoint |
| `/api/**` (everything else) | donation-service | 8080 | All other REST APIs |





## REST Endpoints — notification-service

### User Notifications — `/api/v1/notifications`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/v1/notifications` | Authenticated | List notifications for authenticated user (filtered by type/read, paginated) |
| PATCH | `/api/v1/notifications/{id}/read` | Authenticated | Mark a specific notification as read |
| PATCH | `/api/v1/notifications/read-all` | Authenticated | Mark all notifications as read |
| GET | `/api/v1/notifications/unread-count` | Authenticated | Get count of unread notifications |

### Internal Notifications — `/api/v1/notifications/internal`

> Requires `SUPER_ADMIN` or `CENTER_ADMIN` role.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/notifications/internal/user/{userId}` | Get notifications for a specific user |
| GET | `/api/v1/notifications/internal/user/{userId}/unread-count` | Get unread count for a specific user |
| PATCH | `/api/v1/notifications/internal/{id}/read` | Mark a notification as read (by id + userId param) |
| PATCH | `/api/v1/notifications/internal/user/{userId}/read-all` | Mark all notifications as read for a specific user |

---

## WebSocket — notification-service

### Connection

| Setting | Value |
|---------|-------|
| Protocol | STOMP over SockJS |
| Endpoint | `ws://<host>/ws/notifications` |
| SockJS Fallback | Enabled |
| Allowed Origins | Configurable (`websocket.allowed-origins`), defaults to `*` |

### Message Broker

| Prefix | Description |
|--------|-------------|
| `/topic` | Broadcast topic prefix |
| `/queue` | Point-to-point queue prefix |
| `/app` | Application (client-to-server) destination prefix |
| `/user` | User-specific destination prefix |

### Server Push (no client-to-server messages)

The backend pushes notifications to individual users via `SimpMessagingTemplate`:

| Direction | Destination | Payload |
|-----------|-------------|---------|
| Server → Client | `/user/{userId}/queue/notifications` | Notification JSON object |



