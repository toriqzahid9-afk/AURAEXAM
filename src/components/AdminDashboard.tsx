import React, { useState } from 'react';
import AppLogo from './AppLogo';
import { 
  UserPlus, 
  Users, 
  Book, 
  CalendarDays, 
  Search, 
  Trash2, 
  Edit3, 
  GraduationCap, 
  Plus,
  Clock
} from 'lucide-react';
import { User, Subject, Schedule } from '../types';

interface AdminDashboardProps {
  users: User[];
  subjects: Subject[];
  schedules: Schedule[];
  onAddUser: (user: Omit<User, 'id'>) => void;
  onDeleteUser: (id: number) => void;
  onAddSubject: (subject: Omit<Subject, 'id'>) => void;
  onDeleteSubject: (id: number) => void;
  onAddSchedule: (schedule: Omit<Schedule, 'id'>) => void;
  onDeleteSchedule: (id: number) => void;
  onOpenEditUserModal: (id: number) => void;
  onOpenEditScheduleModal: (id: number) => void;
}

type AdminTab = 'add' | 'teacher' | 'student' | 'subject' | 'schedule';

export default function AdminDashboard({
  users,
  subjects,
  schedules,
  onAddUser,
  onDeleteUser,
  onAddSubject,
  onDeleteSubject,
  onAddSchedule,
  onDeleteSchedule,
  onOpenEditUserModal,
  onOpenEditScheduleModal
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('add');
  const [searchQuery, setSearchQuery] = useState('');

  // Add User Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [classLevel, setClassLevel] = useState('');
  const [password, setPassword] = useState('');

  // Add Subject Form State
  const [subjectName, setSubjectName] = useState('');
  const [subjectClass, setSubjectClass] = useState('');
  const [subjectTeacherId, setSubjectTeacherId] = useState('');

  // Add Schedule Form State
  const [schedSubjectId, setSchedSubjectId] = useState('');
  const [schedDay, setSchedDay] = useState('Senin');
  const [schedRoom, setSchedRoom] = useState('');
  const [schedStart, setSchedStart] = useState('08:00');
  const [schedEnd, setSchedEnd] = useState('10:00');

  const teachers = users.filter(u => u.role === 'teacher');

  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      alert("Harap lengkapi semua data!");
      return;
    }
    onAddUser({
      name,
      email,
      role,
      password
    });
    alert("Akun berhasil dibuat!");
    setName('');
    setEmail('');
    setClassLevel('');
    setPassword('');
  };

  const handleAddSubjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectName || !subjectTeacherId) {
      alert("Nama mapel dan guru wajib ditentukan!");
      return;
    }
    onAddSubject({
      name: subjectName,
      teacher_id: parseInt(subjectTeacherId)
    });
    alert("Mata pelajaran berhasil ditambahkan!");
    setSubjectName('');
    setSubjectClass('');
    setSubjectTeacherId('');
  };

  const handleAddScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schedSubjectId || !schedRoom || !schedStart || !schedEnd) {
      alert("Harap lengkapi detail jadwal!");
      return;
    }
    const matchedSub = subjects.find(s => s.id === parseInt(schedSubjectId));
    onAddSchedule({
      subject_id: parseInt(schedSubjectId),
      subject_name: matchedSub ? matchedSub.name : 'Unknown',
      day: schedDay,
      time_start: schedStart,
      time_end: schedEnd,
      room: schedRoom
    });
    alert("Jadwal pelajaran berhasil disimpan!");
    setSchedSubjectId('');
    setSchedRoom('');
  };

  // Filter users based on query
  const filteredUsers = users.filter(u => {
    const matchesQuery = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         u.email.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === 'teacher') return u.role === 'teacher' && matchesQuery;
    if (activeTab === 'student') return u.role === 'student' && matchesQuery;
    return matchesQuery;
  });

  return (
    <div id="view-admin-dashboard" className="p-4 md:p-8 max-w-5xl mx-auto w-full overflow-x-hidden">
      {/* Dashboard Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-800 font-display">Manajemen Pengguna &amp; Akademik</h2>
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mt-1">Kelola akses akun Guru, Siswa, serta kurikulum sistem.</p>
        </div>
        <AppLogo className="h-12 w-12" />
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 mb-6 bg-slate-100/80 p-1.5 rounded-2xl w-fit">
        <button 
          onClick={() => { setActiveTab('add'); setSearchQuery(''); }}
          className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${activeTab === 'add' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <UserPlus className="h-4 w-4" />
          <span>Tambah Akun</span>
        </button>
        <button 
          onClick={() => { setActiveTab('teacher'); setSearchQuery(''); }}
          className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${activeTab === 'teacher' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <Users className="h-4 w-4" />
          <span>Daftar Guru</span>
        </button>
        <button 
          onClick={() => { setActiveTab('student'); setSearchQuery(''); }}
          className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${activeTab === 'student' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <GraduationCap className="h-4 w-4" />
          <span>Daftar Siswa</span>
        </button>
        <button 
          onClick={() => { setActiveTab('subject'); setSearchQuery(''); }}
          className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${activeTab === 'subject' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <Book className="h-4 w-4" />
          <span>Mata Pelajaran</span>
        </button>
        <button 
          onClick={() => { setActiveTab('schedule'); setSearchQuery(''); }}
          className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${activeTab === 'schedule' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <CalendarDays className="h-4 w-4" />
          <span>Jadwal</span>
        </button>
      </div>

      {/* ===== TAB CONTENT: ADD USER ===== */}
      {activeTab === 'add' && (
        <div className="glass-card rounded-[2rem] p-6 md:p-8 shadow-pro bg-white border border-slate-200/80">
          <h3 className="text-base sm:text-lg font-extrabold text-slate-800 mb-6 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-orange-500 rounded-full"></div>
            <span>Registrasi Akun Baru</span>
          </h3>
          <form onSubmit={handleAddUserSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full p-3.5 rounded-xl border border-slate-200 outline-none bg-slate-50/50 focus:border-orange-500 focus:bg-white text-xs font-semibold"
                  placeholder="Masukkan nama lengkap..."
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Sekolah</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full p-3.5 rounded-xl border border-slate-200 outline-none bg-slate-50/50 focus:border-orange-500 focus:bg-white text-xs font-semibold"
                  placeholder="user@sekolah.id"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Peran (Role)</label>
                <select 
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'student' | 'teacher')}
                  className="w-full p-3.5 rounded-xl border border-slate-200 outline-none bg-slate-50/50 focus:border-orange-500 focus:bg-white text-xs font-bold"
                >
                  <option value="student">Siswa (Portal Akademik)</option>
                  <option value="teacher">Guru (Portal Pengajar)</option>
                </select>
              </div>
              {/* Fitur Kelas Telah Dihapus */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Kata Sandi Akun</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full p-3.5 rounded-xl border border-slate-200 outline-none bg-slate-50/50 focus:border-orange-500 focus:bg-white text-xs font-semibold"
                  placeholder="Min. 6 karakter"
                />
              </div>
            </div>
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button 
                type="submit"
                className="bg-orange-600 hover:bg-orange-700 text-white font-extrabold px-8 py-3.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md shadow-orange-500/10 cursor-pointer active:scale-95"
              >
                <UserPlus className="h-4.5 w-4.5 shrink-0" />
                <span>Tambahkan Pengguna</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ===== TAB CONTENT: USERS DIRECTORY ===== */}
      {(activeTab === 'teacher' || activeTab === 'student') && (
        <div className="space-y-4">
          {/* Search Box */}
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-4.5 w-4.5 group-focus-within:text-orange-500 transition-colors" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Cari nama atau email ${activeTab === 'teacher' ? 'guru' : 'siswa'}...`}
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 bg-white text-xs font-semibold outline-none transition-all shadow-sm"
            />
          </div>

          {/* Directory Table */}
          <div className="glass-card rounded-[2rem] overflow-hidden shadow-pro bg-white border border-slate-200/80">
            {filteredUsers.length === 0 ? (
              <div className="p-12 text-center text-slate-400 font-bold">
                Tidak ada hasil pencarian untuk "{searchQuery}"
              </div>
            ) : (
              <div className="overflow-x-auto w-full">
                <table className="w-full min-w-[500px] md:min-w-full text-left border-collapse text-xs whitespace-nowrap">
                  <thead>
                    <tr className="bg-orange-500 text-white font-black uppercase tracking-wider">
                      <th className="p-4 first:rounded-tl-xl">Nama Pengguna</th>
                      <th className="p-4 first:rounded-tl-xl">Alamat Email</th>
                      <th className="p-4 text-center last:rounded-tr-xl">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white font-medium text-slate-700">
                    {filteredUsers.map(u => (
                      <tr key={u.id} className="hover:bg-slate-50/50">
                        <td className="p-4 font-extrabold text-slate-900">{u.name}</td>
                        <td className="p-4 text-slate-500">{u.email}</td>
                        <td className="p-4 text-center flex items-center justify-center gap-2">
                          <button 
                            onClick={() => onOpenEditUserModal(u.id)}
                            className="h-8 w-8 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white transition-all flex items-center justify-center cursor-pointer shadow-sm"
                            title="Edit"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => {
                              if (confirm(`Apakah Anda yakin ingin menghapus akun ${u.name}?`)) {
                                onDeleteUser(u.id);
                              }
                            }}
                            className="h-8 w-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all flex items-center justify-center cursor-pointer shadow-sm"
                            title="Hapus"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== TAB CONTENT: SUBJECTS ===== */}
      {activeTab === 'subject' && (
        <div className="space-y-6">
          {/* Add Subject form */}
          <div className="glass-card rounded-[2rem] p-6 border border-slate-200/80 bg-white shadow-sm">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-1">
              <Plus className="h-4 w-4 text-orange-500" />
              <span>Tambah Mata Pelajaran Baru</span>
            </h3>
            <form onSubmit={handleAddSubjectSubmit} className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 w-full space-y-1.5">
                <input 
                  type="text" 
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  placeholder="Nama Mapel (ex: Fisika Kuantum)" 
                  required
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-orange-500 bg-slate-50/50"
                />
              </div>
              <div className="flex-1">
                <select 
                  value={subjectTeacherId}
                  onChange={(e) => setSubjectTeacherId(e.target.value)}
                  required
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs outline-none focus:border-orange-500 bg-slate-50/50 appearance-none font-semibold text-slate-600"
                >
                  <option value="">Pilih Guru Pengampu</option>
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <button 
                type="submit"
                className="bg-orange-600 text-white px-6 py-3 rounded-xl text-xs font-extrabold hover:bg-orange-700 transition-all shadow-md shrink-0 w-full md:w-auto cursor-pointer"
              >
                Simpan Mapel
              </button>
            </form>
          </div>

          {/* List Table */}
          <div className="glass-card rounded-[2rem] overflow-hidden border border-slate-200/60 bg-white shadow-pro">
            {subjects.length === 0 ? (
              <div className="p-12 text-center text-slate-400">Belum ada mata pelajaran terdaftar.</div>
            ) : (
              <div className="overflow-x-auto w-full">
                <table className="w-full min-w-[500px] md:min-w-full text-left border-collapse text-xs whitespace-nowrap">
                  <thead>
                    <tr className="bg-orange-500 text-white font-black uppercase tracking-wider">
                      <th className="p-4 first:rounded-tl-xl">Mata Pelajaran</th>
                      <th className="p-4 first:rounded-tl-xl">Guru Pengampu</th>
                      <th className="p-4 text-center last:rounded-tr-xl">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white font-medium text-slate-700">
                    {subjects.map(s => (
                      <tr key={s.id} className="hover:bg-slate-50/50">
                        <td className="p-4 font-extrabold text-slate-900">{s.name}</td>
                        <td className="p-4 text-slate-500">{s.teacher_name || 'Tidak ada'}</td>
                        <td className="p-4 text-center">
                          <button 
                            onClick={() => onDeleteSubject(s.id)}
                            className="h-8 w-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all flex items-center justify-center cursor-pointer shadow-sm mx-auto"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== TAB CONTENT: SCHEDULES ===== */}
      {activeTab === 'schedule' && (
        <div className="space-y-6">
          {/* Add Schedule Form */}
          <div className="glass-card rounded-[2rem] p-6 border border-slate-200/80 bg-white shadow-sm">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-1">
              <Plus className="h-4 w-4 text-orange-500" />
              <span>Tambah Jadwal Pelajaran Baru</span>
            </h3>
            <form onSubmit={handleAddScheduleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Pilih Mapel</label>
                <select 
                  value={schedSubjectId}
                  onChange={(e) => setSchedSubjectId(e.target.value)}
                  required
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs outline-none focus:border-orange-500 bg-slate-50/50 appearance-none font-semibold text-slate-600"
                >
                  <option value="">Pilih Mata Pelajaran</option>
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.class_level || 'Semua'})</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Hari Pelajaran</label>
                <select 
                  value={schedDay}
                  onChange={(e) => setSchedDay(e.target.value)}
                  required
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs outline-none focus:border-orange-500 bg-slate-50/50 appearance-none font-bold text-slate-600"
                >
                  <option value="Senin">Senin</option>
                  <option value="Selasa">Selasa</option>
                  <option value="Rabu">Rabu</option>
                  <option value="Kamis">Kamis</option>
                  <option value="Jumat">Jumat</option>
                  <option value="Sabtu">Sabtu</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Ruangan Kelas</label>
                <input 
                  type="text" 
                  value={schedRoom}
                  onChange={(e) => setSchedRoom(e.target.value)}
                  placeholder="Ruangan (ex: Lab A)" 
                  required
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-orange-500 bg-slate-50/50"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Jam Mulai</label>
                <input 
                  type="time" 
                  value={schedStart}
                  onChange={(e) => setSchedStart(e.target.value)}
                  required
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs outline-none font-semibold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Jam Selesai</label>
                <input 
                  type="time" 
                  value={schedEnd}
                  onChange={(e) => setSchedEnd(e.target.value)}
                  required
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs outline-none font-semibold"
                />
              </div>
              <button 
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3.5 rounded-xl text-xs font-extrabold transition-all shadow-md shrink-0 w-full cursor-pointer"
              >
                Simpan Jadwal
              </button>
            </form>
          </div>

          {/* List Table */}
          <div className="glass-card rounded-[2rem] overflow-hidden border border-slate-200/60 bg-white shadow-pro">
            {schedules.length === 0 ? (
              <div className="p-12 text-center text-slate-400">Belum ada jadwal terdaftar.</div>
            ) : (
              <div className="overflow-x-auto w-full">
                <table className="w-full min-w-[600px] md:min-w-full text-left border-collapse text-xs whitespace-nowrap">
                  <thead>
                    <tr className="bg-orange-500 text-white font-black uppercase tracking-wider">
                      <th className="p-4 first:rounded-tl-xl">Mapel</th>
                      <th className="p-4 first:rounded-tl-xl">Hari / Waktu</th>
                      <th className="p-4 first:rounded-tl-xl">Ruangan</th>
                      <th className="p-4 text-center last:rounded-tr-xl">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white font-medium text-slate-700">
                    {schedules.map(s => (
                      <tr key={s.id} className="hover:bg-slate-50/50">
                        <td className="p-4 font-extrabold text-slate-900">{s.subject_name}</td>
                        <td className="p-4 text-slate-600 font-semibold">{s.day}, {s.time_start.substring(0, 5)} - {s.time_end.substring(0, 5)}</td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 bg-slate-100 rounded-md text-slate-600 font-bold">
                            {s.room}
                          </span>
                        </td>
                        <td className="p-4 text-center flex items-center justify-center gap-2">
                          <button 
                            onClick={() => onOpenEditScheduleModal(s.id)}
                            className="h-8 w-8 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white transition-all flex items-center justify-center cursor-pointer shadow-sm"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => onDeleteSchedule(s.id)}
                            className="h-8 w-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all flex items-center justify-center cursor-pointer shadow-sm"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
