import React, { useState, useRef, useEffect } from 'react';
import { NoteDocument, Subject } from '../types';
import {
  FileText,
  Save,
  Download,
  Plus,
  Trash2,
  Copy,
  Check,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Table as TableIcon,
  Sparkles,
  Highlighter,
  Type,
  Palette,
  Printer,
  Undo,
  Redo,
  Search,
  Star,
  FolderPlus,
  Share2,
  SlidersHorizontal,
  HelpCircle,
  ChevronDown,
  Link as LinkIcon,
  Image as ImageIcon,
  Minus,
  Code,
  Maximize2,
  Minimize2,
  Tag,
  FileDown,
  Layers,
  BookOpen,
} from 'lucide-react';

interface NotebookViewProps {
  documents: NoteDocument[];
  onSaveDocument: (doc: NoteDocument) => void;
  onDeleteDocument: (docId: string) => void;
  onCreateDocument: (doc: Omit<NoteDocument, 'id' | 'createdAt' | 'updatedAt'>) => NoteDocument;
  subjects: Subject[];
}

export const NotebookView: React.FC<NotebookViewProps> = ({
  documents,
  onSaveDocument,
  onDeleteDocument,
  onCreateDocument,
  subjects,
}) => {
  // Active document selection
  const [activeDocId, setActiveDocId] = useState<string>(documents[0]?.id || '');
  const activeDoc = documents.find((d) => d.id === activeDocId) || documents[0];

  // Editor internal states
  const [title, setTitle] = useState<string>(activeDoc?.title || 'Novo Documento');
  const [subject, setSubject] = useState<string>(activeDoc?.subject || 'Geral');
  const [paperStyle, setPaperStyle] = useState<'blank' | 'lined' | 'grid' | 'sepia' | 'dark'>(
    activeDoc?.paperStyle || 'blank',
  );
  const [tags, setTags] = useState<string[]>(activeDoc?.tags || []);
  const [tagInput, setTagInput] = useState<string>('');

  // UI Panels & Layout states
  // Starts open on desktop (matches the previous side-by-side layout) and closed on
  // mobile/tablet, where the drawer now overlays the editor instead of squeezing it.
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true,
  );
  const [searchDocQuery, setSearchDocQuery] = useState<string>('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [fullScreenMode, setFullScreenMode] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);
  const [showExportMenu, setShowExportMenu] = useState<boolean>(false);
  const [showTemplatesModal, setShowTemplatesModal] = useState<boolean>(false);
  const [showSymbolPicker, setShowSymbolPicker] = useState<boolean>(false);
  const [showCalloutPicker, setShowCalloutPicker] = useState<boolean>(false);
  const [stats, setStats] = useState({ words: 0, chars: 0, readingTime: 1 });

  // Editor ref
  const editorRef = useRef<HTMLDivElement>(null);
  const isUpdatingFromState = useRef<boolean>(false);

  // Sync editor when active document changes
  useEffect(() => {
    if (activeDoc) {
      setTitle(activeDoc.title);
      setSubject(activeDoc.subject || 'Geral');
      setPaperStyle(activeDoc.paperStyle || 'blank');
      setTags(activeDoc.tags || []);

      if (editorRef.current) {
        isUpdatingFromState.current = true;
        editorRef.current.innerHTML = activeDoc.content || '';
        calculateStats(editorRef.current.innerText || '');
        isUpdatingFromState.current = false;
      }
      setSaveStatus('saved');
    }
  }, [activeDocId]);

  // Calculate word and character count
  const calculateStats = (text: string) => {
    const cleanText = text.trim();
    const words = cleanText ? cleanText.split(/\s+/).filter(Boolean).length : 0;
    const chars = cleanText.length;
    const readingTime = Math.max(1, Math.ceil(words / 200));
    setStats({ words, chars, readingTime });
  };

  // Trigger rich text command
  const executeCommand = (command: string, value: string | undefined = undefined) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command, false, value);
    handleEditorInput();
  };

  // Handle content edits
  const handleEditorInput = () => {
    if (isUpdatingFromState.current) return;
    setSaveStatus('unsaved');
    if (editorRef.current) {
      calculateStats(editorRef.current.innerText || '');
    }
  };

  // Save current document
  const handleSave = () => {
    if (!activeDoc || !editorRef.current) return;
    setSaveStatus('saving');

    const updated: NoteDocument = {
      ...activeDoc,
      title: title.trim() || 'Documento Sem Título',
      subject,
      paperStyle,
      tags,
      content: editorRef.current.innerHTML,
      updatedAt: new Date().toISOString(),
    };

    onSaveDocument(updated);
    setTimeout(() => {
      setSaveStatus('saved');
    }, 400);
  };

  // Keyboard shortcut support (Ctrl+S, Ctrl+B, etc.)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
      e.preventDefault();
      handleSave();
    }
  };

  // Auto-save on delay
  useEffect(() => {
    if (saveStatus === 'unsaved') {
      const timer = setTimeout(() => {
        handleSave();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [saveStatus, title, subject, paperStyle, tags]);

  // Create new document
  const handleCreateNew = (customTemplate?: {
    title: string;
    content: string;
    subject: string;
  }) => {
    const newDoc = onCreateDocument({
      title: customTemplate?.title || 'Novo Documento',
      subject: customTemplate?.subject || 'Geral',
      content:
        customTemplate?.content ||
        '<h1>Novo Documento</h1><p>Comece a escrever suas anotações aqui...</p>',
      tags: ['Anotações'],
      isFavorite: false,
      paperStyle: 'blank',
    });
    setActiveDocId(newDoc.id);
    setShowTemplatesModal(false);
  };

  // Export handlers
  const handleDownloadWord = () => {
    if (!editorRef.current) return;
    const contentHtml = editorRef.current.innerHTML;
    const docTitle = title.trim() || 'Documento';

    const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' 
          xmlns:w='urn:schemas-microsoft-com:office:word' 
          xmlns='http://www.w3.org/TR/REC-html40'>
          <head><meta charset='utf-8'><title>${docTitle}</title>
          <style>
            body { font-family: 'Calibri', 'Segoe UI', Arial, sans-serif; font-size: 11pt; line-height: 1.5; color: #1e293b; }
            h1 { font-size: 20pt; color: #004ac6; margin-bottom: 12pt; }
            h2 { font-size: 15pt; color: #1e293b; margin-top: 14pt; margin-bottom: 6pt; }
            h3 { font-size: 13pt; color: #475569; }
            table { width: 100%; border-collapse: collapse; margin: 12pt 0; }
            th, td { border: 1px solid #cbd5e1; padding: 6pt 8pt; text-align: left; }
            th { background-color: #f1f5f9; font-weight: bold; }
            blockquote { border-left: 3pt solid #004ac6; padding-left: 10pt; color: #475569; font-style: italic; }
            hr { border: none; border-top: 1px solid #cbd5e1; margin: 14pt 0; }
          </style>
          </head><body>
          <h2>${docTitle}</h2>
          <p style="color: #64748b; font-size: 9pt;">Matéria: ${subject} | Atualizado em: ${new Date().toLocaleDateString('pt-BR')}</p>
          <hr />
          ${contentHtml}
          </body></html>`;

    const blob = new Blob(['\ufeff', header], {
      type: 'application/msword',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${docTitle.replace(/[^\w\s-]/gi, '')}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const handleDownloadTxt = () => {
    if (!editorRef.current) return;
    const text =
      `${title}\nMatéria: ${subject}\nData: ${new Date().toLocaleDateString('pt-BR')}\n----------------------------------\n\n` +
      (editorRef.current.innerText || '');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.replace(/[^\w\s-]/gi, '')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const handleDownloadMarkdown = () => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    // Simple fast HTML to Markdown converter
    const md = html
      .replace(/<h1>(.*?)<\/h1>/gi, '# $1\n\n')
      .replace(/<h2>(.*?)<\/h2>/gi, '## $1\n\n')
      .replace(/<h3>(.*?)<\/h3>/gi, '### $1\n\n')
      .replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
      .replace(/<b>(.*?)<\/b>/gi, '**$1**')
      .replace(/<em>(.*?)<\/em>/gi, '*$1*')
      .replace(/<i>(.*?)<\/i>/gi, '*$1*')
      .replace(/<u>(.*?)<\/u>/gi, '_$1_')
      .replace(/<strike>(.*?)<\/strike>/gi, '~~$1~~')
      .replace(/<li>(.*?)<\/li>/gi, '- $1\n')
      .replace(/<hr\s*\/?>/gi, '\n---\n\n')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<p>(.*?)<\/p>/gi, '$1\n\n')
      .replace(/<[^>]+>/g, '');

    const finalMd = `# ${title}\n*Matéria: ${subject} | ${new Date().toLocaleDateString('pt-BR')}*\n\n${md}`;
    const blob = new Blob([finalMd], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.replace(/[^\w\s-]/gi, '')}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const handlePrint = () => {
    setShowExportMenu(false);
    window.print();
  };

  const handleCopyAll = () => {
    if (!editorRef.current) return;
    navigator.clipboard.writeText(editorRef.current.innerText || '');
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
    setShowExportMenu(false);
  };

  const handleInsertTable = () => {
    const tableHtml = `
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0; border: 1px solid #cbd5e1;">
        <thead>
          <tr style="background-color: #f1f5f9;">
            <th style="padding: 8px 12px; border: 1px solid #cbd5e1; text-align: left;">Coluna 1</th>
            <th style="padding: 8px 12px; border: 1px solid #cbd5e1; text-align: left;">Coluna 2</th>
            <th style="padding: 8px 12px; border: 1px solid #cbd5e1; text-align: left;">Coluna 3</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 8px 12px; border: 1px solid #cbd5e1;">Item A</td>
            <td style="padding: 8px 12px; border: 1px solid #cbd5e1;">Descrição</td>
            <td style="padding: 8px 12px; border: 1px solid #cbd5e1;">Detalhe</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; border: 1px solid #cbd5e1;">Item B</td>
            <td style="padding: 8px 12px; border: 1px solid #cbd5e1;">Descrição</td>
            <td style="padding: 8px 12px; border: 1px solid #cbd5e1;">Detalhe</td>
          </tr>
        </tbody>
      </table>
      <p><br></p>
    `;
    executeCommand('insertHTML', tableHtml);
  };

  const handleInsertCallout = (type: 'tip' | 'warning' | 'formula' | 'summary') => {
    let calloutHtml = '';
    if (type === 'tip') {
      calloutHtml = `
        <div style="background-color: #e0f2fe; border-left: 4px solid #0284c7; padding: 12px 16px; border-radius: 8px; margin: 16px 0; color: #0369a1;">
          <strong>💡 Dica de Estudo:</strong> Digite seu macete ou ponto importante aqui.
        </div><p><br></p>
      `;
    } else if (type === 'warning') {
      calloutHtml = `
        <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px 16px; border-radius: 8px; margin: 16px 0; color: #92400e;">
          <strong>⚠️ Atenção:</strong> Ponto crítico para a prova que não pode ser esquecido!
        </div><p><br></p>
      `;
    } else if (type === 'formula') {
      calloutHtml = `
        <div style="background-color: #f3e8ff; border-left: 4px solid #9333ea; padding: 12px 16px; border-radius: 8px; margin: 16px 0; font-family: monospace; color: #581c87;">
          <strong>📐 Fórmula:</strong> Δ = b² - 4ac &nbsp;|&nbsp; x = (-b ± √Δ) / 2a
        </div><p><br></p>
      `;
    } else {
      calloutHtml = `
        <div style="background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 12px 16px; border-radius: 8px; margin: 16px 0; color: #065f46;">
          <strong>📌 Síntese Rápida:</strong> Resumo em 2 linhas das conclusões deste tópico.
        </div><p><br></p>
      `;
    }
    executeCommand('insertHTML', calloutHtml);
    setShowCalloutPicker(false);
  };

  const handleInsertSymbol = (sym: string) => {
    executeCommand('insertText', sym);
    setShowSymbolPicker(false);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
      setSaveStatus('unsaved');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
    setSaveStatus('unsaved');
  };

  // Filtered document list for sidebar
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchDocQuery.toLowerCase()) ||
      doc.subject.toLowerCase().includes(searchDocQuery.toLowerCase()) ||
      doc.tags.some((t) => t.toLowerCase().includes(searchDocQuery.toLowerCase()));
    const matchesSubject = selectedSubjectFilter === 'all' || doc.subject === selectedSubjectFilter;
    const matchesFav = !showFavoritesOnly || doc.isFavorite;
    return matchesSearch && matchesSubject && matchesFav;
  });

  // Paper background classes
  const getPaperStyles = () => {
    switch (paperStyle) {
      case 'lined':
        return 'bg-white text-slate-800 [background-image:linear-gradient(to_bottom,transparent_31px,#e2e8f0_32px)] [background-size:100%_32px]';
      case 'grid':
        return 'bg-white text-slate-800 [background-image:linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] [background-size:24px_24px]';
      case 'sepia':
        return 'bg-[#fbf7ee] text-[#433422] border-[#e8dfcf]';
      case 'dark':
        return 'bg-[#1e293b] text-[#f8fafc] border-[#334155]';
      case 'blank':
      default:
        return 'bg-white text-slate-900';
    }
  };

  return (
    <div
      className={`flex flex-col h-[calc(100vh-6rem)] ${fullScreenMode ? 'fixed inset-0 z-50 bg-[#f7f9fb] h-screen p-4' : ''}`}
    >
      {/* Top Application Bar for Notebook */}
      <div className="bg-white border border-[#c3c6d7]/40 rounded-2xl p-3 mb-3 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Left: Document Info & Toggle Sidebar */}
        <div className="flex items-center gap-3 flex-1 min-w-[280px]">
          <button
            id="toggle-notebook-drawer-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-2 rounded-xl transition-colors ${sidebarOpen ? 'bg-[#004ac6]/10 text-[#004ac6]' : 'text-slate-600 hover:bg-slate-100'}`}
            title={sidebarOpen ? 'Ocultar lista de arquivos' : 'Mostrar lista de arquivos'}
          >
            <Layers className="w-5 h-5" />
          </button>

          <div className="flex flex-col flex-1">
            <div className="flex items-center gap-2">
              <input
                id="doc-title-input"
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setSaveStatus('unsaved');
                }}
                placeholder="Título do Documento..."
                className="font-bold text-lg text-[#191c1e] bg-transparent border-b border-transparent hover:border-slate-300 focus:border-[#004ac6] focus:outline-none px-1 py-0.5 w-full max-w-md transition-colors"
              />
              {activeDoc?.isFavorite && (
                <Star className="w-4 h-4 fill-amber-400 text-amber-400 shrink-0" />
              )}
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-500 pl-1">
              <select
                id="doc-subject-select"
                value={subject}
                onChange={(e) => {
                  setSubject(e.target.value);
                  setSaveStatus('unsaved');
                }}
                className="bg-slate-100 text-slate-700 rounded-md px-2 py-0.5 font-medium border-0 focus:ring-1 focus:ring-[#004ac6] cursor-pointer"
              >
                <option value="Geral">Geral</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>

              <span className="flex items-center gap-1">
                {saveStatus === 'saved' && (
                  <span className="text-emerald-600 flex items-center gap-1 font-medium">
                    <Check className="w-3.5 h-3.5" /> Salvo
                  </span>
                )}
                {saveStatus === 'saving' && (
                  <span className="text-blue-600 animate-pulse font-medium">Salvando...</span>
                )}
                {saveStatus === 'unsaved' && (
                  <span className="text-amber-600 font-medium">Alterações pendentes</span>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Actions & Download Buttons */}
        <div className="flex items-center gap-2">
          {/* New Document Button */}
          <button
            id="new-doc-btn"
            onClick={() => handleCreateNew()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs md:text-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Novo</span>
          </button>

          {/* Templates Button */}
          <button
            id="templates-btn"
            onClick={() => setShowTemplatesModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium text-xs md:text-sm transition-colors"
            title="Modelos de anotações prontos"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden md:inline">Modelos</span>
          </button>

          {/* Save Button */}
          <button
            id="save-doc-btn"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#004ac6] hover:bg-[#003da6] text-white font-medium text-xs md:text-sm shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Salvar</span>
          </button>

          {/* Export / Download Dropdown */}
          <div className="relative">
            <button
              id="export-dropdown-btn"
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs md:text-sm shadow-xs transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Baixar</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {showExportMenu && (
              <div
                id="export-menu-popover"
                className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
              >
                <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Opções de Download
                </div>

                <button
                  id="download-word-btn"
                  onClick={handleDownloadWord}
                  className="w-full px-3 py-2.5 flex items-center gap-3 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors text-left"
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                    W
                  </div>
                  <div>
                    <p className="font-medium leading-none">Microsoft Word (.doc)</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Compatível com Word e Google Docs
                    </p>
                  </div>
                </button>

                <button
                  id="download-pdf-btn"
                  onClick={handlePrint}
                  className="w-full px-3 py-2.5 flex items-center gap-3 text-sm text-slate-700 hover:bg-rose-50 hover:text-rose-700 transition-colors text-left"
                >
                  <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
                    <Printer className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium leading-none">PDF / Imprimir Folha A4</p>
                    <p className="text-xs text-slate-400 mt-0.5">Layout de impressão com margens</p>
                  </div>
                </button>

                <button
                  id="download-md-btn"
                  onClick={handleDownloadMarkdown}
                  className="w-full px-3 py-2.5 flex items-center gap-3 text-sm text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition-colors text-left"
                >
                  <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium leading-none">Markdown (.md)</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Formatado para Obsidian / Notion
                    </p>
                  </div>
                </button>

                <button
                  id="download-txt-btn"
                  onClick={handleDownloadTxt}
                  className="w-full px-3 py-2.5 flex items-center gap-3 text-sm text-slate-700 hover:bg-slate-100 transition-colors text-left"
                >
                  <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                    <FileDown className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium leading-none">Texto Puro (.txt)</p>
                    <p className="text-xs text-slate-400 mt-0.5">Apenas texto sem formatação</p>
                  </div>
                </button>

                <div className="my-1.5 border-t border-slate-100" />

                <button
                  id="copy-text-btn"
                  onClick={handleCopyAll}
                  className="w-full px-3 py-2 flex items-center gap-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left"
                >
                  <Copy className="w-4 h-4 text-slate-500" />
                  <span>
                    {copiedNotification
                      ? 'Copiado para Área de Transferência!'
                      : 'Copiar Todo o Texto'}
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Fullscreen Toggle */}
          <button
            id="fullscreen-toggle-btn"
            onClick={() => setFullScreenMode(!fullScreenMode)}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors hidden sm:block"
            title={fullScreenMode ? 'Sair da tela cheia' : 'Modo foco tela cheia'}
          >
            {fullScreenMode ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Main Workspace Area (Sidebar + Editor) */}
      <div className="relative flex-1 flex gap-3 overflow-hidden">
        {/* Backdrop for the file drawer on mobile/tablet, where it overlays the editor
            instead of squeezing it (a fixed w-72 sidebar left barely any room for the
            editor on narrow screens) */}
        {sidebarOpen && (
          <div
            className="absolute inset-0 z-20 bg-black/30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Left Files/Notes Drawer */}
        {sidebarOpen && (
          <div
            id="notebook-file-explorer"
            className="absolute inset-y-0 left-0 z-30 w-72 max-w-[85vw] lg:static lg:z-auto lg:w-72 xl:w-80 lg:max-w-none bg-white border border-[#c3c6d7]/40 rounded-r-2xl lg:rounded-2xl flex flex-col shrink-0 overflow-hidden shadow-2xl lg:shadow-xs"
          >
            {/* Explorer Header & Search */}
            <div className="p-3 border-b border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-[#004ac6]" />
                  Meus Arquivos ({filteredDocuments.length})
                </span>
                <button
                  id="filter-favorites-toggle"
                  onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  className={`p-1.5 rounded-lg transition-colors ${showFavoritesOnly ? 'bg-amber-100 text-amber-700' : 'text-slate-400 hover:bg-slate-100'}`}
                  title="Apenas Favoritos"
                >
                  <Star className={`w-4 h-4 ${showFavoritesOnly ? 'fill-amber-500' : ''}`} />
                </button>
              </div>

              {/* Search input */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar notas..."
                  value={searchDocQuery}
                  onChange={(e) => setSearchDocQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#004ac6]"
                />
              </div>

              {/* Subject filter chips */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs no-scrollbar">
                <button
                  onClick={() => setSelectedSubjectFilter('all')}
                  className={`px-2 py-0.5 rounded-md shrink-0 font-medium ${selectedSubjectFilter === 'all' ? 'bg-[#004ac6] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  Todas
                </button>
                {subjects.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSubjectFilter(s.name)}
                    className={`px-2 py-0.5 rounded-md shrink-0 font-medium ${selectedSubjectFilter === s.name ? 'bg-[#004ac6] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Document list */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {filteredDocuments.length === 0 ? (
                <div className="text-center py-8 px-4 text-slate-400 text-xs">
                  Nenhuma anotação encontrada.
                  <br />
                  <button
                    onClick={() => handleCreateNew()}
                    className="mt-2 text-[#004ac6] font-semibold hover:underline"
                  >
                    + Criar nova anotação
                  </button>
                </div>
              ) : (
                filteredDocuments.map((doc) => {
                  const isActive = doc.id === activeDocId;
                  return (
                    <div
                      key={doc.id}
                      onClick={() => setActiveDocId(doc.id)}
                      className={`group relative p-2.5 rounded-xl cursor-pointer transition-all ${
                        isActive
                          ? 'bg-[#004ac6]/10 border border-[#004ac6]/30 text-[#004ac6]'
                          : 'hover:bg-slate-50 text-slate-700 border border-transparent'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-xs truncate leading-snug">
                            {doc.title || 'Sem título'}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-[10px] px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded font-medium">
                              {doc.subject}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {new Date(doc.updatedAt).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: '2-digit',
                              })}
                            </span>
                          </div>
                        </div>

                        {/* Document delete / actions */}
                        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm(`Deseja excluir a anotação "${doc.title}"?`)) {
                                onDeleteDocument(doc.id);
                                if (activeDocId === doc.id && documents.length > 1) {
                                  const next = documents.find((d) => d.id !== doc.id);
                                  if (next) setActiveDocId(next.id);
                                }
                              }
                            }}
                            className="p-1 rounded hover:bg-rose-100 hover:text-rose-600 text-slate-400"
                            title="Excluir anotação"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Quick Templates bar at bottom */}
            <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Modelos prontos</span>
              <button
                onClick={() => setShowTemplatesModal(true)}
                className="text-[#004ac6] font-semibold hover:underline flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" /> Ver galeria
              </button>
            </div>
          </div>
        )}

        {/* Right Editor Area */}
        <div className="flex-1 flex flex-col bg-white border border-[#c3c6d7]/40 rounded-2xl overflow-hidden shadow-xs">
          {/* Word-like Ribbon Formatting Toolbar */}
          <div className="bg-[#f8fafc] border-b border-slate-200 p-2 flex flex-wrap items-center gap-1 select-none">
            {/* Undo / Redo */}
            <div className="flex items-center border-r border-slate-200 pr-1.5 mr-1">
              <button
                onClick={() => executeCommand('undo')}
                className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors"
                title="Desfazer (Ctrl+Z)"
              >
                <Undo className="w-4 h-4" />
              </button>
              <button
                onClick={() => executeCommand('redo')}
                className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors"
                title="Refazer (Ctrl+Y)"
              >
                <Redo className="w-4 h-4" />
              </button>
            </div>

            {/* Heading Style Select */}
            <select
              onChange={(e) => executeCommand('formatBlock', e.target.value)}
              className="bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-700 px-2 py-1 focus:ring-1 focus:ring-[#004ac6] focus:outline-none cursor-pointer"
              title="Estilo do Texto"
            >
              <option value="p">Normal (Parágrafo)</option>
              <option value="h1">Título 1 (Grande)</option>
              <option value="h2">Título 2 (Médio)</option>
              <option value="h3">Título 3 (Subtítulo)</option>
              <option value="blockquote">Citação em Bloco</option>
              <option value="pre">Bloco de Código</option>
            </select>

            {/* Font Size */}
            <select
              onChange={(e) => executeCommand('fontSize', e.target.value)}
              className="bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-700 px-2 py-1 focus:ring-1 focus:ring-[#004ac6] focus:outline-none cursor-pointer"
              title="Tamanho da Fonte"
            >
              <option value="3">12 pt</option>
              <option value="4">14 pt</option>
              <option value="5">18 pt</option>
              <option value="6">24 pt</option>
              <option value="7">36 pt</option>
            </select>

            <div className="h-4 w-px bg-slate-200 mx-1" />

            {/* Inline styles */}
            <button
              onClick={() => executeCommand('bold')}
              className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-200 font-bold transition-colors"
              title="Negrito (Ctrl+B)"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              onClick={() => executeCommand('italic')}
              className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-200 italic transition-colors"
              title="Itálico (Ctrl+I)"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              onClick={() => executeCommand('underline')}
              className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-200 underline transition-colors"
              title="Sublinhado (Ctrl+U)"
            >
              <Underline className="w-4 h-4" />
            </button>
            <button
              onClick={() => executeCommand('strikeThrough')}
              className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-200 transition-colors"
              title="Tachado"
            >
              <Strikethrough className="w-4 h-4" />
            </button>

            <div className="h-4 w-px bg-slate-200 mx-1" />

            {/* Colors */}
            <div className="flex items-center gap-1">
              {/* Highlight colors */}
              <button
                onClick={() => executeCommand('hiliteColor', '#fef08a')}
                className="p-1.5 rounded-lg bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition-colors"
                title="Marca-texto Amarelo"
              >
                <Highlighter className="w-4 h-4" />
              </button>
              <button
                onClick={() => executeCommand('hiliteColor', '#bbf7d0')}
                className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors"
                title="Marca-texto Verde"
              >
                <Highlighter className="w-4 h-4" />
              </button>
              <button
                onClick={() => executeCommand('foreColor', '#004ac6')}
                className="p-1.5 rounded-lg text-blue-700 hover:bg-blue-100 font-bold transition-colors text-xs"
                title="Texto Azul"
              >
                A
              </button>
              <button
                onClick={() => executeCommand('foreColor', '#dc2626')}
                className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-100 font-bold transition-colors text-xs"
                title="Texto Vermelho"
              >
                A
              </button>
            </div>

            <div className="h-4 w-px bg-slate-200 mx-1" />

            {/* Alignment */}
            <button
              onClick={() => executeCommand('justifyLeft')}
              className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-200 transition-colors"
              title="Alinhar à Esquerda"
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => executeCommand('justifyCenter')}
              className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-200 transition-colors"
              title="Centralizar"
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button
              onClick={() => executeCommand('justifyRight')}
              className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-200 transition-colors"
              title="Alinhar à Direita"
            >
              <AlignRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => executeCommand('justifyFull')}
              className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-200 transition-colors"
              title="Justificar"
            >
              <AlignJustify className="w-4 h-4" />
            </button>

            <div className="h-4 w-px bg-slate-200 mx-1" />

            {/* Lists */}
            <button
              onClick={() => executeCommand('insertUnorderedList')}
              className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-200 transition-colors"
              title="Lista com Marcadores"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => executeCommand('insertOrderedList')}
              className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-200 transition-colors"
              title="Lista Numerada"
            >
              <ListOrdered className="w-4 h-4" />
            </button>

            <div className="h-4 w-px bg-slate-200 mx-1" />

            {/* Insert Elements */}
            <button
              onClick={handleInsertTable}
              className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-200 transition-colors flex items-center gap-1 text-xs"
              title="Inserir Tabela"
            >
              <TableIcon className="w-4 h-4" />
            </button>

            {/* Callouts Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowCalloutPicker(!showCalloutPicker)}
                className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-200 transition-colors flex items-center gap-1 text-xs"
                title="Inserir Bloco de Destaque / Caixa de Aviso"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
              </button>

              {showCalloutPicker && (
                <div className="absolute left-0 mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 z-40 text-xs">
                  <button
                    onClick={() => handleInsertCallout('tip')}
                    className="w-full text-left px-2.5 py-1.5 rounded hover:bg-blue-50 text-blue-800 font-medium"
                  >
                    💡 Dica de Estudo
                  </button>
                  <button
                    onClick={() => handleInsertCallout('warning')}
                    className="w-full text-left px-2.5 py-1.5 rounded hover:bg-amber-50 text-amber-800 font-medium"
                  >
                    ⚠️ Ponto de Atenção
                  </button>
                  <button
                    onClick={() => handleInsertCallout('formula')}
                    className="w-full text-left px-2.5 py-1.5 rounded hover:bg-purple-50 text-purple-800 font-medium"
                  >
                    📐 Caixa de Fórmula
                  </button>
                  <button
                    onClick={() => handleInsertCallout('summary')}
                    className="w-full text-left px-2.5 py-1.5 rounded hover:bg-emerald-50 text-emerald-800 font-medium"
                  >
                    📌 Síntese Rápida
                  </button>
                </div>
              )}
            </div>

            {/* Math Symbols Picker */}
            <div className="relative">
              <button
                onClick={() => setShowSymbolPicker(!showSymbolPicker)}
                className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-200 transition-colors text-xs font-bold"
                title="Símbolos Matemáticos e Gregos"
              >
                π/θ
              </button>

              {showSymbolPicker && (
                <div className="absolute left-0 mt-1 w-56 bg-white border border-slate-200 rounded-xl shadow-lg p-2 z-40 grid grid-cols-6 gap-1 text-sm font-semibold">
                  {[
                    'π',
                    'θ',
                    '√',
                    '∑',
                    '∆',
                    '∞',
                    'α',
                    'β',
                    'λ',
                    '±',
                    '≤',
                    '≥',
                    '≠',
                    '≈',
                    '²',
                    '³',
                    '½',
                    '→',
                  ].map((sym) => (
                    <button
                      key={sym}
                      onClick={() => handleInsertSymbol(sym)}
                      className="p-1.5 hover:bg-slate-100 rounded text-center"
                    >
                      {sym}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => executeCommand('insertHorizontalRule')}
              className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-200 transition-colors"
              title="Linha Divisória Horizontal"
            >
              <Minus className="w-4 h-4" />
            </button>

            {/* Paper Texture Selector */}
            <div className="ml-auto flex items-center gap-1.5">
              <span className="text-[11px] text-slate-400 font-medium hidden lg:inline">
                Papel:
              </span>
              <select
                id="paper-style-select"
                value={paperStyle}
                onChange={(e) => {
                  setPaperStyle(e.target.value as any);
                  setSaveStatus('unsaved');
                }}
                className="bg-white border border-slate-200 rounded-lg text-xs text-slate-600 px-2 py-1 focus:ring-1 focus:ring-[#004ac6] cursor-pointer"
              >
                <option value="blank">📄 Branco</option>
                <option value="lined">📓 Pautado</option>
                <option value="grid">📐 Quadriculado</option>
                <option value="sepia">📜 Sépia</option>
                <option value="dark">🌙 Noturno</option>
              </select>

              {/* Zoom selector */}
              <select
                value={zoomLevel}
                onChange={(e) => setZoomLevel(Number(e.target.value))}
                className="bg-white border border-slate-200 rounded-lg text-xs text-slate-600 px-2 py-1 focus:ring-1 focus:ring-[#004ac6] cursor-pointer hidden sm:block"
                title="Zoom da folha"
              >
                <option value={75}>75%</option>
                <option value={90}>90%</option>
                <option value={100}>100%</option>
                <option value={115}>115%</option>
                <option value={125}>125%</option>
              </select>
            </div>
          </div>

          {/* Paper Canvas Container (Scrollable Word Page) */}
          <div className="flex-1 bg-slate-100 overflow-y-auto p-4 md:p-8 flex justify-center items-start">
            {/* A4 Sheet Container */}
            <div
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
              className={`w-full max-w-[820px] min-h-[1050px] p-8 md:p-14 rounded-lg shadow-md border transition-all duration-200 relative ${getPaperStyles()}`}
            >
              {/* Document Header Line inside paper */}
              <div className="border-b border-slate-200/60 pb-3 mb-6 flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-slate-500">{subject}</span>
                <span>{new Date().toLocaleDateString('pt-BR')}</span>
              </div>

              {/* Real ContentEditable Editor */}
              <div
                ref={editorRef}
                id="word-document-editor"
                contentEditable
                onInput={handleEditorInput}
                onKeyDown={handleKeyDown}
                suppressContentEditableWarning
                className="outline-none min-h-[850px] prose prose-slate max-w-none text-base leading-relaxed selection:bg-blue-200"
                data-placeholder="Comece a escrever suas anotações, resumos ou redação aqui..."
              />
            </div>
          </div>

          {/* Bottom Word Status Bar */}
          <div className="bg-white border-t border-slate-200 px-4 py-2 flex flex-wrap items-center justify-between text-xs text-slate-500 select-none">
            {/* Left stats */}
            <div className="flex items-center gap-4">
              <span>
                <strong>{stats.words}</strong> palavras
              </span>
              <span>
                <strong>{stats.chars}</strong> caracteres
              </span>
              <span>
                ~<strong>{stats.readingTime}</strong> min de leitura
              </span>
            </div>

            {/* Right tags & shortcuts */}
            <div className="flex items-center gap-3">
              <span className="hidden md:inline text-slate-400">
                Dica: Pressione <strong>Ctrl+S</strong> para salvar a qualquer momento
              </span>
              <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium">
                Formato A4
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Templates Modal */}
      {showTemplatesModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-xl text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#004ac6]" /> Galeria de Modelos Prontos
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Escolha um modelo estruturado para começar seu novo caderno rapidamente.
                </p>
              </div>
              <button
                onClick={() => setShowTemplatesModal(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 overflow-y-auto">
              {/* Template 1: Cornell Notes */}
              <div
                onClick={() =>
                  handleCreateNew({
                    title: 'Método Cornell: Anotações de Estudo',
                    subject: 'Geral',
                    content: `<h1>Método Cornell: Tópico de Estudo</h1>
<p><strong>Instrutor(a) / Fonte:</strong> &nbsp;&nbsp;|&nbsp;&nbsp; <strong>Data:</strong> ${new Date().toLocaleDateString('pt-BR')}</p>
<hr />
<table style="width: 100%; border-collapse: collapse; margin: 16px 0; border: 1px solid #cbd5e1;">
  <thead>
    <tr style="background-color: #f1f5f9;">
      <th style="width: 35%; padding: 10px; border: 1px solid #cbd5e1; text-align: left;">Palavras-Chave / Dúvidas</th>
      <th style="width: 65%; padding: 10px; border: 1px solid #cbd5e1; text-align: left;">Anotações Principais</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 10px; border: 1px solid #cbd5e1; vertical-align: top;">
        <ul>
          <li>Conceito 1</li>
          <li>Pergunta central?</li>
          <li>Fórmula ou regra chave</li>
        </ul>
      </td>
      <td style="padding: 10px; border: 1px solid #cbd5e1; vertical-align: top;">
        <p>Escreva aqui as explicações detalhadas, conceitos teóricos, exemplos práticos e raciocínios da aula ou leitura.</p>
      </td>
    </tr>
  </tbody>
</table>
<div style="background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 12px 16px; border-radius: 8px; margin: 16px 0;">
  <strong>📌 Síntese / Conclusão Geral (2 a 3 linhas):</strong><br />
  Resuma o que você aprendeu com suas próprias palavras para fixar o conteúdo na memória de longo prazo.
</div>`,
                  })
                }
                className="p-4 rounded-2xl border border-slate-200 hover:border-[#004ac6] hover:shadow-md transition-all cursor-pointer bg-slate-50/50 group"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    📝
                  </div>
                  <h4 className="font-bold text-slate-800 group-hover:text-[#004ac6] transition-colors">
                    Método Cornell
                  </h4>
                </div>
                <p className="text-xs text-slate-500">
                  Ideal para sínteses e aulas com divisão entre palavras-chave, anotações detalhadas
                  e síntese final.
                </p>
              </div>

              {/* Template 2: Redação / Texto Argumentativo */}
              <div
                onClick={() =>
                  handleCreateNew({
                    title: 'Redação Dissertativa / Peça Argumentativa',
                    subject: 'Comunicação',
                    content: `<h1>Estrutura Dissertativa-Argumentativa</h1>
<p><strong>Tema / Deliberação:</strong> [Insira o tema, edital ou proposta aqui]</p>
<hr />
<h2>1. Introdução & Contextualização</h2>
<p>[Contextualização inicial com fundamentação conceitual ou histórica + tese central a ser defendida com dois eixos de argumentação]</p>

<h2>2. Desenvolvimento 1 (Eixo Argumentativo 1)</h2>
<p>[Tópico frasal + Fundamentação com dados, doutrina ou referencial teórico + Análise crítica e relevância]</p>

<h2>3. Desenvolvimento 2 (Eixo Argumentativo 2)</h2>
<p>[Tópico frasal do 2º argumento + Repertório legítimo + Conexão lógica com o problema ou tese]</p>

<h2>4. Conclusão & Proposta / Encaminhamento</h2>
<p>[Síntese dos argumentos + Proposta de solução / intervenção com agentes, meios e impactos práticos]</p>`,
                  })
                }
                className="p-4 rounded-2xl border border-slate-200 hover:border-[#004ac6] hover:shadow-md transition-all cursor-pointer bg-slate-50/50 group"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    ✍️
                  </div>
                  <h4 className="font-bold text-slate-800 group-hover:text-[#004ac6] transition-colors">
                    Redação & Texto Dissertativo
                  </h4>
                </div>
                <p className="text-xs text-slate-500">
                  Estrutura analítica em 4 partes com introdução, 2 eixos argumentativos e
                  encaminhamento de conclusão.
                </p>
              </div>

              {/* Template 3: Ficha de Fórmulas / Cheat Sheet */}
              <div
                onClick={() =>
                  handleCreateNew({
                    title: 'Ficha de Fórmulas e Raciocínios Rápidos',
                    subject: 'Matemática',
                    content: `<h1>Ficha de Fórmulas e Resumo para Prova</h1>
<p><strong>Disciplina:</strong> Matemática / Física &nbsp;|&nbsp; <strong>Revisão Rápida</strong></p>
<hr />

<div style="background-color: #f3e8ff; border-left: 4px solid #9333ea; padding: 12px 16px; border-radius: 8px; margin: 16px 0; font-family: monospace;">
  <strong>📐 Fórmula 1:</strong> S = S₀ + v·t &nbsp;&nbsp;(Movimento Uniforme)<br />
  <strong>📐 Fórmula 2:</strong> v = v₀ + a·t &nbsp;&nbsp;(Velocidade no MUV)<br />
  <strong>📐 Fórmula 3:</strong> v² = v₀² + 2a·ΔS &nbsp;&nbsp;(Equação de Torricelli)
</div>

<table style="width: 100%; border-collapse: collapse; margin: 16px 0; border: 1px solid #cbd5e1;">
  <thead>
    <tr style="background-color: #f8fafc;">
      <th style="padding: 8px; border: 1px solid #cbd5e1;">Grandeza</th>
      <th style="padding: 8px; border: 1px solid #cbd5e1;">Símbolo</th>
      <th style="padding: 8px; border: 1px solid #cbd5e1;">Unidade (SI)</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="padding: 6px; border: 1px solid #cbd5e1;">Espaço / Posição</td><td style="padding: 6px; border: 1px solid #cbd5e1;">S</td><td style="padding: 6px; border: 1px solid #cbd5e1;">Metros (m)</td></tr>
    <tr><td style="padding: 6px; border: 1px solid #cbd5e1;">Tempo</td><td style="padding: 6px; border: 1px solid #cbd5e1;">t</td><td style="padding: 6px; border: 1px solid #cbd5e1;">Segundos (s)</td></tr>
    <tr><td style="padding: 6px; border: 1px solid #cbd5e1;">Aceleração</td><td style="padding: 6px; border: 1px solid #cbd5e1;">a</td><td style="padding: 6px; border: 1px solid #cbd5e1;">m/s²</td></tr>
  </tbody>
</table>`,
                  })
                }
                className="p-4 rounded-2xl border border-slate-200 hover:border-[#004ac6] hover:shadow-md transition-all cursor-pointer bg-slate-50/50 group"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                    📐
                  </div>
                  <h4 className="font-bold text-slate-800 group-hover:text-[#004ac6] transition-colors">
                    Fórmulas & Cheat Sheet
                  </h4>
                </div>
                <p className="text-xs text-slate-500">
                  Tabelas de conversão, unidades de medida e blocos de equações para fixação antes
                  de exames.
                </p>
              </div>

              {/* Template 4: Em Branco */}
              <div
                onClick={() =>
                  handleCreateNew({
                    title: 'Documento em Branco',
                    subject: 'Geral',
                    content:
                      '<h1>Documento em Branco</h1><p>Comece a redigir suas ideias livremente...</p>',
                  })
                }
                className="p-4 rounded-2xl border border-slate-200 hover:border-[#004ac6] hover:shadow-md transition-all cursor-pointer bg-slate-50/50 group"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                    📄
                  </div>
                  <h4 className="font-bold text-slate-800 group-hover:text-[#004ac6] transition-colors">
                    Página em Branco
                  </h4>
                </div>
                <p className="text-xs text-slate-500">
                  Folha limpa sem formatações pré-definidas para anotações livres do dia a dia.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
