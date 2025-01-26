import React from 'react';
import { motion } from 'framer-motion';
import DailyPdfsGenerated from './PdfsGenerated';
import ExpensesReport from './ExpensesReport';
import RevenueReport from './RevenueReport';
import EmployeePerformanceTable from './EmployeePerformanceTable';
import RegionalPdfReport from './RegionalPDF';

function Reports() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100
      }
    }
  };

  return (
    <motion.div
      className='flex flex-col gap-10 mb-20'
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className='grid grid-cols-2 gap-10'>
        <motion.div variants={itemVariants} className="w-full">
          <DailyPdfsGenerated />
        </motion.div>

        <motion.div variants={itemVariants} className="w-full">
          <ExpensesReport />
        </motion.div>
      </div>

      <motion.div variants={itemVariants} className="w-full">
        <RevenueReport />
      </motion.div>

      <motion.div variants={itemVariants} className="w-full">
        <RegionalPdfReport />
      </motion.div>

      <motion.div variants={itemVariants} className="w-full">
        <EmployeePerformanceTable />
      </motion.div>
    </motion.div>
  );
}

export default Reports;