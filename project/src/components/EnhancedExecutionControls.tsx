import React from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  RotateCcw, 
  Square,
  Gauge,
  Keyboard,
  Zap
} from 'lucide-react';

interface EnhancedExecutionControlsProps {
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
  executionSpeed?: number;
  onSpeedChange?: (speed: number) => void;
}

export const EnhancedExecutionControls: React.FC<EnhancedExecutionControlsProps> = ({
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
  executionSpeed = 1000,
  onSpeedChange
}) => {
  const buttonClass = "flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg";

  const speedOptions = [
    { label: 'Slow', value: 2000, color: 'bg-yellow-500' },
    { label: 'Normal', value: 1000, color: 'bg-green-500' },
    { label: 'Fast', value: 500, color: 'bg-blue-500' },
    { label: 'Turbo', value: 200, color: 'bg-purple-500' }
  ];

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-lg p-6 border border-blue-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-800 font-bold flex items-center gap-2">
          <div className="p-1 bg-blue-100 rounded-lg">
            <Play size={16} className="text-blue-600" />
          </div>
          ⚡ Execution Controls
        </h3>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Keyboard size={12} />
          <span>Enter: Run • Space: Play/Pause • Arrow Keys: Step</span>
        </div>
      </div>
      
      {/* Main Controls */}
      <div className="flex gap-3 mb-4">
        <motion.button
          onClick={onRun}
          className={`${buttonClass} bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white shadow-xl`}
          title="Run Code (Enter)"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Zap size={18} />
        </motion.button>
        
        <motion.button
          onClick={onReset}
          className={`${buttonClass} bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white`}
          title="Reset (R)"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RotateCcw size={18} />
        </motion.button>
        
        <motion.button
          onClick={onStepBackward}
          disabled={!canStepBackward}
          className={`${buttonClass} bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white`}
          title="Step Backward (←)"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <SkipBack size={18} />
        </motion.button>
        
        {!isExecuting || isPaused ? (
          <motion.button
            onClick={onPlay}
            className={`${buttonClass} bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white`}
            title="Play (Space)"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Play size={18} />
          </motion.button>
        ) : (
          <motion.button
            onClick={onPause}
            className={`${buttonClass} bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white`}
            title="Pause (Space)"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Pause size={18} />
          </motion.button>
        )}
        
        <motion.button
          onClick={onStepForward}
          disabled={!canStepForward}
          className={`${buttonClass} bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white`}
          title="Step Forward (→)"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <SkipForward size={18} />
        </motion.button>
        
        <motion.button
          onClick={onStop}
          disabled={!isExecuting}
          className={`${buttonClass} bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white`}
          title="Stop (S)"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Square size={18} />
        </motion.button>
      </div>

      {/* Speed Control */}
      {onSpeedChange && (
        <div className="border-t border-blue-200 pt-4">
          <div className="flex items-center gap-2 mb-3">
            <Gauge size={16} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Execution Speed</span>
          </div>
          
          <div className="flex gap-2">
            {speedOptions.map((option) => (
              <motion.button
                key={option.value}
                onClick={() => onSpeedChange(option.value)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                  executionSpeed === option.value
                    ? `${option.color} text-white shadow-md`
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {option.label}
              </motion.button>
            ))}
          </div>
          
          <div className="mt-2 text-xs text-gray-500">
            Current: {executionSpeed}ms per step
          </div>
        </div>
      )}
    </div>
  );
};