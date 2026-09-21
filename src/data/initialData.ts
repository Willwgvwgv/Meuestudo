import { StudentProfile, Subject, Task, CalendarEvent, Question, LibraryItem, NotificationItem, NoteDocument } from '../types';

export const INITIAL_STUDENT_PROFILE: StudentProfile = {
  name: 'Lucas',
  studyContext: 'Ensino Médio & Pré-Vestibular',
  grade: 'Ensino Médio & Pré-Vestibular',
  generalAverage: 82,
  questionsSolved: 1240,
  streakDays: 3,
  dailyGoalMinutes: 90,
  weeklyFocusHistory: [
    { day: 'S', fullDay: 'Segunda', heightPercent: 40, active: true, isToday: false },
    { day: 'T', fullDay: 'Terça', heightPercent: 70, active: true, isToday: false },
    { day: 'Q', fullDay: 'Quarta', heightPercent: 90, active: true, isToday: false },
    { day: 'H', fullDay: 'Hoje (Qui)', heightPercent: 35, active: true, isToday: true },
    { day: 'S', fullDay: 'Sexta', heightPercent: 0, active: false, isToday: false },
  ],
};

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'matematica',
    name: 'Matemática',
    icon: 'calculate',
    contentsCount: 12,
    questionsCount: 345,
    masteryPercentage: 78,
    masteryTrend: -2,
    color: '#004ac6',
    bgColor: '#2563eb',
    accentColor: '#dbe1ff',
    alertCount: 3,
    alertMessage: '3 conteúdos em alerta',
    description: 'Álgebra, geometria plana, operações com frações e raciocínio lógico.',
    topics: [
      { id: 'mat-1', name: 'Frações e Operações', masteryPercentage: 54, questionsDone: 68, status: 'danger' },
      { id: 'mat-2', name: 'Razão e Proporção', masteryPercentage: 63, questionsDone: 52, status: 'alert' },
      { id: 'mat-3', name: 'Equações do 1º Grau', masteryPercentage: 68, questionsDone: 85, status: 'alert' },
      { id: 'mat-4', name: 'Porcentagem Básica', masteryPercentage: 86, questionsDone: 44, status: 'good' },
      { id: 'mat-5', name: 'Geometria: Ângulos e Triângulos', masteryPercentage: 92, questionsDone: 50, status: 'good' },
      { id: 'mat-6', name: 'Múltiplos e Divisores (MMC/MDC)', masteryPercentage: 94, questionsDone: 46, status: 'good' },
    ],
  },
  {
    id: 'portugues',
    name: 'Português',
    icon: 'menu_book',
    contentsCount: 15,
    questionsCount: 410,
    masteryPercentage: 88,
    masteryTrend: 4,
    color: '#505f76',
    bgColor: '#505f76',
    accentColor: '#d0e1fb',
    description: 'Gramática normativa, análise sintática, interpretação de texto e redação.',
    topics: [
      { id: 'port-1', name: 'Interpretação e Compreensão de Texto', masteryPercentage: 95, questionsDone: 120, status: 'good' },
      { id: 'port-2', name: 'Classes de Palavras (Substantivo/Adjetivo)', masteryPercentage: 90, questionsDone: 95, status: 'good' },
      { id: 'port-3', name: 'Concordância Verbal e Nominal', masteryPercentage: 82, questionsDone: 80, status: 'good' },
      { id: 'port-4', name: 'Pontuação e Uso da Vírgula', masteryPercentage: 79, questionsDone: 65, status: 'alert' },
      { id: 'port-5', name: 'Figuras de Linguagem', masteryPercentage: 91, questionsDone: 50, status: 'good' },
    ],
  },
  {
    id: 'ciencias',
    name: 'Ciências',
    icon: 'science',
    contentsCount: 10,
    questionsCount: 215,
    masteryPercentage: 92,
    masteryTrend: 8,
    color: '#943700',
    bgColor: '#bc4800',
    accentColor: '#ffdbcd',
    description: 'Ecossistemas, biologia celular, corpo humano e matéria e energia.',
    topics: [
      { id: 'cie-1', name: 'Células e Organelas Celulares', masteryPercentage: 96, questionsDone: 60, status: 'good' },
      { id: 'cie-2', name: 'Ecossistemas e Cadeias Alimentares', masteryPercentage: 94, questionsDone: 55, status: 'good' },
      { id: 'cie-3', name: 'Sistema Respiratório e Circulatório', masteryPercentage: 89, questionsDone: 45, status: 'good' },
      { id: 'cie-4', name: 'Matéria, Estados Físicos e Misturas', masteryPercentage: 90, questionsDone: 55, status: 'good' },
    ],
  },
  {
    id: 'historia',
    name: 'História',
    icon: 'account_balance',
    contentsCount: 8,
    questionsCount: 150,
    masteryPercentage: 85,
    masteryTrend: 1,
    color: '#434655',
    bgColor: '#434655',
    accentColor: '#e0e3e5',
    description: 'Idade Média, Renascimento, Grandes Navegações e Revolução Industrial.',
    topics: [
      { id: 'hist-1', name: 'Renascimento Cultural e Científico', masteryPercentage: 92, questionsDone: 40, status: 'good' },
      { id: 'hist-2', name: 'Feudalismo e Sociedade Medieval', masteryPercentage: 88, questionsDone: 45, status: 'good' },
      { id: 'hist-3', name: 'Revolução Industrial: Início e Impactos', masteryPercentage: 78, questionsDone: 35, status: 'alert' },
      { id: 'hist-4', name: 'Grandes Navegações e Mercantilismo', masteryPercentage: 84, questionsDone: 30, status: 'good' },
    ],
  },
  {
    id: 'geografia',
    name: 'Geografia',
    icon: 'public',
    contentsCount: 9,
    questionsCount: 180,
    masteryPercentage: 75,
    masteryTrend: 0,
    color: '#505f76',
    bgColor: '#505f76',
    accentColor: '#d0e1fb',
    description: 'Biomas brasileiros, relevo, hidrografia, clima e urbanização no Brasil.',
    topics: [
      { id: 'geo-1', name: 'Biomas Brasileiros (Cerrado, Amazônia)', masteryPercentage: 72, questionsDone: 50, status: 'alert' },
      { id: 'geo-2', name: 'Dinâmica Populacional e Urbanização', masteryPercentage: 76, questionsDone: 45, status: 'alert' },
      { id: 'geo-3', name: 'Relevo, Solos e Hidrografia', masteryPercentage: 80, questionsDone: 45, status: 'good' },
      { id: 'geo-4', name: 'Climas do Brasil e Massas de Ar', masteryPercentage: 74, questionsDone: 40, status: 'alert' },
    ],
  },
  {
    id: 'ingles',
    name: 'Inglês',
    icon: 'language',
    contentsCount: 6,
    questionsCount: 110,
    masteryPercentage: 95,
    masteryTrend: 12,
    color: '#004ac6',
    bgColor: '#2563eb',
    accentColor: '#dbe1ff',
    description: 'Simple Present, Past Continuous, vocabulário temático e compreensão auditiva.',
    topics: [
      { id: 'ing-1', name: 'Reading Comprehension & Vocabulary', masteryPercentage: 98, questionsDone: 40, status: 'good' },
      { id: 'ing-2', name: 'Simple Present & Daily Routines', masteryPercentage: 96, questionsDone: 35, status: 'good' },
      { id: 'ing-3', name: 'Past Simple (Regular & Irregular)', masteryPercentage: 92, questionsDone: 35, status: 'good' },
    ],
  },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Finalizar trabalho de História',
    subject: 'História',
    details: 'Entrega: Hoje',
    durationMinutes: 45,
    dueDate: 'Hoje',
    priority: 'urgente',
    completed: false,
  },
  {
    id: 'task-2',
    title: 'Fazer 20 questões de Matemática (Frações)',
    subject: 'Matemática',
    details: '30 min',
    durationMinutes: 30,
    dueDate: 'Hoje',
    priority: 'alta',
    completed: false,
  },
  {
    id: 'task-3',
    title: 'Revisão de Biomas Brasileiros',
    subject: 'Geografia',
    details: 'Mapa mental',
    durationMinutes: 20,
    dueDate: 'Hoje',
    priority: 'normal',
    completed: false,
  },
  {
    id: 'task-4',
    title: 'Ler capítulo 4 de Ciências',
    subject: 'Ciências',
    details: 'Páginas 35 a 48',
    durationMinutes: 25,
    dueDate: 'Amanhã',
    priority: 'normal',
    completed: false,
  },
  {
    id: 'task-5',
    title: 'Leitura: Cap. 4 - Revolução Industrial',
    subject: 'História',
    details: 'Páginas 42 a 55',
    durationMinutes: 30,
    dueDate: 'Esta Semana',
    priority: 'normal',
    completed: false,
  },
  {
    id: 'task-6',
    title: 'Revisar Português',
    subject: 'Português',
    details: 'Concordância verbal',
    durationMinutes: 25,
    dueDate: 'Hoje',
    priority: 'normal',
    completed: true,
    completedAt: 'Hoje às 08:30',
  },
];

export const INITIAL_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'event-1',
    title: 'História (Estudo)',
    date: '2026-09-03',
    dayNumber: 3,
    type: 'study',
    typeLabel: 'Estudo Agendado',
    subject: 'História',
    timeStr: '15:00 - 16:30',
    topics: ['Feudalismo e Cidades Medievais', 'Peste Negra'],
    confidence: 85,
    colorClass: 'text-amber-800',
    bgBadgeClass: 'bg-amber-100 text-amber-900 border-amber-200',
  },
  {
    id: 'event-2',
    title: 'Geografia (Entrega)',
    date: '2026-09-08',
    dayNumber: 8,
    type: 'delivery',
    typeLabel: 'Entrega de Trabalho',
    subject: 'Geografia',
    timeStr: 'Até as 23:59',
    topics: ['Biomas do Brasil', 'Cartografia Temática'],
    confidence: 78,
    colorClass: 'text-slate-800',
    bgBadgeClass: 'bg-slate-100 text-slate-800 border-slate-200',
  },
  {
    id: 'event-3',
    title: 'Prova de Matemática',
    date: '2026-09-10',
    dayNumber: 10,
    type: 'exam',
    typeLabel: 'Avaliação Trimestral',
    subject: 'Matemática',
    timeStr: '08:00 - 09:40',
    topics: ['Frações', 'Porcentagem', 'Razão e Proporção'],
    confidence: 75,
    colorClass: 'text-blue-900',
    bgBadgeClass: 'bg-blue-600 text-white border-blue-700',
  },
  {
    id: 'event-4',
    title: 'Simulado Geral',
    date: '2026-09-15',
    dayNumber: 15,
    type: 'simulation',
    typeLabel: 'Simulado Geral',
    subject: 'Geral',
    timeStr: '14:00 - 18:00',
    topics: ['Todas as matérias do 3º Bimestre'],
    confidence: 80,
    colorClass: 'text-red-800',
    bgBadgeClass: 'bg-red-100 text-red-800 border-red-200',
  },
  {
    id: 'event-5',
    title: 'Ciências (Experimento)',
    date: '2026-09-22',
    dayNumber: 22,
    type: 'study',
    typeLabel: 'Laboratório',
    subject: 'Ciências',
    timeStr: '10:00 - 11:30',
    topics: ['Observação microscópica de tecidos vegetais'],
    confidence: 92,
    colorClass: 'text-orange-800',
    bgBadgeClass: 'bg-orange-100 text-orange-900 border-orange-200',
  },
];

