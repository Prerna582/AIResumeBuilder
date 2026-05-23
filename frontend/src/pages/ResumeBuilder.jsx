import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { dummyResumeData } from "../assets/assets";
import { ArrowLeft, Briefcase, ChevronLeft, ChevronRight, Download, Eye, EyeOff, FileText, FolderIcon, GraduationCap, Share2, Sparkles, User, Save } from "lucide-react";
import { pdf, PDFViewer } from "@react-pdf/renderer";
import ResumePDF from "../components/ResumePDF";
import PersonalInfoForm from "../components/PersonalInfoForm";
import ProfessionalSummaryForm from "../components/ProfessionalSummaryForm";
import ExperienceForm from "../components/ExperienceForm";
import EducationForm from "../components/EducationForm";
import ProjectsForm from "../components/ProjectsForm";
import SkillsForm from "../components/SkillsForm";
import ClassicTemplate from "../assets/templates/ClassicTemplate";
import MinimalImageTemplate from "../assets/templates/MinimalImageTemplate";
import MinimalTemplate from "../assets/templates/MinimalTemplate";
import ModernTemplate from "../assets/templates/ModernTemplate";
import ResumePreview from "../components/ResumePreview";
import TempelateSelector from "../components/TempelateSelector";
import ColorPicker from "../components/ColorPicker";
import api from "../configs/api";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";

