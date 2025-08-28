import React from 'react';
import { Play, Pause, SkipForward, SkipBack, RotateCcw, Square } from 'lucide-react';

interface ExecutionControlsProps {
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
}

export const ExecutionControls: React.FC<ExecutionControlsProps> = ({
  isExecuting,
  isPaused,
  canStepForward,
  canStepBackward,
  onPlay,
  onPause,
  onStepForward,
  onStepBackward,
  onReset,
  onStop
}) => {
  const buttonClass = "flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100";

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 border">
      <h3 className="text-gray-800 font-semibold mb-3">Execution Controls</h3>
      
      <div className="flex gap-2">
        <button
          onClick={onReset}
          className={`${buttonClass} bg-gray-100 hover:bg-gray-200 text-gray-700`}
          title="Reset"
        >
          <RotateCcw size={16} />
        </button>
        
        <button
          onClick={onStepBackward}
          disabled={!canStepBackward}
          className={`${buttonClass} bg-blue-100 hover:bg-blue-200 text-blue-700`}
          title="Step Backward"
        >
          <SkipBack size={16} />
        </button>
        
        {!isExecuting || isPaused ? (
          <button
            onClick={onPlay}
            className={`${buttonClass} bg-green-100 hover:bg-green-200 text-green-700`}
            title="Play"
          >
            <Play size={16} />
          </button>
        ) : (
          <button
            onClick={onPause}
            className={`${buttonClass} bg-yellow-100 hover:bg-yellow-200 text-yellow-700`}
            title="Pause"
          >
            <Pause size={16} />
          </button>
        )}
        
        <button
          onClick={onStepForward}
          disabled={!canStepForward}
          className={`${buttonClass} bg-blue-100 hover:bg-blue-200 text-blue-700`}
          title="Step Forward"
        >
          <SkipForward size={16} />
        </button>
        
        <button
          onClick={onStop}
          disabled={!isExecuting}
          className={`${buttonClass} bg-red-100 hover:bg-red-200 text-red-700`}
          title="Stop"
        >
          <Square size={16} />
        </button>
      </div>
    </div>
  );
};