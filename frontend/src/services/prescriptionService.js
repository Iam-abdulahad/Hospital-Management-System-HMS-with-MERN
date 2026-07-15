import api from '../utils/axiosConfig';

export const getDoctorAppointments = async () => {
  const { data } = await api.get('/appointments/doctor/me');
  return data;
};

export const createPrescription = async (prescriptionData) => {
  const { data } = await api.post('/prescriptions', prescriptionData);
  return data;
};

export const getPrescriptionsByPatient = async (patientId) => {
  const { data } = await api.get(`/prescriptions/patient/${patientId}`);
  return data;
};

export const getPrescriptionById = async (prescriptionId) => {
  const { data } = await api.get(`/prescriptions/${prescriptionId}`);
  return data;
};
