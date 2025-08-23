# BRD — **madarik** (Real Estate Listings Platform)

*(Revised: no Admin role; roles are Visitor/Buyer, Company Member, Company Owner; bilingual AR/EN; company/team selling)*

## 0) Summary

madarik is a modern, map-centric real estate web app. A **Company Owner** creates a company, invites **Company Members**, and the team publishes listings. **Visitors/Buyers** browse with powerful but simple filters and an interactive map, then contact the company. V1 is lean: accounts, company/team, listing creation, **owner-controlled publishing** (no platform admin), robust search & filters, map, listing details, and lead capture. (No AI in this version.)

**Languages:** Full **Arabic (RTL)** and **English (LTR)**.

---

## 1) Purpose & Goals

* Company-centric selling with simple team workflows.
* Fast, intuitive search + filters + interactive map.
* Clean, responsive, bilingual UI.

**Out of scope (V1):** in-app chat, payments/escrow, appointments/tours, AI, complex analytics/CRM, custom taxonomies.

---

## 2) Roles & Permissions

### Roles

* **Visitor/Buyer**: browse, filter, view, contact, save favorites (when logged in).
* **Company Member**: create/edit listings for their company, view leads.
* **Company Owner**: create company, invite/remove members, manage company profile, **publish/unpublish listings**, view/export leads.

### Permissions Matrix

| Capability                         | Visitor/Buyer      | Company Member | Company Owner |
| ---------------------------------- | ------------------ | -------------- | ------------- |
| Browse & filter                    | ✅                  | ✅              | ✅             |
| View details & submit lead         | ✅                  | ✅              | ✅             |
| Save favorites                     | ✅ (when logged in) | ✅              | ✅             |
| Create company                     | ❌                  | ❌              | ✅             |
| Invite/remove members              | ❌                  | ❌              | ✅             |
| Create/edit listings (own company) | ❌                  | ✅              | ✅             |
| Submit listing "ready to publish"  | ❌                  | ✅              | ✅             |
| Publish/unpublish listings         | ❌                  | ❌              | ✅             |
| View leads (own company)           | ❌                  | ✅              | ✅             |
| Export leads (CSV)                 | ❌                  | ❌              | ✅             |

---

## 3) Core Use Cases (Happy Paths)

1. **Company onboarding**: User signs up → selects "Become a seller" → creates **Company** (name, logo, country/city, contact) → lands in Company Dashboard.
2. **Invite team**: Owner sends invites by email → members accept → gain Member role.
3. **Create listing**: Member (or Owner) enters details + photos + address → geocoded → **marks "Ready to publish."**
4. **Owner publishing**: Owner reviews "Ready" listings → publishes → listing appears in public search immediately.
5. **Buyer discovery**: Visitor filters & moves the map → opens details → submits lead to the company.
6. **Lead handling**: Company receives email + dashboard record; Owner can export CSV.

---

## 4) Functional Requirements

### 4.1 Auth & Accounts

* Email/password, email verification, password reset.
* Secure sessions (httpOnly cookies), logout, idle timeout.
* Role determined by company ownership/membership.

**Acceptance**

* Unverified users cannot create companies or publish listings.
* Passwords hashed (argon2/bcrypt).

### 4.2 Company & Team

* **Create Company (required to sell):** name, logo, country, city, public email/phone, website (optional).
* **Invites:** Owner invites via email; pending until accepted (7-day expiry).
* **Manage Members:** Owner can resend, revoke pending, remove members.
* **Public Company Card:** shown on listing details (logo, name, city, contact).

**Acceptance**

* Invite links are single-use; acceptance binds user to the company.
* Exactly one **Owner** per company in V1; all others are **Members**.

### 4.3 Listings (Data Model & Rules)

