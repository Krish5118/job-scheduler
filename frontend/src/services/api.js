import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000',
});

export const getJobs = (filters = {}) => {
    const params = new URLSearchParams(filters);
    return api.get(`/jobs?${params.toString()}`);
};

export const createJob = (jobData) => api.post('/jobs', jobData);
export const getJobById = (id) => api.get(`/jobs/${id}`);
export const runJob = (id) => api.post(`/run-job/${id}`);

export default api;
