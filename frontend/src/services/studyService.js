import api from './index';

export const studyService = {
  createStudySession: async (sessionData) => {
    const response = await api.post('/study/sessions', sessionData);
    return response.data;
  },

  getStudySessions: async () => {
    const response = await api.get('/study/sessions');
    return response.data;
  },

  getStudySession: async (sessionId) => {
    const response = await api.get(`/study/sessions/${sessionId}`);
    return response.data;
  },

  updateStudySession: async (sessionId, sessionData) => {
    const response = await api.put(`/study/sessions/${sessionId}`, sessionData);
    return response.data;
  }
};