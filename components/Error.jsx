import React from 'react'

const Error = ({children}) => {
  return (
    <div className=' text-red-700 font-mono font-light text-sm'>
        {children}
    </div>
  )
}

export default Error