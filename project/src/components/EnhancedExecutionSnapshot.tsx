import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, Download, Share2, FileImage } from 'lucide-react';
import { ExecutionState } from '../types/execution';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';

interface EnhancedExecutionSnapshotProps {
  executionState: ExecutionState;
  code: string;
  onExportSnapshot: () => void;
}

export const EnhancedExecutionSnapshot: React.FC<EnhancedExecutionSnapshotProps> = ({
  executionState,
  code,
  onExportSnapshot
}) => {
  const snapshotRef = useRef<HTMLDivElement>(null);

  const exportAsImage = async () => {
    if (!snapshotRef.current) return;

    try {
      const canvas = await html2canvas(snapshotRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true
      });

      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, `crystal-dry-run-snapshot-${Date.now()}.png`);
          onExportSnapshot();
        }
      });
    } catch (error) {
      console.error('Failed to export snapshot:', error);
    }
  };

  const exportAsJSON = () => {
    const data = {
      timestamp: new Date().toISOString(),
      executionState,
      code,
      metadata: {
        tool: 'CrystalDryRun',
        version: '1.0.0'
      }
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    saveAs(blob, `crystal-dry-run-data-${Date.now()}.json`);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border">
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-3 border-b rounded-t-lg flex items-center justify-between">
        <h3 className="text-gray-800 font-semibold flex items-center gap-2">
          <Camera size={16} className="text-indigo-600" />
          Execution Snapshot
        </h3>
        <div className="flex gap-2">
          <motion.button
            onClick={exportAsImage}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm transition-colors shadow-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FileImage size={14} />
            PNG
          </motion.button>
          <motion.button
            onClick={exportAsJSON}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm transition-colors shadow-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download size={14} />
            JSON
          </motion.button>
        </div>
      </div>
      
      <div ref={snapshotRef} className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              Execution Info
            </div>
            <div className="space-y-2 text-gray-600">
              <div className="flex justify-between">
                <span>Current Line:</span>
                <span className="font-mono text-blue-600 font-bold">{executionState.currentLine}</span>
              </div>
              <div className="flex justify-between">
                <span>Current Step:</span>
                <span className="font-mono text-blue-600 font-bold">{executionState.currentStep}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className={`font-medium px-2 py-1 rounded text-xs ${
                  executionState.error 
                    ? 'bg-red-100 text-red-600' 
                    : executionState.isComplete 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-blue-100 text-blue-600'
                }`}>
                  {executionState.error ? 'Error' : executionState.isComplete ? 'Complete' : 'Running'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Call Stack Depth:</span>
                <span className="font-mono text-purple-600 font-bold">{executionState.callStack.length}</span>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              Variables ({executionState.variables.length})
            </div>
            <div className="space-y-1 text-xs max-h-32 overflow-y-auto">
              {executionState.variables.slice(0, 8).map((variable, index) => (
                <motion.div 
                  key={index} 
                  className="flex justify-between items-center p-2 bg-gray-50 rounded"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                >
                  <span className="font-mono font-medium">{variable.name}</span>
                  <span className="text-gray-600 truncate max-w-20" title={String(variable.value)}>
                    {String(variable.value)}
                  </span>
                </motion.div>
              ))}
              {executionState.variables.length > 8 && (
                <div className="text-gray-500 italic text-center py-1">
                  ...and {executionState.variables.length - 8} more
                </div>
              )}
            </div>
          </motion.div>
        </div>
        
        {executionState.callStack.length > 0 && (
          <motion.div 
            className="mt-4 pt-4 border-t"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              Call Stack
            </div>
            <div className="space-y-1 text-xs">
              {executionState.callStack.map((frame, index) => (
                <motion.div 
                  key={index} 
                  className="font-mono text-gray-600 bg-purple-50 p-2 rounded flex justify-between"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <span>{frame.functionName}()</span>
                  <span className="text-purple-600">Line {frame.lineNumber}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {executionState.output.length > 0 && (
          <motion.div 
            className="mt-4 pt-4 border-t"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              Console Output
            </div>
            <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-xs max-h-24 overflow-y-auto">
              {executionState.output.map((line, index) => (
                <div key={index}>{line}</div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};