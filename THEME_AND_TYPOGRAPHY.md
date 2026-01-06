# 🎨 Dark/Light Theme & International Typography Guide

## Overview

The Xionco Furniture Admin Panel now includes a complete dark/light theme system with international standard typography. All components automatically adapt to the selected theme.

---

## ✨ Features Implemented

### 1. **Dark/Light Theme Toggle** 🌙☀️

- **Location**: Top-right corner of navbar on all pages
- **Toggle Button**: Moon icon (🌙) for light theme, Sun icon (☀️) for dark theme
- **Persistence**: Theme preference saved to browser localStorage
- **Default**: Light theme on first visit

#### How It Works:
```javascript
// Theme toggling
const newTheme = theme === 'dark' ? 'light' : 'dark';
htmlElement.setAttribute('data-theme', newTheme);
localStorage.setItem('theme', newTheme);
```

### 2. **International Standard Typography**

#### Font Size Scale (px)
```
--fs-xs:   12px  (Extra small - captions)
--fs-sm:   14px  (Small - labels, badges)
--fs-base: 16px  (Base - body text, standard size)
--fs-lg:   18px  (Large - paragraphs, callouts)
--fs-xl:   20px  (Extra Large - subheadings)
--fs-2xl:  24px  (2x Large - section headers)
--fs-3xl:  28px  (3x Large - page headers)
--fs-4xl:  32px  (4x Large - hero titles)
```

#### Font Weights (W3C Standard)
```
--fw-normal:    400  (Regular text)
--fw-medium:    500  (Slightly emphasis)
--fw-semibold:  600  (Headings, important labels)
--fw-bold:      700  (Strong emphasis)
```

#### Line Heights
```
--lh-tight:   1.2   (Compact - headings)
--lh-normal:  1.5   (Standard - body text)
--lh-relaxed: 1.75  (Spacious - long-form content)
```

### 3. **Product & Price Visibility**

All product information is now fully visible in the table:
- ✅ **Nama Furnitur** (Product Name)
- ✅ **Deskripsi** (Description)
- ✅ **Kategori** (Category Badge with theme support)
- ✅ **Harga** (Price in Rp with proper formatting)
- ✅ **Stok** (Stock quantity)
- ✅ **Status** (Tersedia/Available)

Example table display:
```
┌─────────────────────┬──────────────┬──────────┬──────────────┬────────┐
│ Nama Furnitur       │ Kategori     │ Harga    │ Stok         │ Status │
├─────────────────────┼──────────────┼──────────┼──────────────┼────────┤
│ Sofa Modern 3 Tmpat │ Sofa         │ Rp4.5M   │ 50 units     │ TERSEDIA
│ Meja Makan 6 Kursi  │ Meja         │ Rp8.5M   │ 50 units     │ TERSEDIA
└─────────────────────┴──────────────┴──────────┴──────────────┴────────┘
```

---

## 🎯 Color Scheme

### Light Theme (Default)

| Element | Color | Usage |
|---------|-------|-------|
| Text (Primary) | #333333 | Main body text |
| Text (Secondary) | #666666 | Descriptions, meta info |
| Background | #f5f6fa | Page background |
| Card Background | #ffffff | Component backgrounds |
| Border | #ddd | Dividers, input borders |
| Primary | #3498db | Main buttons, links |
| Secondary | #2ecc71 | Success, confirm actions |
| Danger | #e74c3c | Cancel, delete actions |

### Dark Theme

| Element | Color | Usage |
|---------|-------|-------|
| Text (Primary) | #e0e0e0 | Main body text |
| Text (Secondary) | #b0b0b0 | Descriptions, meta info |
| Background | #1a1a1a | Page background |
| Card Background | #2d2d2d | Component backgrounds |
| Border | #444444 | Dividers, input borders |
| Primary | #3498db | Main buttons, links (same) |
| Secondary | #2ecc71 | Success, confirm actions (same) |
| Danger | #e74c3c | Cancel, delete actions (same) |

---

## 📱 Responsive Design

### Breakpoints with Theme Support

```css
/* Tablet - 768px and below */
@media (max-width: 768px) {
  /* Adjusted spacing and font sizes */
  --space-md: 0.75rem;
  --fs-base: 16px;
}

/* Mobile - 480px and below */
@media (max-width: 480px) {
  /* Reduced base font size */
  html { font-size: 14px; }
  /* Stack layouts vertically */
  /* Reduced padding and margins */
}
```

### Device Optimization

- **Desktop** (1200px+): Full feature display, 16px base font
- **Tablet** (769-1200px): Adjusted grid layouts, readable typography
- **Mobile** (480-768px): Single column, optimized spacing
- **Small Mobile** (< 480px): 14px base font, minimal padding

