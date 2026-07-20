const { courses: mockCourses } = require('../data/mockData');

class MediaService {
    getAllMediaItems() {
        const items = [];
        mockCourses.forEach(course => {
            (course.mediaItems || []).forEach(item => {
                items.push({ ...item, courseId: course.id, courseTitle: course.title });
            });
        });
        return items;
    }

    getMediaByType(type) {
        return this.getAllMediaItems().filter(item => item.type === type);
    }
}

module.exports = new MediaService();