# BRD — **madarik** (Single-Company Real Estate Platform)

*(V1: bilingual AR/EN, map-centric listings, invite-only staff. No AI yet.)*

## 0) Summary

madarik is a modern, bilingual (Arabic/English) real-estate website managed by a **single company**. Internal staff (roles: **Admin**, **Manager**) create and publish listings; visitors browse, filter, view on a map, and submit lead forms. There is **no public signup**. Admins are seeded in the database and can invite additional staff. V1 is intentionally focused and lean.

---

## 1) Goals & Scope

**Goals**

* Simple, reliable flow for staff to create quality listings (with AR/EN content).
* Fast search with powerful but **not overwhelming** filters plus an interactive map.
* Clean, responsive, accessible, and bilingual UI (RTL/LTR).
* Basic lead capture and staff assignment.

**Out of Scope (V1)**

* AI features, user-to-user chat, online payments/escrow, viewing appointments, mortgages, complex analytics/CRM, multi-tenant companies, public user accounts.

---

## 2) Users & Roles

* **Visitor/Buyer** (no login): browse, filter, view details, submit lead. (Optional: local “saved” listings in browser only.)
* **Manager** (internal staff): everything related to listings and leads (create/edit/publish/unpublish/delete; assign leads; manage amenities; edit site settings). **Cannot invite users**.
* **Admin** (internal staff): **everything a Manager can do + invite/manage users** (invite admins/managers, activate/deactivate, reset roles).

**Permissions Matrix (V1)**

| Capability                            | Visitor/Buyer | Manager | Admin |
| ------------------------------------- | ------------- | ------- | ----- |
| Browse & filter listings              | ✅             | ✅       | ✅     |
| View details & submit lead            | ✅             | ✅       | ✅     |
| Local “saved” (guest, localStorage)   | ✅             | ✅       | ✅     |
| Create/Edit/Delete listings           | ❌             | ✅       | ✅     |
| Publish/Unpublish listings            | ❌             | ✅       | ✅     |
| Manage media & amenities              | ❌             | ✅       | ✅     |
| View/assign/export leads              | ❌             | ✅       | ✅     |
| Edit site/company settings            | ❌             | ✅       | ✅     |
| Invite/deactivate users, change roles | ❌             | ❌       | ✅     |

---

## 3) Key User Journeys (Happy Paths)

1. **Admin seeding**: An Admin user exists in DB. Admin logs in → invites staff by email with role (Admin/Manager).
2. **Invite acceptance**: Invitee opens token link → sets password → logs in.
3. **Create listing**: Staff adds base data (price/specs/location), uploads photos, and provides **both AR & EN translations** (title, description, localized display address and slug).
4. **Publish**: Staff marks “Ready to publish” → (Manager/Admin) publishes.
5. **Buyer discovery**: Visitor applies filters, pans/zooms map, opens listing page, reviews images/specs, submits lead.
6. **Lead handling**: Team receives email + in-app lead record; (Manager/Admin) assigns lead to a staffer and may export CSV.

---

## 4) Functional Requirements

### 4.1 Authentication & Staff Management

* **Invite-only** access: no public registration.
* Email/password auth with email verification; password reset.
* Roles: **ADMIN**, **MANAGER**. Admin can invite, deactivate/reactivate, and change roles.
* Secure sessions (httpOnly cookies), logout, idle timeout.

**Acceptance**

* No access to admin console without verified email.
* First Admin seeded directly in DB.
* Invites expire after 7 days; single-use tokens.

### 4.2 Site Settings (Single Company)

* Editable company/site profile: site name (EN/AR), logo, public email/phone, website, country/city.
* Settings power the public footer/header, meta defaults, and lead notification emails (default recipients, CC list).

**Acceptance**

* Changes reflect on public pages instantly on next render.
* At least one notification email required.

### 4.3 Listings (Data & Lifecycle)

**Data Model (language-neutral core)**

