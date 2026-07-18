// Fuente de datos mock. Para usar DB: reemplaza estos arrays con queries en los services.

const courses = [
  {
    id: 1,
    title: 'Aventura con Scratch',
    description: 'Aprende a programar creando animaciones y juegos con bloques visuales coloridos.',
    level: 'Principiante',
    ageRange: '6-9 años',
    thumbnail: 'https://placehold.co/400x250/FF6B6B/ffffff?text=Scratch',
    category: 'Bloques',
    points: 100,
    duration: '4 semanas',
    lessons: [
      { id: 1, title: 'Conoce la interfaz', duration: '10 min', type: 'video' },
      { id: 2, title: 'Tu primer sprite', duration: '15 min', type: 'interactive' },
      { id: 3, title: 'Movimiento básico', duration: '12 min', type: 'video' },
      { id: 4, title: 'Reto: Crea tu animación', duration: '20 min', type: 'challenge' }
    ],
    mediaItems: [
      { type: 'video', url: 'https://www.youtube.com/embed/jXUZaf5D12A', title: 'Introducción a Scratch' },
      { type: 'image', url: 'https://placehold.co/600x400/FF6B6B/ffffff?text=Interfaz+Scratch', title: 'Interfaz de Scratch' }
    ]
  },
  {
    id: 2,
    title: 'Python para Niños',
    description: 'Da tus primeros pasos con el lenguaje de programación más popular del mundo.',
    level: 'Intermedio',
    ageRange: '10-13 años',
    thumbnail: 'https://placehold.co/400x250/4ECDC4/ffffff?text=Python',
    category: 'Código',
    points: 200,
    duration: '6 semanas',
    lessons: [
      { id: 1, title: '¿Qué es Python?', duration: '8 min', type: 'video' },
      { id: 2, title: 'Variables y tipos', duration: '20 min', type: 'interactive' },
      { id: 3, title: 'Condicionales', duration: '18 min', type: 'video' },
      { id: 4, title: 'Bucles', duration: '22 min', type: 'interactive' }
    ],
    mediaItems: [
      { type: 'video', url: 'https://www.youtube.com/embed/Bz2HKfOmRi8', title: 'Python básico para niños' },
      { type: 'image', url: 'https://placehold.co/600x400/4ECDC4/ffffff?text=Codigo+Python', title: 'Código Python' }
    ]
  },
  {
    id: 3,
    title: 'HTML y CSS: Mi primera web',
    description: 'Crea tu primera página web con colores, imágenes y texto.',
    level: 'Principiante',
    ageRange: '9-12 años',
    thumbnail: 'https://placehold.co/400x250/45B7D1/ffffff?text=HTML+CSS',
    category: 'Web',
    points: 150,
    duration: '5 semanas',
    lessons: [
      { id: 1, title: 'Estructura HTML', duration: '12 min', type: 'video' },
      { id: 2, title: 'Estilos con CSS', duration: '15 min', type: 'interactive' },
      { id: 3, title: 'Colores y fuentes', duration: '10 min', type: 'video' }
    ],
    mediaItems: [
      { type: 'video', url: 'https://www.youtube.com/embed/salY_Sm6mv4', title: 'HTML para principiantes' }
    ]
  },
  {
    id: 4,
    title: 'Minecraft: Programación con Bloques',
    description: 'Usa el mundo de Minecraft para aprender lógica de programación.',
    level: 'Principiante',
    ageRange: '8-12 años',
    thumbnail: 'https://placehold.co/400x250/96CEB4/ffffff?text=Minecraft',
    category: 'Juegos',
    points: 120,
    duration: '3 semanas',
    lessons: [
      { id: 1, title: 'Comandos básicos', duration: '10 min', type: 'video' },
      { id: 2, title: 'Automatización con bloques', duration: '15 min', type: 'interactive' },
      { id: 3, title: 'Proyecto: Construcción automática', duration: '25 min', type: 'project' }
    ],
    mediaItems: [
      { type: 'video', url: 'https://www.youtube.com/embed/4XpnKHJAok8', title: 'Code.org con Minecraft' },
      { type: 'image', url: 'https://placehold.co/600x400/96CEB4/333333?text=Minecraft+Bloques', title: 'Bloques de programación' }
    ]
  },
  {
    id: 5,
    title: 'Robótica Básica',
    description: 'Aprende los fundamentos de la robótica y la electrónica de forma divertida.',
    level: 'Avanzado',
    ageRange: '12-15 años',
    thumbnail: 'https://placehold.co/400x250/FFEAA7/333333?text=Robotica',
    category: 'Robótica',
    points: 300,
    duration: '8 semanas',
    lessons: [
      { id: 1, title: 'Componentes electrónicos', duration: '20 min', type: 'video' },
      { id: 2, title: 'Circuitos simples', duration: '25 min', type: 'interactive' },
      { id: 3, title: 'Tu primer robot', duration: '30 min', type: 'project' }
    ],
    mediaItems: [
      { type: 'video', url: 'https://www.youtube.com/embed/Pt2cqF9fSgg', title: 'Introducción a robótica' },
      { type: 'image', url: 'https://placehold.co/600x400/FFEAA7/333333?text=Robot', title: 'Componentes del robot' }
    ]
  },
  {
    id: 6,
    title: 'Lógica y Algoritmos',
    description: 'Desarrolla el pensamiento computacional resolviendo puzzles y retos.',
    level: 'Principiante',
    ageRange: '7-10 años',
    thumbnail: 'https://placehold.co/400x250/DDA0DD/ffffff?text=Logica',
    category: 'Pensamiento',
    points: 80,
    duration: '2 semanas',
    lessons: [
      { id: 1, title: '¿Qué es un algoritmo?', duration: '8 min', type: 'video' },
      { id: 2, title: 'Secuencias paso a paso', duration: '10 min', type: 'interactive' },
      { id: 3, title: 'Reto: El laberinto', duration: '15 min', type: 'challenge' }
    ],
    mediaItems: [
      { type: 'video', url: 'https://www.youtube.com/embed/FC1XWRME4kQ', title: 'Pensamiento computacional' },
      { type: 'image', url: 'https://placehold.co/600x400/DDA0DD/ffffff?text=Algoritmo', title: 'Diagrama de algoritmo' }
    ]
  }
];

