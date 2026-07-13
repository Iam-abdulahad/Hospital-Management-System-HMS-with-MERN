import api from '../utils/axiosConfig';

export const getAppointments = async (status = '') => {
  const { data } = await api.get('/appointments', { params: { status } });
  return data;
};

export const createAppointment = async (appointmentData) => {
  const { data } = await api.post('/appointments', appointmentData);
  return data;
};

export const updateAppointmentStatus = async (id, status) => {
  const { data } = await api.put(`/appointments/${id}/status`, { status });
  return data;
};
