# Lightweight Subscription Manager

A minimal, performance-focused subscription and attendance tracking system designed for low-resource environments (such as point-of-sale terminals or kiosk PCs). 

Built entirely with pure **Vanilla JavaScript** and **HTML5/CSS3** to ensure instant load times and virtually zero RAM consumption.

## Key Features

* **Zero Dependencies:** No heavy frameworks, no NPM packages. Just raw, optimized web standards.
* **Resource Efficient:** Specifically developed to run flawlessly on low-spec hardware without impacting browser performance or system memory.
* **Native OLED Dark Mode:** High-contrast, minimal design tailored for continuous device uptime and reduced eye strain.
* **Local Persistence:** Data is securely managed client-side via `localStorage`.
* **Smart Validation:** Automatic expiration checks that dynamically block entry logs for lapsed memberships.

## Tech Stack

* **Frontend:** HTML5, CSS3 (Custom properties, responsive grid layout)
* **Logic:** Vanilla JavaScript (ES6)
* **Storage:** Web Storage API (`localStorage`)

## Why This Approach?

Modern web applications often carry massive overhead (React, Angular, bundling tools) for simple CRUD tasks. This project proves that for dedicated business utilities, leveraging native browser APIs yields better performance, instant startup times, and absolute reliability with a near-zero memory footprint.




