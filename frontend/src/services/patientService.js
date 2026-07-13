import api from '../utils/axiosConfig';

export const getPatients = async (search = '') => {
  const { data } = await api.get('/patients', { params: { search } });
  return data;
};

export const createPatient = async (patientData) => {
  const { data } = await api.post('/patients', patientData);
  return data;
};

export const updatePatient = async (id, patientData) => {
  const { data } = await api.put(`/patients/${id}`, patientData);
  return data;
};
