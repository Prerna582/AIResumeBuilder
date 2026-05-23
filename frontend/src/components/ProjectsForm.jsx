import { FolderIcon } from 'lucide-react'
import React from 'react'

const ProjectsForm = ({data, onChange,setResumeData}) => {
  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
            <div>
                <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>Projects</h3>
                <p className='text-sm text-gray-500'>Add your notable projects</p>
            </div>
            <button
              onClick={() => onChange([...data, { name: '', type: '', description: '' }])}
              className='px-4 py-2 bg-green-400 text-white rounded-lg hover:bg-green-500 transition-colors'
            >
              Add Project
            </button>
      </div>

      <div className='mt-6 space-y-6'>
        {data.map((proj, index) => (
          <div key={index} className='p-4 border border-gray-200 rounded-lg'>
            <div className='flex justify-between items-center mb-3'>
              <h4 className='font-medium'>Project {index + 1}</h4>
              <button
                onClick={() => setResumeData(prev => ({ ...prev, project: prev.project.filter((_, i) => i !== index) }))}
                className='text-red-500 hover:text-red-700'
              >
                Remove
              </button>
            </div>
            <input
              type='text'
              placeholder='Project Name'
              value={proj.name}
              onChange={(e) => {
                const updated = [...data];
                updated[index].name = e.target.value;
                onChange(updated);
              }}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm mb-3'
            />
            <textarea
              placeholder='Description'
              value={proj.description}
              onChange={(e) => {
                const updated = [...data];
                updated[index].description = e.target.value;
                onChange(updated);
              }}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm'
              rows={4}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProjectsForm
