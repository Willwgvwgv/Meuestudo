import * as Sentry from '@sentry/react';
import React from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, errorInfo: React.ErrorInfo) {
    Sentry.captureException(error, { extra: { componentStack: errorInfo.componentStack } });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#f7f9fb] flex flex-col items-center justify-center p-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center mb-4">
            <AlertTriangle className="w-7 h-7 text-rose-600" />
          </div>
          <h1 className="text-lg font-bold text-slate-800 mb-1">Algo deu errado</h1>
          <p className="text-sm text-slate-500 mb-5 max-w-sm">
            Encontramos um erro inesperado. Tente recarregar a página; se o problema persistir,
            nossa equipe já foi notificada automaticamente.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#004ac6] hover:bg-[#003da6] text-white font-medium text-sm shadow-xs transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Recarregar página</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
