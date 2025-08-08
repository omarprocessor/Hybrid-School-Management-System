# 🎨 Theme Customization Guide

This guide explains how to change the theme of the School Management System by directly editing the CSS file.

## 🌈 Available Themes

The application includes 6 pre-built themes that can be applied by modifying the CSS file:

### 1. Default Blue (Professional)
- **Primary**: `#3F51B5` (Indigo Blue)
- **Secondary**: `#FF5722` (Deep Orange)
- **Best for**: Corporate schools, professional institutions

### 2. Nature Green (Eco-friendly)
- **Primary**: `#4CAF50` (Green)
- **Secondary**: `#8BC34A` (Light Green)
- **Best for**: Environmental schools, nature-focused institutions

### 3. Sports Red (Energetic)
- **Primary**: `#F44336` (Red)
- **Secondary**: `#FF5722` (Deep Orange)
- **Best for**: Sports academies, athletic institutions

### 4. Arts Purple (Creative)
- **Primary**: `#9C27B0` (Purple)
- **Secondary**: `#E91E63` (Pink)
- **Best for**: Art schools, creative institutions

### 5. Warm Orange (Friendly)
- **Primary**: `#FF9800` (Orange)
- **Secondary**: `#FF5722` (Deep Orange)
- **Best for**: Community schools, friendly environments

### 6. Ocean Teal (Calming)
- **Primary**: `#009688` (Teal)
- **Secondary**: `#26A69A` (Teal Light)
- **Best for**: Wellness schools, meditation centers

## 🛠️ How to Change Themes

### Method 1: Apply Existing Theme

1. **Open the CSS file**: Navigate to `front-end/src/App.css`

2. **Find the theme section**: Look for the section with theme classes (around lines 79-143)

3. **Apply a theme**: Add the theme class to the `<body>` element in your HTML or modify the CSS variables directly

**Option A: Add theme class to body**
```html
<body class="theme-green">
  <!-- Your app content -->
</body>
```

**Option B: Modify CSS variables directly**
```css
:root {
  --primary: #4CAF50;           /* Green theme primary */
  --primary-light: #66BB6A;     /* Green theme primary light */
  --primary-dark: #388E3C;      /* Green theme primary dark */
  --primary-hover: #43A047;     /* Green theme primary hover */
  --secondary: #8BC34A;         /* Green theme secondary */
  --secondary-light: #9CCC65;   /* Green theme secondary light */
  --secondary-dark: #689F38;    /* Green theme secondary dark */
}
```

### Method 2: Create Custom Theme

1. **Open the CSS file**: Navigate to `front-end/src/App.css`

2. **Add your custom theme class**: Add a new theme class after the existing ones:

```css
/* Custom Theme (Your School) */
.theme-custom {
  --primary: #YOUR_PRIMARY_COLOR;
  --primary-light: #YOUR_PRIMARY_LIGHT_COLOR;
  --primary-dark: #YOUR_PRIMARY_DARK_COLOR;
  --primary-hover: #YOUR_PRIMARY_HOVER_COLOR;
  --secondary: #YOUR_SECONDARY_COLOR;
  --secondary-light: #YOUR_SECONDARY_LIGHT_COLOR;
  --secondary-dark: #YOUR_SECONDARY_DARK_COLOR;
}
```

3. **Apply your custom theme**: Add the class to the body element:
```html
<body class="theme-custom">
  <!-- Your app content -->
</body>
```

## 🎯 Quick Theme Changes

### To apply Green theme:
```css
:root {
  --primary: #4CAF50;
  --primary-light: #66BB6A;
  --primary-dark: #388E3C;
  --primary-hover: #43A047;
  --secondary: #8BC34A;
  --secondary-light: #9CCC65;
  --secondary-dark: #689F38;
}
```

### To apply Red theme:
```css
:root {
  --primary: #F44336;
  --primary-light: #EF5350;
  --primary-dark: #D32F2F;
  --primary-hover: #E53935;
  --secondary: #FF5722;
  --secondary-light: #FF7043;
  --secondary-dark: #D84315;
}
```

