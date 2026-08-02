-- =====================================================
-- Migración: Tablas de Gamificación y Media
-- Ejecutar en la base de datos InnovacionEducativa
-- =====================================================

-- Agregar columnas de gamificación a Estudiantes (si no existen)
IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'Puntos' AND Object_ID = Object_ID('Estudiantes'))
    ALTER TABLE Estudiantes ADD Puntos INT DEFAULT 0;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'Racha' AND Object_ID = Object_ID('Estudiantes'))
    ALTER TABLE Estudiantes ADD Racha INT DEFAULT 0;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = 'FechaIngreso' AND Object_ID = Object_ID('Estudiantes'))
    ALTER TABLE Estudiantes ADD FechaIngreso DATE DEFAULT GETDATE();

-- Niveles
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Niveles')
BEGIN
    CREATE TABLE Niveles (
        NivelId   INT PRIMARY KEY IDENTITY,
        Nivel     INT           NOT NULL,
        Nombre    NVARCHAR(100) NOT NULL,
        Descripcion NVARCHAR(255),
        PuntosMin INT NOT NULL DEFAULT 0,
        PuntosMax INT NOT NULL DEFAULT 9999,
        Icono     NVARCHAR(50),
        Color     NVARCHAR(20)
    );
    INSERT INTO Niveles (Nivel, Nombre, Descripcion, PuntosMin, PuntosMax, Icono, Color) VALUES
        (1, 'Explorador',  'Estás comenzando tu aventura',   0,    199,  N'🌱', '#6BCB77'),
        (2, 'Aprendiz',   'Estás aprendiendo rápido',       200,  499,  N'⚡', '#FFD93D'),
        (3, 'Ninja',      'Eres un ninja del código',       500,  999,  N'🥷', '#FF6B6B'),
        (4, 'Maestro',    'Dominas el mundo digital',       1000, 99999, N'🚀', '#4ECDC4');
END

-- Insignias
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Insignias')
BEGIN
    CREATE TABLE Insignias (
        InsigniaId      INT PRIMARY KEY IDENTITY,
        Nombre          NVARCHAR(100) NOT NULL,
        Descripcion     NVARCHAR(255),
        Icono           NVARCHAR(50),
        PuntosRequeridos INT DEFAULT 0,
        Especial        NVARCHAR(100) NULL,
        Color           NVARCHAR(20)
    );
    INSERT INTO Insignias (Nombre, Descripcion, Icono, PuntosRequeridos, Especial, Color) VALUES
        (N'Primera Estrella', N'Completaste tu primer curso',     N'⭐', 100,  NULL,         '#FFD700'),
        (N'Explorador',       N'Inscrito en 3 cursos',           N'🧭', 0,    'courses_3',  '#4ECDC4'),
        (N'Código Ninja',     N'Acumula 500 puntos',             N'🥷', 500,  NULL,         '#FF6B6B'),
        (N'Super Aprendiz',   N'Acumula 1000 puntos',            N'🚀', 1000, NULL,         '#45B7D1'),
        (N'Maestro Web',      N'Completa el curso de HTML y CSS',N'🌐', 0,    'course_3',   '#96CEB4'),
        (N'Programador Pro',  N'Completa todos los cursos',      N'💻', 0,    'all_courses','#9B59B6'),
        (N'Racha de Fuego',   N'Aprende 7 días seguidos',        N'🔥', 0,    'streak_7',   '#E74C3C'),
        (N'Creador',          N'Completa un proyecto',           N'🎨', 0,    'project',    '#F39C12');
END

