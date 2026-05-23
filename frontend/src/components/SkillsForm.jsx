import { Sparkles } from 'lucide-react'
import React, { useState } from 'react'

const SkillsForm = ({data, onChange,setResumeData}) => {
  const [newSkill, setNewSkill] = useState('');

  const addSkill = () => {
    if (newSkill.trim()) {
      onChange([...data, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (index) => {
    setResumeData(prev => ({ ...prev, skills: prev.skills.filter((_, i) => i !== index) }));
  };

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
            <div>
                <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>Skills</h3>
                <p className='text-sm text-gray-500'>Add your core skills</p>
            </div>
      </div>

      <div className='mt-6 space-y-4'>
        <div className='flex gap-2'>
          <input
            type='text'
            placeholder='Enter a skill (e.g., JavaScript, Product Management)'
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') addSkill(); }}
            className='flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm'
          />
          <button
            onClick={addSkill}
            className='px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors'
          >
            Add
          </button>
        </div>
        <div className='flex flex-wrap gap-2'>
          {data.map((skill, index) => (
            <div key={index} className='bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2'>
              {skill}
              <button
                onClick={() => removeSkill(index)}
                className='text-red-500 hover:text-red-700'
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <p className='bg-blue-100 text-blue-800 p-2 rounded border border-blue-300'>Tip: Include both technical skills (e.g., programming languages) and soft skills (e.g., communication, leadership).</p>
      </div>
    </div>
  )
}

export default SkillsForm