### To apply Purple theme:
```css
:root {
  --primary: #9C27B0;
  --primary-light: #BA68C8;
  --primary-dark: #7B1FA2;
  --primary-hover: #8E24AA;
  --secondary: #E91E63;
  --secondary-light: #F06292;
  --secondary-dark: #C2185B;
}
```

### To apply Orange theme:
```css
:root {
  --primary: #FF9800;
  --primary-light: #FFB74D;
  --primary-dark: #F57C00;
  --primary-hover: #FB8C00;
  --secondary: #FF5722;
  --secondary-light: #FF7043;
  --secondary-dark: #D84315;
}
```

### To apply Teal theme:
```css
:root {
  --primary: #009688;
  --primary-light: #4DB6AC;
  --primary-dark: #00796B;
  --primary-hover: #00897B;
  --secondary: #26A69A;
  --secondary-light: #80CBC4;
  --secondary-dark: #00695C;
}
```

## 🔧 Advanced Customization

### Color Variables Reference

The theme system uses these CSS variables:

```css
:root {
  /* Primary Colors */
  --primary: #3F51B5;           /* Main brand color */
  --primary-light: #5C6BC0;     /* Lighter shade */
  --primary-dark: #283593;      /* Darker shade */
  --primary-hover: #32408F;     /* Hover state */
  
  /* Secondary Colors */
  --secondary: #FF5722;         /* Secondary brand color */
  --secondary-light: #FF7043;   /* Lighter shade */
  --secondary-dark: #D84315;    /* Darker shade */
  
  /* Background Colors */
  --bg-primary: #ffffff;        /* Main background */
  --bg-secondary: #F5F7FA;      /* Secondary background */
  --bg-light: #f8f9fa;          /* Light background */
  --bg-dark: #2E2E2E;           /* Dark background */
  
  /* Text Colors */
  --text-primary: #2E2E2E;      /* Primary text */
  --text-secondary: #666666;    /* Secondary text */
  --text-light: #ffffff;        /* Light text */
  --text-muted: #999999;        /* Muted text */
  
  /* Status Colors */
  --success: #4CAF50;           /* Success/Green */
  --success-light: #81C784;     /* Light success */
  --warning: #FF9800;           /* Warning/Orange */
  --warning-light: #FFB74D;     /* Light warning */
  --error: #F44336;             /* Error/Red */
  --error-light: #E57373;       /* Light error */
  --info: #2196F3;              /* Info/Blue */
  --info-light: #64B5F6;        /* Light info */
}
```

### Creating a Complete Custom Theme

1. **Choose your primary color**: This will be your main brand color
2. **Generate color variations**: Use a color tool to create lighter and darker shades
3. **Choose a secondary color**: This should complement your primary color
4. **Test the theme**: Apply it and check how it looks across all components

### Example Custom Theme

```css
/* Custom School Theme */
.theme-myschool {
  --primary: #2E7D32;           /* Forest Green */
  --primary-light: #4CAF50;     /* Light Green */
  --primary-dark: #1B5E20;      /* Dark Green */
  --primary-hover: #388E3C;     /* Hover Green */
  --secondary: #FF6F00;         /* Amber Orange */
  --secondary-light: #FF8F00;   /* Light Amber */
  --secondary-dark: #E65100;    /* Dark Amber */
}
```

## 📱 Testing Your Theme

After applying a theme:

1. **Check all pages**: Navigate through different sections of the application
2. **Test responsive design**: View on different screen sizes
3. **Verify accessibility**: Ensure good contrast ratios
4. **Check all components**: Verify buttons, forms, tables, and navigation

## 🎨 Color Tools

Use these tools to help create your custom theme:

- **Color Palette Generators**: Adobe Color, Coolors, Paletton
- **Color Contrast Checkers**: WebAIM Contrast Checker
- **Color Scheme Generators**: Material Design Color Tool

## ⚠️ Important Notes

- **Backup your changes**: Always keep a backup of the original CSS file
- **Test thoroughly**: Changes affect the entire application
- **Consider accessibility**: Ensure sufficient contrast for text readability
- **Mobile compatibility**: Test on mobile devices to ensure the theme works well

---

This approach gives you complete control over the theme while maintaining the flexibility of the CSS variable system. 