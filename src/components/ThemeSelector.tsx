import React, { useState } from 'react';
import { Sun, Moon, Monitor, Palette, Check, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeSelector = () => {
  const { baseTheme, colorTheme, setBaseTheme, setColorTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const baseThemeIcons = {
    light: Sun,
    dark: Moon,
    system: Monitor
  };

  const colorThemes = [
    { id: 'default', name: 'Default', colors: ['bg-blue-500', 'bg-gray-400', 'bg-green-500'] },
    { id: 'blue', name: 'Ocean', colors: ['bg-blue-600', 'bg-slate-400', 'bg-cyan-500'] },
    { id: 'green', name: 'Forest', colors: ['bg-green-600', 'bg-gray-400', 'bg-emerald-500'] },
    { id: 'purple', name: 'Cosmic', colors: ['bg-purple-600', 'bg-gray-400', 'bg-violet-500'] },
    { id: 'pink', name: 'Sunset', colors: ['bg-pink-600', 'bg-gray-400', 'bg-rose-500'] },
    { id: 'orange', name: 'Autumn', colors: ['bg-orange-600', 'bg-gray-400', 'bg-amber-500'] },
    { id: 'red', name: 'Fire', colors: ['bg-red-600', 'bg-gray-400', 'bg-rose-500'] },
    { id: 'indigo', name: 'Night', colors: ['bg-indigo-600', 'bg-gray-400', 'bg-blue-500'] }
  ];

  const getNextBaseTheme = () => {
    const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(baseTheme);
    return themes[(currentIndex + 1) % themes.length];
  };

  const handleBaseThemeChange = () => {
    const nextTheme = getNextBaseTheme();
    setBaseTheme(nextTheme);
  };

  const BaseThemeIcon = baseThemeIcons[baseTheme];

  return (
    <div className="relative">
      {/* Base Theme Toggle */}
      <div className="flex items-center space-x-2">
        <button
          onClick={handleBaseThemeChange}
          className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title={`Current: ${baseTheme} theme - Click to change`}
        >
          <BaseThemeIcon className="h-4 w-4" />
        </button>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title="Choose color theme"
        >
          <Palette className="h-4 w-4" />
        </button>
      </div>

      {/* Color Theme Selector Modal */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Modal */}
          <div className="absolute right-0 top-12 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-6 w-80 z-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Choose Theme
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Base Theme Selection */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Base Theme
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {(['light', 'dark', 'system'] as const).map((theme) => {
                  const Icon = baseThemeIcons[theme];
                  return (
                    <button
                      key={theme}
                      onClick={() => setBaseTheme(theme)}
                      className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all ${
                        baseTheme === theme
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      <Icon className="h-5 w-5 mb-1" />
                      <span className="text-xs capitalize">{theme}</span>
                      {baseTheme === theme && (
                        <Check className="h-3 w-3 text-blue-500 mt-1" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Color Theme Selection */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Color Theme
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {colorThemes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setColorTheme(theme.id as any)}
                    className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-all ${
                      colorTheme === theme.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <div className="flex space-x-1">
                      {theme.colors.map((color, index) => (
                        <div
                          key={index}
                          className={`w-3 h-3 rounded-full ${color}`}
                        />
                      ))}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium">{theme.name}</div>
                      {colorTheme === theme.id && (
                        <Check className="h-3 w-3 text-blue-500 mt-1" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeSelector;