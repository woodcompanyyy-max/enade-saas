// =============================================================================
// TIPOS CENTRAIS — ENADE SaaS
// Todos os contratos de dados do sistema ficam aqui.
// Componentes, services e adapters DEVEM importar daqui.
// =============================================================================

// ---------------------------------------------------------------------------
// CURSO
// ---------------------------------------------------------------------------
export type CourseCategory = 'Bacharelado' | 'Licenciatura' | 'Tecnológico';
export type CourseModality = 'Presencial' | 'Semipresencial' | 'EaD';
export type RiskLevel = 'Baixo' | 'Médio' | 'Alto';

export interface Course {
  id: string;
  name: string;
  category: CourseCategory;
  modality: CourseModality;
  enadeScore: number;        // 0–5
  nationalAvg: number;       // média nacional para comparação
  participationRate: number; // 0–100 (%)
  idd: number;               // Indicador de Diferença entre Desempenhos — 0–5
  riskLevel: RiskLevel;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCourseInput {
  name: string;
  category: CourseCategory;
  modality: CourseModality;
  enadeScore?: number;
  nationalAvg?: number;
  participationRate?: number;
  idd?: number;
  riskLevel?: RiskLevel;
}

export interface UpdateCourseInput extends Partial<CreateCourseInput> {
  id: string;
}

// Versão resumida para listagens
export interface CourseSummary {
  id: string;
  name: string;
  category: CourseCategory;
  modality: CourseModality;
  enadeScore: number;
  riskLevel: RiskLevel;
}

// ---------------------------------------------------------------------------
// PAGINAÇÃO E PARÂMETROS
// ---------------------------------------------------------------------------
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
}

export interface BaseQueryParams {
  page?: number;
  perPage?: number;
  userId?: string;
  userRole?: string;
}

export interface CourseQueryParams extends BaseQueryParams {
  search?: string;
  category?: string;
  riskLevel?: string;
}

// ---------------------------------------------------------------------------
// DASHBOARD
// ---------------------------------------------------------------------------
export interface DashboardStats {
  avgEnade: string;       // formatado: "3.72"
  totalCourses: number;
  aboveAvg: number;       // cursos acima da média nacional
  participation: string;  // formatado: "87.5%"
}

export interface CourseKPI {
  name: string;
  score: number;
}

export interface AreaKPI {
  title: string;   // ex: "Bacharelado"
  count: number;
  avg: number;
}

export type AlertType = 'danger' | 'warning' | 'info';
export type AlertLevel = 'Alta' | 'Média' | 'Baixa';

export interface AlertItem {
  course: string;
  level: AlertLevel;
  title: string;
  desc: string;
  type: AlertType;
}

export interface DashboardData {
  stats: DashboardStats;
  courses: CourseKPI[];   // top cursos por nota (para ranking)
  areas: AreaKPI[];       // agrupados por categoria
  alerts: AlertItem[];
}

// ---------------------------------------------------------------------------
// GRÁFICOS
// ---------------------------------------------------------------------------
export interface ChartDataPoint {
  year: string;
  score: number;
}

export interface RadarDataPoint {
  subject: string;
  value: number;      // 0–100 (normalizado)
  fullMark: number;   // sempre 100
}

// ---------------------------------------------------------------------------
// SIMULADOS
// ---------------------------------------------------------------------------
export type SimuladoStatus = 'Agendado' | 'Em andamento' | 'Finalizado';

export interface Simulado {
  id: string;
  name: string;
  date: string;       // ISO string
  avg: number;        // Média de nota 0-10 ou 0-5
  participation: number; // Porcentagem 0-100
  status: SimuladoStatus;
  courseId: string;   // Relacionamento com o curso
  courseName: string; // Desnormalizado/Join para a listagem
  createdAt: string;
}

export interface CreateSimuladoInput {
  name: string;
  courseId: string;
  date: string;
  status?: SimuladoStatus;
}

export interface UpdateSimuladoInput extends Partial<CreateSimuladoInput> {
  id: string;
}

export interface SimuladoQueryParams extends BaseQueryParams {
  search?: string;
  status?: string;
  courseId?: string;
}

// ---------------------------------------------------------------------------
// DIAGNÓSTICO
// ---------------------------------------------------------------------------
export interface Diagnostico {
  id: string;
  courseId: string;
  courseName: string;
  simuladoId?: string;
  simuladoName?: string;
  scoreGeral: number;
  riskLevel: RiskLevel;
  trend: 'Crescente' | 'Estável' | 'Em queda';
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  createdAt: string;
}

export interface DiagnosticoQueryParams extends BaseQueryParams {
  courseId?: string;
  riskLevel?: string;
  dateStr?: string; // Optional filtering by recent date
}

// ---------------------------------------------------------------------------
// RELATÓRIOS
// ---------------------------------------------------------------------------
export type ReportType = 'ENADE Oficial' | 'Simulado' | 'Interno';

export interface Report {
  id: string;
  name: string;
  date: string;
  type: ReportType;
  size: string;
  url?: string;
}

// ---------------------------------------------------------------------------
// IMPORTAÇÃO
// ---------------------------------------------------------------------------
export interface ImportRow {
  student_name: string;
  ra: string;
  course: string;
  shift: string;
  exam_type: string;
  specific_correct: number;
  specific_wrong: number;
  fg_correct: number;
  fg_wrong: number;
  total_correct: number;
  total_wrong: number;
}

export interface ImportSummary {
  totalRows: number;
  successCount: number;
  errorCount: number;
  errors: { row: number; error: string }[];
  newCourses: string[];
  newStudents: number;
}
