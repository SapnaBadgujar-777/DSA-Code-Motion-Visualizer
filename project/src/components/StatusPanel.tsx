import React from 'react';
import { motion } from 'framer-motion';
import { ExecutionState } from '../types/execution';
import { Activity, AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface StatusPanelProps {
  executionState: ExecutionState;
  currentStep: number;
  totalSteps: number;
  selectedLanguage: string;
  isDarkMode?: boolean;
}

export const StatusPanel: React.FC<StatusPanelProps> = ({
  executionState,
  currentStep,
  totalSteps,
  selectedLanguage,
  isDarkMode = false
}) => {
  const getStatusIcon = () => {
    if (executionState.error) return <AlertCircle size={16} className="text-red-500" />;
    if (executionState.isComplete) return <CheckCircle size={16} className="text-green-500" />;
    return <Clock size={16} className="text-blue-500" />;
  };

  const getStatusColor = () => {
    if (executionState.error) return 'bg-red-100 text-red-700 border-red-200';
    if (executionState.isComplete) return 'bg-green-100 text-green-700 border-green-200';
    return 'bg-blue-100 text-blue-700 border-blue-200';
  };

  return (
    <motion.div 
      className={`rounded-xl shadow-lg border p-4 transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-r from-gray-800 to-gray-900 border-gray-700' 
          : 'bg-gradient-to-r from-green-50 to-blue-50 border-green-200'
      }`}
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1 bg-purple-100 rounded-lg">
          <Activity size={16} className="text-purple-600" />
        </div>
        <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          📊 Execution Status
        </h3>
      </div>
      
      <div className="space-y-3">
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Progress</span>
            <span className="font-mono text-blue-600">
              {currentStep} / {totalSteps}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
            <motion.div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full shadow-sm"
              initial={{ width: 0 }}
              animate={{ width: `${totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Status Details */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex justify-between">
            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Language:</span>
            <span className="font-mono text-purple-600 capitalize">
              {selectedLanguage}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Variables:</span>
            <span className="font-mono text-green-600">
              {executionState.variables?.length || 0}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Call Stack:</span>
            <span className="font-mono text-orange-600">
              {executionState.callStack?.length || 0} frames
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Output Lines:</span>
            <span className="font-mono text-cyan-600">
              {executionState.output?.length || 0}
            </span>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center justify-center">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium border ${getStatusColor()}`}>
            {getStatusIcon()}
            <span>
              {executionState.error
                ? 'Error'
                : executionState.isComplete
                ? 'Complete'
                : 'Running'
              }
            </span>
          </div>
        </div>

        {/* Error Display */}
        {executionState.error && (
          <motion.div 
            className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <div className="font-medium mb-1">Execution Error:</div>
            <div className="font-mono text-xs">{executionState.error}</div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};