export interface Course {
  id: string;
  name: string;
  type: 'Bacharelado' | 'Licenciatura' | 'Tecnológico';
  modality: 'Presencial' | 'Semipresencial' | 'EaD';
}

export const COURSES: Course[] = [
  // Bacharelados
  { id: 'admin-sp', name: 'Administração', type: 'Bacharelado', modality: 'Semipresencial' },
  { id: 'biomed-p', name: 'Biomedicina', type: 'Bacharelado', modality: 'Presencial' },
  { id: 'contab-sp', name: 'Ciências Contábeis', type: 'Bacharelado', modality: 'Semipresencial' },
  { id: 'direito-p', name: 'Direito', type: 'Bacharelado', modality: 'Presencial' },
  { id: 'edfis-p', name: 'Educação Física', type: 'Bacharelado', modality: 'Presencial' },
  { id: 'enferm-p', name: 'Enfermagem', type: 'Bacharelado', modality: 'Presencial' },
  { id: 'engcivil-p', name: 'Engenharia Civil', type: 'Bacharelado', modality: 'Presencial' },
  { id: 'engauto-p', name: 'Engenharia de Controle e Automação', type: 'Bacharelado', modality: 'Presencial' },
  { id: 'engprod-sp', name: 'Engenharia de Produção', type: 'Bacharelado', modality: 'Semipresencial' },
  { id: 'engmec-sp', name: 'Engenharia Mecânica', type: 'Bacharelado', modality: 'Semipresencial' },
  { id: 'farm-p', name: 'Farmácia', type: 'Bacharelado', modality: 'Presencial' },
  { id: 'fisiot-p', name: 'Fisioterapia', type: 'Bacharelado', modality: 'Presencial' },
  { id: 'fono-p', name: 'Fonoaudiologia', type: 'Bacharelado', modality: 'Presencial' },
  { id: 'vet-p', name: 'Medicina Veterinária', type: 'Bacharelado', modality: 'Presencial' },
  { id: 'nutri-p', name: 'Nutrição', type: 'Bacharelado', modality: 'Presencial' },
  { id: 'odont-p', name: 'Odontologia', type: 'Bacharelado', modality: 'Presencial' },
  { id: 'psico-p', name: 'Psicologia', type: 'Bacharelado', modality: 'Presencial' },
  { id: 'pub-p', name: 'Publicidade e Propaganda', type: 'Bacharelado', modality: 'Presencial' },

  // Licenciaturas
  { id: 'edfis-lic-p', name: 'Educação Física', type: 'Licenciatura', modality: 'Presencial' },
  { id: 'mat-ead', name: 'Matemática', type: 'Licenciatura', modality: 'EaD' },
  { id: 'pedag-p', name: 'Pedagogia', type: 'Licenciatura', modality: 'Presencial' },

  // Tecnológicos
  { id: 'ads-sp', name: 'Análise e Desenvolvimento de Sistemas', type: 'Tecnológico', modality: 'Semipresencial' },
  { id: 'comext-ead', name: 'Comércio Exterior', type: 'Tecnológico', modality: 'EaD' },
  { id: 'gestamb-ead', name: 'Gestão Ambiental', type: 'Tecnológico', modality: 'EaD' },
  { id: 'gestcom-ead', name: 'Gestão Comercial', type: 'Tecnológico', modality: 'EaD' },
  { id: 'gestqual-ead', name: 'Gestão da Qualidade', type: 'Tecnológico', modality: 'EaD' },
  { id: 'gestti-sp', name: 'Gestão da Tecnologia da Informação', type: 'Tecnológico', modality: 'Semipresencial' },
  { id: 'gestrh-sp', name: 'Gestão de Recursos Humanos', type: 'Tecnológico', modality: 'Semipresencial' },
  { id: 'gestfin-ead', name: 'Gestão Financeira', type: 'Tecnológico', modality: 'EaD' },
  { id: 'gestpub-sp', name: 'Gestão Pública', type: 'Tecnológico', modality: 'Semipresencial' },
  { id: 'log-sp', name: 'Logística', type: 'Tecnológico', modality: 'Semipresencial' },
  { id: 'mkt-ead', name: 'Marketing', type: 'Tecnológico', modality: 'EaD' },
  { id: 'procger-ead', name: 'Processos Gerenciais', type: 'Tecnológico', modality: 'EaD' },
];