export const INITIAL_QUESTIONS: Question[] = [
  {
    id: 'q-1',
    subject: 'Matemática',
    topic: 'Frações e Operações',
    questionText: 'Ao resolver a operação (3/4 + 2/5) × 10, qual é o resultado obtido?',
    options: ['11,5', '23/2 (11,5)', '23', '10/9'],
    correctAnswerIndex: 1,
    explanation: 'Primeiro somamos as frações encontrando o MMC(4, 5) = 20. Assim: 15/20 + 8/20 = 23/20. Em seguida, multiplicamos por 10: (23/20) × 10 = 23/2 = 11,5.',
    difficulty: 'Médio',
  },
  {
    id: 'q-2',
    subject: 'Matemática',
    topic: 'Razão e Proporção',
    questionText: 'Em uma receita de bolo, a proporção de farinha para açúcar é de 3 para 2. Se foram usados 600g de farinha, quanto açúcar deve ser adicionado?',
    options: ['300g', '400g', '450g', '500g'],
    correctAnswerIndex: 1,
    explanation: 'A proporção é 3/2 = 600/x. Multiplicando em cruz: 3x = 1200 → x = 400g de açúcar.',
    difficulty: 'Fácil',
  },
  {
    id: 'q-3',
    subject: 'Matemática',
    topic: 'Equações do 1º Grau',
    questionText: 'Qual é o valor de x na equação 4x - 8 = 2x + 14?',
    options: ['x = 6', 'x = 11', 'x = 14', 'x = 22'],
    correctAnswerIndex: 1,
    explanation: 'Isolamos os termos com x: 4x - 2x = 14 + 8 → 2x = 22 → x = 11.',
    difficulty: 'Fácil',
  },
  {
    id: 'q-4',
    subject: 'Português',
    topic: 'Concordância Verbal',
    questionText: 'Assinale a alternativa em que a concordância verbal está rigorosamente correta segundo a norma-padrão:',
    options: [
      'Fazem três anos que estudo nesta escola.',
      'Haviam muitos alunos na biblioteca ontem.',
      'Fazia três anos que estudo nesta escola.',
      'Existe muitas razões para nos dedicarmos.',
    ],
    correctAnswerIndex: 2,
    explanation: 'O verbo "fazer" indicando tempo decorrido e o verbo "haver" no sentido de existir são impessoais e devem permanecer na 3ª pessoa do singular ("Fazia três anos", "Havia muitos alunos").',
    difficulty: 'Médio',
  },
  {
    id: 'q-5',
    subject: 'Ciências',
    topic: 'Células e Organelas',
    questionText: 'Qual organela celular é responsável pela produção de energia (ATP) por meio da respiração celular nas células eucariontes?',
    options: ['Ribossomo', 'Complexo Golgiense', 'Mitocôndria', 'Lisossomo'],
    correctAnswerIndex: 2,
    explanation: 'A mitocôndria é a organela responsável pela respiração celular e síntese de ATP.',
    difficulty: 'Fácil',
  },
  {
    id: 'q-6',
    subject: 'História',
    topic: 'Revolução Industrial',
    questionText: 'Qual foi o país pioneiro da Primeira Revolução Industrial no século XVIII e qual fonte de energia foi crucial?',
    options: [
      'França - Energia Solar e Eólica',
      'Inglaterra - Carvão mineral e Máquina a Vapor',
      'Estados Unidos - Eletricidade e Petróleo',
      'Alemanha - Energia Nuclear',
    ],
    correctAnswerIndex: 1,
    explanation: 'A Inglaterra foi a pioneira devido a reservas abundantes de carvão e ferro, capitais acumulados e o desenvolvimento da máquina a vapor de James Watt.',
    difficulty: 'Fácil',
  },
  {
    id: 'q-7',
    subject: 'Geografia',
    topic: 'Biomas Brasileiros',
    questionText: 'Qual bioma brasileiro é considerado a "caixa d\'água do Brasil" por abrigar nascentes de importantes bacias hidrográficas (São Francisco, Araguaia/Tocantins e Paraná)?',
    options: ['Caatinga', 'Cerrado', 'Pampa', 'Pantanal'],
    correctAnswerIndex: 1,
    explanation: 'O Cerrado é conhecido como o berço das águas do Brasil porque alimenta 8 das 12 principais regiões hidrográficas do país.',
    difficulty: 'Médio',
  },
  {
    id: 'q-8',
    subject: 'Inglês',
    topic: 'Simple Present & Past',
    questionText: 'Complete correctly: "Yesterday, Lucas ______ to the library and ______ three chapters of his book."',
    options: [
      'goes / read',
      'went / read',
      'gone / reads',
      'went / reading',
    ],
    correctAnswerIndex: 1,
    explanation: '"Yesterday" indica passado simples. O passado de go é went, e o passado de read é read (pronunciado /rɛd/).',
    difficulty: 'Fácil',
  },
];

