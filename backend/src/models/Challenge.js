class Challenge {
    constructor({ id, title, description, icon, reward, type, target, expiresIn }) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.icon = icon;
        this.reward = reward;
        this.type = type;
        this.target = target;
        this.expiresIn = expiresIn;
    }

    getProgressPercentage(userProgress) {
        return Math.min(Math.round(((userProgress || 0) / this.target) * 100), 100);
    }

    isCompleted(userProgress) {
        return (userProgress || 0) >= this.target;
    }
}

module.exports = Challenge;