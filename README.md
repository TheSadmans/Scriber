# Scriber — Digital Marketing Agency Website

A modern, dark-themed agency landing page for **Scriber**, a digital marketing agency based in Chittagong, Bangladesh.

## ✨ Features

- Custom animated cursor with ring follower
- Page loader animation
- Sticky navbar with scroll effect & mobile hamburger menu
- Animated hero section with floating orbs and grid background
- Auto-scrolling marquee ticker
- Services grid with hover effects
- Portfolio grid with overlay reveal
- 4-step process section
- Client testimonials
- Order / contact form with localStorage persistence
- Password-protected admin panel for viewing orders
- Scroll-reveal animations throughout
- Fully responsive (mobile, tablet, desktop)

## 🗂 Project Structure

```
scriber/
├── index.html          # Main HTML (clean, semantic markup)
├── css/
│   └── style.css       # All styles (variables, components, responsive)
├── js/
│   └── main.js         # All interactivity (cursor, admin, forms, etc.)
├── assets/             # Place your images/icons/fonts here
└── README.md
```

## 🚀 Getting Started

1. **Clone the repo**
   ```bash
   git clone https://github.com/YOUR_USERNAME/scriber.git
   cd scriber
   ```

2. **Open locally**  
   Just open `index.html` in your browser — no build step required.

3. **Deploy to GitHub Pages**
   - Push to `main` branch
   - Go to **Settings → Pages → Source → main / root**
   - Your site will be live at `https://YOUR_USERNAME.github.io/scriber/`

## ⚙️ Configuration

### Contact Details
Search for `1XXX-XXXXXX` in `index.html` and replace with real numbers/email.

### Admin Password
Open `js/main.js` and change the `ADMIN_PASS` constant (line ~13):
```js
const ADMIN_PASS = 'your-new-password';
```
> ⚠️ This is a **client-side** password — don't use this for sensitive data in production. For a real backend, use server-side authentication.

### Portfolio Images
Replace the `.mock-card` placeholder divs in `index.html` with real `<img>` tags pointing to files in `assets/`.

### Colors / Branding
All design tokens live in `css/style.css` under `:root`:
```css
:root {
  --green: #5AE03A;   /* primary accent */
  --black: #0a0a0a;   /* page background */
  --dark:  #111111;   /* card background */
  /* ... */
}
```

## 🛠 Tech Stack

| Layer      | Tech |
|------------|------|
| Markup     | Semantic HTML5 |
| Styling    | Pure CSS3 (custom properties, grid, flexbox, animations) |
| Scripting  | Vanilla JavaScript (ES6+) |
| Fonts      | Google Fonts — Syne + DM Sans |
| Storage    | `localStorage` (order persistence) |

## 📄 License

MIT — free to use and modify.
