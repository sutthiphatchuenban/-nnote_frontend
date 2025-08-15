import React, { createContext, useContext, useState, useEffect } from 'react';

type BaseTheme = 'light' | 'dark' | 'system';
type ColorTheme = 'default' | 'blue' | 'green' | 'purple' | 'pink' | 'orange' | 'red' | 'indigo';

interface ThemeContextType {
  baseTheme: BaseTheme;
  colorTheme: ColorTheme;
  setBaseTheme: (theme: BaseTheme) => void;
  setColorTheme: (theme: ColorTheme) => void;
  currentTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const colorThemes = {
  default: {
    primary: 'blue',
    secondary: 'gray',
    accent: 'green'
  },
  blue: {
    primary: 'blue',
    secondary: 'slate',
    accent: 'cyan'
  },
  green: {
    primary: 'green',
    secondary: 'gray',
    accent: 'emerald'
  },
  purple: {
    primary: 'purple',
    secondary: 'gray',
    accent: 'violet'
  },
  pink: {
    primary: 'pink',
    secondary: 'gray',
    accent: 'rose'
  },
  orange: {
    primary: 'orange',
    secondary: 'gray',
    accent: 'amber'
  },
  red: {
    primary: 'red',
    secondary: 'gray',
    accent: 'rose'
  },
  indigo: {
    primary: 'indigo',
    secondary: 'gray',
    accent: 'blue'
  }
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [baseTheme, setBaseTheme] = useState<BaseTheme>(() => {
    const savedTheme = localStorage.getItem('baseTheme') as BaseTheme;
    return savedTheme || 'system';
  });

  const [colorTheme, setColorTheme] = useState<ColorTheme>(() => {
    const savedColorTheme = localStorage.getItem('colorTheme') as ColorTheme;
    return savedColorTheme || 'default';
  });

  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const root = window.document.documentElement;
    
    const getSystemTheme = (): 'light' | 'dark' => {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    const applyTheme = (base: BaseTheme, color: ColorTheme) => {
      let actualTheme: 'light' | 'dark';
      
      if (base === 'system') {
        actualTheme = getSystemTheme();
      } else {
        actualTheme = base;
      }

      setCurrentTheme(actualTheme);
      
      // Remove all theme classes
      root.classList.remove('light', 'dark');
      Object.keys(colorThemes).forEach(theme => {
        root.classList.remove(`theme-${theme}`);
      });
      
      // Add base theme class
      if (actualTheme === 'dark') {
        root.classList.add('dark');
      }
      
      // Add color theme class
      root.classList.add(`theme-${color}`);
      
      // Set color scheme
      root.style.colorScheme = actualTheme;

      // Apply CSS custom properties for the color theme
      const theme = colorThemes[color];
      root.style.setProperty('--color-primary', theme.primary);
      root.style.setProperty('--color-secondary', theme.secondary);
      root.style.setProperty('--color-accent', theme.accent);
    };

    applyTheme(baseTheme, colorTheme);
    localStorage.setItem('baseTheme', baseTheme);
    localStorage.setItem('colorTheme', colorTheme);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (baseTheme === 'system') {
        applyTheme(baseTheme, colorTheme);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [baseTheme, colorTheme]);

  const value = {
    baseTheme,
    colorTheme,
    setBaseTheme,
    setColorTheme,
    currentTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};