* **Ownership:** `company_id` is required.
* **Status:** Draft → ReadyToPublish → Published → (optional) Archived.
* **Basics:** title, description (limited rich text), property type, listing type (Sale/Rent).
* **Location:** address fields + `lat/lng` from geocoding.
* **Pricing & Specs:** price, currency, area (value/unit), bedrooms, bathrooms, parking (opt), year built (opt).
* **Amenities/Tags:** multi-select from a **fixed system list** (no in-app editing in V1).
* **Media:** up to 20 photos (JPG/PNG/WebP), primary photo; optional video URL.
* **Contact:** defaults to company contact; optional per-listing override.

**Acceptance**

* Valid geocoded coordinates required to mark **ReadyToPublish**.
* Images validated (type/size) and optimized (responsive sizes, WebP).

### 4.4 Listing Lifecycle

* **Draft** (Member/Owner working) → **ReadyToPublish** (Member/Owner marks) → **Published** (Owner publishes) → **Archived** (Owner unpublishes).
* Editing sensitive fields (price/address) on Published returns it to **ReadyToPublish** until Owner republishes.

**Acceptance**

* Only **Published** listings are visible publicly.
* Simple audit log of status changes (who/when/what).

### 4.5 Search, Filters & Sorting

* **Search box**: free-text across title, description, city/area, tags.
* **Filters** (combinable): Location (Country→City→Area), Price min/max, Bedrooms min, Bathrooms min, Property type, Listing type, Area min/max, Amenities, Freshness (Last 7/30 days).
* **Sorting**: Relevance, Newest, Price ↑/↓, Area ↑/↓.
* **Map sync**: "Search this area" by current map bounds; debounced updates.

**Acceptance**

* Filter chips visible/removable; results refresh < 500 ms for typical loads.
* Pagination or infinite scroll; total result count shown.

### 4.6 Map Experience

* Provider: Google Maps **or** MapLibre/Mapbox-GL + OSM (configurable).
* Marker clustering; pin price badges; list↔map hover/click highlight; "Locate me".

**Acceptance**

* Smooth pan/zoom; accessible alternatives via the list view.

### 4.7 Listing Details

* Photo gallery (lightbox), key spec chips, address mini-map with "Open in Maps".
* Company card + **Contact company** form.
* Related listings (same area/type).

**Acceptance**

* Core content within 1s on broadband.
* schema.org structured data for SEO.

### 4.8 Lead Capture

* Form: name, email, phone (opt), message, consent checkbox.
* Stores lead (listing\_id, company\_id, contact info, message, timestamp) and emails company; buyer sees confirmation.
* Company Dashboard lists leads; **Owner can export CSV**.

**Acceptance**

* Spam protection: honeypot + CAPTCHA + rate-limit (e.g., 3/IP/listing/24h).

### 4.9 Favorites (small, optional)

* Logged-in buyers can save/unsave listings; favorites page.
* Guest localStorage with prompt to sign in for sync.

---

## 5) Localization: Arabic & English

### 5.1 Languages & Layout

* Full AR/EN coverage (UI text, validation, emails, dashboards).
* **RTL for Arabic**, **LTR for English**; automatic layout mirroring.
* **Language switcher** in header; preference persisted.

### 5.2 SEO & Formatting

* Locale subpaths: `/ar/...` and `/en/...`.
* `hreflang` tags, translated meta/OG tags.
* Locale-aware numbers, dates, currency (Western digits acceptable in V1 for simplicity).

**Acceptance**

* Critical flows tested end-to-end in both languages.
* No bidi layout issues (forms, breadcrumbs, map controls, price chips).

---

## 6) Non-Functional Requirements (NFR)

* **Performance:** FCP ≤ 2s on 4G; TTI ≤ 5s. Search/filter responses < 500 ms at \~5k listings & \~50 concurrent users.
* **Security:** OWASP Top 10, CSRF, input validation; TLS; hashed passwords; company-scoped authorization checks.
* **Availability:** 99.5% monthly; daily DB backups; 7-day point-in-time recovery.
* **Accessibility:** WCAG 2.1 AA; keyboard-navigable filters; screen-reader labels.
* **SEO:** SSR/pre-render for public pages; XML sitemaps; Open Graph/Twitter; schema.org.
* **Scalability path:** Dedicated search (Algolia/Elasticsearch) + image/CDN as inventory grows.

