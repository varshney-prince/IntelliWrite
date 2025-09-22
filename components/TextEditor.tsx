import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { 
  Sparkles, Check, X, Loader2, Sun, Moon, Copy, FileText,
  Bold, Italic, Underline, Link, AlignLeft, AlignCenter, 
  AlignRight, List, ListOrdered, IndentDecrease, IndentIncrease,
  Palette, MoveVertical, Wand
} from './icons';

const TRANSLATIONS = {
  "en-US": {
    "appTitle": "IntelliWrite Assistant",
    "yourText": "Your Text",
    "sample": "Sample",
    "copy": "Copy",
    "fontFamily": "Font Family",
    "fontSize": "Font Size",
    "bold": "Bold",
    "italic": "Italic",
    "underline": "Underline",
    "textColor": "Text Color",
    "addLink": "Add Link",
    "alignLeft": "Align Left",
    "alignCenter": "Align Center",
    "alignRight": "Align Right",
    "lineSpacing": "Line Spacing",
    "bulletList": "Bullet List",
    "numberedList": "Numbered List",
    "decreaseIndent": "Decrease Indent",
    "increaseIndent": "Increase Indent",
    "addLinkTitle": "Add Link",
    "enterUrl": "Enter URL",
    "add": "Add",
    "cancel": "Cancel",
    "characters": "characters",
    "analyzeText": "Analyze Text",
    "analyzing": "Analyzing...",
    "suggestions": "Suggestions",
    "all": "All",
    "grammar": "Grammar",
    "spelling": "Spelling",
    "punctuation": "Punctuation",
    "style": "Style",
    "clarity": "Clarity",
    "clickAnalyzeText": "Click 'Analyze Text' to get suggestions",
    "noSuggestionsCategory": "No suggestions in this category",
    "applySuggestion": "Apply suggestion",
    "dismiss": "Dismiss",
    "textHighlightColor": "Text highlight color",
    "applyAllSuggestions": "Apply All Suggestions",
    "pleaseEnterText": "Please enter some text to analyze",
    "failedToAnalyze": "Failed to analyze text. Please try again.",
    "failedToParse": "Failed to parse suggestions. Please try again.",
    "reject": "Reject",
    "accept": "Accept",
    "rewriteSelection": "Rewrite Selection (beta)",
    "rewrite": "Rewrite",
    "rewriting": "Rewriting...",
    "nothingToRewrite": "Please select some text to rewrite.",
    "original": "Original",
    "rewritten": "Rewritten",
    "failedToRewrite": "Failed to rewrite text. Please try again."
  },
  "es-ES": {
    "appTitle": "Asistente de Escritura IntelliWrite",
    "yourText": "Tu Texto",
    "sample": "Muestra",
    "copy": "Copiar",
    "fontFamily": "Familia de Fuente",
    "fontSize": "Tamaño de Fuente",
    "bold": "Negrita",
    "italic": "Cursiva",
    "underline": "Subrayado",
    "textColor": "Color de Texto",
    "addLink": "Agregar Enlace",
    "alignLeft": "Alinear a la Izquierda",
    "alignCenter": "Centrar",
    "alignRight": "Alinear a la Derecha",
    "lineSpacing": "Espaciado de Línea",
    "bulletList": "Lista con Viñetas",
    "numberedList": "Lista Numerada",
    "decreaseIndent": "Disminuir Sangría",
    "increaseIndent": "Aumentar Sangría",
    "addLinkTitle": "Agregar Enlace",
    "enterUrl": "Ingresa URL",
    "add": "Agregar",
    "cancel": "Cancelar",
    "characters": "caracteres",
    "analyzeText": "Analizar Texto",
    "analyzing": "Analizando...",
    "suggestions": "Sugerencias",
    "all": "Todas",
    "grammar": "Gramática",
    "spelling": "Ortografía",
    "punctuation": "Puntuación",
    "style": "Estilo",
    "clarity": "Claridad",
    "clickAnalyzeText": "Haz clic en 'Analizar Texto' para obtener sugerencias",
    "noSuggestionsCategory": "No hay sugerencias en esta categoría",
    "applySuggestion": "Aplicar sugerencia",
    "dismiss": "Descartar",
    "textHighlightColor": "Color de resaltado de texto",
    "applyAllSuggestions": "Aplicar Todas las Sugerencias",
    "pleaseEnterText": "Por favor ingresa algún texto para analizar",
    "failedToAnalyze": "Error al analizar el texto. Por favor intenta de nuevo.",
    "failedToParse": "Error al procesar las sugerencias. Por favor intenta de nuevo.",
    "reject": "Rechazar",
    "accept": "Aceptar",
    "rewriteSelection": "Reescribir Selección (beta)",
    "rewrite": "Reescribir",
    "rewriting": "Reescribiendo...",
    "nothingToRewrite": "Por favor selecciona algún texto para reescribir.",
    "original": "Original",
    "rewritten": "Reescrito",
    "failedToRewrite": "Error al reescribir el texto. Por favor intenta de nuevo."
  }
};

