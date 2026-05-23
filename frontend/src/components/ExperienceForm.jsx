import { Briefcase, Sparkles } from 'lucide-react'
import React, { useState } from 'react'
import api from '../configs/api'
import { useSelector } from 'react-redux'

const ExperienceForm = ({data, onChange, setResumeData}) => {
  const [enhancingIndex, setEnhancingIndex] = useState(null)
  const [enhanceError, setEnhanceError] = useState(null)
  const [enhanceErrorIndex, setEnhanceErrorIndex] = useState(null)

  const {token} = useSelector(state => state.auth)
  const [generatingIndex, setIsGenerating] = useState(-1)

  const enhanceWithAI = async (index) => {
    const description = data[index].description
    if (!description.trim()) {
      setEnhanceError('Please enter a description first')
      setEnhanceErrorIndex(index)
      return
    }

    setEnhancingIndex(index)
    setEnhanceError(null)
    setEnhanceErrorIndex(null)

    try {
      const { data: response } = await api.post('/api/ai/enhance-job-desc', { userContent: description }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      const updated = [...data]
      updated[index].description = response.enhancedContent
      onChange(updated)
    } catch (error) {
      setEnhanceError(error?.response?.data?.message || error.message)
      setEnhanceErrorIndex(index)
    } finally {
      setEnhancingIndex(null)
    }
  }








  
  return (
    <>
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
              <div>
                  <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>Professional Experience</h3>
                  <p className='text-sm text-gray-500'>Add your work experience details</p>
              </div>
              <button
                onClick={() => onChange([...data, { position: '', company: '', start_date: '', end_date: '', is_current: false, description: '' }])}
                className='px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors'
              >
                Add Experience
              </button>
        </div>

        <div className='mt-6 space-y-6'>
          {data.map((exp, index) => (
            <div key={index} className='p-4 border border-gray-200 rounded-lg'>
              <div className='flex justify-between items-center mb-3'>
                <h4 className='font-medium'>Experience {index + 1}</h4>
                <button
                  onClick={() => setResumeData(prev => ({ ...prev, experience: prev.experience.filter((_, i) => i !== index) }))}
                  className='text-red-500 hover:text-red-700'
                >
                  Remove
                </button>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <input
                  type='text'
                  placeholder='Position'
                  value={exp.position}
                  onChange={(e) => {
                    const updated = [...data];
                    updated[index].position = e.target.value;
                    onChange(updated);
                  }}
                  className='px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm'
                />
                <input
                  type='text'
                  placeholder='Company'
                  value={exp.company}
                  onChange={(e) => {
                    const updated = [...data];
                    updated[index].company = e.target.value;
                    onChange(updated);
                  }}
                  className='px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm'
                />
                <input
                  type='month'
                  placeholder='Start Date'
                  value={exp.start_date}
                  onChange={(e) => {
                    const updated = [...data];
                    updated[index].start_date = e.target.value;
                    onChange(updated);
                  }}
                  className='px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm'
                />
                <input
                  type='month'
                  placeholder='End Date'
                  value={exp.end_date}
                  onChange={(e) => {
                    const updated = [...data];
                    updated[index].end_date = e.target.value;
                    onChange(updated);
                  }}
                  disabled={exp.is_current}
                  className='px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm disabled:bg-gray-100'
                />
              </div>
              <div className='mt-4'>
                <label className='flex items-center'>
                  <input
                    type='checkbox'
                    checked={exp.is_current}
                    onChange={(e) => {
                      const updated = [...data];
                      updated[index].is_current = e.target.checked;
                      onChange(updated);
                    }}
                    className='mr-2'
                  />
                  <span className='text-sm text-gray-700'>Currently working here</span>
                </label>
              </div>
              <div className='mt-3'>
                <div className='flex justify-between items-center mb-2'>
                  <label className='text-sm font-medium text-gray-700'>Description</label>
                  <button
                    onClick={() => enhanceWithAI(index)}
                    disabled={enhancingIndex === index}
                    className='flex items-center gap-1 px-3 py-1 bg-purple-500 text-white text-xs rounded-lg hover:bg-purple-600 disabled:bg-purple-400 transition-colors'
                  >
                    <Sparkles className='size-3' />
                    {enhancingIndex === index ? 'Enhancing...' : 'AI Enhance'}
                  </button>
                </div>
                {enhanceError && enhanceErrorIndex === index && (
                  <div className='p-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded mb-2'>{enhanceError}</div>
                )}
                <textarea
                  placeholder='Description'
                  value={exp.description}
                  onChange={(e) => {
                    const updated = [...data];
                    updated[index].description = e.target.value;
                    onChange(updated);
                  }}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm'
                  rows={4}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default ExperienceForm
