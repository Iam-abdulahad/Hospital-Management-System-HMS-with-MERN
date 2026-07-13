const Patient = require('../models/Patient');

const generatePatientId = async () => {
  const count = await Patient.countDocuments();
  const next = count + 1;
  return `PT-${new Date().getFullYear()}-${String(next).padStart(4, '0')}`;
};

const createPatient = async (req, res) => {
  try {
    const { name, age, gender, contact, address, medicalHistory } = req.body;

    if (!name || !age || !gender || !contact || !address) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const patientId = await generatePatientId();
    const patient = await Patient.create({
      patientId,
      name,
      age,
      gender,
      contact,
      address,
      medicalHistory: medicalHistory || []
    });

    res.status(201).json(patient);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAllPatients = async (req, res) => {
  try {
    const search = req.query.search || '';
    const query = {
      isDeleted: { $ne: true }
    };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { contact: { $regex: search, $options: 'i' } }
      ];
    }

    const patients = await Patient.find(query).sort({ createdAt: -1 });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findOne({ _id: req.params.id, isDeleted: { $ne: true } });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findOne({ _id: req.params.id, isDeleted: { $ne: true } });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const updatedPatient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json(updatedPatient);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findOne({ _id: req.params.id, isDeleted: { $ne: true } });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    if (req.query.hard === 'true') {
      await Patient.findByIdAndDelete(req.params.id);
    } else {
      await Patient.findByIdAndUpdate(req.params.id, {
        isDeleted: true,
        deletedAt: new Date()
      });
    }

    res.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient
};
