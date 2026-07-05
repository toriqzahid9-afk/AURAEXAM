import { useState, useEffect } from 'react';
import AppLogo from './AppLogo';
import { 
  QrCode, 
  Clock, 
  BookOpen, 
  Clipboard, 
  Award, 
  History, 
  User, 
  ArrowRight, 
  Calendar,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Home,
  LayoutDashboard,
  LogOut,
  Bell,
  Laptop,
  Trash2,
  Check,
  ChevronRight,
  ChevronLeft,
  FileText,
  Volume2,
  UserCheck,
  HelpCircle,
  Settings,
  Shield,
  Lock,
  Save,
  Menu,
  X,
  Book,
  Globe,
  Leaf,
  DollarSign
} from 'lucide-react';
import { User as UserType, Assignment, Grade, Schedule } from '../types';
import { mockDb } from '../mockDb';

interface StudentDashboardProps {
  user: UserType;
  attendanceStatus: string;
  attendanceTime: string | null;
  onOpenScanner: () => void;
  onOpenPermit: (type: 'Sakit' | 'Izin') => void;
  onNavigateTo: (menuKey: string, menuName: string) => void;
  onStartExam: (exam: any) => void;
  assignments: Assignment[];
  grades: Grade[];
  schedules: Schedule[];
  onLogout: () => void;
  examHistory?: any[];
  onDeleteExamHistory?: (id: string) => void;
  onClearAllExamHistory?: () => void;
}

