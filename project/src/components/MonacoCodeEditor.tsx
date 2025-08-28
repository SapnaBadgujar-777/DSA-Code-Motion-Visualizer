import React, { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Upload, FileText, Copy, Cast as Paste } from 'lucide-react';

interface MonacoCodeEditorProps {
  code: string;
  onCodeChange: (code: string) => void;
  currentLine: number;
  isExecuting: boolean;
  language: string;
}

export const MonacoCodeEditor: React.FC<MonacoCodeEditorProps> = ({
  code,
  onCodeChange,
  currentLine,
  isExecuting,
  language
}) => {
  const editorRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editorRef.current && currentLine > 0) {
      // Highlight current line
      const editor = editorRef.current;
      const model = editor.getModel();
      
      if (model) {
        // Clear previous decorations
        const oldDecorations = editor.getModel()?.getAllDecorations() || [];
        const decorationIds = oldDecorations.map(d => d.id);
        
        // Add current line decoration
        const newDecorations = [{
          range: {
            startLineNumber: currentLine,
            startColumn: 1,
            endLineNumber: currentLine,
            endColumn: model.getLineMaxColumn(currentLine)
          },
          options: {
            isWholeLine: true,
            className: 'current-line-highlight',
            glyphMarginClassName: 'current-line-glyph'
          }
        }];
        
        editor.deltaDecorations(decorationIds, newDecorations);
        
        // Scroll to current line
        editor.revealLineInCenter(currentLine);
      }
    }
  }, [currentLine]);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    
    // Add custom CSS for line highlighting
    const style = document.createElement('style');
    style.textContent = `
      .current-line-highlight {
        background-color: rgba(59, 130, 246, 0.15) !important;
        border-left: 3px solid #3b82f6 !important;
        animation: pulse-highlight 1s ease-in-out;
      }
      
      .current-line-glyph {
        background-color: #3b82f6 !important;
        width: 4px !important;
        margin-left: 3px !important;
        border-radius: 2px !important;
      }
      
      @keyframes pulse-highlight {
        0% { background-color: rgba(59, 130, 246, 0.3); }
        50% { background-color: rgba(59, 130, 246, 0.1); }
        100% { background-color: rgba(59, 130, 246, 0.15); }
      }
    `;
    document.head.appendChild(style);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        onCodeChange(content);
      };
      reader.readAsText(file);
    }
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      onCodeChange(text);
    } catch (err) {
      console.error('Failed to read clipboard:', err);
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  return (
    <div className="h-full bg-white rounded-lg shadow-lg border overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-4 py-3 border-b flex items-center justify-between">
        <h3 className="text-gray-800 font-semibold flex items-center gap-2">
          <FileText size={16} />
          Code Editor
        </h3>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors"
            disabled={isExecuting}
          >
            <Upload size={14} />
            Upload
          </button>
          
          <button
            onClick={handlePasteFromClipboard}
            className="flex items-center gap-1 px-3 py-1 text-sm bg-green-100 hover:bg-green-200 text-green-700 rounded transition-colors"
            disabled={isExecuting}
          >
            <Paste size={14} />
            Paste
          </button>
          
          <button
            onClick={handleCopyToClipboard}
            className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
          >
            <Copy size={14} />
            Copy
          </button>
        </div>
      </div>

      {/* Monaco Editor */}
      <div style={{ height: '400px' }}>
        <Editor
          height="400px"
          language={language === 'javascript' ? 'javascript' : language}
          value={code}
          onChange={(value) => onCodeChange(value || '')}
          onMount={handleEditorDidMount}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            readOnly: isExecuting,
            automaticLayout: true,
            wordWrap: 'on',
            lineDecorationsWidth: 10,
            lineNumbersMinChars: 3,
            glyphMargin: true,
            folding: true,
            selectOnLineNumbers: true,
            matchBrackets: 'always',
            cursorStyle: 'line',
            renderLineHighlight: 'none'
          }}
        />
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".py,.js,.java,.cpp,.c,.txt"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
};