const repository = require('../repositories/MediaRepository');

class MediaService {
    async getAllMediaItems() {
        return await repository.obtenerMediaItems();
    }

    async getMediaByType(tipo) {
        return await repository.obtenerMediaItems(tipo);
    }

    async getMediaByCourse(cursoId) {
        return await repository.obtenerMediaPorCurso(cursoId);
    }
}

module.exports = new MediaService();