export default function StudentDashboard({
  user,
  attendanceStatus,
  attendanceTime,
  onOpenScanner,
  onOpenPermit,
  onNavigateTo,
  onStartExam,
  assignments,
  grades,
  schedules,
  onLogout,
  examHistory: examHistoryProp,
  onDeleteExamHistory,
  onClearAllExamHistory
}: StudentDashboardProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'jadwal' | 'mapel' | 'tugas' | 'rapor' | 'absen' | 'profile' | 'daftar-ujian' | 'riwayat-ujian' | 'profile-settings'>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState('Senin');
  const DAYS_ORDER = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  const [profileName, setProfileName] = useState(user.name || 'DZAKWAN TORIQ ZAHID');
  const [profileUsername, setProfileUsername] = useState(user.email || 'siswa@auraexam.com');
  const [profileSubTab, setProfileSubTab] = useState<'profile' | 'security'>('profile');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saveMessage, setSaveMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<'Ganjil' | 'Genap'>('Genap');

  const [exams, setExams] = useState<any[]>([]);
  const [examHistory, setExamHistory] = useState<any[]>([]);
  const [selectedExamForToken, setSelectedExamForToken] = useState<any | null>(null);
  const [examTokenInput, setExamTokenInput] = useState('');
  const [tokenError, setTokenError] = useState('');
  
  // Custom delete confirmation modal states
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleteTargetName, setDeleteTargetName] = useState<string>('');
  const [showClearAllConfirm, setShowClearAllConfirm] = useState(false);

  useEffect(() => {
    // Dynamically load schedules and exam history from mockDb or prop
    const allSchedules = mockDb.getExamSchedules();
    const allHistory = examHistoryProp || mockDb.getExamHistory();

    const takenExamNames = allHistory
      .filter((h: any) => h.studentId === user.id)
      .map((h: any) => h.name);

    const availableExams = allSchedules.filter((s: any) => {
      const isAlreadyTaken = takenExamNames.includes(s.name);
      return !isAlreadyTaken;
    });

    setExams(availableExams);
    
    // Filter history for this specific logged-in student
    const studentHistory = allHistory.filter((h: any) => h.studentId === user.id);
    setExamHistory(studentHistory);
  }, [user.id, examHistoryProp]);

  const handleStartExamClick = (exam: any) => {
    setSelectedExamForToken(exam);
    setExamTokenInput('');
    setTokenError('');
  };

  const handleVerifyTokenAndStart = () => {
    if (!selectedExamForToken) return;
    
    if (examTokenInput.trim().toUpperCase() === selectedExamForToken.token.toUpperCase()) {
      // Success! Call the launcher prop
      onStartExam(selectedExamForToken);
      setSelectedExamForToken(null);
    } else {
      setTokenError('Token ujian salah! Silakan tanyakan kepada pengawas atau lihat di Jadwal Ujian.');
    }
  };

  // Attendance colors configuration
  const getAttendanceConfig = () => {
    switch (attendanceStatus) {
      case 'HADIR':
        return { 
          bg: 'bg-emerald-50 border-emerald-200 text-emerald-600', 
          dot: 'bg-emerald-500',
          label: 'HADIR'
        };
      case 'SAKIT':
        return { 
          bg: 'bg-amber-50 border-amber-200 text-amber-600', 
          dot: 'bg-amber-500',
          label: 'SAKIT'
        };
      case 'IZIN':
        return { 
          bg: 'bg-purple-50 border-purple-200 text-purple-600', 
          dot: 'bg-purple-500',
          label: 'IZIN'
        };
      default:
        return { 
          bg: 'bg-rose-50 border-rose-200 text-rose-600', 
          dot: 'bg-rose-500',
          label: 'BELUM ABSEN'
        };
    }
  };

  const attConfig = getAttendanceConfig();
  const daySchedules = schedules.filter(s => s.day === selectedDay);
  const todaySchedulesCount = schedules.filter(s => s.day === 'Senin').length; // Mock Monday as today

  // Mock list of registered subjects
  const getUniqueSubjects = () => {
    const subjectsMap = new Map<string, Schedule>();
    schedules.forEach(s => {
      if (!subjectsMap.has(s.subject_name)) {
        subjectsMap.set(s.subject_name, s);
      }
    });
    return Array.from(subjectsMap.values());
  };
  
  const uniqueSubjects = getUniqueSubjects();


  // Helper for status classes
  const getSubjectColorStyles = (subjectName: string, idx: number) => {
    const name = subjectName.toLowerCase();
    
    if (name.includes('arab') || name.includes('quran')) {
      return { bg: 'bg-blue-600', text: 'text-blue-600', pillBg: 'bg-blue-50', icon: Book };
    } else if (name.includes('indonesia') || name.includes('ppkn') || name.includes('pkn')) {
      return { bg: 'bg-rose-600', text: 'text-rose-600', pillBg: 'bg-rose-50', icon: BookOpen };
    } else if (name.includes('inggris')) {
      return { bg: 'bg-sky-500', text: 'text-sky-600', pillBg: 'bg-sky-50', icon: Globe };
    } else if (name.includes('biologi') || name.includes('ipa')) {
      return { bg: 'bg-emerald-600', text: 'text-emerald-600', pillBg: 'bg-emerald-50', icon: Leaf };
    } else if (name.includes('ekonomi') || name.includes('akuntansi')) {
      return { bg: 'bg-teal-600', text: 'text-teal-600', pillBg: 'bg-teal-50', icon: DollarSign };
    }
    
    // Fallback colors based on idx
    const colors = [
      { bg: 'bg-orange-500', text: 'text-orange-600', pillBg: 'bg-orange-50', icon: Book },
      { bg: 'bg-purple-600', text: 'text-purple-600', pillBg: 'bg-purple-50', icon: BookOpen },
    ];
    return colors[idx % colors.length];
  };

  return (
    <div id="view-student-portal" className="min-h-screen bg-[#F4F6FA] flex flex-row w-full max-w-full overflow-x-hidden font-sans antialiased text-slate-800">
      
      {/* Mobile Sidebar Backdrop Overlay */}
      {isMobileSidebarOpen && (
        <div 
          onClick={() => setIsMobileSidebarOpen(false)}
          className="md:hidden fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-45 transition-all duration-300"
        />
      )}

      {/* ================= DESKTOP/TABLET SIDEBAR ================= */}
      <aside className={`flex flex-col ${isSidebarCollapsed ? 'w-20' : 'w-64'} bg-white border-r border-slate-100 h-[100dvh] md:h-screen fixed left-0 top-0 z-50 justify-between transition-all duration-300 ease-in-out ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} md:flex`}>
        {/* Injected custom scrollbar CSS styles */}
        <style>{`
          .custom-sidebar-scrollbar {
            -webkit-overflow-scrolling: touch;
            scrollbar-width: thin;
          }
          .custom-sidebar-scrollbar::-webkit-scrollbar {
            width: 5px;
          }
          .custom-sidebar-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-sidebar-scrollbar::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 9999px;
          }
          .custom-sidebar-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }
        `}</style>


        {/* Toggle Button on the sidebar border edge */}
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="hidden md:flex absolute top-[28px] right-[-14px] z-50 h-7 w-7 rounded-full bg-white border border-slate-200 shadow-md items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer group"
          title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-orange-600 transition-colors" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-slate-500 group-hover:text-orange-600 transition-colors" />
          )}
        </button>

        {/* Logo Brand Header */}
        <div className={`px-4 py-5 flex items-center justify-between ${isSidebarCollapsed ? 'justify-center' : 'px-6 gap-3'} border-b border-slate-50 shrink-0`}>
          <div className="flex items-center gap-3">
            <AppLogo />
            {!isSidebarCollapsed && (
              <div className="overflow-hidden transition-all duration-300">
                <h2 className="font-extrabold text-sm text-slate-800 uppercase tracking-tight leading-tight whitespace-nowrap">Aura<span className="text-orange-500">Exam</span></h2>
                <p className="text-[9px] text-orange-500 font-extrabold uppercase tracking-widest whitespace-nowrap">Platform LMS & CBT</p>
              </div>
            )}
          </div>
          <button className="md:hidden p-1 rounded-full hover:bg-slate-100" onClick={() => setIsMobileSidebarOpen(false)}>
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        {/* Scrollable Navigation Body */}
        <div className="flex-1 overflow-y-auto overscroll-contain touch-pan-y custom-sidebar-scrollbar py-6">
          <div className={`${isSidebarCollapsed ? 'px-2' : 'px-4'} space-y-7`}>
            {/* Section 1: MENU UTAMA */}
            <div>
              {isSidebarCollapsed ? (
                <div className="border-t border-slate-100 my-4 mx-3" />
              ) : (
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-3">Menu Utama</h4>
              )}
              <nav className="space-y-1">
                <button 
                  onClick={() => { setActiveTab('dashboard'); onNavigateTo('dashboard', 'Dashboard'); }}
                  className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center p-3 rounded-2xl' : 'gap-3 px-4 py-3 rounded-xl'} text-xs font-bold transition-all cursor-pointer ${activeTab === 'dashboard' ? 'bg-orange-50 text-orange-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
                  title={isSidebarCollapsed ? "Dashboard" : undefined}
                >
                  <Home className="h-4.5 w-4.5 shrink-0" />
                  {!isSidebarCollapsed && <span>Dashboard</span>}
                </button>
                <button 
                  onClick={() => { setActiveTab('jadwal'); onNavigateTo('jadwal', 'Jadwal Pelajaran'); }}
                  className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center p-3 rounded-2xl' : 'gap-3 px-4 py-3 rounded-xl'} text-xs font-bold transition-all cursor-pointer ${activeTab === 'jadwal' ? 'bg-orange-50 text-orange-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
                  title={isSidebarCollapsed ? "Jadwal Pelajaran" : undefined}
                >
                  <Calendar className="h-4.5 w-4.5 shrink-0" />
                  {!isSidebarCollapsed && <span>Jadwal Pelajaran</span>}
                </button>
              </nav>
            </div>

            {/* Section 2: AKADEMIK */}
            <div>
              {isSidebarCollapsed ? (
                <div className="border-t border-slate-100 my-4 mx-3" />
              ) : (
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-3">Akademik</h4>
              )}
              <nav className="space-y-1">
                <button 
                  onClick={() => { setActiveTab('mapel'); onNavigateTo('kelas', 'Mapel Saya'); }}
                  className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center p-3 rounded-2xl' : 'gap-3 px-4 py-3 rounded-xl'} text-xs font-bold transition-all cursor-pointer ${activeTab === 'mapel' ? 'bg-orange-50 text-orange-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
                  title={isSidebarCollapsed ? "Mapel Saya" : undefined}
                >
                  <BookOpen className="h-4.5 w-4.5 shrink-0" />
                  {!isSidebarCollapsed && <span>Mapel Saya</span>}
                </button>
                <button 
                  onClick={() => { setActiveTab('tugas'); onNavigateTo('tugas', 'Tugas Harian'); }}
                  className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center p-3 rounded-2xl' : 'gap-3 px-4 py-3 rounded-xl'} text-xs font-bold transition-all cursor-pointer ${activeTab === 'tugas' ? 'bg-orange-50 text-orange-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
                  title={isSidebarCollapsed ? "Tugas Harian" : undefined}
                >
                  <Clipboard className="h-4.5 w-4.5 shrink-0" />
                  {!isSidebarCollapsed && <span>Tugas Harian</span>}
                </button>
                <button 
                  onClick={() => { setActiveTab('rapor'); onNavigateTo('rapor', 'Rapor'); }}
                  className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center p-3 rounded-2xl' : 'gap-3 px-4 py-3 rounded-xl'} text-xs font-bold transition-all cursor-pointer ${activeTab === 'rapor' ? 'bg-orange-50 text-orange-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
                  title={isSidebarCollapsed ? "Rapor" : undefined}
                >
                  <Award className="h-4.5 w-4.5 shrink-0" />
                  {!isSidebarCollapsed && <span>Rapor</span>}
                </button>
              </nav>
            </div>

            {/* Section: UJIAN */}
            <div>
              {isSidebarCollapsed ? (
                <div className="border-t border-slate-100 my-4 mx-3" />
              ) : (
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-3">Ujian</h4>
              )}
              <nav className="space-y-1">
                <button 
                  onClick={() => { setActiveTab('daftar-ujian'); onNavigateTo('daftar-ujian', 'Daftar Ujian'); }}
                  className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center p-3 rounded-2xl' : 'gap-3 px-4 py-3 rounded-xl'} text-xs font-bold transition-all cursor-pointer ${activeTab === 'daftar-ujian' ? 'bg-orange-50 text-orange-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
                  title={isSidebarCollapsed ? "Daftar Ujian" : undefined}
                >
                  <Clipboard className="h-4.5 w-4.5 shrink-0" />
                  {!isSidebarCollapsed && <span>Daftar Ujian</span>}
                </button>
                <button 
                  onClick={() => { setActiveTab('riwayat-ujian'); onNavigateTo('riwayat-ujian', 'Riwayat Ujian'); }}
                  className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center p-3 rounded-2xl' : 'gap-3 px-4 py-3 rounded-xl'} text-xs font-bold transition-all cursor-pointer ${activeTab === 'riwayat-ujian' ? 'bg-orange-50 text-orange-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
                  title={isSidebarCollapsed ? "Riwayat Ujian" : undefined}
                >
                  <History className="h-4.5 w-4.5 shrink-0" />
                  {!isSidebarCollapsed && <span>Riwayat Ujian</span>}
                </button>
              </nav>
            </div>

            {/* Section 3: PRIBADI */}
            <div>
              {isSidebarCollapsed ? (
                <div className="border-t border-slate-100 my-4 mx-3" />
              ) : (
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-3">Pribadi</h4>
              )}
              <nav className="space-y-1">
                <button 
                  onClick={() => { setActiveTab('profile-settings'); onNavigateTo('profile-settings', 'Profil Saya'); }}
                  className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center p-3 rounded-2xl' : 'gap-3 px-4 py-3 rounded-xl'} text-xs font-bold transition-all cursor-pointer ${activeTab === 'profile-settings' ? 'bg-orange-50 text-orange-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
                  title={isSidebarCollapsed ? "Profil Saya" : undefined}
                >
                  <User className="h-4.5 w-4.5 shrink-0" />
                  {!isSidebarCollapsed && <span>Profil Saya</span>}
                </button>
                <button 
                  onClick={() => { setActiveTab('absen'); onNavigateTo('absensi_history', 'Riwayat Absen'); }}
                  className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center p-3 rounded-2xl' : 'gap-3 px-4 py-3 rounded-xl'} text-xs font-bold transition-all cursor-pointer ${activeTab === 'absen' ? 'bg-orange-50 text-orange-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
                  title={isSidebarCollapsed ? "Riwayat Absen" : undefined}
                >
                  <History className="h-4.5 w-4.5 shrink-0" />
                  {!isSidebarCollapsed && <span>Riwayat Absen</span>}
                </button>
                <button 
                  onClick={onLogout}
                  className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center p-3 rounded-2xl' : 'gap-3 px-4 py-3 rounded-xl'} text-xs font-bold text-rose-500 hover:bg-rose-50 transition-all cursor-pointer`}
                  title={isSidebarCollapsed ? "Pulang" : undefined}
                >
                  <LogOut className="h-4.5 w-4.5 shrink-0" />
                  {!isSidebarCollapsed && <span>Pulang</span>}
                </button>
              </nav>
            </div>
          </div>
        </div>

        {/* User Sidebar profile item card */}
        <div className="p-4 border-t border-slate-50 shrink-0 bg-white">
          <button 
            onClick={() => { setActiveTab('profile-settings'); onNavigateTo('profile-settings', 'Profil Saya'); }}
            className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center p-1' : 'justify-between p-2'} rounded-xl hover:bg-slate-50 transition-colors text-left`}
            title={isSidebarCollapsed ? user.name : undefined}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="h-9 w-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-extrabold text-xs shrink-0 select-none">
                {user.name.substring(0, 2).toUpperCase()}
              </div>
              {!isSidebarCollapsed && (
                <div className="overflow-hidden leading-tight">
                  <p className="text-xs font-bold text-slate-800 truncate">{user.name}</p>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Student</span>
                </div>
              )}
            </div>
            {!isSidebarCollapsed && <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />}
          </button>
        </div>
      </aside>

      {/* ================= MAIN WRAPPER CONTAINER ================= */}
      <div className={`flex-1 ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'} bg-[#F4F6FA] min-h-screen pb-24 md:pb-12 flex flex-col transition-all duration-300 ease-in-out w-full max-w-full overflow-x-hidden`}>
        
        {/* Mobile Top Header (Only visible on mobile and when active tab is not dashboard) */}
        {activeTab !== 'dashboard' && (
          <header className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-white border-b border-slate-100 shadow-xs shrink-0">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsMobileSidebarOpen(true)}
                className="h-9 w-9 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-600 active:scale-95 transition-all"
              >
                <Menu className="h-5 w-5" />
              </button>
              <span className="font-extrabold text-sm text-slate-800 uppercase tracking-tight">
                Aura<span className="text-orange-500">Exam</span>
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-orange-500 text-white text-[9px] font-black tracking-wider uppercase">
                Siswa
              </span>
              <button onClick={onLogout} className="h-9 w-9 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-600 active:scale-95 transition-all">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </header>
        )}

        {/* ================= DYNAMIC VIEW SELECTION ROUTING ================= */}
        {activeTab === 'dashboard' && (
          <>
            {/* GREETING HERO BANNER (Image 1 Style) */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-12 md:px-10 md:py-16 text-white relative overflow-hidden shrink-0">
              {/* Background pattern */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px)] [background-size:40px] pointer-events-none"></div>
              <div className="absolute -right-16 -top-16 w-64 h-64 bg-red-500 rounded-full blur-3xl opacity-25 pointer-events-none"></div>

              {/* Dynamic Content responsive header */}
              <div className="max-w-7xl mx-auto relative z-10">
                
                {/* Mobile top pills & actions row */}
                <div className="md:hidden flex justify-between items-center w-full -mt-6 mb-6">
                  <button 
                    onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                    className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all active:scale-95"
                  >
                    <Menu className="h-5.5 w-5.5" />
                  </button>
                  <div className="flex items-center gap-2">
                    <button className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white relative transition-all active:scale-95">
                      <Bell className="h-5 w-5" />
                      <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-orange-600"></span>
                    </button>
                    <button onClick={onLogout} className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all active:scale-95">
                      <LogOut className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Main Row: Greeting and Avatar side-by-side */}
                <div className="flex flex-row justify-between items-center w-full gap-4">
                  {/* Left greeting panel */}
                  <div className="min-w-0 flex-1">
                    {/* Badges row */}
                    <div className="flex items-center gap-2 mb-3.5">
                      <span className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm text-white text-[11px] font-bold tracking-wider uppercase">
                        Selamat Pagi
                      </span>
                      <span className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 text-[11px] font-black tracking-wider uppercase shadow-sm">
                        Siswa
                      </span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-display tracking-tight leading-none flex flex-wrap items-center gap-2.5 break-words">
                      Halo, {user.name}! <span className="wave-emoji inline-block animate-bounce text-3xl sm:text-4xl md:text-5xl">👋</span>
                    </h1>
                    
                    {/* Subtitle based on viewport */}
                    <p className="text-orange-100 text-xs sm:text-sm mt-4 font-semibold max-w-xl leading-relaxed hidden md:block">
                      Selamat datang! Silahkan lakukan absensi menggunakan Scan QR Code.
                    </p>

                  </div>

                  {/* Right profile badge */}
                  <div className="h-18 w-18 sm:h-20 sm:w-20 rounded-full bg-[#4A3525] text-white flex items-center justify-center text-xl sm:text-2xl font-black shadow-lg ring-8 ring-white/15 select-none overflow-hidden shrink-0 transition-all duration-300">
                    <span>{user.name.substring(0, 2).toUpperCase()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* MAIN CONTENT CONTAINING OVERLAPPING CARD */}
            <div className="max-w-7xl w-full mx-auto px-4 md:px-8 -mt-8 relative z-20">
              
              {/* ================= DESKTOP ABSENSI CARD ================= */}
              <div className="hidden md:flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-md shadow-slate-100/50">
                <div className="flex items-center gap-5">
                  {/* Glowing QR Scan target box */}
                  <div className="h-16 w-16 bg-gradient-to-br from-orange-600 to-red-600 text-white rounded-2xl flex items-center justify-center text-2xl shadow-md shrink-0 relative overflow-hidden">
                    <div className="absolute inset-2 border-2 border-dashed border-white/40 rounded-xl"></div>
                    <QrCode className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-800 font-display leading-tight">Absensi Kehadiran</h3>
                    <p className="text-slate-400 text-xs mt-1.5 font-bold max-w-lg leading-relaxed">
                      Silahkan scan QR Code pada layar monitor sekolah untuk mencatat kehadiran.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-4 shrink-0 w-full md:w-auto">
                  {/* Attendance status label */}
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl px-3 py-1.5 self-end">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Status</span>
                    <span className={`h-2 w-2 rounded-full ${attConfig.dot} ${attendanceStatus === 'BELUM ABSEN' ? 'animate-pulse' : ''}`}></span>
                    <span className="text-xs font-black text-slate-700 uppercase tracking-wider">{attConfig.label}</span>
                  </div>

                  {/* Desktop Action buttons */}
                  <div className="flex items-center gap-3.5 w-full md:w-auto">
                    <button 
                      onClick={onOpenScanner}
                      className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-extrabold py-3 px-6 rounded-xl flex items-center gap-2 shadow-md shadow-orange-500/20 transition-all text-xs uppercase tracking-wider cursor-pointer active:scale-95"
                    >
                      <QrCode className="h-4.5 w-4.5" />
                      <span>Scan QR Sekarang</span>
                    </button>

                    <button 
                      onClick={() => onOpenPermit('Sakit')}
                      className="border border-[#F59E0B] text-[#D97706] hover:bg-[#FFFBEB] font-extrabold py-3 px-6 rounded-xl transition-colors text-xs uppercase tracking-wider cursor-pointer"
                    >
                      <span>Sakit</span>
                    </button>

                    <button 
                      onClick={() => onOpenPermit('Izin')}
                      className="border border-[#A855F7] text-[#7C3AED] hover:bg-[#FDF4FF] font-extrabold py-3 px-6 rounded-xl transition-colors text-xs uppercase tracking-wider cursor-pointer"
                    >
                      <span>Izin</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* ================= MOBILE ABSENSI CARD ================= */}
              <div className="md:hidden bg-white rounded-3xl border border-slate-100 p-6 shadow-md text-center flex flex-col items-center">
                {/* Center scan icon */}
                <div className="h-16 w-16 bg-gradient-to-br from-orange-600 to-red-600 text-white rounded-2xl flex items-center justify-center text-2xl shadow-md shrink-0 relative overflow-hidden mb-4">
                  <div className="absolute inset-2 border-2 border-dashed border-white/40 rounded-xl"></div>
                  <QrCode className="h-7 w-7" />
                </div>
                
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest leading-none mb-1">STATUS KEHADIRAN</span>
                <h3 className="text-base font-black text-slate-800 font-display">Absensi Kehadiran</h3>
                <p className="text-slate-400 text-xs mt-2 font-semibold max-w-sm leading-relaxed mb-6">
                  Silahkan scan QR Code pada layar monitor sekolah untuk mencatat kehadiran.
                </p>

                {/* Mobile action buttons container */}
                <div className="w-full space-y-3">
                  <button 
                    onClick={onOpenScanner}
                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-extrabold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-orange-500/25 transition-all text-xs uppercase tracking-wider cursor-pointer active:scale-95"
                  >
                    <QrCode className="h-4.5 w-4.5" />
                    <span>Scan QR Sekarang</span>
                  </button>

                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => onOpenPermit('Sakit')}
                      className="border border-[#F59E0B] text-[#D97706] hover:bg-[#FFFBEB] font-extrabold py-3 rounded-xl transition-colors text-xs uppercase tracking-wider cursor-pointer"
                    >
                      <span>Sakit</span>
                    </button>

                    <button 
                      onClick={() => onOpenPermit('Izin')}
                      className="border border-[#A855F7] text-[#7C3AED] hover:bg-[#FDF4FF] font-extrabold py-3 rounded-xl transition-colors text-xs uppercase tracking-wider cursor-pointer"
                    >
                      <span>Izin</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* SECONDARY PANELS ROW (MENU + BULLETIN) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 md:mt-8">
                
                {/* Menu Aplikasi Panel */}
                <div className="lg:col-span-7 bg-white rounded-3xl p-4 sm:p-6 md:p-8 border border-slate-100 shadow-md shadow-slate-100/30">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-1 bg-orange-600 rounded-full"></div>
                      <h3 className="text-base font-black text-slate-800 font-display">Menu Aplikasi</h3>
                    </div>
                    <button 
                      onClick={() => setActiveTab('mapel')} 
                      className="text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors cursor-pointer"
                    >
                      Lihat Semua
                    </button>
                  </div>

                  {/* Horizontal Circular Icons Grid */}
                  <div className="grid grid-cols-4 gap-4 justify-items-center">
                    {/* Jadwal Icon button */}
                    <button 
                      onClick={() => setActiveTab('jadwal')}
                      className="flex flex-col items-center gap-2.5 group"
                    >
                      <div className="h-16 w-16 rounded-2xl bg-[#FF9F00]/10 text-[#FF9F00] flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Clock className="h-8 w-8" />
                      </div>
                      <span className="text-xs font-bold text-slate-800">Jadwal</span>
                    </button>

                    {/* Mapel Icon button */}
                    <button 
                      onClick={() => setActiveTab('mapel')}
                      className="flex flex-col items-center gap-2.5 group"
                    >
                      <div className="h-16 w-16 rounded-2xl bg-[#EC4899]/10 text-[#EC4899] flex items-center justify-center group-hover:scale-105 transition-transform">
                        <BookOpen className="h-8 w-8" />
                      </div>
                      <span className="text-xs font-bold text-slate-800">Mapel</span>
                    </button>

                    {/* Ujian Icon button */}
                    <button 
                      onClick={() => setActiveTab('tugas')}
                      className="flex flex-col items-center gap-2.5 group"
                    >
                      <div className="h-16 w-16 rounded-2xl bg-[#10B981]/10 text-[#10B981] flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Laptop className="h-8 w-8" />
                      </div>
                      <span className="text-xs font-bold text-slate-800">Ujian</span>
                    </button>

                    {/* Riwayat Absen Icon button */}
                    <button 
                      onClick={() => setActiveTab('absen')}
                      className="flex flex-col items-center gap-2.5 group"
                    >
                      <div className="h-16 w-16 rounded-2xl bg-[#14B8A6]/10 text-[#14B8A6] flex items-center justify-center group-hover:scale-105 transition-transform">
                        <History className="h-8 w-8" />
                      </div>
                      <span className="text-xs font-bold text-slate-800 text-center leading-none">Riwayat</span>
                    </button>
                  </div>
                </div>

                {/* Papan Informasi Panel */}
                <div className="lg:col-span-5 bg-white rounded-3xl p-4 sm:p-6 md:p-8 border border-slate-100 shadow-md shadow-slate-100/30 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        <div className="h-5 w-1 bg-orange-600 rounded-full"></div>
                        <h3 className="text-base font-black text-slate-800 font-display">Papan Informasi</h3>
                      </div>
                      <button 
                        onClick={() => setActiveTab('dashboard')} 
                        className="text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors cursor-pointer"
                      >
                        Lihat Semua
                      </button>
                    </div>

                    {/* Notification card item */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/60 flex items-start gap-3">
                      <div className="h-9 w-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                        <Volume2 className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-black text-slate-800 leading-tight">Semangat Belajar</h4>
                        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed font-semibold">
                          Tetap semangat belajar, anak-anak hebat! 💪📚 Jangan lupa mengulangi materi KBM yang sudah diajarkan hari ini.
                        </p>
                        <span className="text-[9px] text-slate-400 font-bold block mt-2">8 Januari 2026 pukul 08.37</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-50 text-center">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center justify-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                      Pengumuman sinkron dengan dinas
                    </span>
                  </div>
                </div>

              </div>




            </div>
          </>
        )}

        {/* ================= JADWAL PELAJARAN TAB ================= */}
        {activeTab === 'jadwal' && (
          <div className="max-w-7xl w-full mx-auto p-4 md:p-8 space-y-6">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/20 rounded-2xl shrink-0">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <div>
                  <p className="text-orange-100 text-sm font-medium">TA 2025/2026 - Semester Genap</p>
                  <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight">Jadwal Pelajaran</h2>
                  <p className="text-orange-100 text-sm font-semibold mt-1">0 kelas hari ini • 0 sudah selesai</p>
                </div>
              </div>
              <div className="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-4 w-full md:w-auto">
                {[
                  { label: 'Hari Ini', value: 0 },
                  { label: 'Selesai', value: 0 },
                  { label: 'Total', value: 24 },
                ].map((stat, idx) => (
                  <div key={idx} className="bg-white/10 rounded-xl sm:rounded-2xl p-2 sm:p-3 w-14 sm:w-16 text-center backdrop-blur-sm flex-1 sm:flex-initial">
                    <div className="text-lg sm:text-xl font-black">{stat.value}</div>
                    <div className="text-[8px] sm:text-[9px] font-bold text-orange-100 uppercase tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              {/* Days strip */}
              <div className="flex gap-2 p-4 overflow-x-auto scrollbar-hide border-b border-slate-50 bg-slate-50/50">
                {DAYS_ORDER.map(day => {
                  const cnt = schedules.filter(s => s.day === day).length;
                  const isSelected = day === selectedDay;
                  return (
                    <button 
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      className={`flex-1 py-3 px-4 rounded-xl text-center min-w-[100px] transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-orange-500 text-white font-extrabold shadow-md' 
                          : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      <p className="text-[10px] font-black uppercase tracking-wider">{day.substring(0,3)}</p>
                      <p className="text-lg font-black mt-1">{cnt}</p>
                      {isSelected && <p className="text-[9px] font-bold mt-1">Hari Ini</p>}
                    </button>
                  );
                })}
              </div>

              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <h3 className="text-xl font-black text-slate-800">{selectedDay}</h3>
                  <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-[10px] font-black uppercase tracking-wider">HARI INI</span>
                </div>
                
                <p className="text-slate-400 text-sm font-semibold mb-4">{daySchedules.length} mata pelajaran</p>

                {daySchedules.length === 0 ? (
                  <div className="mt-8 border-2 border-dashed border-slate-100 rounded-3xl p-12 text-center select-none">
                    <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="h-10 w-10 text-orange-200" />
                    </div>
                    <h4 className="text-lg font-black text-slate-800">Tidak ada jadwal</h4>
                    <p className="text-slate-400 text-sm font-semibold mt-2 max-w-sm mx-auto">
                      Hari {selectedDay} bebas dari kegiatan belajar mengajar.
                    </p>
                  </div>
                ) : (
                  <div className="w-full">
                    {/* Mobile Card Layout */}
                    <div className="block md:hidden space-y-4">
                      {daySchedules.map((s, idx) => (
                        <div key={s.id || idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col gap-2">
                          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                            <span className="text-[10px] font-black uppercase text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                              {s.time_start.substring(0, 5)} - {s.time_end.substring(0, 5)}
                            </span>
                            <span className="text-xs font-bold text-slate-600">
                              {s.room || 'Kelas ' + (user.class_level || 'XII.2')}
                            </span>
                          </div>
                          <div>
                            <h4 className="text-sm font-black text-slate-800">{s.subject_name}</h4>
                            <p className="text-xs text-slate-500 font-semibold mt-1">Guru: {s.teacher_name || 'TBA'}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Desktop Table Layout */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full lg:min-w-full text-left border-collapse text-xs md:text-sm whitespace-nowrap">
                        <thead>
                          <tr className="bg-orange-500 text-white font-black uppercase text-[9px] tracking-wider">
                            <th className="py-2 px-3 rounded-tl-xl">Jam</th>
                            <th className="py-2 px-3">Mapel</th>
                            <th className="py-2 px-3">Guru</th>
                            <th className="py-2 px-3 text-center rounded-tr-xl">Ruang</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 font-semibold text-slate-700">
                          {daySchedules.map((s, idx) => (
                            <tr key={s.id || idx} className="hover:bg-slate-50/50">
                              <td className="py-3 px-3 font-extrabold text-orange-600 text-[11px]">{s.time_start.substring(0, 5)} - {s.time_end.substring(0, 5)}</td>
                              <td className="py-3 px-3 font-black text-slate-800 text-[11px]">{s.subject_name}</td>
                              <td className="py-3 px-3 text-slate-500 text-[11px]">{s.teacher_name || 'TBA'}</td>
                              <td className="py-3 px-3 text-center text-slate-600 font-bold text-[11px]">{s.room || 'Kelas ' + (user.class_level || 'XII.2')}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= MAPEL SAYA TAB ================= */}
        {activeTab === 'mapel' && (
          <div className="max-w-7xl w-full mx-auto p-4 md:p-8 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-6 w-6 text-orange-600" />
              <h2 className="text-xl font-extrabold text-slate-800 font-display">Mata Pelajaran Saya</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {uniqueSubjects.length === 0 ? (
                <div className="col-span-full bg-white rounded-3xl p-10 text-center border border-slate-100">
                  <BookOpen className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                  <p className="font-extrabold text-slate-500 text-sm">Tidak ada mata pelajaran</p>
                </div>
              ) : (
                uniqueSubjects.map((s, idx) => {
                  const style = getSubjectColorStyles(s.subject_name, idx);
                  const Icon = style.icon;
                  return (
                    <div key={s.id} className="bg-white rounded-[24px] overflow-hidden shadow-sm border border-slate-100 flex flex-col justify-between">
                      <div className={`${style.bg} px-5 pt-5 pb-6 flex justify-between items-start`}>
                        <div className="bg-white/20 p-2.5 rounded-xl border border-white/20">
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <span className="bg-black/20 text-white text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider backdrop-blur-sm">
                          Kelas {user.class_level || 'XII.2'}
                        </span>
                      </div>
                      <div className="p-6 bg-white flex flex-col flex-1 relative -mt-3 rounded-t-3xl border-t border-slate-100/50">
                        <div className="flex-1">
                          <h3 className="font-extrabold text-lg text-slate-800 mb-1 leading-tight">{s.subject_name}</h3>
                          <div className="flex items-center gap-1.5 text-slate-400 mb-4">
                            <User className="h-4 w-4" />
                            <span className="text-xs font-semibold uppercase">{s.teacher_name || 'TBA'}</span>
                          </div>
                          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${style.pillBg} ${style.text} mb-6`}>
                            <Calendar className="h-4 w-4" />
                            <span>{s.day} • {s.time_start.substring(0,5)}–{s.time_end.substring(0,5)}</span>
                          </div>
                        </div>
                        <button className="w-full mt-auto flex justify-center items-center gap-2 py-3 rounded-xl border border-slate-200 text-sm font-extrabold text-slate-700 hover:bg-slate-50 transition-colors">
                          Buka Modul <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ================= TUGAS HARIAN TAB ================= */}
        {activeTab === 'tugas' && (
          <div className="max-w-7xl w-full mx-auto p-4 md:p-8 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-black text-slate-800 font-display tracking-tight">Daftar Tugas</h2>
              <button className="relative p-2 text-slate-400 hover:text-orange-600 transition-colors">
                <Bell className="h-6 w-6" />
                <span className="absolute top-1 right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
            </div>
            <p className="text-slate-500 font-semibold mb-6">Kelola dan kumpulkan tugas sekolah</p>

            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/20 rounded-2xl shrink-0">
                  <Clipboard className="h-8 w-8 text-white" />
                </div>
                <div>
                  <p className="text-orange-100 text-sm font-medium">Tugas Harian</p>
                  <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight">Tugas & PR</h2>
                  <p className="text-orange-100 text-sm font-semibold mt-1">Kumpulkan tugas sebelum deadline</p>
                </div>
              </div>
              <div className="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-4 w-full md:w-auto">
                {[
                  { label: 'Total', value: 7 },
                  { label: 'Aktif', value: 0 },
                  { label: 'Selesai', value: 4 },
                ].map((stat, idx) => (
                  <div key={idx} className="bg-white/10 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 w-16 sm:w-20 text-center backdrop-blur-sm flex-1 sm:flex-initial">
                    <div className="text-xl sm:text-2xl font-black">{stat.value}</div>
                    <div className="text-[9px] sm:text-[10px] font-bold text-orange-100 uppercase tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm">
              <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-slate-400">🔍</span>
                </div>
                <input 
                  type="text" 
                  placeholder="Cari tugas atau mapel..." 
                  className="w-full pl-10 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-between items-center px-4 mb-4">
                <span className="px-3 py-1 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3" /> Sudah Dikumpulkan
                </span>
                <span className="text-xs font-bold text-slate-400">4 tugas</span>
              </div>

              <div className="space-y-3">
                {assignments.map(a => (
                  <div key={a.id} className="p-4 border border-slate-100 rounded-2xl flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                        <FileText className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-800 text-sm leading-snug">{a.name}</h4>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[9px] font-bold uppercase">{a.type}</span>
                        <p className="text-slate-400 text-[10px] font-bold mt-1">📅 13 Jan, 16.45 • {a.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase">Nilai: 100.00</span>
                      <ChevronRight className="h-5 w-5 text-slate-300" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= RAPOR ACADEMIC TAB ================= */}
        {activeTab === 'rapor' && (
          <div className="max-w-7xl w-full mx-auto p-4 md:p-8 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-black text-slate-800 font-display tracking-tight">Rapor Saya</h2>
              <button className="relative p-2 text-slate-400 hover:text-orange-600 transition-colors">
                <Bell className="h-6 w-6" />
                <span className="absolute top-1 right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
            </div>
            <p className="text-slate-500 font-semibold mb-6">Lihat perkembangan akademik Anda</p>

            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/20 rounded-2xl shrink-0">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <div>
                  <p className="text-orange-100 text-sm font-medium">Ruang Siswa</p>
                  <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight">Rapor Saya</h2>
                  <p className="text-orange-100 text-sm font-semibold mt-1">Pantau perkembangan akademik per semester</p>
                </div>
              </div>
              <div className="flex flex-wrap sm:flex-nowrap gap-3 items-center w-full md:w-auto">
                <div className="flex gap-2 sm:gap-3 flex-1 sm:flex-initial">
                  {[
                    { label: 'Rata-Rata', value: '0.0' },
                    { label: 'Total Mapel', value: '16' },
                  ].map((stat, idx) => (
                    <div key={idx} className="bg-white/10 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 w-20 sm:w-24 text-center backdrop-blur-sm flex-1">
                      <div className="text-xl sm:text-2xl font-black">{stat.value}</div>
                      <div className="text-[9px] sm:text-[10px] font-bold text-orange-100 uppercase tracking-wider">{stat.label}</div>
                    </div>
                  ))}
                </div>
                <button className="bg-white text-indigo-600 font-black px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 hover:bg-violet-50 transition-colors flex-1 sm:flex-initial text-xs sm:text-sm">
                  <FileText className="h-4.5 w-4.5" />
                  Unduh E-Rapor
                </button>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl shrink-0">
                  <Calendar className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5 leading-none">Tahun Ajaran Aktif</p>
                  <h3 className="font-black text-slate-800 text-sm sm:text-base leading-tight">Pilih Semester Penilaian</h3>
                </div>
              </div>
              <div className="flex bg-slate-100 p-1 rounded-2xl w-full md:w-auto">
                <button 
                  onClick={() => setSelectedSemester('Ganjil')}
                  className={`flex-1 md:flex-initial px-4 md:px-6 py-2.5 md:py-3 text-xs md:text-sm font-bold rounded-xl transition-all ${
                    selectedSemester === 'Ganjil' 
                      ? 'bg-white text-indigo-600 font-black shadow-sm' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Semester Ganjil
                </button>
                <button 
                  onClick={() => setSelectedSemester('Genap')}
                  className={`flex-1 md:flex-initial px-4 md:px-6 py-2.5 md:py-3 text-xs md:text-sm font-bold rounded-xl transition-all ${
                    selectedSemester === 'Genap' 
                      ? 'bg-white text-indigo-600 font-black shadow-sm' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Semester Genap
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {grades.map((g, index) => (
                <div key={index} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-black text-slate-800 text-lg leading-tight">{g.subject}</h3>
                      <p className="text-slate-400 text-xs font-bold mt-1">NAMA GURU</p>
                    </div>
                    <button className="h-10 w-10 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center font-black">-</button>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center bg-slate-50 p-4 rounded-2xl">
                    {[
                      { label: 'TUGAS', value: g.tugas || '0' },
                      { label: 'HARIAN', value: g.kuis || '0' },
                      { label: 'UTS', value: '0' },
                      { label: 'UAS', value: g.ujian || '0' },
                    ].map((item, idx) => (
                      <div key={idx}>
                        <p className="text-[9px] font-black text-slate-400">{item.label}</p>
                        <p className="text-lg font-black text-slate-800">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= DAFTAR UJIAN TAB ================= */}
        {activeTab === 'daftar-ujian' && (
          <div className="max-w-7xl w-full mx-auto p-4 md:p-8 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Clipboard className="h-6 w-6 text-orange-600" />
              <h2 className="text-xl font-extrabold text-slate-800 font-display">Daftar Ujian CBT Aktif</h2>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8 space-y-6">
              {exams.length === 0 ? (
                <div className="py-12 text-center text-slate-400 font-bold select-none">
                  Tidak ada ujian CBT aktif saat ini.
                </div>
              ) : (
                <div className="w-full">
                  {/* Mobile Card Layout */}
                  <div className="block md:hidden space-y-4">
                    {exams.map((exam) => (
                      <div key={exam.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col gap-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-sm font-black text-slate-800">{exam.name}</h4>
                            <p className="text-xs text-orange-600 font-bold mt-1">{exam.subject}</p>
                          </div>
                          <span className="text-[10px] font-black uppercase text-slate-500 bg-slate-200/60 px-2 py-0.5 rounded-full">
                            {exam.duration}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 border-t border-slate-100 pt-2 font-medium">
                          Jadwal: {exam.date} • {exam.time}
                        </div>
                        <button
                          onClick={() => handleStartExamClick(exam)}
                          className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-black transition-all text-center cursor-pointer"
                        >
                          Mulai Ujian
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Desktop Table Layout */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full lg:min-w-full text-left border-collapse text-xs md:text-sm whitespace-nowrap">
                      <thead>
                        <tr className="bg-orange-500 text-white font-black uppercase text-[10px] tracking-wider">
                          <th className="py-3 px-4 rounded-tl-xl">Nama Ujian</th>
                          <th className="py-3 px-4">Mata Pelajaran</th>
                          <th className="py-3 px-4">Jadwal & Waktu</th>
                          <th className="py-3 px-4 text-center">Durasi</th>
                          <th className="py-3 px-4 text-center rounded-tr-xl">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 font-semibold text-slate-700">
                        {exams.map((exam) => (
                          <tr key={exam.id} className="hover:bg-slate-50/50">
                            <td className="py-3.5 px-4 font-extrabold text-slate-800">{exam.name}</td>
                            <td className="py-3.5 px-4 text-slate-500 font-bold">{exam.subject}</td>
                            <td className="py-3.5 px-4 text-slate-500">{exam.date} • {exam.time}</td>
                            <td className="py-3.5 px-4 text-center text-slate-600 font-bold">{exam.duration}</td>
                            <td className="py-3.5 px-4 text-center">
                              <button
                                onClick={() => handleStartExamClick(exam)}
                                className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-black transition-all shadow-sm shadow-orange-100 cursor-pointer"
                              >
                                Mulai Ujian
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= RIWAYAT UJIAN TAB ================= */}
        {activeTab === 'riwayat-ujian' && (
          <div className="max-w-7xl w-full mx-auto p-4 md:p-8 space-y-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-orange-50 rounded-2xl">
                  <History className="h-5 w-5 text-orange-600" />
                </div>
                <h2 className="text-lg font-black text-slate-800 font-display tracking-tight">Riwayat Hasil Ujian CBT</h2>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8 space-y-6">
              {examHistory.length === 0 ? (
                <div className="py-12 text-center text-slate-400 font-bold select-none">
                  Belum ada riwayat ujian yang diselesaikan.
                </div>
              ) : (
                <div className="w-full">
                  {/* Mobile Card Layout */}
                  <div className="block md:hidden space-y-4">
                    {examHistory.map((history) => (
                      <div key={history.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col gap-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-sm font-black text-slate-800">{history.name}</h4>
                            <p className="text-xs text-slate-500 font-bold mt-1">{history.subject}</p>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            history.status === 'Lulus' 
                              ? 'bg-emerald-50 text-emerald-600' 
                              : 'bg-red-50 text-red-600'
                          }`}>
                            {history.status}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs border-t border-slate-100 pt-2">
                          <span className="text-slate-400 font-semibold">Tgl Selesai: {history.date}</span>
                          <span className="font-extrabold text-orange-600">Nilai: {history.score}</span>
                        </div>
                        {onDeleteExamHistory && (
                          <button
                            onClick={() => {
                              setDeleteTargetId(history.id);
                              setDeleteTargetName(history.name);
                            }}
                            className="w-full py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-black transition-all text-center cursor-pointer mt-1"
                          >
                            Hapus Riwayat
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Desktop Table Layout */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full lg:min-w-full text-left border-collapse text-xs md:text-sm whitespace-nowrap">
                      <thead>
                        <tr className="bg-orange-500 text-white font-black uppercase text-[10px] tracking-wider">
                          <th className="py-3 px-4 rounded-tl-xl">Nama Ujian</th>
                          <th className="py-3 px-4">Mata Pelajaran</th>
                          <th className="py-3 px-4">Tanggal Selesai</th>
                          <th className="py-3 px-4 text-center">Nilai Ujian</th>
                          <th className="py-3 px-4 text-center">Status Kelulusan</th>
                          {onDeleteExamHistory && <th className="py-3 px-4 text-center rounded-tr-xl">Aksi</th>}
                          {!onDeleteExamHistory && <th className="rounded-tr-xl w-0 p-0"></th>}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 font-semibold text-slate-700">
                        {examHistory.map((history) => (
                          <tr key={history.id} className="hover:bg-slate-50/50">
                            <td className="py-3.5 px-4 font-extrabold text-slate-800">{history.name}</td>
                            <td className="py-3.5 px-4 text-slate-500 font-bold">{history.subject}</td>
                            <td className="py-3.5 px-4 text-slate-500">{history.date}</td>
                            <td className="py-3.5 px-4 text-center text-orange-600 font-extrabold">{history.score}</td>
                            <td className="py-3.5 px-4 text-center">
                              <span className={`px-2.5 py-1 rounded-lg font-black text-[10px] uppercase tracking-wider ${
                                history.status === 'Lulus' 
                                  ? 'bg-emerald-50 text-emerald-600' 
                                  : 'bg-red-50 text-red-600'
                              }`}>
                                {history.status}
                              </span>
                            </td>
                            {onDeleteExamHistory && (
                              <td className="py-3.5 px-4 text-center">
                                <button
                                  onClick={() => {
                                    setDeleteTargetId(history.id);
                                    setDeleteTargetName(history.name);
                                  }}
                                  className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all cursor-pointer inline-flex items-center justify-center active:scale-95"
                                  title="Hapus"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= RIWAYAT ABSENSI TAB ================= */}
        {activeTab === 'absen' && (
          <div className="max-w-7xl w-full mx-auto p-4 md:p-8 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <History className="h-6 w-6 text-orange-600" />
              <h2 className="text-xl font-extrabold text-slate-800 font-display">Riwayat Absensi Kehadiran</h2>
            </div>

            {/* Attendance parameters counts summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-center">
              <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">HADIR</span>
                <span className="text-xl font-black text-emerald-600 block mt-1">24 Hari</span>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">SAKIT</span>
                <span className="text-xl font-black text-amber-500 block mt-1">1 Hari</span>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">IZIN</span>
                <span className="text-xl font-black text-purple-600 block mt-1">2 Hari</span>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">ALPHA</span>
                <span className="text-xl font-black text-rose-500 block mt-1">0 Hari</span>
              </div>
            </div>

            {/* Log Entries */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-100">
                <h3 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider">Log Aktivitas Kehadiran Bulan Ini</h3>
              </div>
              
              <div className="p-6 divide-y divide-slate-50 text-xs md:text-sm">
                {attendanceTime && (
                  <div className="py-3 flex justify-between items-center">
                    <div>
                      <p className="font-extrabold text-slate-800">Hari ini (Simulasi)</p>
                      <p className="text-slate-400 text-xs font-semibold mt-0.5">Metode scan QR Code Kelas</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2.5 py-0.5 rounded-full font-black text-[10px] ${attConfig.bg}`}>{attendanceStatus}</span>
                      <span className="text-slate-500 text-xs block font-bold mt-1">Pukul {attendanceTime} WIB</span>
                    </div>
                  </div>
                )}
                
                <div className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-extrabold text-slate-800">Kemarin, 1 Juli 2026</p>
                    <p className="text-slate-400 text-xs font-semibold mt-0.5">Kehadiran tercatat otomatis</p>
                  </div>
                  <div className="text-right">
                    <span className="px-2.5 py-0.5 rounded-full font-black text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-100">HADIR</span>
                    <span className="text-slate-500 text-xs block font-bold mt-1">Pukul 07.12 WIB</span>
                  </div>
                </div>

                <div className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-extrabold text-slate-800">Selasa, 30 Juni 2026</p>
                    <p className="text-slate-400 text-xs font-semibold mt-0.5">Kehadiran tercatat otomatis</p>
                  </div>
                  <div className="text-right">
                    <span className="px-2.5 py-0.5 rounded-full font-black text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-100">HADIR</span>
                    <span className="text-slate-500 text-xs block font-bold mt-1">Pukul 07.24 WIB</span>
                  </div>
                </div>

                <div className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-extrabold text-slate-800">Senin, 29 Juni 2026</p>
                    <p className="text-slate-400 text-xs font-semibold mt-0.5">Kehadiran tercatat otomatis</p>
                  </div>
                  <div className="text-right">
                    <span className="px-2.5 py-0.5 rounded-full font-black text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-100">HADIR</span>
                    <span className="text-slate-500 text-xs block font-bold mt-1">Pukul 07.10 WIB</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= PORTAL USER PROFILE TAB ================= */}
        {activeTab === 'profile' && (
          <div className="max-w-7xl w-full mx-auto p-4 md:p-8 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <User className="h-6 w-6 text-orange-600" />
              <h2 className="text-xl font-extrabold text-slate-800 font-display">Profil Akademik</h2>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-10 flex flex-col sm:flex-row items-center gap-5 text-white">
                <div className="h-20 w-20 rounded-2xl bg-white/10 flex items-center justify-center text-3xl font-black ring-4 ring-white/10 select-none border border-white/20">
                  {user.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-lg md:text-xl font-black font-display leading-tight">{user.name}</h3>
                  <p className="text-orange-100 text-xs mt-1.5 font-bold">Nomor Induk Siswa: NIS-2025001 • Kelas: {user.class_level || '10-A'}</p>
                </div>
              </div>

              <div className="p-6 md:p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs md:text-sm">
                  <div className="space-y-1.5 p-4 bg-slate-50 rounded-2xl">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Alamat Email Terdaftar</span>
                    <span className="text-slate-800 font-extrabold block mt-0.5">{user.email}</span>
                  </div>
                  <div className="space-y-1.5 p-4 bg-slate-50 rounded-2xl">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Status Keanggotaan</span>
                    <span className="text-emerald-600 font-extrabold block mt-0.5">AKTIF / TERVERIFIKASI</span>
                  </div>
                  <div className="space-y-1.5 p-4 bg-slate-50 rounded-2xl">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Sekolah Asal</span>
                    <span className="text-slate-800 font-extrabold block mt-0.5">SMA Negeri 1 Indonesia</span>
                  </div>
                  <div className="space-y-1.5 p-4 bg-slate-50 rounded-2xl">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Tahun Ajaran</span>
                    <span className="text-slate-800 font-extrabold block mt-0.5">2025/2026 - Semester Genap</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-slate-400">
                  <span>Data terintegrasi aman di sistem Dapodik cloud</span>
                  <button 
                    onClick={onLogout}
                    className="bg-rose-50 hover:bg-rose-100 text-rose-600 px-5 py-2.5 rounded-xl font-extrabold transition-all text-xs cursor-pointer"
                  >
                    Logout Dari Akun Saya
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= PENGATURAN AKUN (PROFILE SETTINGS) TAB ================= */}
        {activeTab === 'profile-settings' && (
          <div className="max-w-7xl w-full mx-auto p-4 md:p-8 space-y-6 pb-24 md:pb-8">
            {/* Header Title */}
            <div className="flex items-start gap-3.5 mb-2">
              <div className="p-2 bg-slate-50 text-slate-700 rounded-xl border border-slate-100">
                <Settings className="h-5.5 w-5.5" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-black text-slate-800 font-display leading-none">Pengaturan Akun</h2>
                <p className="text-slate-400 text-xs font-bold mt-1.5">Kelola informasi profil dan keamanan akunmu.</p>
              </div>
            </div>

            {/* Main Column Layout */}
            <div className="flex flex-col md:flex-row gap-6">
              {/* Left Sub-Sidebar Card */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 w-full md:w-64 space-y-1.5 shrink-0 h-fit">
                <button
                  onClick={() => { setProfileSubTab('profile'); setSaveMessage(null); }}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${profileSubTab === 'profile' ? 'bg-orange-600 text-white shadow-md shadow-orange-100' : 'bg-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
                >
                  <User className="h-4.5 w-4.5 shrink-0" />
                  <span>Profil Saya</span>
                </button>
                <button
                  onClick={() => { setProfileSubTab('security'); setSaveMessage(null); }}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${profileSubTab === 'security' ? 'bg-orange-600 text-white shadow-md shadow-orange-100' : 'bg-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
                >
                  <Shield className="h-4.5 w-4.5 shrink-0" />
                  <span>Keamanan</span>
                </button>
              </div>

              {/* Right Content Card */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8 flex-1 space-y-6">
                {saveMessage && (
                  <div className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2 ${saveMessage.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                    {saveMessage.type === 'success' ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
                    <span>{saveMessage.text}</span>
                  </div>
                )}

                {profileSubTab === 'profile' ? (
                  <div className="space-y-6">
                    {/* Inner Header */}
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                      <div className="h-10 w-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                        <User className="h-5 w-5" />
                      </div>
                      <h3 className="text-base font-extrabold text-slate-800 font-display">Informasi Profil</h3>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Nama Lengkap</label>
                        <input
                          type="text"
                          value={profileName}
                          onChange={(e) => setProfileName(e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-slate-800 font-extrabold text-xs md:text-sm focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-50 transition-all shadow-sm"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Username</label>
                        <input
                          type="text"
                          value={profileUsername}
                          readOnly
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-150 rounded-2xl text-slate-400 font-bold text-xs md:text-sm cursor-not-allowed select-none"
                        />
                        <div className="flex items-center gap-1.5 mt-2 text-[10px] font-bold text-slate-400">
                          <Lock className="h-3 w-3 text-slate-400" />
                          <span>Username dikelola oleh admin sekolah.</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Peran (Role)</label>
                          <input
                            type="text"
                            value="Siswa"
                            readOnly
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-150 rounded-2xl text-slate-400 font-bold text-xs md:text-sm cursor-not-allowed select-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">ID Sekolah</label>
                          <input
                            type="text"
                            value="2"
                            readOnly
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-150 rounded-2xl text-slate-400 font-bold text-xs md:text-sm cursor-not-allowed select-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end pt-4 border-t border-slate-50">
                      <button
                        onClick={() => {
                          setSaveMessage({ text: 'Perubahan profil berhasil disimpan!', type: 'success' });
                          setTimeout(() => setSaveMessage(null), 4000);
                        }}
                        className="flex items-center gap-2 px-5 py-3 bg-orange-600 hover:bg-orange-700 text-white font-black text-xs md:text-sm rounded-2xl transition-all shadow-md shadow-orange-100 cursor-pointer"
                      >
                        <Save className="h-4 w-4" />
                        <span>Simpan Perubahan</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Inner Header */}
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                      <div className="h-10 w-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                        <Lock className="h-5 w-5" />
                      </div>
                      <h3 className="text-base font-extrabold text-slate-800 font-display">Keamanan Akun</h3>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Password Lama</label>
                        <input
                          type="password"
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-slate-800 font-bold text-xs md:text-sm focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-50 transition-all shadow-sm"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Password Baru</label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-slate-800 font-bold text-xs md:text-sm focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-50 transition-all shadow-sm"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Konfirmasi Password Baru</label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-slate-800 font-bold text-xs md:text-sm focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-50 transition-all shadow-sm"
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end pt-4 border-t border-slate-50">
                      <button
                        onClick={() => {
                          if (!oldPassword || !newPassword || !confirmPassword) {
                            setSaveMessage({ text: 'Mohon isi semua kolom password!', type: 'error' });
                            return;
                          }
                          if (newPassword !== confirmPassword) {
                            setSaveMessage({ text: 'Konfirmasi password baru tidak cocok!', type: 'error' });
                            return;
                          }
                          setSaveMessage({ text: 'Password Anda berhasil diperbarui!', type: 'success' });
                          setOldPassword('');
                          setNewPassword('');
                          setConfirmPassword('');
                          setTimeout(() => setSaveMessage(null), 4000);
                        }}
                        className="flex items-center gap-2 px-5 py-3 bg-orange-600 hover:bg-orange-700 text-white font-black text-xs md:text-sm rounded-2xl transition-all shadow-md shadow-orange-100 cursor-pointer"
                      >
                        <Save className="h-4 w-4" />
                        <span>Perbarui Password</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ================= MODAL: TOKEN VERIFIKASI CBT ================= */}
      {selectedExamForToken && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-100 animate-scaleUp p-6 space-y-5">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="p-2.5 bg-orange-50 rounded-2xl text-orange-600">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider font-display">Verifikasi Token Ujian</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{selectedExamForToken.subject}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Ujian</span>
                <span className="text-sm font-black text-slate-800 block">{selectedExamForToken.name}</span>
                <span className="text-xs font-medium text-slate-500 block mt-1">Durasi: {selectedExamForToken.duration}</span>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">Token Rilis Pengawas</label>
                <input 
                  type="text" 
                  value={examTokenInput}
                  onChange={(e) => { setExamTokenInput(e.target.value); setTokenError(''); }}
                  placeholder="Contoh: AQX8YF" 
                  className="w-full bg-slate-50 border border-slate-200 focus:border-orange-500 outline-none text-center text-lg font-black tracking-widest uppercase text-slate-800 h-12 rounded-2xl transition-all"
                />
                {tokenError && (
                  <p className="text-xs font-bold text-red-500 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{tokenError}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => setSelectedExamForToken(null)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-extrabold text-xs rounded-2xl transition-all cursor-pointer text-center uppercase tracking-wider animate-pulse-slow"
              >
                Batal
              </button>
              <button 
                onClick={handleVerifyTokenAndStart}
                className="flex-1 py-3 bg-orange-600 hover:bg-orange-700 text-white font-black text-xs rounded-2xl transition-all shadow-md shadow-orange-100 cursor-pointer text-center uppercase tracking-wider"
              >
                Mulai Ujian
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: KONFIRMASI HAPUS SATU RIWAYAT ================= */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-100 p-6 space-y-6 animate-scaleUp">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="p-2.5 bg-red-50 rounded-2xl text-red-600">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider font-display">Hapus Riwayat Ujian</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Tindakan ini tidak dapat dibatalkan</p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-slate-600 font-bold leading-relaxed">
                Apakah Anda yakin ingin menghapus riwayat hasil ujian berikut dari akun Anda?
              </p>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Nama Ujian</span>
                <span className="text-sm font-black text-slate-800 block mt-0.5">{deleteTargetName}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => {
                  setDeleteTargetId(null);
                  setDeleteTargetName('');
                }}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-extrabold text-xs rounded-2xl transition-all cursor-pointer text-center uppercase tracking-wider"
              >
                Batal
              </button>
              <button 
                onClick={() => {
                  if (onDeleteExamHistory && deleteTargetId) {
                    onDeleteExamHistory(deleteTargetId);
                  }
                  setDeleteTargetId(null);
                  setDeleteTargetName('');
                }}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-2xl transition-all shadow-md shadow-red-100 cursor-pointer text-center uppercase tracking-wider"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: KONFIRMASI HAPUS SEMUA RIWAYAT ================= */}
      {showClearAllConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-100 p-6 space-y-6 animate-scaleUp">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="p-2.5 bg-red-100 rounded-2xl text-red-600">
                <AlertCircle className="h-5 w-5 animate-pulse" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider font-display">Bersihkan Semua Riwayat</h3>
                <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider mt-0.5">Peringatan Tindakan Kritis</p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-slate-600 font-bold leading-relaxed">
                Apakah Anda yakin ingin menghapus <span className="font-black text-red-600">SELURUH</span> riwayat hasil ujian CBT yang telah Anda kerjakan?
              </p>
              <div className="p-3.5 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2 text-[11px] text-red-600 font-bold leading-relaxed">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>Semua data nilai dan status kelulusan Anda di tab riwayat akan terhapus secara permanen dari sesi penyimpanan lokal ini.</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => setShowClearAllConfirm(false)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-extrabold text-xs rounded-2xl transition-all cursor-pointer text-center uppercase tracking-wider"
              >
                Batal
              </button>
              <button 
                onClick={() => {
                  if (onClearAllExamHistory) {
                    onClearAllExamHistory();
                  }
                  setShowClearAllConfirm(false);
                }}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-2xl transition-all shadow-md shadow-red-100 cursor-pointer text-center uppercase tracking-wider"
              >
                Ya, Hapus Semua
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
