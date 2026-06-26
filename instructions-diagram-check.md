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

UC-D18 View impact dashboard (lives saved, milestones)

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

UC-D28 Check in at donation center (QR scan → staff views appointment details, or staff selects from list)

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

UC-CS12 Send message to donor (instructions, follow-up)

3. CENTER ADMIN
Authentication
UC-CA01 Login, logout & reset password

Center Management
UC-CA02 Submit center registration request (approved by super admin)

UC-CA03 Update center info (address, hours, contact)

UC-CA04 Configure capacity & appointment slots

UC-CA05 Set special closures & operating hour exceptions

Staff Management
UC-CA06 Add or remove center staff

UC-CA07 View staff activity log

Reporting & Oversight
UC-CA08 View daily & weekly schedule (oversight)

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

System Configuration
UC-SA08 Configure global settings (cooldown, radius, urgency levels)

UC-SA09 Manage feature flags

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
UC-SYS12 Adjust reliability score (0–100) on donation completed, no-show, or repeated emergency declines while available

Three consecutive declines with no accept in between → soft flag for manual review

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
+String phone
+String hashedPassword
+String displayName
+String firstName
+String familyName
+UserStatus status
+Boolean emailVerified
+Instant deletedAt
+Instant createdAt
+Instant lastActiveAt
+verifyEmail()
}

    class UserStatus {
	    ACTIVE
	    INACTIVE
	    SUSPENDED
	    PENDING_VERIFICATION
	    DELETED
    }

    class UserRole {
	    +Long id
	    +Long userId
	    +Role role
	    +Instant assignedAt
    }

    class Role {
	    SYSTEM_ADMIN
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
	    EMAIL_VERIFICATION
	    PASSWORD_RESET
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
	    +String userAgent
	    +Instant timestamp
    }

    class SystemConfig {
	    +Long id
	    +String configKey
	    +JSON configValue
	    +String description
	    +Boolean isActive
	    +Instant updatedAt
	    +Long updatedByUserId
    }

    class FeatureFlag {
	    +Long id
	    +String featureName
	    +Boolean enabled
	    +JSON rules
	    +Instant updatedAt
    }

    class DonorProfile {
	    +Long id
	    +Long userId
	    +BloodType bloodType
	    +AvailabilityStatus availability
	    +Double latitude
	    +Double longitude
	    +String city
	    +String country
	    +JSON notificationPreferences
	    +Integer maxNotificationDistance
	    +NotificationFrequency notificationFrequency
	    +Boolean allowEmergencyNotifications
	    +LocalDate lastDonationDate
	    +LocalDate eligibleFromDate
	    +Double reliabilityScore
	    +Boolean permanentlyRestricted
	    +String restrictionReason
	    +Boolean profileComplete
	    +Boolean bloodTypeVerified
	    +Boolean flaggedForManualReview
	    +Integer consecutiveEmergencyDeclines
	    +Instant createdAt
	    +Instant updatedAt
	    +Instant lastAcceptAt
	    +canDonate()
	    +calculateEligibility()
	    +updateLocation()
		+resetConsecutiveDeclinesOnAccept()
    }

    class BloodType {
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

    class AvailabilityStatus {
	    AVAILABLE
	    TEMPORARILY_UNAVAILABLE
	    VACATION_MODE
	    PERMANENTLY_RESTRICTED
    }

    class NotificationFrequency {
	    IMMEDIATE
	    DAILY_DIGEST
	    EMERGENCY_ONLY
	    DISABLED
    }

    class HealthQuestionnaire {
	    +Long id
	    +Long donorId
	    +Boolean hasChronicIllness
	    +Boolean onMedication
	    +Boolean recentSurgery
	    +Boolean recentTravel
	    +Boolean recentTattooOrPiercing
	    +Instant completedAt
	    +Instant updatedAt
    }

    class CenterStaffProfile {
	    +Long id
	    +Long userId
	    +Long centerId
	    +Boolean isVerified
	    +Instant createdAt
    }

    class CenterAdminProfile {
	    +Long id
	    +Long userId
	    +Long centerId
	    +Instant createdAt
    }

    class BloodDonationCenter {
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
	    +JSON operatingHours
		+Integer totalCapacity
		+Integer maxRegular
		+Integer slotPeriod
	    +FacilityType facilityType
	    +CenterStatus status
	    +Instant createdAt
	    +isOperatingNow()
	    +getAvailableSlots()
    }

    class CenterStatus {
	    PENDING_APPROVAL
	    ACTIVE
	    SUSPENDED
	    CLOSED
    }

    class FacilityType {
	    HOSPITAL
	    BLOOD_BANK
	    MOBILE_UNIT
	    COMMUNITY_CENTER
	    DEDICATED_CENTER
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
	    +isAvailable()
    }
    class Appointment {
	    +Long id
	    +Long donorId
	    +Long centerId
	    +Long emergencyId
	    +Long slotId
	    +AppointmentStatus status
	    +AppointmentType appointmentType
	    +BloodType bloodType
	    +Integer mlCollected
	    +String notes
	    +String cancellationReason
	    +String qrCode
	    +Long completedByStaffId
	    +Instant createdAt
	    +Instant checkedInAt
	    +Instant completedAt
	    +Instant cancelledAt
	    +confirm()
	    +complete()
	    +cancel()
	    +reschedule()
    }

    class AppointmentStatus {
	    SCHEDULED
	    CONFIRMED
	    CHECKED_IN
	    COMPLETED
	    CANCELLED
	    NO_SHOW
	    RESCHEDULED
    }

    class AppointmentType {
	    REGULAR
	    EMERGENCY
    }

    class HealthScreening {
	    +Long id
	    +Long appointmentId
	    +Long donorId
	    +Long   screenedByStaffId
	    +Double temperatureCelsius
	    +Double hemoglobinGdL
	    +String bloodPressure
	    +Integer pulse
	    +Boolean medicalCheckPassed
	    +String notes
	    +Instant screenedAt
    }

    class Emergency {
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
	    +Instant neededBy
	    +Instant createdAt
	    +Instant resolvedAt
	    +Long resolvedByUserId
	    +matchDonors()
	    +updateStatus()
	    +resolve()
    }
	class MatchResult {
	    +Long id
	    +Long emergencyId
		+Long centerId
	    +Long donorId
		+Long radius
		+BloodType bloodType
		+Integer escalationLevel 
	    +Instant createdAt
    }

    class EmergencyUrgency {
	    CRITICAL
	    URGENT
	    MODERATE
    }

    class EmergencyStatus {
	    OPEN
	    NOTIFYING
	    IN_PROGRESS
	    RESOLVED
	    CANCELLED
	    EXPIRED
    }

    class EmergencyResponse {
	    +Long id
	    +Long emergencyId
	    +Long donorId
	    +ResponseType responseType
	    +String message
	    +Instant notifiedAt
	    +Instant respondedAt
    }

    class ResponseType {
	    WILLING
	    DECLINED
	    CONVERTED_TO_APPOINTMENT
	    NO_RESPONSE
    }

    class NotificationType {
	    EMERGENCY_ALERT
	    APPOINTMENT_REMINDER
	    ELIGIBILITY_REMINDER
	    PROFILE_COMPLETION
	    STAFF_MESSAGE
	    GENERAL
    }

    class NotificationChannel {
	    PUSH
	    SMS
	    EMAIL
	    IN_APP
    }

    class NotificationStatus {
	    PENDING
	    SENT
	    DELIVERED
	    READ
	    FAILED
    }

    class DataDeletionRequest {
	    +Long id
	    +Long requestedByUserId
	    +Long processedByUserId
	    +DeletionStatus status
	    +String reason
	    +Instant requestedAt
	    +Instant processedAt
    }

    class DeletionStatus {
	    PENDING
	    APPROVED
	    COMPLETED
	    REJECTED
    }

    class DemandForecast {
	    +Long id
	    +BloodType bloodType
	    +String region
	    +Integer forecastedUnits
	    +LocalDate forecastDate
	    +LocalDate validUntil
	    +Integer basedOnEmergencyCount
	    +Instant generatedAt
    }

    class SystemMetric {
	    +Long id
	    +String metricName
	    +Double metricValue
	    +JSON dimensions
	    +Instant timestamp
    }

 	class Notification {
	    +Long id
	    +Long userId
	    +Long emergencyId
	    +Long appointmentId
	    +NotificationType type
	    +String title
	    +String body
	    +JSON data
	    +NotificationChannel channel
	    +NotificationStatus status
	    +Instant createdAt
	    +Instant sentAt
	    +Instant readAt
	    +send()
	    +markAsRead()
    }

	<<enumeration>> UserStatus
	<<enumeration>> Role
	<<enumeration>> VerificationTokenType
	<<enumeration>> BloodType
	<<enumeration>> AvailabilityStatus
	<<enumeration>> NotificationFrequency
	<<enumeration>> CenterStatus
	<<enumeration>> FacilityType
	<<enumeration>> AppointmentStatus
	<<enumeration>> AppointmentType
	<<enumeration>> EmergencyUrgency
	<<enumeration>> EmergencyStatus
	<<enumeration>> ResponseType
	<<enumeration>> NotificationType
	<<enumeration>> NotificationChannel
	<<enumeration>> NotificationStatus
	<<enumeration>> DeletionStatus

    User "1" -- "*" Session : has
    User "1" -- "*" VerificationToken : has
    User "1" -- "*" UserRole : has
    User "1" -- "*" AuditLog : generates
    User "1" *-- "0..1" DonorProfile : has
    User "1" *-- "0..1" CenterStaffProfile : has
    User "1" *-- "0..1" CenterAdminProfile : has
    User "1" -- "0..1" DataDeletionRequest : requests
    User "1" -- "*" Notification : receives
    DonorProfile "1" *-- "0..1" HealthQuestionnaire : has
    DonorProfile "1" -- "*" Appointment : makes
    DonorProfile "1" -- "*" EmergencyResponse : sends
    CenterStaffProfile "*" -- "1" BloodDonationCenter : belongs to
    CenterStaffProfile "1" -- "*" Emergency : creates
    CenterStaffProfile "1" -- "*" Appointment : manages
    CenterStaffProfile "1" -- "*" HealthScreening : performs
    CenterAdminProfile "*" -- "1" BloodDonationCenter : manages
    BloodDonationCenter "1" -- "*" Emergency : handles
    BloodDonationCenter "1" -- "*" Slot : offers
    Slot "1" -- "*" Appointment : fills
    Appointment "1" -- "0..1" HealthScreening : has
    Emergency "0..1" -- "*" Notification : triggers
    Emergency "0..1" -- "*" Appointment : results in
    Emergency "1" *-- "*" MatchResult : triggers
````