export const INITIAL_LIBRARY: LibraryItem[] = [
  {
    id: 'lib-1',
    title: 'Guia Completo: Operações com Frações e MMC',
    subject: 'Matemática',
    type: 'pdf',
    typeLabel: 'Resumo PDF',
    sizeOrDuration: '2.4 MB',
    pagesOrDurationText: '8 páginas',
    updatedAt: 'Atualizado há 2 dias',
    tags: ['Frações', 'Álgebra', 'Exemplos Práticos'],
    contentPreview: 'Passo a passo com 15 exemplos resolvidos de soma, subtração, multiplicação e divisão de frações com denominadores diferentes.',
  },
  {
    id: 'lib-2',
    title: 'Mapa Mental: Biomas Brasileiros e Climas',
    subject: 'Geografia',
    type: 'summary',
    typeLabel: 'Mapa Mental',
    sizeOrDuration: '1.8 MB',
    pagesOrDurationText: 'Visual Interativo',
    updatedAt: 'Atualizado há 4 dias',
    tags: ['Cerrado', 'Amazônia', 'Mata Atlântica', 'Mapas'],
    contentPreview: 'Diagrama esquemático relacionando tipos de vegetação, precipitação média e solos predominantes.',
  },
  {
    id: 'lib-3',
    title: 'Ficha de Revisão: Revolução Industrial (Fases I e II)',
    subject: 'História',
    type: 'notes',
    typeLabel: 'Anotações',
    sizeOrDuration: '1.1 MB',
    pagesOrDurationText: '5 páginas',
    updatedAt: 'Atualizado há 1 semana',
    tags: ['Inglaterra', 'Máquina a Vapor', 'Sociedade'],
    contentPreview: 'Principais transformações sociais, êxodo rural, condições de trabalho e surgimento dos movimentos operários.',
  },
  {
    id: 'lib-4',
    title: 'Videoaula: Células Eucariontes e Organelas',
    subject: 'Ciências',
    type: 'video',
    typeLabel: 'Vídeo Explicativo',
    sizeOrDuration: '18 min',
    pagesOrDurationText: '1080p HD',
    updatedAt: 'Atualizado há 2 semanas',
    tags: ['Biologia', 'Citologia', 'Mitocôndria'],
    contentPreview: 'Animação 3D interativa explicando a função de cada organela celular e transporte de membrana.',
  },
  {
    id: 'lib-5',
    title: 'Tabela de Concordância Verbal e Regência',
    subject: 'Português',
    type: 'pdf',
    typeLabel: 'Resumo PDF',
    sizeOrDuration: '3.0 MB',
    pagesOrDurationText: '12 páginas',
    updatedAt: 'Atualizado hoje',
    tags: ['Gramática', 'Verbos', 'Norma Culta'],
    contentPreview: 'Casos especiais do sujeito composto, verbos impessoais e pronomes de tratamento com exercícios.',
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Prova de Matemática próxima',
    message: 'A prova será em 7 dias (10/09). Recomendamos revisar Frações e Porcentagem.',
    time: 'Há 15 min',
    type: 'alert',
    read: false,
    actionTab: 'calendario',
  },
  {
    id: 'notif-2',
    title: 'Trabalho de História vence hoje',
    message: 'Lembre-se de enviar ou entregar o trabalho até as 18:00.',
    time: 'Há 1 hora',
    type: 'alert',
    read: false,
    actionTab: 'tarefas',
  },
  {
    id: 'notif-3',
    title: 'Parabéns pela sequência!',
    message: 'Você completou 3 dias consecutivos de foco!',
    time: 'Hoje cedo',
    type: 'success',
    read: true,
    actionTab: 'evolucao',
  },
];

