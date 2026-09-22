# Megha

A responsive, animated social media consultancy landing page. Plain HTML, CSS and JavaScript, with local images and fonts. No runtime dependencies, API keys or database.

## Preview

```sh
npm run dev
```

Open http://localhost:4510. Node 20 or newer is sufficient.

## Deploy

```sh
npm run check
npm run build
```

Upload the **contents of `dist/`** to a static website host. `index.html` must be at the published root. Generated deployment files are excluded from Git; rebuild them with the command above. A Netlify build configuration is included: build command `npm run build`, publish directory `dist`. The website also works under a subdirectory because its asset paths are relative.

The site has not been published to a public domain. A domain, hosting account and chosen public address are still needed for publishing. Add an absolute canonical URL and social sharing image when that address is known.

## Consultation flow

Enquiries are addressed to **jain.megha0104@gmail.com**. Selecting a service prefills the consultation form. The form validates the visitor's information and creates a reviewable email draft. The visitor then chooses **Open email app**, **Copy enquiry**, or **Save enquiry** and sends the email themselves. The website does not send email or store submissions on a server. No enquiries are saved in local storage, cookies, logs or analytics. If JavaScript is unavailable, the email link remains usable and the disabled form cannot submit personal data into the URL.

Automatic email delivery or appointment scheduling would require a connected form service or booking provider. It is not represented as configured here.

## Editing

- Copy, links, email and portfolio: `public/index.html`.
- Email draft destination and behavior: `public/app.js`. Update the destination in both HTML and JavaScript when changing the email address.
- Colours, spacing and responsive design: `public/styles.css`.
- Portfolio additions, portrait composition and enhanced animation: `public/motion.css` and `public/app.js`.
- Images and self-hosted fonts: `public/assets/`.
- Re-run `npm run build` after editing; source files in `public/` are authoritative.

## Content provenance

The user supplied Megha's name, email, preferred visual style, Instagram account and LinkedIn profile, and delegated creative direction. The about paragraph reflects the account management, B2B sales and consultative selling background visible on the supplied LinkedIn profile, reviewed September 22, 2026.

Instagram thumbnails were downloaded from the publicly rendered accounts supplied by the user. They are attributed and linked to their original posts. The user confirmed that **Megha manages both Radha Farms and Stemify**. The page describes her role as account management. It does not claim that Megha personally created each individual piece, and there are no invented results or testimonials. Megha's portrait was downloaded from her supplied LinkedIn profile at the user's explicit request.

| Asset | Original |
| --- | --- |
| `radha-chefs.jpg` | https://www.instagram.com/radhafaarms/p/Ddg92gHDh4h/ |
| `radha-plate.jpg` | https://www.instagram.com/radhafaarms/p/DdWcYisnB6o/ |
| `radha-reel.jpg` | https://www.instagram.com/radhafaarms/reel/DdRf6sPgVVN/ |
| `radha-logo.jpg` | https://www.instagram.com/radhafaarms/ |
| `stemify-learning.jpg` | https://www.instagram.com/stemify.ca/p/DYU0ZlpE4qx/ |
| `stemify-coding.jpg` | https://www.instagram.com/stemify.ca/p/DX6t-2bk5H1/ |
| `stemify-logo.jpg` | https://www.instagram.com/stemify.ca/ |
| `megha-jain.jpg` | https://www.linkedin.com/in/megha-jain-1b14331a2/ |

LinkedIn: https://www.linkedin.com/in/megha-jain-1b14331a2/

DM Sans and DM Serif Display are self-hosted with their SIL Open Font License files. Instagram images remain the property of their respective owners. The user selected both accounts for the portfolio and confirmed Megha’s account management role.

## Accessibility and motion

Semantic page structure, labeled inputs, native validation, visible focus states, a skip link, native FAQ disclosures, mobile navigation with Escape dismissal, and reduced-motion CSS are included. Animation uses native scroll, transforms and requestAnimationFrame, with no scroll hijacking or perpetual loop. A footer control pauses positional motion. Form data is only placed in a mailto link after explicit draft preparation.

The expanded motion includes staggered opening text and cards, independent hero depth, pointer response on desktop, scroll-driven portfolio alignment, section entrances, a portrait reveal and rotating decorative accents. Reduced-motion preferences and the page's pause control preserve a complete static layout.

No Azure services, cloud backend, generated-video service or paid animation service are used by this website.
