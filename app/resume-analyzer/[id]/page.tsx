import React from 'react'

const page = ({params}:{params:{ id: string }}) => {
  const { id } = params;
  console.log('Resume ID:', id);
  return (
    <div>
      <h1>Resume Analyzer{id}</h1>
    </div>
  )
}

export default page
