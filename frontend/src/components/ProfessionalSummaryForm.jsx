import { Loader2, Sparkle } from 'lucide-react'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import api from '../configs/api'
import { toast } from 'react-hot-toast'

const ProfessionalSummaryForm = ({ data, onChange, setResumeData }) => {

  const { token } = useSelector(state => state.auth)
  const [isGenerating, setIsGenerating] = useState(false)
  const [enhanceError, setEnhanceError] = useState(null)

  const generateSummary = async () => {
    try {
      setIsGenerating(true)
      setEnhanceError(null)
      const prompt = `enhance my professional summary "${data}""`
      const response = await api.post('/api/ai/enhance-pro-sum', { userContent: prompt }, { headers: { Authorization: token } })
      setResumeData(prev => ({ ...prev, professional_summary: response.data.enhancedContent }))
    }
    catch (error) {
      setEnhanceError(error?.response?.data?.message || error.message)
      toast.error(error?.response?.data?.message || error.message)
    }
    finally {
      setIsGenerating(false)
    }
  }

  

  return (
    <>
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <div>
            <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>Professional Summary</h3>
            <p className='text-sm text-gray-500'>Add summary for your resume</p>
          </div>
          <div className='flex items-center gap-2'>
            <button onClick={generateSummary} disabled={isGenerating} className='flex items-center gap-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50'>
              {isGenerating ? (<Loader2 className='size-4 animate-spin' />) : (
                <Sparkle className='size-4' />
              )}

              {isGenerating ? 'Enhancing...' : 'AI Enhance'}
            </button>
          </div>
        </div>

        <div className='mt-6'>
          <textarea value={data || ""} onChange={(e) => onChange(e.target.value)} rows={7} className='w-full p-3 px-4 mt-2  border text-sm
          border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500
          outline-none transition-colors resize-none' placeholder='Write a compelling professional
          summary that highlights your key strengths and career objectives....'/>
          {enhanceError && <div className='text-red-600 text-sm mt-2'>{enhanceError}</div>}
          <p className='bg-blue-100 text-blue-800 p-2 rounded border border-blue-300 mt-2'>Tip: Keep it concise (3-4 sentences) and focus on your most relevant achievements and skills.</p>
        </div>
      </div>
    </>
  )
}

export default ProfessionalSummaryForm
