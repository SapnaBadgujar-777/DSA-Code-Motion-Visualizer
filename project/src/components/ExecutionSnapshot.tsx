import React, { useRef } from 'react';
import { Camera, Download } from 'lucide-react';
import { ExecutionState } from '../types/execution';

interface ExecutionSnapshotProps {
  executionState: ExecutionState;
  code: string;
  onExportSnapshot: () => void;
}

export const ExecutionSnapshot: React.FC<ExecutionSnapshotProps> = ({
  executionState,
  code,
  onExportSnapshot
}) => {
  const snapshotRef = useRef<HTMLDivElement>(null);

  const exportAsImage = async () => {
    if (!snapshotRef.current) return;

    try {
      // Create a canvas to capture the current state
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas size
      canvas.width = 1200;
      canvas.height = 800;

      // Fill background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add title
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 24px Arial';
      ctx.fillText('CrystalDryRun - Code Execution Snapshot', 20, 40);

      // Add timestamp
      ctx.fillStyle = '#6b7280';
      ctx.font = '14px Arial';
      ctx.fillText(`Generated: ${new Date().toLocaleString()}`, 20, 65);

      // Add current line info
      ctx.fillStyle = '#3b82f6';
      ctx.font = 'bold 16px Arial';
      ctx.fillText(`Current Line: ${executionState.currentLine}`, 20, 100);
      ctx.fillText(`Step: ${executionState.currentStep}`, 200, 100);

      // Add variables section
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 18px Arial';
      ctx.fillText('Variables:', 20, 140);

      let yPos = 165;
      executionState.variables.forEach((variable, index) => {
        ctx.fillStyle = variable.isNew ? '#10b981' : variable.isModified ? '#3b82f6' : '#374151';
        ctx.font = '14px monospace';
        ctx.fillText(`${variable.name}: ${variable.value} (${variable.type})`, 40, yPos);
        yPos += 25;
      });

      // Add call stack if present
      if (executionState.callStack.length > 0) {
        yPos += 20;
        ctx.fillStyle = '#1f2937';
        ctx.font = 'bold 18px Arial';
        ctx.fillText('Call Stack:', 20, yPos);
        yPos += 25;

        executionState.callStack.forEach((frame, index) => {
          ctx.fillStyle = '#374151';
          ctx.font = '14px monospace';
          ctx.fillText(`${index + 1}. ${frame.functionName}() - Line ${frame.lineNumber}`, 40, yPos);
          yPos += 25;
        });
      }

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `crystal-dry-run-snapshot-${Date.now()}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      });

      onExportSnapshot();
    } catch (error) {
      console.error('Failed to export snapshot:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border">
      <div className="bg-gray-50 px-4 py-3 border-b rounded-t-lg flex items-center justify-between">
        <h3 className="text-gray-800 font-semibold flex items-center gap-2">
          <Camera size={16} />
          Execution Snapshot
        </h3>
        <button
          onClick={exportAsImage}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
        >
          <Download size={14} />
          Export PNG
        </button>
      </div>
      
      <div ref={snapshotRef} className="p-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="font-semibold text-gray-700 mb-2">Execution Info</div>
            <div className="space-y-1 text-gray-600">
              <div>Current Line: <span className="font-mono text-blue-600">{executionState.currentLine}</span></div>
              <div>Current Step: <span className="font-mono text-blue-600">{executionState.currentStep}</span></div>
              <div>Status: <span className={`font-medium ${executionState.error ? 'text-red-600' : executionState.isComplete ? 'text-green-600' : 'text-blue-600'}`}>
                {executionState.error ? 'Error' : executionState.isComplete ? 'Complete' : 'Running'}
              </span></div>
            </div>
          </div>
          
          <div>
            <div className="font-semibold text-gray-700 mb-2">Variables ({executionState.variables.length})</div>
            <div className="space-y-1 text-xs">
              {executionState.variables.slice(0, 5).map((variable, index) => (
                <div key={index} className="flex justify-between">
                  <span className="font-mono">{variable.name}</span>
                  <span className="text-gray-600">{String(variable.value)}</span>
                </div>
              ))}
              {executionState.variables.length > 5 && (
                <div className="text-gray-500 italic">...and {executionState.variables.length - 5} more</div>
              )}
            </div>
          </div>
        </div>
        
        {executionState.callStack.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <div className="font-semibold text-gray-700 mb-2">Call Stack</div>
            <div className="space-y-1 text-xs">
              {executionState.callStack.map((frame, index) => (
                <div key={index} className="font-mono text-gray-600">
                  {frame.functionName}() - Line {frame.lineNumber}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};