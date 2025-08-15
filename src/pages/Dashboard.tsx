import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Search } from 'lucide-react';
import NoteCard from '../components/NoteCard';
import { notesAPI } from '../services/api';

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

const Dashboard = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const response = await notesAPI.getAllNotes();
      setNotes(response.notes);
    } catch (error: any) {
      console.error('Failed to load notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('คุณแน่ใจหรือว่าต้องการลบบันทึกนี้?')) return;

    try {
      await notesAPI.deleteNote(id);
      setNotes(notes.filter(note => note.id !== id));
    } catch (error: any) {
      alert(error.message || 'ลบบันทึกไม่สำเร็จ');
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">บันทึกของฉัน</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            จัดการบันทึกส่วนตัวและบันทึกที่แชร์สาธารณะ
          </p>
        </div>
        
        <button
          onClick={() => navigate('/create')}
          className="flex items-center space-x-2 px-4 py-2 btn-primary rounded-lg transition-colors"
        >
          <PlusCircle className="h-5 w-5" />
          <span>สร้างบันทึกใหม่</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="ค้นหาบันทึก..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
        />
      </div>

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📝</div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {searchTerm ? 'ไม่พบบันทึกที่ค้นหา' : 'ยังไม่มีบันทึก'}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {searchTerm ? 'ลองค้นหาด้วยคำอื่น' : 'เริ่มสร้างบันทึกแรกของคุณกันเถอะ'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => navigate('/create')}
              className="inline-flex items-center space-x-2 px-4 py-2 btn-primary rounded-lg transition-colors"
            >
              <PlusCircle className="h-5 w-5" />
              <span>สร้างบันทึกแรก</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              showActions={true}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;