---

## 🔧 Using the Theme System

### Accessing Theme Variables

All CSS variables are automatically available throughout the stylesheet:

```css
/* Light theme (default) */
color: var(--text-color);              /* #333333 */
background-color: var(--card-bg);      /* #ffffff */

/* Dark theme (data-theme="dark") */
[data-theme="dark"] {
  color: var(--text-color);            /* #e0e0e0 */
  background-color: var(--card-bg);    /* #2d2d2d */
}
```

### Adding Components

When adding new UI components, follow this pattern:

```html
<!-- HTML -->
<div class="my-component">
  <h3>Component Title</h3>
  <p>Component content</p>
</div>
```

```css
/* CSS with theme support */
.my-component {
  color: var(--text-color);           /* Inherits theme color */
  background: var(--card-bg);         /* Inherits theme background */
  border: 1px solid var(--border-color);  /* Theme-aware border */
}
```

---

## 📊 Typography Hierarchy

### Heading Hierarchy
- **H1** (`var(--fs-4xl)`, 32px) - Hero/Page titles
- **H2** (`var(--fs-3xl)`, 28px) - Section headers
- **H3** (`var(--fs-2xl)`, 24px) - Subsection headers
- **H4** (`var(--fs-xl)`, 20px) - Component headers
- **Paragraph** (`var(--fs-base)`, 16px) - Body text
- **Small** (`var(--fs-sm)`, 14px) - Labels, badges
- **Extra Small** (`var(--fs-xs)`, 12px) - Captions

### Text Contrast
- All text meets WCAG AA contrast requirements (4.5:1 minimum)
- Dark theme inverts colors to maintain contrast
- Status badges have inverse backgrounds in dark theme

---

## 🎨 Component Styling Guide

### Buttons
```
Primary Button:
- Light: White text on blue (#3498db)
- Dark: White text on blue (#3498db) - same for consistency

Danger Button:
- Light: White text on red (#e74c3c)
- Dark: White text on red (#e74c3c) - same
```

### Tables
```
Light Theme:
- Header: Light gray (#ecf0f1) background
- Rows: White background with hover effect
- Borders: Light gray (#ddd)

Dark Theme:
- Header: Dark gray (#2d3748) background
- Rows: Dark (#2d2d2d) with darker hover
- Borders: Darker gray (#444444)
```

### Badges
```
Status Badge (Light):
- Pending: Yellow background (#fff3cd), brown text (#856404)
- Confirmed: Green background (#d4edda), dark green text (#155724)
- Cancelled: Red background (#f8d7da), dark red text (#721c24)

Status Badge (Dark):
- Background and text colors inverted for contrast
```

---

## 🚀 Browser Support

✅ **Fully Supported**:
- Chrome 49+
- Firefox 40+
- Safari 9.1+
- Edge 15+

**Features**:
- CSS Custom Properties (Variables)
- CSS Grid
- Flexbox
- CSS Transitions
- localStorage API

---

## 📝 Font Stack

```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
  'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
  'Helvetica Neue', sans-serif;
```

This stack provides:
- System fonts for native appearance on each OS
- Best performance (no font downloads)
- Excellent readability and accessibility
- Cross-platform consistency

---

## 🔄 Automatic Theme Application

### Products Table
- All product names, descriptions, categories, and prices visible
- Category badges automatically theme-aware
- Price formatting with Rp currency (Indonesian Rupiah)

### Admin Dashboard
- All form fields inherit theme colors
- Input fields have theme-specific backgrounds
- Buttons maintain contrast across themes

### Chatbot
- Chat messages theme-aware
- Input field matches theme
- User messages: Blue background (consistent across themes)
- Bot messages: Light gray (light theme) / Dark gray (dark theme)

---

## ✅ Validation Checklist

- [x] All products visible in table
- [x] All prices visible and formatted
- [x] Dark/light theme toggle working
- [x] Theme persistence via localStorage
- [x] International standard font sizes applied
- [x] WCAG AA contrast compliance
- [x] Mobile responsive at all breakpoints
- [x] Forms and inputs theme-aware
- [x] Tables properly styled in both themes
- [x] Status badges legible in both themes
- [x] Category badges styled appropriately

---

## 🎓 Tips for Maintenance

1. **Adding New Colors**: Update CSS variables in `:root` and `[data-theme="dark"]`
2. **Responsive Updates**: Test changes at 1200px, 768px, and 480px breakpoints
3. **Typography Changes**: Maintain the font-size scale for consistency
4. **Component Additions**: Always use CSS variables, never hardcode colors

---

**Status**: ✅ COMPLETE & TESTED

All products are now visible with proper formatting, dark/light theme support is fully functional, and typography follows international standards for optimal readability across all devices.
