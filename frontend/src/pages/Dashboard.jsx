import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Plus, CloudUpload, Loader2, FilePen, Trash2, Pencil, X } from 'lucide-react';
import api from '../configs/api.js';
import { toast } from 'react-hot-toast';
import pdfToText from 'react-pdftotext';
// import dummyResumeData from '../assets/assets.js';

const Dashboard = () => {


  const navigate = useNavigate()
  const { user, token } = useSelector(state => state.auth)
  const [allResumes, setAllResumes] = useState([])
  const [createResume, setCreateResume] = useState(false)
  const [uploadResume, setUploadResume] = useState(false)
  const [title, setTitle] = useState('')
  const [resume, setResume] = useState(null)
  const [editResumeId, setEditResumeId] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const colors = ['#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#3b82f6']

  const loadAllResumes = async () => {
    try {
      const { data } = await api.get('/api/users/resumes', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setAllResumes(data.resumes)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
  }

  const createResumeHandler = async (e) => {
    e.preventDefault()
    try {
      const { data } = await api.post('/api/resumes/create', { title }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setAllResumes([...allResumes, data.resume])
      setTitle('')
      setCreateResume(false)
      navigate(`/app/builder/${data.resume._id}`)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
  }

  const uploadResumeHandler = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const text = await pdfToText(resume)
      const { data } = await api.post('/api/ai/upload-resume', { title, resumeText: text }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setAllResumes([...allResumes, data.resume])
      setTitle('')
      setResume(null)
      setUploadResume(false)
      navigate(`/app/builder/${data.resume._id}`)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    } finally {
      setIsLoading(false)
    }
  }

  

const editTitle = async (e, passedId) => {
  if (e && typeof e.preventDefault === "function") e.preventDefault();

  const resumeId = passedId ?? editResumeId;
  if (!resumeId) {
    toast.error("No resume selected.");
    return;
  }

  const newTitle = title && title.toString().trim();
  if (!newTitle) {
    toast.error("Title cannot be empty.");
    return;
  }

  try {
    const payload = { title: newTitle };

    // Optional debug: inspect payload before sending
    console.log("PUT payload:", payload);

    const response = await api.put(`/api/resumes/update/${resumeId}`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const respData = response && response.data ? response.data : null;
    const updatedTitle = (respData && respData.resume && respData.resume.title) ? respData.resume.title : newTitle;

    setAllResumes((prev) => prev.map(r => r._id === resumeId ? { ...r, title: updatedTitle } : r));
    setTitle("");
    setEditResumeId("");
    toast.success((respData && respData.message) || "Updated");
  } catch (err) {
    console.error("update error:", err);
    const serverMsg = err && err.response && err.response.data && err.response.data.message ? err.response.data.message : err.message;
    toast.error(serverMsg || "Update failed");
  }
};



  const deleteResume = async (resumeId) => {
    const confirm = window.confirm('Are you sure you want to delete this resume?')
    if (confirm) {
      try {
        const { data } = await api.delete(`/api/resumes/delete/${resumeId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setAllResumes(allResumes.filter(r => r._id !== resumeId))
        toast.success(data.message)
      } catch (error) {
        toast.error(error?.response?.data?.message || error.message)
      }
    }
  }

  useEffect(() => {
    loadAllResumes()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl">
        <p className="mb-8 text-2xl font-bold text-gray-900">Hi, {user?.name}</p>
        
        <div className="mb-12 flex flex-col gap-4 rounded-xl bg-white p-8 shadow-lg md:flex-row">
          <button
            onClick={() => setCreateResume(true)}
            className="flex-1 rounded-xl border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-6 text-left transition-all hover:shadow-md"
          >
            <Plus className="ml-auto h-12 w-12 text-green-500" />
            <p className="mt-4 text-2xl font-bold text-gray-900">Create Resume</p>
          </button>
          
          <button
            onClick={() => setUploadResume(true)}
            className="flex-1 rounded-xl border border-purple-200 bg-gradient-to-r from-purple-50 to-violet-50 p-6 text-left transition-all hover:shadow-md"
          >
            <CloudUpload className="ml-auto h-12 w-12 bg-gradient-to-r from-purple-300 to-purple-500 text-white" />
            <p className="mt-4 text-2xl font-bold text-gray-900">Upload Existing</p>
          </button>
        </div>

        <hr className="my-12 border-gray-200" />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {allResumes.map((resume, index) => {
            const baseColor = colors[index % colors.length]
            return (
              <div
                key={resume._id}
                onClick={() => navigate(`/app/builder/${resume._id}`)}
                className="group rounded-xl border-2 p-6 shadow-sm transition-all hover:shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${baseColor}10 0%, ${baseColor}40 100%)`,
                  borderColor: baseColor
                }}
              >
                <div className="flex items-start justify-between">
                  <FilePen className="h-8 w-8 text-gray-500 group-hover:text-blue-500" style={{ color: baseColor }} />
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100">
                    <button onClick={(e) => {
                      e.stopPropagation()
                      setEditResumeId(resume._id)
                      setTitle(resume.title)
                    }}>
                      <Pencil className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                    </button>
                    <button onClick={(e) => {
                      e.stopPropagation()
                      deleteResume(resume._id)
                    }}>
                      <Trash2 className="h-5 w-5 text-red-500 hover:text-red-700" />
                    </button>
                  </div>
                </div>
                <p className="mt-4 font-semibold text-gray-900" style={{ color: baseColor }}>{resume.title}</p>
                <p className="mt-1 text-sm text-gray-500" style={{ color: `${baseColor}90` }}>
                  Updated on {new Date(resume.updatedAt).toLocaleDateString()}
                </p>
              </div>
            )
          })}
        </div>

        {/* Create Resume Modal */}
        {createResume && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={() => {
            setCreateResume(false)
            setTitle('')
          }}>
            <form onSubmit={createResumeHandler} className="w-full max-w-md rounded-xl bg-white p-8 shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Create Resume</h2>
                <X className="h-6 w-6 cursor-pointer text-gray-500 hover:text-gray-700" onClick={() => {
                  setCreateResume(false)
                  setTitle('')
                }} />
              </div>
              <input
                type="text"
                placeholder="Enter resume title"
                className="mt-6 w-full rounded-lg border border-gray-200 p-4 outline-none focus:ring-1 focus:ring-green-500"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <button type="submit" className="mt-6 w-full rounded-lg bg-green-600 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-green-700">
                Create Resume
              </button>
            </form>
          </div>
        )}

        {/* Upload Resume Modal */}
        {uploadResume && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={() => {
            setUploadResume(false)
            setTitle('')
            setResume(null)
          }}>
            <form onSubmit={uploadResumeHandler} className="w-full max-w-md rounded-xl bg-white p-8 shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Upload Resume</h2>
                <X className="h-6 w-6 cursor-pointer text-gray-500 hover:text-gray-700" onClick={() => {
                  setUploadResume(false)
                  setTitle('')
                  setResume(null)
                }} />
              </div>
              <input
                type="text"
                placeholder="Enter resume title"
                className="mt-6 w-full rounded-lg border border-gray-200 p-4 outline-none focus:ring-1 focus:ring-green-500"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <div className="mt-6">
                <label htmlFor="resumeInput" className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 hover:border-purple-400">
                  {resume ? (
                    <p className="text-sm text-green-700">{resume.name}</p>
                  ) : (
                    <>
                      <CloudUpload className="h-8 w-8 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">Select resume file</p>
                    </>
                  )}
                </label>
                <input
                  id="resumeInput"
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => setResume(e.target.files[0])}
                />
              </div>
              <button 
                type="submit" 
                disabled={isLoading || !resume}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-purple-700 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {isLoading ? 'Uploading...' : 'Upload Resume'}
                  </>
                ) : (
                  'Upload Resume'
                )}
              </button>
            </form>
          </div>
        )}

        {/* Edit Resume Modal */}
        {editResumeId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={() => {
            setEditResumeId('')
            setTitle('')
          }}>
            <form onSubmit={editTitle} className="w-full max-w-md rounded-xl bg-white p-8 shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Edit Resume Title</h2>
                <X className="h-6 w-6 cursor-pointer text-gray-500 hover:text-gray-700" onClick={() => {
                  setEditResumeId('')
                  setTitle('')
                }} />
              </div>
              <input
                type="text"
                placeholder="Enter new title"
                className="mt-6 w-full rounded-lg border border-gray-200 p-4 outline-none focus:ring-1 focus:ring-green-500"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <button type="submit" className="mt-6 w-full rounded-lg bg-green-600 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-green-700">
                Update
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
