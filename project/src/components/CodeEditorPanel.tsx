import React from 'react';
import { motion } from 'framer-motion';
import { MonacoCodeEditor } from './MonacoCodeEditor';
import { LanguageSelector } from './LanguageSelector';
import { FileText } from 'lucide-react';

interface CodeEditorPanelProps {
  code: string;
  onCodeChange: (code: string) => void;
  currentLine: number;
  isExecuting: boolean;
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
  supportedLanguages: { value: string; label: string; status: 'active' | 'coming-soon' }[];
  isDarkMode?: boolean;
}

export const CodeEditorPanel: React.FC<CodeEditorPanelProps> = ({
  code,
  onCodeChange,
  currentLine,
  isExecuting,
  selectedLanguage,
  onLanguageChange,
  supportedLanguages,
  isDarkMode = false
}) => {
  return (
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Panel Header */}
      <div className={`rounded-xl shadow-lg border p-4 transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-r from-gray-800 to-gray-900 border-gray-700' 
          : 'bg-gradient-to-r from-white to-gray-50 border-gray-200'
      }`}>
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1 bg-green-100 rounded-lg">
            <FileText size={16} className="text-green-600" />
          </div>
          <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            📝 Code Editor
          </h3>
        </div>
        
        <LanguageSelector
          selectedLanguage={selectedLanguage}
          onLanguageChange={onLanguageChange}
          supportedLanguages={supportedLanguages}
          isDarkMode={isDarkMode}
        />
      </div>
      
      {/* Monaco Editor */}
      <div>
        <MonacoCodeEditor
          code={code}
          onCodeChange={onCodeChange}
          currentLine={currentLine}
          isExecuting={isExecuting}
          language={selectedLanguage}
        />
      </div>
    </motion.div>
  );
};