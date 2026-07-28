class StudentProgress {
    constructor({
        estudianteId,
        nombre,
        cursoId,
        tituloCurso,
        porcentaje,
        completado,
        fechaMatricula,
        leccionesCompletadas,
        totalLecciones
    }) {
        this.estudianteId = estudianteId;
        this.nombre = nombre;
        this.cursoId = cursoId;
        this.tituloCurso = tituloCurso;
        this.porcentaje = porcentaje || 0;
        this.completado = !!completado;
        this.fechaMatricula = fechaMatricula;
        this.leccionesCompletadas = leccionesCompletadas || 0;
        this.totalLecciones = totalLecciones || 0;
    }

    getEstado() {
        if (this.completado) return "Completado";
        if (this.porcentaje > 0) return "En progreso";
        return "Sin avance";
    }
}

module.exports = StudentProgress;
