const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const Invoice = require('../models/Invoice');

const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [totalPatients, todaysAppointments, revenueData] = await Promise.all([
      Patient.countDocuments({ isDeleted: { $ne: true } }),
      Appointment.countDocuments({
        date: { $gte: today, $lt: tomorrow }
      }),
      Invoice.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
      ])
    ]);

    const recentAppointments = await Appointment.find()
      .populate('patientId', 'name')
      .populate('doctorId', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentActivity = recentAppointments.map((appointment) => ({
      id: appointment._id,
      text: `${appointment.doctorId?.name || 'Doctor'} updated ${appointment.patientId?.name || 'a patient'} to ${appointment.status}`,
      time: appointment.createdAt.toLocaleString()
    }));

    res.json({
      totalPatients,
      todaysAppointments,
      totalRevenue: revenueData[0]?.totalRevenue || 0,
      recentActivity
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getDashboardStats };
