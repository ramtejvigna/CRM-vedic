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
            {
                $group: {
                    _id: null,
                    totalRevenue: {
                        $sum: {
                            $convert: {
                                input: "$amountPaid",
                                to: "double",
                                onError: 0,    
                                onNull: 0      
                            }
                        }
                    }
                }
            },
        ]);
        const totalRevenue = revenueData.length > 0 ? `₹${revenueData[0].totalRevenue.toFixed(2)}` : "₹0";

        // Count documents based on today’s date range
        const todayCustomersCount = await Customer.countDocuments({ createdDateTime: { $gte: today, $lt: tomorrow } });
        const todayPdfsGenerated = await PDF.countDocuments({ createdAt: { $gte: today, $lt: tomorrow } });
        const totalEmployeesCount = await Employee.countDocuments();

        // Send response with statistics
        res.json({
            revenue: totalRevenue,
            customersToday: todayCustomersCount,
            pdfsGeneratedToday: todayPdfsGenerated,
            totalEmployees: totalEmployeesCount,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const getCardsData = async (req, res) => {
    const { employeeId } = req.params;

    try {
        const employee = await Employee.findById(employeeId).populate("customers");
        if (!employee) return res.status(404).json({ message: "Employee not found" });

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        
        // Calculate previous period's revenue
        const previousMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const previousMonthEnd = new Date(monthStart);

        // Fetch revenue for the current month and previous month
        const currentMonthRevenueData = await Customer.aggregate([
            { $match: { assignedEmployee: employee._id, paymentStatus: true, paymentDate: { $gte: monthStart } }},
            { $group: { _id: null, totalRevenue: { $sum: { $convert: { input: "$amountPaid", to: "double", onError: 0, onNull: 0 } }}}}
        ]);
        const previousMonthRevenueData = await Customer.aggregate([
            { $match: { assignedEmployee: employee._id, paymentStatus: true, paymentDate: { $gte: previousMonthStart, $lt: previousMonthEnd } }},
            { $group: { _id: null, totalRevenue: { $sum: { $convert: { input: "$amountPaid", to: "double", onError: 0, onNull: 0 } }}}}
        ]);
        const currentMonthRevenue = currentMonthRevenueData.length > 0 ? currentMonthRevenueData[0].totalRevenue : 0;
        const previousMonthRevenue = previousMonthRevenueData.length > 0 ? previousMonthRevenueData[0].totalRevenue : 0;
        const revenueChangePercent = previousMonthRevenue ? ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue * 100).toFixed(2) : 0;

        const todayCustomersCount = await Customer.countDocuments({
            assignedEmployee: employee._id,
            createdDateTime: { $gte: today, $lt: tomorrow }
        });

        
        const yesterdayCustomersCount = await Customer.countDocuments({
            assignedEmployee: employee._id,
            createdDateTime: { $gte: new Date(today.getTime() - 86400000), $lt: today }
        });

        const customerChangePercent = yesterdayCustomersCount ? ((todayCustomersCount - yesterdayCustomersCount) / yesterdayCustomersCount * 100).toFixed(2) : 0;

        const todayPdfsGenerated = await PDF.countDocuments({
            createdAt: { $gte: today, $lt: tomorrow },
            _id: { $in: employee.customers.map(c => c.pdfGenerated).flat() }
        });


        const yesterdayPdfsGenerated = await PDF.countDocuments({
            createdAt: { $gte: new Date(today.getTime() - 86400000), $lt: today },
            _id: { $in: employee.customers.map(c => c.pdfGenerated).flat() }
        });
        const pdfChangePercent = yesterdayPdfsGenerated ? ((todayPdfsGenerated - yesterdayPdfsGenerated) / yesterdayPdfsGenerated * 100).toFixed(2) : 0;

        const totalTasks = employee.assignedTasks.length;
        const yesterdayTasks = totalTasks - Math.floor(totalTasks * 0.05); // Assuming a 5% increase for demonstration
        const taskChangePercent = yesterdayTasks ? ((totalTasks - yesterdayTasks) / yesterdayTasks * 100).toFixed(2) : 0;

        const statisticsCardsData = [
            // { title: "Today's Revenue", value: `₹${currentMonthRevenue.toFixed(2)}`, icon: "CurrencyRupeeIcon", color: "gray", footer: {
            //     color: revenueChangePercent >= 0 ? "text-green-500" : "text-red-500",
            //     value: `${revenueChangePercent}%`,
            //     label: "than last month",
            // }},
            { title: "Today's Customers", value: todayCustomersCount, icon: "UsersIcon", color: "gray", footer: {
                color: customerChangePercent >= 0 ? "text-green-500" : "text-red-500",
                value: `${customerChangePercent}%`,
                label: "than yesterday",
            }},
            { title: "PDFs generated Today", value: todayPdfsGenerated, icon: "DocumentTextIcon", footer: {
                color: pdfChangePercent >= 0 ? "text-green-500" : "text-red-500",
                value: `${pdfChangePercent}%`,
                label: "than yesterday",
            }},
            { title: "Total Tasks", value: totalTasks, icon: "ClipboardDocumentListIcon", footer: {
                color: taskChangePercent >= 0 ? "text-green-500" : "text-red-400",
                value: `${taskChangePercent}%`,
                label: "than yesterday",
            }},
        ];

        res.json(statisticsCardsData);
    } catch (error) {
        console.error("Error fetching statistics card data:", error);
        res.status(500).json({ message: "Server error" });
    }
};

