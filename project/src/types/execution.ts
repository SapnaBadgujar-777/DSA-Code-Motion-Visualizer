export interface Variable {
  name: string;
  value: any;
  type: string;
  scope: string;
  isNew?: boolean;
  isModified?: boolean;
  history?: any[];
}

export interface CallStackFrame {
  functionName: string;
  lineNumber: number;
  variables: Variable[];
  parameters?: Variable[];
  returnValue?: any;
}

export interface TraceEntry {
  step: number;
  line: number;
  action: 'assignment' | 'function_call' | 'function_return' | 'condition' | 'loop' | 'expression' | 'console_output';
  details: string;
  timestamp: number;
  callStack: CallStackFrame[];
  variables: Variable[];
}

export interface ExecutionState {
  variables: Variable[];
  callStack: CallStackFrame[];
  trace: TraceEntry[];
  currentLine: number;
  currentStep: number;
  isComplete: boolean;
  error?: string;
  output: string[];
}

export interface CodeExecutionConfig {
  language: 'python' | 'javascript' | 'java' | 'cpp';
  maxSteps: number;
  timeoutMs: number;
  memoryLimitMB: number;
}