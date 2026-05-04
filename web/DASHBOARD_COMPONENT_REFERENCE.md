# 📊 Dashboard Component Reference

## Component Architecture

```
Dashboard (Main Page)
├── Header
│   ├── Title
│   ├── Description
│   └── Loading Indicator
├── KPI Section
│   ├── KPICard - Total Power
│   ├── KPICard - Active Inverters
│   ├── KPICard - Alerts
│   └── KPICard - Efficiency
├── Charts Section
│   ├── ChartCard
│   │   └── InverterTrendChart (Line Chart)
│   └── ChartCard
│       └── PowerDistributionChart (Bar Chart)
└── Risk & Summary Section
    ├── Risk Cards
    │   ├── RiskCard (Inverter 1)
    │   ├── RiskCard (Inverter 2)
    │   └── RiskCard (Inverter N)
    └── SummaryPanel
        ├── AI Summary
        └── Quick Stats
```

---

## Import Map

### From `Card.jsx`
```javascript
import { Card, KPICard, ChartCard, Badge } from './components/Card';

// Card - Base component
<Card className="p-6">Content</Card>

// KPICard - Key Performance Indicator
<KPICard 
  title="Total Power"
  value={2400}
  unit="kW"
  icon={Zap}
  color="solar"
  trend="12"
  trendUp={true}
/>

// ChartCard - Chart container
<ChartCard title="Power Distribution">
  <YourChart />
</ChartCard>

// Badge - Status indicator
<Badge status="success" label="Active" icon={Check} />
```

### From `SkeletonLoader.jsx`
```javascript
import { SkeletonLoader } from './components/SkeletonLoader';

// Card skeleton
<SkeletonLoader count={4} type="card" />

// Chart skeleton
<SkeletonLoader type="chart" />

// Table skeleton
<SkeletonLoader count={5} type="table" />
```

### From Chart Components
```javascript
import InverterTrendChart from './components/InverterTrendChart';
import PowerDistributionChart from './components/PowerDistributionChart';
```

---

## Data Flow

### KPI Calculation
```
API Response (riskData)
    ↓
Dashboard.jsx
    ↓
├─→ totalPower = sum(inv.power)
├─→ activeInverters = count(status !== 'offline')
├─→ alertsCount = count(riskScore > 0.5)
└─→ avgEfficiency = average(inv.efficiency)
    ↓
KPI Components Render
```

### Chart Data Flow
```
Mock/API Data
    ↓
InverterTrendChart / PowerDistributionChart
    ↓
Recharts Components
    ↓
Rendered Charts with Tooltips & Legends
```

### Risk Cards Flow
```
API Response (riskData)
    ↓
Map to RiskCard Components
    ↓
Calculate Risk Level (Critical/Warning/Good)
    ↓
Render with Progress Bar & Badges
```

---

## Styling Classes Reference

### Card Styling
```
bg-white           # White background
rounded-2xl        # 16px border radius
shadow-sm          # Soft shadow
hover:shadow-md    # Enhanced shadow on hover
border border-gray-100  # Subtle border
transition-shadow duration-300  # Smooth transitions
```

### KPI Card Styling
```
p-6                # 24px padding
flex items-start justify-between  # Layout
gap-4              # Space between content & icon
text-3xl font-bold # Large value
text-sm text-gray-600  # Label styling
bg-gradient-to-br from-orange-50 to-amber-50  # Gradient BG
```

### Badge Styling
```
bg-green-100 text-green-700  # Success
bg-yellow-100 text-yellow-700  # Warning
bg-red-100 text-red-700  # Error
bg-blue-100 text-blue-700  # Info
bg-gray-100 text-gray-700  # Default
border border-{color}-200  # Border color
px-3 py-1.5  # Padding
rounded-full  # Pill shape
```

### Grid Layouts
```
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6
# KPI: 1 column (mobile), 2 columns (tablet), 4 columns (desktop)

grid grid-cols-1 lg:grid-cols-2 gap-6
# Charts: 1 column (mobile), 2 columns (desktop)

grid grid-cols-1 lg:grid-cols-3 gap-6
# Risk + Summary: 1 column (mobile), 3 columns (desktop)
```

### Loading States
```
animate-pulse  # Pulsing animation for skeletons
animate-spin   # Spinning animation for loader icon
opacity-50     # Disabled state opacity
```

---

## Icon Usage (Lucide React)

### Available Icons in Project
```javascript
// Power & Energy
Zap              // Total Power
TrendingUp       // Efficiency, positive trend
TrendingDown     // Negative trend
Activity         // Active status
AlertTriangle    // Alert/Warning
CheckCircle      // Success status
AlertCircle      // Info alert
Loader2          // Loading spinner
```

### Icon Usage in Components
```javascript
import { Zap, TrendingUp, AlertTriangle } from 'lucide-react';

// In components
<Zap className="w-5 h-5 text-orange-600" strokeWidth={1.5} />

// Size options
w-4 h-4   # 16px (small)
w-5 h-5   # 20px (default)
w-6 h-6   # 24px (medium)
w-8 h-8   # 32px (large)

// Stroke width
strokeWidth={1}    # Thin
strokeWidth={1.5}  # Normal
strokeWidth={2}    # Bold
```

---

## Color System

