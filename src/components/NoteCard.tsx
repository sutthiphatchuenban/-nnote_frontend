import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Eye, EyeOff, Edit, Trash2, ExternalLink } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  isPublic: boolean;
  isAnonymous: boolean;
  slug: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  author?: {
    name: string;
    avatar?: string;
  };
}

interface NoteCardProps {
  note: Note;
  showActions?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, showActions = false, onEdit, onDelete }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength) + '...';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
          {note.title}
        </h3>
        <div className="flex items-center space-x-2 ml-4">
          {note.isPublic ? (
            <Eye className="h-4 w-4 text-green-600 dark:text-green-400" />
          ) : (
            <EyeOff className="h-4 w-4 text-gray-400" />
          )}
        </div>
      </div>

      {note.imageUrl && (
        <div className="mb-4">
          <img
            src={note.imageUrl}
            alt={note.title}
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>
      )}
      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
        {truncateContent(note.content)}
      </p>

      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(note.createdAt)}</span>
          </div>
          
          {note.author && !note.isAnonymous && (
            <div className="flex items-center space-x-1">
              <User className="h-3 w-3" />
              <span>{note.author.name}</span>
            </div>
          )}
          
          {note.isAnonymous && (
            <span className="text-gray-400 italic">ไม่ระบุชื่อ</span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {note.isPublic && (
            <Link
              to={`/note/${note.slug}`}
              className="flex items-center space-x-1 theme-primary hover:opacity-80 transition-opacity"
              title="ดูแบบสาธารณะ"
            >
              <ExternalLink className="h-3 w-3" />
            </Link>
          )}
          
          {showActions && (
            <>
              <button
                onClick={() => onEdit?.(note.id)}
                className="theme-primary hover:opacity-80 transition-opacity"
                title="แก้ไข"
              >
                <Edit className="h-3 w-3" />
              </button>
              <button
                onClick={() => onDelete?.(note.id)}
                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                title="ลบ"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
