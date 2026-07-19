class Badge {
    constructor({ id, name, description, icon, pointsRequired, special, color }) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.icon = icon;
        this.pointsRequired = pointsRequired || 0;
        this.special = special || null;
        this.color = color;
    }

    isEarned(user) {
        return user.earnedBadges.includes(this.id);
    }
}

module.exports = Badge;