import { PDF as Pdfs } from '../models/PDF.js'
import Expenses from "../models/Expenses.js"
import { Customer, Employee } from '../models/User.js';
import Expense from '../models/Expenses.js';

export const getPdfsGenByEmployee = async (req, res) => {
  try {
    const { range } = req.query;
    const date1 = new Date();
    const date2 = new Date();

    // Set date range based on the query parameter
    if (range === "today") {
      date1.setHours(0, 0, 0, 0);
      date2.setHours(23, 59, 59, 999);
    } else if (range === "week") {
      const startOfWeek = date1.getDate() - date1.getDay();
      date1.setDate(startOfWeek);
      date1.setHours(0, 0, 0, 0);
      date2.setDate(startOfWeek + 6);
      date2.setHours(23, 59, 59, 999);
    } else if (range === "month") {
      date1.setDate(1);
      date1.setHours(0, 0, 0, 0);
      date2.setMonth(date1.getMonth() + 1);
      date2.setDate(0);
      date2.setHours(23, 59, 59, 999);
    } else {
      return res.status(400).json({ message: "Invalid range. Use 'today', 'week', or 'month'." });
    }

    // Fetch all employees to ensure they are included even if no PDFs are generated
    const allEmployees = await Employee.find({}, { firstName: 1, role: 1 }).lean();

    // Aggregate PDF data for employees
    const employeeResults = await Pdfs.aggregate([
      {
        $match: { createdAt: { $gte: date1, $lte: date2 } },
      },
      {
        $group: {
          _id: "$EmployeeGenerated",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "employees",
          localField: "_id",
          foreignField: "_id",
          as: "employee",
        },
      },
      {
        $unwind: {
          path: "$employee",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          name:{ $ifNull: ["$employee.firstName", null] },
          role: "$employee.role",
          count: 1,
        },
      },
    ]);

    console.log("Employee Results: ", employeeResults);

    // Aggregate PDF data for admins
    const adminResults = await Pdfs.aggregate([
      {
        $match: { createdAt: { $gte: date1, $lte: date2 } },
      },
      {
        $group: {
          _id: "$EmployeeGenerated",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "admins",
          localField: "_id",
          foreignField: "_id",
          as: "admin",
        },
      },
      {
        $unwind: {
          path: "$admin",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          name: { $ifNull: ["$admin.email", null] },
          role: { $literal: "Admin" },
          count: 1,
        },
      },
    ]);

    console.log("Admin Results: ", adminResults);

    // Create a map for employee PDF counts
    const employeePdfCounts = employeeResults.reduce((acc, data) => {
      if (data.name) acc[data.name] = data.count;
      return acc;
    }, {});

    // Combine all employees with PDF counts
    const formattedEmployeeData = allEmployees.map((employee) => ({
      name: employee.firstName,
      role: employee.role,
      count: employeePdfCounts[employee.firstName] || 0,
    }));

    // Format admin data
    const formattedAdminData = adminResults
      .filter((data) => data.name)
      .map((data) => ({
        name: "Admin",
        role: data.role,
        count: data.count,
      }));


    const combinedData = [...formattedEmployeeData, ...formattedAdminData];

    return res.status(200).json(combinedData);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};


export const getExpensesByMonth = async (req, res) => {
  try {
    const now = new Date();
    const { month = "this" } = req.query;

    let startDate, endDate;
    if (month === "this") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    } else if (month === "last") {
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
    } else {
      return res.status(400).json({ message: "Invalid month query. Use 'this' or 'last'." });
    }

    const result = await Expenses.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $addFields: {
          month: {
            $dateToString: { format: "%Y-%m", date: "$date" },
          },
        },
      },
      {
        $group: {
          _id: "$expense_name",
          totalAmount: {
            $sum: "$amount",
          },
        },
      },
      {
        $group: {
          _id: null,
          data: { $push: { category: "$_id", totalAmount: "$totalAmount" } },
          grandTotal: { $sum: "$totalAmount" },
        },
      },
      {
        $unwind: "$data",
      },
      {
        $project: {
          category: "$data.category",
          totalAmount: "$data.totalAmount",
          grandTotal: 1,
          percentage: {
            $multiply: [{ $divide: ["$data.totalAmount", "$grandTotal"] }, 100],
          },
        },
      },
    ]);

    return res.status(200).json(result);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};


