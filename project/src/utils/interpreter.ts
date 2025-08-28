interface Variable {
  name: string;
  value: any;
  type: string;
  isNew?: boolean;
  isModified?: boolean;
}

interface TraceEntry {
  step: number;
  line: number;
  action: string;
  details?: string;
}

interface ExecutionState {
  variables: Variable[];
  trace: TraceEntry[];
  currentLine: number;
  currentStep: number;
  isComplete: boolean;
  error?: string;
}

export class SimpleInterpreter {
  private code: string[] = [];
  private states: ExecutionState[] = [];
  private variables: Map<string, any> = new Map();

  constructor(code: string) {
    this.code = code.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    this.generateExecutionStates();
  }

  private generateExecutionStates() {
    this.states = [];
    this.variables = new Map();
    let step = 0;
    let trace: TraceEntry[] = [];

    // Initial state
    this.states.push({
      variables: [],
      trace: [],
      currentLine: 0,
      currentStep: 0,
      isComplete: false
    });

    for (let i = 0; i < this.code.length; i++) {
      const line = this.code[i];
      const lineNumber = i + 1;
      step++;

      try {
        const result = this.executeLine(line, lineNumber, step);
        trace.push(result.traceEntry);

        const variables = Array.from(this.variables.entries()).map(([name, value]) => ({
          name,
          value,
          type: typeof value,
          isNew: result.newVariables?.includes(name),
          isModified: result.modifiedVariables?.includes(name)
        }));

        this.states.push({
          variables,
          trace: [...trace],
          currentLine: lineNumber,
          currentStep: step,
          isComplete: i === this.code.length - 1
        });
      } catch (error) {
        this.states.push({
          variables: Array.from(this.variables.entries()).map(([name, value]) => ({
            name,
            value,
            type: typeof value
          })),
          trace: [...trace],
          currentLine: lineNumber,
          currentStep: step,
          isComplete: true,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        break;
      }
    }
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
          action: 'Assignment',
          details: `${varName} = ${newValue}`
        },
        newVariables,
        modifiedVariables
      };
    }

    // Console.log (for demonstration)
    const consoleMatch = line.match(/^console\.log\((.+)\)$/);
    if (consoleMatch) {
      const expression = consoleMatch[1];
      const value = this.evaluateExpression(expression);
      
      return {
        traceEntry: {
          step,
          line: lineNumber,
          action: 'Console Output',
          details: `console.log(${value})`
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
          action: 'Condition Check',
          details: `if (${condition}) → ${result}`
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
        action: 'Expression',
        details: line
      },
      newVariables,
      modifiedVariables
    };
  }

  private evaluateExpression(expression: string): any {
    // Remove whitespace
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
    const arithmeticMatch = expression.match(/^(\w+|\d+)\s*([\+\-\*\/])\s*(\w+|\d+)$/);
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
    const comparisonMatch = expression.match(/^(\w+|\d+)\s*(==|!=|<|>|<=|>=)\s*(\w+|\d+)$/);
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
        case '>=': return leftValue >= rightValue;
      }
    }

    // Default: return the expression as is
    return expression;
  }

  private getValue(token: string): any {
    if (/^\d+(\.\d+)?$/.test(token)) {
      return parseFloat(token);
    }
    if (this.variables.has(token)) {
      return this.variables.get(token);
    }
    return token;
  }

  getState(step: number): ExecutionState {
    return this.states[step] || this.states[this.states.length - 1];
  }

  getTotalSteps(): number {
    return this.states.length - 1;
  }
}