const gamificationService = require('../services/gamificationService');

const gamificationController = {
    dashboard(req, res) {
        const levels = gamificationService.getAllLevels();
        const user = gamificationService.getUserData(req.session.user);
        const currentLevel = user.getLevel(levels);
        const progress = user.getProgressToNextLevel(levels);

        const badges = gamificationService.getAllBadges().map(b => ({
            ...b, isEarned: b.isEarned(user)
        }));

        const challenges = gamificationService.getAllChallenges().map(c => {
            const userProg = user.challengeProgress[c.id] || 0;
            return {
                ...c,
                userProgress: userProg,
                progressPct: c.getProgressPercentage(userProg),
                isCompleted: c.isCompleted(userProg)
            };
        });

        res.json({ user, badges, challenges, levels, currentLevel, progress });
    },

    updateProgress(req, res) {
        const { challengeId, amount } = req.body;
        req.session.user = gamificationService.updateChallengeProgress(
            req.session.user, parseInt(challengeId), parseInt(amount) || 1
        );
        res.json({ success: true, user: req.session.user });
    }
};

module.exports = gamificationController;