const badges = [
  { id: 1, name: 'Primera Estrella', description: 'Completaste tu primer curso', icon: '⭐', pointsRequired: 100, color: '#FFD700' },
  { id: 2, name: 'Explorador', description: 'Inscrito en 3 cursos', icon: '🧭', pointsRequired: 0, special: 'courses_3', color: '#4ECDC4' },
  { id: 3, name: 'Código Ninja', description: 'Acumula 500 puntos', icon: '🥷', pointsRequired: 500, color: '#FF6B6B' },
  { id: 4, name: 'Super Aprendiz', description: 'Acumula 1000 puntos', icon: '🚀', pointsRequired: 1000, color: '#45B7D1' },
  { id: 5, name: 'Maestro Web', description: 'Completa el curso de HTML y CSS', icon: '🌐', pointsRequired: 0, special: 'course_3', color: '#96CEB4' },
  { id: 6, name: 'Programador Pro', description: 'Completa todos los cursos', icon: '💻', pointsRequired: 0, special: 'all_courses', color: '#9B59B6' },
  { id: 7, name: 'Racha de Fuego', description: 'Aprende 7 días seguidos', icon: '🔥', pointsRequired: 0, special: 'streak_7', color: '#E74C3C' },
  { id: 8, name: 'Creador', description: 'Completa un proyecto', icon: '🎨', pointsRequired: 0, special: 'project', color: '#F39C12' }
];

const challenges = [
  {
    id: 1,
    title: '¡Desafío Relámpago!',
    description: 'Inscríbete en 2 cursos hoy',
    icon: '⚡',
    reward: 50,
    type: 'daily',
    target: 2,
    expiresIn: '24 horas'
  },
  {
    id: 2,
    title: 'Semana de Scratch',
    description: 'Completa el curso de Scratch esta semana',
    icon: '🎮',
    reward: 200,
    type: 'weekly',
    target: 1,
    expiresIn: '5 días'
  },
  {
    id: 3,
    title: 'Explorador de Cursos',
    description: 'Visita 4 cursos diferentes',
    icon: '🗺️',
    reward: 75,
    type: 'weekly',
    target: 4,
    expiresIn: '6 días'
  },
  {
    id: 4,
    title: 'Maestro Python',
    description: 'Inscríbete y explora 3 cursos de código',
    icon: '🐍',
    reward: 150,
    type: 'monthly',
    target: 3,
    expiresIn: '20 días'
  }
];

const levels = [
  { level: 1, name: 'Aprendiz',    minPoints: 0,    maxPoints: 299,      icon: '🌱', color: '#27AE60' },
  { level: 2, name: 'Explorador',  minPoints: 300,  maxPoints: 699,      icon: '🌿', color: '#2ECC71' },
  { level: 3, name: 'Aventurero',  minPoints: 700,  maxPoints: 1299,     icon: '⚔️',  color: '#3498DB' },
  { level: 4, name: 'Héroe',       minPoints: 1300, maxPoints: 2199,     icon: '🦸', color: '#9B59B6' },
  { level: 5, name: 'Leyenda',     minPoints: 2200, maxPoints: Infinity, icon: '👑', color: '#F39C12' }
];

// Usuario mock — cuando integres DB, este objeto vendrá de una query por ID de usuario autenticado
const mockUser = {
  id: 1,
  name: 'Alex',
  avatar: '🦊',
  points: 350,
  enrolledCourses: [1, 2],
  completedCourses: [],
  earnedBadges: [1, 2],
  challengeProgress: { 1: 1, 3: 2 },
  streak: 3,
  joinedDate: '2024-01-15'
};

module.exports = { courses, badges, challenges, levels, mockUser };