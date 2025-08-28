import React from 'react';
import { Code, ChevronDown } from 'lucide-react';

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
  supportedLanguages: { value: string; label: string; status: 'active' | 'coming-soon' }[];
  isDarkMode?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onLanguageChange,
  supportedLanguages,
  isDarkMode = false
}) => {
  return (
    <div className={`rounded-lg shadow-lg border p-4 transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center gap-2 mb-3">
        <Code size={16} className={isDarkMode ? 'text-gray-300' : 'text-gray-600'} />
        <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Language</h3>
      </div>
      
      <div className="relative">
        <select
          value={selectedLanguage}
          onChange={(e) => onLanguageChange(e.target.value)}
          className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none transition-colors duration-300 ${
            isDarkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-gray-50 border-gray-300 text-gray-900'
          }`}
        >
          {supportedLanguages.map((lang) => (
            <option key={lang.value} value={lang.value} disabled={lang.status === 'coming-soon'}>
              {lang.label} {lang.status === 'coming-soon' ? '(Coming Soon)' : ''}
            </option>
          ))}
        </select>
        <ChevronDown size={16} className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${
          isDarkMode ? 'text-gray-400' : 'text-gray-400'
        }`} />
      </div>
      
      <div className={`mt-3 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>Active support</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
          <span>Coming soon</span>
        </div>
      </div>
    </div>
  );
};