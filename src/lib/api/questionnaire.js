import api from '../api.js';

const QUESTIONNAIRE_LENGTH = 8;

function normalizeAnswers(answers) {
    if (!Array.isArray(answers)) {
        throw new TypeError('answers must be an array');
    }

    if (answers.length !== QUESTIONNAIRE_LENGTH) {
        throw new Error(`answers must contain ${QUESTIONNAIRE_LENGTH} items`);
    }

    return answers.map((answer, index) => {
        if (index === 6) {
            return typeof answer === 'string' ? answer.trim() : '';
        }

        return answer;
    });
}

export async function submitQuestionnaire(answers) {
    const response = await api.post('/api/questionnaires/submit', {
        answers: normalizeAnswers(answers)
    });

    return response.data.data ?? response.data;
}

export async function getQuestionnaireHistory() {
    const response = await api.get('/api/questionnaires/history');

    return response.data.data ?? response.data;
}

export default {
    submitQuestionnaire,
    getQuestionnaireHistory
};
