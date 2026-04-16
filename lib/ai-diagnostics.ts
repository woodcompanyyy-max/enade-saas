export const generateDiagnosis = (courseName: string, stats: any) => {
  return {
    course: courseName,
    notaGeral: stats.avgGeral,
    variation: "+5.6%",
    trend: "Crescente",
    nationalAvgDiff: "+0.23",
    regionalAvgDiff: "+0.18",
    strengths: [
      "Conhecimento Específico acima da média",
      "Alta taxa de participação dos alunos",
      "Evolução consistente nos últimos 3 anos"
    ],
    weaknesses: [
      "IDD com leve tendência de queda",
      "Formação Geral abaixo do benchmark regional",
      "Gaps identificados em disciplinas de Gestão Estratégica"
    ],
    recommendations: [
      "Implementar oficinas de Formação Geral",
      "Focar em simulados de Conhecimento Específico avançado",
      "Monitorar alunos com desempenho abaixo do P25"
    ]
  };
};
