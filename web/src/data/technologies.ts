import type { Language } from '../lib/routes';

export interface Technology {
  name: string | Record<Language, string>;
  command?: string;
}

function technology(name: Technology['name'], command?: string): Technology {
  return { name, command };
}

// Camilo's supplied inventory. No proficiency, employment or ranking is inferred.
export const technologies = {
  python: technology('Python', 'python3 --version'),
  javascript: technology('JavaScript'),
  typescript: technology('TypeScript', 'tsc --version'),
  java: technology('Java', 'java -version'),
  sql: technology('SQL'),
  html: technology('HTML5'),
  css: technology('CSS3'),
  bash: technology('Bash / Shell', 'echo $SHELL'),
  cpp: technology('C++'),
  lua: technology('Lua'),
  dart: technology('Dart'),
  django: technology('Django', 'python3 -m django --version'),
  drf: technology('Django REST Framework'),
  flask: technology('Flask'),
  spring: technology('Spring Boot'),
  maven: technology('Maven', 'mvn --version'),
  node: technology('Node.js', 'node --version'),
  nest: technology('NestJS'),
  react: technology('React'),
  mui: technology('Material UI (MUI)'),
  vite: technology('Vite'),
  flutter: technology('Flutter'),
  pandas: technology('pandas'),
  numpy: technology('NumPy'),
  playwright: technology('Playwright'),
  axios: technology('Axios'),
  postgresql: technology('PostgreSQL', 'psql --version'),
  oracle: technology('Oracle Database 12c'),
  mysql: technology('MySQL'),
  sqlite: technology('SQLite'),
  firebase: technology('Firebase / Cloud Firestore'),
  fedora: technology('Fedora Linux', 'uname -a'),
  ubuntu: technology('Ubuntu', 'uname -a'),
  debian: technology('Debian', 'uname -a'),
  docker: technology('Docker', 'docker ps'),
  compose: technology('Docker Compose', 'docker compose ps'),
  kubernetes: technology('Kubernetes', 'kubectl get pods'),
  nginx: technology('Nginx', 'nginx -v'),
  raspberry: technology('Raspberry Pi'),
  digitalocean: technology('DigitalOcean'),
  contabo: technology('Contabo VPS'),
  cloudflare: technology('Cloudflare Tunnel'),
  ssh: technology('SSH', 'ssh -V'),
  git: technology('Git', 'git log --oneline'),
  github: technology('GitHub'),
  powerbi: technology('Power BI'),
  excel: technology('Excel'),
  ollama: technology('Ollama', 'ollama list'),
  qwen: technology('Qwen / Qwen3'),
  comfyui: technology('ComfyUI'),
  diffusion: technology('Stable Diffusion'),
  pytorch: technology('PyTorch'),
  cuda: technology('NVIDIA CUDA', 'nvcc --version'),
  piper: technology('Piper TTS'),
  codex: technology('Codex'),
  opencode: technology('OpenCode'),
  unity: technology('Unity'),
  unreal: technology('Unreal Engine'),
  arduino: technology('Arduino'),
  esp32: technology('ESP32'),
  paper: technology('Paper / Bukkit API'),
  gradle: technology('Gradle', 'gradle --version'),
  rest: technology('REST'),
  soap: technology('SOAP'),
  grpc: technology('gRPC'),
  layers: technology({
    es: 'Arquitectura por capas',
    en: 'Layered architecture',
  }),
  oop: technology({
    es: 'Programación orientada a objetos',
    en: 'Object-oriented programming',
  }),
  solid: technology({ es: 'Principios SOLID', en: 'SOLID principles' }),
  relational: technology({
    es: 'Diseño de bases de datos relacionales',
    en: 'Relational database design',
  }),
  testing: technology({ es: 'Pruebas automatizadas', en: 'Automated testing' }),
  integrationTests: technology({
    es: 'Pruebas de integración y regresión',
    en: 'Integration and regression testing',
  }),
  integrations: technology({
    es: 'Integraciones de sistemas',
    en: 'System integrations',
  }),
  versioning: technology(
    { es: 'Control de versiones', en: 'Version control' },
    'git log --oneline',
  ),
  documentation: technology({
    es: 'Documentación técnica',
    en: 'Technical documentation',
  }),
  authentication: technology({
    es: 'Autenticación y gestión de sesiones',
    en: 'Authentication and session management',
  }),
} satisfies Record<string, Technology>;

export type TechnologyId = keyof typeof technologies;

// Tarea 02 explicitly prioritizes these areas. This is editorial order, not a rating.
export const mainStackAreas = [
  { id: 'python', items: ['python', 'django', 'drf'] },
  { id: 'web', items: ['javascript', 'typescript', 'react'] },
  { id: 'java', items: ['java', 'spring'] },
  { id: 'databases', items: ['sql', 'postgresql', 'oracle'] },
  { id: 'linux', items: ['fedora', 'docker', 'compose'] },
] as const satisfies readonly { id: string; items: readonly TechnologyId[] }[];

// Only the learning/initial-exploration entries explicitly described by Camilo.
export const explorationIds: readonly TechnologyId[] = ['spring', 'lua'];
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
    items: ['sql', 'postgresql', 'pandas', 'numpy', 'powerbi', 'excel'],
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
