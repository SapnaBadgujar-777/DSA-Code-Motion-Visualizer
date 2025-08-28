import React from 'react';
import { CallStackFrame } from '../types/execution';
import { FunctionSquare as Function, ArrowDown, ArrowUp } from 'lucide-react';

interface CallStackVisualizationProps {
  callStack: CallStackFrame[];
  currentFunction?: string;
}

export const CallStackVisualization: React.FC<CallStackVisualizationProps> = ({
  callStack,
  currentFunction
}) => {
  if (callStack.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg border h-full">
        <div className="bg-gray-50 px-4 py-3 border-b rounded-t-lg">
          <h3 className="text-gray-800 font-semibold flex items-center gap-2">
            <Function size={16} />
            Call Stack
          </h3>
        </div>
        <div className="p-4">
          <p className="text-gray-500 text-sm italic">No function calls</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg border h-full">
      <div className="bg-gray-50 px-4 py-3 border-b rounded-t-lg">
        <h3 className="text-gray-800 font-semibold flex items-center gap-2">
          <Function size={16} />
          Call Stack ({callStack.length})
        </h3>
      </div>
      
      <div className="p-4 space-y-3 overflow-auto" style={{ maxHeight: '400px' }}>
        {callStack.map((frame, index) => (
          <div key={index} className="relative">
            <div
              className={`p-3 rounded-lg border transition-all duration-200 ${
                frame.functionName === currentFunction
                  ? 'bg-blue-50 border-blue-200 shadow-sm'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-sm font-medium text-gray-800">
                  {frame.functionName}()
                </span>
                <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                  Line {frame.lineNumber}
                </span>
              </div>
              
              {frame.parameters && frame.parameters.length > 0 && (
                <div className="mt-2">
                  <div className="text-xs text-gray-600 mb-1">Parameters:</div>
                  <div className="space-y-1">
                    {frame.parameters.map((param, paramIndex) => (
                      <div key={paramIndex} className="flex items-center justify-between text-xs">
                        <span className="font-mono text-gray-700">{param.name}</span>
                        <span className="text-blue-600 font-mono">
                          {typeof param.value === 'string' ? `"${param.value}"` : String(param.value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {frame.returnValue !== undefined && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <div className="text-xs text-gray-600">Returns:</div>
                  <span className="text-green-600 font-mono text-xs">
                    {typeof frame.returnValue === 'string' ? `"${frame.returnValue}"` : String(frame.returnValue)}
                  </span>
                </div>
              )}
            </div>
            
            {index < callStack.length - 1 && (
              <div className="flex justify-center my-2">
                <ArrowDown size={16} className="text-gray-400" />
              </div>
            )}
          </div>
        ))}
        
        {callStack.length > 0 && (
          <div className="flex justify-center mt-3">
            <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
              Current Execution Context
            </div>
          </div>
        )}
      </div>
    </div>
  );
};