import React from 'react'
import ResumeUpload from "../../components/ResumeUpload"
import DisplayResume from '@/components/DisplayResume'
const page = () => {
  return (
    <div className='w-full h-screen'>
      
      <ResumeUpload/>
      <DisplayResume/>
    </div>
  )
}

export default page
