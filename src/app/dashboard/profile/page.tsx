'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function ProfilePage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const { data } = await axios.get('/api/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setUsername(data.username);
        setBio(data.bio || '');
        setEmail(data.email || '');
        setProfilePicture(data.profilePicture || null);
      } catch (error) {
        toast.error('Failed to fetch profile');
        console.error(error);
      }
    }
    fetchProfile();
  }, []);

  useEffect(() => {
    if (!selectedFile) {
      setPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const uploadPicture = async () => {
    if (!selectedFile) return toast.warning('Select a picture first');
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('profilePicture', selectedFile);

      const { data } = await axios.post('/api/profile/upload-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      toast.success('Profile picture uploaded!');
      setProfilePicture(data.profilePicture);
      setSelectedFile(null);
      setPreview(null);
    } catch (err) {
      toast.error('Upload failed');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    setUpdating(true);
    try {
      await axios.put(
        '/api/profile',
        { username, bio },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      toast.success('Profile updated!');
    } catch (err) {
      toast.error('Update failed');
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const profileImageURL = profilePicture
    ? profilePicture.startsWith('http')
      ? profilePicture
      : `https://zcoder-backend-9aq1.onrender.com${profilePicture}`
    : null;

  return (
    <div className="min-h-screen px-6 py-10 bg-[#0f172a] text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-10 text-center bg-gradient-to-r from-indigo-400 to-rose-500 text-transparent bg-clip-text">
          Your Profile
        </h1>

        <div className="bg-[#1e293b] border border-zinc-700 p-6 rounded-2xl shadow-md space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex flex-col items-center">
              <div className="w-40 h-40 rounded-full overflow-hidden border-2 border-zinc-700 shadow-md">
                <img
                  src={preview || profileImageURL || '/default-avatar.png'}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <Input
                type="file"
                accept="image/*"
                className="mt-4 bg-black text-white border border-zinc-600"
                onChange={onFileChange}
              />
              <Button
                onClick={uploadPicture}
                disabled={loading || !selectedFile}
                className="mt-2 bg-gradient-to-r from-indigo-500 to-rose-500 text-white hover:opacity-90 w-full"
              >
                {loading ? 'Uploading...' : 'Upload Picture'}
              </Button>
            </div>

            <div className="flex-1 space-y-4 w-full">
              <div>
                <label className="block mb-1 text-sm font-medium text-zinc-300">Email</label>
                <Input
                  value={email}
                  readOnly
                  className="bg-black text-white border border-zinc-600 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-zinc-300">Username</label>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-black text-white border border-zinc-600"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-zinc-300">Bio</label>
                <Textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="bg-black text-white border border-zinc-600"
                  rows={4}
                />
              </div>
              <Button
                onClick={updateProfile}
                disabled={updating}
                className="bg-gradient-to-r from-indigo-500 to-rose-500 text-white hover:opacity-90 w-full"
              >
                {updating ? 'Updating...' : 'Update Profile'}
              </Button>
            </div>
          </div>
        </div>

        {/* Problem Analysis Section */}
        <div className="mt-10 bg-[#1e293b] border border-zinc-700 p-6 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-indigo-400 to-rose-400 text-transparent bg-clip-text flex items-center gap-2">
            <span className="inline-block text-[initial]">📊</span> Problem Analysis
          </h2>
        <p className="text-zinc-400 text-sm italic">Coming soon...</p>
        </div>
      </div>
    </div>
  );
}
