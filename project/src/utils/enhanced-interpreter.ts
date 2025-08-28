import { ExecutionState, TraceEntry, Variable, CallStackFrame, CodeExecutionConfig } from '../types/execution';

export class EnhancedInterpreter {
  private code: string[] = [];
  private states: ExecutionState[] = [];
  private variables: Map<string, any> = new Map();
  private callStack: CallStackFrame[] = [];
  private output: string[] = [];
  private functions: Map<string, { params: string[], body: string[], startLine: number }> = new Map();
  private config: CodeExecutionConfig;
  private outputCallback?: (output: string) => void;

  constructor(code: string, config: Partial<CodeExecutionConfig> = {}, outputCallback?: (output: string) => void) {
    this.config = {
      language: 'javascript',
      maxSteps: 1000,
      timeoutMs: 30000,
      memoryLimitMB: 100,
      ...config
    };
    
    this.outputCallback = outputCallback;
    this.code = code.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    this.parseAndExecute();
  }

  private parseAndExecute() {
    this.states = [];
    this.variables = new Map();
    this.callStack = [];
    this.output = [];
    this.functions = new Map();
    
    let step = 0;
    let trace: TraceEntry[] = [];

    // Initial state
    this.states.push({
      variables: [],
      callStack: [],
      trace: [],
      currentLine: 0,
      currentStep: 0,
      isComplete: false,
      output: []
    });

    // First pass: Parse function definitions
    this.parseFunctions();

    // Second pass: Execute main code
    for (let i = 0; i < this.code.length; i++) {
      if (step >= this.config.maxSteps) {
        this.addErrorState(step, i + 1, trace, 'Maximum execution steps exceeded');
        break;
      }

      const line = this.code[i];
      const lineNumber = i + 1;
      step++;

      // Skip function definitions in main execution
      if (this.isFunctionDefinition(line)) {
        continue;
      }

      try {
        const result = this.executeLine(line, lineNumber, step);
        if (result) {
          trace.push(result.traceEntry);

          const variables = this.getVariablesSnapshot(result.newVariables, result.modifiedVariables);

          this.states.push({
            variables,
            callStack: [...this.callStack],
            trace: [...trace],
            currentLine: lineNumber,
            currentStep: step,
            isComplete: i === this.code.length - 1,
            output: [...this.output]
          });
        }
      } catch (error) {
        this.addErrorState(step, lineNumber, trace, error instanceof Error ? error.message : 'Unknown error');
        break;
      }
    }
  }

  private parseFunctions() {
    for (let i = 0; i < this.code.length; i++) {
      const line = this.code[i];
      const functionMatch = line.match(/^function\s+(\w+)\s*\(([^)]*)\)\s*\{?$/);
      
      if (functionMatch) {
        const [, funcName, paramsStr] = functionMatch;
        const params = paramsStr.split(',').map(p => p.trim()).filter(p => p.length > 0);
        
        // Find function body
        const body: string[] = [];
        let j = i + 1;
        let braceCount = 1;
        
        while (j < this.code.length && braceCount > 0) {
          const bodyLine = this.code[j];
          if (bodyLine.includes('{')) braceCount++;
          if (bodyLine.includes('}')) braceCount--;
          
          if (braceCount > 0) {
            body.push(bodyLine);
          }
          j++;
        }
        
        this.functions.set(funcName, { params, body, startLine: i + 1 });
      }
    }
  }

  private isFunctionDefinition(line: string): boolean {
    return /^function\s+\w+\s*\([^)]*\)\s*\{?$/.test(line) || line.trim() === '}';
  }

