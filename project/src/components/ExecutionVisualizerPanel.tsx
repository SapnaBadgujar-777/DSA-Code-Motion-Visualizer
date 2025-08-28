import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedCallStack } from './AnimatedCallStack';
import { AnimatedVariableMonitor } from './AnimatedVariableMonitor';
import { OutputConsole } from './OutputConsole';
import { ExecutionTrace } from './ExecutionTrace';
import { ExecutionState } from '../types/execution';
import { Activity, Database, Terminal, List } from 'lucide-react';

interface ExecutionVisualizerPanelProps {
  executionState: ExecutionState;
  currentStep: number;
  isDarkMode?: boolean;
  onExportOutput?: () => void;
}

export const ExecutionVisualizerPanel: React.FC<ExecutionVisualizerPanelProps> = ({
  executionState,
  currentStep,
  isDarkMode = false,
  onExportOutput
}) => {
  return (
    <motion.div 
      className="space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Panel Header */}
      <div className={`rounded-xl shadow-lg border p-4 transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-r from-gray-800 to-gray-900 border-gray-700' 
          : 'bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200'
      }`}>
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1 bg-blue-100 rounded-lg">
            <Activity size={16} className="text-blue-600" />
          </div>
          <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            🔍 Execution Visualizer
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between">
            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Current Line:</span>
            <span className="font-mono text-blue-600 font-bold">
              {executionState.currentLine || 0}
            </span>
          </div>
          <div className="flex justify-between">
            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Step:</span>
            <span className="font-mono text-green-600 font-bold">
              {executionState.currentStep || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Call Stack Visualizer */}
      <div>
        <AnimatedCallStack 
          callStack={executionState.callStack || []} 
          currentFunction={executionState.callStack?.[executionState.callStack.length - 1]?.functionName}
        />
      </div>

      {/* Variable Tracker */}
      <div>
        <AnimatedVariableMonitor variables={executionState.variables || []} />
      </div>

      {/* Console Output */}
      <div>
        <OutputConsole 
          output={executionState.output || []} 
          onExportOutput={onExportOutput}
        />
      </div>

      {/* Execution Trace */}
      <div>
        <ExecutionTrace 
          trace={executionState.trace || []} 
          currentStep={currentStep - 1}
        />
      </div>
    </motion.div>
  );
};