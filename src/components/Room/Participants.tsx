'use client';

import { FC } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ParticipantsProps {
  participants: any[];
}

const Participants: FC<ParticipantsProps> = ({ participants }) => {
  return (
    <div className="w-full md:w-1/3 relative p-[2px] rounded-xl overflow-hidden">
      {/* Glowing Border Animation */}
      <div className="absolute inset-0 z-0 animate-pulse bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 opacity-40 blur-sm pointer-events-none" />

      {/* Inner Content */}
      <div className="relative z-10 bg-[#0f172a] text-white rounded-xl shadow-lg p-4 h-[500px] overflow-y-auto border border-zinc-700 custom-scrollbar">
        <h3 className="text-xl font-bold mb-4 tracking-wide flex items-center gap-2">
          👥 Participants
        </h3>

        <ul className="space-y-3">
          <TooltipProvider>
            {participants.map((user, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center gap-3 px-3 py-2 rounded-md bg-zinc-800 hover:bg-zinc-700 transition-colors group"
              >
                <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-rose-500 p-[2px]">
                  <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center">
                    <Avatar className="w-8 h-8 bg-zinc-800 text-white">
                      <AvatarFallback className="bg-zinc-800 text-white">
                        <User className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-base font-medium truncate max-w-[140px]">
                      {user?.username || 'Anonymous'}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{user?.username || 'Anonymous'}</p>
                  </TooltipContent>
                </Tooltip>
              </motion.li>
            ))}
          </TooltipProvider>
        </ul>
      </div>
    </div>
  );
};

export default Participants;
