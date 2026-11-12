import type { Language, ProjectId } from '../lib/routes';

export interface Technology {
  name: string | Record<Language, string>;
  documentation: string;
  command?: string;
  // Add only confirmed associations; an absent value renders no project links.
  projects?: readonly ProjectId[];
}

function technology(
  name: Technology['name'],
  documentation: string,
  command?: string,
): Technology {
  return { name, documentation, command };
}

// Camilo's supplied inventory. No proficiency, employment or ranking is inferred.
export const technologies = {
  python: technology(
    'Python',
    'https://docs.python.org/3/',
    'python3 --version',
  ),
  javascript: technology(
    'JavaScript',
    'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
  ),
  typescript: technology(
    'TypeScript',
    'https://www.typescriptlang.org/docs/',
    'tsc --version',
  ),
  java: technology('Java', 'https://dev.java/learn/', 'java -version'),
  sql: technology(
    'SQL',
    'https://www.postgresql.org/docs/current/tutorial-sql.html',
  ),
  html: technology(
    'HTML5',
    'https://developer.mozilla.org/en-US/docs/Web/HTML',
  ),
  css: technology('CSS3', 'https://developer.mozilla.org/en-US/docs/Web/CSS'),
  bash: technology(
    'Bash / Shell',
    'https://www.gnu.org/software/bash/manual/',
    'echo $SHELL',
  ),
  cpp: technology('C++', 'https://isocpp.org/get-started'),
  lua: technology('Lua', 'https://www.lua.org/manual/'),
  dart: technology('Dart', 'https://dart.dev/guides'),
  django: technology(
    'Django',
    'https://docs.djangoproject.com/',
    'python3 -m django --version',
  ),
  drf: technology(
    'Django REST Framework',
    'https://www.django-rest-framework.org/',
  ),
  flask: technology('Flask', 'https://flask.palletsprojects.com/'),
  spring: technology('Spring Boot', 'https://docs.spring.io/spring-boot/'),
  maven: technology(
    'Maven',
    'https://maven.apache.org/guides/',
    'mvn --version',
  ),
  node: technology('Node.js', 'https://nodejs.org/en/learn', 'node --version'),
  nest: technology('NestJS', 'https://docs.nestjs.com/'),
  react: technology('React', 'https://react.dev/learn'),
  mui: technology(
    'Material UI (MUI)',
    'https://mui.com/material-ui/getting-started/',
  ),
  vite: technology('Vite', 'https://vite.dev/guide/'),
  flutter: technology('Flutter', 'https://docs.flutter.dev/'),
  pandas: technology('pandas', 'https://pandas.pydata.org/docs/'),
  numpy: technology('NumPy', 'https://numpy.org/doc/'),
  openpyxl: technology(
    'openpyxl',
    'https://openpyxl.readthedocs.io/en/stable/',
  ),
  streamlit: technology('Streamlit', 'https://docs.streamlit.io/'),
  playwright: technology('Playwright', 'https://playwright.dev/docs/intro'),
  axios: technology('Axios', 'https://axios-http.com/docs/intro'),
  postgresql: technology(
    'PostgreSQL',
    'https://www.postgresql.org/docs/',
    'psql --version',
  ),
  oracle: technology(
    'Oracle Database 12c',
    'https://docs.oracle.com/en/database/oracle/oracle-database/12.2/',
  ),
  mysql: technology('MySQL', 'https://dev.mysql.com/doc/'),
  sqlite: technology('SQLite', 'https://sqlite.org/docs.html'),
  firebase: technology(
    'Firebase / Cloud Firestore',
    'https://firebase.google.com/docs/firestore',
  ),
  fedora: technology(
    'Fedora Linux',
    'https://docs.fedoraproject.org/',
    'uname -a',
  ),
  ubuntu: technology('Ubuntu', 'https://documentation.ubuntu.com/', 'uname -a'),
  debian: technology('Debian', 'https://www.debian.org/doc/', 'uname -a'),
  docker: technology('Docker', 'https://docs.docker.com/', 'docker ps'),
  compose: technology(
    'Docker Compose',
    'https://docs.docker.com/compose/',
    'docker compose ps',
  ),
  kubernetes: technology(
    'Kubernetes',
    'https://kubernetes.io/docs/',
    'kubectl get pods',
  ),
  nginx: technology('Nginx', 'https://nginx.org/en/docs/', 'nginx -v'),
  raspberry: technology(
    'Raspberry Pi',
    'https://www.raspberrypi.com/documentation/',
  ),
  digitalocean: technology('DigitalOcean', 'https://docs.digitalocean.com/'),
  contabo: technology('Contabo VPS', 'https://contabo.com/en/vps/'),
  cloudflare: technology(
    'Cloudflare Tunnel',
    'https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/',
  ),
  ssh: technology('SSH', 'https://www.openssh.com/manual.html', 'ssh -V'),
  git: technology('Git', 'https://git-scm.com/docs', 'git log --oneline'),
  github: technology('GitHub', 'https://docs.github.com/'),
  powerbi: technology(
    'Power BI',
    'https://learn.microsoft.com/en-us/power-bi/',
  ),
  excel: technology('Excel', 'https://support.microsoft.com/excel'),
  fabric: technology(
    'Microsoft Fabric',
    'https://learn.microsoft.com/en-us/fabric/',
  ),
  azure: technology(
    'Azure Data Services',
    'https://learn.microsoft.com/en-us/azure/?product=databases',
  ),
  aws: technology('AWS Data Services', 'https://docs.aws.amazon.com/'),
  databricks: technology('Databricks', 'https://docs.databricks.com/'),
  ollama: technology('Ollama', 'https://docs.ollama.com/', 'ollama list'),
  qwen: technology('Qwen / Qwen3', 'https://qwen.readthedocs.io/en/latest/'),
  comfyui: technology('ComfyUI', 'https://docs.comfy.org/'),
  diffusion: technology(
    'Stable Diffusion',
    'https://github.com/Stability-AI/generative-models',
  ),
  pytorch: technology('PyTorch', 'https://docs.pytorch.org/docs/stable/'),
  cuda: technology(
    'NVIDIA CUDA',
    'https://docs.nvidia.com/cuda/',
    'nvcc --version',
  ),
  piper: technology('Piper TTS', 'https://github.com/OHF-Voice/piper1-gpl'),
  codex: technology('Codex', 'https://github.com/openai/codex'),
  opencode: technology('OpenCode', 'https://opencode.ai/docs/'),
  unity: technology('Unity', 'https://docs.unity3d.com/Manual/'),
  unreal: technology(
    'Unreal Engine',
    'https://dev.epicgames.com/documentation/en-us/unreal-engine',
  ),
  arduino: technology('Arduino', 'https://docs.arduino.cc/'),
  esp32: technology(
    'ESP32',
    'https://docs.espressif.com/projects/esp-idf/en/stable/esp32/',
  ),
  paper: technology('Paper / Bukkit API', 'https://docs.papermc.io/paper/dev/'),
  gradle: technology('Gradle', 'https://docs.gradle.org/', 'gradle --version'),
  rest: technology(
    'REST',
    'https://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm',
  ),
  soap: technology('SOAP', 'https://www.w3.org/TR/soap/'),
  grpc: technology('gRPC', 'https://grpc.io/docs/'),
  layers: technology(
    { es: 'Arquitectura por capas', en: 'Layered architecture' },
    'https://learn.microsoft.com/en-us/azure/architecture/guide/architecture-styles/n-tier',
  ),
  oop: technology(
    {
      es: 'Programación orientada a objetos',
      en: 'Object-oriented programming',
    },
    'https://dev.java/learn/oop/',
  ),
  solid: technology(
    { es: 'Principios SOLID', en: 'SOLID principles' },
    'https://learn.microsoft.com/en-us/dotnet/architecture/modern-web-apps-azure/architectural-principles',
  ),
  relational: technology(
    {
      es: 'Diseño de bases de datos relacionales',
      en: 'Relational database design',
    },
    'https://www.postgresql.org/docs/current/ddl.html',
  ),
  testing: technology(
    { es: 'Pruebas automatizadas', en: 'Automated testing' },
    'https://playwright.dev/docs/best-practices',
  ),
  integrationTests: technology(
    {
      es: 'Pruebas de integración y regresión',
      en: 'Integration and regression testing',
    },
    'https://docs.spring.io/spring-framework/reference/testing/integration.html',
  ),
  integrations: technology(
    { es: 'Integraciones de sistemas', en: 'System integrations' },
    'https://docs.spring.io/spring-integration/reference/',
  ),
  versioning: technology(
    { es: 'Control de versiones', en: 'Version control' },
    'https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control',
    'git log --oneline',
  ),
  documentation: technology(
    { es: 'Documentación técnica', en: 'Technical documentation' },
    'https://developers.google.com/tech-writing',
  ),
  authentication: technology(
    {
      es: 'Autenticación y gestión de sesiones',
      en: 'Authentication and session management',
    },
    'https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html',
  ),
} satisfies Record<string, Technology>;

