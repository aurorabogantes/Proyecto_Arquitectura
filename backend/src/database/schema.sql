/* ============================================================
   SCRIPT COMPLETO — Base de datos InnovacionEducativa
   ============================================================
   Incluye:
   1) Script original de Kevin González (diseño de BD, cursos,
      lecciones, recursos multimedia, gamificación)
   2) Script complementario de José Esquivel (seguimiento del
      progreso por estudiante y reportes para docentes/padres)
   3) Datos iniciales de gamificación (Niveles, Insignias,
      Desafíos) y estudiantados de ejemplo
   ============================================================ */

/* ============================================================
   PARTE 1 — Script original de Kevin González
   (diseño de base de datos, RF-04 a RF-10, RF-16 a RF-18)
   ============================================================ */

/* Crear base de datos */

CREATE DATABASE InnovacionEducativa;
GO

USE InnovacionEducativa;
GO

/* Crear tablas para la inserción de datos */
CREATE TABLE Cursos(
    CursoId INT IDENTITY(1,1) PRIMARY KEY,
    Titulo VARCHAR(100) NOT NULL,
    Descripcion VARCHAR(500),
    Nivel VARCHAR(30),
    RangoEdad VARCHAR(30),
    Categoria VARCHAR(50),
    Puntos INT,
    Duracion VARCHAR(30),
    Thumbnail VARCHAR(300)
);

CREATE TABLE Lecciones(
    LeccionId INT IDENTITY(1,1) PRIMARY KEY,
    CursoId INT NOT NULL,
    Titulo VARCHAR(100),
    Duracion VARCHAR(20),
    Tipo VARCHAR(30),

    CONSTRAINT FK_Lecciones_Cursos
        FOREIGN KEY(CursoId)
        REFERENCES Cursos(CursoId)
);

CREATE TABLE RecursosMultimedia(
    RecursoId INT IDENTITY PRIMARY KEY,
    CursoId INT,
    Tipo VARCHAR(20),
    Url VARCHAR(300),
    Titulo VARCHAR(100),

    FOREIGN KEY(CursoId)
    REFERENCES Cursos(CursoId)
);

CREATE TABLE Estudiantes(

    EstudianteId INT IDENTITY PRIMARY KEY,

    Nombre VARCHAR(100),

    Avatar VARCHAR(20),

    FechaRegistro DATE,

    Puntos INT DEFAULT 0,

    Racha INT DEFAULT 0

);

CREATE TABLE EstudianteCurso(

    Id INT IDENTITY PRIMARY KEY,

    EstudianteId INT,

    CursoId INT,

    FechaMatricula DATE,

    Completado BIT DEFAULT 0,

    Porcentaje DECIMAL(5,2),

    FOREIGN KEY(EstudianteId)
        REFERENCES Estudiantes(EstudianteId),

    FOREIGN KEY(CursoId)
        REFERENCES Cursos(CursoId)

);

CREATE TABLE Insignias(

    InsigniaId INT IDENTITY PRIMARY KEY,

    Nombre VARCHAR(100),

    Descripcion VARCHAR(300),

    Icono VARCHAR(20),

    PuntosRequeridos INT,

    Color VARCHAR(20),

    Especial VARCHAR(50)

);

CREATE TABLE EstudianteInsignia(

    Id INT IDENTITY PRIMARY KEY,

    EstudianteId INT,

    InsigniaId INT,

    FechaObtencion DATE,

    FOREIGN KEY(EstudianteId)
        REFERENCES Estudiantes(EstudianteId),

    FOREIGN KEY(InsigniaId)
        REFERENCES Insignias(InsigniaId)

);

CREATE TABLE Desafios(

    DesafioId INT IDENTITY PRIMARY KEY,

    Titulo VARCHAR(100),

    Descripcion VARCHAR(300),

    Icono VARCHAR(20),

    Recompensa INT,

    Tipo VARCHAR(20),

    Objetivo INT,

    Expira VARCHAR(30)

);

CREATE TABLE ProgresoDesafio(

    Id INT IDENTITY PRIMARY KEY,

    EstudianteId INT,

    DesafioId INT,

    Progreso INT,

    Completado BIT,

    FOREIGN KEY(EstudianteId)
        REFERENCES Estudiantes(EstudianteId),

    FOREIGN KEY(DesafioId)
        REFERENCES Desafios(DesafioId)

);

CREATE TABLE Niveles(

    NivelId INT IDENTITY PRIMARY KEY,

    Nombre VARCHAR(50),

    MinPuntos INT,

    MaxPuntos INT,

    Icono VARCHAR(20),

    Color VARCHAR(20)

);

