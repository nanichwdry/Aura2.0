import React from 'react';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';

interface GroundingChunk {
  maps?: {
    uri: string;
    title: string;
  };
  web?: {
    uri: string;
    title: string;
  };
}

interface MapsDisplayProps {
  chunks: GroundingChunk[];
}

export const MapsDisplay: React.FC<MapsDisplayProps> = ({ chunks }) => {
  const mapsChunks = chunks.filter(chunk => chunk.maps);
  const webChunks = chunks.filter(chunk => chunk.web);

  if (mapsChunks.length === 0 && webChunks.length === 0) return null;

  return (
    <div className="mt-4 space-y-3">
      {mapsChunks.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {mapsChunks.map((chunk, idx) => (
            <motion.a
              key={idx}
              href={chunk.maps?.uri}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-center gap-3 p-3 bg-white border border-zinc-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all group"
            >
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-100">
                <MapPin size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-zinc-900 truncate">
                  {chunk.maps?.title}
                </div>
                <div className="text-xs text-zinc-500 flex items-center gap-1">
                  View on Google Maps <ExternalLink size={10} />
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      )}

      {webChunks.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {webChunks.map((chunk, idx) => (
            <a
              key={idx}
              href={chunk.web?.uri}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-3 py-1 bg-zinc-100 text-zinc-600 rounded-full hover:bg-zinc-200 transition-colors flex items-center gap-1"
            >
              {chunk.web?.title} <ExternalLink size={10} />
            </a>
          ))}
        </div>
      )}
    </div>
  );
};