* Status: **Draft → ReadyToPublish → Published → Archived**.
* Type: For **Sale** / **Rent**.
* Property type (finite list), price (+ currency), area value/unit, bedrooms, bathrooms, parking, year built.
* Location: address line, city, (optional) neighborhood code, country, **lat/lng** (geocoded), zoom hint.
* Media: up to 20 photos; primary photo; optional video URL.
* Amenities: multi-select from a fixed taxonomy (admin/staff can toggle active labels).

**Per-locale translations (required for Publish)**

* **English & Arabic**: title, description, localized display address, **slug** (unique per locale).

**Lifecycle Rules**

* Any staff can move Draft → ReadyToPublish.
* **Publish/Unpublish**: Manager/Admin can publish/unpublish.
* Editing **price or address** on a Published listing returns it to **ReadyToPublish** until re-published.
* Deleting a listing removes media and associations.

**Acceptance**

* Cannot mark ReadyToPublish without valid geocoding and at least 1 photo.
* **Cannot Publish unless both EN & AR translations exist and pass validation**.
* All status changes recorded with actor and timestamp.

### 4.4 Search, Filters & Sorting

* **Search box**: free-text (title/description) in the **current UI language**, with optional cross-locale fallback.
* **Filters** (combinable): location (Country→City→Neighborhood), price min/max, bedrooms min, bathrooms min, property type, listing type (sale/rent), area min/max, amenities, freshness (Last 7/30 days).
* **Sorting**: Relevance, Newest, Price ↑/↓, Area ↑/↓.
* **Map sync**: “Search this area” re-queries by bounds; results update (debounced).

**Acceptance**

* Clear filter chips; remove chip updates results immediately.
* Typical queries return within 500 ms at baseline scale.
* Result count visibly updates; pagination or infinite scroll.

### 4.5 Map Experience

* Provider: Google Maps **or** MapLibre/Mapbox-GL + OSM.
* Marker clustering when zoomed out; price badges on pins; list↔map hover/click highlight; “Locate me”.

**Acceptance**

* Smooth pan/zoom (target 60fps on modern devices).
* Keyboard focusable pins; accessible equivalent via list.

### 4.6 Listing Details Page

* Large gallery with lightbox.
* Specs chips (price, beds, baths, area, type).
* Localized address with mini-map; “Open in Maps”.
* Company card (from Site Settings).
* **Contact form** (lead capture).
* Related listings (same area/type).

**Acceptance**

* Core content renders ≤ 1s on broadband.
* Structured data (`schema.org`) for SEO.

### 4.7 Lead Capture & Assignment

* Form: name, email, phone (optional), message, consent checkbox.
* On submit: store lead, send notification email(s) (from Site Settings), show confirmation.
* Staff can view, search, and **assign** leads to a user; export CSV.

**Acceptance**

* Anti-spam: honeypot + CAPTCHA + rate-limit (e.g., 3/IP/listing/24h).
* Lead list sortable by date, assigned user; CSV export includes listing, timestamp, contact fields, and message.

### 4.8 Guest “Saved Listings” (Optional, Lightweight)

* Visitors can mark/unmark favorites; stored in localStorage.
* Prompt to keep on this device (no account).

**Acceptance**

* Optimistic UI; badge on cards; simple Saved page reading from localStorage.

### 4.9 Admin Console / Staff Console

* **Dashboard**: counts (Draft/Ready/Published/Archived), recent leads, quick links.
* **Listings**: table with filters; bulk actions (publish/unpublish/archive); edit pages.
* **Media**: manager for upload/reorder/primary selection; server-side optimization.
* **Amenities**: enable/disable labels, reorder groups.
* **Leads**: list, detail, assign, export.
* **Users** (Admins only): list users, invite, resend/revoke, deactivate/reactivate, role changes.
* **Settings**: site/company profile, email recipients, map provider keys.

---

## 5) Localization (Arabic & English)

