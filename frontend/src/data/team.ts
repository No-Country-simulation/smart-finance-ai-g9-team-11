export type TeamGroup =
  | "leadership"
  | "backend"
  | "data-science";

export interface TeamStackGroup {
  label: string;
  technologies: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  area: string;
  group: TeamGroup;
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

export interface TeamGroupDefinition {
  id: TeamGroup;
  label: string;
  subtitle: string;
}

export const teamGroups: TeamGroupDefinition[] = [
  {
    id: "leadership",
    label: "Liderança Técnica",
    subtitle:
      "Arquitetura, integração, frontend, DevOps e Cloud",
  },
  {
    id: "backend",
    label: "Back-end",
    subtitle:
      "APIs, segurança, regras de negócio, persistência e integrações",
  },
  {
    id: "data-science",
    label:
      "Ciência de Dados & Machine Learning",
    subtitle:
      "NLP, modelagem preditiva, perfil de risco e recomendações inteligentes",
  },
];

export const teamMembers: TeamMember[] = [
  {
    id: "gean-carlos",
    name: "Gean Carlos",
    role:
      "Tech Lead Full Stack, DevOps e OCI",
    area:
      "Liderança técnica e integração",
    group: "leadership",
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
      "Arquitetura Full Stack",
      "Interface do Produto",
      "Integração das Equipes",
    ],
    githubUrl:
      "https://github.com/EuGeanCarlos",
    linkedinUrl:
      "https://www.linkedin.com/in/gean-carlos-a9903a220/",
    photoUrl:
      "/team/gean.png",
    featured: true,
  },

  {
    id:
      "gabriel-de-souza-guimaraes",
    name:
      "Gabriel de Souza Guimarães",
    role: "Desenvolvedor Back-end",
    area:
      "Serviços, integração, dados e infraestrutura",
    group: "backend",
    summary:
      "Atuação no desenvolvimento do Back-end do Finance AI, com foco na construção da camada de serviços e regras de negócio, integração com o serviço de Machine Learning, modelagem e persistência dos dados e configuração do ambiente da aplicação com Docker.",
    skills: [
      "Arquitetura REST",
      "Regras de Negócio",
      "Integração de Sistemas",
      "Machine Learning",
      "Modelagem de Dados",
      "Resiliência e Fallback",
      "Tratamento de Exceções",
      "Docker",
    ],
    stackGroups: [
      {
        label: "Back-end",
        technologies: [
          "Java",
          "Spring Boot",
          "Spring Data JPA",
          "Maven",
          "Lombok",
        ],
      },
      {
        label: "Dados",
        technologies: [
          "Oracle Database",
          "Hibernate",
          "Flyway",
        ],
      },
      {
        label: "Integração IA",
        technologies: [
          "FastAPI",
          "REST API",
          "JSON",
          "Spring RestClient",
        ],
      },
      {
        label: "DevOps",
        technologies: [
          "Docker",
          "Docker Compose",
          "Git",
          "GitHub",
          "Postman",
        ],
      },
    ],
    activities: [
      "Desenvolvimento da camada de serviços e processamento das regras de negócio.",
      "Implementação do fluxo de análise financeira, incluindo processamento das transações.",
      "Construção da integração entre o Back-end e o serviço de Machine Learning com FastAPI.",
      "Implementação de tratamento padronizado de exceções e mecanismo de fallback.",
      "Modelagem das entidades e persistência de usuários, transações e análises financeiras.",
      "Configuração da aplicação para execução em containers utilizando Docker e Docker Compose.",
      "Criação da documentação técnica de API, arquitetura, regras de negócio e setup.",
    ],
    highlights: [
      "Camada de Serviços",
      "Integração com IA",
      "Infra e Banco de Dados",
    ],
    githubUrl:
      "https://github.com/Sg-Gabriel",
    linkedinUrl: "",
    photoUrl:
      "/team/gabriel.webp",
  },

