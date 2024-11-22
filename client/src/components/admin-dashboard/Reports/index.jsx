import React from 'react'
import DailyPdfsGenerated from './PdfsGenerated'
import ExpensesReport from './ExpensesReport'
import RevenueReport from './RevenueReport'

function Reports() {
  return (
    <div className='my-10 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2 lg:grid-cols-3'>
        <DailyPdfsGenerated/>
        <ExpensesReport/>
        <RevenueReport/>
    </div>
  )
}

export default Reports