/* Creación de indices */

CREATE INDEX IX_Lecciones_CursoId
ON Lecciones(CursoId);

CREATE INDEX IX_Recursos_CursoId
ON RecursosMultimedia(CursoId);

CREATE INDEX IX_EstudianteCurso_Estudiante
ON EstudianteCurso(EstudianteId);

CREATE INDEX IX_EstudianteCurso_Curso
ON EstudianteCurso(CursoId);

/* Insertar datos de los cursos disponibles */

INSERT INTO Cursos
(Titulo,Descripcion,Nivel,RangoEdad,Categoria,Puntos,Duracion,Thumbnail)

VALUES
(
'Aventura con Scratch',
'Aprende a programar creando animaciones y juegos con bloques visuales coloridos.',
'Principiante',
'6-9 años',
'Bloques',
100,
'4 semanas',
'https://placehold.co/400x250/FF6B6B/ffffff?text=Scratch'
);

INSERT INTO Cursos
(Titulo, Descripcion, Nivel, RangoEdad, Categoria, Puntos, Duracion, Thumbnail)
VALUES
(
'Python para Niños',
'Da tus primeros pasos con el lenguaje de programación más popular del mundo.',
'Intermedio',
'10-13 años',
'Código',
200,
'6 semanas',
'https://placehold.co/400x250/4ECDC4/ffffff?text=Python'
);

INSERT INTO Cursos
(Titulo, Descripcion, Nivel, RangoEdad, Categoria, Puntos, Duracion, Thumbnail)
VALUES
(
'HTML y CSS: Mi primera web',
'Crea tu primera página web con colores, imágenes y texto.',
'Principiante',
'9-12 años',
'Web',
150,
'5 semanas',
'https://placehold.co/400x250/45B7D1/ffffff?text=HTML+CSS'
);

INSERT INTO Cursos
(Titulo, Descripcion, Nivel, RangoEdad, Categoria, Puntos, Duracion, Thumbnail)
VALUES
(
'Minecraft: Programación con Bloques',
'Usa el mundo de Minecraft para aprender lógica de programación.',
'Principiante',
'8-12 años',
'Juegos',
120,
'3 semanas',
'https://placehold.co/400x250/96CEB4/ffffff?text=Minecraft'
);

INSERT INTO Cursos
(Titulo, Descripcion, Nivel, RangoEdad, Categoria, Puntos, Duracion, Thumbnail)
VALUES
(
'Robótica Básica',
'Aprende los fundamentos de la robótica y la electrónica de forma divertida.',
'Avanzado',
'12-15 años',
'Robótica',
300,
'8 semanas',
'https://placehold.co/400x250/FFEAA7/333333?text=Robotica'
);

INSERT INTO Cursos
(Titulo, Descripcion, Nivel, RangoEdad, Categoria, Puntos, Duracion, Thumbnail)
VALUES
(
'Lógica y Algoritmos',
'Desarrolla el pensamiento computacional resolviendo puzzles y retos.',
'Principiante',
'7-10 años',
'Pensamiento',
80,
'2 semanas',
'https://placehold.co/400x250/DDA0DD/ffffff?text=Logica'
);

/* Insertar lecciones dentro de los cursos */

INSERT INTO Lecciones (CursoId,Titulo,Duracion,Tipo) VALUES
(1,'Conoce la interfaz','10 min','video'),
(1,'Tu primer sprite','15 min','interactive'),
(1,'Movimiento básico','12 min','video'),
(1,'Reto: Crea tu animación','20 min','challenge');

INSERT INTO Lecciones (CursoId,Titulo,Duracion,Tipo) VALUES
(2,'¿Qué es Python?','8 min','video'),
(2,'Variables y tipos','20 min','interactive'),
(2,'Condicionales','18 min','video'),
(2,'Bucles','22 min','interactive');

INSERT INTO Lecciones (CursoId,Titulo,Duracion,Tipo) VALUES
(3,'Estructura HTML','12 min','video'),
(3,'Estilos con CSS','15 min','interactive'),
(3,'Colores y fuentes','10 min','video');

INSERT INTO Lecciones (CursoId,Titulo,Duracion,Tipo) VALUES
(4,'Comandos básicos','10 min','video'),
(4,'Automatización con bloques','15 min','interactive'),
(4,'Proyecto: Construcción automática','25 min','project');

INSERT INTO Lecciones (CursoId,Titulo,Duracion,Tipo) VALUES
(5,'Componentes electrónicos','20 min','video'),
(5,'Circuitos simples','25 min','interactive'),
(5,'Tu primer robot','30 min','project');

