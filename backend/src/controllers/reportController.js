const PDFDocument = require("pdfkit");
const reportService = require("../services/reportService");

// Un docente/administrador puede ver el reporte de cualquier estudiante;
// un estudiante solo puede ver el suyo propio.
function puedeVerReporte(user, estudianteId) {
    if (user.rol === "docente" || user.rol === "administrador") return true;
    return user.rol === "estudiante" && Number(user.estudianteId) === Number(estudianteId);
}

const reportController = {

    // GET /api/reports/student/:estudianteId  (sirve tanto a docente como a padre/tutor)
    async student(req, res) {
        try {
            if (!puedeVerReporte(req.user, req.params.estudianteId)) {
                return res.status(403).json({ error: "No tienes permiso para ver este reporte" });
            }
            const reporte = await reportService.getStudentReport(req.params.estudianteId);
            res.json(reporte);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // GET /api/reports/course/:cursoId
    async course(req, res) {
        try {
            const reporte = await reportService.getCourseReport(req.params.cursoId);
            res.json(reporte);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // GET /api/reports/student/:estudianteId/pdf  -> RF-22
    async studentPdf(req, res) {
        try {
            if (!puedeVerReporte(req.user, req.params.estudianteId)) {
                return res.status(403).json({ error: "No tienes permiso para ver este reporte" });
            }
            const reporte = await reportService.getStudentReport(req.params.estudianteId);

            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", `attachment; filename=reporte_estudiante_${req.params.estudianteId}.pdf`);

            const doc = new PDFDocument({ margin: 50 });
            doc.pipe(res);

            doc.fontSize(18).text("Reporte de desempeño", { align: "center" });
            doc.moveDown();
            doc.fontSize(12).text(`Estudiante: ${reporte.nombre || "N/A"}`);
            doc.text(`Generado el: ${reporte.generadoEl.toLocaleDateString("es-CR")}`);
            doc.moveDown();

            doc.fontSize(14).text("Resumen");
            doc.fontSize(11)
                .text(`Cursos inscritos: ${reporte.resumen.cursosInscritos}`)
                .text(`Cursos completados: ${reporte.resumen.cursosCompletados}`)
                .text(`Avance promedio: ${reporte.resumen.promedioAvance}%`)
                .text(`Tiempo total de uso: ${reporte.resumen.minutosUso} minutos`);
            doc.moveDown();

            doc.fontSize(14).text("Cursos");
            reporte.cursos.forEach(c => {
                doc.fontSize(11).text(`- ${c.tituloCurso}: ${c.porcentaje}% (${c.getEstado ? c.getEstado() : ""})`);
            });
            doc.moveDown();

            doc.fontSize(14).text("Actividad reciente");
            reporte.actividadesRecientes.forEach(a => {
                const fecha = a.FechaCompletado ? new Date(a.FechaCompletado).toLocaleDateString("es-CR") : "";
                doc.fontSize(11).text(`- [${fecha}] ${a.Curso} · ${a.Leccion} (${a.Puntuacion ?? "-"} pts)`);
            });

            doc.end();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

};

module.exports = reportController;
