class User {
    constructor({ id, name, avatar, points, enrolledCourses, completedCourses, earnedBadges, challengeProgress, streak, joinedDate }) {
        this.id = id;
        this.name = name;
        this.avatar = avatar;
        this.points = points;
        this.enrolledCourses = enrolledCourses || [];
        this.completedCourses = completedCourses || [];
        this.earnedBadges = earnedBadges || [];
        this.challengeProgress = challengeProgress || [];
        this.streak = streak || 0;
        this.joinedDate = joinedDate;
    }

    getLevel(levels) {
        return levels.find(l => this.points >= l.minPoints && this.points <= l.maxPoints) || levels[0];
    }

    getProgressToNextLevel(levels) {
        const current = this.getLevel(levels);
        if (current.level === levels.length) return 100;
        const range = current.maxPoints - current.minPoints;
        const gained = this.points - current.minPoints;
        return Math.min(Math.round((gained / range) * 100), 100);
    }
}

module.exports = User;