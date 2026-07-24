const { badges: mockBadges, challenges: mockChallenges, levels: mockLevels, mockUser } = require('../data/mockData');
const Badge = require('../models/Badge');
const Challenge = require('../models/Challenge');
const User = require('../models/User');

class GamificationService {
    getUserData(sessionUser) {
        return new User(sessionUser || mockUser);
    }

    getAllBadges() {
        return mockBadges.map(b => new Badge(b));
    }

    getAllChallenges() {
        return mockChallenges.map(c => new Challenge(c));
    }

    getAllLevels() {
        return mockLevels;
    }

    addPoints(sessionUser, points) {
        sessionUser.points = (sessionUser.points || 0) + points;
        return sessionUser;
    }

    enrollCourse(sessionUser, courseId) {
        if (!sessionUser.enrollCourses.includes(courseId)) {}
        sessionUser.challengeProgress[challengeId] = (sessionUser.challengeProgress[challengeId] || 0) + amount;
        return sessionUser;
    }
}

module.exports = new GamificationService();