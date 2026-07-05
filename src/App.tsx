import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  LogOut, 
  User as UserIcon, 
  CheckCircle2, 
  AlertCircle, 
  QrCode, 
  FileText, 
  Upload,
  Calendar,
  X,
  UserCheck
} from 'lucide-react';

import LandingPage from './components/LandingPage';
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import AdminDashboard from './components/AdminDashboard';
import CbtEngine from './components/CbtEngine';
import AppLogo from './components/AppLogo';

import { mockDb } from './mockDb';
import { User, Subject, Schedule, Assignment, Grade, TeacherGrade } from './types';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<'landing' | 'login' | 'register' | 'student' | 'teacher' | 'admin'>('landing');

  // Unified persistent database state
  const [users, setUsers] = useState<User[]>(() => mockDb.getUsers());
  const [subjects, setSubjects] = useState<Subject[]>(() => mockDb.getSubjects());
  const [schedules, setSchedules] = useState<Schedule[]>(() => mockDb.getSchedules());
  const [assignments, setAssignments] = useState<Assignment[]>(() => mockDb.getAssignments());
  const [studentGrades, setStudentGrades] = useState<Grade[]>(() => mockDb.getStudentGrades());
  const [teacherGrades, setTeacherGrades] = useState<TeacherGrade[]>(() => mockDb.getTeacherGrades());
  const [examHistory, setExamHistory] = useState<any[]>(() => mockDb.getExamHistory());

  // Attendance simulation state
  const [attendanceStatus, setAttendanceStatus] = useState<string>('BELUM ABSEN');
  const [attendanceTime, setAttendanceTime] = useState<string | null>(null);

  // CBT / Exam state
  const [isExamActive, setIsExamActive] = useState<boolean>(false);
  const [examScore, setExamScore] = useState<number | null>(null);
  const [activeExam, setActiveExam] = useState<any | null>(null);
  const [completedExamResult, setCompletedExamResult] = useState<any | null>(null);

  // Modals state
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [showPermitModal, setShowPermitModal] = useState(false);
  const [permitType, setPermitType] = useState<'Sakit' | 'Izin'>('Sakit');
  const [permitReason, setPermitReason] = useState('');
  
  // Admin modals state
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [editUserName, setEditUserName] = useState('');
  const [editUserEmail, setEditUserEmail] = useState('');
  const [editUserClass, setEditUserClass] = useState('');

  const [showEditScheduleModal, setShowEditScheduleModal] = useState(false);
  const [editingScheduleId, setEditingScheduleId] = useState<number | null>(null);
  const [editSchedDay, setEditSchedDay] = useState('Senin');
  const [editSchedRoom, setEditSchedRoom] = useState('');
  const [editSchedStart, setEditSchedStart] = useState('08:00');
  const [editSchedEnd, setEditSchedEnd] = useState('10:00');
  const [showLogoutConfirmModal, setShowLogoutConfirmModal] = useState(false);

  // Sync to mockDb on every modification
  useEffect(() => {
    mockDb.setUsers(users);
  }, [users]);

  useEffect(() => {
    mockDb.setSubjects(subjects);
  }, [subjects]);

  useEffect(() => {
    mockDb.setSchedules(schedules);
  }, [schedules]);

  useEffect(() => {
    mockDb.setAssignments(assignments);
  }, [assignments]);

  useEffect(() => {
    mockDb.setStudentGrades(studentGrades);
  }, [studentGrades]);

  useEffect(() => {
    mockDb.setTeacherGrades(teacherGrades);
  }, [teacherGrades]);

  useEffect(() => {
    mockDb.setExamHistory(examHistory);
  }, [examHistory]);

  // Handle Auth Logout
  const handleLogout = () => {
    setShowLogoutConfirmModal(true);
  };

  const executeLogout = () => {
    setCurrentUser(null);
    setView('landing');
    setIsExamActive(false);
    setAttendanceStatus('BELUM ABSEN');
    setAttendanceTime(null);
    setShowLogoutConfirmModal(false);
  };

  // QR Attendance simulation triggers
  const handleMarkPresent = () => {
    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    setAttendanceStatus('HADIR');
    setAttendanceTime(timeString);
    setShowScannerModal(false);
    alert(`Sukses! Kehadiran Anda berhasil tercatat pada pukul ${timeString}.`);
  };

  const handleMarkPermit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!permitReason.trim()) {
      alert("Harap berikan keterangan izin Anda.");
      return;
    }
    setAttendanceStatus(permitType === 'Sakit' ? 'SAKIT' : 'IZIN');
    const now = new Date();
    setAttendanceTime(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`);
    setShowPermitModal(false);
    setPermitReason('');
    alert(`Sukses mengajukan surat keterangan ${permitType}!`);
  };

  // Exam handler
  const handleExamFinish = (score: number) => {
    setExamScore(score);
    setIsExamActive(false);

    if (activeExam) {
      // 1. Add to Exam History in state (which syncs to mockDb and propagates to Dashboard)
      const currentHistory = examHistory;
      const status = score >= 75 ? 'Lulus' : 'Tidak Lulus';
      
      const newHistoryItem = {
        id: `ex-h-${Date.now()}`,
        studentId: currentUser?.id || 1,
        name: activeExam.name,
        subject: activeExam.subject,
        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        score: score,
        status: status
      };
      
      const nextHistory = [newHistoryItem, ...currentHistory];
      setExamHistory(nextHistory);
      mockDb.setExamHistory(nextHistory);

      // 2. Update Teacher Grades for this student
      if (currentUser) {
        const updatedTeacherGrades = teacherGrades.map((tg) => {
          if (tg.name.toUpperCase() === currentUser.name.toUpperCase()) {
            return {
              ...tg,
              ujian: score
            };
          }
          return tg;
        });
        mockDb.setTeacherGrades(updatedTeacherGrades);
        setTeacherGrades(updatedTeacherGrades);

        // 3. Update Student's Grades card
        const updatedStudentGrades = studentGrades.map((sg) => {
          if (sg.subject.toLowerCase().includes(activeExam.subject.toLowerCase()) || 
              activeExam.subject.toLowerCase().includes(sg.subject.toLowerCase())) {
            return {
              ...sg,
              ujian: score
            };
          }
          return sg;
        });
        mockDb.setStudentGrades(updatedStudentGrades);
        setStudentGrades(updatedStudentGrades);
      }

      setCompletedExamResult({
        name: activeExam.name,
        subject: activeExam.subject,
        score: score,
        status: status
      });
    } else {
      setCompletedExamResult({
        name: 'Ujian Selesai',
        subject: 'CBT',
        score: score,
        status: score >= 75 ? 'Lulus' : 'Tidak Lulus'
      });
    }
    setActiveExam(null);
  };

  const handleDeleteExamHistory = (id: string) => {
    const nextHistory = examHistory.filter((h) => h.id !== id);
    setExamHistory(nextHistory);
    mockDb.setExamHistory(nextHistory);
  };

  const handleClearAllExamHistory = () => {
    if (currentUser) {
      const nextHistory = examHistory.filter((h) => h.studentId !== currentUser.id);
      setExamHistory(nextHistory);
      mockDb.setExamHistory(nextHistory);
    }
  };

  // ADMIN OPERATIONS
  const handleAddUser = (newU: Omit<User, 'id'>) => {
    const nextId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    setUsers(prev => [...prev, { id: nextId, ...newU }]);
  };

  const handleDeleteUser = (id: number) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const handleOpenEditUserModal = (id: number) => {
    const matched = users.find(u => u.id === id);
    if (matched) {
      setEditingUserId(id);
      setEditUserName(matched.name);
      setEditUserEmail(matched.email);
      setEditUserClass(matched.class_level || '');
      setShowEditUserModal(true);
    }
  };

  const handleSaveEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUserId) return;
    setUsers(prev => prev.map(u => u.id === editingUserId ? {
      ...u,
      name: editUserName,
      email: editUserEmail,
      class_level: u.role === 'student' ? editUserClass : undefined
    } : u));
    setShowEditUserModal(false);
    alert("Akun berhasil diperbarui!");
  };

  // Subjects Operations
  const handleAddSubject = (newS: Omit<Subject, 'id'>) => {
    const nextId = subjects.length > 0 ? Math.max(...subjects.map(s => s.id)) + 1 : 1;
    setSubjects(prev => [...prev, { id: nextId, ...newS }]);
  };

  const handleDeleteSubject = (id: number) => {
    setSubjects(prev => prev.filter(s => s.id !== id));
  };

  // Schedules Operations
  const handleAddSchedule = (newSc: Omit<Schedule, 'id'>) => {
    const nextId = schedules.length > 0 ? Math.max(...schedules.map(s => s.id)) + 1 : 1;
    setSchedules(prev => [...prev, { id: nextId, ...newSc }]);
  };

  const handleDeleteSchedule = (id: number) => {
    setSchedules(prev => prev.filter(s => s.id !== id));
  };

  const handleOpenEditScheduleModal = (id: number) => {
    const matched = schedules.find(s => s.id === id);
    if (matched) {
      setEditingScheduleId(id);
      setEditSchedDay(matched.day);
      setEditSchedRoom(matched.room);
      setEditSchedStart(matched.time_start);
      setEditSchedEnd(matched.time_end);
      setShowEditScheduleModal(true);
    }
  };

  const handleSaveEditSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingScheduleId) return;
    setSchedules(prev => prev.map(s => s.id === editingScheduleId ? {
      ...s,
      day: editSchedDay,
      room: editSchedRoom,
      time_start: editSchedStart,
      time_end: editSchedEnd
    } : s));
    setShowEditScheduleModal(false);
    alert("Jadwal pelajaran berhasil diperbarui!");
  };

  // CBT Player Locked Gate
  if (isExamActive) {
    return <CbtEngine onExamFinish={handleExamFinish} activeExam={activeExam} />;
  }

  return (
    <div className="min-h-screen bg-slate-55 flex flex-col justify-between w-full max-w-full overflow-x-hidden font-sans select-none antialiased">
      
      {/* 1. Landing View */}
      {view === 'landing' && (
        <LandingPage 
          onLoginClick={() => setView('login')} 
          onRegisterClick={() => setView('register')} 
        />
      )}

      {/* 2. Login View */}
      {view === 'login' && (
        <LoginScreen 
          onBackToLanding={() => setView('landing')} 
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            setView(user.role as 'student' | 'teacher' | 'admin');
          }} 
        />
      )}

      {/* 3. Register View */}
      {view === 'register' && (
        <RegisterScreen onBackToLanding={() => setView('landing')} />
      )}

      {/* 4. Portal Authorized Header */}
      {view !== 'landing' && view !== 'login' && view !== 'register' && currentUser && (
        <>
          {currentUser.role !== 'student' && currentUser.role !== 'teacher' && (
            <header className="bg-slate-900 text-white border-b border-slate-800 px-4 md:px-8 py-3.5 flex justify-between items-center relative z-20 shadow-md">
              <div className="flex items-center gap-3">
                <AppLogo />
                <div>
                  <h1 className="font-black text-xs sm:text-sm uppercase tracking-widest font-display text-white">AuraExam</h1>
                  <p className="text-[9px] text-orange-400 font-extrabold uppercase tracking-widest">Portal Akademik Terpadu</p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-4 text-xs font-semibold">
                <div className="hidden sm:flex items-center gap-2 border-r border-slate-800 pr-4 py-1">
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <div className="text-left text-[11px] leading-tight">
                    <span className="text-slate-400 font-bold block uppercase text-[8px] tracking-wider">Aktif</span>
                    <span className="text-slate-200 font-extrabold">{currentUser.name}</span>
                  </div>
                </div>

                {/* Log Out CTA */}
                <button 
                  onClick={handleLogout}
                  className="bg-slate-800/85 hover:bg-red-600 hover:text-white text-slate-300 font-black p-2.5 sm:px-4 sm:py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95 border border-slate-750"
                >
                  <LogOut className="h-4 w-4 shrink-0" />
                  <span className="hidden sm:inline uppercase text-[9px] tracking-wider">Logout</span>
                </button>
              </div>
            </header>
          )}

          <main className={(currentUser.role === 'student' || currentUser.role === 'teacher') ? "w-full" : "flex-1 pb-16 bg-slate-50/50"}>
            {/* Student View Router */}
            {view === 'student' && (
              <StudentDashboard 
                user={currentUser}
                attendanceStatus={attendanceStatus}
                attendanceTime={attendanceTime}
                onOpenScanner={() => setShowScannerModal(true)}
                onOpenPermit={(type) => { setPermitType(type); setShowPermitModal(true); }}
                onNavigateTo={(k, n) => console.log('navigating to', k, n)}
                onStartExam={(exam) => {
                  setActiveExam(exam);
                  setIsExamActive(true);
                }}
                assignments={assignments}
                grades={studentGrades}
                schedules={schedules}
                examHistory={examHistory}
                onLogout={handleLogout}
                onDeleteExamHistory={handleDeleteExamHistory}
                onClearAllExamHistory={handleClearAllExamHistory}
              />
            )}

            {/* Teacher View Router */}
            {view === 'teacher' && (
              <TeacherDashboard 
                user={currentUser}
                users={users}
                attendanceStatus={attendanceStatus}
                attendanceTime={attendanceTime}
                onOpenScanner={() => setShowScannerModal(true)}
                onOpenPermit={(type) => { setPermitType(type); setShowPermitModal(true); }}
                onNavigateTo={(k, n) => console.log('navigating to', k, n)}
                teacherGrades={teacherGrades}
                schedules={schedules}
                onLogout={handleLogout}
              />
            )}

            {/* Admin View Router */}
            {view === 'admin' && (
              <AdminDashboard 
                users={users}
                subjects={subjects}
                schedules={schedules}
                onAddUser={handleAddUser}
                onDeleteUser={handleDeleteUser}
                onAddSubject={handleAddSubject}
                onDeleteSubject={handleDeleteSubject}
                onAddSchedule={handleAddSchedule}
                onDeleteSchedule={handleDeleteSchedule}
                onOpenEditUserModal={handleOpenEditUserModal}
                onOpenEditScheduleModal={handleOpenEditScheduleModal}
              />
            )}
          </main>

          {currentUser.role !== 'student' && (
            <footer className="bg-white border-t border-slate-150 py-4 px-6 text-center text-[10px] text-slate-400 font-bold tracking-wider uppercase shrink-0">
              © 2026 AuraExam. Hak Cipta Dilindungi Undang-Undang.
            </footer>
          )}

      {/* ================= MODAL: QR SCANNER SIMULATION ================= */}
      {showScannerModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-pro border border-slate-100 animate-scaleUp">
            
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-2">
                <QrCode className="h-5 w-5 text-orange-600" />
                <h3 className="font-black text-sm text-slate-800 uppercase tracking-wider font-display">Scan QR Code Kehadiran</h3>
              </div>
              <button 
                onClick={() => setShowScannerModal(false)}
                className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 flex flex-col items-center">
              {/* Simulated Camera Screen */}
              <div className="w-64 h-64 bg-slate-950 rounded-2xl relative overflow-hidden border-4 border-orange-500/10 shadow-inner flex flex-col items-center justify-center">
                
                {/* Glowing Scanner Grid Lines */}
                <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 h-0.5 bg-orange-500 shadow-[0_0_15px_#f97316] animate-scanBeam"></div>
                
                {/* Simulated Target Corners */}
                <div className="absolute top-4 left-4 w-6 h-6 border-t-4 border-l-4 border-orange-500 rounded-tl-md"></div>
                <div className="absolute top-4 right-4 w-6 h-6 border-t-4 border-r-4 border-orange-500 rounded-tr-md"></div>
                <div className="absolute bottom-4 left-4 w-6 h-6 border-b-4 border-l-4 border-orange-500 rounded-bl-md"></div>
                <div className="absolute bottom-4 right-4 w-6 h-6 border-b-4 border-r-4 border-orange-500 rounded-br-md"></div>

                <div className="z-10 flex flex-col items-center text-center p-6 space-y-4">
                  <div className="h-16 w-16 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
                    <QrCode className="h-8 w-8 text-white animate-pulse" />
                  </div>
                  <p className="text-[10px] text-slate-300 font-extrabold uppercase tracking-widest leading-normal">
                    Mengarahkan kamera ke kode QR guru...
                  </p>
                </div>
              </div>

              <div className="mt-6 w-full space-y-3">
                <button 
                  onClick={handleMarkPresent}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-extrabold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md shadow-orange-100 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <UserCheck className="h-4.5 w-4.5 shrink-0" />
                  <span>Simulasikan Scan Sukses</span>
                </button>
                <p className="text-[10px] text-center text-slate-400 font-semibold leading-normal">
                  Sistem mendeteksi data lokasi GPS secara presisi untuk menjamin otentisitas presensi guru pengajar.
                </p>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ================= MODAL: PERMIT SUBMISSION ================= */}
      {showPermitModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-pro border border-slate-100 animate-scaleUp">
            
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-orange-600" />
                <h3 className="font-black text-sm text-slate-800 uppercase tracking-wider font-display">
                  Ajukan Keterangan {permitType}
                </h3>
              </div>
              <button 
                onClick={() => setShowPermitModal(false)}
                className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleMarkPermit} className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Keterangan / Alasan Resmi</label>
                <textarea 
                  value={permitReason}
                  onChange={(e) => setFormReason(e.target.value)}
                  required
                  rows={3}
                  className="w-full p-3.5 rounded-xl border border-slate-200 outline-none bg-slate-50/50 focus:border-orange-500 focus:bg-white text-xs font-semibold"
                  placeholder="Berikan alasan secara jelas (contoh: 'Demam tinggi dan disarankan istirahat oleh dokter')..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Unggah Surat Bukti (Simulasi)</label>
                <div className="border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100/55 rounded-xl p-6 text-center cursor-pointer transition-colors relative flex flex-col items-center justify-center">
                  <Upload className="h-7 w-7 text-slate-400 mb-2 animate-bounce" style={{ animationDuration: '3s' }} />
                  <span className="text-xs font-bold text-slate-600 block">Klik atau Seret Berkas</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1 block">Surat Dokter / Bukti Pendukung (JPG, PDF)</span>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-extrabold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md shadow-orange-100 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
                <span>Kirim Surat Keterangan</span>
              </button>
            </form>

          </div>
        </div>
      )}

      {/* ================= MODAL: ADMIN EDIT USER ================= */}
      {showEditUserModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-pro border border-slate-100 animate-scaleUp">
            
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-black text-sm text-slate-800 uppercase tracking-wider font-display">Edit Profil Pengguna</h3>
              <button 
                onClick={() => setShowEditUserModal(false)}
                className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditUser} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                <input 
                  type="text" 
                  value={editUserName}
                  onChange={(e) => setEditUserName(e.target.value)}
                  required
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-semibold"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Alamat Email</label>
                <input 
                  type="email" 
                  value={editUserEmail}
                  onChange={(e) => setEditUserEmail(e.target.value)}
                  required
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-semibold"
                />
              </div>
              {/* Fitur Kelas Telah Dihapus */}
              <div className="pt-2 flex justify-end gap-2 text-xs font-bold">
                <button 
                  type="button" 
                  onClick={() => setShowEditUserModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ================= MODAL: ADMIN EDIT SCHEDULE ================= */}
      {showEditScheduleModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-pro border border-slate-100 animate-scaleUp">
            
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-black text-sm text-slate-800 uppercase tracking-wider font-display">Edit Jadwal Pelajaran</h3>
              <button 
                onClick={() => setShowEditScheduleModal(false)}
                className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditSchedule} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Hari</label>
                <select 
                  value={editSchedDay}
                  onChange={(e) => setEditSchedDay(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-bold"
                >
                  <option value="Senin">Senin</option>
                  <option value="Selasa">Selasa</option>
                  <option value="Rabu">Rabu</option>
                  <option value="Kamis">Kamis</option>
                  <option value="Jumat">Jumat</option>
                  <option value="Sabtu">Sabtu</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Ruangan Kelas</label>
                <input 
                  type="text" 
                  value={editSchedRoom}
                  onChange={(e) => setEditSchedRoom(e.target.value)}
                  required
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-semibold"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Jam Mulai</label>
                  <input 
                    type="time" 
                    value={editSchedStart}
                    onChange={(e) => setEditSchedStart(e.target.value)}
                    required
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs font-semibold"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Jam Selesai</label>
                  <input 
                    type="time" 
                    value={editSchedEnd}
                    onChange={(e) => setEditSchedEnd(e.target.value)}
                    required
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs font-semibold"
                  />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2 text-xs font-bold">
                <button 
                  type="button" 
                  onClick={() => setShowEditScheduleModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ================= MODAL: LOGOUT CONFIRMATION ================= */}
      {showLogoutConfirmModal && (
        <div className="fixed inset-0 z-55 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-pro border border-slate-100 animate-scaleUp">
            <div className="p-6 text-center">
              {/* Warning Icon with Glow */}
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm animate-pulse">
                <LogOut className="h-8 w-8" />
              </div>
              
              <h3 className="font-black text-base text-slate-900 uppercase tracking-wider font-display mb-2">
                Keluar Dari Portal
              </h3>
              
              <p className="text-slate-500 text-xs font-semibold leading-relaxed mb-6">
                Apakah Anda yakin ingin keluar dari portal akademik AuraExam? Sesi aktif Anda akan diakhiri.
              </p>

              <div className="flex gap-3 text-xs font-bold">
                <button 
                  onClick={() => setShowLogoutConfirmModal(false)}
                  className="flex-1 py-3 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button 
                  onClick={executeLogout}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-md shadow-red-100 transition-colors cursor-pointer"
                >
                  Ya, Keluar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: HASIL UJIAN SELESAI ================= */}
      {completedExamResult && (
        <div className="fixed inset-0 z-55 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-100 p-6 space-y-6 animate-scaleUp">
            
            <div className="text-center space-y-3">
              {completedExamResult.score >= 75 ? (
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm animate-bounce">
                  <CheckCircle2 className="h-9 w-9" />
                </div>
              ) : (
                <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm animate-pulse">
                  <AlertCircle className="h-9 w-9" />
                </div>
              )}

              <h2 className="font-extrabold text-lg text-slate-800 uppercase tracking-wider font-display">
                Ujian Selesai Dikumpulkan!
              </h2>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest leading-normal">
                Hasil penilaian ujian online Anda telah diproses
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-3.5">
              <div className="flex justify-between items-start border-b border-slate-200/50 pb-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Nama Ujian:</span>
                <span className="text-xs font-black text-slate-800 text-right max-w-[200px]">{completedExamResult.name}</span>
              </div>
              <div className="flex justify-between items-start border-b border-slate-200/50 pb-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Mata Pelajaran:</span>
                <span className="text-xs font-black text-slate-600 text-right">{completedExamResult.subject}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-200/50 pb-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Nilai Akhir:</span>
                <span className="text-xl font-black text-orange-600">{completedExamResult.score} / 100</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Status Kelulusan:</span>
                <span className={`px-3 py-1 rounded-lg font-black text-[10px] uppercase tracking-wider ${
                  completedExamResult.status === 'Lulus' 
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                    : 'bg-red-50 text-red-600 border border-red-100'
                }`}>
                  {completedExamResult.status}
                </span>
              </div>
            </div>

            <button 
              onClick={() => setCompletedExamResult(null)}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-slate-200 transition-all cursor-pointer text-center active:scale-95"
            >
              Kembali ke Dashboard
            </button>

          </div>
        </div>
      )}

    </>
  )}

</div>
);

  // Small helpers for variables
  function setFormReason(v: string) { setPermitReasonState(v); }
  function setPermitReasonState(v: string) { setPermitReason(v); }
}