export const INITIAL_DOCUMENTS: NoteDocument[] = [
  {
    id: 'doc-1',
    title: 'Resumo Completo: Frações e Operações Fundamentais',
    subject: 'Matemática',
    tags: ['Frações', 'Álgebra', 'Revisão Prova'],
    createdAt: '2026-09-01T10:00:00Z',
    updatedAt: '2026-09-01T14:30:00Z',
    isFavorite: true,
    paperStyle: 'lined',
    content: `<h1>Resumo Completo: Frações e Operações Fundamentais</h1>
<p>Este caderno reúne os conceitos-chave sobre frações ordinárias, simplificação e operações matemáticas para a preparação da prova bimestral.</p>

<hr />

<h2>1. O que é uma Fração?</h2>
<p>Uma fração representa uma ou mais partes iguais de um todo que foi dividido. A forma geral é dada por <strong>a/b</strong>, onde:</p>
<ul>
  <li><strong>Numerador (a):</strong> indica quantas partes foram tomadas.</li>
  <li><strong>Denominador (b):</strong> indica em quantas partes iguais o todo foi dividido (com <em>b ≠ 0</em>).</li>
</ul>

<div style="background-color: #e0f2fe; border-left: 4px solid #0284c7; padding: 12px 16px; border-radius: 8px; margin: 16px 0;">
  <strong>💡 Dica de Ouro:</strong> Nunca esqueça de simplificar a fração até torná-la <em>irredutível</em> dividindo numerador e denominador pelo MDC.
</div>

<h2>2. Operações com Frações</h2>

<table style="width: 100%; border-collapse: collapse; margin: 16px 0; border: 1px solid #cbd5e1;">
  <thead>
    <tr style="background-color: #f1f5f9;">
      <th style="padding: 10px; border: 1px solid #cbd5e1; text-align: left;">Operação</th>
      <th style="padding: 10px; border: 1px solid #cbd5e1; text-align: left;">Regra Prática</th>
      <th style="padding: 10px; border: 1px solid #cbd5e1; text-align: left;">Exemplo</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 8px; border: 1px solid #cbd5e1;"><strong>Adição / Subtração</strong></td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">Igualar denominadores usando o MMC. Somar os numeradores e conservar o denominador.</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">1/4 + 2/4 = 3/4</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #cbd5e1;"><strong>Multiplicação</strong></td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">Multiplica-se numerador por numerador e denominador por denominador.</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">2/3 × 4/5 = 8/15</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #cbd5e1;"><strong>Divisão</strong></td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">Conserva a 1ª fração e multiplica pelo inverso da 2ª.</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">(3/4) ÷ (2/5) = 3/4 × 5/2 = 15/8</td>
    </tr>
  </tbody>
</table>

<h2>3. Checklist de Exercícios</h2>
<p>Marque as etapas conforme concluir suas revisões diárias:</p>
<ul style="list-style-type: square;">
  <li>Exercícios de MMC e denominadores diferentes</li>
  <li>Problemas contextualizados (divisão de pizzas/terrenos)</li>
  <li>Transformação de fração imprópria em número misto</li>
</ul>
`
  },
  {
    id: 'doc-2',
    title: 'Estrutura da Redação Dissertativa-Argumentativa',
    subject: 'Português',
    tags: ['Redação', 'Dissertação', 'ENEM', 'Gramática'],
    createdAt: '2026-08-28T14:00:00Z',
    updatedAt: '2026-08-30T16:45:00Z',
    isFavorite: true,
    paperStyle: 'blank',
    content: `<h1>Estrutura da Redação Dissertativa-Argumentativa</h1>
<p>Guia prático e roteiro de escrita para redações nota 1000 com divisão por parágrafos e conectivos recomendados.</p>

<hr />

<h2>1. Introdução (1 Parágrafo - ~6 a 8 linhas)</h2>
<p>A introdução deve situar o leitor no tema e deixar explícita a tese que será defendida ao longo do texto.</p>
<ol>
  <li><strong>Repertório de contextualização:</strong> alusão histórica, citação filosófica, dado estatístico ou obra artística.</li>
  <li><strong>Apresentação do Tema:</strong> explicitação clara das palavras-chave do recorte temático.</li>
  <li><strong>Tese (Problematização):</strong> apresentação dos dois argumentos centrais (Argumento A e Argumento B) que serão aprofundados no desenvolvimento.</li>
</ol>

<div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px 16px; border-radius: 8px; margin: 16px 0;">
  <strong>⚠️ Atenção:</strong> Não utilize primeira pessoa do singular (<em>"eu acho", "no meu ponto de vista"</em>). Prefira a impessoalidade (<em>"constata-se que", "é imperioso ressaltar"</em>).
</div>

<h2>2. Desenvolvimento 1 e 2 (~7 a 9 linhas cada)</h2>
<p>Cada parágrafo de desenvolvimento deve ser dedicado a defender um argumento específico previamente anunciado na tese:</p>
<ul>
  <li><strong>Tópico frasal:</strong> afirmação direta do argumento.</li>
  <li><strong>Fundamentação teórica:</strong> legitimidade com sociólogos, pensadores ou leis (ex: Constituição Federal de 1988).</li>
  <li><strong>Análise crítica:</strong> fechamento conectando a teoria ao problema real da sociedade.</li>
</ul>

<h2>3. Proposta de Intervenção (Conclusão - ~7 a 9 linhas)</h2>
<p>Deve conter obrigatoriamente os 5 elementos:</p>
<table style="width: 100%; border-collapse: collapse; margin: 16px 0; border: 1px solid #cbd5e1;">
  <thead>
    <tr style="background-color: #f8fafc;">
      <th style="padding: 8px; border: 1px solid #cbd5e1;">Elemento</th>
      <th style="padding: 8px; border: 1px solid #cbd5e1;">Pergunta a Responder</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="padding: 6px 10px; border: 1px solid #cbd5e1;"><strong>1. Agente</strong></td><td style="padding: 6px 10px; border: 1px solid #cbd5e1;">Quem executará a ação? (Ministérios, ONGs, Escolas, Mídia)</td></tr>
    <tr><td style="padding: 6px 10px; border: 1px solid #cbd5e1;"><strong>2. Ação</strong></td><td style="padding: 6px 10px; border: 1px solid #cbd5e1;">O que deve ser feito concretamente?</td></tr>
    <tr><td style="padding: 6px 10px; border: 1px solid #cbd5e1;"><strong>3. Meio / Modo</strong></td><td style="padding: 6px 10px; border: 1px solid #cbd5e1;">Por meio de quais instrumentos e parcerias?</td></tr>
    <tr><td style="padding: 6px 10px; border: 1px solid #cbd5e1;"><strong>4. Efeito</strong></td><td style="padding: 6px 10px; border: 1px solid #cbd5e1;">Com qual finalidade/impacto social esperado?</td></tr>
    <tr><td style="padding: 6px 10px; border: 1px solid #cbd5e1;"><strong>5. Detalhamento</strong></td><td style="padding: 6px 10px; border: 1px solid #cbd5e1;">Explicação adicional de um dos quatro itens anteriores.</td></tr>
  </tbody>
</table>
`
  },
  {
    id: 'doc-3',
    title: 'Anotações de Biologia: Célula Animal vs Vegetal',
    subject: 'Ciências',
    tags: ['Biologia', 'Citologia', 'Organelas'],
    createdAt: '2026-08-25T09:15:00Z',
    updatedAt: '2026-08-27T11:20:00Z',
    isFavorite: false,
    paperStyle: 'grid',
    content: `<h1>Anotações de Citologia: Célula Eucariótica Animal e Vegetal</h1>
<p>Estudo comparativo das organelas celulares, suas funções vitais e diferenças estruturais fundamentais.</p>

<hr />

<h2>1. Organelas Comuns a Ambas</h2>
<ul>
  <li><strong>Núcleo:</strong> Armazenamento do material genético (DNA) e controle celular.</li>
  <li><strong>Mitocôndrias:</strong> Respiração celular e geração de energia (ATP).</li>
  <li><strong>Ribossomos:</strong> Síntese de proteínas.</li>
  <li><strong>Complexo Golgiense:</strong> Secreção, empacotamento e modificação de substâncias.</li>
  <li><strong>Retículo Endoplasmático (Liso e Rugoso):</strong> Transporte e síntese de lipídios/proteínas.</li>
</ul>

<div style="background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 12px 16px; border-radius: 8px; margin: 16px 0;">
  <strong>🌱 Exclusividades da Célula Vegetal:</strong> Parede celular de celulose, Cloroplastos (clorofila para fotossíntese) e Vacúolo central volumoso de suco celular.
</div>
`
  }
];