INSERT INTO Lecciones (CursoId,Titulo,Duracion,Tipo) VALUES
(6,'¿Qué es un algoritmo?','8 min','video'),
(6,'Secuencias paso a paso','10 min','interactive'),
(6,'Reto: El laberinto','15 min','challenge');

/* Insertar contenido multimedia dentro de los cursos */

INSERT INTO RecursosMultimedia
(CursoId,Tipo,Url,Titulo)
VALUES
(1,'video','https://www.youtube.com/embed/jXUZaf5D12A','Introducción a Scratch'),

(1,'image',
'https://placehold.co/600x400/FF6B6B/ffffff?text=Interfaz+Scratch',
'Interfaz de Scratch');

INSERT INTO RecursosMultimedia
(CursoId,Tipo,Url,Titulo)
VALUES
(2,'video','https://www.youtube.com/embed/Bz2HKfOmRi8','Python básico para niños'),

(2,'image',
'https://placehold.co/600x400/4ECDC4/ffffff?text=Codigo+Python',
'Código Python');

INSERT INTO RecursosMultimedia
(CursoId,Tipo,Url,Titulo)
VALUES
(3,'video',
'https://www.youtube.com/embed/salY_Sm6mv4',
'HTML para principiantes');

INSERT INTO RecursosMultimedia
(CursoId,Tipo,Url,Titulo)
VALUES
(4,'video',
'https://www.youtube.com/embed/4XpnKHJAok8',
'Code.org con Minecraft'),

(4,'image',
'https://placehold.co/600x400/96CEB4/333333?text=Minecraft+Bloques',
'Bloques de programación');

INSERT INTO RecursosMultimedia
(CursoId,Tipo,Url,Titulo)
VALUES
(5,'video',
'https://www.youtube.com/embed/Pt2cqF9fSgg',
'Introducción a robótica'),

(5,'image',
'https://placehold.co/600x400/FFEAA7/333333?text=Robot',
'Componentes del robot');

INSERT INTO RecursosMultimedia
(CursoId,Tipo,Url,Titulo)
VALUES
(6,'video',
'https://www.youtube.com/embed/FC1XWRME4kQ',
'Pensamiento computacional'),

(6,'image',
'https://placehold.co/600x400/DDA0DD/ffffff?text=Algoritmo',
'Diagrama de algoritmo');

/* Verificar los datos que se han incluido */

SELECT * FROM Cursos;

SELECT * FROM Lecciones;

SELECT * FROM RecursosMultimedia;

/* ============================================================
   PARTE 2 — Script complementario de Jose Esquivel
   Seguimiento del progreso por estudiante 
   Reportes para docentes y padres 
   ============================================================ */

/* Registra el avance de un estudiante lección por lección,
   incluyendo el resultado de la evaluación si la lección la tiene. */
CREATE TABLE ProgresoLeccion(
    Id INT IDENTITY(1,1) PRIMARY KEY,
    EstudianteId INT NOT NULL,
    LeccionId INT NOT NULL,
    Completado BIT DEFAULT 0,
    Puntuacion DECIMAL(5,2) NULL,
    FechaCompletado DATETIME NULL,

    CONSTRAINT FK_ProgresoLeccion_Estudiante
        FOREIGN KEY (EstudianteId) REFERENCES Estudiantes(EstudianteId),

    CONSTRAINT FK_ProgresoLeccion_Leccion
        FOREIGN KEY (LeccionId) REFERENCES Lecciones(LeccionId),

    CONSTRAINT UQ_ProgresoLeccion_EstudianteLeccion
        UNIQUE (EstudianteId, LeccionId)
);
GO

/* Registra minutos de uso de la plataforma por día (RF-13, RF-23). */
CREATE TABLE SesionUso(
    Id INT IDENTITY(1,1) PRIMARY KEY,
    EstudianteId INT NOT NULL,
    Fecha DATE NOT NULL,
    MinutosUso INT DEFAULT 0,

    CONSTRAINT FK_SesionUso_Estudiante
        FOREIGN KEY (EstudianteId) REFERENCES Estudiantes(EstudianteId)
);
GO

CREATE INDEX IX_ProgresoLeccion_Estudiante ON ProgresoLeccion(EstudianteId);
CREATE INDEX IX_ProgresoLeccion_Leccion ON ProgresoLeccion(LeccionId);
CREATE INDEX IX_SesionUso_Estudiante ON SesionUso(EstudianteId);
GO

