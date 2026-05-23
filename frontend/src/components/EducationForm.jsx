import { GraduationCap } from 'lucide-react'
import React from 'react'

const EducationForm = ({data, onChange,setResumeData}) => {
  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
            <div>
                <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>Education</h3>
                <p className='text-sm text-gray-500'>Add your educational background</p>
            </div>
            <button
              onClick={() => onChange([...data, { degree: '', field: '', institution: '', graduation_date: '', gpa: '' }])}
              className='px-4 py-2 bg-green-400 text-white rounded-lg hover:bg-green-500 transition-colors'
            >
              Add Education
            </button>
      </div>

      <div className='mt-6 space-y-6'>
        {data.map((edu, index) => (
          <div key={index} className='p-4 border border-gray-200 rounded-lg'>
            <div className='flex justify-between items-center mb-3'>
              <h4 className='font-medium'>Education {index + 1}</h4>
              <button
                onClick={() => setResumeData(prev => ({ ...prev, education: prev.education.filter((_, i) => i !== index) }))}
                className='text-red-500 hover:text-red-700'
              >
                Remove
              </button>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <input
                type='text'
                placeholder='Degree'
                value={edu.degree}
                onChange={(e) => {
                  const updated = [...data];
                  updated[index].degree = e.target.value;
                  onChange(updated);
                }}
                className='px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm'
              />
              <input
                type='text'
                placeholder='Field of Study'
                value={edu.field}
                onChange={(e) => {
                  const updated = [...data];
                  updated[index].field = e.target.value;
                  onChange(updated);
                }}
                className='px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm'
              />
              <input
                type='text'
                placeholder='Institution'
                value={edu.institution}
                onChange={(e) => {
                  const updated = [...data];
                  updated[index].institution = e.target.value;
                  onChange(updated);
                }}
                className='px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm'
              />
              <input
                type='month'
                placeholder='Graduation Date'
                value={edu.graduation_date}
                onChange={(e) => {
                  const updated = [...data];
                  updated[index].graduation_date = e.target.value;
                  onChange(updated);
                }}
                className='px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm'
              />
              <input
                type='text'
                placeholder='GPA (Optional)'
                value={edu.gpa}
                onChange={(e) => {
                  const updated = [...data];
                  updated[index].gpa = e.target.value;
                  onChange(updated);
                }}
                className='px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm'
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default EducationForm
