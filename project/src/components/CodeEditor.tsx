import React from 'react';

interface CodeEditorProps {
  code: string;
  onCodeChange: (code: string) => void;
  currentLine: number;
  isExecuting: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onCodeChange,
  currentLine,
  isExecuting
}) => {
  const lines = code.split('\n');

  return (
    <div className="h-full bg-gray-900 rounded-lg overflow-hidden">
      <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
        <h3 className="text-white font-medium">Code Editor</h3>
      </div>
      
      <div className="relative h-full">
        <div className="absolute inset-0 flex">
          {/* Line numbers */}
          <div className="bg-gray-800 px-3 py-4 text-gray-400 text-sm font-mono min-w-12 border-r border-gray-700">
            {lines.map((_, index) => (
              <div
                key={index}
                className={`leading-6 ${
                  currentLine === index + 1 && isExecuting
                    ? 'bg-blue-600 text-white px-1 rounded'
                    : ''
                }`}
              >
                {index + 1}
              </div>
            ))}
          </div>
          
          {/* Code area */}
          <div className="flex-1 relative">
            <textarea
              value={code}
              onChange={(e) => onCodeChange(e.target.value)}
              className="w-full h-full bg-transparent text-gray-100 font-mono text-sm p-4 resize-none outline-none leading-6"
              style={{ minHeight: '400px' }}
              spellCheck={false}
              disabled={isExecuting}
            />
            
            {/* Current line highlight */}
            {currentLine > 0 && isExecuting && (
              <div
                className="absolute left-0 right-0 bg-blue-500 bg-opacity-20 pointer-events-none transition-all duration-300"
                style={{
                  top: `${(currentLine - 1) * 24 + 16}px`,
                  height: '24px'
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};