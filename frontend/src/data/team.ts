export interface TeamStackGroup {
  label: string;
  technologies: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  area: string;
  summary: string;
  skills: string[];
  stackGroups: TeamStackGroup[];
  activities: string[];
  highlights: string[];
  githubUrl?: string;
  linkedinUrl?: string;
  photoUrl?: string;
  featured?: boolean;
}

export const teamMembers: TeamMember[] = [
  {
    id: "gean-carlos",
    name: "Gean Carlos",
    role: "Tech Lead Full Stack, DevOps e OCI",
    area: "Liderança técnica e integração",
    summary:
      "Responsável pela coordenação técnica do Finance AI, evolução do frontend, integração das diferentes frentes e preparação da infraestrutura da aplicação.",
    skills: [
      "Liderança técnica",
      "Arquitetura de software",
      "Integração de sistemas",
      "Design System",
      "Cloud Computing",
      "Versionamento Git",
    ],
    stackGroups: [
      {
        label: "Frontend",
        technologies: [
          "React",
          "TypeScript",
          "Vite",
          "Tailwind CSS",
          "React Router",
          "Recharts",
        ],
      },
      {
        label: "Back-end",
        technologies: [
          "Java",
          "Spring Boot",
          "REST API",
        ],
      },
      {
        label: "DevOps e Cloud",
        technologies: [
          "Docker",
          "Oracle Cloud Infrastructure",
          "GitHub",
          "CI/CD",
        ],
      },
    ],
    activities: [
      "Organização da arquitetura geral e das etapas de desenvolvimento.",
      "Desenvolvimento e evolução da interface do Finance AI.",
      "Construção do dashboard financeiro e da Landing Page.",
      "Integração entre frontend, backend e serviços inteligentes.",
      "Planejamento da dockerização e dos serviços utilizados na OCI.",
      "Organização das branches, entregas e comunicação técnica da equipe.",
    ],
    highlights: [
      "Arquitetura full stack",
      "Interface do produto",
      "Integração das equipes",
    ],
    githubUrl:
      "https://github.com/EuGeanCarlos",
    linkedinUrl:
      "https://www.linkedin.com/in/gean-carlos-a9903a220/",
    featured: true,
  },

  {
    id: "gabriel",
    name: "Gabriel",
    role: "Desenvolvedor Back-end",
    area: "APIs e regras de negócio",
    summary:
      "Responsável pela construção da camada de serviços, validações, persistência e processamento das análises financeiras.",
    skills: [
      "Desenvolvimento back-end",
      "Modelagem de dados",
      "Validação de entrada",
      "Tratamento de erros",
      "Arquitetura REST",
      "Regras de negócio",
    ],
    stackGroups: [
      {
        label: "Back-end",
        technologies: [
          "Java",
          "Spring Boot",
          "Maven",
          "Jakarta Validation",
        ],
      },
      {
        label: "Dados",
        technologies: [
          "JPA",
          "Hibernate",
          "PostgreSQL",
        ],
      },
      {
        label: "Integração",
        technologies: [
          "REST API",
          "JSON",
          "Swagger",
        ],
      },
    ],
    activities: [
      "Implementação dos serviços de análise financeira.",
      "Construção dos controllers e contratos da API.",
      "Desenvolvimento das validações de entrada.",
      "Implementação da persistência das informações financeiras.",
      "Tratamento de exceções e respostas JSON estruturadas.",
      "Integração da API principal com os serviços de análise.",
    ],
    highlights: [
      "API financeira",
      "Persistência de dados",
      "Validações",
    ],
    githubUrl:
      "https://github.com/Sg-Gabriel",
    linkedinUrl: "",
  },

  {
    id: "vitor",
    name: "Vitor",
    role: "Desenvolvedor Machine Learning e NLP",
    area: "Inteligência artificial",
    summary:
      "Responsável pela classificação inteligente de transações e pela disponibilização dos recursos de Machine Learning para o restante da aplicação.",
    skills: [
      "Machine Learning",
      "Processamento de linguagem natural",
      "Tratamento de dados",
      "Modelagem preditiva",
      "Integração de modelos",
      "APIs inteligentes",
    ],
    stackGroups: [
      {
        label: "Inteligência artificial",
        technologies: [
          "Python",
          "Machine Learning",
          "NLP",
        ],
      },
      {
        label: "Serviços",
        technologies: [
          "FastAPI",
          "REST API",
          "JSON",
        ],
      },
      {
        label: "Dados",
        technologies: [
          "Pandas",
          "Classificação",
          "Pré-processamento",
        ],
      },
    ],
    activities: [
      "Desenvolvimento da classificação automática de transações.",
      "Estruturação do serviço de Machine Learning.",
      "Construção da API responsável por disponibilizar o modelo.",
      "Preparação e tratamento dos dados recebidos pela aplicação.",
      "Integração dos resultados de IA com o backend principal.",
      "Apoio à geração das análises e recomendações financeiras.",
    ],
    highlights: [
      "Classificação automática",
      "Serviço FastAPI",
      "Integração de IA",
    ],
    githubUrl:
      "https://github.com/vitorbsilvadev1",
    linkedinUrl: "",
  },

  {
    id: "perfil-risco",
    name: "Equipe de Perfil e Risco",
    role:
      "Desenvolvimento Back-end e Análise Financeira",
    area: "Perfil financeiro e risco",
    summary:
      "Responsável pelas regras utilizadas para interpretar o comportamento financeiro e classificar o usuário de acordo com seus indicadores.",
    skills: [
      "Análise financeira",
      "Regras de classificação",
      "Desenvolvimento back-end",
      "Indicadores financeiros",
      "Testes de cenários",
      "Integração de serviços",
    ],
    stackGroups: [
      {
        label: "Back-end",
        technologies: [
          "Java",
          "Spring Boot",
          "REST API",
        ],
      },
      {
        label: "Domínio financeiro",
        technologies: [
          "Perfil financeiro",
          "Análise de risco",
          "Indicadores",
        ],
      },
      {
        label: "Qualidade",
        technologies: [
          "Validação",
          "Testes",
          "Cenários financeiros",
        ],
      },
    ],
    activities: [
      "Implementação da classificação do perfil financeiro.",
      "Construção das regras de análise de risco.",
      "Cálculo dos indicadores de endividamento e comprometimento.",
      "Definição dos estados Saudável, Em observação e Em risco.",
      "Integração das classificações com os serviços de análise.",
      "Validação dos diferentes cenários financeiros da aplicação.",
    ],
    highlights: [
      "Perfil financeiro",
      "Análise de risco",
      "Indicadores",
    ],
    githubUrl:
      "https://github.com/Lufsenna",
    linkedinUrl: "",
  },
];