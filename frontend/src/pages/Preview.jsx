import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { dummyResumeData } from "../assets/assets";
import { ArrowLeft, Download, Share2 } from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import ResumePDF from "../components/ResumePDF";
import ResumePreview from "../components/ResumePreview";
import Loader from "../components/Loader";

const Preview = () => {
  const { resumeId } = useParams();
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadResumeData = async () => {
    try {
      console.log('Loading resume for preview with ID:', resumeId);

      // First check localStorage for user-created resumes
      const savedResumes = JSON.parse(localStorage.getItem('userResumes') || '[]');
      let resume = savedResumes.find(resume => resume._id === resumeId);

      // If not found in localStorage, check dummy data
      if (!resume) {
        resume = dummyResumeData.find(resume => resume._id === resumeId);
        console.log('Found in dummy data:', resume);
      } else {
        console.log('Found in localStorage:', resume);
      }

      if (resume) {
        setResumeData(resume);
        document.title = `${resume.title} - Preview`;
      } else {
        console.log('No resume found with ID:', resumeId);
        setResumeData(null);
      }
    } catch (error) {
      console.error('Error loading resume data:', error);
      setResumeData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!resumeData) return;

    try {
      const blob = await pdf(<ResumePDF data={resumeData} accentColor={resumeData.accent_color} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${resumeData.title || 'Resume'}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  const handleShare = () => {
    const currentUrl = window.location.href;
    if (navigator.share) {
      navigator.share({
        url: currentUrl,
        text: `Check out my resume: ${resumeData?.title || 'Resume'}`,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(currentUrl).then(() => {
        alert('Link copied to clipboard!');
      });
    }
  };

  useEffect(() => {
    loadResumeData();
  }, [resumeId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" message="Loading resume preview..." />
      </div>
    );
  }

  if (!resumeData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Resume Not Found</h1>
          <p className="text-gray-600 mb-6">The resume you're looking for doesn't exist.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Go to Home Page
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/app"
                className="inline-flex gap-2 items-center text-slate-500 hover:text-slate-700 transition-all"
              >
                <ArrowLeft className="size-4" /> Back to Dashboard
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{resumeData.title}</h1>
                <p className="text-sm text-gray-500">Resume Preview</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Share2 className="size-4" />
                Share
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Download className="size-4" />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Resume Preview */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <ResumePreview
            data={resumeData}
            template={resumeData.template}
            accentColor={resumeData.accent_color}
          />
        </div>
      </div>
    </div>
  );
};

export default Preview;
