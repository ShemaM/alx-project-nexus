# 🎨 BYN-K Platform - Figma Design Prompt & Specifications

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Design System](#design-system)
3. [Page Designs Required](#page-designs-required)
4. [Component Library](#component-library)
5. [Mobile & Responsive Guidelines](#mobile--responsive-guidelines)
6. [Accessibility Requirements](#accessibility-requirements)
7. [Prototyping & Interactions](#prototyping--interactions)
8. [Figma Setup Instructions](#figma-setup-instructions)

---

## 🎯 Project Overview

### About BYN-K Platform

**BYN-K Platform** is a dedicated opportunity hub designed specifically for **Banyamulenge refugee youth in Kenya**. The platform connects young refugees with verified opportunities including jobs, scholarships, internships, and fellowships.

### Target Audience

- **Primary**: Banyamulenge refugee youth aged 16-35 in Kenya
- **Secondary**: Organizations and partners offering opportunities
- **Tertiary**: Community administrators and moderators

### Platform Goals

1. Provide a trustworthy source for verified opportunities
2. Enable easy discovery and filtering of opportunities
3. Connect youth with supportive organizations
4. Offer educational resources and career guidance
5. Build community through events and networking

### Key Features to Design

| Feature | Description | Priority |
|---------|-------------|----------|
| 🏠 Home/Landing Page | Hero section, categories, testimonials, partners | High |
| 🔍 Opportunity Discovery | Browse, search, filter opportunities | High |
| 📝 Opportunity Details | Individual opportunity pages | High |
| 🤝 Partners Directory | Organization listings and profiles | Medium |
| 👤 User Dashboard | Personal dashboard, saved opportunities | Medium |
| 🔐 Authentication | Login, signup, forgot password | High |
| ⚙️ Admin Panel | Opportunity & partner management | Medium |

---

## 🎨 Design System

### Color Palette

#### Primary Colors

| Color Name | Hex Code | Usage | Preview |
|------------|----------|-------|---------|
| **Primary Blue** | `#2D8FDD` | CTAs, navigation, headings, trust indicators | 🔵 |
| **Primary Dark** | `#1E6BB8` | Hover states, active elements | 🔵 |
| **Primary Light** | `#E8F4FD` | Backgrounds, subtle highlights | 🔵 |

#### Secondary Colors

| Color Name | Hex Code | Usage | Preview |
|------------|----------|-------|---------|
| **Gold/Yellow** | `#F5D300` | Featured badges, achievement indicators, highlights | 🟡 |
| **Gold Light** | `#FFE066` | Gradients, hover effects | 🟡 |

#### Accent Colors

| Color Name | Hex Code | Usage | Preview |
|------------|----------|-------|---------|
| **Accent Red** | `#D52B2B` | Deadlines, urgent notices, errors | 🔴 |
| **Accent Green** | `#10B981` | Success messages, verified badges | 🟢 |

#### Category Colors

| Category | Primary | Secondary | Usage |
|----------|---------|-----------|-------|
| **Jobs** | `#F5D300` | `#FFE066` | Yellow to Amber gradient |
| **Scholarships** | `#8B5CF6` | `#D946EF` | Purple to Fuchsia gradient |
| **Internships** | `#3B82F6` | `#06B6D4` | Blue to Cyan gradient |
| **Fellowships** | `#10B981` | `#22C55E` | Emerald to Green gradient |

#### Neutral Colors

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| **Slate 900** | `#0F172A` | Dark backgrounds, overlays |
| **Slate 800** | `#1E293B` | Secondary dark elements |
| **Slate 600** | `#475569` | Body text |
| **Slate 400** | `#94A3B8` | Muted text, placeholders |
| **Slate 200** | `#E2E8F0` | Borders, dividers |
| **Slate 100** | `#F1F5F9` | Light backgrounds |
| **White** | `#FFFFFF` | Card backgrounds, content areas |

### Typography

#### Font Stack

```
Primary: Inter, system-ui, -apple-system, sans-serif
Fallback: Roboto, Helvetica Neue, Arial
```

*Note: System fonts are used for optimal performance on mobile devices and low-bandwidth connections.*

#### Type Scale

| Element | Size | Weight | Line Height | Usage |
|---------|------|--------|-------------|-------|
| **Display** | 60px / 48px (mobile) | 900 (Black) | 1.1 | Hero headlines |
| **H1** | 36px / 28px (mobile) | 700 (Bold) | 1.2 | Page titles |
| **H2** | 28px / 24px (mobile) | 700 (Bold) | 1.3 | Section headings |
| **H3** | 20px / 18px (mobile) | 600 (Semibold) | 1.4 | Card titles |
| **H4** | 16px | 600 (Semibold) | 1.4 | Subsections |
| **Body Large** | 18px | 400 (Regular) | 1.6 | Featured content |
| **Body** | 16px | 400 (Regular) | 1.6 | Primary content |
| **Body Small** | 14px | 400 (Regular) | 1.5 | Supporting text |
| **Caption** | 12px | 500 (Medium) | 1.4 | Labels, metadata |

### Spacing & Grid

#### Spacing Scale (8px base unit)

| Token | Value | Usage |
|-------|-------|-------|
| `xs` | 4px | Tight spacing |
| `sm` | 8px | Small gaps |
| `md` | 16px | Default spacing |
| `lg` | 24px | Section padding |
| `xl` | 32px | Large gaps |
| `2xl` | 48px | Section spacing |
| `3xl` | 64px | Hero padding |

#### Grid System

- **Container max-width**: 1280px
- **Gutter**: 24px (desktop), 16px (mobile)
- **Columns**: 12 (desktop), 4 (mobile)
- **Breakpoints**: 
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `sm` | 8px | Small elements, inputs |
| `md` | 12px | Cards, buttons |
| `lg` | 16px | Large cards, modals |
| `xl` | 20px | Hero elements |
| `2xl` | 24px | Featured cards |
| `full` | 9999px | Pills, avatars |

### Shadows

```css
/* Card Shadow */
shadow-card: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);

/* Elevated Shadow */
shadow-elevated: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);

/* Gold Glow */
shadow-gold: 0 4px 14px 0 rgba(245, 211, 0, 0.39);

/* Blue Glow */
shadow-blue: 0 4px 14px 0 rgba(45, 143, 221, 0.39);
```

### Glassmorphism Effects

For overlay cards and featured elements:

```css
/* Glassmorphism Card */
background: rgba(255, 255, 255, 0.1);
backdrop-filter: blur(16px);
border: 1px solid rgba(255, 255, 255, 0.2);
border-radius: 24px;
```

---

## 📄 Page Designs Required

### 1. Home / Landing Page

**Frame Size**: 1440px width (Desktop), 375px width (Mobile)

#### Sections to Design:

##### A. Hero Section
- **Layout**: Two-column grid (content left, featured card right)
- **Background**: Full-width image with dark blue gradient overlay (`#0F2847` → `#1E3A5F`)
- **Elements**:
  - Trust badge pill ("Trusted by 1000+ refugee youth")
  - Main headline with "Banyamulenge" in gold gradient text
  - Descriptive paragraph
  - Two CTA buttons (primary gold, secondary outline)
  - Quick stats row (Active Opportunities, Trusted Partners)
  - Featured Opportunity Card (glassmorphism style)
  - Floating stat cards with animation indicators
- **Animations**: Indicate floating animations, blob backgrounds

##### B. Search & Filter Section
- Search input with icon
- Category filter buttons/chips
- Location filter dropdown
- "Featured" toggle

##### C. Categories Grid Section
- **Layout**: 4-column grid (desktop), 2-column (tablet), 1-column (mobile)
- **Cards for each category**:
  - Jobs (yellow/amber gradient)
  - Scholarships (purple/fuchsia gradient)
  - Internships (blue/cyan gradient)
  - Fellowships (emerald/green gradient)
- Each card shows: Icon, Title, Count, Arrow indicator

##### D. Partners Section
- Section heading with "View All" link
- Logo grid or carousel of partner organizations
- Partner cards with: Logo, Name, Description preview

##### E. Testimonials Section
- Section heading
- Testimonial cards with: Quote, User avatar, Name, Role
- Carousel dots/navigation

##### F. Email Subscription Section
- Background with subtle gradient
- Heading and description
- Email input + Subscribe button
- Privacy note

##### G. Footer
- Logo and tagline
- Navigation links in columns
- Social media icons
- Copyright notice

---

### 2. Opportunity Listing Page

**Path**: `/categories/[category]`

#### Elements:
- Page header with category title and description
- Filter sidebar (desktop) / Filter bottom sheet (mobile)
  - Category checkboxes
  - Location filter
  - Deadline range
  - Documentation type filter
  - "Verified only" toggle
- Opportunity cards grid/list
- Pagination or "Load more" button
- Active filter chips
- Sort dropdown (Most Recent, Deadline, etc.)

---

### 3. Opportunity Detail Page

**Path**: `/opportunities/[slug]`

#### Sections:
- **Header**:
  - Breadcrumb navigation
  - Organization logo
  - Opportunity title
  - Organization name
  - Category badge
  - Verified badge
  - Share & Bookmark buttons
  
- **Key Details Card**:
  - Deadline with countdown
  - Location
  - Type (Remote/On-site/Hybrid)
  - Application type
  
- **Main Content**:
  - Description (rich text)
  - Requirements
  - Eligibility criteria
  - Benefits
  - Required documents checklist
  
- **Application Section**:
  - Apply button (large, prominent)
  - Application instructions
  - External link indicator
  
- **Sidebar**:
  - Quick info card
  - Related opportunities
  - Organization card

---

### 4. Partners Page

**Path**: `/partners`

#### Elements:
- Page header with search
- Partner grid with cards:
  - Organization logo
  - Name
  - Description preview
  - Category tags
  - "View Profile" link
- Filters by type

---

### 5. Partner Detail Page

**Path**: `/partners/[id]`

#### Sections:
- Hero with logo and cover image
- Organization info
- About section
- Current opportunities from this partner
- Contact information
- Social links

---

### 6. Authentication Pages

#### A. Login Page (`/login`)
- Logo
- "Welcome Back" heading
- Email input
- Password input with show/hide toggle
- "Forgot Password" link
- Login button
- Divider with "or"
- Google sign-in button
- Sign up link

#### B. Sign Up Page (`/signup`)
- Logo
- "Create Account" heading
- Full name input
- Email input
- Password input with requirements indicator
- Confirm password
- Terms checkbox
- Sign up button
- Google sign-in button
- Login link

#### C. Forgot Password (`/forgot-password`)
- Logo
- Heading and instructions
- Email input
- Submit button
- Back to login link

---

### 7. User Dashboard

**Path**: `/dashboard`

#### Layout:
- Sidebar navigation (desktop) / Bottom nav (mobile)
- Main content area

#### Pages:
- **Overview**: 
  - Welcome message
  - Quick stats
  - Recent activity
  - Recommended opportunities
  
- **Saved Opportunities** (`/dashboard/opportunities`):
  - Grid of bookmarked opportunities
  - Notes for each bookmark
  - Quick actions (Apply, Remove, Share)
  
- **Profile**:
  - Avatar
  - Personal information
  - Notification preferences
  - Language settings

---

### 8. Admin Panel

**Path**: `/admin`

#### Layout:
- Admin sidebar with navigation
- Main content area with breadcrumbs

#### Pages:
- **Dashboard**:
  - Analytics cards (Total Opportunities, Users, Partners, Subscriptions)
  - Charts for trends
  - Recent activity log
  
- **Opportunities Manager** (`/admin/opportunities`):
  - Data table with sorting/filtering
  - Create/Edit opportunity modal/page
  - Bulk actions
  - Status toggles (Published, Featured, Verified)
  
- **Partners Manager** (`/admin/partners`):
  - Partner list/grid
  - Add/Edit partner form
  
- **Users** (`/admin/users`):
  - User table
  - Role management

---

### 9. About Page

**Path**: `/about`

#### Sections:
- Hero with mission statement
- Story/Background section
- Team section (if applicable)
- Impact statistics
- Call to action

---

### 10. Confirmation & Status Pages

- **Confirm Subscription** (`/confirm-subscription`)
- **Unsubscribe** (`/unsubscribe`)
- **404 Error Page**
- **500 Error Page**

---

## 🧩 Component Library

Design these as reusable Figma components with variants:

### Buttons

| Variant | States | Usage |
|---------|--------|-------|
| Primary | Default, Hover, Active, Disabled, Loading | Main actions |
| Secondary | Default, Hover, Active, Disabled | Alternative actions |
| Outline | Default, Hover, Active, Disabled | Tertiary actions |
| Ghost | Default, Hover, Active, Disabled | Navigation, subtle actions |
| Icon Only | Default, Hover, Active, Disabled | Toolbars |

**Sizes**: Small (32px), Medium (40px), Large (48px)

### Inputs

| Type | States | Variants |
|------|--------|----------|
| Text Input | Default, Focus, Error, Disabled, Filled | With/without icon, With/without label |
| Search Input | Default, Focus, With suggestions | Icon left |
| Select/Dropdown | Default, Open, Selected | Single select |
| Checkbox | Unchecked, Checked, Indeterminate, Disabled | With label |
| Radio | Unselected, Selected, Disabled | With label |
| Toggle Switch | Off, On, Disabled | With label |

### Cards

| Card Type | Elements |
|-----------|----------|
| Opportunity Card | Category badge, Title, Organization, Deadline, Quick actions |
| Partner Card | Logo, Name, Description, Tags |
| Stat Card | Icon, Number, Label, Trend indicator |
| Testimonial Card | Quote, Avatar, Name, Role |
| Category Card | Icon, Title, Count, Arrow |
| Featured Card | Full content with glassmorphism |

### Navigation

| Component | Elements |
|-----------|----------|
| Navbar | Logo, Nav links, Search icon, User menu, Mobile hamburger |
| Mobile Menu | Full-screen overlay, Links, Close button |
| Footer | Logo, Link columns, Social icons, Copyright |
| Breadcrumbs | Home > Category > Current |
| Tab Bar (Mobile) | Icons with labels |
| Sidebar | Logo, Nav items with icons, Collapse button |

### Overlays & Modals

| Component | Usage |
|-----------|-------|
| Modal | Confirmations, Forms |
| Bottom Sheet (Mobile) | Filters, Actions |
| Toast Notification | Success, Error, Warning, Info |
| Tooltip | Helper text |
| Dropdown Menu | User menu, Actions |

### Badges & Tags

| Type | Variants |
|------|----------|
| Category Badge | Jobs, Scholarships, Internships, Fellowships |
| Status Badge | Verified, Featured, Hot, New, Closing Soon |
| Tag/Chip | Removable, Read-only |

### Icons

Use **Lucide Icons** consistently:
- Briefcase (Jobs)
- GraduationCap (Scholarships)
- Laptop (Internships)
- Award (Fellowships)
- MapPin (Location)
- Calendar (Dates)
- Clock (Deadlines)
- Bookmark (Save)
- Share2 (Share)
- ArrowRight (CTAs)
- Search (Search)
- Filter (Filters)
- Menu (Mobile nav)
- X (Close)
- Check (Success)
- AlertTriangle (Warning)
- Info (Information)

---

## 📱 Mobile & Responsive Guidelines

### Breakpoints to Design

1. **Mobile (375px)** - Primary mobile design
2. **Tablet (768px)** - Tablet layout
3. **Desktop (1440px)** - Full desktop layout

### Mobile-Specific Patterns

1. **Bottom Navigation**: Tab bar for main navigation
2. **Bottom Sheets**: For filters and actions instead of sidebars
3. **Touch Targets**: Minimum 44px × 44px
4. **Thumb Zone**: Place primary actions in easy reach
5. **Full-Width Cards**: Single column layouts
6. **Swipeable Carousels**: For testimonials, partners
7. **Sticky Headers**: Fixed navigation with scroll
8. **Pull to Refresh**: Visual indicator (if applicable)

### Responsive Behavior

| Component | Mobile | Tablet | Desktop |
|-----------|--------|--------|---------|
| Hero Grid | Stacked | Stacked | 2 columns |
| Category Grid | 1-2 columns | 2 columns | 4 columns |
| Opportunity Grid | 1 column | 2 columns | 3 columns |
| Navigation | Bottom bar | Top bar | Top bar with full nav |
| Filters | Bottom sheet | Sidebar | Sidebar |
| Floating Stats | Hidden | Show 1 | Show all |

---

## ♿ Accessibility Requirements

### WCAG 2.1 Level AA Compliance

1. **Color Contrast**:
   - Text on backgrounds: 4.5:1 minimum ratio
   - Large text (18px+): 3:1 minimum ratio
   - Interactive elements: 3:1 minimum ratio

2. **Focus States**:
   - Visible focus rings on all interactive elements
   - Use 2px solid outline with offset
   - Focus color: `#2D8FDD` or high-contrast alternative

3. **Touch Targets**:
   - Minimum size: 44px × 44px
   - Adequate spacing between targets

4. **Text Alternatives**:
   - Alt text placeholders for images
   - Icon-only buttons should have labels

5. **Motion**:
   - Provide static alternatives for animations
   - Respect `prefers-reduced-motion`

6. **Semantic Structure**:
   - Proper heading hierarchy (H1 → H2 → H3)
   - Labeled form fields
   - Meaningful link text

---

## 🎬 Prototyping & Interactions

### Key Interactions to Prototype

1. **Navigation Flow**:
   - Home → Category Page → Opportunity Detail
   - Home → Search → Results → Detail
   - Login → Dashboard

2. **Micro-Interactions**:
   - Button hover states
   - Card hover lift effect
   - Bookmark toggle animation
   - Filter chip add/remove
   - Toast notification appearance

3. **Page Transitions**:
   - Smooth fade between pages
   - Slide-up for modals/sheets

4. **Carousels**:
   - Auto-advance featured opportunities
   - Manual navigation with dots/arrows
   - Swipe gestures (mobile)

5. **Form Interactions**:
   - Input focus/blur
   - Validation error states
   - Success confirmation

### Animation Specifications

| Animation | Duration | Easing |
|-----------|----------|--------|
| Fade In | 300ms | ease-out |
| Slide Up | 400ms | ease-out |
| Scale Up (hover) | 200ms | ease-in-out |
| Hover Lift | 200ms | ease-out |
| Toast Appear | 300ms | ease-out |
| Toast Dismiss | 200ms | ease-in |

---

## 🛠 Figma Setup Instructions

### 1. Create a New Figma Project

1. Open Figma and create a new design file
2. Name it: `BYN-K Platform - UI Design`

### 2. Set Up Pages

Create the following pages in your Figma file:

```
📁 BYN-K Platform
├── 📄 Cover
├── 📄 Design System
│   ├── Colors
│   ├── Typography
│   ├── Spacing & Grid
│   ├── Shadows & Effects
├── 📄 Components
│   ├── Buttons
│   ├── Inputs
│   ├── Cards
│   ├── Navigation
│   ├── Badges & Tags
│   ├── Overlays
├── 📄 Pages - Desktop (1440px)
│   ├── Home
│   ├── Categories
│   ├── Opportunity Detail
│   ├── Partners
│   ├── Partner Detail
│   ├── Auth (Login, Signup, Forgot Password)
│   ├── Dashboard
│   ├── Admin Panel
│   ├── About
│   ├── Error Pages
├── 📄 Pages - Mobile (375px)
│   ├── [Same pages as Desktop]
├── 📄 Prototypes
```

### 3. Set Up Styles

#### Color Styles
Create named color styles for each color in the palette:
- `Primary/Blue`
- `Primary/Dark`
- `Primary/Light`
- `Secondary/Gold`
- `Secondary/Gold Light`
- `Accent/Red`
- `Accent/Green`
- `Category/Jobs`
- `Category/Scholarships`
- `Category/Internships`
- `Category/Fellowships`
- `Neutral/Slate-900` through `Neutral/White`

#### Text Styles
Create text styles for each typography level:
- `Display/Desktop`, `Display/Mobile`
- `H1/Desktop`, `H1/Mobile`
- `H2/Desktop`, `H2/Mobile`
- `H3/Desktop`, `H3/Mobile`
- `Body/Large`, `Body/Regular`, `Body/Small`
- `Caption`

#### Effect Styles
Create effect styles for shadows:
- `Shadow/Card`
- `Shadow/Elevated`
- `Shadow/Gold Glow`
- `Shadow/Blue Glow`

### 4. Create Component Structure

Use Figma's component feature with variants:

```
Button
├── Variant: Primary | Secondary | Outline | Ghost
├── State: Default | Hover | Active | Disabled | Loading
├── Size: Small | Medium | Large

Input
├── Type: Text | Search | Select
├── State: Default | Focus | Error | Disabled | Filled
├── Has Icon: True | False

Card
├── Type: Opportunity | Partner | Category | Stat | Testimonial
```

### 5. Asset Checklist

Prepare these assets:
- [ ] Hero background image placeholder (1920 × 1080px)
- [ ] Partner logo placeholders (various sizes)
- [ ] User avatar placeholder
- [ ] Category icons
- [ ] Illustration for empty states
- [ ] Error page illustrations

---

## 📎 Submission Checklist

Before submitting your Figma link, ensure:

- [ ] **Design System** is complete with all colors, typography, and spacing
- [ ] **Component Library** has all variants and states
- [ ] **All Pages** are designed for Desktop (1440px)
- [ ] **Mobile Versions** are designed for key pages (375px)
- [ ] **Responsive** breakpoints are documented
- [ ] **Accessibility** color contrast is verified
- [ ] **Prototype** has key user flows connected
- [ ] **View Access** is enabled for mentors (Share > Anyone with link > Can view)

---

## 📝 Figma Link Placeholder

**🔗 Figma Design Link**: `[Insert your Figma link here with view access enabled]`

---

## 💡 Design Tips

1. **Consistency is Key**: Use the design system tokens throughout
2. **Mobile First**: Start with mobile designs, then scale up
3. **Real Content**: Use realistic placeholder text for opportunities
4. **User-Centric**: Remember the target audience - refugee youth
5. **Trust Signals**: Include verified badges, partner logos, testimonials
6. **Clear Hierarchy**: Guide users' eyes to important actions
7. **Breathing Room**: Don't overcrowd; use whitespace effectively
8. **Accessibility**: Test color contrast using Figma plugins like "Stark"

---

## 📚 Resources

- **Figma Learn**: [help.figma.com](https://help.figma.com)
- **Lucide Icons**: [lucide.dev](https://lucide.dev)
- **Color Contrast Checker**: [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- **Tailwind CSS Colors Reference**: [tailwindcss.com/docs/colors](https://tailwindcss.com/docs/customizing-colors)
- **WCAG Guidelines**: [w3.org/WAI/WCAG21/quickref](https://www.w3.org/WAI/WCAG21/quickref/)

---

*Document created for the BYN-K Platform - Opportunities for Banyamulenge Youth in Kenya*
*Last updated: February 2026*
