# CkStock V2 Design System

> Design system for CkStock — Cloud Inventory & Procurement Management SaaS

---

## 1. Brand Identity

### 1.1 Logo
- **Type**: Vector SVG with gradient (Blue `#2563EB` → Purple `#7C3AED`)
- **Variants**: `Logo.jsx` component with `size` prop (`sm`/`md`/`lg`/`xl`)
- **Light Mode**: Blue `#2563EB` → Purple gradient
- **Dark Mode**: Blue `#3B82F6` → Purple `#8B5CF6` gradient
- **Text**: "Ck" in gradient, "Stock" in `--color-foreground`

### 1.2 Color Palette

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--color-background` | `#F8FAFC` | `#0A0E17` | Page background |
| `--color-foreground` | `#0F172A` | `#E8EDF5` | Primary text |
| `--color-muted` | `#F1F5F9` | `#131A26` | Subtle surfaces |
| `--color-muted-foreground` | `#64748B` | `#8896A6` | Secondary text |
| `--color-primary` | `#2563EB` | `#3B82F6` | Buttons, links, active states |
| `--color-primary-foreground` | `#FFFFFF` | `#FFFFFF` | Text on primary |
| `--color-primary-light` | `#DBEAFE` | `#1E3A5F` | Primary bg hover |
| `--color-success` | `#059669` | `#10B981` | Success states |
| `--color-warning` | `#D97706` | `#F59E0B` | Warning states |
| `--color-danger` | `#E11D48` | `#F43F5E` | Error/danger states |
| `--color-accent-purple` | `#7C3AED` | `#8B5CF6` | Purple accent |
| `--color-accent-cyan` | `#06B6D4` | `#22D3EE` | Cyan accent |
| `--color-accent-pink` | `#EC4899` | `#F472B6` | Pink accent |
| `--color-border` | `#E2E8F0` | `#1E293B` | Borders, dividers |

### 1.3 Typography
- **Primary font**: Inter (Latin), Noto Sans Hebrew (Hebrew)
- **Weights**: 300 (Light), 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold), 800 (ExtraBold), 900 (Black)
- **Mono font**: JetBrains Mono (for code/data)
- **Scale**: Tailwind default scale (text-sm: 14px, text-base: 16px, text-lg: 18px, text-xl: 20px, text-2xl: 24px, text-3xl: 30px)

---

## 2. Design Tokens (CSS Variables)

All tokens defined in `src/index.css` under `:root` (light) and `.dark` (dark).

### 2.1 Surfaces

| Class | Description | Light | Dark |
|-------|-------------|-------|------|
| `glass` | Blur(16px) + saturate(180%) translucent bg | White/0.6 bg | Dark/0.6 bg |
| `glass-sm` | Blur(8px) + saturate(160%) | Subtle glass | Subtle dark glass |
| `glass-lg` | Blur(24px) + saturate(200%) | Strong glass | Strong dark glass |
| `glass-card` | Pre-styled card with glass + shadow + radius | `.glass` + border-radius | `.glass` + dark shadow |
| `neu` | Neumorphic (5px shadow offset) | Beige bg | Dark bg |
| `neu-sm` | Neumorphic (3px offset) | Subtle | Subtle |
| `neu-lg` | Neumorphic (8px offset) | Pronounced | Pronounced |
| `neu-inset` | Inset neumorphism (pressed look) | Inset | Inset |
| `glass-neu` | Hybrid glass + neumorphism | Glass + soft shadows | Glass + dark shadows |

### 2.2 Gradients
- `gradient-primary`: Blue → Purple (135°)
- `gradient-accent`: Cyan → Purple (135°)
- `gradient-warm`: Pink → Amber (135°)

### 2.3 Shadows
- `shadow-glass-sm`, `shadow-glass`, `shadow-glass-lg`: Light multi-layered shadows
- `shadow-glass-dark-sm`, `shadow-glass-dark`, `shadow-glass-dark-lg`: Dark variants
- `shadow-neu-sm`, `shadow-neu`, `shadow-neu-lg`: Neumorphism shadows
- `shadow-neu-sm-dark`, `shadow-neu-dark`, `shadow-neu-lg-dark`: Dark neumorphism shadows

