const mediaService = require('../services/mediaService');

const mediaController = {
    async library(req, res) {
        try {
            const { type } = req.query;
            const mediaItems = type
                ? await mediaService.getMediaByType(type)
                : await mediaService.getAllMediaItems();
            res.json({ mediaItems });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = mediaController;