const ResumeBuilder = ()=> {

  const{resumeId} = useParams()
  const {token} = useSelector(state=>state.auth)

  const [resumeData, setResumeData] = useState(dummyResumeData[0])
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [activeSectionIndex, setActiveSectionIndex] = useState(0)
  const [removeBackground, setRemoveBackground] = useState(false)
  const [isPublic, setIsPublic] = useState(false)
  const [showDownloadModal, setShowDownloadModal] = useState(false)
  const [selectedPageSize, setSelectedPageSize] = useState('A4')

  
  

  const sections = [
    {id: "personal", name:"Personal Info", icon:User},
    {id: "summary", name:"Summary", icon:FileText},
    {id: "experience",name:"Experience", icon: Briefcase},
    {id: "education",name:"Education", icon: GraduationCap},
    {id: "projects",name:"Projects", icon: FolderIcon},
    {id: "skills",name:"Skills", icon: Sparkles},
  ]

  const saveChanges = async () => {
    try {
      setIsSaving(true)
      setSaveError(null)
      setSaveSuccess(false)

      const formData = new FormData()
      formData.append('resumeId', resumeId)
      formData.append('resumeData', JSON.stringify(resumeData))

      const response = await api.put('/api/resumes/update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      if (response.data) {
        setSaveSuccess(true)
        // Auto-hide success message after 2 seconds
        setTimeout(() => setSaveSuccess(false), 2000)
        
        // Move to next section
        setActiveSectionIndex((prevIndex) => Math.min(prevIndex + 1, sections.length - 1))
      }
    } catch (error) {
      setSaveError(error.response?.data?.message || 'Failed to save resume')
      console.error('Save error:', error)
    } finally {
      setIsSaving(false)
    }
  }

  

  const loadExistingResume = async()=>{
   try {
    const {data} = await api.get('/api/resumes/get/' + resumeId,{headers:
      {Authorization:token}
    })
    if(data.resume){
      setResumeData(data.resume)
      document.title = data.resume.title;
    }
   } catch (error) {
    console.log(error.message)
   }
  }

  const handleShare = () => {
    const frontendUrl = window.location.href.split('/app')[0];
    const resumeUrl = frontendUrl + '/view/' + resumeId;
    if (navigator.share) {
      navigator.share({
        url: resumeUrl,
        text: "My Resume",
      });
    } else {
      alert("Share is not supported in this browser");
    }
  };

  const handleDownload = () => {
    setShowDownloadModal(true);
  };

  const handleActualDownload = async () => {
    const blob = await pdf(<ResumePDF data={resumeData} accentColor={resumeData.accent_color} pageSize={selectedPageSize} />).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${resumeData.title || 'Resume'}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
    setShowDownloadModal(false);
  };

  const activeSection = sections[activeSectionIndex]

  const templateComponents = {
    classic: ClassicTemplate,
    "minimal-image": MinimalImageTemplate,
    minimal: MinimalTemplate,
    modern: ModernTemplate,
  };

  const saveResume = async()=>{
    try {
      setIsSaving(true)
      let updatedResumeData = structuredClone(resumeData)

      if(typeof resumeData.personal_info.image== 'object'){
        delete updatedResumeData.personal_info.image
      }

      const formData = new FormData();
      formData.append("resumeId",resumeId)
      formData.append('resumeData', JSON.stringify(updatedResumeData))
      removeBackground && formData.append("removeBackground","yes")
      typeof resumeData.personal_info.image== 'object' && formData.append("image",resumeData.personal_info.image)

      const {data}= await api.put('/api/resumes/update',formData,{headers:{Authorization: token}})
      setResumeData(data.resume)
      toast.success(data.message)
    } catch (error) {
      console.error("Error saving resume:",error)
      toast.error(error?.response?.data?.message || 'Failed to save resume')
    } finally {
      setIsSaving(false)
    }
  }

  const SelectedTemplate = templateComponents[resumeData.template] || ClassicTemplate;

  useEffect(()=>{
    loadExistingResume()
  },[resumeId])

  return (
    <div>

      <div className="max-w-7x1 mx-auto px-4 py-6">
        <Link to={'/app'} className="inline-flex gap-2 items-center text-slate-500 hover:text-slate-700 transition-all">
        <ArrowLeft className="size-4" /> Back to Dashboard
        </Link>
      </div>

      <div className="max-w-7x1 mx-auto px-4 pb-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/*Left Panel - Form  */}
            <div className="relative lg:col-span-5 overflow-hidden">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 pt-1">
            {/* progress bar using activeSectionIndex */}
              <hr className="absolute top-0 left-0 right-0 border-2 border-gray-200"/>
              <hr className="absolute top-0 left-0 h-1 bg-gradient-to-r from-green-500 to-green-600
              border-none transition-all duration-2000" style={{width: `${activeSectionIndex * 100 / (sections.length -1)}%`}}/>

            {/* Section Navigation  */}
            <div className="flex  items-center justify-between gap-2">
              <TempelateSelector selectedTemplate={resumeData.template} onChange=
              {(template)=>setResumeData(prev => ({...prev,template}))}/>
                <ColorPicker selectedColor={resumeData.accent_color} 
                onChange={(color)=> setResumeData(prev => ({...prev,accent_color: color}))}/>


              <div className="flex items-center">
              {activeSectionIndex !==0 &&(
                <button onClick={()=> setActiveSectionIndex((prevIndex)=> Math.max(
                  prevIndex-1, 0
                ))}  className="flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600
                 hover:bg-gray-50 transition-all" disabled={activeSectionIndex ===0 }>
                  <ChevronLeft className="size-4" /> Previous
                 </button>

              )}
              <button onClick={()=> setActiveSectionIndex((prevIndex)=> Math.min(
                  prevIndex + 1, sections.length - 1
                ))}  className={`ml-auto flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600
                hover:bg-gray-50 transition-all ${activeSectionIndex === sections.length -1 && 'opacity-50' }`} disabled={activeSectionIndex ===sections.length - 1 }>
                  Next <ChevronRight className="size-4" />
                 </button>
            </div>

          </div>
              {/* Form Content */}
              <div className="space-y-6">
                {activeSection.id === 'personal' && (
                  <PersonalInfoForm data={resumeData.personal_info} onChange=
                  {(data)=>setResumeData(prev => ({...prev,personal_info:
                  data }))} removeBackground={removeBackground} setRemoveBackground={setRemoveBackground}/>
                )}
                {activeSection.id === 'summary' && (
                  <ProfessionalSummaryForm data={resumeData.professional_summary} onChange={(data)=>setResumeData(prev => ({...prev,professional_summary: data}))} setResumeData={setResumeData}/>
                )}
                {activeSection.id === 'experience' && (
                  <ExperienceForm data={resumeData.experience} onChange={(data)=>setResumeData(prev => ({...prev,experience: data}))} setResumeData={setResumeData}/>
                )}
                {activeSection.id === 'education' && (
                  <EducationForm data={resumeData.education} onChange={(data)=>setResumeData(prev => ({...prev,education: data}))} setResumeData={setResumeData}/>
                )}
                {activeSection.id === 'projects' && (
                  <ProjectsForm data={resumeData.project} onChange={(data)=>setResumeData(prev => ({...prev,project: data}))} setResumeData={setResumeData}/>
                )}
                {activeSection.id === 'skills' && (
                  <SkillsForm data={resumeData.skills} onChange={(data)=>setResumeData(prev => ({...prev,skills: data}))} setResumeData={setResumeData}/>
                )}
              </div>
                {/* Single Save button for the form (bottom of left panel) */}
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => toast.promise(saveResume(), { loading: 'Saving..' })}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-400 transition-all"
                  >
                    <Save className="size-4" />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
          </div>
          {/* Right Panel - Preview */}
          <div className="lg:col-span-7 bg-gray-50 rounded-lg p-6">
            <div className="flex justify-end gap-2 mb-4">
              {isPublic && (
                <button onClick={handleShare} className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  <Share2 className="size-4" />
                  Share
                </button>
              )}
              <button onClick={() => setIsPublic(!isPublic)} className="flex items-center gap-2 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">
                {isPublic ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                {isPublic ? 'Public' : 'Private'}
              </button>
              <button onClick={handleDownload} className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                <Download className="size-4" />
                Download
              </button>
            </div>
            <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-4 h-full overflow-auto">
              {/* <SelectedTemplate data={resumeData} accentColor={resumeData.accent_color} /> */}
              <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color}/>
            </div>
          </div>
        </div>
      
      </div>

      {/* Download Modal */}
      {showDownloadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Preview Resume</h2>
              <button
                onClick={() => setShowDownloadModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Page Size
              </label>
              <select
                value={selectedPageSize}
                onChange={(e) => setSelectedPageSize(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="A4">A4</option>
                <option value="LETTER">Letter</option>
                <option value="LEGAL">Legal</option>
              </select>
            </div>

            <div className="mb-4 h-96 border border-gray-300 rounded">
              <PDFViewer width="100%" height="100%">
                <ResumePDF data={resumeData} accentColor={resumeData.accent_color} pageSize={selectedPageSize} />
              </PDFViewer>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDownloadModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleActualDownload}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center gap-2"
              >
                <Download className="size-4" />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default ResumeBuilder