const browserLocale = navigator.languages?.[0] || navigator.language || 'en-US';
const findMatchingLocale = (locale: string) => {
  if (TRANSLATIONS[locale as keyof typeof TRANSLATIONS]) return locale;
  const lang = locale.split('-')[0];
  const match = Object.keys(TRANSLATIONS).find(key => key.startsWith(lang + '-'));
  return match || 'en-US';
};
const locale = findMatchingLocale(browserLocale);
const t = (key: keyof typeof TRANSLATIONS['en-US']) => TRANSLATIONS[locale as keyof typeof TRANSLATIONS]?.[key] || TRANSLATIONS['en-US'][key] || key;

interface Suggestion {
  category: string;
  issue: string;
  suggestion: string;
  explanation: string;
  position?: number;
}

const TextEditor: React.FC = () => {
  const [text, setText] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [showLineSpacing, setShowLineSpacing] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<Suggestion | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0, isBelow: false });
  const editorRef = useRef<HTMLDivElement>(null);
  const [isRewriting, setIsRewriting] = useState(false);
  const [showRewriteModal, setShowRewriteModal] = useState(false);
  const [originalTextToRewrite, setOriginalTextToRewrite] = useState('');
  const [rewrittenText, setRewrittenText] = useState('');

  const categories = [
    { id: 'all', label: t('all'), color: 'bg-purple-500' },
    { id: 'grammar', label: t('grammar'), color: 'bg-blue-500' },
    { id: 'spelling', label: t('spelling'), color: 'bg-red-500' },
    { id: 'punctuation', label: t('punctuation'), color: 'bg-yellow-500' },
    { id: 'style', label: t('style'), color: 'bg-green-500' },
    { id: 'clarity', label: t('clarity'), color: 'bg-indigo-500' }
  ];

  const sampleTexts = [
    'Human welfare is at the heart of our work at Anthropic: our mission is to make sure that increasingly capable and sophisticated AI systems remain beneficial to humanity.\n\nBut as we build those AI systems, and as they begin to approximate or surpass many human qualities, another question arises. Should we also be concerned about the potential consciousness and experiences of the models themselves? Should we be concerned about *model welfare*, too?\n\nThis is an open question, and one that\'s both philosophically and scientifically difficult. But now that models can communicate, relate, plan, probelm-solve, and pursue goals—along with very many more characteristics we associate with people—we think it\'s time to address it.\n\nTo that end, we recently started a research program to investigate, and prepare to navigate, model welfare.'
  ];

  const colors = [
    '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', 
    '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#008000'
  ];

  const fonts = [
    { value: 'Arial', label: 'Arial' },
    { value: 'Times New Roman', label: 'Times New Roman' },
    { value: 'Georgia', label: 'Georgia' },
    { value: 'Verdana', label: 'Verdana' },
    { value: 'Helvetica', label: 'Helvetica' },
    { value: 'Courier New', label: 'Courier New' },
    { value: 'Trebuchet MS', label: 'Trebuchet MS' }
  ];

  const textSizes = [
    { value: '13.33px', label: '10' },
    { value: '14.67px', label: '11' },
    { value: '16px', label: '12' },
    { value: '18.67px', label: '14' },
    { value: '21.33px', label: '16' },
    { value: '24px', label: '18' },
    { value: '32px', label: '24' },
    { value: '48px', label: '36' }
  ];

  const lineSpacings = [
    { value: '1', label: '1.0' },
    { value: '1.15', label: '1.15' },
    { value: '1.5', label: '1.5' },
    { value: '2', label: '2.0' }
  ];

  const formatText = (command: string, value: string | null = null) => {
    if(!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command, false, value);
    updateContent();
  };

  const updateContent = () => {
    if (editorRef.current) {
      setActiveTooltip(null);
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = editorRef.current.innerHTML;
      const marks = tempDiv.querySelectorAll('mark');
      marks.forEach(mark => {
        const textNode = document.createTextNode(mark.textContent || '');
        mark.parentNode?.replaceChild(textNode, mark);
      });
      setText(tempDiv.innerText || '');
    }
  };

  const handleHighlightClick = (e: React.MouseEvent<HTMLElement>, issueText: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const matchingSuggestion = suggestions.find(s => s.issue === issueText);
    if (!matchingSuggestion || !editorRef.current) return;
    
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const editorRect = editorRef.current.getBoundingClientRect();
    
    let top = rect.top - editorRect.top - 10;
    let left = rect.left - editorRect.left + (rect.width / 2);
    let isBelow = false;
    
    if (top < 100) {
      top = rect.bottom - editorRect.top + 10;
      isBelow = true;
    }
    
    const tooltipWidth = 300;
    if (left - tooltipWidth / 2 < 10) {
      left = tooltipWidth / 2 + 10;
    } else if (left + tooltipWidth / 2 > editorRect.width - 10) {
      left = editorRect.width - tooltipWidth / 2 - 10;
    }
    
    setTooltipPosition({ top, left, isBelow });
    setActiveTooltip(matchingSuggestion);
  };
  
  const applyHighlights = () => {
    if (!editorRef.current) return;
    
    let content = editorRef.current.innerHTML;
    content = content.replace(/<mark[^>]*>(.*?)<\/mark>/g, '$1');

    if (suggestions.length === 0) {
      editorRef.current.innerHTML = content;
      return;
    }
    
    const categoryColors: { [key: string]: string } = {
        grammar: 'rgba(59, 130, 246, 0.3)',
        spelling: 'rgba(239, 68, 68, 0.3)',
        punctuation: 'rgba(245, 158, 11, 0.3)',
        style: 'rgba(34, 197, 94, 0.3)',
        clarity: 'rgba(99, 102, 241, 0.3)'
    };

    let tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    
    const textNodes: Text[] = [];
    const walk = document.createTreeWalker(tempDiv, NodeFilter.SHOW_TEXT, null);
    let node;
    while(node = walk.nextNode()) {
        textNodes.push(node as Text);
    }
    
    suggestions.forEach(suggestion => {
        const color = categoryColors[suggestion.category] || 'rgba(147, 51, 234, 0.3)';
        const issue = suggestion.issue;
        
        for (const textNode of textNodes) {
            const text = textNode.nodeValue || '';
            const index = text.indexOf(issue);

            if (index !== -1 && textNode.parentElement?.tagName !== 'MARK') {
                const range = document.createRange();
                range.setStart(textNode, index);
                range.setEnd(textNode, index + issue.length);

                const mark = document.createElement('mark');
                mark.dataset.issue = encodeURIComponent(issue);
                mark.style.backgroundColor = color;
                mark.style.padding = '2px 0';
                mark.style.borderRadius = '2px';
                mark.style.cursor = 'pointer';

                range.surroundContents(mark);
                break; 
            }
        }
    });

    editorRef.current.innerHTML = tempDiv.innerHTML;
  };
  
  useEffect(() => {
    applyHighlights();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [suggestions]);

  useEffect(() => {
    if (!editorRef.current) return;
    
    const handleEditorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'MARK') {
        const issueText = decodeURIComponent(target.getAttribute('data-issue') || '');
        handleHighlightClick(e as unknown as React.MouseEvent<HTMLElement>, issueText);
      }
    };
    
    const currentEditor = editorRef.current;
    currentEditor.addEventListener('click', handleEditorClick);
    return () => {
      currentEditor.removeEventListener('click', handleEditorClick);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [suggestions]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-dropdown]') && !target.closest('[data-tooltip]') && target.tagName !== 'MARK') {
        setShowColorPicker(false);
        setShowLineSpacing(false);
        setActiveTooltip(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
    updateContent();
  };

  const insertLink = () => {
    if (linkUrl) {
      formatText('createLink', linkUrl);
      setShowLinkDialog(false);
      setLinkUrl('');
    }
  };

  const loadSampleText = () => {
    const randomSample = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    if (editorRef.current) {
        editorRef.current.innerText = randomSample;
        updateContent();
    }
  };

  const analyzeText = async () => {
    if (editorRef.current) {
        let content = editorRef.current.innerHTML;
        content = content.replace(/<mark[^>]*>(.*?)<\/mark>/g, '$1');
        editorRef.current.innerHTML = content;
        updateContent();
    }
    
    if (!text.trim()) {
      setError(t('pleaseEnterText'));
      return;
    }
    
    setIsAnalyzing(true);
    setError('');
    setSuggestions([]);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const responseSchema = {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING },
            issue: { type: Type.STRING },
            suggestion: { type: Type.STRING },
            explanation: { type: Type.STRING },
          },
          required: ["category", "issue", "suggestion", "explanation"]
        }
      };
      const prompt = `Analyze the following text for grammar, spelling, punctuation, style, and clarity issues. For each issue, identify the problematic text ("issue"), provide a concise correction ("suggestion"), a brief "explanation" for the change, and the "category" of the issue (one of: "grammar", "spelling", "punctuation", "style", "clarity"). Respond ONLY with a valid JSON array of suggestions based on the provided schema. Do not include any introductory text, backticks, or other formatting. The text to analyze is:\n\n---\n\n${text}`;
      
      const genAIResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: responseSchema
        }
      });
      const response = genAIResponse.text;
      
      try {
        const parsedSuggestions = JSON.parse(response);
        if (Array.isArray(parsedSuggestions)) {
          setSuggestions(parsedSuggestions);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (parseError) {
        console.error('Parse error:', parseError);
        setError(t('failedToParse'));
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setError(t('failedToAnalyze'));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const applySuggestion = (suggestion: Suggestion) => {
    if (!editorRef.current) return;
    
    let content = editorRef.current.innerHTML;
    content = content.replace(/<mark[^>]*>(.*?)<\/mark>/g, '$1');
    content = content.replace(suggestion.issue, suggestion.suggestion);

    editorRef.current.innerHTML = content;
    updateContent();
    
    setSuggestions(suggestions.filter(s => s !== suggestion));
    
    if (activeTooltip && activeTooltip.issue === suggestion.issue) {
      setActiveTooltip(null);
    }
  };

  const handleRewriteClick = async () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.toString().trim() === '') {
      setError(t('nothingToRewrite'));
      setTimeout(() => setError(''), 3000);
      return;
    }

    const selectedText = selection.toString();
    setOriginalTextToRewrite(selectedText);
    setIsRewriting(true);
    setError('');
    setRewrittenText(''); // Clear previous rewritten text

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Rewrite the following text to be more clear, concise, and engaging. Return only the rewritten text, without any introductory phrases. Text: "${selectedText}"`;
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
      
      const newText = response.text.trim();
      setRewrittenText(newText);
      setShowRewriteModal(true);
    } catch (err) {
      console.error('Rewrite error:', err);
      setError(t('failedToRewrite'));
    } finally {
      setIsRewriting(false);
    }
  };

  const handleAcceptRewrite = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || !editorRef.current) return;

    // Check if the current selection inside the editor still matches the original text
    if (selection.toString() === originalTextToRewrite) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(rewrittenText));
    } else {
        // Fallback: if selection changed, replace the first occurrence in the editor
        let content = editorRef.current.innerHTML;
        editorRef.current.innerHTML = content.replace(originalTextToRewrite, rewrittenText);
    }

    updateContent();
    setShowRewriteModal(false);
  };


  const filteredSuggestions = activeCategory === 'all' 
    ? suggestions 
    : suggestions.filter(s => s.category === activeCategory);

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.color : 'bg-gray-500';
  };

  const copyText = () => {
    navigator.clipboard.writeText(text);
  };

  const dismissSuggestion = (suggestion: Suggestion) => {
    setSuggestions(suggestions.filter(s => s !== suggestion));
    if (activeTooltip && activeTooltip.issue === suggestion.issue) {
      setActiveTooltip(null);
    }
  };

  const ToolbarButton: React.FC<{
    icon: React.ElementType, 
    onClick?: () => void, 
    onMouseDown?: (e: React.MouseEvent) => void, 
    title: string, 
    active?: boolean,
    isLoading?: boolean,
    disabled?: boolean
  }> = ({ icon: Icon, onClick, onMouseDown, title, active = false, isLoading = false, disabled = false }) => (
    <button
      onClick={onClick}
      onMouseDown={onMouseDown}
      title={title}
      disabled={disabled || isLoading}
      className={`p-2 rounded transition-colors ${
        active 
          ? 'bg-indigo-500 dark:bg-indigo-600 text-white'
          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-700'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Icon className="w-4 h-4" />}
    </button>
  );

  const ToolbarSeparator = () => (
    <div className="w-px h-6 bg-slate-300 dark:bg-slate-700" />
  );

  return (
    <div className="transition-colors duration-300 border rounded-xl shadow-2xl shadow-indigo-500/10 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Editor Panel */}
          <div className="rounded-xl p-6 relative bg-white dark:bg-slate-900">
             <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                {t('yourText')}
              </h2>
              <div className="flex gap-2">
                <button onClick={loadSampleText} className="px-3 py-1 text-sm rounded-lg transition-colors flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300" >
                  <FileText className="w-4 h-4" />
                  {t('sample')}
                </button>
                <button onClick={copyText} className="px-3 py-1 text-sm rounded-lg transition-colors flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300">
                  <Copy className="w-4 h-4" />
                  {t('copy')}
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1 p-2 mb-2 rounded-lg border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <select onChange={(e) => formatText('fontName', e.target.value)} defaultValue="Arial" className="px-2 py-1 rounded text-sm bg-white text-slate-700 border-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600" title={t('fontFamily')} >
                {fonts.map(font => <option key={font.value} value={font.value}>{font.label}</option>)}
              </select>
              <select onChange={(e) => document.execCommand('fontSize', false, (textSizes.findIndex(s => s.value === e.target.value) + 1).toString())} defaultValue="16px" className="px-2 py-1 rounded text-sm bg-white text-slate-700 border-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600" title={t('fontSize')} >
                {textSizes.map(size => <option key={size.value} value={size.value}>{size.label}</option>)}
              </select>
              <ToolbarSeparator />
              <ToolbarButton icon={Bold} onClick={() => formatText('bold')} title={t('bold')} />
              <ToolbarButton icon={Italic} onClick={() => formatText('italic')} title={t('italic')} />
              <ToolbarButton icon={Underline} onClick={() => formatText('underline')} title={t('underline')} />
              <ToolbarSeparator />
              <div className="relative" data-dropdown="color">
                <ToolbarButton icon={Palette} onClick={() => setShowColorPicker(!showColorPicker)} title={t('textColor')} />
                {showColorPicker && (
                  <div className="absolute top-10 left-0 p-2 rounded-lg shadow-lg z-10 bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                    <div className="grid grid-cols-5 gap-1">
                      {colors.map(color => <button key={color} onClick={() => { formatText('foreColor', color); setShowColorPicker(false); }} className="w-6 h-6 rounded border border-slate-400" style={{ backgroundColor: color }} />)}
                    </div>
                  </div>
                )}
              </div>
              <ToolbarButton icon={Link} onClick={() => setShowLinkDialog(true)} title={t('addLink')} />
              <ToolbarSeparator />
              <ToolbarButton icon={AlignLeft} onClick={() => formatText('justifyLeft')} title={t('alignLeft')} />
              <ToolbarButton icon={AlignCenter} onClick={() => formatText('justifyCenter')} title={t('alignCenter')} />
              <ToolbarButton icon={AlignRight} onClick={() => formatText('justifyRight')} title={t('alignRight')} />
              <ToolbarSeparator />
              <div className="relative" data-dropdown="line-spacing">
                <ToolbarButton icon={MoveVertical} onClick={() => setShowLineSpacing(!showLineSpacing)} title={t('lineSpacing')} />
                {showLineSpacing && (
                  <div className="absolute top-10 left-0 p-2 rounded-lg shadow-lg z-10 bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                    <div className="flex flex-col gap-1">
                      {lineSpacings.map(spacing => (
                        <button key={spacing.value} onClick={() => { if(editorRef.current) editorRef.current.style.lineHeight = spacing.value; setShowLineSpacing(false); }} className="px-3 py-1 text-sm text-left rounded text-slate-700 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700">
                          {spacing.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <ToolbarSeparator />
              <ToolbarButton icon={List} onMouseDown={(e) => { e.preventDefault(); formatText('insertUnorderedList'); }} title={t('bulletList')} />
              <ToolbarButton icon={ListOrdered} onMouseDown={(e) => { e.preventDefault(); formatText('insertOrderedList'); }} title={t('numberedList')} />
              <ToolbarButton icon={IndentDecrease} onClick={() => formatText('outdent')} title={t('decreaseIndent')} />
              <ToolbarButton icon={IndentIncrease} onClick={() => formatText('indent')} title={t('increaseIndent')} />
              <ToolbarSeparator />
              <ToolbarButton icon={Wand} onClick={handleRewriteClick} title={t('rewriteSelection')} isLoading={isRewriting} />
            </div>

            {showLinkDialog && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="p-4 rounded-lg bg-white dark:bg-slate-800">
                  <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">{t('addLinkTitle')}</h3>
                  <input type="text" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder={t('enterUrl')} className="w-64 px-3 py-2 rounded border bg-slate-50 border-slate-300 text-slate-900 dark:bg-slate-900 dark:border-slate-700 dark:text-white" />
                  <div className="flex gap-2 mt-3">
                    <button onClick={insertLink} className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600">{t('add')}</button>
                    <button onClick={() => { setShowLinkDialog(false); setLinkUrl(''); }} className="px-4 py-2 rounded bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600">{t('cancel')}</button>
                  </div>
                </div>
              </div>
            )}
            
            {showRewriteModal && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="p-6 rounded-lg bg-white dark:bg-slate-800 w-full max-w-2xl shadow-xl border border-slate-200 dark:border-slate-700">
                    <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">{t('rewrite')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2">
                        <div>
                            <h4 className="font-medium text-slate-500 dark:text-slate-400 mb-2">{t('original')}</h4>
                            <div className="p-3 rounded-md bg-slate-100 dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-300">
                                {originalTextToRewrite}
                            </div>
                        </div>
                        <div>
                            <h4 className="font-medium text-slate-500 dark:text-slate-400 mb-2">{t('rewritten')}</h4>
                            <div className="p-3 rounded-md bg-emerald-50 dark:bg-emerald-900/50 text-sm text-emerald-800 dark:text-emerald-200">
                                {rewrittenText || <span className="italic text-slate-400">{t('rewriting')}</span>}
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2 mt-6 justify-end">
                        <button onClick={handleAcceptRewrite} disabled={!rewrittenText} className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 disabled:bg-indigo-300 disabled:cursor-not-allowed">{t('accept')}</button>
                        <button onClick={() => setShowRewriteModal(false)} className="px-4 py-2 rounded bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600">{t('cancel')}</button>
                    </div>
                </div>
              </div>
            )}

            <div ref={editorRef} contentEditable={true} suppressContentEditableWarning={true} onInput={updateContent} onPaste={handlePaste} className="w-full h-96 p-4 rounded-lg border transition-colors overflow-y-auto focus:outline-none focus:ring-2 bg-slate-50 border-slate-200 text-slate-900 focus:ring-indigo-400 dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:focus:ring-indigo-500" style={{ minHeight: '24rem', fontFamily: 'Arial, sans-serif', fontSize: '16px', lineHeight: '1.5' }} />
            
            <div className="mt-4 flex justify-between items-center">
              <span className="text-sm text-slate-600 dark:text-slate-400">{text.length} {t('characters')}</span>
              <button onClick={analyzeText} disabled={isAnalyzing || !text.trim()} className={`px-6 py-2 rounded-lg font-medium transition-all transform hover:scale-105 flex items-center gap-2 ${ isAnalyzing || !text.trim() ? 'bg-slate-600 text-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-lg' }`}>
                {isAnalyzing ? (<><Loader2 className="w-4 h-4 animate-spin" />{t('analyzing')}</>) : (<><Sparkles className="w-4 h-4" />{t('analyzeText')}</>)}
              </button>
            </div>

            {error && (<div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20"><p className="text-red-500 text-sm">{error}</p></div>)}

            {activeTooltip && (
              <div data-tooltip className="absolute z-20 p-3 rounded-lg shadow-xl border bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-700" style={{ top: `${tooltipPosition.top}px`, left: `${tooltipPosition.left}px`, transform: tooltipPosition.isBelow ? 'translateX(-50%)' : 'translate(-50%, -100%)', maxWidth: '300px' }}>
                <div className="flex items-center gap-2 mb-2"><span className={`inline-block px-2 py-1 rounded-full text-xs font-medium text-white ${getCategoryColor(activeTooltip.category)}`}>{activeTooltip.category}</span></div>
                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="line-through text-red-600 dark:text-red-400">{activeTooltip.issue}</span>
                    <span className="text-slate-400 dark:text-slate-500">→</span>
                    <span className="font-medium text-green-600 dark:text-green-400">{activeTooltip.suggestion}</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{activeTooltip.explanation}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => applySuggestion(activeTooltip)} className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors">{t('accept')}</button>
                  <button onClick={() => dismissSuggestion(activeTooltip)} className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors">{t('reject')}</button>
                  <button onClick={() => setActiveTooltip(null)} className="px-3 py-1 rounded text-sm transition-colors bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600">{t('cancel')}</button>
                </div>
                <div 
                   className={`absolute w-3 h-3 transform rotate-45 bg-white dark:bg-slate-900 ${ tooltipPosition.isBelow ? 'border-l border-t' : 'border-r border-b' } border-slate-200 dark:border-slate-700`} 
                   style={{ ...(tooltipPosition.isBelow ? { top: '-6px', left: '50%', transform: 'translateX(-50%) rotate(45deg)' } : { bottom: '-6px', left: '50%', transform: 'translateX(-50%) rotate(45deg)' }) }} 
                />
              </div>
            )}
          </div>

          {/* Suggestions Panel */}
          <div className="rounded-xl p-6 border-t lg:border-t-0 lg:border-l flex flex-col bg-slate-50/50 border-slate-200 dark:bg-slate-900/50 dark:border-slate-800">
            <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">{t('suggestions')}</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {categories.map(category => (
                <button key={category.id} onClick={() => setActiveCategory(category.id)} className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${ activeCategory === category.id ? `${category.color} text-white` : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700' }`}>
                  {category.label}
                  {suggestions.filter(s => category.id === 'all' || s.category === category.id).length > 0 && <span className="ml-1">({suggestions.filter(s => category.id === 'all' || s.category === category.id).length})</span>}
                </button>
              ))}
            </div>
            <div className="space-y-3 flex-grow h-80 overflow-y-auto pr-2">
              {filteredSuggestions.length === 0 ? (
                <div className="text-center py-12 text-slate-400 dark:text-slate-500">
                  {suggestions.length === 0 ? t('clickAnalyzeText') : t('noSuggestionsCategory')}
                </div>
              ) : (
                filteredSuggestions.map((suggestion, index) => (
                  <div key={index} className="p-4 rounded-lg border transition-all hover:shadow-md bg-white border-slate-200 hover:border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:hover:border-slate-600">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2"><span className={`inline-block px-2 py-1 rounded-full text-xs font-medium text-white ${getCategoryColor(suggestion.category)}`}>{suggestion.category}</span></div>
                      <div className="flex gap-1">
                        <button onClick={() => applySuggestion(suggestion)} className="p-1 rounded hover:bg-green-500/20 text-green-500 transition-colors" title={t('applySuggestion')}><Check className="w-4 h-4" /></button>
                        <button onClick={() => dismissSuggestion(suggestion)} className="p-1 rounded hover:bg-red-500/20 text-red-500 transition-colors" title={t('dismiss')}><X className="w-4 h-4" /></button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="line-through text-red-600 dark:text-red-400">{suggestion.issue}</span>
                        <span className="text-slate-400 dark:text-slate-500">→</span>
                        <span className="font-medium text-green-600 dark:text-green-400">{suggestion.suggestion}</span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{suggestion.explanation}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            {suggestions.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <button onClick={() => { if (!editorRef.current) return; let content = editorRef.current.innerHTML; content = content.replace(/<mark[^>]*>(.*?)<\/mark>/g, '$1'); suggestions.forEach(suggestion => { content = content.replace(suggestion.issue, suggestion.suggestion); }); editorRef.current.innerHTML = content; updateContent(); setSuggestions([]); }} className="w-full py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium hover:from-green-600 hover:to-emerald-700 transition-all">{t('applyAllSuggestions')}</button>
              </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default TextEditor;