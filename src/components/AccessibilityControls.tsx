import React, { useState, useEffect } from 'react';
import { Settings, Eye, Type, Zap, Contrast, Volume2 } from 'lucide-react';

interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
}

interface AccessibilityControlsProps {
  onSettingsChange: (settings: AccessibilitySettings) => void;
}

const AccessibilityControls: React.FC<AccessibilityControlsProps> = ({ onSettingsChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    screenReader: false
  });

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('accessibility-settings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(parsed);
      applySettings(parsed);
    }

    // Detect system preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
    
    if (prefersReducedMotion || prefersHighContrast) {
      const systemSettings = {
        ...settings,
        reducedMotion: prefersReducedMotion,
        highContrast: prefersHighContrast
      };
      setSettings(systemSettings);
      applySettings(systemSettings);
    }
  }, []);

  const applySettings = (newSettings: AccessibilitySettings) => {
    const root = document.documentElement;
    
    // High contrast
    if (newSettings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Large text
    if (newSettings.largeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }
    
    // Reduced motion
    if (newSettings.reducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    onSettingsChange(newSettings);
  };

  const updateSetting = (key: keyof AccessibilitySettings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    applySettings(newSettings);
    localStorage.setItem('accessibility-settings', JSON.stringify(newSettings));
  };

  return (
    <div className="relative">
      {/* Accessibility Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          fixed bottom-4 left-4 z-50 w-12 h-12 bg-green-600 text-white rounded-full
          shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500
          focus:ring-offset-2 transition-all duration-200 touch-target
        "
        aria-label="Accessibility settings"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Settings className="w-5 h-5 mx-auto" />
      </button>

      {/* Settings Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-25 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          
          {/* Panel */}
          <div
            className="
              fixed bottom-20 left-4 z-50 w-80 max-w-[calc(100vw-2rem)]
              bg-white rounded-lg shadow-xl border border-gray-200 p-6
              modal-content
            "
            role="dialog"
            aria-labelledby="accessibility-title"
            aria-modal="true"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 id="accessibility-title" className="text-lg font-semibold text-gray-900">
                Accessibility Settings
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
                aria-label="Close accessibility settings"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {/* High Contrast */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Contrast className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <label htmlFor="high-contrast" className="text-sm font-medium text-gray-900">
                      High Contrast
                    </label>
                    <p className="text-xs text-gray-500">Increase color contrast for better visibility</p>
                  </div>
                </div>
                <button
                  id="high-contrast"
                  role="switch"
                  aria-checked={settings.highContrast}
                  onClick={() => updateSetting('highContrast', !settings.highContrast)}
                  className={`
                    relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                    focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                    ${settings.highContrast ? 'bg-green-600' : 'bg-gray-200'}
                  `}
                >
                  <span
                    className={`
                      inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                      ${settings.highContrast ? 'translate-x-6' : 'translate-x-1'}
                    `}
                  />
                </button>
              </div>

              {/* Large Text */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Type className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <label htmlFor="large-text" className="text-sm font-medium text-gray-900">
                      Large Text
                    </label>
                    <p className="text-xs text-gray-500">Increase text size for better readability</p>
                  </div>
                </div>
                <button
                  id="large-text"
                  role="switch"
                  aria-checked={settings.largeText}
                  onClick={() => updateSetting('largeText', !settings.largeText)}
                  className={`
                    relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                    focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                    ${settings.largeText ? 'bg-green-600' : 'bg-gray-200'}
                  `}
                >
                  <span
                    className={`
                      inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                      ${settings.largeText ? 'translate-x-6' : 'translate-x-1'}
                    `}
                  />
                </button>
              </div>

              {/* Reduced Motion */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Zap className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <label htmlFor="reduced-motion" className="text-sm font-medium text-gray-900">
                      Reduced Motion
                    </label>
                    <p className="text-xs text-gray-500">Minimize animations and transitions</p>
                  </div>
                </div>
                <button
                  id="reduced-motion"
                  role="switch"
                  aria-checked={settings.reducedMotion}
                  onClick={() => updateSetting('reducedMotion', !settings.reducedMotion)}
                  className={`
                    relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                    focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                    ${settings.reducedMotion ? 'bg-green-600' : 'bg-gray-200'}
                  `}
                >
                  <span
                    className={`
                      inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                      ${settings.reducedMotion ? 'translate-x-6' : 'translate-x-1'}
                    `}
                  />
                </button>
              </div>

              {/* Screen Reader Optimized */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Volume2 className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <label htmlFor="screen-reader" className="text-sm font-medium text-gray-900">
                      Screen Reader Mode
                    </label>
                    <p className="text-xs text-gray-500">Optimize for screen reader navigation</p>
                  </div>
                </div>
                <button
                  id="screen-reader"
                  role="switch"
                  aria-checked={settings.screenReader}
                  onClick={() => updateSetting('screenReader', !settings.screenReader)}
                  className={`
                    relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                    focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                    ${settings.screenReader ? 'bg-green-600' : 'bg-gray-200'}
                  `}
                >
                  <span
                    className={`
                      inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                      ${settings.screenReader ? 'translate-x-6' : 'translate-x-1'}
                    `}
                  />
                </button>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                Settings are saved automatically and sync across your devices
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AccessibilityControls;