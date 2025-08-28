import React from 'react';

import { Variable } from '../types/execution';

interface VariableMonitorProps {
  variables: Variable[];
}

export const VariableMonitor: React.FC<VariableMonitorProps> = ({ variables }) => {
  const formatValue = (value: any, type: string) => {
    if (type === 'string') return `"${value}"`;
    if (type === 'undefined') return 'undefined';
    if (type === 'null') return 'null';
    return String(value);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'number': return 'text-blue-600';
      case 'string': return 'text-green-600';
      case 'boolean': return 'text-purple-600';
      case 'undefined': return 'text-gray-500';
      case 'null': return 'text-gray-500';
      default: return 'text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border h-full">
      <div className="bg-gray-50 px-4 py-3 border-b rounded-t-lg">
        <h3 className="text-gray-800 font-semibold">Variables</h3>
      </div>
      
      <div className="p-4 space-y-3 overflow-auto" style={{ maxHeight: '400px' }}>
        {variables.length === 0 ? (
          <p className="text-gray-500 text-sm italic">No variables defined</p>
        ) : (
          variables.map((variable, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border transition-all duration-300 ${
                variable.isNew
                  ? 'bg-green-50 border-green-200'
                  : variable.isModified
                  ? 'bg-blue-50 border-blue-200'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-medium text-gray-800">
                  {variable.name}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                    {variable.scope}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${getTypeColor(variable.type)} bg-opacity-20`}>
                    {variable.type}
                  </span>
                </div>
              </div>
              <div className={`font-mono text-sm mt-1 ${getTypeColor(variable.type)}`}>
                {formatValue(variable.value, variable.type)}
              </div>
              {variable.isNew && (
                <div className="mt-1 text-xs text-green-600 font-medium">● New</div>
              )}
              {variable.isModified && (
                <div className="mt-1 text-xs text-blue-600 font-medium">● Modified</div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};