import React from 'react'
import ResumeUpload from "../../components/ResumeUpload"
import DisplayResume from '@/components/DisplayResume'
const page = () => {
  return (
    <div className='w-full h-screen'>
      All the resumes will be listed here.
      <p>Click on a resume to analyze it.</p>
      <ResumeUpload/>
      <DisplayResume/>
    </div>
  )
}

export default page