### 2.4 Animations
- `animate-fade-in`: Opacity 0→1 over 0.5s
- `animate-slide-up`: Slide up + fade over 0.4s
- `animate-slide-in-right`: Slide in from right over 0.3s
- `animate-scale-in`: Scale 0.95→1 + fade over 0.3s
- `animate-glow`: Pulsing glow effect (2s loop)
- `animate-float`: Floating animation (6s loop)

---

## 3. Component Architecture

### 3.1 Theme System
- **Provider**: `ThemeContext.jsx` wraps the app
- **Hook**: `useTheme()` returns `{ theme, toggleTheme, setTheme }`
- **Persistence**: `localStorage` key `ckstock-theme`
- **System detection**: Listens to `prefers-color-scheme` media query
- **Flash prevention**: Inline `<script>` in `index.html` adds `.dark` class before React loads

### 3.2 Layout
- **Sidebar**: Fixed RTL sidebar with glassmorphism effect, responsive (slide-in on mobile)
  - Logo at top
  - Primary navigation (Dashboard, Price Comparison, Add Product)
  - Secondary navigation (Reports, Inventory, Settings — disabled, "בקרוב" badges)
  - Bottom: Theme toggle + Logout
- **Header**: Glass sticky header with page title, theme toggle button, user avatar
- **Main Content**: Flex-1 with max-w-7xl container, fade-in animation

### 3.3 Dashboard (V2 Enhanced)
- Glass cards for stats widgets (Total Products, Low Stock Alerts, Expiring Items)
- Best Sellers widget placeholder (uses accent-purple icon)
- Inventory Value widget placeholder (uses primary icon)
- Inventory table with glass-style title row

---

## 4. Dark Mode

### 4.1 Activation
- Toggle via sidebar button or header icon
- Follows system preference by default
- Persisted to localStorage

### 4.2 Color Adjustments
- Background: Near-black `#0A0E17` with subtle blue undertone
- Primary: Brighter blue `#3B82F6` for contrast
- Cards: Use `--glass-bg` with dark semi-transparency
- Text: Warm off-white `#E8EDF5`
- Borders: Dark navy `#1E293B`

### 4.3 Best Practices
- All components use CSS variables (not hardcoded colors)
- Smooth transitions (0.25s) for all color/background/border changes
- `color-scheme: light dark` on html element for native form controls

---

## 5. Usage Examples

### Glass Card
```jsx
<div className="glass-card p-6">
  <h3 className="text-lg font-bold text-foreground">כותרת</h3>
  <p className="text-muted-foreground">תוכן הכרטיס</p>
</div>
```

### Neumorphic Button
```jsx
<button className="neu-sm px-6 py-3 text-foreground font-bold">
  לחץ כאן
</button>
```

### Theme Aware
```jsx
import { useTheme } from '../context/ThemeContext';

const Component = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={isDark ? 'bg-muted' : 'bg-white'}>
      {/* content */}
    </div>
  );
};
```

---

## 6. File Reference

| File | Purpose |
|------|---------|
| `tailwind.config.js` | Design tokens, shadows, animations, colors |
| `src/index.css` | CSS variables, glass/neu utility classes |
| `src/context/ThemeContext.jsx` | Dark/light mode context provider |
| `src/components/Logo.jsx` | Vector SVG logo component |
| `src/layout/Layout.jsx` | App shell with sidebar, header, theme toggle |
| `src/pages/Dashboard.jsx` | Updated dashboard with glass cards |
| `index.html` | Font loading + theme flash prevention |
| `DESIGN_SYSTEM.md` | This documentation |

## 7. Future V2 Enhancements
- Advanced widgets with charts (Best Sellers, Inventory Value)
- Barcode/QR scanner integration
- Push notifications
- PDF/Excel export
- Global search bar in header
- Animations micro-interactions