---

## 7) UI/UX Requirements

**General**

* Modern, clean, responsive; light theme, rounded corners, soft shadows, high contrast; Arabic/English typography tuned for readability.

**Key Screens**

1. **Home/Search:** sticky search bar, filter drawer (mobile), list+map split, sort, result count, clear-all, language switcher.
2. **Listing Details:** gallery, specs, company card + contact form, related listings.
3. **Company Dashboard:** overview cards (Draft/Ready/Published), listings table (status, updated), **Team tab** (members + invites), **Company settings** (logo/contact), **Leads** (list + CSV export).

**Micro-interactions**

* Skeleton loaders, toasts, optimistic updates, clear focus states.

---

## 8) Data Model (High Level)

**User** — `id, email, password_hash, email_verified, created_at, last_login`
**Company** — `id, owner_user_id, name, logo_url, country, city, public_email, public_phone, website, created_at`
**CompanyMember** — `company_id, user_id, role ('owner'/'member'), added_at`
**CompanyInvite** — `id, company_id, email, inviter_user_id, status (pending/accepted/revoked/expired), token, expires_at, created_at`
**Listing** — `id, company_id, status (Draft/ReadyToPublish/Published/Archived), title, description, property_type, listing_type, price, currency, area_value, area_unit, bedrooms, bathrooms, parking, year_built, address_line, city, area_name, country, lat, lng, primary_photo_url, created_at, updated_at`
**ListingAmenity** — `listing_id, amenity_key`
**MediaAsset** — `id, listing_id, type (photo/video), url, sort_order, created_at`
**Lead** — `id, listing_id, company_id, name, email, phone, message, consent, created_at, source`

---

## 9) Acceptance Criteria (Selected)

**Company & Team**

* Only Owners see Team & Company Settings.
* Invites expire after 7 days; accepted invites create/attach user as Member.

**Listings**

* Members can mark Draft → ReadyToPublish; only Owner can publish/unpublish.
* Editing price/address on Published sends it back to ReadyToPublish until Owner republishes.
* Only Published listings appear in public search.

**Search/Map**

* Map bounds search toggled by "Search this area"; list updates debounced.
* Filters combine with AND logic; removing a chip updates results immediately.

**Leads**

* Valid submission stores a lead and sends email to the company within seconds.
* Rate limits and CAPTCHA reduce spam.

**Localization**

* All flows function fully in AR and EN with correct RTL/LTR rendering.

---

## 10) Risks & Mitigations

* **No central moderation:** incorrect or low-quality listings could appear. → Mitigate with clear publishing guidelines in UI, required address geocoding, image and field validations, and owner accountability (audit log).
* **Spam leads:** CAPTCHA + rate limits.
* **Performance at scale:** plan to adopt dedicated search + CDN for images.

---

## 11) Release Scope

**V1 (Must-have)**

* Auth; Company creation; Invites & Members
* Listing CRUD; geocoding; **Owner publishing**
* Search + filters + sorting; map with clustering & bounds search
* Listing details with gallery; lead form; leads list (Owner CSV export)
* Favorites (logged-in)
* Bilingual AR/EN with RTL/LTR
* SEO/accessibility/performance baselines

**V1.1 (Nice-to-have)**

* City/area autocomplete & optional radius filter
* "Draw area" map search
* Bulk photo upload/reorder
* Public company page (company profile + all listings)

---

## 12) Open Questions

* Should Members be allowed to publish in V1 (toggle in settings), or keep Owner-only publishing?
* Single currency or multi-currency support at launch?
* Phone masking/click-to-reveal for spam reduction on contact numbers?

---

## 13) Definition of Done (V1)

* All acceptance criteria pass in staging/production-parity.
* Lighthouse: Perf ≥ 80, A11y ≥ 90, Best Practices ≥ 90, SEO ≥ 90 on key pages.
* Owners can create companies, invite members, and publish listings; buyers can search, view, and contact companies.
* Backups, error monitoring, and uptime alerts configured.

