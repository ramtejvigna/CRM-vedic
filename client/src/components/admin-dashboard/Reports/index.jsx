import React from 'react'
import DailyPdfsGenerated from './DailyPdfsGenerated'

function Reports() {
  return (
    <div className='mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2 xl:grid-cols-3'>
        <DailyPdfsGenerated/>
    </div>
  )
}

export default Reports