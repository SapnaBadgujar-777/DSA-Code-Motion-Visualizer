import React from 'react';
import { Terminal, Download } from 'lucide-react';

interface OutputConsoleProps {
  output: string[];
  onExportOutput?: () => void;
}

export const OutputConsole: React.FC<OutputConsoleProps> = ({ output, onExportOutput }) => {
  return (
    <div className="bg-gray-900 rounded-lg shadow-lg border h-full">
      <div className="bg-gray-800 px-4 py-3 border-b border-gray-700 rounded-t-lg flex items-center justify-between">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <Terminal size={16} />
          Console Output
        </h3>
        {output.length > 0 && onExportOutput && (
          <button
            onClick={onExportOutput}
            className="text-gray-300 hover:text-white transition-colors p-1 rounded"
            title="Export Output"
          >
            <Download size={14} />
          </button>
        )}
      </div>
      
      <div className="p-4 font-mono text-sm text-green-400 overflow-auto" style={{ maxHeight: '200px' }}>
        {output.length === 0 ? (
          <div className="text-gray-500 italic">No output yet...</div>
        ) : (
          output.map((line, index) => (
            <div key={index} className="mb-1">
              <span className="text-gray-500 mr-2">{index + 1}.</span>
              <span>{line}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};