-- Retos
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Retos')
BEGIN
    CREATE TABLE Retos (
        RetoId      INT PRIMARY KEY IDENTITY,
        Titulo      NVARCHAR(100) NOT NULL,
        Descripcion NVARCHAR(255),
        Icono       NVARCHAR(50),
        Recompensa  INT DEFAULT 0,
        Tipo        NVARCHAR(50),
        Meta        INT DEFAULT 1,
        ExpiraEn    NVARCHAR(50)
    );
    INSERT INTO Retos (Titulo, Descripcion, Icono, Recompensa, Tipo, Meta, ExpiraEn) VALUES
        (N'¡Desafío Relámpago!',      N'Inscríbete en 2 cursos hoy',                N'⚡', 50,  'daily',  2, N'24 horas'),
        (N'Semana de Scratch',         N'Completa el curso de Scratch esta semana',  N'🎮', 200, 'weekly', 1, N'5 días'),
        (N'Maratón de Aprendizaje',    N'Completa 5 lecciones esta semana',          N'📚', 100, 'weekly', 5, N'5 días'),
        (N'Quiz Master',               N'Responde 3 trivias correctamente',          N'🧠', 75,  'daily',  3, N'24 horas');
END

-- EstudianteInsignia
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'EstudianteInsignia')
BEGIN
    CREATE TABLE EstudianteInsignia (
        Id           INT PRIMARY KEY IDENTITY,
        EstudianteId INT NOT NULL,
        InsigniaId   INT NOT NULL,
        FechaObtenida DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (EstudianteId) REFERENCES Estudiantes(EstudianteId),
        FOREIGN KEY (InsigniaId)   REFERENCES Insignias(InsigniaId)
    );
END

-- EstudianteReto
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'EstudianteReto')
BEGIN
    CREATE TABLE EstudianteReto (
        Id           INT PRIMARY KEY IDENTITY,
        EstudianteId INT NOT NULL,
        RetoId       INT NOT NULL,
        Progreso     INT DEFAULT 0,
        Completado   BIT DEFAULT 0,
        FOREIGN KEY (EstudianteId) REFERENCES Estudiantes(EstudianteId),
        FOREIGN KEY (RetoId)       REFERENCES Retos(RetoId)
    );
END

-- MediaItems
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'MediaItems')
BEGIN
    CREATE TABLE MediaItems (
        MediaId  INT PRIMARY KEY IDENTITY,
        CursoId  INT NULL,
        Tipo     NVARCHAR(50)  NOT NULL,
        Url      NVARCHAR(500) NOT NULL,
        Titulo   NVARCHAR(200),
        FOREIGN KEY (CursoId) REFERENCES Cursos(CursoId)
    );
    INSERT INTO MediaItems (CursoId, Tipo, Url, Titulo) VALUES
        (1, 'video', 'https://www.youtube.com/embed/jXUZaf5D12A', N'Introducción a Scratch'),
        (1, 'image', 'https://placehold.co/600x400/FF6B6B/ffffff?text=Interfaz+Scratch', N'Interfaz de Scratch'),
        (2, 'video', 'https://www.youtube.com/embed/Bz2HKfOmRi8', N'Python básico para niños'),
        (2, 'image', 'https://placehold.co/600x400/4ECDC4/ffffff?text=Codigo+Python', N'Código Python'),
        (3, 'video', 'https://www.youtube.com/embed/salY_Sm6mv4', N'HTML para principiantes'),
        (4, 'video', 'https://www.youtube.com/embed/4XpnKHJAok8', N'Code.org con Minecraft'),
        (4, 'image', 'https://placehold.co/600x400/96CEB4/333333?text=Minecraft+Bloques', N'Bloques de programación'),
        (5, 'video', 'https://www.youtube.com/embed/Pt2cqF9fSgg', N'Introducción a robótica'),
        (5, 'image', 'https://placehold.co/600x400/FFEAA7/333333?text=Robot', N'Componentes del robot'),
        (6, 'video', 'https://www.youtube.com/embed/FC1XWRME4kQ', N'Pensamiento computacional'),
        (6, 'image', 'https://placehold.co/600x400/DDA0DD/ffffff?text=Algoritmo', N'Diagrama de algoritmo');
END
