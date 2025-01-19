import { Customer } from '../models/User.js';

// Helper function to get last 7 days dates
const getLast7Days = () => {
  const dates = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    dates.push(date);
  }
  return dates;
};

// Helper function to get day name
const getDayName = (date) => {
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

// Weekly statistics controller
export const getWeeklyStats = async (req, res) => {
  try {
    const last7Days = getLast7Days();

    // Initialize data arrays
    const customerData = new Array(7).fill(0);
    const pdfData = new Array(7).fill(0);
    const dayLabels = last7Days.map(date => getDayName(date));

    // Get statistics for each day
    const statsPromises = last7Days.map(async (date, index) => {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);

      // Get customer count for the day
      const customerCount = await Customer.countDocuments({
        createdDateTime: {
          $gte: startDate,
          $lt: endDate
        }
      });

      // Get PDF count for the day
      const pdfCount = await Customer.countDocuments({
        'pdfGenerated.0': { $exists: true },
        completedOn: {
          $gte: startDate,
          $lt: endDate
        }
      });

      return { customerCount, pdfCount, index };
    });

    // Wait for all queries to complete
    const results = await Promise.all(statsPromises);

    // Fill in the data arrays
    results.forEach(({ customerCount, pdfCount, index }) => {
      customerData[index] = customerCount;
      pdfData[index] = pdfCount;
    });

    // Get totals for the week
    const weeklyTotals = {
      totalCustomers: customerData.reduce((a, b) => a + b, 0),
      totalPDFs: pdfData.reduce((a, b) => a + b, 0),
      averageCustomersPerDay: (customerData.reduce((a, b) => a + b, 0) / 7).toFixed(1),
      averagePDFsPerDay: (pdfData.reduce((a, b) => a + b, 0) / 7).toFixed(1)
    };

    return res.status(200).json({
      success: true,
      data: {
        dayLabels,
        customerData,
        pdfData,
        weeklyTotals
      }
    });
  } catch (error) {
    console.error('Error in weekly-stats:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
};

// Daily statistics controller
export const getDailyStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get today's counts
    const todayCustomers = await Customer.countDocuments({
      createdDateTime: {
        $gte: today,
        $lt: tomorrow
      }
    });

    const todayPDFs = await Customer.countDocuments({
      'pdfGenerated.0': { $exists: true },
      completedOn: {
        $gte: today,
        $lt: tomorrow
      }
    });

    // Get pending requests (customers without PDFs)
    const pendingRequests = await Customer.countDocuments({
      'pdfGenerated.0': { $exists: false },
      customerStatus: { $ne: 'completed' }
    });

    return res.status(200).json({
      success: true,
      data: {
        todayCustomers,
        todayPDFs,
        pendingRequests
      }
    });
  } catch (error) {
    console.error('Error in daily-stats:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching daily statistics',
      error: error.message
    });
  }
};
