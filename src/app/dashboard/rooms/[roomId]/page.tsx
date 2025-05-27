'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import io from 'socket.io-client';
import axios from 'axios';

import RoomHeader  from '@/components/Room/RoomHeader';
import CodeEditor from '@/components/Room/CodeEditor';
import ChatBox from '@/components/Room/ChatBox';
import Participants from '@/components/Room/Participants';

let socket: any;

interface User {
  _id: string;
  username: string;
  email?: string;
}

interface Message {
  user: User;
  message: string;
}

const RoomPage = () => {
  const { roomId } = useParams();

  const [room, setRoom] = useState<any>(null);
  const [user, setUser] = useState<User | null>(null);
  const [code, setCode] = useState('');
  const [languageId, setLanguageId] = useState(63); // C++ default
  const [stdin, setStdin] = useState('');
  const [output, setOutput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [participants, setParticipants] = useState<User[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchRoom = async () => {
      try {
        const res = await axios.get(`https://zcoder-backend-9aq1.onrender.com/api/rooms/${roomId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRoom(res.data);
        setCode(res.data.currentCode || '');
        setParticipants(res.data.participants);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchUser = async () => {
      try {
        const res = await axios.get('https://zcoder-backend-9aq1.onrender.com/api/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRoom();
    fetchUser();
  }, [roomId]);

  useEffect(() => {
    if (!user) return; // wait until user is loaded

    socket = io('https://zcoder-backend-9aq1.onrender.com');

    // Send user info along with roomId here!
    socket.emit('joinRoom', { roomId, user });

    socket.on('participantsUpdate', (updatedParticipants: User[]) => {
      setParticipants(updatedParticipants);
    });

    socket.on('codeUpdate', (newCode: string) => {
      setCode(newCode);
    });

    socket.on('receiveMessage', ({ message, user }: Message) => {
      setMessages((prev) => [...prev, { message, user }]);
    });

    socket.on('executionResult', ({ output }: { output: string }) => {
      setOutput(output);
    });

    return () => {
      socket.disconnect();
    };
  }, [user, roomId]);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    socket.emit('codeChange', { roomId, code: newCode });
  };

  const handleRunCode = () => {
    socket.emit('runCode', { roomId, code, language_id: languageId, stdin });
  };

  const handleSendMessage = (msg: string) => {
    if (!user) return;
    socket.emit('sendMessage', { roomId, message: msg, user });
    setMessages(prev => [...prev, { user, message: msg }]);
  };

  return (
    <div className="p-6 space-y-4">
      {room && user && (
        <>
          <RoomHeader room={room} user={user} />
          <CodeEditor
            code={code}
            onCodeChange={handleCodeChange}
            languageId={languageId}
            setLanguageId={setLanguageId}
            stdin={stdin}
            setStdin={setStdin}
            output={output}
            onRunCode={handleRunCode}
          />
          <div className="flex flex-col md:flex-row gap-4">
            <ChatBox messages={messages} onSend={handleSendMessage} />
            <Participants participants={participants} />
          </div>
        </>
      )}
    </div>
  );
};

export default RoomPage;
