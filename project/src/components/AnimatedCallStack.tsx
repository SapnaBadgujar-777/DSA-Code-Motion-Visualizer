import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CallStackFrame } from '../types/execution';
import { FunctionSquare, ArrowDown, ArrowUp, Layers } from 'lucide-react';

interface AnimatedCallStackProps {
  callStack: CallStackFrame[];
  currentFunction?: string;
}

export const AnimatedCallStack: React.FC<AnimatedCallStackProps> = ({
  callStack,
  currentFunction
}) => {
  if (callStack.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg border h-full">
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 px-4 py-3 border-b rounded-t-lg">
          <h3 className="text-gray-800 font-semibold flex items-center gap-2">
            <Layers size={16} className="text-purple-600" />
            Call Stack
          </h3>
        </div>
        <div className="p-6 flex flex-col items-center justify-center h-32">
          <div className="text-gray-400 mb-2">
            <FunctionSquare size={32} />
          </div>
          <p className="text-gray-500 text-sm italic">No function calls</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg border h-full">
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 px-4 py-3 border-b rounded-t-lg">
        <h3 className="text-gray-800 font-semibold flex items-center gap-2">
          <Layers size={16} className="text-purple-600" />
          Call Stack ({callStack.length})
        </h3>
      </div>
      
      <div className="p-4 space-y-2 overflow-auto" style={{ maxHeight: '400px' }}>
        <AnimatePresence mode="popLayout">
          {callStack.map((frame, index) => (
            <motion.div
              key={`${frame.functionName}-${index}`}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ 
                duration: 0.3,
                delay: index * 0.1,
                type: "spring",
                stiffness: 300,
                damping: 25
              }}
              className="relative"
            >
              <motion.div
                className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                  frame.functionName === currentFunction
                    ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-300 shadow-md'
                    : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <motion.div
                      className={`p-1 rounded ${
                        frame.functionName === currentFunction
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-400 text-white'
                      }`}
                      animate={{ 
                        rotate: frame.functionName === currentFunction ? [0, 5, -5, 0] : 0 
                      }}
                      transition={{ duration: 0.5, repeat: frame.functionName === currentFunction ? Infinity : 0, repeatDelay: 2 }}
                    >
                      <FunctionSquare size={14} />
                    </motion.div>
                    <span className="font-mono text-sm font-bold text-gray-800">
                      {frame.functionName}()
                    </span>
                  </div>
                  <motion.span 
                    className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    Line {frame.lineNumber}
                  </motion.span>
                </div>
                
                {frame.parameters && frame.parameters.length > 0 && (
                  <motion.div 
                    className="mt-3"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="text-xs text-gray-600 mb-2 font-medium">Parameters:</div>
                    <div className="space-y-1">
                      {frame.parameters.map((param, paramIndex) => (
                        <motion.div 
                          key={paramIndex} 
                          className="flex items-center justify-between text-xs bg-white p-2 rounded border"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + paramIndex * 0.1 }}
                        >
                          <span className="font-mono text-gray-700 font-medium">{param.name}</span>
                          <span className="text-blue-600 font-mono bg-blue-50 px-2 py-1 rounded">
                            {typeof param.value === 'string' ? `"${param.value}"` : String(param.value)}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
                
                {frame.returnValue !== undefined && (
                  <motion.div 
                    className="mt-3 pt-3 border-t border-gray-200"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="text-xs text-gray-600 mb-1 font-medium">Returns:</div>
                    <span className="text-green-600 font-mono text-sm bg-green-50 px-2 py-1 rounded">
                      {typeof frame.returnValue === 'string' ? `"${frame.returnValue}"` : String(frame.returnValue)}
                    </span>
                  </motion.div>
                )}
              </motion.div>
              
              {index < callStack.length - 1 && (
                <motion.div 
                  className="flex justify-center my-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <motion.div
                    animate={{ y: [0, 3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <ArrowDown size={16} className="text-purple-400" />
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {callStack.length > 0 && (
          <motion.div 
            className="flex justify-center mt-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <motion.div 
              className="bg-gradient-to-r from-green-100 to-blue-100 text-green-700 px-4 py-2 rounded-full text-xs font-medium shadow-sm"
              whileHover={{ scale: 1.05 }}
            >
              ⚡ Current Execution Context
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};