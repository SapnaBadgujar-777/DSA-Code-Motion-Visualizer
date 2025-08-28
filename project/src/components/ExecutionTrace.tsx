import React from 'react';

import { TraceEntry } from '../types/execution';

interface ExecutionTraceProps {
  trace: TraceEntry[];
  currentStep: number;
}

export const ExecutionTrace: React.FC<ExecutionTraceProps> = ({ trace, currentStep }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg border h-full">
      <div className="bg-gray-50 px-4 py-3 border-b rounded-t-lg">
        <h3 className="text-gray-800 font-semibold">Execution Trace</h3>
      </div>
      
      <div className="p-4 space-y-2 overflow-auto" style={{ maxHeight: '300px' }}>
        {trace.length === 0 ? (
          <p className="text-gray-500 text-sm italic">No execution steps</p>
        ) : (
          trace.map((entry, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border text-sm transition-all duration-200 ${
                index === currentStep
                  ? 'bg-blue-50 border-blue-200 shadow-sm'
                  : index < currentStep
                  ? 'bg-gray-50 border-gray-200'
                  : 'bg-white border-gray-100 opacity-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs font-mono">
                  Step {entry.step}
                </span>
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-mono">
                  Line {entry.line}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  entry.action === 'function_call' ? 'bg-purple-100 text-purple-700' :
                  entry.action === 'assignment' ? 'bg-green-100 text-green-700' :
                  entry.action === 'condition' ? 'bg-yellow-100 text-yellow-700' :
                  entry.action === 'console_output' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {entry.action.replace('_', ' ')}
                </span>
              </div>
              <div className="mt-2 text-gray-700">
                <span className="text-gray-600">{entry.details}</span>
              </div>
              {entry.callStack.length > 0 && (
                <div className="mt-2 text-xs text-gray-500">
                  Call stack depth: {entry.callStack.length}
                </div>
              )}
              <div className="mt-1 text-xs text-gray-400">
                {new Date(entry.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};