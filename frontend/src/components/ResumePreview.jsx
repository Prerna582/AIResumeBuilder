import React from 'react'
import ModernTemplate from '../assets/templates/ModernTemplate'
import ClassicTemplate from '../assets/templates/ClassicTemplate'
import MinimalTemplate from '../assets/templates/MinimalTemplate'
import MinimalImageTemplate from '../assets/templates/MinimalImageTemplate'

const ResumePreview = ({data,template,accentColor,classes=""}) => {
  console.log('ResumePreview rendering with data:', data)
  console.log('Template:', template)
  console.log('Accent color:', accentColor)

  // If no data, show a simple message
  if (!data || !data.personal_info) {
    return (
      <div className='w-full bg-gray-100'>
        <div id='resume-preview' className={"border border-gray-200 print:shadow-none print:border-none" + classes}>
          <div style={{padding: '20px', backgroundColor: 'red', color: 'white', marginBottom: '10px', fontSize: '14px'}}>
            ERROR: No resume data available
          </div>
        </div>
      </div>
    );
  }

  const renderTemplate = ()=>{
    console.log('Rendering template:', template)
    switch(template){
      case "modern":
        console.log('Rendering ModernTemplate')
        return <ModernTemplate data={data} accentColor={accentColor}/>;
      case "minimal":
        console.log('Rendering MinimalTemplate')
        return <MinimalTemplate data={data} accentColor={accentColor}/>;
      case "minimal-image":
        console.log('Rendering MinimalImageTemplate')
        return <MinimalImageTemplate data={data} accentColor={accentColor}/>;

      default:
        console.log('Rendering ClassicTemplate (default)')
        return <ClassicTemplate data={data} accentColor={accentColor}/>;
        break;
    }
  }

  return (
    <div className='w-full bg-gray-100'>
      <div id='resume-preview' className={"border border-gray-200 print:shadow-none print:border-none" + classes}>

        {renderTemplate()}
      </div>
    </div>
  )
}

export default ResumePreview
