const mediaService = require('../services/mediaService');

const mediaController = {
    library(req, res) {
        const { type } = req.query;
        const mediaItems = type ? mediaService.getMediaByType(type) : mediaService.getAllMediaItems();
        res.json({ mediaItems });
    }
};

module.exports = mediaController;