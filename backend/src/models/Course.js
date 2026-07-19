class Course {
    constructor({ id, title, description, level, ageRange, thumbnail, category, points, duration, lessons, mediaItems }) {
        this.id = id;
        this.title =title;
        this.description = description;
        this.level = level;
        this.ageRange = ageRange;
        this.thumbnail = thumbnail;
        this.category = category;
        this.points = points;
        this.duration = duration;
        this.lessons = lessons || [];
        this.mediaItems = mediaItems || [];
    }

    getLevelBadge() {
        const map = {
            'Principiante': { color: 'success', icon: '🌱'},
            'Intermedio': { color: 'warning', icon: '⚡'},
            'Avanzado': { color: 'danger', icon: '🔥'}
        };
    }
}

module.exports = Course;