### Status Colors
```
Success: #10b981 (Green)
- bg-green-50, bg-green-100, bg-green-600, text-green-700

Warning: #f59e0b (Yellow)
- bg-yellow-50, bg-yellow-100, bg-yellow-600, text-yellow-700

Error: #ef4444 (Red)
- bg-red-50, bg-red-100, bg-red-600, text-red-700

Info: #3b82f6 (Blue)
- bg-blue-50, bg-blue-100, bg-blue-600, text-blue-700
```

### Theme Colors
```
Primary: #3b82f6 (Blue)
- Used for primary actions, focus states

Solar: #f97316 (Orange)
- Theme color for solar energy

Neutral: #9ca3af (Gray-400)
- Used for labels, secondary text, axes

Background: #f9fafb (Gray-50)
- Main dashboard background

Card: #ffffff (White)
- Card backgrounds
```

---

## Responsive Behavior

### Mobile (< 640px)
- Single column layouts
- Full-width cards
- Stacked headers
- Large touch targets

### Tablet (640px - 1024px)
- 2 column grids
- Adjusted spacing
- Optimized for touch

### Desktop (> 1024px)
- Multi-column layouts
- Maximum content display
- Full chart visibility
- Hover effects enabled

---

## Interactive Elements

### Hover Effects
```css
/* Cards */
hover:shadow-md
hover:border-gray-200

/* Buttons */
hover:scale-105
hover:shadow-lg

/* Icons */
hover:text-gray-600
transition-colors duration-300

/* Badges */
Active dot with 6px radius
```

### Transitions
```css
transition-shadow duration-300   # Shadow change
transition-all duration-300      # All properties
transition-colors duration-300   # Color change
transition-transform duration-300 # Scale/position
```

### Animations
```css
animate-pulse      # Skeleton loaders
animate-spin       # Loading spinner
/* Custom: blob animation in backgrounds */
```

---

## Code Snippets

### Using KPICard
```jsx
import { KPICard } from './components/Card';
import { Zap, Activity, AlertTriangle, TrendingUp } from 'lucide-react';

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  <KPICard
    title="Total Power"
    value={Math.round(totalPower / 1000)}
    unit="kW"
    icon={Zap}
    color="solar"
    trend="12"
    trendUp={true}
  />
  <KPICard
    title="Active Inverters"
    value={activeInverters}
    unit={`/ ${riskData.length}`}
    icon={Activity}
    color="success"
  />
</div>
```

### Using Charts
```jsx
import InverterTrendChart from './components/InverterTrendChart';
import PowerDistributionChart from './components/PowerDistributionChart';

<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <InverterTrendChart />
  <PowerDistributionChart />
</div>
```

### Using Skeleton Loaders
```jsx
import { SkeletonLoader } from './components/SkeletonLoader';

{isLoading ? (
  <>
    <SkeletonLoader count={4} type="card" />
    <SkeletonLoader count={2} type="chart" />
  </>
) : (
  <YourContent />
)}
```

### Using Badges
```jsx
import { Badge } from './components/Card';
import { CheckCircle, AlertCircle } from 'lucide-react';

<Badge status="success" label="Active" icon={CheckCircle} size="md" />
<Badge status="warning" label="Warning" icon={AlertCircle} size="md" />
```

---

## Performance Metrics

### Build Size
- Recharts: ~200KB (50KB gzipped)
- New Components: ~30KB
- **Total:** Build in 7.35 seconds

### Bundle Analysis
```
Main chunks:
- react, react-dom: ~200KB (shared)
- tailwindcss: ~50KB
- recharts: ~200KB
- daisyui: ~50KB
- app code: ~50KB
```

### Optimization Options
1. **Code Splitting** - Lazy load charts
2. **Memoization** - Prevent unnecessary re-renders
3. **Virtual Lists** - For many risk cards
4. **Chart Debouncing** - Reduce re-renders

---

## Testing Checklist

### Visual Tests
- [ ] KPI cards render with icons
- [ ] Charts display without errors
- [ ] Status badges show correct colors
- [ ] Risk cards show progress bars
- [ ] Skeleton loaders animate
- [ ] Responsive on all screen sizes

### Functional Tests
- [ ] Dashboard loads data on mount
- [ ] Auto-refresh works (30s interval)
- [ ] Charts are interactive
- [ ] Tooltips appear on hover
- [ ] Error handling works
- [ ] Loading states display

### Performance Tests
- [ ] Page loads in < 2s
- [ ] Charts render smoothly
- [ ] No layout shift
- [ ] Memory usage stable

---

## Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| Charts blank | Check data format, verify Recharts imported |
| Icons not showing | Verify lucide-react installed, check imports |
| Styles not applied | Check Tailwind config, verify content glob |
| Build fails | Run `npm install --legacy-peer-deps`, clear cache |
| Data not updating | Check API call, verify useEffect dependencies |
| Skeleton not animating | Check animate-pulse class, verify Tailwind CSS |

---

## File Locations

```
src/
├── components/
│   ├── Card.jsx                    # KPICard, ChartCard, Badge
│   ├── SkeletonLoader.jsx          # Loading placeholders
│   ├── InverterTrendChart.jsx      # Line chart
│   ├── PowerDistributionChart.jsx  # Bar chart
│   ├── RiskCard.jsx                # Enhanced risk display
│   ├── TrendCard.jsx               # Chart wrapper
│   ├── SummaryPanel.jsx            # Summary display
│   └── ...
├── pages/
│   ├── Dashboard.jsx               # Main dashboard page
│   ├── DashboardLayout.jsx         # Layout wrapper
│   └── ...
└── api/
    └── predictionApi.js            # API calls
```

---

This is your reference for the modern dashboard! 🚀

