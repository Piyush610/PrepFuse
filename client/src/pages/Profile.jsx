import React, { useState, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { User, FileText, Upload, Save, CheckCircle2, AlertCircle } from 'lucide-react';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });
  const resumeRef = useRef(null);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: '', type: '' });
    try {
      const { data } = await api.put('/auth/profile', formData);
      setMsg({ text: 'Profile updated successfully!', type: 'success' });
      // update local storage context here if needed
      const current = JSON.parse(localStorage.getItem('user'));
      localStorage.setItem('user', JSON.stringify({ ...current, ...data }));
    } catch (error) {
      setMsg({ text: error.response?.data?.message || 'Error updating profile', type: 'error' });
    }
    setLoading(false);
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setMsg({ text: 'Only PDF files are allowed for resumes.', type: 'error' });
      return;
    }

    setUploadLoading(true);
    const form = new FormData();
    form.append('resume', file);

    try {
      const { data } = await api.post('/auth/upload-resume', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMsg({ text: 'Resume uploaded successfully!', type: 'success' });
      setResume(data.resumeUrl);
    } catch (error) {
      setMsg({ text: error.response?.data?.message || 'Error uploading resume', type: 'error' });
    }
    setUploadLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>

      {msg.text && (
        <div className={`mb-6 p-4 rounded-md flex items-center gap-3 ${msg.type === 'success' ? 'bg-green-100/50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800' : 'bg-red-100/50 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800'}`}>
          {msg.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {msg.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Info */}
        <div className="bg-card border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6 border-b pb-4">
            <User className="text-primary w-6 h-6" />
            <h2 className="text-xl font-semibold">Personal Information</h2>
          </div>
          
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border rounded-md bg-background focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border rounded-md bg-background focus:ring-2 focus:ring-primary outline-none"
                placeholder="+1 234 567 8900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-muted-foreground">Email (Read-only)</label>
              <input
                type="email"
                value={user?.email || ''}
                readOnly
                className="w-full px-4 py-2 border rounded-md bg-muted text-muted-foreground cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full flex justify-center items-center gap-2 py-2.5 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 disabled:opacity-70 transition-colors"
            >
              {loading ? 'Saving...' : <><Save className="w-4 h-4" /> Save Changes</>}
            </button>
          </form>
        </div>

        {/* Resume Upload */}
        <div className="bg-card border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6 border-b pb-4">
            <FileText className="text-primary w-6 h-6" />
            <h2 className="text-xl font-semibold">Resume PDF</h2>
          </div>

          <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => resumeRef.current.click()}>
            <input 
              type="file" 
              accept=".pdf" 
              className="hidden" 
              ref={resumeRef}
              onChange={handleResumeUpload}
            />
            {uploadLoading ? (
              <div className="animate-pulse flex flex-col items-center">
                 <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin mb-3"></div>
                 <p className="text-muted-foreground font-medium">Uploading to Cloudinary...</p>
              </div>
            ) : (
              <>
                <Upload className="w-10 h-10 text-muted-foreground mb-3" />
                <p className="text-center text-sm font-medium">Click to upload your resume</p>
                <p className="text-xs text-muted-foreground mt-1">PDF format only. Max size 5MB.</p>
              </>
            )}
          </div>

          {(resume || user?.resumeUrl) && (
            <div className="mt-6 p-4 bg-muted border rounded-md flex justify-between items-center">
              <span className="text-sm font-medium truncate flex-1 flex items-center gap-2">
                 <FileText className="w-4 h-4 text-primary" /> Current Resume Uploaded
              </span>
              <a href={resume || user?.resumeUrl} target="_blank" rel="noreferrer" className="text-sm font-medium text-primary hover:underline shrink-0">
                 View PDF
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