  {
    id: "amanda-cristiny",
    name: "Amanda Cristiny",
    role: "Desenvolvedora Back-end",
    area:
      "APIs, integração com ML e qualidade",
    group: "backend",
    summary:
      "Responsável pelo desenvolvimento de endpoints REST, integração entre o Backend e o serviço de Machine Learning, documentação da API e execução de testes funcionais para validação das regras de negócio e qualidade da aplicação.",
    skills: [
      "Desenvolvimento Back-end",
      "APIs REST",
      "Integração de Serviços",
      "Documentação de API",
      "Validação de Entrada",
      "Testes de API",
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
        label: "Integração",
        technologies: [
          "REST API",
          "JSON",
          "Swagger",
          "FastAPI",
        ],
      },
      {
        label: "Qualidade",
        technologies: [
          "Testes Funcionais",
          "Validação",
          "OpenAPI",
        ],
      },
    ],
    activities: [
      "Desenvolvimento de endpoints REST da API.",
      "Integração do Backend com o serviço de Machine Learning em FastAPI.",
      "Definição e documentação do contrato de integração entre Backend e IA.",
      "Implementação de validações de entrada.",
      "Padronização da documentação das respostas e exceções utilizando Swagger e OpenAPI.",
      "Planejamento e execução dos testes funcionais da API.",
      "Validação das regras de negócio e identificação de bugs.",
    ],
    highlights: [
      "Integração Backend + ML",
      "Testes da API",
      "Documentação da API",
    ],
    photoUrl:
      "/team/amanda.jpg",
  },

  {
    id: "leilanny-rodrigues",
    name: "Leilanny Rodrigues",
    role: "Desenvolvedora Back-end",
    area:
      "Autenticação, segurança e DTOs",
    group: "backend",
    summary:
      "Responsável pelo desenvolvimento de endpoints RESTful, implementação de controle de acesso com JWT, estruturação de DTOs de entrada e saída, validação com Bean Validation e tratamento padronizado de erros HTTP no CRUD de usuários.",
    skills: [
      "Desenvolvimento Back-end",
      "APIs RESTful",
      "Autenticação e Segurança",
      "JWT",
      "Validação de Dados",
      "Tratamento de Erros",
      "Modelagem de DTOs",
    ],
    stackGroups: [
      {
        label: "Back-end",
        technologies: [
          "Java",
          "Spring Boot",
          "Spring Security",
          "JWT",
          "Maven",
        ],
      },
      {
        label: "Validação",
        technologies: [
          "Jakarta Validation",
          "Bean Validation",
          "HTTP Status",
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
      "Implementação de autenticação e controle de acesso via Token JWT.",
      "Desenvolvimento do CRUD de usuários com padronização de respostas e tratamento de erros HTTP.",
      "Criação e estruturação da arquitetura de DTOs de entrada e saída.",
      "Implementação da estrutura de request utilizada na comunicação com o serviço de Machine Learning.",
      "Aplicação de regras de validação de payloads utilizando Bean Validation.",
      "Apoio à estruturação da segurança dos endpoints protegidos da aplicação.",
    ],
    highlights: [
      "Autenticação e Segurança JWT",
      "Validação de Dados",
      "Modelagem de DTOs",
    ],
    photoUrl:
      "/team/leilanny.jpg",
  },

  {
    id: "fred-joaquim",
    name: "Fred Joaquim",
    role: "Desenvolvedor Back-end",
    area:
      "Análises financeiras e persistência",
    group: "backend",
    summary:
      "Responsável pelo desenvolvimento das funcionalidades relacionadas às análises financeiras no Back-end, incluindo criação, listagem, consulta e exclusão dos registros de análises geradas pela aplicação.",
    skills: [
      "Desenvolvimento Back-end",
      "APIs REST",
      "CRUD",
      "Persistência de Dados",
      "Regras de Negócio",
      "Integração com Banco de Dados",
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
        label: "Integração",
        technologies: [
          "REST API",
          "JSON",
          "Swagger",
        ],
      },
      {
        label: "Dados",
        technologies: [
          "MySQL",
          "Persistência",
          "CRUD",
        ],
      },
    ],
    activities: [
      "Desenvolvimento de parte do CRUD de análises financeiras.",
      "Criação de endpoints REST relacionados às análises.",
      "Implementação das operações de criação, listagem, consulta e exclusão de análises financeiras.",
      "Apoio na persistência dos registros de análise no banco de dados.",
      "Integração das operações de análise financeira com a camada de dados da aplicação.",
    ],
    highlights: [
      "CRUD de Análises Financeiras",
      "Endpoints REST de Análises",
      "Persistência no Banco de Dados",
    ],
    photoUrl:
      "/team/fred.png",
  },

  {
    id: "vitor-barbosa",
    name: "Vitor Barbosa",
    role:
      "Cientista de Dados — NLP & FastAPI",
    area:
      "Ciência de Dados e Machine Learning",
    group: "data-science",
    summary:
      "Responsável pelo desenvolvimento, treinamento e refinamento dos modelos de Machine Learning voltados para NLP e perfil financeiro, além da engenharia de features, estruturação de pipelines de IA e integração dos modelos por meio de API FastAPI.",
    skills: [
      "Machine Learning",
      "Processamento de Linguagem Natural (NLP)",
      "Engenharia de Features",
      "Estruturação de Pipelines",
      "Modelagem Preditiva",
    ],
    stackGroups: [
      {
        label: "Machine Learning",
        technologies: [
          "Python",
          "Pandas",
          "Scikit-Learn",
          "Joblib",
          "Jupyter / Notebooks",
        ],
      },
      {
        label: "API e Integração",
        technologies: [
          "FastAPI",
          "Pydantic",
          "Uvicorn",
          "REST API",
          "JSON",
        ],
      },
      {
        label: "Modelagem e NLP",
        technologies: [
          "NLP",
          "Classificação de Transações",
          "Engenharia de Features",
          "Modelagem Preditiva",
          "Pipelines de IA",
        ],
      },
    ],
    activities: [
      "Desenvolvimento e treinamento dos modelos de Machine Learning utilizados na aplicação.",
      "Refinamento do modelo de classificação NLP de transações financeiras.",
      "Desenvolvimento e evolução dos modelos relacionados ao perfil financeiro.",
      "Construção e aprimoramento da engenharia de features utilizada pelos modelos.",
      "Estruturação dos pipelines responsáveis pelo processamento e inferência dos dados.",
      "Disponibilização dos modelos por meio de API FastAPI.",
      "Integração dos serviços de Machine Learning com o restante da arquitetura do Finance AI.",
    ],
    highlights: [
      "Classificação NLP de Transações",
      "Modelagem de Dados",
      "Pipeline de Integração FastAPI",
    ],
    githubUrl:
      "https://github.com/vitorbsilvadev1",
    linkedinUrl: "",
    photoUrl:
      "/team/vitor.png",
  },

  {
    id: "luciano-sena",
    name: "Luciano Sena",
    role:
      "Cientista de Dados — Perfil de Risco & Recomendações",
    area:
      "Ciência de Dados e Machine Learning",
    group: "data-science",
    summary:
      "Responsável pela classificação da saúde financeira global do usuário e geração de recomendações inteligentes, através de engenharia de atributos, modelagem preditiva com Gradient Boosting e árvores de decisão lógicas, integrando os resultados ao endpoint unificado /analise-financeira.",
    skills: [
      "Machine Learning",
      "Engenharia de Atributos",
      "Modelagem Preditiva com Gradient Boosting",
      "Árvores de Decisão para Sistemas de Regras",
      "Testes de Integração e Estresse de API",
    ],
    stackGroups: [
      {
        label: "Machine Learning",
        technologies: [
          "Python",
          "Pandas",
          "Scikit-Learn",
          "Joblib",
          "Jupyter / Notebooks",
        ],
      },
      {
        label: "API e Modelagem",
        technologies: [
          "FastAPI",
          "Pydantic",
          "Uvicorn",
          "Gradient Boosting",
          "Árvores de Decisão",
        ],
      },
      {
        label: "Testes e Validação",
        technologies: [
          "Pytest",
          "Pytest-HTML",
          "Httpx",
          "Testes E2E",
          "Testes de Estresse",
        ],
      },
    ],
    activities: [
      "Desenvolvimento da classificação global da saúde financeira do usuário.",
      "Engenharia de atributos utilizados na análise do comportamento financeiro.",
      "Desenvolvimento da modelagem preditiva utilizando Gradient Boosting.",
      "Construção de árvores de decisão e regras para geração de recomendações inteligentes.",
      "Integração dos resultados de perfil de risco e recomendações ao endpoint unificado /analise-financeira.",
      "Desenvolvimento e execução de testes de integração e estresse da API.",
      "Validação do fluxo ponta a ponta da aplicação em ambiente OCI.",
    ],
    highlights: [
      "Classificação de Perfil de Risco Financeiro",
      "Motor de Recomendações Dinâmicas",
      "Validação E2E na OCI",
    ],
    photoUrl:
      "/team/luciano.jpeg",
  },
];