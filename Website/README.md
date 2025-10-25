# NovaTech — Landing page

Simple static landing page for an IT startup with navigation and sections: Home, About Us, Services, Contact Us.

How to open

1. Open the `index.html` file in your browser. On Windows you can double-click it or run:

```powershell
start .\index.html
```

Files

- `index.html` — main markup
- `styles.css` — styles
- `script.js` — navigation, smooth scrolling, and form handling

Notes

- The contact form uses client-side validation and simulates a send — it doesn't actually send email. Replace the submit handler with an API call to integrate a backend or a service like Formspree.
 - `script.js` — navigation, smooth scrolling, and form handling

Notes

- The contact form uses client-side validation and simulates a send — it doesn't actually send email. Replace the submit handler with an API call to integrate a backend or a service like Formspree.
- Icons and animations: the page includes small emoji icons next to nav and service headings and uses a reveal-on-scroll animation (IntersectionObserver) plus subtle floating and hover animations. These are CSS/JS only and work without external libraries.
 - Navigation: About, Services, and Contact open as separate pages (`about.html`, `services.html`, `contact.html`) in new tabs from the main nav. Home links go to `index.html`.

Open-pages panel

- The header includes an "Open pages" control (click the button to open the panel).
- Use the dropdown to choose whether the page buttons open in a new tab or the same tab.
- Each page row also has a "Copy" button that copies the full page URL to the clipboard (uses the Clipboard API with a textarea fallback).

Theme toggle & icons

- A theme toggle (moon/sun) appears in the header; it switches between dark and light theme and persists your choice in localStorage.
- Service and nav icons were replaced with inline SVGs for a consistent, crisp look.

