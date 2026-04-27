import type { DashboardData, ChartDataPoint, RadarDataPoint, BaseQueryParams } from '@/types';

// =============================================================================
// DASHBOARD SERVICE — Fachada pública
// =============================================================================
// A regra de negócio principal vive aqui. Componentes chamam este arquivo.
// Este arquivo decide internamente qual Adapter instanciar.

const USE_MOCK = process.env.USE_MOCK === 'true';

export async function getDashboardData(params?: BaseQueryParams): Promise<DashboardData> {
  if (USE_MOCK) {
    const { getMockDashboard } = await import('@/adapters/mock/dashboard.mock');
    return getMockDashboard();
  }
  const { getPrismaDashboard } = await import('@/adapters/prisma/dashboard.prisma');
  return getPrismaDashboard(params);
}

export async function getHistoricalChartData(): Promise<ChartDataPoint[]> {
  if (USE_MOCK) {
    const { getMockHistoricalChart } = await import('@/adapters/mock/dashboard.mock');
    return getMockHistoricalChart();
  }
  // TODO (Etapa 3): buscar evolução histórica real via Assessment no Prisma
  // Por ora, retorna mock mesmo em modo real até a tabela Assessment ser populada
  const { getMockHistoricalChart } = await import('@/adapters/mock/dashboard.mock');
  return getMockHistoricalChart();
}

export async function getRadarData(courseId?: string): Promise<RadarDataPoint[]> {
  if (USE_MOCK || !courseId) {
    const { getMockRadarData } = await import('@/adapters/mock/dashboard.mock');
    return getMockRadarData();
  }
  
  const { getPrismaRadarData } = await import('@/adapters/prisma/dashboard.prisma');
  return getPrismaRadarData(courseId);
}