* Full AR/EN coverage: UI, validation errors, transactional emails, console.
* **RTL for Arabic**, **LTR for English**; layout mirroring and bidi-safe components.
* Language switcher in header; preference persisted per device.

**SEO & URLs**

* Locale subpaths: `/ar/...` and `/en/...`.
* `hreflang` tags on indexable pages.
* Localized slugs per listing; uniqueness within locale.

**Formatting**

* Locale-aware numbers, dates, currency. Western digits acceptable in V1 for simplicity.

**Acceptance**

* All critical flows tested end-to-end in AR & EN.
* No bidi layout defects (forms, breadcrumbs, map controls, chips, tables).

---

## 6) Non-Functional Requirements (NFR)

**Performance**

* FCP ≤ 2s (4G); TTI ≤ 5s.
* Search/filter responses < 500 ms at \~5k listings and \~50 concurrent users.

**Security & Privacy**

* OWASP Top 10 mitigations; CSRF; input validation/sanitization; TLS.
* Password hashing (argon2/bcrypt); secure cookies; role-based access checks on every route/API.
* PII minimization; privacy policy & cookie consent.

**Availability & Reliability**

* 99.5% monthly uptime target (V1).
* Daily DB backups; 7-day point-in-time recovery.

**Accessibility**

* WCAG 2.1 AA for contrast and keyboard navigation.
* Screen-reader labels; focus states visible; map alternatives via list.

**SEO**

* SSR or static pre-render for public pages.
* XML sitemaps (by locale), Open Graph/Twitter, schema.org.

**Scalability Path (post-V1)**

* Dedicated search (Algolia/Elasticsearch) for >50k listings.
* Image CDN and responsive variants; optional PostGIS for geo.

---

## 7) UI/UX Requirements

**Design**

* Modern, clean, responsive; light theme; rounded corners; soft shadows; generous whitespace.
* AR/EN typography tuned for readability; consistent tokens (colors, spacing, radii).

**Screens**

1. **Home/Search**: sticky search bar; filters (drawer on mobile); list+map split; sort; result count; clear-all; language switcher.
2. **Listing Details**: gallery, specs grid, localized address + mini-map, company card, contact form, related listings.
3. **Staff Console**:

   * Dashboard: KPIs, quick actions.
   * Listings: table, bulk actions, status filters, create/edit wizard (3–4 steps).
   * Media manager: reorder, primary.
   * Leads: list/assign/export.
   * Amenities: toggle labels.
   * Users (Admins only): invites & roles.
   * Settings: site/company, email recipients, map keys.

**Micro-interactions**

* Skeleton loaders, optimistic updates, toasts; accessible dialogs; confirm destructive actions.

---

## 8) High-Level Data Model

* **User**: `id, email, password_hash, role (ADMIN/MANAGER), is_active, preferred_locale, created_at, last_login_at`
* **UserInvite**: `id, email, invited_role, inviter_user_id, status, token, expires_at, accepted_at, accepted_user_id`
* **SiteSetting**: `site_name_en, site_name_ar, logo_url, public_email, public_phone, website, country, city, email_recipients`
* **Listing**: `id, status, property_type, listing_type, price, currency, area_value/unit, bedrooms, bathrooms, parking, year_built, address_line, city, neighborhood_code?, country, lat, lng, zoom_hint, primary_photo_url, published_at, created_by_user_id, last_edited_by_user_id`
* **ListingTranslation**: `id, listing_id, locale (EN/AR), title, description, display_address_line?, area_name?, slug`
* **MediaAsset**: `id, listing_id, type (photo/video), url, sort_order`
* **Amenity**: `id, key, label_en, label_ar, active`
* **ListingAmenity**: `(listing_id, amenity_id)`
* **Lead**: `id, listing_id, name, email, phone?, message?, consent, source?, ip_address?, user_agent?, created_at, assigned_to_user_id?`
* **ListingStatusLog**: `id, listing_id, from_status?, to_status, actor_user_id?, reason?, created_at`
* **ListingMetrics**: `listing_id, view_count, leads_count, last_viewed_at`
* **EmailVerificationToken / PasswordResetToken**: invite acceptance & recovery.

