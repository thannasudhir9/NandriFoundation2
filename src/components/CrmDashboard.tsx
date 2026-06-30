import { useState, useRef } from 'react';
import { Student } from '../types';
import { Search, Plus, Edit2, Save, X, User, Mail, MapPin, GraduationCap, Trash2, Download, Upload, FileText, RefreshCcw } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useLanguage } from '../LanguageContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface CrmDashboardProps {
  students: Student[];
  onUpdateStudent: (student: Student) => void;
  onAddStudent: (student: Omit<Student, 'id'>) => void;
  onDeleteStudent: (id: string) => void;
  onSyncNow: () => Promise<void>;
}

export function CrmDashboard({ students, onUpdateStudent, onAddStudent, onDeleteStudent, onSyncNow }: CrmDashboardProps) {
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [viewType, setViewType] = useState<'excel' | 'json'>('excel');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [syncing, setSyncing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();
  const handleSync = async () => {
    setSyncing(true);
    try {
      await onSyncNow();
    } finally {
      setSyncing(false);
    }
  };

  
  const [formData, setFormData] = useState<Partial<Student>>({});

  const totalStudents = students.length;
  const sponsoredStudents = students.filter(s => s.sponsorName && s.sponsorName.trim() !== '').length;
  const unsponsoredStudents = totalStudents - sponsoredStudents;
  const uniqueSponsors = new Set(students.filter(s => s.sponsorName && s.sponsorName.trim() !== '').map(s => s.sponsorName)).size;

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
      'Donation Amount': s.donationAmount ?? 0,
      Bio: s.bio || ''
    }));
    
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    XLSX.writeFile(wb, "nandri_students_export.xlsx");
  };

  const downloadSampleTemplate = () => {
    const sampleData = [{
      Name: 'Sample Child',
      Age: 10,
      School: 'Sample School',
      Grade: '5th',
      Village: 'Sample Village',
      'Sponsor Name': 'John Doe',
      'Sponsor Email': 'john@example.com',
      'Donation Amount': 50,
      Bio: 'Sample bio notes'
    }];
    const ws = XLSX.utils.json_to_sheet(sampleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "nandri_import_template.xlsx");
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
          donationAmount: parseFloat(row['Donation Amount']) || 0,
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
      name: '', age: 0, school: '', village: '', grade: '', photoUrl: '', sponsorName: '', sponsorEmail: '', donationAmount: 0, bio: ''
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

  const generatePDF = () => {
    const doc = new jsPDF();
    const tableData = filteredStudents
      .filter(s => selectedIds.size === 0 || selectedIds.has(s.id))
      .map(s => [
        s.name,
        s.age.toString(),
        s.school,
        s.grade,
        s.village,
        s.sponsorName || 'Unsponsored'
      ]);

    autoTable(doc, {
      head: [['Name', 'Age', 'School', 'Grade', 'Village', 'Sponsor']],
      body: tableData,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [22, 163, 74] }
    });

    doc.save('nandri_students_summary.pdf');
  };

  const toggleSelection = (id: string) => {
    const newSelection = new Set(selectedIds);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedIds(newSelection);
  };

  const toggleAll = () => {
    if (selectedIds.size === filteredStudents.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredStudents.map(s => s.id)));
    }
  };

  return (
    <div className="pb-24 pt-4 px-4 w-full max-w-4xl mx-auto transition-colors duration-300">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight mb-1">{t('crmTitle')}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{t('crmSubtitle')}</p>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <input 
            type="file" 
            accept=".xlsx, .xls, .csv" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={importFromExcel} 
          />
          <button 
            onClick={downloadSampleTemplate}
            className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Template</span>
          </button>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium shadow-sm"
          >
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">{t('import')}</span>
          </button>
          <button 
            onClick={exportToExcel}
            className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">{t('export')}</span>
          </button>
          <button 
            onClick={generatePDF}
            className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium shadow-sm"
          >
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">PDF Summary</span>
          </button>
          <button 
            onClick={startAdd}
            className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors text-sm font-medium shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">{t('addRecord')}</span>
          </button>
          <button
            onClick={handleSync}
            disabled={syncing}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm disabled:opacity-50"
          >
            <RefreshCcw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{syncing ? 'Syncing...' : 'Sync Firebase ↔ SQLite'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Students</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalStudents}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Sponsored</div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{sponsoredStudents}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Unsponsored</div>
          <div className="text-2xl font-bold text-orange-500 dark:text-orange-400">{unsponsoredStudents}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Unique Sponsors</div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{uniqueSponsors}</div>
        </div>
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-700 rounded-xl leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-colors"
          placeholder={t('crmSearchPlaceholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {(editingId || isAdding) && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-green-100 dark:border-gray-700 mb-6 transition-colors duration-300">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{isAdding ? 'Add New Record' : 'Edit Record'}</h2>
            <button onClick={cancelEdit} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"><X className="w-5 h-5"/></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-400 mb-1">Child Name</label>
              <input type="text" className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-400 mb-1">Age</label>
              <input type="number" className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white" value={formData.age || ''} onChange={e => setFormData({...formData, age: parseInt(e.target.value) || 0})} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-400 mb-1">School</label>
              <input type="text" className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white" value={formData.school || ''} onChange={e => setFormData({...formData, school: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-400 mb-1">Grade</label>
              <input type="text" className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white" value={formData.grade || ''} onChange={e => setFormData({...formData, grade: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-400 mb-1">Village</label>
              <input type="text" className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white" value={formData.village || ''} onChange={e => setFormData({...formData, village: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-400 mb-1">Photo URL</label>
              <input type="text" className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white" value={formData.photoUrl || ''} onChange={e => setFormData({...formData, photoUrl: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-400 mb-1">Sponsor Name</label>
              <input type="text" className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white" value={formData.sponsorName || ''} onChange={e => setFormData({...formData, sponsorName: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-400 mb-1">Sponsor Email</label>
              <input type="email" className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white" value={formData.sponsorEmail || ''} onChange={e => setFormData({...formData, sponsorEmail: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-400 mb-1">Donation Amount (EUR)</label>
              <input type="number" min="0" className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white" value={formData.donationAmount ?? 0} onChange={e => setFormData({...formData, donationAmount: parseFloat(e.target.value) || 0})} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-400 mb-1">Bio / Notes</label>
              <textarea rows={3} className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white" value={formData.bio || ''} onChange={e => setFormData({...formData, bio: e.target.value})} />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors text-sm font-medium">
              <Save className="w-4 h-4" /> Save Details
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-2 mb-4">
        <button 
          onClick={() => setViewType('excel')} 
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors border shadow-sm ${viewType === 'excel' ? 'bg-green-600 text-white border-green-600' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
        >
          Excel View
        </button>
        <button 
          onClick={() => setViewType('json')} 
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors border shadow-sm ${viewType === 'json' ? 'bg-green-600 text-white border-green-600' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
        >
          JSON View
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-300">
        {viewType === 'excel' ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th scope="col" className="px-6 py-3 text-left">
                  <input 
                    type="checkbox" 
                    checked={filteredStudents.length > 0 && selectedIds.size === filteredStudents.length}
                    onChange={toggleAll}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Child</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Location/Education</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Sponsor Info</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input 
                      type="checkbox" 
                      checked={selectedIds.has(student.id)}
                      onChange={() => toggleSelection(student.id)}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full object-cover border border-gray-100 dark:border-gray-700 bg-gray-100 dark:bg-gray-900" src={student.photoUrl || undefined} alt="" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{student.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Age: {student.age}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-300 flex items-center gap-1"><MapPin className="w-3 h-3 text-gray-400"/> {student.village}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1"><GraduationCap className="w-3 h-3 text-gray-400"/> {student.school}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {student.sponsorName ? (
                      <>
                        <div className="text-sm text-gray-900 dark:text-gray-300 flex items-center gap-1"><User className="w-3 h-3 text-gray-400"/> {student.sponsorName}</div>
                        {student.sponsorEmail && <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1"><Mail className="w-3 h-3 text-gray-400"/> {student.sponsorEmail}</div>}
                        <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">EUR {(student.donationAmount ?? 0).toFixed(0)}</div>
                      </>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400">
                        Unsponsored
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-2">
                    <button onClick={() => startEdit(student)} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 p-2 rounded-lg transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDeleteStudent(student.id)} className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 bg-red-50 dark:bg-red-900/30 p-2 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredStudents.length === 0 && (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400 text-sm">
              No records found.
            </div>
          )}
        </div>
        ) : (
          <div className="p-4 bg-gray-900 overflow-x-auto">
            <pre className="text-xs text-green-400 font-mono">
              {JSON.stringify(filteredStudents, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
