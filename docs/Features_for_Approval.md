# Features Proposal: Next Development Phase

## 1. Manual Trigger for Admin Dashboard & Public Engagement Actions

* **Objective:** Enhance public transparency and interaction by bridging user-facing station controls with administrative oversight.
* **Public-Facing Interactions:**
* **"Report an Issue" Button:** A dedicated quick-action modal allowing community members to flag urgent station maintenance problems (e.g., mechanical jams, contaminated or dirty water bowls, or reported injured strays nearby). Submissions route directly to the admin moderation queue with automated timestamping and location tracking.
* **"View Feeding Logs" Link:** Direct public access to historical dispensing data, verification hashes, and activity streams (modeled after developer timelines) to build community trust.


* **Admin Dashboard Manual Controls:** Provide station operators with direct overrides to trigger manual feed cycles, adjust automated schedule intervals, and resolve reported issue tickets directly from the management console.

---

## 2. Proof-of-Restock Photo Vault & Verification Log

* **Objective:** Deliver undeniable visual accountability for every physical food restock event executed by community volunteers and donors.
* **Functional Workflow:**
1. Volunteers capture a photograph of the food package or refilled station bin via the web or mobile client.
2. The image file is securely uploaded to an external object storage bucket (e.g., Supabase Storage, Vercel Blob, or Cloudinary).
3. The resulting public asset URL is recorded alongside the donor's name, precise timestamp, station ID, and quantity contributed in a dedicated Postgres table.


* **Database & Query Architecture (`Neon Postgres`):**
* Store entries in a relational ledger table mapped via foreign keys to stations and user profiles.
* Public audit queries fetch verified records instantly using lightweight indexed lookups, giving sponsors and community members a transparent, tamper-resistant feed of real-world impact.



---

## 3. Live Feeder Telemetry Audit Trail

* **Objective:** Provide a verifiable, automated hardware audit trail proving that scheduled rations and manual dispenses are operating correctly in real-time.
* **Functional Workflow:**
* Every hardware event—whether initiated automatically via internal microcontroller schedules or manually forced via the admin dashboard—triggers a telemetry log event.


* **Database & Query Architecture (`Neon Postgres`):**
* Establish an append-only audit log table (`feeder_telemetry`) optimized for time-series event tracking.
* Captured metrics include: amount dispensed in grams, trigger source (`SCHEDULED` vs. `MANUAL_ADMIN`), and accompanying hardware vitals (such as battery voltage or Wi-Fi signal strength).
* Rendered on a public dashboard widget to display live system health and operational uptime.



---

## 4. Dynamic Donor Leaderboard & Impact Multiplier

* **Objective:** Gamify community engagement and incentivize ongoing donations through automated, real-time public recognition of top contributors.
* **Functional Workflow:**
* Tracks cumulative individual contributions (measured in total kilograms donated) and volunteer shift milestones over rolling weekly and monthly periods.


* **Database & Query Architecture (`Neon Postgres`):**
* Utilize dynamic SQL aggregation queries featuring `SUM()` and `GROUP BY` operations grouped by user identity and timeframe.
* Eliminate manual tracking overhead by computing rankings on-the-fly or caching views via automated database triggers, ensuring the leaderboard updates instantly as new restock logs are verified.



---

## 5. Station Financial & Supply Burndown Graph

* **Objective:** Give sponsors and administrators a predictive mathematical forecasting tool to prevent unexpected station stockouts.
* **Functional Workflow:**
* Combines incoming inventory logs (supply additions) with historical consumption velocity (daily average grams dispensed) to compute an active "food runway" countdown.


* **Database & Query Architecture (`Neon Postgres`):**
* Implement a custom SQL view or stored function that evaluates current inventory levels against trailing 7-day or 30-day burn rates.
* Outputs precise estimates of remaining operational days before a physical refill is required, powering visual graphs and low-stock automated alerts.