*(A full Prisma schema matching this BRD is ready—ask if you want it regenerated after any tweaks.)*

---

## 9) Integrations

* **Map & Geocoding**: Google Maps Platform or MapLibre/Mapbox-GL + a geocoder; one stack selected at deploy time.
* **Email**: transactional provider for invites, verifications, and lead notifications.
* **Spam Protection**: reCAPTCHA/hCaptcha + server-side rate limits.
* **Images**: server-side optimization, WebP, responsive sizes; optional CDN.

---

## 10) Analytics & Metrics (Light)

* Page views (search, details), listing views (counter).
* Leads created (by listing), conversion path (search → detail → lead).
* RUM: performance timings and error rates.

---

## 11) Acceptance Criteria (Selected)

**Auth & Users**

* Only Admins can access the **Users** section and send invites.
* Invite tokens are single-use and expire after 7 days.

**Listings**

* Required to mark **ReadyToPublish**: valid geocode, at least 1 photo, key specs filled.
* Required to **Publish**: both EN & AR translations, unique slugs per locale.
* Editing price/address on a Published listing sets status to ReadyToPublish.

**Search & Filters**

* Filters combine with AND logic; removing any chip updates results immediately.
* “Search this area” limits to current map bounds and re-queries.

**Map**

* Cluster markers at zoomed-out levels; pins display price badges.
* Hovering a list card highlights the corresponding map pin and vice-versa.

**Leads**

* Valid submission stores a lead and sends notification emails.
* Rate-limit: max 3 leads per IP per listing per 24h; CAPTCHA after first.

**Localization**

* All public and console flows verified in AR & EN; RTL/LTR render correctly.
* `hreflang` and locale subpaths present for indexable pages.

---

## 12) Risks & Mitigations

* **Spam leads** → CAPTCHA + rate limits + email throttle.
* **SEO duplicate content (two locales)** → locale-scoped slugs + `hreflang`.
* **Data quality** → required geocoding, photo validation, publish guard.
* **Performance under load** → image optimization, query indexes, planned search/ CDN upgrade path.

---

## 13) Release Scope

**V1 (Must-have)**

* Invite-only auth (seeded Admin, invites, reset, verification)
* Site Settings (single company info)
* Listings CRUD with media, amenities, geocoding
* **AR/EN translations** with publish guard
* Search + filters + sorting + map (clustering, bounds search)
* Listing details with gallery and lead form
* Leads list, assignment, CSV export
* Bilingual public site & console; SEO/accessibility/performance baselines

**V1.1 (Nice-to-have)**

* City/area autocomplete; optional radius filter
* Draw-area map search
* Bulk media uploader with drag-sort
* Simple content pages (About/Contact) managed in console
* Basic dashboards (views/leads trends)

---

## 14) Open Questions

* Should **Managers** be allowed to invite **Managers** (only) via a configurable toggle, or keep invites **Admin-only**?
* Single currency vs. multi-currency at launch?
* Phone masking / click-to-reveal on listing pages to reduce spam?
* Do we need IP/location-based lead fraud signals (score) in V1?

---

## 15) Definition of Done (V1)

* All acceptance criteria pass in staging and production parity.
* Lighthouse: Performance ≥ 80, Accessibility ≥ 90, Best Practices ≥ 90, SEO ≥ 90 on public pages.
* Admin can invite; staff can create/publish listings; visitors can search, view, and submit leads.
* Backups configured; error monitoring and uptime alerts active; restore drill performed.

---

If you want, I can align this BRD with your exact **map stack**, **email provider**, and **currency/region** assumptions, and regenerate the matching **Prisma schema** or API contracts.