export const getRevenueData = async (req, res) => {
  try {
    const { timeRange, employeeFilter } = req.query;

    // Define all months and other time periods
    const ALL_MONTHS = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const WEEKS_IN_YEAR = 52;
    const YEARS_TO_SHOW = 5;

    // Determine the date range based on the timeRange filter
    const now = new Date();
    let startDate, endDate, groupByField, mappingFunction;

    if (timeRange === "yearly") {
      startDate = new Date(now.getFullYear() - (YEARS_TO_SHOW - 1), 0, 1);
      endDate = new Date(now.getFullYear() + 1, 0, 0, 23, 59, 59, 999);
      groupByField = { $year: "$createdDateTime" };
      mappingFunction = (data) => ({
        label: `${data._id}`,
        totalRevenue: data.totalRevenue || 0,
        customerCount: data.customerCount || 0
      });
    } else if (timeRange === "monthly") {
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date(now.getFullYear() + 1, 0, 0, 23, 59, 59, 999);
      groupByField = { $month: "$createdDateTime" };
      mappingFunction = (data) => ({
        label: ALL_MONTHS[data._id - 1],
        totalRevenue: data.totalRevenue || 0,
        customerCount: data.customerCount || 0
      });
    } else if (timeRange === "weekly") {
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date(now.getFullYear() + 1, 0, 0, 23, 59, 59, 999);
      groupByField = { $week: "$createdDateTime" };
      mappingFunction = (data) => ({
        label: `Week ${data._id}`,
        totalRevenue: data.totalRevenue || 0,
        customerCount: data.customerCount || 0
      });
    } else {
      return res.status(400).json({ message: "Invalid time range specified." });
    }

    // Match criteria based on employee filter and payment status
    const matchCriteria = {
      createdDateTime: { $gte: startDate, $lte: endDate },
      paymentStatus: true,
      ...(employeeFilter !== "overall" && { assignedEmployee: employeeFilter }),
    };

    const result = await Customer.aggregate([
      { $match: matchCriteria },
      {
        $group: {
          _id: groupByField,
          totalRevenue: { $sum: { $toDouble: "$amountPaid" } },
          customerCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Create a complete dataset with all periods
    let completeResult;
    if (timeRange === "monthly") {
      completeResult = ALL_MONTHS.map((month, index) => {
        const matchedData = result.find(r => r._id === index + 1);
        return matchedData
          ? mappingFunction(matchedData)
          : { label: month, totalRevenue: 0, customerCount: 0 };
      });
    } else if (timeRange === "yearly") {
      const years = Array.from(
        { length: YEARS_TO_SHOW },
        (_, i) => now.getFullYear() - (YEARS_TO_SHOW - 1) + i
      );
      completeResult = years.map(year => {
        const matchedData = result.find(r => r._id === year);
        return matchedData
          ? mappingFunction(matchedData)
          : { label: `${year}`, totalRevenue: 0, customerCount: 0 };
      });
    } else if (timeRange === "weekly") {
      const weeks = Array.from(
        { length: WEEKS_IN_YEAR },
        (_, i) => i + 1
      );
      completeResult = weeks.map(week => {
        const matchedData = result.find(r => r._id === week);
        return matchedData
          ? mappingFunction(matchedData)
          : { label: `Week ${week}`, totalRevenue: 0, customerCount: 0 };
      });
    }

    res.status(200).json({ data: completeResult });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};

const parseDateParams = (fromDate, toDate) => {
  const query = {};
  if (fromDate) {
    query.createdAt = { $gte: new Date(fromDate) };
  }
  if (toDate) {
    query.createdAt = { ...query.createdAt, $lte: new Date(toDate) };
  }
  return query;
};


export const pdfGeneratedByEmployee = async (req, res) => {
  try {
    const { fromDate, toDate } = req.query;
    const dateQuery = parseDateParams(fromDate, toDate);

    // First get all employees including admins
    const allEmployees = await Employee.find({}).select('firstName lastName email role');


    // Get PDF stats for the date range
    const pdfStats = await Pdfs.aggregate([
      // Match PDFs within the date range
      { $match: dateQuery },
      // Group by EmployeeGenerated and count the PDFs
      {
        $group: {
          _id: '$EmployeeGenerated',
          count: { $sum: 1 },
        },
      }
    ]);

    // Combine employee data with PDF stats, ensuring all employees are included
    const combinedStats = allEmployees.map(employee => {
      const pdfStat = pdfStats.find(stat =>
        stat._id && stat._id.toString() === employee._id.toString()
      );

      return {
        employeeId: employee._id,
        employeeName: `${employee.firstName} ${employee.lastName}`,
        email: employee.email,
        role: employee.role,
        count: pdfStat ? pdfStat.count : 0
      };
    });

    res.status(200).json(combinedStats);
  } catch (error) {
    console.error('Error fetching PDF statistics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};