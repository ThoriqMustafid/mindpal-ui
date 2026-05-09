import api from '../api.js';

export async function getMoodStats() {
    const response = await api.get('/api/moods/stats');

    return response.data;
}

export async function logMood({ moodScore, sleepQuality = 70, anxietyLevel = 50 }) {
    const response = await api.post('/api/moods', {
        mood_score: moodScore,
        sleep_quality: sleepQuality,
        anxiety_level: anxietyLevel
    });

    return response.data;
}

export default {
    getMoodStats,
    logMood
};
