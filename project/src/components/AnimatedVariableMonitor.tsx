import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Variable } from '../types/execution';
import { Database, TrendingUp, TrendingDown, Plus } from 'lucide-react';

interface AnimatedVariableMonitorProps {
  variables: Variable[];
}

export const AnimatedVariableMonitor: React.FC<AnimatedVariableMonitorProps> = ({ variables }) => {
  const formatValue = (value: any, type: string) => {
    if (type === 'string') return `"${value}"`;
    if (type === 'undefined') return 'undefined';
    if (type === 'null') return 'null';
    return String(value);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'number': return 'text-blue-600 bg-blue-50';
      case 'string': return 'text-green-600 bg-green-50';
      case 'boolean': return 'text-purple-600 bg-purple-50';
      case 'undefined': return 'text-gray-500 bg-gray-50';
      case 'null': return 'text-gray-500 bg-gray-50';
      default: return 'text-gray-700 bg-gray-50';
    }
  };

  const getVariableIcon = (variable: Variable) => {
    if (variable.isNew) return <Plus size={12} className="text-green-600" />;
    if (variable.isModified) return <TrendingUp size={12} className="text-blue-600" />;
    return <Database size={12} className="text-gray-400" />;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border h-full">
      <div className="bg-gradient-to-r from-green-50 to-blue-50 px-4 py-3 border-b rounded-t-lg">
        <h3 className="text-gray-800 font-semibold flex items-center gap-2">
          <Database size={16} className="text-green-600" />
          Variables ({variables.length})
        </h3>
      </div>
      
      <div className="p-4 space-y-2 overflow-auto" style={{ maxHeight: '400px' }}>
        {variables.length === 0 ? (
          <motion.div 
            className="p-6 flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-gray-400 mb-2">
              <Database size={32} />
            </div>
            <p className="text-gray-500 text-sm italic">No variables defined</p>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            {variables.map((variable, index) => (
              <motion.div
                key={variable.name}
                layout
                initial={{ opacity: 0, x: -20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.9 }}
                transition={{ 
                  duration: 0.3,
                  delay: index * 0.05,
                  type: "spring",
                  stiffness: 300,
                  damping: 25
                }}
                className={`p-3 rounded-lg border-2 transition-all duration-500 ${
                  variable.isNew
                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 shadow-md'
                    : variable.isModified
                    ? 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-300 shadow-md'
                    : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                }`}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <motion.div
                      initial={{ rotate: 0 }}
                      animate={{ rotate: variable.isNew || variable.isModified ? [0, 10, -10, 0] : 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      {getVariableIcon(variable)}
                    </motion.div>
                    <span className="font-mono text-sm font-bold text-gray-800">
                      {variable.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.span 
                      className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {variable.scope}
                    </motion.span>
                    <motion.span 
                      className={`text-xs px-2 py-1 rounded-full font-medium ${getTypeColor(variable.type)}`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: "spring" }}
                    >
                      {variable.type}
                    </motion.span>
                  </div>
                </div>
                
                <motion.div 
                  className={`font-mono text-sm font-medium ${getTypeColor(variable.type).split(' ')[0]} bg-white p-2 rounded border`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {formatValue(variable.value, variable.type)}
                </motion.div>
                
                <AnimatePresence>
                  {variable.isNew && (
                    <motion.div 
                      className="mt-2 flex items-center gap-1 text-xs text-green-600 font-bold"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: 2 }}
                      >
                        ✨
                      </motion.div>
                      New Variable
                    </motion.div>
                  )}
                  
                  {variable.isModified && !variable.isNew && (
                    <motion.div 
                      className="mt-2 flex items-center gap-1 text-xs text-blue-600 font-bold"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 0.5, repeat: 2 }}
                      >
                        🔄
                      </motion.div>
                      Modified
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};