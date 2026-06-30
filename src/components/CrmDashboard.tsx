import { useState, useRef } from 'react';
import { Student } from '../types';
import { Search, Plus, Edit2, Save, X, User, Mail, MapPin, GraduationCap, Trash2, Download, Upload } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useLanguage } from '../LanguageContext';

interface CrmDashboardProps {
  students: Student[];
  onUpdateStudent: (student: Student) => void;
  onAddStudent: (student: Omit<Student, 'id'>) => void;
  onDeleteStudent: (id: string) => void;
}

export function CrmDashboard({ students, onUpdateStudent, onAddStudent, onDeleteStudent }: CrmDashboardProps) {
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();
  
  const [formData, setFormData] = useState<Partial<Student>>({});

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.village.toLowerCase().includes(search.toLowerCase()) ||
    (s.sponsorName && s.sponsorName.toLowerCase().includes(search.toLowerCase()))
  );

  const exportToExcel = () => {
    const data = filteredStudents.map(s => ({
      ID: s.id,
      Name: s.name,
      Age: s.age,
      School: s.school,
      Grade: s.grade,
      Village: s.village,
      'Sponsor Name': s.sponsorName || '',
      'Sponsor Email': s.sponsorEmail || '',
      Bio: s.bio || ''
    }));
    
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    XLSX.writeFile(wb, "nandri_students_export.xlsx");
  };

  const importFromExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);
      
      data.forEach((row: any) => {
        onAddStudent({
          name: row.Name || '',
          age: parseInt(row.Age) || 0,
          school: row.School || '',
          grade: row.Grade || '',
          village: row.Village || '',
          photoUrl: `https://i.pravatar.cc/150?u=${Math.random()}`,
          sponsorName: row['Sponsor Name'] || '',
          sponsorEmail: row['Sponsor Email'] || '',
          bio: row.Bio || ''
        });
      });
    };
    reader.readAsBinaryString(file);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const startEdit = (student: Student) => {
    setFormData(student);
    setEditingId(student.id);
    setIsAdding(false);
  };

  const startAdd = () => {
    setFormData({
      name: '', age: 0, school: '', village: '', grade: '', photoUrl: '', sponsorName: '', sponsorEmail: '', bio: ''
    });
    setIsAdding(true);
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
  };

  const handleSave = () => {
    if (isAdding) {
      onAddStudent(formData as Omit<Student, 'id'>);
    } else if (editingId) {
      onUpdateStudent(formData as Student);
    }
    setEditingId(null);
    setIsAdding(false);
  };

  return (
    <div className="pb-24 pt-4 px-4 w-full max-w-4xl mx-auto">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-1">{t('crmTitle')}</h1>
          <p className="text-sm text-gray-500 font-medium">{t('crmSubtitle')}</p>
        </div>
        <div className="flex gap-2">
          <input 
            type="file" 
            accept=".xlsx, .xls, .csv" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={importFromExcel} 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium shadow-sm"
          >
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">{t('import')}</span>
          </button>
          <button 
            onClick={exportToExcel}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">{t('export')}</span>
          </button>
          <button 
            onClick={startAdd}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">{t('addRecord')}</span>
          </button>
        </div>
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
          placeholder={t('crmSearchPlaceholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {(editingId || isAdding) && (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-green-100 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900">{isAdding ? 'Add New Record' : 'Edit Record'}</h2>
            <button onClick={cancelEdit} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"><X className="w-5 h-5"/></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Child Name</label>
              <input type="text" className="w-full p-2 border border-gray-200 rounded-lg text-sm" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Age</label>
              <input type="number" className="w-full p-2 border border-gray-200 rounded-lg text-sm" value={formData.age || ''} onChange={e => setFormData({...formData, age: parseInt(e.target.value) || 0})} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">School</label>
              <input type="text" className="w-full p-2 border border-gray-200 rounded-lg text-sm" value={formData.school || ''} onChange={e => setFormData({...formData, school: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Grade</label>
              <input type="text" className="w-full p-2 border border-gray-200 rounded-lg text-sm" value={formData.grade || ''} onChange={e => setFormData({...formData, grade: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Village</label>
              <input type="text" className="w-full p-2 border border-gray-200 rounded-lg text-sm" value={formData.village || ''} onChange={e => setFormData({...formData, village: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Photo URL</label>
              <input type="text" className="w-full p-2 border border-gray-200 rounded-lg text-sm" value={formData.photoUrl || ''} onChange={e => setFormData({...formData, photoUrl: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Sponsor Name</label>
              <input type="text" className="w-full p-2 border border-gray-200 rounded-lg text-sm" value={formData.sponsorName || ''} onChange={e => setFormData({...formData, sponsorName: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Sponsor Email</label>
              <input type="email" className="w-full p-2 border border-gray-200 rounded-lg text-sm" value={formData.sponsorEmail || ''} onChange={e => setFormData({...formData, sponsorEmail: e.target.value})} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">Bio / Notes</label>
              <textarea rows={3} className="w-full p-2 border border-gray-200 rounded-lg text-sm" value={formData.bio || ''} onChange={e => setFormData({...formData, bio: e.target.value})} />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors text-sm font-medium">
              <Save className="w-4 h-4" /> Save Details
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Child</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location/Education</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sponsor Info</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full object-cover border border-gray-100 bg-gray-100" src={student.photoUrl || undefined} alt="" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                        <div className="text-sm text-gray-500">Age: {student.age}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center gap-1"><MapPin className="w-3 h-3 text-gray-400"/> {student.village}</div>
                    <div className="text-sm text-gray-500 flex items-center gap-1"><GraduationCap className="w-3 h-3 text-gray-400"/> {student.school}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {student.sponsorName ? (
                      <>
                        <div className="text-sm text-gray-900 flex items-center gap-1"><User className="w-3 h-3 text-gray-400"/> {student.sponsorName}</div>
                        {student.sponsorEmail && <div className="text-sm text-gray-500 flex items-center gap-1"><Mail className="w-3 h-3 text-gray-400"/> {student.sponsorEmail}</div>}
                      </>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Unsponsored
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-2">
                    <button onClick={() => startEdit(student)} className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 p-2 rounded-lg transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDeleteStudent(student.id)} className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredStudents.length === 0 && (
            <div className="text-center py-10 text-gray-500 text-sm">
              No records found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