  private executeLine(line: string, lineNumber: number, step: number) {
    const newVariables: string[] = [];
    const modifiedVariables: string[] = [];

    // Variable assignment
    const assignmentMatch = line.match(/^(\w+)\s*=\s*(.+)$/);
    if (assignmentMatch) {
      const [, varName, expression] = assignmentMatch;
      const oldValue = this.variables.get(varName);
      const newValue = this.evaluateExpression(expression);
      
      if (oldValue === undefined) {
        newVariables.push(varName);
      } else if (oldValue !== newValue) {
        modifiedVariables.push(varName);
      }
      
      this.variables.set(varName, newValue);
      
      return {
        traceEntry: {
          step,
          line: lineNumber,
          action: 'assignment' as const,
          details: `${varName} = ${this.formatValue(newValue)}`,
          timestamp: Date.now(),
          callStack: [...this.callStack],
          variables: this.getVariablesSnapshot(newVariables, modifiedVariables)
        },
        newVariables,
        modifiedVariables
      };
    }

    // Function call
    const functionCallMatch = line.match(/^(\w+)\s*\(([^)]*)\)$/);
    if (functionCallMatch) {
      const [, funcName, argsStr] = functionCallMatch;
      
      if (funcName === 'console' && argsStr.startsWith('log(')) {
        // Handle console.log specially
        const logMatch = line.match(/^console\.log\((.+)\)$/);
        if (logMatch) {
          const expression = logMatch[1];
          const value = this.evaluateExpression(expression);
          const outputValue = String(value);
          this.output.push(outputValue);
          
          // Call the output callback if provided
          if (this.outputCallback) {
            this.outputCallback(outputValue);
          }
          
          return {
            traceEntry: {
              step,
              line: lineNumber,
              action: 'console_output' as const,
              details: `console.log(${this.formatValue(value)})`,
              timestamp: Date.now(),
              callStack: [...this.callStack],
              variables: this.getVariablesSnapshot([], [])
            },
            newVariables,
            modifiedVariables
          };
        }
      } else if (this.functions.has(funcName)) {
        return this.executeFunction(funcName, argsStr, lineNumber, step);
      }
    }

    // Console.log (alternative syntax)
    const consoleMatch = line.match(/^console\.log\((.+)\)$/);
    if (consoleMatch) {
      const expression = consoleMatch[1];
      const value = this.evaluateExpression(expression);
      const outputValue = String(value);
      this.output.push(outputValue);
      
      // Call the output callback if provided
      if (this.outputCallback) {
        this.outputCallback(outputValue);
      }
      
      return {
        traceEntry: {
          step,
          line: lineNumber,
          action: 'console_output' as const,
          details: `console.log(${this.formatValue(value)})`,
          timestamp: Date.now(),
          callStack: [...this.callStack],
          variables: this.getVariablesSnapshot([], [])
        },
        newVariables,
        modifiedVariables
      };
    }

    // If statement
    const ifMatch = line.match(/^if\s*\((.+)\)$/);
    if (ifMatch) {
      const condition = ifMatch[1];
      const result = this.evaluateExpression(condition);
      
      return {
        traceEntry: {
          step,
          line: lineNumber,
          action: 'condition' as const,
          details: `if (${condition}) → ${result}`,
          timestamp: Date.now(),
          callStack: [...this.callStack],
          variables: this.getVariablesSnapshot([], [])
        },
        newVariables,
        modifiedVariables
      };
    }

    // For loop
    const forMatch = line.match(/^for\s*\((.+)\)$/);
    if (forMatch) {
      return {
        traceEntry: {
          step,
          line: lineNumber,
          action: 'loop' as const,
          details: `for (${forMatch[1]})`,
          timestamp: Date.now(),
          callStack: [...this.callStack],
          variables: this.getVariablesSnapshot([], [])
        },
        newVariables,
        modifiedVariables
      };
    }

