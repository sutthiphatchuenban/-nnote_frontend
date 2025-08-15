import React, { useState, useEffect } from 'react';
import { Search, Globe } from 'lucide-react';
import NoteCard from '../components/NoteCard';
import { publicAPI } from '../services/api';

interface Note {
  id: string;
  title: string;
  content: string;
  isPublic: boolean;
  isAnonymous: boolean;
  slug: string;
  createdAt: string;
  updatedAt: string;
  author?: {
    name: string;
    avatar?: string;
  };
}

const PublicNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadNotes();
  }, [page]);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const response = await publicAPI.getPublicNotes(page, 12);
      setNotes(response.notes);
      setTotalPages(response.pagination.totalPages);
    } catch (error: any) {
      console.error('Failed to load public notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Globe className="h-12 w-12 theme-primary" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          บันทึกสาธารณะ
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          ค้นพบและอ่านบันทึกที่น่าสนใจจากชุมชน NNote
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-8 max-w-xl mx-auto">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="ค้นหาบันทึกสาธารณะ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white text-lg"
        />
      </div>

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🌐</div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {searchTerm ? 'ไม่พบบันทึกที่ค้นหา' : 'ยังไม่มีบันทึกสาธารณะ'}
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {searchTerm ? 'ลองค้นหาด้วยคำอื่น' : 'เป็นคนแรกที่แชร์บันทึกสาธารณะ'}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredNotes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    page === pageNum
                      ? 'btn-primary'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PublicNotes;