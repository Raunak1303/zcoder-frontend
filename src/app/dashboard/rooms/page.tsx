'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface Room {
  _id: string
  name: string
  description: string
  isPublic: boolean
}

export default function RoomsPage() {
  const router = useRouter()
  const [rooms, setRooms] = useState<Room[]>([])
  const [creating, setCreating] = useState(false)
  const [description, setDescription] = useState('') 
  const [roomName, setRoomName] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)

  const fetchRooms = async () => {
  try {
    const res = await fetch('https://zcoder-backend-9aq1.onrender.com/api/rooms', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    const data = await res.json()

    const transformedRooms = data.map((room: any) => ({
      ...room,
      isPrivate: !room.isPublic, // 👈 transform to match frontend interface
    }))

    setRooms(transformedRooms)
  } catch (err) {
    toast.error('Failed to fetch rooms')
  }
}

  useEffect(() => {
    fetchRooms()
  }, [])

  const handleCreateRoom = async () => {
    if (!roomName.trim()) {
      toast.error('Room name is required')
      return
    }

    try {
      const res = await fetch('https://zcoder-backend-9aq1.onrender.com/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ name: roomName, description, isPublic: !isPrivate }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.message || 'Failed to create room')
      } else {
        toast.success('Room created!')
        setCreating(false)
        setRoomName('')
        setDescription('') 
        setIsPrivate(false)
        fetchRooms()
      }
    } catch (err) {
      toast.error('Error creating room')
    }
  }

  const handleJoin = async (id: string) => {
  toast.success(`Joining room...`)
  router.push(`/dashboard/rooms/${id}`)
}
  return (
    <div className="min-h-screen px-6 py-10 bg-[#0f172a] text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-rose-500 text-transparent bg-clip-text">
          ZCoder Rooms
        </h1>

        {/* Create Room Section */}
        {creating ? (
          <div className="bg-[#1e293b] p-6 rounded-xl border border-zinc-700 mb-6 space-y-4">
            <Label className="block text-zinc-300">Room Name</Label>
            <Input
              className="bg-black text-white border border-zinc-600"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />
            <Label className="block text-zinc-300 mt-4">Description</Label>
            <Input
              className="bg-black text-white border border-zinc-600"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="private"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
              />
              <Label htmlFor="private" className="text-zinc-300">
                Private Room
              </Label>
            </div>
            <div className="flex gap-4">
              <Button
                className="bg-gradient-to-r from-indigo-500 to-rose-500 text-white hover:opacity-90"
                onClick={handleCreateRoom}
              >
                Create
              </Button>
              <Button
                variant="outline"
                className="bg-black text-white border border-zinc-600 hover:bg-zinc-800"
                onClick={() => setCreating(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            className="mb-6 bg-gradient-to-r from-indigo-500 to-rose-500 text-white hover:opacity-90"
            onClick={() => setCreating(true)}
          >
            Create Room
          </Button>
        )}

        {/* Room Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {rooms.length > 0 ? (
            rooms.map((room) => (
              <div
                key={room._id}
                className="p-5 bg-[#1e293b] border border-zinc-700 rounded-xl shadow-md"
              >
                <h2 className="text-2xl font-semibold text-white mb-2">{room.name}</h2>
                <p className="text-zinc-300 text-sm mb-2">
                  {room.description || 'No description'}
                </p>
                <p className="text-zinc-400 text-sm mb-4">
                  {room.isPublic ? '🌐 Public Room' : '🔒 Private Room'}
                </p>
                <div className="flex gap-3">
                  <Button
                    className="bg-gradient-to-r from-indigo-500 to-rose-500 text-white hover:opacity-90"
                    onClick={() => handleJoin(room._id)}
                  >
                    Join
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-zinc-400">No rooms available. Try creating one!</p>
          )}
        </div>
      </div>
    </div>
  )
}
