import React, { useState } from 'react';
import {
  FileText,
  Video,
  Map,
  BookOpen,
  Download,
  ExternalLink,
  Search,
  Filter,
  Sparkles,
  Layers,
  X,
} from 'lucide-react';
import { LibraryItem } from '../types';

interface LibraryViewProps {
  items: LibraryItem[];
}

export const LibraryView: React.FC<LibraryViewProps> = ({ items }) => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [previewItem, setPreviewItem] = useState<LibraryItem | null>(null);

  const filteredItems = items.filter((item) => {
    if (selectedType !== 'all' && item.type !== selectedType) return false;
    if (
      searchFilter &&
      !item.title.toLowerCase().includes(searchFilter.toLowerCase()) &&
      !item.subject.toLowerCase().includes(searchFilter.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-6 h-6 text-red-600" />;
      case 'video':
        return <Video className="w-6 h-6 text-blue-600" />;
      case 'summary':
        return <Map className="w-6 h-6 text-emerald-600" />;
      case 'notes':
        return <BookOpen className="w-6 h-6 text-amber-600" />;
      default:
        return <FileText className="w-6 h-6 text-slate-600" />;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-8 md:py-12 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#191c1e] tracking-tight">
            Biblioteca de Estudos
          </h1>
          <p className="text-base md:text-lg text-[#434655] mt-1">
            Resumos em PDF, mapas mentais, videoaulas e anotações organizados por matéria.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center bg-[#e6e8ea] rounded-full p-1 self-start sm:self-auto overflow-x-auto max-w-full">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'pdf', label: 'PDFs' },
            { id: 'summary', label: 'Mapas Mentais' },
            { id: 'notes', label: 'Anotações' },
            { id: 'video', label: 'Vídeos' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedType(tab.id)}
              className={`px-4 py-2 rounded-full font-medium text-xs sm:text-sm whitespace-nowrap transition-all ${
                selectedType === tab.id
                  ? 'bg-[#004ac6] text-white shadow-xs'
                  : 'text-[#434655] hover:text-[#191c1e]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Library Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setPreviewItem(item)}
            className="bg-white rounded-3xl p-6 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-[#c3c6d7]/30 flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-[#eceef0] flex items-center justify-center group-hover:scale-105 transition-transform">
                  {getItemIcon(item.type)}
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#f2f4f6] text-[#505f76]">
                  {item.typeLabel}
                </span>
              </div>

              <span className="text-xs font-bold text-[#004ac6] uppercase tracking-wider block mb-1">
                {item.subject}
              </span>

              <h3 className="text-lg font-bold text-[#191c1e] group-hover:text-[#004ac6] transition-colors leading-snug">
                {item.title}
              </h3>

              <p className="text-xs text-[#434655] mt-2 line-clamp-2 leading-relaxed">
                {item.contentPreview}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#eceef0] flex items-center justify-between text-xs text-[#737686]">
              <span className="font-medium">
                {item.pagesOrDurationText} • {item.sizeOrDuration}
              </span>
              <span className="font-semibold text-[#004ac6] group-hover:underline flex items-center gap-1">
                Visualizar <ExternalLink className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Material Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#c3c6d7]/30 relative flex flex-col gap-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#f2f4f6] flex items-center justify-center">
                  {getItemIcon(previewItem.type)}
                </div>
                <div>
                  <span className="text-xs font-bold text-[#004ac6] uppercase tracking-wider block">
                    {previewItem.subject}
                  </span>
                  <h3 className="text-xl font-bold text-[#191c1e]">{previewItem.title}</h3>
                </div>
              </div>

              <button
                onClick={() => setPreviewItem(null)}
                className="p-1 rounded-lg text-[#737686] hover:text-[#191c1e] hover:bg-[#eceef0]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-[#f7f9fb] rounded-2xl border border-[#eceef0] flex flex-col gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#737686]">
                Prévia do Conteúdo
              </span>
              <p className="text-sm text-[#191c1e] leading-relaxed">{previewItem.contentPreview}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {previewItem.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-[#dbe1ff]/50 text-[#004ac6] rounded-full text-xs font-semibold"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#eceef0]">
              <button
                onClick={() => setPreviewItem(null)}
                className="px-5 py-2.5 rounded-xl font-medium text-sm text-[#434655] hover:bg-[#eceef0]"
              >
                Fechar
              </button>
              <button
                onClick={() => {
                  alert(
                    `Iniciando download de "${previewItem.title}" (${previewItem.sizeOrDuration})...`,
                  );
                  setPreviewItem(null);
                }}
                className="px-6 py-2.5 bg-[#004ac6] hover:bg-[#2563eb] text-white font-bold text-sm rounded-xl transition-all shadow-xs flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Baixar Material</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