/* Datos de ejemplo para poder probar el módulo de una vez.
   Como este script ya corre después de que Kevin insertó sus
   cursos/lecciones en la Parte 1, aquí solo se agregan estudiantes,
   matrícula y progreso de ejemplo (no duplica lo de arriba). */

-- Un par de estudiantes de prueba (si no tienes ya alguno)
IF NOT EXISTS (SELECT 1 FROM Estudiantes)
BEGIN
    INSERT INTO Estudiantes (Nombre, Avatar, FechaRegistro, Puntos, Racha)
    VALUES ('Ana Pérez', '🦊', '2025-01-15', 350, 3),
           ('Luis Rojas', '🐼', '2025-02-01', 120, 1);
END
GO

-- Matricular al estudiante 1 en el curso 1 (Scratch)
IF NOT EXISTS (SELECT 1 FROM EstudianteCurso WHERE EstudianteId = 1 AND CursoId = 1)
BEGIN
    INSERT INTO EstudianteCurso (EstudianteId, CursoId, FechaMatricula, Completado, Porcentaje)
    VALUES (1, 1, '2025-03-01', 0, 50.00);
END
GO

-- Progreso de lecciones del curso 1 para el estudiante 1
INSERT INTO ProgresoLeccion (EstudianteId, LeccionId, Completado, Puntuacion, FechaCompletado)
SELECT 1, LeccionId, 1, 90, GETDATE()
FROM Lecciones
WHERE CursoId = 1 AND LeccionId IN (
    SELECT MIN(LeccionId) FROM Lecciones WHERE CursoId = 1
);
GO

-- Tiempo de uso de ejemplo
INSERT INTO SesionUso (EstudianteId, Fecha, MinutosUso)
VALUES (1, CAST(GETDATE() AS DATE), 25),
       (1, CAST(DATEADD(DAY, -1, GETDATE()) AS DATE), 15);
GO

/* Verificar los datos nuevos */

SELECT * FROM ProgresoLeccion;

SELECT * FROM SesionUso;

/* ============================================================
   PARTE 3 — Datos iniciales de gamificación
   (Niveles, Insignias, Desafíos)
   ============================================================ */

INSERT INTO Niveles (Nombre, MinPuntos, MaxPuntos, Icono, Color)
VALUES
    ('Explorador',  0,    199,  '🌱', '#6BCB77'),
    ('Aprendiz',    200,  499,  '⚡', '#FFD93D'),
    ('Ninja',       500,  999,  '🥷', '#FF6B6B'),
    ('Maestro',     1000, 99999,'🚀', '#4ECDC4');
GO

INSERT INTO Insignias (Nombre, Descripcion, Icono, PuntosRequeridos, Color, Especial)
VALUES
    ('Primera Estrella', 'Completaste tu primer curso',     '⭐', 100,  '#FFD700', NULL),
    ('Explorador',       'Inscrito en 3 cursos',           '🧭', 0,    '#4ECDC4', 'courses_3'),
    ('Código Ninja',     'Acumula 500 puntos',             '🥷', 500,  '#FF6B6B', NULL),
    ('Super Aprendiz',   'Acumula 1000 puntos',            '🚀', 1000, '#45B7D1', NULL),
    ('Maestro Web',      'Completa el curso de HTML y CSS','🌐', 0,    '#96CEB4', 'course_3'),
    ('Programador Pro',  'Completa todos los cursos',      '💻', 0,    '#9B59B6', 'all_courses'),
    ('Racha de Fuego',   'Aprende 7 días seguidos',        '🔥', 0,    '#E74C3C', 'streak_7'),
    ('Creador',          'Completa un proyecto',           '🎨', 0,    '#F39C12', 'project');
GO

INSERT INTO Desafios (Titulo, Descripcion, Icono, Recompensa, Tipo, Objetivo, Expira)
VALUES
    ('¡Desafío Relámpago!',   'Inscríbete en 2 cursos hoy',               '⚡', 50,  'daily',  2, '24 horas'),
    ('Semana de Scratch',      'Completa el curso de Scratch esta semana', '🎮', 200, 'weekly', 1, '5 días'),
    ('Maratón de Aprendizaje', 'Completa 5 lecciones esta semana',         '📚', 100, 'weekly', 5, '5 días'),
    ('Quiz Master',            'Responde 3 trivias correctamente',         '🧠', 75,  'daily',  3, '24 horas');
GO

/* Verificar datos de gamificación */

SELECT * FROM Niveles;
SELECT * FROM Insignias;
SELECT * FROM Desafios;
