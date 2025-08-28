import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { CodeEditorPanel } from './components/CodeEditorPanel';
import { ExecutionVisualizerPanel } from './components/ExecutionVisualizerPanel';
import { BottomControls } from './components/BottomControls';
import { StatusPanel } from './components/StatusPanel';
import { EnhancedExecutionControls } from './components/EnhancedExecutionControls';
import { EnhancedExecutionSnapshot } from './components/EnhancedExecutionSnapshot';
import { EnhancedInterpreter } from './utils/enhanced-interpreter';
import { motion } from 'framer-motion';

const defaultCode = `x = 10
y = 20
sum = x + y
console.log(sum)
if (sum > 25)
  result = "large"
else
  result = "small"
console.log(result)`;

const supportedLanguages = [
  { value: 'javascript', label: 'JavaScript', status: 'active' as const },
  { value: 'python', label: 'Python', status: 'coming-soon' as const },
  { value: 'java', label: 'Java', status: 'coming-soon' as const },
  { value: 'cpp', label: 'C++', status: 'coming-soon' as const }
];

function App() {
  const [code, setCode] = useState(defaultCode);
  const [interpreter, setInterpreter] = useState<EnhancedInterpreter | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('java');
  const [executionSpeed, setExecutionSpeed] = useState(1000);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [programOutput, setProgramOutput] = useState<string[]>([]);

  // Initialize interpreter when code changes
  useEffect(() => {
    if (code.trim()) {
      try {
        // Clear previous output
        setProgramOutput([]);
        
        // Create output callback to capture console output
        const outputCallback = (output: string) => {
          setProgramOutput(prev => [...prev, output]);
        };
        
        const newInterpreter = new EnhancedInterpreter(code, { 
          language: selectedLanguage as any,
          maxSteps: 1000,
          timeoutMs: 30000,
          memoryLimitMB: 100
        }, outputCallback);
        setInterpreter(newInterpreter);
        setCurrentStep(0);
        setIsExecuting(false);
        setIsPaused(false);
        setIsAutoPlaying(false);
      } catch (error) {
        console.error('Failed to parse code:', error);
      }
    }
  }, [code, selectedLanguage]);

  // Auto-play functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isAutoPlaying && interpreter && currentStep < interpreter.getTotalSteps()) {
      interval = setInterval(() => {
        setCurrentStep(prev => {
          const next = prev + 1;
          if (next >= interpreter.getTotalSteps()) {
            setIsAutoPlaying(false);
            setIsExecuting(false);
          }
          return next;
        });
      }, executionSpeed);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isAutoPlaying, interpreter, currentStep, executionSpeed]);

  const currentState = interpreter?.getState(currentStep);

  const handleRun = useCallback(() => {
    if (!interpreter) return;
    
    // Clear output and add start message
    setProgramOutput(['🚀 Program execution started...']);
    
    setCurrentStep(0);
    setIsExecuting(true);
    setIsPaused(false);
    setIsAutoPlaying(true);
  }, [interpreter]);

  const handlePlay = useCallback(() => {
    if (!interpreter) return;
    
    if (currentStep === 0) {
      setProgramOutput(prev => [...prev, '▶️ Resuming execution...']);
    }
    
    setIsExecuting(true);
    setIsPaused(false);
    setIsAutoPlaying(true);
  }, [interpreter]);

  const handlePause = useCallback(() => {
    setProgramOutput(prev => [...prev, '⏸️ Execution paused']);
    setIsPaused(true);
    setIsAutoPlaying(false);
  }, []);

  const handleStepForward = useCallback(() => {
    if (!interpreter || currentStep >= interpreter.getTotalSteps()) return;
    
    const nextStep = currentStep + 1;
    if (nextStep >= interpreter.getTotalSteps()) {
      setProgramOutput(prev => [...prev, '✅ Program execution completed']);
    }
    
    setCurrentStep(prev => prev + 1);
    setIsExecuting(true);
  }, [interpreter, currentStep]);

  const handleStepBackward = useCallback(() => {
    if (currentStep <= 0) return;
    
    setCurrentStep(prev => prev - 1);
  }, [currentStep]);

  const handleReset = useCallback(() => {
    setProgramOutput(['🔄 Execution reset']);
    setCurrentStep(0);
    setIsExecuting(false);
    setIsPaused(false);
    setIsAutoPlaying(false);
  }, []);

  const handleStop = useCallback(() => {
    setProgramOutput(prev => [...prev, '⏹️ Execution stopped']);
    setIsExecuting(false);
    setIsPaused(false);
    setIsAutoPlaying(false);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLInputElement) {
        return;
      }

      switch (event.key) {
        case 'Enter':
          event.preventDefault();
          handleRun();
          break;
        case ' ':
          event.preventDefault();
          if (!isExecuting || isPaused) {
            handlePlay();
          } else {
            handlePause();
          }
          break;
        case 'ArrowRight':
          event.preventDefault();
          handleStepForward();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          handleStepBackward();
          break;
        case 'r':
        case 'R':
          if (event.ctrlKey || event.metaKey) return;
          event.preventDefault();
          handleReset();
          break;
        case 's':
        case 'S':
          if (event.ctrlKey || event.metaKey) return;
          event.preventDefault();
          handleStop();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isExecuting, isPaused, handleRun, handlePlay, handlePause, handleStepForward, handleStepBackward, handleReset, handleStop]);

  const canStepForward = interpreter && currentStep < interpreter.getTotalSteps();
  const canStepBackward = currentStep > 0;

  const handleExportSnapshot = useCallback(() => {
    console.log('Snapshot exported successfully');
  }, []);

  const handleExportOutput = useCallback(() => {
    if (currentState?.output) {
      const outputText = currentState.output.join('\n');
      const blob = new Blob([outputText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `crystal-dry-run-output-${Date.now()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }, [currentState]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
        : 'bg-gradient-to-br from-gray-50 to-gray-100'
    }`}>
      {/* Header */}
      <Header 
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 min-h-[calc(100vh-200px)]">
          {/* Left Panel - Code Editor */}
          <div className="xl:col-span-2 space-y-4">
            <CodeEditorPanel
              code={code}
              onCodeChange={setCode}
              currentLine={currentState?.currentLine || 0}
              isExecuting={isExecuting}
              selectedLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
              supportedLanguages={supportedLanguages}
              isDarkMode={isDarkMode}
            />
            
            {/* Execution Controls - Directly Below Editor */}
            <div className="bg-white rounded-lg shadow-lg border p-4">
              <EnhancedExecutionControls
                isExecuting={isExecuting}
                isPaused={isPaused}
                canStepForward={!!canStepForward}
                canStepBackward={canStepBackward}
                onPlay={handlePlay}
                onPause={handlePause}
                onStepForward={handleStepForward}
                onStepBackward={handleStepBackward}
                onReset={handleReset}
                onStop={handleStop}
                onRun={handleRun}
                executionSpeed={executionSpeed}
                onSpeedChange={setExecutionSpeed}
              />
            </div>
            
            <StatusPanel
              executionState={currentState || {
                variables: [],
                callStack: [],
                trace: [],
                currentLine: 0,
                currentStep: 0,
                isComplete: false,
                output: []
              }}
              currentStep={currentStep}
              totalSteps={interpreter?.getTotalSteps() || 0}
              selectedLanguage={selectedLanguage}
              isDarkMode={isDarkMode}
            />
          </div>

          {/* Right Panel - Execution Visualizer (Narrower) */}
          <ExecutionVisualizerPanel
            executionState={currentState || {
              variables: [],
              callStack: [],
              trace: [],
              currentLine: 0,
              currentStep: 0,
              isComplete: false,
              output: []
            }}
            currentStep={currentStep}
            isDarkMode={isDarkMode}
            onExportOutput={handleExportOutput}
          />
        </div>
      </main>

      {/* Bottom Export Section */}
      <div className={`border-t transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <EnhancedExecutionSnapshot
            executionState={currentState || {
              variables: [], callStack: [], trace: [], currentLine: 0, 
              currentStep: 0, isComplete: false, output: []
            }}
            code={code}
            onExportSnapshot={handleExportSnapshot}
          />
        </div>
      </div>
    </div>
  );
}

export default App;