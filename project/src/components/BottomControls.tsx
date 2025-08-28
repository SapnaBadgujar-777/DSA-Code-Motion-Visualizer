import React from 'react';
import { motion } from 'framer-motion';
import { EnhancedExecutionControls } from './EnhancedExecutionControls';
import { EnhancedExecutionSnapshot } from './EnhancedExecutionSnapshot';
import { ExecutionState } from '../types/execution';

interface BottomControlsProps {
  isExecuting: boolean;
  isPaused: boolean;
  canStepForward: boolean;
  canStepBackward: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onReset: () => void;
  onStop: () => void;
  onRun: () => void;
  executionSpeed: number;
  onSpeedChange: (speed: number) => void;
  executionState: ExecutionState;
  code: string;
  onExportSnapshot: () => void;
  isDarkMode?: boolean;
}

export const BottomControls: React.FC<BottomControlsProps> = ({
  isExecuting,
  isPaused,
  canStepForward,
  canStepBackward,
  onPlay,
  onPause,
  onStepForward,
  onStepBackward,
  onReset,
  onStop,
  onRun,
  executionSpeed,
  onSpeedChange,
  executionState,
  code,
  onExportSnapshot,
  isDarkMode = false
}) => {
  return (
    <motion.div 
      className={`border-t transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Execution Controls */}
          <EnhancedExecutionControls
            isExecuting={isExecuting && !isPaused}
            isPaused={isPaused}
            canStepForward={canStepForward}
            canStepBackward={canStepBackward}
            onPlay={onPlay}
            onPause={onPause}
            onStepForward={onStepForward}
            onStepBackward={onStepBackward}
            onReset={onReset}
            onStop={onStop}
            onRun={onRun}
            executionSpeed={executionSpeed}
            onSpeedChange={onSpeedChange}
          />
          
          {/* Snapshot & Export */}
          <EnhancedExecutionSnapshot
            executionState={executionState}
            code={code}
            onExportSnapshot={onExportSnapshot}
          />
        </div>
      </div>
    </motion.div>
  );
};