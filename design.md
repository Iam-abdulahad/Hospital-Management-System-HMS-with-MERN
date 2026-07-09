# 🏥 HealTrack — Design System Document

> **Version:** 1.0.0  
> **Last Updated:** July 9, 2026  
> **Stack:** React.js · Tailwind CSS v3+ · Framer Motion  
> **Design Philosophy:** Calm, trustworthy, and clinically clean — designed to reduce patient anxiety and instill confidence in healthcare professionals.

---

## Table of Contents

1. [Design Principles](#1-design-principles)
2. [Core Color Palette](#2-core-color-palette)
3. [Typography](#3-typography)
4. [Spacing & Layout](#4-spacing--layout)
5. [Component Styles](#5-component-styles)
6. [Framer Motion Defaults](#6-framer-motion-defaults)
7. [Gradients & Backgrounds](#7-gradients--backgrounds)
8. [Iconography & Assets](#8-iconography--assets)
9. [Responsive Breakpoints](#9-responsive-breakpoints)
10. [Accessibility](#10-accessibility)

---

## 1. Design Principles

| # | Principle | Rationale |
|---|-----------|-----------|
| 1 | **Calm over Urgent** | Healthcare UIs must reduce cognitive overload. Cool blues and teals evoke clinical calmness and reliability. |
| 2 | **Trust through Consistency** | Every interaction — hover, transition, card layout — must feel predictable. Patients and staff should never feel lost. |
| 3 | **Cleanliness is Clarity** | Generous whitespace, soft shadows, and rounded corners mirror the sterile, organized environment of a hospital. |
| 4 | **Mobile-First, Always** | Doctors check dashboards on tablets; patients book appointments on phones. Every component is designed for small screens first. |
| 5 | **Subtle Motion, Never Distracting** | Framer Motion animations guide attention, they never compete for it. Transitions are smooth, short (≤ 400ms), and purposeful. |

---

## 2. Core Color Palette

### 2.1 Color Table

| Role | Name | Hex | Tailwind Token | Usage |
|------|------|-----|----------------|-------|
| **Primary** | Healing Blue | `#0B6E9B` | `primary` | Sidebar, headers, primary buttons, active states |
| **Primary Light** | Sky Mist | `#E8F4F8` | `primary-light` | Hover backgrounds, selected row highlights, card accents |
| **Secondary** | Teal Pulse | `#14A085` | `secondary` | Success states, confirmed badges, health indicators |
| **Secondary Light** | Mint Wash | `#E6F7F3` | `secondary-light` | Secondary button hover, success alert backgrounds |
| **Accent** | Soft Coral | `#E74C6F` | `accent` | Emergency badges, critical alerts, urgent notifications |
| **Accent Light** | Blush | `#FDE8ED` | `accent-light` | Emergency banner backgrounds, warning card fills |
| **Warning** | Amber Glow | `#F59E0B` | `warning` | Pending badges, review-needed states, caution indicators |
| **Warning Light** | Cream | `#FEF3C7` | `warning-light` | Warning alert backgrounds, pending card fills |
| **Neutral 50** | Snow | `#F8F9FA` | `neutral-50` | Page backgrounds, empty states |
| **Neutral 100** | Ash Gray | `#E9ECEF` | `neutral-100` | Borders, dividers, disabled backgrounds |
| **Neutral 200** | Silver | `#DEE2E6` | `neutral-200` | Input borders, table row dividers |
| **Neutral 500** | Slate | `#6C757D` | `neutral-500` | Placeholder text, secondary labels |
| **Neutral 800** | Charcoal | `#2D3748` | `neutral-800` | Body text, headings |
| **Neutral 900** | Ink | `#1A202C` | `neutral-900` | Primary text, sidebar text on light |

> **Why no aggressive red?** Standard `#FF0000` red triggers fight-or-flight responses. Soft Coral (`#E74C6F`) communicates urgency without inducing panic — critical in a healthcare context where patients are already anxious.

### 2.2 Tailwind Configuration

Paste this directly into your `tailwind.config.js`:

```js
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0B6E9B',
          light: '#E8F4F8',
          dark: '#085A7E',
          50: '#E8F4F8',
          100: '#C5E4EF',
          200: '#8CC9DF',
          300: '#53AECF',
          400: '#2E8DB3',
          500: '#0B6E9B',
          600: '#095C82',
          700: '#074A69',
          800: '#053850',
          900: '#032637',
        },
        secondary: {
          DEFAULT: '#14A085',
          light: '#E6F7F3',
          dark: '#0E7A65',
          50: '#E6F7F3',
          100: '#C0EBE1',
          200: '#80D7C3',
          300: '#40C3A5',
          400: '#22B295',
          500: '#14A085',
          600: '#10836D',
          700: '#0C6655',
          800: '#08493D',
          900: '#042C25',
        },
        accent: {
          DEFAULT: '#E74C6F',
          light: '#FDE8ED',
          dark: '#C7294F',
          50: '#FDE8ED',
          100: '#FACDD8',
          200: '#F49BB2',
          300: '#EF698B',
          400: '#E74C6F',
          500: '#D42E55',
          600: '#B22345',
          700: '#8F1A36',
          800: '#6D1228',
          900: '#4A0B1A',
        },
        warning: {
          DEFAULT: '#F59E0B',
          light: '#FEF3C7',
          dark: '#D97706',
        },
        neutral: {
          50: '#F8F9FA',
          100: '#E9ECEF',
          200: '#DEE2E6',
          300: '#CED4DA',
          400: '#ADB5BD',
          500: '#6C757D',
          600: '#495057',
          700: '#343A40',
          800: '#2D3748',
          900: '#1A202C',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.06), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 4px 12px 0 rgba(11, 110, 155, 0.10), 0 2px 4px -1px rgba(0, 0, 0, 0.05)',
        'sidebar': '4px 0 15px -3px rgba(0, 0, 0, 0.08)',
        'modal': '0 20px 60px -12px rgba(0, 0, 0, 0.2)',
      },
      borderRadius: {
        'card': '0.75rem',
        'button': '0.5rem',
        'badge': '9999px',
        'input': '0.5rem',
      },
      animation: {
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        'badge-blink': 'badge-blink 1.5s ease-in-out infinite',
      },
      keyframes: {
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'badge-blink': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.05)' },
        },
      },
    },
  },
  plugins: [],
};
```

---

## 3. Typography

### 3.1 Font Family

**Primary Font:** [Inter](https://fonts.google.com/specimen/Inter) — A clean, highly-legible variable font designed for screens. Its neutral character aligns perfectly with medical professionalism.

Add to your `index.html` `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

### 3.2 Type Scale

| Level | Element | Size (rem / px) | Weight | Line Height | Tailwind Classes | Usage |
|-------|---------|-----------------|--------|-------------|-----------------|-------|
| H1 | Page Title | `2.25rem / 36px` | 700 | 1.2 | `text-4xl font-bold leading-tight` | Dashboard title, main page headers |
| H2 | Section Title | `1.5rem / 24px` | 600 | 1.3 | `text-2xl font-semibold leading-snug` | Card group headers, section labels |
| H3 | Card Title | `1.25rem / 20px` | 600 | 1.4 | `text-xl font-semibold leading-normal` | Individual card headers |
| H4 | Sub-heading | `1.125rem / 18px` | 500 | 1.4 | `text-lg font-medium` | Table column headers, sub-sections |
| Body | Paragraph | `1rem / 16px` | 400 | 1.6 | `text-base font-normal leading-relaxed` | Descriptions, paragraphs, form hints |
| Body Small | Secondary Text | `0.875rem / 14px` | 400 | 1.5 | `text-sm font-normal` | Timestamps, metadata, helper text |
| Label | Form Label | `0.875rem / 14px` | 500 | 1.4 | `text-sm font-medium` | Input labels, badge text |
| Caption | Fine Print | `0.75rem / 12px` | 400 | 1.4 | `text-xs font-normal` | Footnotes, tooltips, copyright |
| Stat Number | KPI Value | `2rem / 32px` | 700 | 1.1 | `text-3xl font-bold tracking-tight` | Dashboard stat cards |

### 3.3 Text Color Assignments

```
Heading text:        text-neutral-900    (#1A202C)
Body text:           text-neutral-800    (#2D3748)
Secondary text:      text-neutral-500    (#6C757D)
Placeholder text:    text-neutral-400    (#ADB5BD)
Link text:           text-primary        (#0B6E9B)
Link hover:          text-primary-dark   (#085A7E)
Error text:          text-accent         (#E74C6F)
Success text:        text-secondary      (#14A085)
```

---

## 4. Spacing & Layout

### 4.1 Base Spacing Unit

All spacing derives from a **4px base unit** (Tailwind default).

| Token | Value | Usage |
|-------|-------|-------|
| `p-1` / `m-1` | 4px | Inline icon padding |
| `p-2` / `m-2` | 8px | Badge internal padding |
| `p-4` / `m-4` | 16px | Default component padding |
| `p-6` / `m-6` | 24px | Card padding, section gaps |
| `p-8` / `m-8` | 32px | Page-level padding (mobile) |
| `gap-4` | 16px | Default grid/flex gaps |
| `gap-6` | 24px | Card grid gaps |
| `space-y-6` | 24px | Vertical stack spacing |

### 4.2 Page Layout Structure

```jsx
{/* Root layout — full viewport, neutral background */}
<div className="flex h-screen bg-neutral-50">

  {/* Sidebar — fixed width */}
  <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 left-0 z-30">
    {/* Sidebar content */}
  </aside>

  {/* Main content — offset by sidebar width */}
  <main className="flex-1 lg:ml-64 overflow-y-auto">
    {/* Page header */}
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-neutral-100 px-6 py-4">
      {/* Breadcrumb + Actions */}
    </header>

    {/* Page body */}
    <div className="px-6 py-8 max-w-7xl mx-auto">
      {/* Page content */}
    </div>
  </main>
</div>
```

---

## 5. Component Styles

### 5.1 Cards

```jsx
{/* ── Base Card ── */}
<div className="bg-white rounded-xl shadow-card border border-neutral-100 p-6 
                hover:shadow-card-hover transition-shadow duration-300">
  <h3 className="text-xl font-semibold text-neutral-900 mb-2">Card Title</h3>
  <p className="text-sm text-neutral-500 leading-relaxed">Card description goes here.</p>
</div>

{/* ── Stat Card (Dashboard KPI) ── */}
<div className="bg-white rounded-xl shadow-card border border-neutral-100 p-6 
                hover:shadow-card-hover transition-all duration-300 group">
  <div className="flex items-center justify-between mb-4">
    <div className="w-12 h-12 rounded-lg bg-primary-light flex items-center justify-center
                    group-hover:bg-primary group-hover:text-white transition-colors duration-300">
      {/* Icon */}
    </div>
    <span className="text-xs font-medium text-secondary bg-secondary-light px-2 py-1 rounded-full">
      +12.5%
    </span>
  </div>
  <p className="text-sm font-medium text-neutral-500 mb-1">Total Patients</p>
  <p className="text-3xl font-bold text-neutral-900 tracking-tight">1,284</p>
</div>

{/* ── Appointment Card ── */}
<div className="bg-white rounded-xl shadow-card border-l-4 border-l-primary 
                border border-neutral-100 p-5 hover:shadow-card-hover 
                transition-all duration-300">
  <div className="flex items-start justify-between">
    <div>
      <h4 className="text-base font-semibold text-neutral-900">Dr. Sarah Ahmed</h4>
      <p className="text-sm text-neutral-500 mt-1">Cardiology · Room 204</p>
    </div>
    {/* Status badge here */}
  </div>
  <div className="mt-3 flex items-center gap-2 text-xs text-neutral-500">
    <span>🕐 10:30 AM – 11:00 AM</span>
  </div>
</div>
```

### 5.2 Sidebar

```jsx
{/* ── Sidebar Component ── */}
<aside className="w-64 bg-primary text-white flex flex-col fixed inset-y-0 left-0 z-30 
                  shadow-sidebar">
  
  {/* Logo / Brand */}
  <div className="px-6 py-6 border-b border-white/10">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
        <span className="text-xl">🏥</span>
      </div>
      <div>
        <h1 className="text-lg font-bold tracking-tight">HealTrack</h1>
        <p className="text-xs text-white/60">Hospital Management</p>
      </div>
    </div>
  </div>

  {/* Navigation */}
  <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
    {/* Active Nav Item */}
    <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg 
                           bg-white/15 text-white font-medium text-sm 
                           transition-all duration-200">
      <span className="w-5 h-5">📊</span>
      Dashboard
    </a>

    {/* Inactive Nav Item */}
    <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg 
                           text-white/70 hover:bg-white/10 hover:text-white 
                           font-normal text-sm transition-all duration-200">
      <span className="w-5 h-5">👥</span>
      Patients
    </a>

    {/* Nav Item with Badge Count */}
    <a href="#" className="flex items-center justify-between px-3 py-2.5 rounded-lg 
                           text-white/70 hover:bg-white/10 hover:text-white 
                           font-normal text-sm transition-all duration-200">
      <div className="flex items-center gap-3">
        <span className="w-5 h-5">📅</span>
        Appointments
      </div>
      <span className="bg-accent text-white text-xs font-semibold px-2 py-0.5 
                       rounded-full min-w-[20px] text-center">
        3
      </span>
    </a>
  </nav>

  {/* User Profile Footer */}
  <div className="px-4 py-4 border-t border-white/10">
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center 
                      text-sm font-semibold">
        AA
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">Abdul Ahad</p>
        <p className="text-xs text-white/50 truncate">Administrator</p>
      </div>
    </div>
  </div>
</aside>
```

### 5.3 Status Badges

```jsx
{/* ── Confirmed Badge ── */}
<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full 
                 bg-secondary-light text-secondary text-xs font-semibold">
  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
  Confirmed
</span>

{/* ── Pending Badge ── */}
<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full 
                 bg-warning-light text-warning-dark text-xs font-semibold">
  <span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse-soft"></span>
  Pending
</span>

{/* ── Emergency Badge (with attention-grabbing animation) ── */}
<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full 
                 bg-accent-light text-accent text-xs font-semibold 
                 animate-badge-blink">
  <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
  Emergency
</span>

{/* ── Completed Badge ── */}
<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full 
                 bg-neutral-100 text-neutral-500 text-xs font-semibold">
  <span className="w-1.5 h-1.5 rounded-full bg-neutral-400"></span>
  Completed
</span>

{/* ── Cancelled Badge ── */}
<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full 
                 bg-neutral-100 text-neutral-500 text-xs font-semibold line-through">
  Cancelled
</span>
```

#### Badge Utility Component

```jsx
// src/components/ui/StatusBadge.jsx
const badgeConfig = {
  confirmed:  { bg: 'bg-secondary-light', text: 'text-secondary',    dot: 'bg-secondary',    animation: '' },
  pending:    { bg: 'bg-warning-light',   text: 'text-warning-dark', dot: 'bg-warning',      animation: 'animate-pulse-soft' },
  emergency:  { bg: 'bg-accent-light',    text: 'text-accent',       dot: 'bg-accent',       animation: 'animate-badge-blink' },
  completed:  { bg: 'bg-neutral-100',     text: 'text-neutral-500',  dot: 'bg-neutral-400',  animation: '' },
  cancelled:  { bg: 'bg-neutral-100',     text: 'text-neutral-500',  dot: 'bg-neutral-400',  animation: '' },
};

export default function StatusBadge({ status }) {
  const config = badgeConfig[status] || badgeConfig.completed;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full 
                      ${config.bg} ${config.text} text-xs font-semibold ${config.animation}
                      ${status === 'cancelled' ? 'line-through' : ''}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
```

### 5.4 Buttons

```jsx
{/* ── Primary Button ── */}
<button className="bg-primary hover:bg-primary-dark text-white font-medium text-sm 
                   px-5 py-2.5 rounded-lg transition-all duration-200 
                   active:scale-[0.97] shadow-sm hover:shadow-md
                   focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2">
  Book Appointment
</button>

{/* ── Secondary / Outline Button ── */}
<button className="border border-primary text-primary hover:bg-primary-light 
                   font-medium text-sm px-5 py-2.5 rounded-lg 
                   transition-all duration-200 active:scale-[0.97]
                   focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2">
  View Details
</button>

{/* ── Ghost Button ── */}
<button className="text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 
                   font-medium text-sm px-4 py-2 rounded-lg 
                   transition-all duration-200">
  Cancel
</button>

{/* ── Danger Button (for critical actions) ── */}
<button className="bg-accent hover:bg-accent-dark text-white font-medium text-sm 
                   px-5 py-2.5 rounded-lg transition-all duration-200 
                   active:scale-[0.97]
                   focus:outline-none focus:ring-2 focus:ring-accent/30 focus:ring-offset-2">
  Discharge Patient
</button>
```

### 5.5 Form Inputs

```jsx
{/* ── Text Input ── */}
<div>
  <label className="block text-sm font-medium text-neutral-800 mb-1.5">
    Patient Name
  </label>
  <input
    type="text"
    placeholder="Enter full name"
    className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 
               bg-white text-neutral-900 text-sm placeholder:text-neutral-400
               focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
               transition-all duration-200"
  />
  <p className="mt-1.5 text-xs text-neutral-500">As shown on government-issued ID.</p>
</div>

{/* ── Search Input ── */}
<div className="relative">
  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">🔍</span>
  <input
    type="search"
    placeholder="Search patients, doctors, rooms..."
    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-neutral-200 
               bg-neutral-50 text-neutral-900 text-sm placeholder:text-neutral-400
               focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary 
               focus:bg-white transition-all duration-200"
  />
</div>
```

### 5.6 Tables

```jsx
<div className="bg-white rounded-xl shadow-card border border-neutral-100 overflow-hidden">
  <table className="w-full">
    <thead>
      <tr className="bg-neutral-50 border-b border-neutral-100">
        <th className="text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider 
                       px-6 py-3">
          Patient
        </th>
        <th className="text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider 
                       px-6 py-3">
          Doctor
        </th>
        <th className="text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider 
                       px-6 py-3">
          Status
        </th>
      </tr>
    </thead>
    <tbody className="divide-y divide-neutral-100">
      <tr className="hover:bg-primary-light/30 transition-colors duration-150 cursor-pointer">
        <td className="px-6 py-4 text-sm font-medium text-neutral-900">Ahmed Khan</td>
        <td className="px-6 py-4 text-sm text-neutral-500">Dr. Sarah Ahmed</td>
        <td className="px-6 py-4">
          {/* <StatusBadge status="confirmed" /> */}
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

---

## 6. Framer Motion Defaults

### 6.1 Reusable Animation Variants

Create this file at `src/lib/motion.js`:

```js
// src/lib/motion.js
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  HealTrack — Framer Motion Variant Library
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * fadeIn — Global default. Elements fade in and slide up subtly.
 * Use: Page sections, cards, modals, list items.
 */
export const fadeIn = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94], // easeOutQuad — smooth, clinical feel
    },
  },
};

/**
 * fadeInDown — For elements that drop in from above (headers, alerts).
 */
export const fadeInDown = {
  hidden: {
    opacity: 0,
    y: -15,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

/**
 * fadeInScale — For modals and overlays that zoom in gently.
 */
export const fadeInScale = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.35,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
};

/**
 * slideInRight — For sidebar items, panel reveals.
 */
export const slideInRight = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

/**
 * staggerContainer — Wrap parent elements to stagger children animations.
 * Usage: Wrap a list/grid of cards.
 */
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

/**
 * pageTransition — Full page transition for React Router.
 * Wrap each <Route> page component with this.
 */
export const pageTransition = {
  initial: {
    opacity: 0,
    y: 12,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: {
      duration: 0.25,
      ease: 'easeIn',
    },
  },
};
```

### 6.2 Usage Examples

```jsx
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer, pageTransition } from '../lib/motion';

// ── Single element fade-in ──
<motion.div variants={fadeIn} initial="hidden" animate="visible">
  <StatCard title="Total Patients" value="1,284" />
</motion.div>

// ── Staggered card grid ──
<motion.div 
  variants={staggerContainer} 
  initial="hidden" 
  animate="visible"
  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
>
  {stats.map((stat) => (
    <motion.div key={stat.id} variants={fadeIn}>
      <StatCard {...stat} />
    </motion.div>
  ))}
</motion.div>

// ── Page wrapper for route transitions ──
export default function DashboardPage() {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
    >
      {/* Page content */}
    </motion.div>
  );
}
```

---

## 7. Gradients & Backgrounds

### 7.1 Login Page Background Gradient

A calming, medical-grade gradient that transitions from deep blue to teal — evoking professionalism and trust.

```jsx
{/* ── Login Page Container ── */}
<div className="min-h-screen flex items-center justify-center relative overflow-hidden"
     style={{
       background: 'linear-gradient(135deg, #0B6E9B 0%, #085A7E 35%, #0E7A65 70%, #14A085 100%)',
     }}>
  
  {/* Subtle radial overlay for depth */}
  <div className="absolute inset-0"
       style={{
         background: 'radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.08) 0%, transparent 60%)',
       }}>
  </div>

  {/* Decorative floating orbs (optional — adds life) */}
  <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl"></div>
  <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>

  {/* Login Card */}
  <div className="relative z-10 bg-white/95 backdrop-blur-xl rounded-2xl shadow-modal 
                  p-8 w-full max-w-md mx-4">
    <div className="text-center mb-8">
      <div className="w-16 h-16 rounded-2xl bg-primary mx-auto flex items-center justify-center mb-4">
        <span className="text-3xl">🏥</span>
      </div>
      <h1 className="text-2xl font-bold text-neutral-900">Welcome to HealTrack</h1>
      <p className="text-sm text-neutral-500 mt-2">Sign in to your hospital dashboard</p>
    </div>

    {/* Form fields */}
    <form className="space-y-5">
      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-neutral-800 mb-1.5">Email</label>
        <input type="email" placeholder="doctor@healtrack.com"
               className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 
                          text-sm placeholder:text-neutral-400
                          focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                          transition-all duration-200" />
      </div>
      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-neutral-800 mb-1.5">Password</label>
        <input type="password" placeholder="••••••••"
               className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 
                          text-sm placeholder:text-neutral-400
                          focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                          transition-all duration-200" />
      </div>
      {/* Submit */}
      <button type="submit"
              className="w-full bg-primary hover:bg-primary-dark text-white font-semibold 
                         text-sm py-3 rounded-lg transition-all duration-200 
                         active:scale-[0.98] shadow-sm hover:shadow-md
                         focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2">
        Sign In
      </button>
    </form>
  </div>
</div>
```

### 7.2 Tailwind CSS Gradient Alternative

If you prefer pure Tailwind classes (no inline `style`):

```jsx
<div className="min-h-screen flex items-center justify-center 
                bg-gradient-to-br from-primary via-primary-dark to-secondary">
  {/* Content */}
</div>
```

### 7.3 Additional Utility Gradients

| Name | Usage | Tailwind / CSS |
|------|-------|----------------|
| **Login BG** | Full-page login background | `bg-gradient-to-br from-primary via-primary-dark to-secondary` |
| **Card Accent** | Top border glow on stat cards | `bg-gradient-to-r from-primary to-secondary` (2px height strip) |
| **Header Fade** | Sticky header blur fade | `bg-white/80 backdrop-blur-md` |
| **Skeleton** | Loading placeholder shimmer | `bg-gradient-to-r from-neutral-100 via-neutral-200 to-neutral-100 animate-pulse` |

---

## 8. Iconography & Assets

### 8.1 Recommended Icon Library

**[Lucide React](https://lucide.dev/)** — Clean, consistent 24x24 stroke icons. Perfect complement to Inter's geometric personality.

```bash
npm install lucide-react
```

```jsx
import { Users, CalendarDays, Activity, AlertTriangle } from 'lucide-react';

// Usage with consistent sizing
<Users className="w-5 h-5 text-primary" />
<AlertTriangle className="w-5 h-5 text-accent" />
```

### 8.2 Icon Usage Rules

| Context | Size | Color |
|---------|------|-------|
| Sidebar nav items | `w-5 h-5` | `text-white/70` (inactive), `text-white` (active) |
| Stat card icons | `w-6 h-6` | `text-primary` (in light bg container) |
| Button icons (inline) | `w-4 h-4` | Inherits button text color |
| Table action icons | `w-4 h-4` | `text-neutral-400 hover:text-primary` |
| Empty state illustrations | `w-16 h-16` | `text-neutral-300` |

---

## 9. Responsive Breakpoints

Follows Tailwind's mobile-first default breakpoints:

| Breakpoint | Min Width | Target Devices | Layout Behavior |
|------------|-----------|----------------|-----------------|
| Default | `0px` | Phones (portrait) | Single column, sidebar hidden, bottom nav |
| `sm` | `640px` | Phones (landscape) | Two-column stat cards |
| `md` | `768px` | Tablets | Two-column grids, collapsible sidebar |
| `lg` | `1024px` | Laptops | Sidebar visible, three-column grids |
| `xl` | `1280px` | Desktops | Four-column stat grids, full data tables |
| `2xl` | `1536px` | Large monitors | Max-width container, centered content |

### Mobile Sidebar Pattern

```jsx
{/* Mobile: Hamburger -> Slide-in overlay sidebar */}
{/* Desktop: Persistent fixed sidebar */}

{/* Mobile overlay (shown when menu is open) */}
<motion.div
  initial={{ x: '-100%' }}
  animate={{ x: 0 }}
  exit={{ x: '-100%' }}
  transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
  className="fixed inset-y-0 left-0 z-50 w-64 bg-primary shadow-2xl lg:hidden"
>
  {/* Same sidebar content as desktop */}
</motion.div>

{/* Backdrop */}
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
  onClick={closeSidebar}
/>
```

---

## 10. Accessibility

### 10.1 Standards

- **WCAG 2.1 AA** compliance minimum
- All interactive elements must be keyboard-navigable
- Color contrast ratio >= **4.5:1** for normal text, >= **3:1** for large text

### 10.2 Contrast Validation

| Foreground | Background | Ratio | Pass? |
|------------|------------|-------|-------|
| `#1A202C` (Ink) | `#FFFFFF` (White) | **15.4:1** | ✅ AAA |
| `#2D3748` (Charcoal) | `#FFFFFF` (White) | **11.1:1** | ✅ AAA |
| `#0B6E9B` (Primary) | `#FFFFFF` (White) | **5.2:1** | ✅ AA |
| `#FFFFFF` (White) | `#0B6E9B` (Primary) | **5.2:1** | ✅ AA |
| `#14A085` (Secondary) | `#FFFFFF` (White) | **3.4:1** | ✅ AA Large |
| `#E74C6F` (Accent) | `#FFFFFF` (White) | **4.1:1** | ✅ AA Large |
| `#6C757D` (Slate) | `#FFFFFF` (White) | **4.6:1** | ✅ AA |

### 10.3 ARIA Patterns

```jsx
{/* Status badges must be announced */}
<span role="status" aria-label="Appointment status: Emergency">
  <StatusBadge status="emergency" />
</span>

{/* Sidebar navigation */}
<nav aria-label="Main navigation">
  <a href="#" aria-current="page">Dashboard</a>
</nav>

{/* Modal dialog */}
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
>
  <h2 id="modal-title">Confirm Appointment</h2>
</div>
```

---

## Quick Reference Cheat Sheet

```
┌─────────────────────────────────────────────────────────┐
│                    HealTrack Tokens                     │
├──────────────┬──────────────────────────────────────────┤
│ Primary      │ bg-primary      text-primary    #0B6E9B │
│ Secondary    │ bg-secondary    text-secondary  #14A085 │
│ Accent       │ bg-accent       text-accent     #E74C6F │
│ Warning      │ bg-warning      text-warning    #F59E0B │
│ Page BG      │ bg-neutral-50                   #F8F9FA │
│ Card BG      │ bg-white rounded-xl shadow-card          │
│ Border       │ border border-neutral-100                │
│ Heading      │ text-neutral-900 font-bold               │
│ Body         │ text-neutral-800 font-normal              │
│ Muted        │ text-neutral-500                          │
│ Font         │ Inter (300-700)                           │
│ Radius       │ rounded-lg (8px) | rounded-xl (12px)     │
│ Transition   │ transition-all duration-200-300           │
│ Focus Ring   │ focus:ring-2 focus:ring-primary/30        │
└──────────────┴──────────────────────────────────────────┘
```

---

> **Document authored for the HealTrack Hospital Management System.**  
> *Designed with patient psychology and clinical clarity in mind.*
