export const themes = {
  default: {
    primary: '#8B5CF6',
    secondary: '#A78BFA',
    accent: '#C4B5FD',
    background: '#FFFFFF',
    surface: '#F8FAFC',
    text: '#1E293B',
  },
  ocean: {
    primary: '#0EA5E9',
    secondary: '#38BDF8',
    accent: '#7DD3FC',
    background: '#FFFFFF',
    surface: '#F0F9FF',
    text: '#0C4A6E',
  },
  forest: {
    primary: '#059669',
    secondary: '#10B981',
    accent: '#6EE7B7',
    background: '#FFFFFF',
    surface: '#F0FDF4',
    text: '#064E3B',
  },
  sunset: {
    primary: '#EA580C',
    secondary: '#FB923C',
    accent: '#FED7AA',
    background: '#FFFFFF',
    surface: '#FFF7ED',
    text: '#9A3412',
  },
  royal: {
    primary: '#7C3AED',
    secondary: '#A855F7',
    accent: '#DDD6FE',
    background: '#FFFFFF',
    surface: '#FAF5FF',
    text: '#581C87',
  },
};

export const applyTheme = (theme: keyof typeof themes, isDark: boolean) => {
  const colors = themes[theme];
  const root = document.documentElement;
  
  // Apply dark/light mode class
  if (isDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  
  // Convert hex to HSL and apply theme colors
  const primaryHsl = hexToHsl(colors.primary);
  const secondaryHsl = hexToHsl(colors.secondary);
  const accentHsl = hexToHsl(colors.accent);
  
  if (isDark) {
    // Dark mode with theme colors
    root.style.setProperty('--background', '224 71% 4%');
    root.style.setProperty('--foreground', '213 31% 91%');
    root.style.setProperty('--card', '224 71% 4%');
    root.style.setProperty('--card-foreground', '213 31% 91%');
    root.style.setProperty('--popover', '224 71% 4%');
    root.style.setProperty('--popover-foreground', '213 31% 91%');
    root.style.setProperty('--primary', primaryHsl);
    root.style.setProperty('--primary-foreground', '213 31% 91%');
    root.style.setProperty('--secondary', '215 28% 17%');
    root.style.setProperty('--secondary-foreground', '213 31% 91%');
    root.style.setProperty('--muted', '223 47% 11%');
    root.style.setProperty('--muted-foreground', '215.4 16.3% 56.9%');
    root.style.setProperty('--accent', '216 34% 17%');
    root.style.setProperty('--accent-foreground', '213 31% 91%');
    root.style.setProperty('--border', '216 34% 17%');
    root.style.setProperty('--input', '216 34% 17%');
    root.style.setProperty('--ring', primaryHsl);
  } else {
    // Light mode with theme colors
    root.style.setProperty('--background', '0 0% 100%');
    root.style.setProperty('--foreground', '224 71% 4%');
    root.style.setProperty('--card', '0 0% 100%');
    root.style.setProperty('--card-foreground', '224 71% 4%');
    root.style.setProperty('--popover', '0 0% 100%');
    root.style.setProperty('--popover-foreground', '224 71% 4%');
    root.style.setProperty('--primary', primaryHsl);
    root.style.setProperty('--primary-foreground', '0 0% 100%');
    root.style.setProperty('--secondary', '210 40% 96%');
    root.style.setProperty('--secondary-foreground', '224 71% 4%');
    root.style.setProperty('--muted', '210 40% 96%');
    root.style.setProperty('--muted-foreground', '215.4 16.3% 46.9%');
    root.style.setProperty('--accent', '210 40% 96%');
    root.style.setProperty('--accent-foreground', '224 71% 4%');
    root.style.setProperty('--border', '214.3 31.8% 91.4%');
    root.style.setProperty('--input', '214.3 31.8% 91.4%');
    root.style.setProperty('--ring', primaryHsl);
  }
};

function hexToHsl(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}