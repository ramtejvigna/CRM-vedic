import { Customer, Employee } from "../models/User.js";
import { PDF } from "../models/PDF.js";

export const getStatistics = async (req, res) => {
    try {
        // Today's date range
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        // 1. Total Revenue for the current month
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        const revenueData = await Customer.aggregate([
            { $match: { paymentDate: { $gte: monthStart } } },
            { $group: { _id: null, totalRevenue: { $sum: { $toDouble: "$amountPaid" } } } },
        ]);
        const totalRevenue = revenueData.length > 0 ? `₹${revenueData[0].totalRevenue.toFixed(2)}` : "₹0";

        const todayCustomersCount = await Customer.countDocuments({ createdDateTime: { $gte: today, $lt: tomorrow } });

        const todayPdfsGenerated = await PDF.countDocuments({ createdAt: { $gte: today, $lt: tomorrow } });

        const totalEmployeesCount = await Employee.countDocuments();

        res.json({
            revenue: totalRevenue,
            customersToday: todayCustomersCount,
            pdfsGeneratedToday: todayPdfsGenerated,
            totalEmployees: totalEmployeesCount,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}