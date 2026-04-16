export interface EnadeData {
  alunoId: string;
  curso: string;
  notaGeral: number;
  notaFG: number;
  notaCE: number;
  idd?: number;
  ano: number;
  tipo: 'oficial' | 'simulado';
}

export const parseCSV = (csvText: string): EnadeData[] => {
  const lines = csvText.split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).filter(line => line.trim()).map(line => {
    const values = line.split(',');
    return {
      alunoId: values[0],
      curso: values[1],
      notaGeral: parseFloat(values[2]),
      notaFG: parseFloat(values[3]),
      notaCE: parseFloat(values[4]),
      idd: values[5] ? parseFloat(values[5]) : undefined,
      ano: parseInt(values[6]),
      tipo: values[7] as 'oficial' | 'simulado'
    };
  });
};

export const calculateCourseStats = (data: EnadeData[]) => {
  if (data.length === 0) return null;
  
  const total = data.length;
  const avgGeral = data.reduce((acc, d) => acc + d.notaGeral, 0) / total;
  const avgFG = data.reduce((acc, d) => acc + d.notaFG, 0) / total;
  const avgCE = data.reduce((acc, d) => acc + d.notaCE, 0) / total;
  
  return {
    avgGeral: avgGeral.toFixed(2),
    avgFG: avgFG.toFixed(2),
    avgCE: avgCE.toFixed(2),
    count: total,
    risk: avgGeral < 2.5 ? 'Alto' : avgGeral < 3.5 ? 'Médio' : 'Baixo'
  };
};