export type TechnologyId = keyof typeof technologies;
export type TechnologyCategoryId =
  | 'languages'
  | 'frameworks'
  | 'databases'
  | 'linux'
  | 'data'
  | 'ai'
  | 'games'
  | 'engineering';

export interface TechnologyCategory {
  id: TechnologyCategoryId;
  items: readonly TechnologyId[];
}

// References allow the same technology to appear in several areas without copying it.
export const technologyCategories: readonly TechnologyCategory[] = [
  {
    id: 'languages',
    items: [
      'python',
      'javascript',
      'typescript',
      'java',
      'sql',
      'html',
      'css',
      'bash',
      'cpp',
      'lua',
      'dart',
    ],
  },
  {
    id: 'frameworks',
    items: [
      'django',
      'drf',
      'flask',
      'spring',
      'maven',
      'node',
      'nest',
      'react',
      'mui',
      'vite',
      'flutter',
      'pandas',
      'numpy',
      'openpyxl',
      'streamlit',
      'playwright',
      'axios',
    ],
  },
  {
    id: 'databases',
    items: ['postgresql', 'oracle', 'mysql', 'sqlite', 'firebase'],
  },
  {
    id: 'linux',
    items: [
      'fedora',
      'ubuntu',
      'debian',
      'docker',
      'compose',
      'kubernetes',
      'nginx',
      'raspberry',
      'digitalocean',
      'contabo',
      'cloudflare',
      'ssh',
      'git',
      'github',
      'bash',
    ],
  },
  {
    id: 'data',
    items: [
      'sql',
      'postgresql',
      'pandas',
      'numpy',
      'powerbi',
      'excel',
      'openpyxl',
      'streamlit',
      'fabric',
      'azure',
      'aws',
      'databricks',
    ],
  },
  {
    id: 'ai',
    items: [
      'ollama',
      'qwen',
      'comfyui',
      'diffusion',
      'pytorch',
      'cuda',
      'piper',
      'codex',
      'opencode',
    ],
  },
  {
    id: 'games',
    items: [
      'unity',
      'unreal',
      'arduino',
      'esp32',
      'cpp',
      'lua',
      'paper',
      'gradle',
      'sqlite',
    ],
  },
  {
    id: 'engineering',
    items: [
      'rest',
      'soap',
      'grpc',
      'layers',
      'oop',
      'solid',
      'relational',
      'testing',
      'integrationTests',
      'integrations',
      'versioning',
      'documentation',
      'authentication',
    ],
  },
];
