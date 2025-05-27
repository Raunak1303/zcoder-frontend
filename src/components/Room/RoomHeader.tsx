'use client';

import { FC } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Trash2, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

interface RoomHeaderProps {
  room: any;
  user: any;
}

const RoomHeader: FC<RoomHeaderProps> = ({ room, user }) => {
  const router = useRouter();

  const API_BASE = '/api/rooms';

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  };

  const handleLeaveRoom = async () => {
    try {
      const response = await fetch(`${API_BASE}/${room._id}/leave`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to leave room');
      }

      toast.success('You left the room');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDeleteRoom = async () => {
    if (!confirm('Are you sure you want to delete this room? This action cannot be undone.')) return;

    try {
      const response = await fetch(`${API_BASE}/${room._id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to delete room');
      }

      toast.success('Room deleted');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="bg-[#0f172a] text-white p-4 rounded-xl shadow-md flex flex-col gap-2">
      <div>
        <h2 className="text-2xl font-bold">{room?.name || 'Room'}</h2>
        <p className="text-sm text-indigo-300">Hosted by: {user?.name || 'You'}</p>
      </div>
      {room?.description && (
        <p className="text-sm text-gray-300 italic">"{room.description}"</p>
      )}
      <div className="flex gap-2 mt-2">
        <Button
          className="bg-gradient-to-r from-indigo-500 to-rose-500 text-white"
          onClick={handleDeleteRoom}
        >
          <Trash2 className="w-4 h-4 mr-1" /> Delete
        </Button>
        <Button
          className="bg-gradient-to-r from-indigo-500 to-rose-500 text-white"
          onClick={handleLeaveRoom}
        >
          <LogOut className="w-4 h-4 mr-1" /> Leave
        </Button>
      </div>
    </div>
  );
};

export default RoomHeader;