    // Default: treat as expression
    return {
      traceEntry: {
        step,
        line: lineNumber,
        action: 'expression' as const,
        details: line,
        timestamp: Date.now(),
        callStack: [...this.callStack],
        variables: this.getVariablesSnapshot([], [])
      },
      newVariables,
      modifiedVariables
    };
  }

  private executeFunction(funcName: string, argsStr: string, lineNumber: number, step: number) {
    const func = this.functions.get(funcName)!;
    const args = argsStr.split(',').map(arg => this.evaluateExpression(arg.trim()));
    
    // Create new call stack frame
    const frame: CallStackFrame = {
      functionName: funcName,
      lineNumber,
      variables: [],
      parameters: func.params.map((param, index) => ({
        name: param,
        value: args[index] || undefined,
        type: typeof (args[index] || undefined),
        scope: funcName
      }))
    };
    
    this.callStack.push(frame);
    
    // Set parameter variables
    func.params.forEach((param, index) => {
      if (args[index] !== undefined) {
        this.variables.set(param, args[index]);
      }
    });

    return {
      traceEntry: {
        step,
        line: lineNumber,
        action: 'function_call' as const,
        details: `${funcName}(${args.map(arg => this.formatValue(arg)).join(', ')})`,
        timestamp: Date.now(),
        callStack: [...this.callStack],
        variables: this.getVariablesSnapshot(func.params, [])
      },
      newVariables: func.params,
      modifiedVariables: []
    };
  }

  private evaluateExpression(expression: string): any {
    expression = expression.trim();

    // Number literal
    if (/^\d+(\.\d+)?$/.test(expression)) {
      return parseFloat(expression);
    }

    // String literal
    if (/^["'].*["']$/.test(expression)) {
      return expression.slice(1, -1);
    }

    // Boolean literal
    if (expression === 'true') return true;
    if (expression === 'false') return false;

    // Variable reference
    if (/^\w+$/.test(expression)) {
      if (this.variables.has(expression)) {
        return this.variables.get(expression);
      }
      throw new Error(`Variable '${expression}' is not defined`);
    }

    // Simple arithmetic operations
    const arithmeticMatch = expression.match(/^(.+?)\s*([\+\-\*\/])\s*(.+)$/);
    if (arithmeticMatch) {
      const [, left, operator, right] = arithmeticMatch;
      const leftValue = this.getValue(left);
      const rightValue = this.getValue(right);

      switch (operator) {
        case '+': return leftValue + rightValue;
        case '-': return leftValue - rightValue;
        case '*': return leftValue * rightValue;
        case '/': return leftValue / rightValue;
      }
    }

    // Simple comparison operations
    const comparisonMatch = expression.match(/^(.+?)\s*(==|!=|<|>|<=|>=)\s*(.+)$/);
    if (comparisonMatch) {
      const [, left, operator, right] = comparisonMatch;
      const leftValue = this.getValue(left);
      const rightValue = this.getValue(right);

      switch (operator) {
        case '==': return leftValue == rightValue;
        case '!=': return leftValue != rightValue;
        case '<': return leftValue < rightValue;
        case '>': return leftValue > rightValue;
        case '<=': return leftValue <= rightValue;
        case '>=': return rightValue >= rightValue;
      }
    }

    return expression;
  }

  private getValue(token: string): any {
    token = token.trim();
    if (/^\d+(\.\d+)?$/.test(token)) {
      return parseFloat(token);
    }
    if (/^["'].*["']$/.test(token)) {
      return token.slice(1, -1);
    }
    if (this.variables.has(token)) {
      return this.variables.get(token);
    }
    return token;
  }

  private getVariablesSnapshot(newVariables: string[], modifiedVariables: string[]): Variable[] {
    return Array.from(this.variables.entries()).map(([name, value]) => ({
      name,
      value,
      type: typeof value,
      scope: this.callStack.length > 0 ? this.callStack[this.callStack.length - 1].functionName : 'global',
      isNew: newVariables.includes(name),
      isModified: modifiedVariables.includes(name)
    }));
  }

  private formatValue(value: any): string {
    if (typeof value === 'string') return `"${value}"`;
    if (value === undefined) return 'undefined';
    if (value === null) return 'null';
    return String(value);
  }

  private addErrorState(step: number, lineNumber: number, trace: TraceEntry[], error: string) {
    this.states.push({
      variables: this.getVariablesSnapshot([], []),
      callStack: [...this.callStack],
      trace: [...trace],
      currentLine: lineNumber,
      currentStep: step,
      isComplete: true,
      error,
      output: [...this.output]
    });
  }

  getState(step: number): ExecutionState {
    return this.states[step] || this.states[this.states.length - 1];
  }

  getTotalSteps(): number {
    return this.states.length - 1;
  }

  exportExecutionData(): any {
    return {
      code: this.code,
      states: this.states,
      config: this.config,
      timestamp: new Date().toISOString()
    };
  }
}