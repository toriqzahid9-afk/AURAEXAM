import React, { useState, FormEvent, useMemo } from 'react';
import AppLogo from './AppLogo';
import { 
  Menu,
  QrCode, 
  Clock, 
  BookOpen, 
  Clipboard, 
  Award, 
  User, 
  ArrowRight, 
  Calendar,
  CheckCircle2,
  Users,
  ShieldCheck,
  ListTodo,
  Home,
  LogOut,
  ChevronRight,
  ChevronLeft,
  FileText,
  Plus,
  Trash2,
  Edit,
  Save,
  Check,
  ClipboardCheck,
  PlaySquare,
  Eye,
  AlertCircle,
  Settings,
  Shield,
  Lock,
  Globe,
  Search,
  ArrowLeft,
  Sparkles,
  HelpCircle,
  RefreshCw,
  Key,
  Filter,
  Volume2,
  Bell,
  X
} from 'lucide-react';
import { User as UserType, TeacherGrade, Schedule, Assignment } from '../types';
import { mockDb } from '../mockDb';

interface TeacherDashboardProps {
  user: UserType;
  users: UserType[];
  attendanceStatus: string;
  attendanceTime: string | null;
  onOpenScanner: () => void;
  onOpenPermit: (type: 'Sakit' | 'Izin') => void;
  onNavigateTo: (menuKey: string, menuName: string) => void;
  teacherGrades: TeacherGrade[];
  schedules: Schedule[];
  assignments: Assignment[];
  setAssignments: React.Dispatch<React.SetStateAction<Assignment[]>>;
  onLogout: () => void;
}

export default function TeacherDashboard({
  user,
  users,
  attendanceStatus,
  attendanceTime,
  onOpenScanner,
  onOpenPermit,
  onNavigateTo,
  teacherGrades,
  schedules,
  assignments,
  setAssignments,
  onLogout
}: TeacherDashboardProps) {
  // Navigation & UI state
  const [activeTab, setActiveTab] = useState<'dashboard' | 'jadwal' | 'kelas' | 'tugas' | 'penilaian' | 'rapor' | 'mapel' | 'bank-soal' | 'jadwal-ujian' | 'monitor-ujian' | 'data-siswa' | 'hasil-nilai' | 'profile-settings'>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState('Senin');
  const DAYS_ORDER = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  // --- LOCAL MOCK DATABASE STATES ---
  // 1. Assignments State (Daftar Tugas)
  const localAssignments = assignments;
  const setLocalAssignments = setAssignments;
  const [newAssignmentTitle, setNewAssignmentTitle] = useState('');
  const [newAssignmentSubject, setNewAssignmentSubject] = useState('Fisika Terapan');
  const [newAssignmentDeadline, setNewAssignmentDeadline] = useState('2026-07-15');
  const [previewFile, setPreviewFile] = useState<string | null>(null);


  // 3. Subject Reports State (Laporan Mapel)
  const [kbmReports, setKbmReports] = useState([
    { id: 1, date: '2026-06-29', class: '12 IPA 1', subject: 'Fisika Terapan', material: 'Teori Relativitas Khusus', notes: 'Siswa memahami dilatasi waktu dengan baik melalui video simulasi.' },
    { id: 2, date: '2026-06-25', class: '12 IPA 1', subject: 'Matematika Wajib', material: 'Integral Parsial', notes: 'Latihan soal dilanjutkan pekan depan karena beberapa siswa masih kesulitan.' }
  ]);
  const [newKbmClass, setNewKbmClass] = useState('12 IPA 1');
  const [newKbmSubject, setNewKbmSubject] = useState('Fisika Terapan');
  const [newKbmMaterial, setNewKbmMaterial] = useState('');
  const [newKbmNotes, setNewKbmNotes] = useState('');

  // 4. Questions Bank State (Bank Soal)
  const [questionsBank, setQuestionsBank] = useState([
    { id: 1, subject: 'Fisika Terapan', text: 'Manakah yang termasuk gelombang elektromagnetik?', a: 'Gelombang Bunyi', b: 'Gelombang Sinar-X', c: 'Gelombang Tali', d: 'Gelombang Air', correct: 'B' },
    { id: 2, subject: 'Matematika Wajib', text: 'Turunan pertama dari f(x) = sin(2x) adalah...', a: 'cos(2x)', b: '2 cos(2x)', c: '-2 cos(2x)', d: 'cos^2(x)', correct: 'B' },
    { id: 3, subject: 'Fisika Terapan', text: 'Satuan Hambatan Listrik dalam SI adalah...', a: 'Ampere', b: 'Volt', c: 'Ohm', d: 'Watt', correct: 'C' }
  ]);
  const [newQText, setNewQText] = useState('');
  const [newQSubject, setNewQSubject] = useState('Fisika Terapan');
  const [newQA, setNewQA] = useState('');
  const [newQB, setNewQB] = useState('');
  const [newQC, setNewQC] = useState('');
  const [newQD, setNewQD] = useState('');
  const [newQCorrect, setNewQCorrect] = useState('A');

  // --- RECONSTRUCTED HIGH-FIDELITY BANK SOAL STATES ---
  const [bankSoalPackages, setBankSoalPackages] = useState(() => mockDb.getBankSoalPackages());

  React.useEffect(() => {
    mockDb.setBankSoalPackages(bankSoalPackages);
  }, [bankSoalPackages]);

  const [activeBankSoalId, setActiveBankSoalId] = useState<number | null>(null);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number>(0);
  const [activeBankSoalSubTab, setActiveBankSoalSubTab] = useState<'private' | 'public'>('private');
  const [bankSoalSearchQuery, setBankSoalSearchQuery] = useState<string>('');
  const [bankSoalMapelFilter, setBankSoalMapelFilter] = useState<string>('Semua Mapel');
  const [bankSoalKelasFilter, setBankSoalKelasFilter] = useState<string>('Semua Kelas');
  
  // Modals for Bank Soal metadata editing (Image 2 style)
  const [editingBankSoal, setEditingBankSoal] = useState<any | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  
  // Temp form states for Edit/Create Modal
  const [modalTitle, setModalTitle] = useState('');
  const [modalDescription, setModalDescription] = useState('');
  const [modalSubject, setModalSubject] = useState('Geografi');
  const [modalGrade, setModalGrade] = useState('XI.1');
  const [modalIsPublic, setModalIsPublic] = useState(false);

  // Active Question under edit inside Workspace (Image 3 style)
  const [activeQType, setActiveQType] = useState<'Pilihan Ganda' | 'Essay'>('Pilihan Ganda');
  const [activeQWeight, setActiveQWeight] = useState<number>(5);
  const [activeQText, setActiveQText] = useState<string>('');
  const [activeQOptions, setActiveQOptions] = useState({
    A: '', B: '', C: '', D: '', E: ''
  });
  const [activeQCorrect, setActiveQCorrect] = useState<'A' | 'B' | 'C' | 'D' | 'E'>('A');
  const [activeQEssayAnswer, setActiveQEssayAnswer] = useState<string>('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  // 5. Exam Schedules (Jadwal Ujian)
  const [examSchedules, setExamSchedules] = useState(() => mockDb.getExamSchedules());

  React.useEffect(() => {
    mockDb.setExamSchedules(examSchedules);
  }, [examSchedules]);
  const [newExamName, setNewExamName] = useState('');
  const [newExamSubject, setNewExamSubject] = useState('Fisika Terapan');
  const [newExamDate, setNewExamDate] = useState('2026-07-07');
  const [newExamTime, setNewExamTime] = useState('08:00 - 09:30');
  const [newExamDuration, setNewExamDuration] = useState('90');

  // Interactive scheduler states matching user request (Screenshot 1 & 2)
  const [activeScheduleTab, setActiveScheduleTab] = useState<'saya' | 'semua' | 'aktif' | 'selesai'>('saya');
  const [isCreateScheduleModalOpen, setIsCreateScheduleModalOpen] = useState(false);
  const [schedulePackageId, setSchedulePackageId] = useState<string>('');
  const [scheduleName, setScheduleName] = useState('');
  const [scheduleStartTime, setScheduleStartTime] = useState('');
  const [scheduleEndTime, setScheduleEndTime] = useState('');
  const [scheduleDuration, setScheduleDuration] = useState('60');
  const [scheduleSync, setScheduleSync] = useState(true);
  const [scheduleToken, setScheduleToken] = useState('AQX8YF');

  // Custom states for non-blocking confirmations and toast notifications (inside iframe)
  const [deleteBankSoalId, setDeleteBankSoalId] = useState<number | null>(null);
  const [deleteBankSoalTitle, setDeleteBankSoalTitle] = useState<string>('');
  const [deleteScheduleId, setDeleteScheduleId] = useState<number | null>(null);
  const [deleteScheduleName, setDeleteScheduleName] = useState<string>('');
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ text, type });
  };

  const alert = (text: string) => {
    showToast(text, 'success');
  };

  React.useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // 6. Real-Time Proctoring State (Monitor Ujian)
  const [activeExamTakers, setActiveExamTakers] = useState([
    { id: '101', name: 'DZAKWAN TORIQ ZAHID', status: 'Aktif', progress: '35/40 Soal', timeElapsed: '45 Menit', violations: 0, ip: '192.168.10.45' },
    { id: '102', name: 'BUDI SANTOSO', status: 'Selesai', progress: '40/40 Soal', timeElapsed: '55 Menit', violations: 1, ip: '192.168.10.12' },
    { id: '103', name: 'LUTHFI HANIF', status: 'Aktif', progress: '22/40 Soal', timeElapsed: '40 Menit', violations: 0, ip: '192.168.10.89' },
    { id: '104', name: 'RIAN HIDAYAT', status: 'Peringatan', progress: '15/40 Soal', timeElapsed: '32 Menit', violations: 3, ip: '192.168.10.33' }
  ]);

  // 7. Student Directory (Data Siswa) - Dynamically derived from the users prop!
  const studentsList = useMemo(() => {
    return users.filter(u => u.role === 'student').map((u) => {
      // Determine a deterministic average grade based on their name or ID
      let averageGrade = 82.5;
      if (u.name.toUpperCase().includes('DZAKWAN')) {
        averageGrade = 95.5;
      } else {
        averageGrade = parseFloat((70 + (u.id % 25) + ((u.id * 3) % 10) / 10).toFixed(1));
      }

      return {
        id: u.id,
        name: u.name,
        nis: u.email,
        class: u.class_level || '12 IPA 1',
        averageGrade,
        parent: 'Orang Tua ' + u.name,
        phone: '0812-7483-' + String(1000 + u.id).slice(-4),
        address: 'Jl. Ahmad Yani No. ' + (u.id % 150 + 1) + ', Jakarta',
        email: u.email
      };
    });
  }, [users]);
  const [searchStudentQuery, setSearchStudentQuery] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState('Semua Kelas');
  const [resetPasswordStudent, setResetPasswordStudent] = useState<any>(null);
  const [selectedStudentDetail, setSelectedStudentDetail] = useState<any>(null);

  // 8. Exam Results (Hasil & Nilai)
  const [examResults, setExamResults] = useState([
    { id: 1, name: 'DZAKWAN TORIQ ZAHID', exam: 'UAS Fisika Terapan', correct: '38/40', score: 95, status: 'LULUS' },
    { id: 2, name: 'BUDI SANTOSO', exam: 'UAS Fisika Terapan', correct: '34/40', score: 85, status: 'LULUS' },
    { id: 3, name: 'LUTHFI HANIF', exam: 'UAS Fisika Terapan', correct: '39/40', score: 98, status: 'LULUS' },
    { id: 4, name: 'RIAN HIDAYAT', exam: 'UAS Fisika Terapan', correct: '28/40', score: 70, status: 'REMIDI' }
  ]);

  // 9. Grades Input & Editing state (Penilaian)
  const [gradeList, setGradeList] = useState<TeacherGrade[]>(teacherGrades);
  const [editingGradeId, setEditingGradeId] = useState<number | null>(null);
  const [editTugas, setEditTugas] = useState(0);
  const [editKuis, setEditKuis] = useState(0);
  const [editUjian, setEditUjian] = useState(0);

  // 10. Teacher Profile State (Profil Saya)
  const [teacherName, setTeacherName] = useState(user.name);
  const [teacherEmail, setTeacherEmail] = useState(user.email);
  const [teacherNip, setTeacherNip] = useState('NIP-19880412-201503-1-002');
  const [teacherSubject, setTeacherSubject] = useState('Fisika & Matematika Peminatan');
  const [teacherBio, setTeacherBio] = useState('Pengajar senior rumpun sains teknologi di SMA Bina Bhakti. Fokus mengajar metode computational thinking.');
  const [profileSuccessMsg, setProfileSuccessMsg] = useState(false);
  const [profileSubTab, setProfileSubTab] = useState<'profile' | 'security'>('profile');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saveMessage, setSaveMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Save profile updates
  const handleSaveProfile = (e: FormEvent) => {
    e.preventDefault();
    setSaveMessage({ text: 'Profil dan kredensial pengajar Anda berhasil disimpan!', type: 'success' });
    setTimeout(() => setSaveMessage(null), 4000);
  };

  // Update password handler
  const handleUpdatePassword = (e: FormEvent) => {
    e.preventDefault();
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
  };

  const [selectedAssignment, setSelectedAssignment] = useState<any | null>(null);

  // Add new assignment handler
  const handleAddAssignment = (e: FormEvent) => {
    e.preventDefault();
    if (!newAssignmentTitle.trim()) return;
    const newId = localAssignments.length + 1;
    setLocalAssignments([
      ...localAssignments,
      {
        id: newId,
        title: newAssignmentTitle,
        subject: newAssignmentSubject,
        class: '12 IPA 1',
        deadline: newAssignmentDeadline,
        submitted: '0/0',
        status: 'Aktif'
      }
    ]);
    setNewAssignmentTitle('');
    alert('Tugas baru berhasil dibuat dan dipublikasikan!');
  };

  // Add new KBM report
  const handleAddKbmReport = (e: FormEvent) => {
    e.preventDefault();
    if (!newKbmMaterial.trim()) return;
    const newId = kbmReports.length + 1;
    setKbmReports([
      {
        id: newId,
        date: new Date().toISOString().substring(0, 10),
        class: newKbmClass,
        subject: newKbmSubject,
        material: newKbmMaterial,
        notes: newKbmNotes || '-'
      },
      ...kbmReports
    ]);
    setNewKbmMaterial('');
    setNewKbmNotes('');
    alert('Jurnal KBM harian berhasil didokumentasikan!');
  };

  // Add question to Bank Soal
  const handleAddQuestion = (e: FormEvent) => {
    e.preventDefault();
    if (!newQText.trim()) return;
    const newId = questionsBank.length + 1;
    setQuestionsBank([
      ...questionsBank,
      {
        id: newId,
        subject: newQSubject,
        text: newQText,
        a: newQA || 'Pilihan A',
        b: newQB || 'Pilihan B',
        c: newQC || 'Pilihan C',
        d: newQD || 'Pilihan D',
        correct: newQCorrect
      }
    ]);
    setNewQText('');
    setNewQA('');
    setNewQB('');
    setNewQC('');
    setNewQD('');
    alert('Butir soal ujian berhasil ditambahkan ke Bank Soal!');
  };

  // --- RECONSTRUCTED HIGH-FIDELITY BANK SOAL ACTIONS ---
  
  // Open create modal
  const openCreateModal = () => {
    setModalTitle('');
    setModalDescription('');
    setModalSubject('Geografi');
    setModalGrade('XI.1');
    setModalIsPublic(false);
    setEditingBankSoal(null);
    setIsCreateModalOpen(true);
  };

  // Open edit modal
  const openEditModal = (pkg: any, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent opening workspace
    setEditingBankSoal(pkg);
    setModalTitle(pkg.title);
    setModalDescription(pkg.description);
    setModalSubject(pkg.subject);
    setModalGrade(pkg.grade);
    setModalIsPublic(pkg.isPublic);
    setIsCreateModalOpen(true);
  };

  // Handle Save Bank Soal Metadata (Modal)
  const handleSaveBankSoalPackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalTitle.trim()) return;

    if (editingBankSoal) {
      // Edit existing
      setBankSoalPackages(bankSoalPackages.map(pkg => pkg.id === editingBankSoal.id ? {
        ...pkg,
        title: modalTitle,
        description: modalDescription,
        subject: modalSubject,
        grade: modalGrade,
        isPublic: modalIsPublic
      } : pkg));
      alert('Informasi Paket Ujian berhasil diperbarui!');
    } else {
      // Create new
      const newId = bankSoalPackages.length > 0 ? Math.max(...bankSoalPackages.map(p => p.id)) + 1 : 1;
      const newPackage = {
        id: newId,
        title: modalTitle,
        description: modalDescription,
        subject: modalSubject,
        grade: modalGrade,
        isPublic: modalIsPublic,
        totalQuestions: 1,
        questions: [
          {
            id: 1,
            type: 'Pilihan Ganda' as const,
            weight: 5,
            text: 'Butir pertanyaan pertama paket ini...',
            options: { A: 'Pilihan A', B: 'Pilihan B', C: 'Pilihan C', D: 'Pilihan D', E: 'Pilihan E' },
            correctAnswer: 'A' as const,
            essayAnswer: ''
          }
        ]
      };
      setBankSoalPackages([...bankSoalPackages, newPackage]);
      alert('Paket Bank Soal baru berhasil dibuat!');
    }
    setIsCreateModalOpen(false);
    setEditingBankSoal(null);
  };

  // Handle Delete Bank Soal
  const handleDeleteBankSoalClick = (pkg: any, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent opening workspace
    setDeleteBankSoalId(pkg.id);
    setDeleteBankSoalTitle(pkg.title);
  };

  const confirmDeleteBankSoal = () => {
    if (deleteBankSoalId !== null) {
      setBankSoalPackages(bankSoalPackages.filter(p => p.id !== deleteBankSoalId));
      alert('Paket bank soal berhasil dihapus.');
      setDeleteBankSoalId(null);
      setDeleteBankSoalTitle('');
    }
  };

  const confirmDeleteSchedule = () => {
    if (deleteScheduleId !== null) {
      setExamSchedules(examSchedules.filter(x => x.id !== deleteScheduleId));
      alert('Jadwal ujian berhasil dihapus.');
      setDeleteScheduleId(null);
      setDeleteScheduleName('');
    }
  };

  // Open Workspace for questions management
  const handleOpenWorkspace = (pkgId: number) => {
    const pkg = bankSoalPackages.find(p => p.id === pkgId);
    if (pkg) {
      setActiveBankSoalId(pkgId);
      // If questions are empty, add a default blank question
      if (!pkg.questions || pkg.questions.length === 0) {
        const firstQ = {
          id: 1,
          type: 'Pilihan Ganda' as const,
          weight: 5,
          text: '',
          options: { A: '', B: '', C: '', D: '', E: '' },
          correctAnswer: 'A' as const,
          essayAnswer: ''
        };
        const updatedPkg = {
          ...pkg,
          questions: [firstQ],
          totalQuestions: 1
        };
        setBankSoalPackages(bankSoalPackages.map(p => p.id === pkgId ? updatedPkg : p));
        setActiveQType('Pilihan Ganda');
        setActiveQWeight(5);
        setActiveQText('');
        setActiveQOptions({ A: '', B: '', C: '', D: '', E: '' });
        setActiveQCorrect('A');
        setActiveQEssayAnswer('');
        setSelectedQuestionIndex(0);
      } else {
        setSelectedQuestionIndex(0);
        const q = pkg.questions[0];
        setActiveQType(q.type);
        setActiveQWeight(q.weight || 5);
        setActiveQText(q.text || '');
        setActiveQOptions({
          A: q.options?.A || '',
          B: q.options?.B || '',
          C: q.options?.C || '',
          D: q.options?.D || '',
          E: q.options?.E || ''
        });
        setActiveQCorrect(q.correctAnswer || 'A');
        setActiveQEssayAnswer(q.essayAnswer || '');
      }
    }
  };

  // Switch to another question in the workspace Navigator
  const handleSelectQuestion = (pkg: any, index: number) => {
    setSelectedQuestionIndex(index);
    const q = pkg.questions[index];
    if (q) {
      setActiveQType(q.type);
      setActiveQWeight(q.weight || 5);
      setActiveQText(q.text || '');
      setActiveQOptions({
        A: q.options?.A || '',
        B: q.options?.B || '',
        C: q.options?.C || '',
        D: q.options?.D || '',
        E: q.options?.E || ''
      });
      setActiveQCorrect(q.correctAnswer || 'A');
      setActiveQEssayAnswer(q.essayAnswer || '');
    }
  };

  // Add a new question to active package
  const handleAddNewQuestionToWorkspace = (pkgId: number) => {
    const pkg = bankSoalPackages.find(p => p.id === pkgId);
    if (pkg) {
      const nextId = pkg.questions.length > 0 ? Math.max(...pkg.questions.map(q => q.id)) + 1 : 1;
      const newQ = {
        id: nextId,
        type: 'Pilihan Ganda' as const,
        weight: 5,
        text: '',
        options: { A: '', B: '', C: '', D: '', E: '' },
        correctAnswer: 'A' as const,
        essayAnswer: ''
      };
      const updatedQuestions = [...pkg.questions, newQ];
      setBankSoalPackages(bankSoalPackages.map(p => p.id === pkgId ? {
        ...p,
        questions: updatedQuestions,
        totalQuestions: updatedQuestions.length
      } : p));
      
      const newIndex = updatedQuestions.length - 1;
      setSelectedQuestionIndex(newIndex);
      setActiveQType('Pilihan Ganda');
      setActiveQWeight(5);
      setActiveQText('');
      setActiveQOptions({ A: '', B: '', C: '', D: '', E: '' });
      setActiveQCorrect('A');
      setActiveQEssayAnswer('');
      alert('Butir soal baru berhasil ditambahkan! Silakan lengkapi pertanyaan dan pilihan jawabannya.');
    }
  };

  // Save changes to active question in workspace
  const handleSaveCurrentQuestion = (pkgId: number) => {
    const pkg = bankSoalPackages.find(p => p.id === pkgId);
    if (pkg) {
      const updatedQuestions = [...pkg.questions];
      if (updatedQuestions[selectedQuestionIndex]) {
        updatedQuestions[selectedQuestionIndex] = {
          ...updatedQuestions[selectedQuestionIndex],
          type: activeQType,
          weight: Number(activeQWeight),
          text: activeQText,
          options: { ...activeQOptions },
          correctAnswer: activeQCorrect,
          essayAnswer: activeQEssayAnswer
        };
        
        setBankSoalPackages(bankSoalPackages.map(p => p.id === pkgId ? {
          ...p,
          questions: updatedQuestions,
          totalQuestions: updatedQuestions.length
        } : p));
        
        alert('Butir soal berhasil disimpan!');
      }
    }
  };

  // AI question generation
  const handleAiGenerateQuestion = (pkgId: number) => {
    const pkg = bankSoalPackages.find(p => p.id === pkgId);
    if (!pkg) return;
    
    setIsAiGenerating(true);
    setTimeout(() => {
      let generatedQ;
      const subj = pkg.subject.toLowerCase();
      
      if (subj.includes('geografi')) {
        generatedQ = {
          id: pkg.questions.length + 1,
          type: 'Pilihan Ganda' as const,
          weight: 5,
          text: 'Manakah dari fenomena berikut yang dikelompokkan ke dalam aspek fisik geografi?',
          options: {
            A: 'Pola persebaran permukiman transmigran di pulau Sumatra',
            B: 'Siklus hidrologi, tingkat erosi tanah lereng, dan aktivitas vulkanisme gunung api',
            C: 'Mata pencaharian penduduk di pesisir utara pulau Jawa',
            D: 'Pertumbuhan penduduk alami di kawasan perkotaan yang padat',
            E: 'Peta rute transportasi darat antar kota provinsi di Kalimantan'
          },
          correctAnswer: 'B' as const,
          essayAnswer: ''
        };
      } else if (subj.includes('fisika')) {
        generatedQ = {
          id: pkg.questions.length + 1,
          type: 'Pilihan Ganda' as const,
          weight: 5,
          text: 'Faktor-faktor yang mempengaruhi besarnya kapasitas kapasitor keping sejajar adalah...',
          options: {
            A: 'Bahan dielektrik di antara kedua keping, luas penampang keping, dan jarak antar keping',
            B: 'Tegangan sumber tegangan listrik, muatan listrik pada keping, dan kuat arus listrik',
            C: 'Bahan kawat penghantar luar, jenis bahan logam keping, dan suhu ruangan sekitar',
            D: 'Hambatan dalam baterai, frekuensi listrik bolak-balik, dan energi mekanik keping',
            E: 'Arah aliran arus elektron bebas, kuat medan magnet luar, dan waktu pengosongan kapasitor'
          },
          correctAnswer: 'A' as const,
          essayAnswer: ''
        };
      } else if (subj.includes('matematika')) {
        generatedQ = {
          id: pkg.questions.length + 1,
          type: 'Pilihan Ganda' as const,
          weight: 5,
          text: 'Nilai perbandingan trigonometri dari cos(150 derajat) adalah...',
          options: {
            A: '1/2',
            B: '1/2 √3',
            C: '-1/2 √3',
            D: '-1/2',
            E: '-1/2 √2'
          },
          correctAnswer: 'C' as const,
          essayAnswer: ''
        };
      } else {
        generatedQ = {
          id: pkg.questions.length + 1,
          type: 'Pilihan Ganda' as const,
          weight: 5,
          text: `Butir pertanyaan evaluasi materi pelajaran ${pkg.subject} tingkat kelas ${pkg.grade} berkaitan dengan analisis kompetensi dasar siswa adalah...`,
          options: {
            A: 'Pernyataan alternatif pilihan jawaban A',
            B: 'Pernyataan alternatif pilihan jawaban B (Kunci Jawaban Benar)',
            C: 'Pernyataan alternatif pilihan jawaban C',
            D: 'Pernyataan alternatif pilihan jawaban D',
            E: 'Pernyataan alternatif pilihan jawaban E'
          },
          correctAnswer: 'B' as const,
          essayAnswer: ''
        };
      }
      
      const updatedQuestions = [...pkg.questions, generatedQ];
      setBankSoalPackages(bankSoalPackages.map(p => p.id === pkgId ? {
        ...p,
        questions: updatedQuestions,
        totalQuestions: updatedQuestions.length
      } : p));
      
      setSelectedQuestionIndex(updatedQuestions.length - 1);
      setActiveQType('Pilihan Ganda');
      setActiveQWeight(5);
      setActiveQText(generatedQ.text);
      setActiveQOptions(generatedQ.options);
      setActiveQCorrect(generatedQ.correctAnswer);
      setActiveQEssayAnswer('');
      
      setIsAiGenerating(false);
      alert('AI AuraExam berhasil menyusun pertanyaan dan pilihan jawaban berkualitas baru!');
    }, 1500);
  };

  // Export current question list to Word/TXT Mock
  const handleExportToWord = (pkg: any) => {
    let outputText = `PAKET BANK SOAL: ${pkg.title}\nMATAPELAJARAN: ${pkg.subject} (${pkg.grade})\n\n`;
    pkg.questions.forEach((q: any, idx: number) => {
      outputText += `SOAL NO ${idx + 1} [Bobot: ${q.weight}]\n`;
      outputText += `${q.text}\n`;
      if (q.type === 'Pilihan Ganda') {
        outputText += `A. ${q.options.A}\n`;
        outputText += `B. ${q.options.B}\n`;
        outputText += `C. ${q.options.C}\n`;
        outputText += `D. ${q.options.D}\n`;
        outputText += `E. ${q.options.E}\n`;
        outputText += `Kunci Jawaban: ${q.correctAnswer}\n`;
      } else {
        outputText += `Jawaban Essay: ${q.essayAnswer || '(belum diisi)'}\n`;
      }
      outputText += `\n--------------------------------------------------\n\n`;
    });

    const element = document.createElement("a");
    const file = new Blob([outputText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${pkg.title.replace(/\s+/g, '_')}_AuraExam.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    alert('Ekspor naskah soal berhasil diunduh sebagai berkas TXT/Word!');
  };

  // Token generation helper
  const generateTokenCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleRegenerateToken = () => {
    setScheduleToken(generateTokenCode());
  };

  const handleOpenCreateScheduleModal = () => {
    // Select the first package by default if available
    const firstPkgId = bankSoalPackages.length > 0 ? String(bankSoalPackages[0].id) : '';
    setSchedulePackageId(firstPkgId);
    setScheduleName('');
    
    // Set default times (e.g., today's date for start, plus 1 hour for end)
    const now = new Date();
    const formatDateTime = (d: Date) => {
      const pad = (n: number) => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };
    
    setScheduleStartTime(formatDateTime(now));
    
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
    setScheduleEndTime(formatDateTime(oneHourLater));
    
    setScheduleDuration('60');
    setScheduleSync(true);
    setScheduleToken(generateTokenCode());
    setIsCreateScheduleModalOpen(true);
  };

  const handleSaveSchedule = (e: FormEvent) => {
    e.preventDefault();
    if (!scheduleName.trim() || !schedulePackageId) {
      alert('Harap lengkapi nama jadwal dan pilih paket soal!');
      return;
    }

    const pkg = bankSoalPackages.find(p => String(p.id) === String(schedulePackageId));
    if (!pkg) {
      alert('Paket soal tidak ditemukan!');
      return;
    }

    const nextId = examSchedules.length > 0 ? Math.max(...examSchedules.map(s => s.id)) + 1 : 1;
    
    // Format date and time
    const startDateObj = new Date(scheduleStartTime);
    const endDateObj = new Date(scheduleEndTime);
    
    const pad = (n: number) => String(n).padStart(2, '0');
    const dateStr = `${startDateObj.getFullYear()}-${pad(startDateObj.getMonth() + 1)}-${pad(startDateObj.getDate())}`;
    const timeStr = `${pad(startDateObj.getHours())}:${pad(startDateObj.getMinutes())} - ${pad(endDateObj.getHours())}:${pad(endDateObj.getMinutes())}`;

    const newSchedule = {
      id: nextId,
      name: scheduleName,
      subject: pkg.subject,
      date: dateStr,
      time: timeStr,
      startTime: scheduleStartTime,
      endTime: scheduleEndTime,
      duration: `${scheduleDuration} Menit`,
      class: pkg.grade,
      status: 'Tersedia',
      token: scheduleToken,
      sync: scheduleSync,
      packageId: pkg.id
    };

    setExamSchedules([...examSchedules, newSchedule]);
    setIsCreateScheduleModalOpen(false);
    alert('Jadwal ujian baru berhasil ditambahkan!');
  };

  // Grade Editing Handlers
  const handleStartEditGrade = (item: TeacherGrade) => {
    setEditingGradeId(item.id);
    setEditTugas(item.tugas);
    setEditKuis(item.kuis);
    setEditUjian(item.ujian);
  };

  const handleSaveGrade = (id: number) => {
    setGradeList(gradeList.map(g => g.id === id ? {
      ...g,
      tugas: editTugas,
      kuis: editKuis,
      ujian: editUjian
    } : g));
    setEditingGradeId(null);
    alert('Penilaian siswa berhasil diperbarui!');
  };

  // Attendance Config
  const getAttendanceConfig = () => {
    switch (attendanceStatus) {
      case 'HADIR':
        return { bg: 'bg-emerald-50 border-emerald-200 text-emerald-600', dot: 'bg-emerald-500' };
      case 'SAKIT':
        return { bg: 'bg-amber-50 border-amber-200 text-amber-600', dot: 'bg-amber-500' };
      case 'IZIN':
        return { bg: 'bg-purple-50 border-purple-200 text-purple-600', dot: 'bg-purple-500' };
      default:
        return { bg: 'bg-rose-50 border-rose-200 text-rose-600', dot: 'bg-rose-500' };
    }
  };
  const attConfig = getAttendanceConfig();

  // Filter schedules
  const daySchedules = schedules.filter(s => s.day === selectedDay);
  const todaySchedulesCount = schedules.filter(s => s.day === 'Senin').length;

  return (
    <div id="view-teacher-portal" className="min-h-screen bg-[#F4F6FA] flex flex-row w-full max-w-full overflow-x-hidden font-sans antialiased text-slate-800">
      
      {/* Mobile Sidebar Backdrop Overlay */}
      {isMobileSidebarOpen && (
        <div 
          onClick={() => setIsMobileSidebarOpen(false)}
          className="md:hidden fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-45 transition-all duration-300"
        />
      )}

      {/* ================= DESKTOP/TABLET SIDEBAR ================= */}
      <aside className={`flex flex-col ${isSidebarCollapsed ? 'w-20' : 'w-64'} bg-white border-r border-slate-100 h-[100dvh] md:h-screen fixed left-0 top-0 z-50 justify-between transition-all duration-300 ease-in-out ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} md:flex`}>
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

        {/* Toggle Collapse Button */}
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="hidden md:flex absolute top-[28px] right-[-14px] z-50 h-7 w-7 rounded-full bg-white border border-slate-200 shadow-md items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer group"
          title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-blue-600 transition-colors" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-slate-500 group-hover:text-blue-600 transition-colors" />
          )}
        </button>

        {/* Brand Logo Header */}
        <div className={`px-4 py-5 flex items-center justify-between ${isSidebarCollapsed ? 'justify-center' : 'px-6 gap-3'} border-b border-slate-50 shrink-0`}>
          <div className="flex items-center gap-3">
            <AppLogo />
            {!isSidebarCollapsed && (
              <div className="overflow-hidden transition-all duration-300">
                <h2 className="font-extrabold text-sm text-slate-800 uppercase tracking-tight leading-tight whitespace-nowrap">Aura<span className="text-orange-500">Exam</span></h2>
                <p className="text-[9px] text-orange-500 font-extrabold uppercase tracking-widest whitespace-nowrap">Teacher Portal</p>
              </div>
            )}
          </div>
          <button className="md:hidden p-1 rounded-full hover:bg-slate-100" onClick={() => setIsMobileSidebarOpen(false)}>
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        {/* Scrollable Navigation List */}
        <div className="flex-1 overflow-y-auto overscroll-contain touch-pan-y custom-sidebar-scrollbar py-6">
          <div className={`${isSidebarCollapsed ? 'px-2' : 'px-4'} space-y-7`}>
            
            {/* 1. MENU UTAMA */}
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

            {/* 2. AKADEMIK */}
            <div>
              {isSidebarCollapsed ? (
                <div className="border-t border-slate-100 my-4 mx-3" />
              ) : (
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-3">Akademik</h4>
              )}
              <nav className="space-y-1">
                <button 
                  onClick={() => { setActiveTab('kelas'); onNavigateTo('kelas', 'Kelas Ajar'); }}
                  className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center p-3 rounded-2xl' : 'gap-3 px-4 py-3 rounded-xl'} text-xs font-bold transition-all cursor-pointer ${activeTab === 'kelas' ? 'bg-orange-50 text-orange-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
                  title={isSidebarCollapsed ? "Kelas Ajar" : undefined}
                >
                  <BookOpen className="h-4.5 w-4.5 shrink-0" />
                  {!isSidebarCollapsed && <span>Kelas Ajar</span>}
                </button>
                <button 
                  onClick={() => { setActiveTab('tugas'); onNavigateTo('tugas', 'Daftar Tugas'); }}
                  className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center p-3 rounded-2xl' : 'gap-3 px-4 py-3 rounded-xl'} text-xs font-bold transition-all cursor-pointer ${activeTab === 'tugas' ? 'bg-orange-50 text-orange-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
                  title={isSidebarCollapsed ? "Daftar Tugas" : undefined}
                >
                  <Clipboard className="h-4.5 w-4.5 shrink-0" />
                  {!isSidebarCollapsed && <span>Daftar Tugas</span>}
                </button>

                <button 
                  onClick={() => { setActiveTab('penilaian'); onNavigateTo('penilaian', 'Penilaian'); }}
                  className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center p-3 rounded-2xl' : 'gap-3 px-4 py-3 rounded-xl'} text-xs font-bold transition-all cursor-pointer ${activeTab === 'penilaian' ? 'bg-orange-50 text-orange-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
                  title={isSidebarCollapsed ? "Penilaian" : undefined}
                >
                  <ClipboardCheck className="h-4.5 w-4.5 shrink-0" />
                  {!isSidebarCollapsed && <span>Penilaian</span>}
                </button>
                <button 
                  onClick={() => { setActiveTab('rapor'); onNavigateTo('rapor', 'Rapor'); }}
                  className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center p-3 rounded-2xl' : 'gap-3 px-4 py-3 rounded-xl'} text-xs font-bold transition-all cursor-pointer ${activeTab === 'rapor' ? 'bg-orange-50 text-orange-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
                  title={isSidebarCollapsed ? "Rapor" : undefined}
                >
                  <Award className="h-4.5 w-4.5 shrink-0" />
                  {!isSidebarCollapsed && <span>Rapor</span>}
                </button>
                <button 
                  onClick={() => { setActiveTab('mapel'); onNavigateTo('mapel', 'Laporan Mapel'); }}
                  className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center p-3 rounded-2xl' : 'gap-3 px-4 py-3 rounded-xl'} text-xs font-bold transition-all cursor-pointer ${activeTab === 'mapel' ? 'bg-orange-50 text-orange-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
                  title={isSidebarCollapsed ? "Laporan Mapel" : undefined}
                >
                  <FileText className="h-4.5 w-4.5 shrink-0" />
                  {!isSidebarCollapsed && <span>Laporan Mapel</span>}
                </button>
              </nav>
            </div>

            {/* 3. BANK SOAL & UJIAN */}
            <div>
              {isSidebarCollapsed ? (
                <div className="border-t border-slate-100 my-4 mx-3" />
              ) : (
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-3">Bank Soal & Ujian</h4>
              )}
              <nav className="space-y-1">
                <button 
                  onClick={() => { setActiveTab('bank-soal'); onNavigateTo('bank-soal', 'Bank Soal'); }}
                  className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center p-3 rounded-2xl' : 'gap-3 px-4 py-3 rounded-xl'} text-xs font-bold transition-all cursor-pointer ${activeTab === 'bank-soal' ? 'bg-orange-50 text-orange-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
                  title={isSidebarCollapsed ? "Bank Soal" : undefined}
                >
                  <ListTodo className="h-4.5 w-4.5 shrink-0" />
                  {!isSidebarCollapsed && <span>Bank Soal</span>}
                </button>
                <button 
                  onClick={() => { setActiveTab('jadwal-ujian'); onNavigateTo('jadwal-ujian', 'Jadwal Ujian'); }}
                  className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center p-3 rounded-2xl' : 'gap-3 px-4 py-3 rounded-xl'} text-xs font-bold transition-all cursor-pointer ${activeTab === 'jadwal-ujian' ? 'bg-orange-50 text-orange-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
                  title={isSidebarCollapsed ? "Jadwal Ujian" : undefined}
                >
                  <Calendar className="h-4.5 w-4.5 shrink-0" />
                  {!isSidebarCollapsed && <span>Jadwal Ujian</span>}
                </button>
              </nav>
            </div>

            {/* 4. MONITORING */}
            <div>
              {isSidebarCollapsed ? (
                <div className="border-t border-slate-100 my-4 mx-3" />
              ) : (
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-3">Monitoring</h4>
              )}
              <nav className="space-y-1">
                <button 
                  onClick={() => { setActiveTab('monitor-ujian'); onNavigateTo('monitor-ujian', 'Monitor Ujian'); }}
                  className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center p-3 rounded-2xl' : 'gap-3 px-4 py-3 rounded-xl'} text-xs font-bold transition-all cursor-pointer ${activeTab === 'monitor-ujian' ? 'bg-orange-50 text-orange-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
                  title={isSidebarCollapsed ? "Monitor Ujian" : undefined}
                >
                  <PlaySquare className="h-4.5 w-4.5 shrink-0" />
                  {!isSidebarCollapsed && <span>Monitor Ujian</span>}
                </button>
                <button 
                  onClick={() => { setActiveTab('data-siswa'); onNavigateTo('data-siswa', 'Data Siswa'); }}
                  className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center p-3 rounded-2xl' : 'gap-3 px-4 py-3 rounded-xl'} text-xs font-bold transition-all cursor-pointer ${activeTab === 'data-siswa' ? 'bg-orange-50 text-orange-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
                  title={isSidebarCollapsed ? "Data Siswa" : undefined}
                >
                  <Users className="h-4.5 w-4.5 shrink-0" />
                  {!isSidebarCollapsed && <span>Data Siswa</span>}
                </button>
                <button 
                  onClick={() => { setActiveTab('hasil-nilai'); onNavigateTo('hasil-nilai', 'Hasil & Nilai'); }}
                  className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center p-3 rounded-2xl' : 'gap-3 px-4 py-3 rounded-xl'} text-xs font-bold transition-all cursor-pointer ${activeTab === 'hasil-nilai' ? 'bg-orange-50 text-orange-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
                  title={isSidebarCollapsed ? "Hasil & Nilai" : undefined}
                >
                  <Award className="h-4.5 w-4.5 shrink-0" />
                  {!isSidebarCollapsed && <span>Hasil & Nilai</span>}
                </button>
              </nav>
            </div>

            {/* 5. PRIBADI & LAINNYA */}
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

        {/* Sidebar Footer User Info */}
        <div className="p-4 border-t border-slate-50 shrink-0 bg-white">
          <button 
            onClick={() => { setActiveTab('profile-settings'); onNavigateTo('profile-settings', 'Profil Saya'); }}
            className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center p-1' : 'justify-between p-2'} rounded-xl hover:bg-slate-50 transition-colors text-left`}
            title={isSidebarCollapsed ? teacherName : undefined}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="h-9 w-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-extrabold text-xs shrink-0 select-none">
                {teacherName.substring(0, 2).toUpperCase()}
              </div>
              {!isSidebarCollapsed && (
                <div className="overflow-hidden leading-tight">
                  <p className="text-xs font-bold text-slate-800 truncate">{teacherName}</p>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Pengajar</span>
                </div>
              )}
            </div>
            {!isSidebarCollapsed && <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />}
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT WRAPPER CONTAINER ================= */}
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
              <span className="px-2.5 py-1 rounded-md bg-amber-500 text-slate-900 text-[9px] font-black tracking-wider uppercase">
                Pengajar
              </span>
              <button onClick={onLogout} className="h-9 w-9 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-600 active:scale-95 transition-all">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </header>
        )}

        {/* ================= DYNAMIC ROUTED VIEW RENDERING ================= */}
        
        {/* VIEW 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="w-full">
            {/* HERO GREETING BANNER */}
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
                        Online
                      </span>
                      <span className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 text-[11px] font-black tracking-wider uppercase shadow-sm">
                        Pengajar
                      </span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-display tracking-tight leading-none flex flex-wrap items-center gap-2.5 break-words">
                      Halo, {teacherName}! <span className="wave-emoji inline-block animate-bounce text-3xl sm:text-4xl md:text-5xl">👋</span>
                    </h1>
                    
                    {/* Subtitle based on viewport */}
                    <p className="text-orange-100 text-xs sm:text-sm mt-4 font-semibold max-w-xl leading-relaxed hidden md:block">
                      Selamat datang di portal akademik pengajar AuraExam! Monitor ujian CBT, input nilai harian, dan pantau jurnal mengajar Anda secara digital.
                    </p>
                    <p className="text-orange-100 text-xs sm:text-sm mt-3.5 font-bold flex items-center gap-2 md:hidden">
                      <Calendar className="h-4 w-4 shrink-0" />
                      Jumat, 2 Juli
                    </p>
                  </div>

                  {/* Right profile badge */}
                  <div className="h-18 w-18 sm:h-20 sm:w-20 rounded-full bg-orange-400 text-white flex items-center justify-center text-xl sm:text-2xl font-black shadow-lg ring-8 ring-white/15 select-none overflow-hidden shrink-0 transition-all duration-300">
                    <span>{teacherName.substring(0, 2).toUpperCase()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* MAIN CONTENT CONTAINING OVERLAPPING CARD */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pb-20 md:pb-12 mt-4 sm:mt-6 space-y-6">
              
              {/* ABSENSI KEHADIRAN (TEACHER) */}
                            <div className="hidden md:flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-md shadow-slate-100/50">
                <div className="flex items-center gap-5">
                  <div className="h-16 w-16 bg-gradient-to-br from-orange-600 to-red-600 text-white rounded-2xl flex items-center justify-center text-2xl shadow-md shrink-0 relative overflow-hidden">
                    <div className="absolute inset-2 border-2 border-dashed border-white/40 rounded-xl"></div>
                    <QrCode className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-800 font-display leading-tight">Absensi Kehadiran Guru</h3>
                    <p className="text-slate-400 text-xs mt-1.5 font-bold max-w-lg leading-relaxed">
                      Scan QR Code pada layar monitor sekolah untuk memverifikasi kegiatan mengajar KBM harian Anda.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-4 shrink-0 w-full md:w-auto">
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl px-3 py-1.5 self-end">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Status</span>
                    <span className={`h-2.5 w-2.5 rounded-full ${attConfig.dot} ${attendanceStatus === 'BELUM ABSEN' ? 'animate-pulse' : ''}`}></span>
                    <span className="text-xs font-black text-slate-700 uppercase tracking-wider">{attendanceStatus} {attendanceTime ? `(${attendanceTime})` : ''}</span>
                  </div>
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
                <div className="h-16 w-16 bg-gradient-to-br from-orange-600 to-red-600 text-white rounded-2xl flex items-center justify-center text-2xl shadow-md shrink-0 relative overflow-hidden mb-4">
                  <div className="absolute inset-2 border-2 border-dashed border-white/40 rounded-xl"></div>
                  <QrCode className="h-7 w-7" />
                </div>
                
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest leading-none mb-1">STATUS KEHADIRAN</span>
                <h3 className="text-base font-black text-slate-800 font-display">Absensi Kehadiran</h3>
                <p className="text-slate-400 text-xs mt-2 font-semibold max-w-sm leading-relaxed mb-6">
                  Scan QR Code pada layar monitor sekolah untuk memverifikasi kegiatan mengajar.
                </p>

                <div className="flex flex-col gap-3 w-full">
                  <button 
                    onClick={onOpenScanner}
                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-extrabold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-orange-500/25 transition-all text-xs uppercase tracking-wider cursor-pointer active:scale-95"
                  >
                    <QrCode className="h-4.5 w-4.5" />
                    <span>Scan QR Sekarang</span>
                  </button>
                  
                  <div className="grid grid-cols-2 gap-3 w-full">
                    <button 
                      onClick={() => onOpenPermit('Sakit')}
                      className="border border-[#F59E0B] text-[#D97706] bg-white font-extrabold py-3 rounded-xl transition-colors text-xs uppercase tracking-wider cursor-pointer"
                    >
                      <span>Sakit</span>
                    </button>
                    <button 
                      onClick={() => onOpenPermit('Izin')}
                      className="border border-[#A855F7] text-[#7C3AED] bg-white font-extrabold py-3 rounded-xl transition-colors text-xs uppercase tracking-wider cursor-pointer"
                    >
                      <span>Izin</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* SECONDARY PANELS ROW (MENU + BULLETIN) - Aligned with Student Dashboard */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 md:mt-8">
                
                {/* Menu Aplikasi Panel */}
                <div className="lg:col-span-7 bg-white rounded-3xl p-4 sm:p-6 md:p-8 border border-slate-100 shadow-md shadow-slate-100/30 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-2">
                        <div className="h-5 w-1 bg-orange-600 rounded-full"></div>
                        <h3 className="text-base font-black text-slate-800 font-display">Menu Aplikasi</h3>
                      </div>
                      <button 
                        onClick={() => setActiveTab('kelas')} 
                        className="text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors cursor-pointer"
                      >
                        Lihat Semua
                      </button>
                    </div>

                    {/* Horizontal Circular Icons Grid */}
                    <div className="grid grid-cols-4 gap-4 justify-items-center">
                      {/* Kelas Ajar Icon button */}
                      <button 
                        onClick={() => setActiveTab('kelas')}
                        className="flex flex-col items-center gap-2.5 group cursor-pointer"
                      >
                        <div className="h-14 w-14 rounded-full bg-[#FF9F00]/10 text-[#FF9F00] flex items-center justify-center group-hover:scale-105 transition-transform">
                          <BookOpen className="h-6 w-6" />
                        </div>
                        <span className="text-[11px] font-bold text-slate-500 group-hover:text-slate-800 text-center leading-none">Kelas Ajar</span>
                      </button>

                      {/* Tugas Mandiri Icon button */}
                      <button 
                        onClick={() => setActiveTab('tugas')}
                        className="flex flex-col items-center gap-2.5 group cursor-pointer"
                      >
                        <div className="h-14 w-14 rounded-full bg-[#EC4899]/10 text-[#EC4899] flex items-center justify-center group-hover:scale-105 transition-transform">
                          <Clipboard className="h-6 w-6" />
                        </div>
                        <span className="text-[11px] font-bold text-slate-500 group-hover:text-slate-800 text-center leading-none">Tugas Mandiri</span>
                      </button>

                      {/* Input Penilaian Icon button */}
                      <button 
                        onClick={() => setActiveTab('penilaian')}
                        className="flex flex-col items-center gap-2.5 group cursor-pointer"
                      >
                        <div className="h-14 w-14 rounded-full bg-[#10B981]/10 text-[#10B981] flex items-center justify-center group-hover:scale-105 transition-transform">
                          <ClipboardCheck className="h-6 w-6" />
                        </div>
                        <span className="text-[11px] font-bold text-slate-500 group-hover:text-slate-800 text-center leading-none">Penilaian</span>
                      </button>

                      {/* Monitor Ujian Icon button */}
                      <button 
                        onClick={() => setActiveTab('monitor-ujian')}
                        className="flex flex-col items-center gap-2.5 group cursor-pointer"
                      >
                        <div className="h-14 w-14 rounded-full bg-[#14B8A6]/10 text-[#14B8A6] flex items-center justify-center group-hover:scale-105 transition-transform">
                          <PlaySquare className="h-6 w-6" />
                        </div>
                        <span className="text-[11px] font-bold text-slate-500 group-hover:text-slate-800 text-center leading-none">Monitor Ujian</span>
                      </button>
                    </div>

                    {/* Proctoring Banner card */}
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 relative overflow-hidden mt-6">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-orange-100 rounded-full blur-2xl opacity-40 pointer-events-none"></div>
                      <div className="relative z-10 flex flex-col justify-between sm:flex-row sm:items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="text-[9px] font-extrabold text-emerald-600 uppercase tracking-wider">Ujian CBT Berlangsung</span>
                          </div>
                          <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm leading-tight">Ujian Akhir Semester: Fisika Terapan</h4>
                          <p className="text-[10px] text-slate-500 mt-0.5 font-bold">Kelas 12 IPA 1 • 08:00 - 10:00 WIB</p>
                        </div>
                        <button 
                          onClick={() => setActiveTab('monitor-ujian')}
                          className="bg-orange-600 hover:bg-orange-700 text-white font-extrabold py-2 px-3.5 rounded-xl text-xs flex items-center gap-1.5 shrink-0 shadow-sm cursor-pointer transition-all"
                        >
                          <ShieldCheck className="h-3.5 w-3.5" />
                          <span>Buka Monitoring</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Papan Informasi Panel */}
                <div className="lg:col-span-5 bg-white rounded-3xl p-4 sm:p-6 md:p-8 border border-slate-100 shadow-md shadow-slate-100/30 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-6">
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

                    {/* Notification items container */}
                    <div className="space-y-4">
                      {/* Notification card item 1 */}
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/60 flex items-start gap-3">
                        <div className="h-9 w-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                          <Volume2 className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-[8px] font-black rounded uppercase">Penting</span>
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">31 Mei 2026</span>
                          </div>
                          <h4 className="text-xs font-black text-slate-800 leading-tight">Batas Akhir Unggah Nilai Rapor</h4>
                          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed font-semibold">
                            Dimohon untuk mengunggah rekap nilai semester siswa paling lambat tanggal 8 Juni 2026 demi kelancaran pencetakan rapor.
                          </p>
                        </div>
                      </div>

                      {/* Notification card item 2 */}
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/60 flex items-start gap-3">
                        <div className="h-9 w-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                          <Volume2 className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[8px] font-black rounded uppercase">Rapat</span>
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">28 Mei 2026</span>
                          </div>
                          <h4 className="text-xs font-black text-slate-800 leading-tight">Rapat Evaluasi Akhir Tahun</h4>
                          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed font-semibold">
                            Rapat pleno koordinasi evaluasi kurikulum dan kelulusan akan dilaksanakan offline di Aula Sekolah Utama.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-50 text-center">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center justify-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                      Sistem Informasi Akademik Sinkron
                    </span>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* VIEW 2: JADWAL PELAJARAN */}
        {activeTab === 'jadwal' && (
          <div className="max-w-7xl w-full mx-auto p-4 md:p-8 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-6 w-6 text-orange-600" />
              <h2 className="text-xl font-extrabold text-slate-800 font-display">Jadwal Mengajar Pengajar</h2>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-4 sm:p-6 md:p-8 space-y-6">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {DAYS_ORDER.map(day => (
                  <button 
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`px-4 py-2 rounded-xl font-bold text-xs cursor-pointer transition-all ${selectedDay === day ? 'bg-orange-600 text-white shadow-sm' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                  >
                    {day}
                  </button>
                ))}
              </div>

              <div className="w-full">
                {/* Mobile Card Layout */}
                <div className="block md:hidden space-y-4">
                  {schedules.filter(s => s.day === selectedDay).map(s => (
                    <div key={s.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col gap-2">
                      <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                        <span className="text-[10px] font-black uppercase text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                          {s.time_start} - {s.time_end}
                        </span>
                        <span className="text-xs font-bold text-slate-600">
                          {s.class_level || '12 IPA 1'} • Ruang {s.room}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-800">{s.subject_name}</h4>
                      </div>
                    </div>
                  ))}
                  {schedules.filter(s => s.day === selectedDay).length === 0 && (
                    <div className="py-12 text-center text-slate-400 font-bold select-none bg-slate-50 rounded-2xl border border-slate-100">
                      Bebas Tugas Mengajar Hari Ini 🎉
                    </div>
                  )}
                </div>

                {/* Desktop Table Layout */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full lg:min-w-full text-left border-collapse text-xs md:text-sm whitespace-nowrap">
                    <thead>
                      <tr className="bg-orange-500 text-white font-black uppercase text-[10px] tracking-wider">
                        <th className="py-3 px-4 first:rounded-tl-xl">Jam Mengajar</th>
                        <th className="py-3 px-4">Mata Pelajaran</th>
                        <th className="py-3 px-4">Kelas</th>
                        <th className="py-3 px-4 last:rounded-tr-xl">Ruangan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 font-semibold text-slate-700">
                      {schedules.filter(s => s.day === selectedDay).map(s => (
                        <tr key={s.id} className="hover:bg-slate-50/50">
                          <td className="py-4 px-4 font-bold text-slate-900">{s.time_start} - {s.time_end}</td>
                          <td className="py-4 px-4 text-orange-600 font-bold">{s.subject_name}</td>
                          <td className="py-4 px-4 text-slate-500">{s.class_level || '12 IPA 1'}</td>
                          <td className="py-4 px-4 text-slate-500">{s.room}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: KELAS AJAR */}
        {activeTab === 'kelas' && (
          <div className="max-w-7xl w-full mx-auto p-4 md:p-8 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-6 w-6 text-orange-600" />
              <h2 className="text-xl font-extrabold text-slate-800 font-display">Manajemen Kelas Ajar</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-3xl border border-slate-150 p-6 shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                  <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <span className="px-2.5 py-1 bg-orange-50 text-orange-600 text-[10px] font-bold rounded-lg uppercase">Kelas Utama</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Kelas 12 IPA 1</h3>
                  <p className="text-xs text-slate-400 font-medium">Mata Pelajaran: Fisika & Matematika</p>
                </div>
                <div className="border-t border-slate-50 pt-4 flex justify-between items-center text-xs font-bold text-slate-500">
                  <span>32 Siswa Terdaftar</span>
                  <button onClick={() => setActiveTab('data-siswa')} className="text-orange-600 hover:underline">Lihat Siswa</button>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-150 p-6 shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                  <div className="p-3 bg-teal-50 text-teal-600 rounded-2xl">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <span className="px-2.5 py-1 bg-teal-50 text-teal-600 text-[10px] font-bold rounded-lg uppercase">Paralel</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Kelas 12 IPA 2</h3>
                  <p className="text-xs text-slate-400 font-medium">Mata Pelajaran: Fisika Terapan</p>
                </div>
                <div className="border-t border-slate-50 pt-4 flex justify-between items-center text-xs font-bold text-slate-500">
                  <span>30 Siswa Terdaftar</span>
                  <button onClick={() => setActiveTab('data-siswa')} className="text-orange-600 hover:underline">Lihat Siswa</button>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-150 p-6 shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                  <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <span className="px-2.5 py-1 bg-orange-50 text-orange-600 text-[10px] font-bold rounded-lg uppercase">Kombinasi</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Kelas 11 IPS 1</h3>
                  <p className="text-xs text-slate-400 font-medium">Mata Pelajaran: Prakarya & Komputer</p>
                </div>
                <div className="border-t border-slate-50 pt-4 flex justify-between items-center text-xs font-bold text-slate-500">
                  <span>28 Siswa Terdaftar</span>
                  <button onClick={() => setActiveTab('data-siswa')} className="text-orange-600 hover:underline">Lihat Siswa</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 4: DAFTAR TUGAS */}
        {activeTab === 'tugas' && (
          <div className="max-w-7xl w-full mx-auto p-4 md:p-8 space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Clipboard className="h-6 w-6 text-orange-600" />
                <h2 className="text-xl font-extrabold text-slate-800 font-display">Manajemen Tugas Mandiri</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form Tambah Tugas */}
              <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm h-fit">
                <h3 className="font-bold text-slate-800 mb-4 text-sm flex items-center gap-1.5">
                  <Plus className="h-4 w-4 text-orange-600" />
                  Buat Tugas Baru
                </h3>
                <form onSubmit={handleAddAssignment} className="space-y-4 text-xs font-bold">
                  <div className="space-y-1">
                    <label className="text-slate-400 uppercase tracking-widest text-[9px]">Judul Tugas</label>
                    <input 
                      type="text" 
                      value={newAssignmentTitle}
                      onChange={(e) => setNewAssignmentTitle(e.target.value)}
                      placeholder="Contoh: Praktikum Gelombang Bunyi"
                      required
                      className="w-full p-3 rounded-xl border border-slate-200 font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400 uppercase tracking-widest text-[9px]">Mata Pelajaran</label>
                    <select 
                      value={newAssignmentSubject}
                      onChange={(e) => setNewAssignmentSubject(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-200 font-semibold"
                    >
                      <option value="Fisika Terapan">Fisika Terapan</option>
                      <option value="Matematika Wajib">Matematika Wajib</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400 uppercase tracking-widest text-[9px]">Batas Pengumpulan (Deadline)</label>
                    <input 
                      type="date" 
                      value={newAssignmentDeadline}
                      onChange={(e) => setNewAssignmentDeadline(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-200 font-semibold"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-extrabold transition-all shadow-md cursor-pointer"
                  >
                    Publikasikan Tugas
                  </button>
                </form>
              </div>

              {/* List of assignments */}
              <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-800 text-sm">Daftar Penugasan Aktif</h3>
                
                <div className="space-y-3">
                  {localAssignments.map(a => (
                    <div 
                      key={a.id} 
                      onClick={() => setSelectedAssignment(a)}
                      className="p-4 border border-slate-100 rounded-2xl flex justify-between items-center hover:bg-slate-50 transition-all cursor-pointer"
                    >
                      <div>
                        <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm">{a.title}</h4>
                        <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider">
                          {a.subject} • Batas: {a.deadline}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 bg-orange-50 text-orange-600 font-extrabold text-[10px] rounded-lg">
                          {(a.submissions?.length || 0)} Siswa Mengumpul
                        </span>
                        <span className={`px-2.5 py-1 font-extrabold text-[10px] rounded-lg ${a.status === 'Aktif' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                          {a.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Submission Grading Modal */}
            {selectedAssignment && (
              <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-3xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black text-slate-800">Penilaian: {selectedAssignment.title}</h3>
                    <button onClick={() => setSelectedAssignment(null)} className="text-slate-400 hover:text-slate-600">
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-slate-100">
                        <th className="pb-3 text-left">Nama Siswa</th>
                        <th className="pb-3 text-left">File/Link</th>
                        <th className="pb-3 text-left">Waktu</th>
                        <th className="pb-3 text-center">Nilai</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedAssignment.submissions?.map(s => (
                        <tr key={s.id} className="border-b border-slate-50">
                          <td className="py-4 font-bold">{s.studentName}</td>
                          <td className="py-4">
                          <button 
                            onClick={() => setPreviewFile(s.fileOrLink)}
                            className="text-orange-600 font-bold hover:underline"
                          >
                            Lihat
                          </button>
                          </td>
                          <td className="py-4 text-slate-500">{new Date(s.submittedAt).toLocaleDateString()}</td>
                          <td className="py-4">
                            <input 
                              type="number"
                              placeholder="0"
                              className="w-16 p-2 border border-slate-200 rounded-lg text-center"
                              onChange={(e) => {
                                const newGrade = Number(e.target.value);
                                setAssignments(prev => prev.map(a => a.id === selectedAssignment.id ? {
                                  ...a,
                                  submissions: a.submissions.map(sub => sub.id === s.id ? { ...sub, grade: newGrade, status: 'Selesai' } : sub)
                                } : a));
                              }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {/* File Preview Modal */}
            {previewFile && (
              <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4">
                <div className="bg-white rounded-3xl p-4 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col relative">
                  <button 
                    onClick={() => setPreviewFile(null)} 
                    className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 bg-white/50 p-2 rounded-full z-10"
                  >
                    <X className="h-6 w-6" />
                  </button>
                  <img src={previewFile} alt="Submission Preview" className="w-full h-full object-contain" />
                </div>
              </div>
            )}
          </div>
        )}


        {/* VIEW 6: PENILAIAN */}
        {activeTab === 'penilaian' && (
          <div className="max-w-7xl w-full mx-auto p-4 md:p-8 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <ClipboardCheck className="h-6 w-6 text-orange-600" />
              <h2 className="text-xl font-extrabold text-slate-800 font-display">Penginputan Nilai KBM Harian</h2>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-4 sm:p-6 md:p-8 space-y-6">
              <div className="w-full">
                {/* Mobile Card Layout */}
                <div className="block md:hidden space-y-4">
                  {gradeList.map(g => {
                    const isEditing = editingGradeId === g.id;
                    return (
                      <div key={g.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col gap-3">
                        <div className="flex justify-between items-start">
                          <h4 className="text-sm font-extrabold text-slate-800 uppercase tracking-wide">{g.name}</h4>
                          <div>
                            {isEditing ? (
                              <button 
                                onClick={() => handleSaveGrade(g.id)}
                                className="bg-orange-600 hover:bg-orange-700 text-white p-2 rounded-xl text-xs font-bold shadow-sm shadow-orange-100"
                              >
                                <Save className="h-4 w-4 inline mr-1" /> Simpan
                              </button>
                            ) : (
                              <button 
                                onClick={() => handleStartEditGrade(g)}
                                className="bg-slate-100 hover:bg-orange-50 text-orange-600 px-3 py-1.5 rounded-xl text-xs font-black transition-all"
                              >
                                <Edit className="h-3.5 w-3.5 inline mr-1" /> Edit Nilai
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3 text-center border-t border-slate-100 pt-3">
                          <div className="bg-white p-2 rounded-xl border border-slate-100">
                            <span className="text-[10px] text-slate-400 font-extrabold uppercase block mb-1">Tugas</span>
                            {isEditing ? (
                              <input 
                                type="number" 
                                value={editTugas} 
                                onChange={(e) => setEditTugas(parseInt(e.target.value) || 0)}
                                className="w-full p-1 border border-slate-200 text-center rounded font-semibold text-xs"
                              />
                            ) : (
                              <span className="text-slate-800 text-sm font-black">{g.tugas}</span>
                            )}
                          </div>
                          <div className="bg-white p-2 rounded-xl border border-slate-100">
                            <span className="text-[10px] text-slate-400 font-extrabold uppercase block mb-1">Kuis</span>
                            {isEditing ? (
                              <input 
                                type="number" 
                                value={editKuis} 
                                onChange={(e) => setEditKuis(parseInt(e.target.value) || 0)}
                                className="w-full p-1 border border-slate-200 text-center rounded font-semibold text-xs"
                              />
                            ) : (
                              <span className="text-slate-800 text-sm font-black">{g.kuis}</span>
                            )}
                          </div>
                          <div className="bg-white p-2 rounded-xl border border-slate-100">
                            <span className="text-[10px] text-slate-400 font-extrabold uppercase block mb-1">Ujian</span>
                            {isEditing ? (
                              <input 
                                type="number" 
                                value={editUjian} 
                                onChange={(e) => setEditUjian(parseInt(e.target.value) || 0)}
                                className="w-full p-1 border border-slate-200 text-center rounded font-semibold text-xs"
                              />
                            ) : (
                              <span className="text-slate-800 text-sm font-black">{g.ujian}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Desktop Table Layout */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full lg:min-w-full text-left border-collapse text-xs md:text-sm whitespace-nowrap">
                    <thead>
                      <tr className="bg-orange-500 text-white font-black uppercase text-[10px] tracking-wider">
                        <th className="py-3 px-4 first:rounded-tl-xl">Nama Siswa</th>
                        <th className="py-3 px-4 text-center">Nilai Tugas</th>
                        <th className="py-3 px-4 text-center">Nilai Kuis</th>
                        <th className="py-3 px-4 text-center">Nilai Ujian</th>
                        <th className="py-3 px-4 text-center last:rounded-tr-xl">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 font-bold text-slate-700">
                      {gradeList.map(g => {
                        const isEditing = editingGradeId === g.id;
                        return (
                          <tr key={g.id} className="hover:bg-slate-50/50">
                            <td className="py-4 px-4 font-extrabold text-slate-900">{g.name}</td>
                            <td className="py-4 px-4 text-center">
                              {isEditing ? (
                                <input 
                                  type="number" 
                                  value={editTugas} 
                                  onChange={(e) => setEditTugas(parseInt(e.target.value) || 0)}
                                  className="w-16 p-1 border border-slate-200 text-center rounded font-semibold"
                                />
                              ) : g.tugas}
                            </td>
                            <td className="py-4 px-4 text-center">
                              {isEditing ? (
                                <input 
                                  type="number" 
                                  value={editKuis} 
                                  onChange={(e) => setEditKuis(parseInt(e.target.value) || 0)}
                                  className="w-16 p-1 border border-slate-200 text-center rounded font-semibold"
                                />
                              ) : g.kuis}
                            </td>
                            <td className="py-4 px-4 text-center">
                              {isEditing ? (
                                <input 
                                  type="number" 
                                  value={editUjian} 
                                  onChange={(e) => setEditUjian(parseInt(e.target.value) || 0)}
                                  className="w-16 p-1 border border-slate-200 text-center rounded font-semibold"
                                />
                              ) : g.ujian}
                            </td>
                            <td className="py-4 px-4 text-center">
                              {isEditing ? (
                                <button 
                                  onClick={() => handleSaveGrade(g.id)}
                                  className="bg-orange-600 hover:bg-orange-700 text-white p-1.5 rounded-lg text-xs font-bold"
                                >
                                  <Save className="h-4.5 w-4.5" />
                                </button>
                              ) : (
                                <button 
                                  onClick={() => handleStartEditGrade(g)}
                                  className="bg-slate-100 hover:bg-orange-50 text-orange-600 p-1.5 rounded-lg text-xs font-bold"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 7: RAPOR SIBENTIK */}
        {activeTab === 'rapor' && (
          <div className="max-w-7xl w-full mx-auto p-4 md:p-8 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-6 w-6 text-orange-600" />
              <h2 className="text-xl font-extrabold text-slate-800 font-display">Perekapan Rapor Siswa</h2>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-6">
              <div className="w-full">
                {/* Mobile Card Layout */}
                <div className="block md:hidden space-y-4">
                  {gradeList.map(g => {
                    const avg = Math.round((g.tugas + g.kuis + g.ujian) / 3);
                    return (
                      <div key={g.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col gap-2">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                          <h4 className="text-sm font-extrabold text-slate-800 uppercase tracking-wide">{g.name}</h4>
                          <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 font-black text-[10px] rounded-lg">
                            Predikat {avg >= 90 ? 'A' : avg >= 80 ? 'B' : 'C'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs pt-1 font-semibold text-slate-600">
                          <span>Rata-Rata Akademik: <span className="font-extrabold text-orange-600">{avg}</span></span>
                          <span>Kehadiran: <span className="font-extrabold text-slate-800">98%</span></span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Desktop Table Layout */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full lg:min-w-full text-left border-collapse text-xs md:text-sm whitespace-nowrap">
                    <thead>
                      <tr className="bg-orange-500 text-white font-black uppercase text-[10px] tracking-wider">
                        <th className="py-3 px-4 first:rounded-tl-xl">Siswa</th>
                        <th className="py-3 px-4 text-center">Rata-Rata Akademik</th>
                        <th className="py-3 px-4 text-center">Kehadiran (KBM)</th>
                        <th className="py-3 px-4 text-center last:rounded-tr-xl">Predikat</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 font-bold text-slate-700">
                      {gradeList.map(g => {
                        const avg = Math.round((g.tugas + g.kuis + g.ujian) / 3);
                        return (
                          <tr key={g.id} className="hover:bg-slate-50/50">
                            <td className="py-4 px-4 font-extrabold text-slate-900">{g.name}</td>
                            <td className="py-4 px-4 text-center font-black text-orange-600">{avg}</td>
                            <td className="py-4 px-4 text-center">98%</td>
                            <td className="py-4 px-4 text-center">
                              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-extrabold text-[10px] rounded-lg">
                                {avg >= 90 ? 'A' : avg >= 80 ? 'B' : 'C'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 8: LAPORAN MAPEL */}
        {activeTab === 'mapel' && (
          <div className="max-w-7xl w-full mx-auto p-4 md:p-8 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-6 w-6 text-orange-600" />
              <h2 className="text-xl font-extrabold text-slate-800 font-display">Jurnal Kegiatan Belajar Mengajar (KBM)</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Add Jurnal Form */}
              <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm h-fit">
                <h3 className="font-bold text-slate-800 mb-4 text-sm flex items-center gap-1.5">
                  <Plus className="h-4 w-4 text-orange-600" />
                  Buat Jurnal KBM Baru
                </h3>
                <form onSubmit={handleAddKbmReport} className="space-y-4 text-xs font-bold">
                  <div className="space-y-1">
                    <label className="text-slate-400 uppercase tracking-widest text-[9px]">Mata Pelajaran</label>
                    <select 
                      value={newKbmSubject}
                      onChange={(e) => setNewKbmSubject(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-200 font-semibold"
                    >
                      <option value="Fisika Terapan">Fisika Terapan</option>
                      <option value="Matematika Wajib">Matematika Wajib</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400 uppercase tracking-widest text-[9px]">Materi Utama</label>
                    <input 
                      type="text" 
                      value={newKbmMaterial}
                      onChange={(e) => setNewKbmMaterial(e.target.value)}
                      placeholder="Contoh: Hukum Snellius Pembiasan Cahaya"
                      required
                      className="w-full p-3 rounded-xl border border-slate-200 font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400 uppercase tracking-widest text-[9px]">Catatan Pelaksanaan KBM</label>
                    <textarea 
                      value={newKbmNotes}
                      onChange={(e) => setNewKbmNotes(e.target.value)}
                      placeholder="Contoh: Diskusi kelompok interaktif berjalan sukses."
                      rows={3}
                      className="w-full p-3 rounded-xl border border-slate-200 font-semibold"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-extrabold transition-all shadow-md cursor-pointer"
                  >
                    Simpan Jurnal KBM
                  </button>
                </form>
              </div>

              {/* Jurnal List */}
              <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-800 text-sm">Histori Jurnal Mengajar</h3>
                <div className="space-y-4">
                  {kbmReports.map(r => (
                    <div key={r.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="px-2.5 py-0.5 bg-orange-50 text-orange-600 text-[10px] font-black rounded uppercase">
                          {r.subject}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{r.date}</span>
                      </div>
                      <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm">{r.material}</h4>
                      <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                        <span className="text-slate-400 font-bold block text-[9px] uppercase tracking-wider mb-0.5">Laporan KBM:</span>
                        {r.notes}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 9: BANK SOAL */}
        {activeTab === 'bank-soal' && (
          <div className="max-w-7xl w-full mx-auto p-4 md:p-8 space-y-6">
            
            {activeBankSoalId === null ? (
              /* ==========================================
                 SUB-VIEW 9A: PACKAGES DASHBOARD (Image 1)
                 ========================================== */
              <div className="space-y-6 animate-fade-in">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <div className="p-2 bg-orange-100 rounded-xl text-orange-600">
                        <ListTodo className="h-6 w-6" />
                      </div>
                      <h2 className="text-2xl font-extrabold text-slate-800 font-display">Bank Soal Ujian CBT</h2>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">Kelola naskah ujian atau distribusikan paket soal berkualitas untuk diujikan secara terkomputerisasi.</p>
                  </div>
                  
                  <button 
                    onClick={openCreateModal}
                    className="flex items-center gap-2 px-5 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-extrabold text-xs shadow-md shadow-orange-100 hover:shadow-lg transition-all cursor-pointer self-start md:self-auto"
                  >
                    <Plus className="h-4 w-4" />
                    Buat Bank Soal
                  </button>
                </div>

                {/* Search & Filtering Bar */}
                <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex flex-col xl:flex-row gap-4 items-center justify-between">
                  {/* Private vs Public Subtabs */}
                  <div className="flex bg-slate-100 p-1 rounded-xl w-full xl:w-auto">
                    <button
                      onClick={() => setActiveBankSoalSubTab('private')}
                      className={`flex-1 xl:flex-none flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${activeBankSoalSubTab === 'private' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                      <Lock className="h-3.5 w-3.5" />
                      Pribadi (Milik Saya)
                    </button>
                    <button
                      onClick={() => setActiveBankSoalSubTab('public')}
                      className={`flex-1 xl:flex-none flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${activeBankSoalSubTab === 'public' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                      <Globe className="h-3.5 w-3.5" />
                      Publik (Berbagi)
                    </button>
                  </div>

                  {/* Search and Filters */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full xl:flex-1 xl:max-w-3xl">
                    {/* Search Input */}
                    <div className="relative md:col-span-1 xl:flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input 
                        type="text"
                        placeholder="Cari judul bank soal..."
                        value={bankSoalSearchQuery}
                        onChange={(e) => setBankSoalSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold focus:outline-none focus:border-orange-500 transition-all"
                      />
                    </div>

                    {/* Subject Filter */}
                    <select
                      value={bankSoalMapelFilter}
                      onChange={(e) => setBankSoalMapelFilter(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-600 focus:outline-none cursor-pointer"
                    >
                      <option value="Semua Mapel">Semua Mapel</option>
                      <option value="Geografi">Geografi</option>
                      <option value="Fisika">Fisika</option>
                      <option value="Matematika">Matematika</option>
                    </select>

                    {/* Grade Filter */}
                    <select
                      value={bankSoalKelasFilter}
                      onChange={(e) => setBankSoalKelasFilter(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-600 focus:outline-none cursor-pointer"
                    >
                      <option value="Semua Kelas">Semua Kelas</option>
                      <option value="X.1">Kelas X</option>
                      <option value="XI.1">Kelas XI</option>
                      <option value="XII.1">Kelas XII</option>
                    </select>
                  </div>
                </div>

                {/* Packages Grid */}
                {bankSoalPackages.filter(pkg => {
                  const matchesTab = activeBankSoalSubTab === 'private' ? !pkg.isPublic : pkg.isPublic;
                  const matchesSearch = pkg.title.toLowerCase().includes(bankSoalSearchQuery.toLowerCase()) || pkg.description.toLowerCase().includes(bankSoalSearchQuery.toLowerCase());
                  const matchesMapel = bankSoalMapelFilter === 'Semua Mapel' ? true : pkg.subject === bankSoalMapelFilter;
                  const matchesKelas = bankSoalKelasFilter === 'Semua Kelas' ? true : pkg.grade === bankSoalKelasFilter;
                  return matchesTab && matchesSearch && matchesMapel && matchesKelas;
                }).length === 0 ? (
                  <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center shadow-sm max-w-md mx-auto">
                    <div className="p-4 bg-orange-50 rounded-full text-orange-600 w-fit mx-auto mb-4">
                      <ListTodo className="h-8 w-8" />
                    </div>
                    <h3 className="font-extrabold text-slate-800 text-sm mb-1">Tidak Ada Paket Soal</h3>
                    <p className="text-xs text-slate-400 font-semibold mb-4 leading-relaxed">Paket soal berdasarkan filter pencarian tidak ditemukan. Buat naskah baru sekarang!</p>
                    <button onClick={openCreateModal} className="px-4 py-2 bg-orange-600 text-white rounded-xl font-bold text-xs">Buat Sekarang</button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bankSoalPackages
                      .filter(pkg => {
                        const matchesTab = activeBankSoalSubTab === 'private' ? !pkg.isPublic : pkg.isPublic;
                        const matchesSearch = pkg.title.toLowerCase().includes(bankSoalSearchQuery.toLowerCase()) || pkg.description.toLowerCase().includes(bankSoalSearchQuery.toLowerCase());
                        const matchesMapel = bankSoalMapelFilter === 'Semua Mapel' ? true : pkg.subject === bankSoalMapelFilter;
                        const matchesKelas = bankSoalKelasFilter === 'Semua Kelas' ? true : pkg.grade === bankSoalKelasFilter;
                        return matchesTab && matchesSearch && matchesMapel && matchesKelas;
                      })
                      .map(pkg => (
                        <div 
                          key={pkg.id}
                          onClick={() => handleOpenWorkspace(pkg.id)}
                          className="bg-white rounded-3xl border border-slate-100 hover:border-orange-200 p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between relative overflow-hidden"
                        >
                          <div className="space-y-3.5">
                            {/* Card Header Info */}
                            <div className="flex justify-between items-start">
                              <div className="p-2.5 bg-orange-50 rounded-2xl text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all">
                                <BookOpen className="h-5 w-5" />
                              </div>
                              <div className="flex gap-1.5">
                                <button 
                                  onClick={(e) => openEditModal(pkg, e)}
                                  className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-lg transition-all border border-transparent hover:border-slate-100"
                                  title="Edit Informasi"
                                >
                                  <Edit className="h-3.5 w-3.5" />
                                </button>
                                <button 
                                  onClick={(e) => handleDeleteBankSoalClick(pkg, e)}
                                  className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-all border border-transparent hover:border-red-100"
                                  title="Hapus"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Card Content */}
                            <div>
                              <h3 className="font-extrabold text-slate-800 text-sm group-hover:text-orange-600 transition-colors">{pkg.title}</h3>
                              <p className="text-[11px] text-slate-400 font-medium mt-1 leading-relaxed line-clamp-2">{pkg.description || 'Tidak ada deskripsi singkat.'}</p>
                            </div>
                          </div>

                          {/* Card Footer badges */}
                          <div className="flex items-center justify-between border-t border-slate-50 pt-3.5 mt-4">
                            <div className="flex flex-wrap gap-1">
                              <span className="px-2 py-0.5 bg-slate-50 text-slate-500 font-extrabold text-[9px] rounded-md uppercase tracking-wider">{pkg.subject}</span>
                              <span className="px-2 py-0.5 bg-slate-50 text-slate-500 font-extrabold text-[9px] rounded-md uppercase tracking-wider">{pkg.grade}</span>
                            </div>
                            <span className="text-[10px] text-slate-500 font-black tracking-wide bg-orange-50/50 text-orange-700 px-2.5 py-0.5 rounded-lg">
                              {pkg.questions?.length || 0} Soal
                            </span>
                          </div>
                        </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* ==========================================
                 SUB-VIEW 9B: QUESTION EDITOR WORKSPACE (Image 3)
                 ========================================== */
              (() => {
                const currentPackage = bankSoalPackages.find(p => p.id === activeBankSoalId);
                if (!currentPackage) return null;
                
                return (
                  <div className="space-y-5 animate-fade-in">
                    {/* Workspace Header Panel */}
                    <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Left Info */}
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => setActiveBankSoalId(null)}
                          className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-500 hover:text-slate-800 border border-slate-100 transition-all cursor-pointer"
                          title="Kembali"
                        >
                          <ArrowLeft className="h-4 w-4" />
                        </button>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="text-sm font-extrabold text-slate-800">{currentPackage.title}</h2>
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 font-extrabold text-[9px] rounded-md uppercase tracking-wider flex items-center gap-1">
                              <Check className="h-2.5 w-2.5" /> Tersimpan
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{currentPackage.subject} • Kelas {currentPackage.grade}</p>
                        </div>
                      </div>

                      {/* Right Action buttons */}
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => handleExportToWord(currentPackage)}
                          className="flex items-center gap-1.5 px-3.5 py-2 hover:bg-slate-50 text-slate-600 border border-slate-150 rounded-xl font-bold text-xs transition-all cursor-pointer"
                        >
                          <FileText className="h-3.5 w-3.5 text-blue-500" />
                          Export ke Word
                        </button>
                        <button
                          onClick={() => alert(`Total Bobot Paket ini: ${currentPackage.questions.reduce((acc, q) => acc + (q.weight || 0), 0)} Poin`)}
                          className="flex items-center gap-1.5 px-3.5 py-2 hover:bg-slate-50 text-slate-600 border border-slate-150 rounded-xl font-bold text-xs transition-all cursor-pointer"
                        >
                          <Award className="h-3.5 w-3.5 text-amber-500" />
                          Bobot Soal
                        </button>
                        <button
                          onClick={() => setIsPreviewModalOpen(true)}
                          className="flex items-center gap-1.5 px-3.5 py-2 hover:bg-slate-50 text-slate-600 border border-slate-150 rounded-xl font-bold text-xs transition-all cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5 text-indigo-500" />
                          Preview Ujian
                        </button>
                        <button
                          onClick={() => alert(`Pengaturan Tambahan:\nMata Pelajaran: ${currentPackage.subject}\nKelas: ${currentPackage.grade}\nStatus: ${currentPackage.isPublic ? 'Publik' : 'Pribadi'}`)}
                          className="flex items-center gap-1.5 px-3.5 py-2 hover:bg-slate-50 text-slate-600 border border-slate-150 rounded-xl font-bold text-xs transition-all cursor-pointer"
                        >
                          <Settings className="h-3.5 w-3.5 text-slate-400" />
                          Setting
                        </button>
                      </div>
                    </div>

                    {/* Main Workspace Workspace Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                      {/* 1. LEFT PANEL: NAVIGATOR (Image 3 Left Sidebar) */}
                      <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm space-y-4 h-fit">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-50">
                          <h3 className="font-extrabold text-slate-800 text-xs tracking-wider uppercase">NAVIGATOR</h3>
                          <button
                            onClick={() => handleAddNewQuestionToWorkspace(currentPackage.id)}
                            className="p-1 hover:bg-orange-50 text-orange-600 hover:text-orange-700 rounded-lg transition-all border border-orange-100 font-extrabold text-[10px] flex items-center gap-0.5"
                          >
                            <Plus className="h-3 w-3" /> Baru
                          </button>
                        </div>

                        {/* Navigator Selector Dropdown Mock */}
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[10px] font-bold text-slate-600 flex justify-between items-center cursor-pointer">
                          <span>Pilihan Ganda</span>
                          <ChevronRight className="h-3 w-3 rotate-90" />
                        </div>

                        {/* Grid of question numbers */}
                        <div className="grid grid-cols-5 gap-2">
                          {currentPackage.questions.map((q, idx) => {
                            const isSelected = selectedQuestionIndex === idx;
                            return (
                              <button
                                key={q.id || idx}
                                onClick={() => handleSelectQuestion(currentPackage, idx)}
                                className={`h-10 w-full rounded-xl flex items-center justify-center font-extrabold text-xs transition-all border cursor-pointer ${
                                  isSelected 
                                    ? 'bg-slate-800 text-white border-slate-800 shadow-sm' 
                                    : 'bg-white text-slate-600 border-slate-100 hover:bg-slate-50 hover:border-slate-200'
                                }`}
                              >
                                {idx + 1}
                              </button>
                            );
                          })}
                        </div>

                        {/* AI Question Builder with Magic (Gemini SDK Simulator) */}
                        <button
                          onClick={() => handleAiGenerateQuestion(currentPackage.id)}
                          disabled={isAiGenerating}
                          className={`w-full py-3 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 shadow-md shadow-orange-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          <Sparkles className="h-4 w-4" />
                          {isAiGenerating ? 'Menyusun Soal...' : '+ AI Generator'}
                        </button>

                        {/* AI Loading status */}
                        {isAiGenerating && (
                          <div className="p-3 bg-orange-50/50 border border-orange-100 rounded-2xl flex items-center gap-2.5 animate-pulse">
                            <div className="w-2.5 h-2.5 bg-orange-600 rounded-full animate-ping"></div>
                            <span className="text-[10px] font-bold text-orange-800">Menyusun pertanyaan bermutu...</span>
                          </div>
                        )}
                      </div>

                      {/* 2. RIGHT PANEL: RICH TEXT EDITOR (Image 3 Main Workspace) */}
                      <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-5">
                        
                        {/* Editor Header Meta */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-50 gap-3">
                          {/* Question Type Tabs */}
                          <div className="flex bg-slate-50 p-1 rounded-xl">
                            <button
                              onClick={() => { setActiveQType('Pilihan Ganda'); }}
                              className={`px-3 py-1.5 text-[10px] font-black rounded-lg transition-all ${activeQType === 'Pilihan Ganda' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                              PILIHAN GANDA
                            </button>
                            <button
                              onClick={() => { setActiveQType('Essay'); }}
                              className={`px-3 py-1.5 text-[10px] font-black rounded-lg transition-all ${activeQType === 'Essay' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                              ESSAY / URAIAN
                            </button>
                          </div>

                          {/* Bobot and Save */}
                          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                            <div className="flex items-center gap-2 text-xs font-extrabold text-slate-500">
                              <span>Bobot:</span>
                              <input 
                                type="number"
                                value={activeQWeight}
                                onChange={(e) => setActiveQWeight(Number(e.target.value))}
                                className="w-12 p-1.5 bg-slate-50 border border-slate-150 rounded-lg text-center font-black text-slate-800"
                              />
                            </div>
                            <button
                              onClick={() => handleSaveCurrentQuestion(currentPackage.id)}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-extrabold text-xs shadow-sm shadow-emerald-50 cursor-pointer flex items-center gap-1"
                            >
                              <Save className="h-3.5 w-3.5" />
                              Simpan Soal
                            </button>
                          </div>
                        </div>

                        {/* Rich Text Editor Mockup Toolbar */}
                        <div className="bg-slate-50 p-2 rounded-xl border border-slate-150 flex flex-wrap gap-1 text-slate-400">
                          <span className="px-2.5 py-1 text-[10px] font-bold text-slate-600 bg-white rounded-md shadow-sm border border-slate-100 cursor-pointer">Normal</span>
                          <span className="w-px h-5 bg-slate-200 self-center mx-1"></span>
                          {['B', 'I', 'U', 'S'].map(fmt => (
                            <button key={fmt} className="w-6 h-6 hover:bg-white hover:text-slate-600 rounded flex items-center justify-center text-xs font-black transition-colors" type="button">{fmt}</button>
                          ))}
                          <span className="w-px h-5 bg-slate-200 self-center mx-1"></span>
                          <button className="w-6 h-6 hover:bg-white hover:text-slate-600 rounded flex items-center justify-center text-xs font-serif transition-colors" type="button">”</button>
                          <button className="w-6 h-6 hover:bg-white hover:text-slate-600 rounded flex items-center justify-center text-[10px] font-black transition-colors" type="button">x²</button>
                          <button className="w-6 h-6 hover:bg-white hover:text-slate-600 rounded flex items-center justify-center text-[10px] font-black transition-colors" type="button">x₁</button>
                          <span className="w-px h-5 bg-slate-200 self-center mx-1"></span>
                          <button className="w-6 h-6 hover:bg-white hover:text-slate-600 rounded flex items-center justify-center text-xs font-black transition-colors" type="button">≡</button>
                          <button className="w-6 h-6 hover:bg-white hover:text-slate-600 rounded flex items-center justify-center text-xs font-black transition-colors" type="button">▤</button>
                          <button className="w-6 h-6 hover:bg-white hover:text-slate-600 rounded flex items-center justify-center text-xs font-black transition-colors" type="button">🖼️</button>
                          <button className="w-6 h-6 hover:bg-white hover:text-slate-600 rounded flex items-center justify-center text-xs font-mono transition-colors font-bold" type="button">f(x)</button>
                        </div>

                        {/* Editor Question Input */}
                        <div className="space-y-1">
                          <textarea
                            value={activeQText}
                            onChange={(e) => setActiveQText(e.target.value)}
                            placeholder="Tulis butir pertanyaan naskah soal disini..."
                            rows={4}
                            className="w-full p-4 bg-slate-50/50 border border-slate-150 rounded-2xl text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:border-slate-300"
                          />
                        </div>

                        {/* Alert Info Banner */}
                        <div className="bg-sky-50 border border-sky-100 rounded-2xl p-3.5 flex items-start gap-2.5">
                          <AlertCircle className="h-4 w-4 text-sky-600 shrink-0 mt-0.5" />
                          <p className="text-[10px] font-bold text-sky-800 leading-relaxed">
                            Tips: Klik <span className="underline">Simpan Soal</span> manual sebelum berpindah ke nomor soal lain atau mengaktifkan AI Generator untuk memastikan seluruh data perubahan terekam.
                          </p>
                        </div>

                        {/* JAWABAN SECTION */}
                        {activeQType === 'Pilihan Ganda' ? (
                          <div className="space-y-3 pt-3">
                            <div className="flex justify-between items-center">
                              <h4 className="text-[10px] font-black tracking-wider text-slate-400 uppercase">JAWABAN</h4>
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Pilih opsi yang benar</span>
                            </div>

                            {/* Option Rows A - E */}
                            {(['A', 'B', 'C', 'D', 'E'] as const).map((opt) => {
                              const isCorrect = activeQCorrect === opt;
                              return (
                                <div 
                                  key={opt}
                                  className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                                    isCorrect 
                                      ? 'bg-emerald-50/40 border-emerald-200' 
                                      : 'bg-slate-50/40 border-slate-150 hover:border-slate-200'
                                  }`}
                                >
                                  {/* Left letter bubble */}
                                  <div className="flex items-center gap-3 flex-1">
                                    <button 
                                      type="button"
                                      onClick={() => setActiveQCorrect(opt)}
                                      className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs transition-all ${
                                        isCorrect 
                                          ? 'bg-emerald-600 text-white shadow-sm' 
                                          : 'bg-slate-200 text-slate-500'
                                      }`}
                                    >
                                      {opt}
                                    </button>

                                    {/* Small editor bar & input */}
                                    <div className="flex-1 flex items-center gap-2 bg-white rounded-xl border border-slate-100 px-3 py-1.5">
                                      <div className="flex gap-0.5 text-slate-300 border-r border-slate-100 pr-2 shrink-0">
                                        <button className="text-[9px] font-black hover:text-slate-500 w-4 h-4 flex items-center justify-center">B</button>
                                        <button className="text-[9px] font-black hover:text-slate-500 w-4 h-4 flex items-center justify-center italic">I</button>
                                        <button className="text-[9px] font-black hover:text-slate-500 w-4 h-4 flex items-center justify-center font-serif font-bold">f</button>
                                      </div>
                                      <input 
                                        type="text"
                                        placeholder={`Butir pilihan jawaban ${opt}...`}
                                        value={activeQOptions[opt]}
                                        onChange={(e) => setActiveQOptions({...activeQOptions, [opt]: e.target.value})}
                                        className="w-full bg-transparent text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none"
                                      />
                                    </div>
                                  </div>

                                  {/* Right Green Tick Selector */}
                                  <button
                                    type="button"
                                    onClick={() => setActiveQCorrect(opt)}
                                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                                      isCorrect 
                                        ? 'bg-emerald-500 text-white' 
                                        : 'bg-slate-100 hover:bg-slate-200 text-slate-300 hover:text-slate-400'
                                    }`}
                                  >
                                    <Check className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          /* Essay/Uraian block */
                          <div className="space-y-3 pt-3">
                            <div className="flex justify-between items-center">
                              <h4 className="text-[10px] font-black tracking-wider text-slate-400 uppercase">JAWABAN ESSAY / KUNCI REF</h4>
                            </div>
                            <textarea
                              value={activeQEssayAnswer}
                              onChange={(e) => setActiveQEssayAnswer(e.target.value)}
                              placeholder="Tuliskan kata kunci referensi nilai essay untuk koreksi otomatis disini..."
                              rows={3}
                              className="w-full p-4 bg-slate-50/50 border border-slate-150 rounded-2xl text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()
            )}

            {/* ==========================================
               DIALOG MODAL: CREATE/EDIT METADATA (Image 2)
               ========================================== */}
            {isCreateModalOpen && (
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
                <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 max-w-lg w-full shadow-2xl space-y-6">
                  {/* Modal Header */}
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-800 font-display">
                      {editingBankSoal ? 'Edit Bank Soal' : 'Buat Bank Soal Baru'}
                    </h3>
                    <p className="text-xs text-slate-400 font-semibold mt-1">
                      {editingBankSoal ? 'Perbarui informasi naskah paket soal ujian ini.' : 'Buat paket bank soal baru untuk didistribusikan ke ujian KBM.'}
                    </p>
                  </div>

                  {/* Modal Form */}
                  <form onSubmit={handleSaveBankSoalPackage} className="space-y-4 text-xs font-bold">
                    {/* Judul Paket */}
                    <div className="space-y-1">
                      <label className="text-slate-400 uppercase tracking-widest text-[9px]">Judul Paket Soal</label>
                      <input 
                        type="text"
                        value={modalTitle}
                        onChange={(e) => setModalTitle(e.target.value)}
                        placeholder="Contoh: SAS Geografi Kelas 11"
                        required
                        className="w-full p-3 bg-slate-50 border border-slate-150 rounded-xl font-semibold text-slate-700 focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    {/* Deskripsi */}
                    <div className="space-y-1">
                      <label className="text-slate-400 uppercase tracking-widest text-[9px]">Deskripsi Singkat</label>
                      <textarea
                        value={modalDescription}
                        onChange={(e) => setModalDescription(e.target.value)}
                        placeholder="Contoh: Lingkungan Dan Kependudukan"
                        rows={2}
                        className="w-full p-3 bg-slate-50 border border-slate-150 rounded-xl font-semibold text-slate-700 focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    {/* Grid Subject & Grade */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* Subject */}
                      <div className="space-y-1">
                        <label className="text-slate-400 uppercase tracking-widest text-[9px]">Mata Pelajaran</label>
                        <select
                          value={modalSubject}
                          onChange={(e) => setModalSubject(e.target.value)}
                          className="w-full p-3 bg-slate-50 border border-slate-150 rounded-xl font-semibold text-slate-700 focus:outline-none"
                        >
                          <option value="Geografi">Geografi</option>
                          <option value="Fisika">Fisika</option>
                          <option value="Matematika">Matematika</option>
                        </select>
                      </div>

                      {/* Grade */}
                      <div className="space-y-1">
                        <label className="text-slate-400 uppercase tracking-widest text-[9px]">Tingkat Kelas</label>
                        <select
                          value={modalGrade}
                          onChange={(e) => setModalGrade(e.target.value)}
                          className="w-full p-3 bg-slate-50 border border-slate-150 rounded-xl font-semibold text-slate-700 focus:outline-none"
                        >
                          <option value="X.1">X.1</option>
                          <option value="XI.1">XI.1</option>
                          <option value="XII.1">XII.1</option>
                        </select>
                      </div>
                    </div>

                    {/* Public Sharing Toggle */}
                    <div className="p-3.5 bg-slate-50 rounded-2xl flex items-center justify-between gap-4 border border-slate-100">
                      <div>
                        <h4 className="text-slate-700 text-xs font-extrabold flex items-center gap-1.5">
                          <Globe className="h-3.5 w-3.5 text-orange-600" />
                          Bagikan ke Publik?
                        </h4>
                        <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Ijinkan guru lain mengunduh paket soal ini.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={modalIsPublic} 
                          onChange={(e) => setModalIsPublic(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-600"></div>
                      </label>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-3 justify-end pt-4 border-t border-slate-50">
                      <button 
                        type="button"
                        onClick={() => { setIsCreateModalOpen(false); setEditingBankSoal(null); }}
                        className="px-5 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-xl font-bold cursor-pointer"
                      >
                        Batal
                      </button>
                      <button 
                        type="submit"
                        className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-black shadow-md shadow-orange-50 cursor-pointer"
                      >
                        {editingBankSoal ? 'Simpan Perubahan' : 'Buat Paket'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* ==========================================
               PREVIEW MODAL: SIMULATE EXAM (High-Fidelity)
               ========================================== */}
            {isPreviewModalOpen && (() => {
              const currentPackage = bankSoalPackages.find(p => p.id === activeBankSoalId);
              if (!currentPackage) return null;

              return (
                <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
                  <div className="bg-slate-50 rounded-3xl overflow-hidden max-w-4xl w-full h-[85vh] shadow-2xl flex flex-col">
                    {/* Header bar */}
                    <div className="bg-white border-b border-slate-100 p-4 flex justify-between items-center">
                      <div>
                        <span className="text-[10px] font-black tracking-wider text-orange-600 uppercase">PRATINJAU TAMPILAN SISWA</span>
                        <h3 className="text-sm font-extrabold text-slate-800 leading-tight">{currentPackage.title}</h3>
                      </div>
                      <button 
                        onClick={() => setIsPreviewModalOpen(false)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-extrabold rounded-lg text-xs transition-all cursor-pointer"
                      >
                        Tutup
                      </button>
                    </div>

                    {/* Simulation questions content */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
                      {currentPackage.questions.length === 0 ? (
                        <p className="text-xs text-slate-400 font-semibold text-center">Belum ada soal terdaftar di paket ini.</p>
                      ) : (
                        currentPackage.questions.map((q, idx) => (
                          <div key={q.id || idx} className="bg-white rounded-2xl border border-slate-100 p-5 space-y-4">
                            <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                              <span className="font-extrabold text-xs text-orange-600">SOAL NO {idx + 1}</span>
                              <span className="text-[10px] bg-slate-50 text-slate-500 font-black px-2.5 py-0.5 rounded-md">Bobot: {q.weight || 5} Poin</span>
                            </div>
                            
                            <h4 className="font-bold text-slate-800 text-xs sm:text-sm leading-relaxed">{q.text || '(Belum menulis naskah pertanyaan)'}</h4>

                            {q.type === 'Pilihan Ganda' ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                                {(['A', 'B', 'C', 'D', 'E'] as const).map((letKey) => (
                                  <div 
                                    key={letKey}
                                    className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-3 ${
                                      q.correctAnswer === letKey 
                                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                                        : 'bg-slate-50 text-slate-600 border-slate-100'
                                    }`}
                                  >
                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold shrink-0 ${
                                      q.correctAnswer === letKey 
                                        ? 'bg-emerald-600 text-white' 
                                        : 'bg-slate-200 text-slate-500'
                                    }`}>{letKey}</span>
                                    <span>{q.options?.[letKey] || '(Belum dispesifikasi)'}</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Referensi Kunci Uraian</span>
                                <p className="text-xs font-semibold text-slate-600 italic leading-relaxed">{q.essayAnswer || '(Belum dispesifikasi)'}</p>
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}

          </div>
        )}

        {/* VIEW 10: JADWAL UJIAN */}
        {activeTab === 'jadwal-ujian' && (
          <div className="max-w-7xl w-full mx-auto p-4 md:p-8 space-y-6 animate-fade-in">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
                  Jadwal Ujian
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                  Kelola waktu pelaksanaan dan peserta ujian.
                </p>
              </div>
              
              {/* Desktop "+ Buat Jadwal" Button */}
              <button
                onClick={handleOpenCreateScheduleModal}
                className="hidden md:flex items-center gap-2 px-5 py-3 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-2xl font-bold text-sm shadow-md shadow-blue-500/10 transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                Buat Jadwal
              </button>
            </div>

            {/* Tabs Row and Mobile Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Tab options matching Screenshot 1 */}
              <div className="bg-slate-100/80 p-1 rounded-2xl flex flex-wrap gap-1 w-fit">
                <button
                  onClick={() => setActiveScheduleTab('saya')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeScheduleTab === 'saya'
                      ? 'bg-white text-blue-600 shadow-xs border border-slate-200/40'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  Jadwal Saya
                </button>
                <button
                  onClick={() => setActiveScheduleTab('semua')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeScheduleTab === 'semua'
                      ? 'bg-white text-blue-600 shadow-xs border border-slate-200/40'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  Semua Jadwal
                </button>
                <button
                  onClick={() => setActiveScheduleTab('aktif')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeScheduleTab === 'aktif'
                      ? 'bg-white text-blue-600 shadow-xs border border-slate-200/40'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  🔥 Sedang Aktif
                </button>
                <button
                  onClick={() => setActiveScheduleTab('selesai')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeScheduleTab === 'selesai'
                      ? 'bg-white text-blue-600 shadow-xs border border-slate-200/40'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  📋 Riwayat Selesai
                </button>
              </div>

              {/* Mobile "+ Buat Jadwal" Button */}
              <button
                onClick={handleOpenCreateScheduleModal}
                className="flex md:hidden items-center justify-center gap-2 w-full px-5 py-3 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-2xl font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                Buat Jadwal
              </button>
            </div>

            {/* Main Content Area */}
            {(() => {
              // Filter schedules based on active tab
              let filtered = [...examSchedules];
              if (activeScheduleTab === 'aktif') {
                // If it's 'Sedang Aktif', show schedules that have status 'Sedang Aktif' or '🔥 Sedang Aktif'
                filtered = examSchedules.filter(s => s.status === '🔥 Sedang Aktif' || s.status === 'Aktif' || s.status === 'Sedang Aktif');
              } else if (activeScheduleTab === 'selesai') {
                filtered = examSchedules.filter(s => s.status === 'Riwayat Selesai' || s.status === 'Selesai');
              } else if (activeScheduleTab === 'saya') {
                // Default schedules for the teacher
                filtered = examSchedules.filter(s => s.status !== 'Riwayat Selesai' && s.status !== 'Selesai');
              }

              if (filtered.length === 0) {
                return (
                  <div className="border border-dashed border-slate-200 bg-white rounded-[32px] p-12 md:p-24 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center text-blue-500 mb-2">
                      <Calendar className="h-10 w-10 text-[#2563eb]" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-800">
                      {activeScheduleTab === 'aktif' 
                        ? 'Belum ada Jadwal Aktif' 
                        : activeScheduleTab === 'selesai' 
                          ? 'Belum ada Riwayat Ujian' 
                          : 'Belum ada Jadwal Ujian'}
                    </h3>
                    
                    <p className="text-slate-500 text-sm max-w-md font-medium leading-relaxed">
                      {activeScheduleTab === 'aktif'
                        ? 'Jadwal ujian yang akan datang atau sedang berjalan akan muncul di sini.'
                        : 'Mulai buat jadwal baru untuk mengujikan paket soal kepada siswa.'}
                    </p>

                    <button
                      onClick={handleOpenCreateScheduleModal}
                      className="text-[#2563eb] hover:text-blue-700 font-extrabold text-sm flex items-center justify-center gap-1 pt-2 transition-all cursor-pointer"
                    >
                      + Buat Jadwal Baru
                    </button>
                  </div>
                );
              }

              // Otherwise, render list of filtered schedules
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filtered.map((s) => (
                    <div 
                      key={s.id} 
                      className="bg-white rounded-[32px] border border-slate-100 p-6 shadow-xs hover:shadow-md transition-all space-y-4 relative overflow-hidden group"
                    >
                      {/* Top Bar inside Card */}
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <span className="px-2.5 py-1 bg-blue-50 text-blue-600 font-extrabold text-[10px] rounded-lg uppercase tracking-wider">
                            {s.subject}
                          </span>
                          <h4 className="font-extrabold text-slate-800 text-sm sm:text-base leading-snug pt-1">
                            {s.name}
                          </h4>
                        </div>

                        {/* Delete Schedule Action */}
                        <button
                          onClick={() => {
                            setDeleteScheduleId(s.id);
                            setDeleteScheduleName(s.name);
                          }}
                          className="text-slate-300 hover:text-red-500 p-1.5 hover:bg-slate-50 rounded-lg transition-all cursor-pointer"
                          title="Hapus Jadwal"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Detail Parameters */}
                      <div className="grid grid-cols-2 gap-3 text-xs text-slate-500 font-semibold bg-slate-50/50 p-3.5 rounded-2xl">
                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider mb-0.5">Tanggal</span>
                          <span className="text-slate-700 font-bold">{s.date}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider mb-0.5">Waktu</span>
                          <span className="text-slate-700 font-bold">{s.time}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider mb-0.5">Durasi</span>
                          <span className="text-slate-700 font-bold">{s.duration}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider mb-0.5">Kelas</span>
                          <span className="text-slate-700 font-bold">{s.class}</span>
                        </div>
                      </div>

                      {/* Token Section with copy */}
                      <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Token:</span>
                          <span className="font-mono font-bold text-blue-600 bg-blue-50/50 px-3 py-1 rounded-lg text-sm tracking-widest border border-blue-100/30">
                            {s.token || 'AQX8YF'}
                          </span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(s.token || '');
                              alert('Token berhasil disalin ke papan klip!');
                            }}
                            className="p-1 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
                            title="Salin Token"
                          >
                            <FileText className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${s.status === '🔥 Sedang Aktif' || s.status === 'Sedang Aktif' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                          <span className="text-[11px] font-bold text-slate-600">
                            {s.status === 'Tersedia' ? 'Belum Dimulai' : s.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        )}

        {/* VIEW 11: MONITOR UJIAN */}
        {activeTab === 'monitor-ujian' && (
          <div className="max-w-7xl w-full mx-auto p-4 md:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PlaySquare className="h-6 w-6 text-orange-600" />
                <h2 className="text-xl font-extrabold text-slate-800 font-display">Real-Time CBT Proctoring Monitor</h2>
              </div>
              <button 
                onClick={() => alert("Mengirimkan instruksi pembaruan (refresh) ke seluruh terminal siswa...")}
                className="bg-orange-600 hover:bg-orange-700 text-white font-extrabold py-1.5 px-3.5 rounded-lg text-xs"
              >
                Pembaruan Sistem
              </button>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-6">
              <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                <p className="text-xs text-emerald-800 font-bold">
                  Sistem proteksi AuraExam aktif. Mengawasi tab-switch, IP address, dan pengerjaan tertib para siswa.
                </p>
              </div>

              <div className="w-full">
                {/* Mobile Card Layout */}
                <div className="block md:hidden space-y-4">
                  {activeExamTakers.map(t => (
                    <div key={t.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col gap-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-sm font-extrabold text-slate-800 uppercase tracking-wide">{t.name}</h4>
                          <p className="text-xs text-slate-400 mt-1">IP: {t.ip}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black ${t.status === 'Aktif' ? 'bg-emerald-100 text-emerald-700' : t.status === 'Selesai' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                          {t.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs border-t border-slate-100 pt-2 font-semibold">
                        <span className="text-slate-600">Progres: <span className="text-orange-600 font-extrabold">{t.progress}</span></span>
                        <span className="text-slate-600">Tab-Switch: <span className={`px-1.5 py-0.5 rounded text-[10px] font-black ${t.violations > 0 ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-500'}`}>{t.violations} Kali</span></span>
                      </div>
                      <button 
                        onClick={() => alert(`Mengirim pesan peringatan kepada siswa ${t.name}: 'Dimohon untuk fokus dan tidak beralih tab!'`)} 
                        className="w-full py-2 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-xl text-xs font-black transition-all text-center mt-1 cursor-pointer"
                      >
                        Peringatkan
                      </button>
                    </div>
                  ))}
                </div>

                {/* Desktop Table Layout */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full lg:min-w-full text-left border-collapse text-xs md:text-sm whitespace-nowrap">
                    <thead>
                      <tr className="bg-orange-500 text-white font-black uppercase text-[10px] tracking-wider">
                        <th className="py-3 px-4 first:rounded-tl-xl">Nama Siswa</th>
                        <th className="py-3 px-4">Terminal IP</th>
                        <th className="py-3 px-4 text-center">Progres Pengerjaan</th>
                        <th className="py-3 px-4 text-center">Tab-Switch (Pelanggaran)</th>
                        <th className="py-3 px-4 text-center">Status Keaktifan</th>
                        <th className="py-3 px-4 text-center last:rounded-tr-xl">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 font-bold text-slate-700">
                      {activeExamTakers.map(t => (
                        <tr key={t.id} className="hover:bg-slate-50/50">
                          <td className="py-4 px-4 font-extrabold text-slate-900">{t.name}</td>
                          <td className="py-4 px-4 text-slate-400">{t.ip}</td>
                          <td className="py-4 px-4 text-center text-orange-600">{t.progress}</td>
                          <td className="py-4 px-4 text-center">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black ${t.violations > 0 ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-500'}`}>
                              {t.violations} Kali
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black ${t.status === 'Aktif' ? 'bg-emerald-100 text-emerald-700' : t.status === 'Selesai' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                              {t.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <button onClick={() => alert(`Mengirim pesan peringatan kepada siswa ${t.name}: 'Dimohon untuk fokus dan tidak beralih tab!'`)} className="bg-amber-100 hover:bg-amber-200 text-amber-700 py-1 px-2.5 rounded-lg text-xs font-black">
                              Peringatkan
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 12: DATA SISWA */}
        {activeTab === 'data-siswa' && (
          <div className="max-w-7xl w-full mx-auto p-4 md:p-8 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Users className="h-6 w-6 text-blue-600" />
                  <h2 className="text-xl font-black text-slate-800 font-display">Data Siswa</h2>
                </div>
                <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-wider">Daftar seluruh siswa di sekolah Anda beserta rata-rata nilainya.</p>
              </div>
              <div className="bg-white border border-slate-150 text-slate-700 px-4 py-2.5 rounded-2xl flex items-center gap-2 text-xs font-extrabold shadow-sm">
                <Users className="h-4 w-4 text-slate-400" />
                <span>{studentsList.length} Total Siswa</span>
              </div>
            </div>

            {/* Search and Class Filter Bar */}
            <div className="bg-white rounded-3xl border border-slate-100 p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:max-w-md">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                  <Search className="h-4 w-4" />
                </span>
                <input 
                  type="text" 
                  value={searchStudentQuery}
                  onChange={(e) => setSearchStudentQuery(e.target.value)}
                  placeholder="Cari nama atau NISN..."
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200/80 text-xs font-semibold bg-slate-50/50 outline-none focus:bg-white focus:border-blue-500 transition-all text-slate-700"
                />
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <Filter className="h-4 w-4 text-slate-400" />
                <select
                  value={selectedClassFilter}
                  onChange={(e) => setSelectedClassFilter(e.target.value)}
                  className="w-full md:w-48 px-3.5 py-3 rounded-2xl border border-slate-200 text-xs font-bold bg-white text-slate-700 outline-none focus:border-blue-500 transition-all cursor-pointer"
                >
                  <option value="Semua Kelas">Semua Kelas</option>
                  <option value="X.1">Kelas X.1</option>
                  <option value="X.2">Kelas X.2</option>
                  <option value="XI IPA 1">Kelas XI IPA 1</option>
                  <option value="XI IPS 1">Kelas XI IPS 1</option>
                  <option value="XII IPA 1">Kelas XII IPA 1</option>
                  <option value="XII IPA 2">Kelas XII IPA 2</option>
                  <option value="XII IPS 1">Kelas XII IPS 1</option>
                </select>
              </div>
            </div>

            {/* Table layout matching the screenshot precisely */}
            <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
              {studentsList.filter(s => {
                const matchesSearch = s.name.toLowerCase().includes(searchStudentQuery.toLowerCase()) || 
                                      s.nis.toLowerCase().includes(searchStudentQuery.toLowerCase());
                const matchesClass = selectedClassFilter === 'Semua Kelas' || s.class === selectedClassFilter;
                return matchesSearch && matchesClass;
              }).length === 0 ? (
                <div className="py-12 text-center text-slate-400 font-bold text-xs uppercase tracking-wider select-none">
                  Siswa tidak ditemukan
                </div>
              ) : (
                <div className="w-full">
                  {/* Mobile Card Layout */}
                  <div className="block md:hidden divide-y divide-slate-100">
                    {studentsList.filter(s => {
                      const matchesSearch = s.name.toLowerCase().includes(searchStudentQuery.toLowerCase()) || 
                                            s.nis.toLowerCase().includes(searchStudentQuery.toLowerCase());
                      const matchesClass = selectedClassFilter === 'Semua Kelas' || s.class === selectedClassFilter;
                      return matchesSearch && matchesClass;
                    }).map(s => {
                      let gradeBg = 'bg-emerald-50 text-emerald-600 border-emerald-100';
                      if (s.averageGrade < 50) {
                        gradeBg = 'bg-red-50 text-red-500 border-red-100';
                      } else if (s.averageGrade < 75) {
                        gradeBg = 'bg-amber-50 text-amber-500 border-amber-100';
                      }
                      
                      return (
                        <div key={s.id} className="p-4 flex flex-col gap-3 hover:bg-slate-50/50">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-sm font-extrabold text-slate-800 uppercase tracking-wide cursor-pointer hover:text-orange-600 transition-colors" onClick={() => setSelectedStudentDetail(s)}>
                                {s.name}
                              </h4>
                              <p className="text-xs text-slate-400 mt-1 font-mono">{s.nis}</p>
                            </div>
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black border ${gradeBg}`}>
                              {s.averageGrade}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-xs border-t border-slate-100 pt-2">
                            <span className="px-2.5 py-0.5 text-[10px] font-black rounded-lg bg-blue-50 text-blue-600 border border-blue-100 uppercase">
                              {s.class}
                            </span>
                            <button
                              onClick={() => setResetPasswordStudent(s)}
                              className="flex items-center gap-1.5 px-3 py-1.5 border border-amber-200 bg-amber-50/30 hover:bg-amber-100 text-amber-600 hover:text-amber-700 rounded-xl transition-all cursor-pointer text-[11px] font-black"
                            >
                              <Key className="h-3.5 w-3.5" />
                              <span>Reset Sandi</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Desktop Table Layout */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full lg:min-w-full text-left border-collapse text-xs md:text-sm whitespace-nowrap">
                      <thead>
                        <tr className="bg-orange-500 text-white font-black uppercase text-[10px] tracking-wider">
                          <th className="py-4 px-6">Nama Lengkap</th>
                          <th className="py-4 px-6">NISN / Username</th>
                          <th className="py-4 px-6">Kelas</th>
                          <th className="py-4 px-6 text-center">Rata-Rata Nilai</th>
                          <th className="py-4 px-6 text-center last:rounded-tr-xl">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {studentsList.filter(s => {
                          const matchesSearch = s.name.toLowerCase().includes(searchStudentQuery.toLowerCase()) || 
                                                s.nis.toLowerCase().includes(searchStudentQuery.toLowerCase());
                          const matchesClass = selectedClassFilter === 'Semua Kelas' || s.class === selectedClassFilter;
                          return matchesSearch && matchesClass;
                        }).map(s => {
                          let gradeBg = 'bg-emerald-50 text-emerald-600 border-emerald-100';
                          if (s.averageGrade < 50) {
                            gradeBg = 'bg-red-50 text-red-500 border-red-100';
                          } else if (s.averageGrade < 75) {
                            gradeBg = 'bg-amber-50 text-amber-500 border-amber-100';
                          }
                          
                          return (
                            <tr key={s.id} className="bg-white hover:bg-slate-50/30 transition-all">
                              <td className="py-4 px-6 font-extrabold text-slate-800 text-sm tracking-wide uppercase cursor-pointer" onClick={() => setSelectedStudentDetail(s)}>
                                {s.name}
                              </td>
                              <td className="py-4 px-6 text-slate-500 font-mono text-xs">
                                {s.nis}
                              </td>
                              <td className="py-4 px-6">
                                <span className="px-2.5 py-1 text-[11px] font-black rounded-lg bg-blue-50 text-blue-600 border border-blue-100 uppercase">
                                  {s.class}
                                </span>
                              </td>
                              <td className="py-4 px-6 text-center">
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${gradeBg}`}>
                                  {s.averageGrade}
                                </span>
                              </td>
                              <td className="py-4 px-6 text-center">
                                <button
                                  onClick={() => setResetPasswordStudent(s)}
                                  className="p-1.5 border border-amber-200 bg-amber-50/30 hover:bg-amber-100 text-amber-500 hover:text-amber-600 rounded-lg transition-all cursor-pointer inline-flex items-center justify-center active:scale-95"
                                  title="Reset Kata Sandi"
                                >
                                  <Key className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Student Detail Modal */}
            {selectedStudentDetail && (
              <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-[2.5rem] max-w-md w-full p-6 sm:p-8 space-y-6 relative border border-slate-150 shadow-2xl">
                  <div className="flex justify-between items-start">
                    <h3 className="font-extrabold text-slate-800 text-base font-display">Informasi Detail Siswa</h3>
                    <button onClick={() => setSelectedStudentDetail(null)} className="text-slate-400 hover:text-slate-600 font-bold">X</button>
                  </div>
                  <div className="space-y-4 text-xs font-bold text-slate-600">
                    <div className="flex items-center gap-3 pb-3 border-b border-slate-50">
                      <div className="h-12 w-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center font-black text-sm">
                        {selectedStudentDetail.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-800 text-sm leading-none">{selectedStudentDetail.name}</h4>
                        <span className="text-[9px] text-orange-600 uppercase tracking-wider block mt-1">{selectedStudentDetail.nis}</span>
                      </div>
                    </div>
                    <div className="space-y-2.5">
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Wali Murid / Orang Tua</span>
                        <span className="text-slate-800 text-xs font-extrabold">{selectedStudentDetail.parent}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Nomor Telepon</span>
                        <span className="text-slate-800 text-xs font-extrabold">{selectedStudentDetail.phone}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Alamat Rumah</span>
                        <span className="text-slate-800 text-xs font-extrabold">{selectedStudentDetail.address}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Email Sekolah</span>
                        <span className="text-slate-800 text-xs font-extrabold">{selectedStudentDetail.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Reset Password Modal */}
            {resetPasswordStudent && (
              <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
                <div className="bg-white rounded-[2rem] max-w-md w-full p-6 sm:p-8 space-y-6 relative border border-slate-100 shadow-2xl">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                    <div className="p-2.5 bg-amber-50 rounded-2xl text-amber-600 border border-amber-100">
                      <Key className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider font-display">Reset Kata Sandi Siswa</h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Konfirmasi Kredensial Akses</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-xs text-slate-600 font-bold leading-relaxed">
                      Apakah Anda ingin mereset kata sandi untuk siswa berikut kembali ke default <code className="bg-slate-100 px-1.5 py-0.5 rounded text-amber-600 font-mono">siswa123</code>?
                    </p>
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2">
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Nama Lengkap</span>
                        <span className="text-xs font-black text-slate-800 block uppercase mt-0.5">{resetPasswordStudent.name}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Username / Email</span>
                        <span className="text-xs font-mono text-slate-600 block mt-0.5">{resetPasswordStudent.nis}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button 
                      onClick={() => setResetPasswordStudent(null)}
                      className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-extrabold text-xs rounded-2xl transition-all cursor-pointer text-center uppercase tracking-wider"
                    >
                      Batal
                    </button>
                    <button 
                      onClick={() => {
                        alert(`Kata sandi siswa ${resetPasswordStudent.name} berhasil direset ke default!`);
                        setResetPasswordStudent(null);
                      }}
                      className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-white font-black text-xs rounded-2xl transition-all shadow-md shadow-amber-100 cursor-pointer text-center uppercase tracking-wider"
                    >
                      Reset Sandi
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 13: HASIL & NILAI */}
        {activeTab === 'hasil-nilai' && (
          <div className="max-w-7xl w-full mx-auto p-4 md:p-8 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-6 w-6 text-orange-600" />
              <h2 className="text-xl font-extrabold text-slate-800 font-display">Analisis Hasil Ujian CBT</h2>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 bg-slate-55 border border-slate-100/50 rounded-2xl text-center font-bold">
                <div>
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Ujian Selesai</span>
                  <span className="text-slate-800 text-xl font-black block mt-1">1 Kali</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Rata-Rata Nilai</span>
                  <span className="text-orange-600 text-xl font-black block mt-1">87</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Nilai Tertinggi</span>
                  <span className="text-emerald-600 text-xl font-black block mt-1">98</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Kelulusan</span>
                  <span className="text-orange-600 text-xl font-black block mt-1">75%</span>
                </div>
              </div>

              <div className="w-full">
                {/* Mobile Card Layout */}
                <div className="block md:hidden space-y-4">
                  {examResults.map(r => (
                    <div key={r.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col gap-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-sm font-extrabold text-slate-800 uppercase tracking-wide">{r.name}</h4>
                          <p className="text-xs text-slate-400 mt-1">{r.exam}</p>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          r.status === 'LULUS' 
                            ? 'bg-emerald-50 text-emerald-700' 
                            : 'bg-red-50 text-red-700'
                        }`}>
                          {r.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs border-t border-slate-100 pt-2 font-semibold">
                        <span className="text-slate-600">Jawaban Benar: <span className="text-slate-800 font-extrabold">{r.correct}</span></span>
                        <span className="text-slate-600">Skor Akhir: <span className="text-orange-600 font-black text-sm">{r.score}</span></span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table Layout */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full lg:min-w-full text-left border-collapse text-xs md:text-sm whitespace-nowrap">
                    <thead>
                      <tr className="bg-orange-500 text-white font-black uppercase text-[10px] tracking-wider">
                        <th className="py-3 px-4 first:rounded-tl-xl">Nama Siswa</th>
                        <th className="py-3 px-4">Nama Evaluasi</th>
                        <th className="py-3 px-4 text-center">Jawaban Benar</th>
                        <th className="py-3 px-4 text-center">Skor Akhir</th>
                        <th className="py-3 px-4 text-center last:rounded-tr-xl">Kelayakan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 font-bold text-slate-700">
                      {examResults.map(r => (
                        <tr key={r.id} className="hover:bg-slate-50/50">
                          <td className="py-4 px-4 font-extrabold text-slate-900">{r.name}</td>
                          <td className="py-4 px-4 text-slate-400">{r.exam}</td>
                          <td className="py-4 px-4 text-center text-orange-600">{r.correct}</td>
                          <td className="py-4 px-4 text-center font-black text-slate-900">{r.score}</td>
                          <td className="py-4 px-4 text-center">
                            <span className={`px-2.5 py-1 text-[10px] font-black rounded-lg ${r.status === 'LULUS' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                              {r.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 14: PROFILE SETTINGS */}
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
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 sm:p-6 md:p-8 flex-1 space-y-6">
                {saveMessage && (
                  <div className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2 ${saveMessage.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                    {saveMessage.type === 'success' ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
                    <span>{saveMessage.text}</span>
                  </div>
                )}

                {profileSubTab === 'profile' ? (
                  <form onSubmit={handleSaveProfile} className="space-y-6">
                    {/* Inner Header */}
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                      <div className="h-10 w-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                        <User className="h-5 w-5" />
                      </div>
                      <h3 className="text-base font-extrabold text-slate-800 font-display">Informasi Profil</h3>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Nama Lengkap</label>
                          <input
                            type="text"
                            value={teacherName}
                            onChange={(e) => setTeacherName(e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-slate-800 font-extrabold text-xs md:text-sm focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-50 transition-all shadow-sm"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Alamat Email</label>
                          <input
                            type="email"
                            value={teacherEmail}
                            onChange={(e) => setTeacherEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-slate-800 font-extrabold text-xs md:text-sm focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-50 transition-all shadow-sm"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Nomor Induk Pegawai (NIP)</label>
                          <input
                            type="text"
                            value={teacherNip}
                            readOnly
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-150 rounded-2xl text-slate-400 font-bold text-xs md:text-sm cursor-not-allowed select-none"
                          />
                          <div className="flex items-center gap-1.5 mt-2 text-[10px] font-bold text-slate-400">
                            <Lock className="h-3 w-3 text-slate-400" />
                            <span>NIP dikelola oleh admin sekolah.</span>
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Spesialisasi Mapel</label>
                          <input
                            type="text"
                            value={teacherSubject}
                            onChange={(e) => setTeacherSubject(e.target.value)}
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-slate-800 font-extrabold text-xs md:text-sm focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-50 transition-all shadow-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Biografi Ringkas</label>
                        <textarea
                          value={teacherBio}
                          onChange={(e) => setTeacherBio(e.target.value)}
                          rows={4}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-slate-800 font-bold text-xs md:text-sm focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-50 transition-all shadow-sm"
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end pt-4 border-t border-slate-50">
                      <button
                        type="submit"
                        className="flex items-center gap-2 px-5 py-3 bg-orange-600 hover:bg-orange-700 text-white font-black text-xs md:text-sm rounded-2xl transition-all shadow-md shadow-orange-100 cursor-pointer"
                      >
                        <Save className="h-4 w-4" />
                        <span>Simpan Perubahan</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleUpdatePassword} className="space-y-6">
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
                        type="submit"
                        className="flex items-center gap-2 px-5 py-3 bg-orange-600 hover:bg-orange-700 text-white font-black text-xs md:text-sm rounded-2xl transition-all shadow-md shadow-orange-100 cursor-pointer"
                      >
                        <Save className="h-4 w-4" />
                        <span>Perbarui Password</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
           MODAL: BUAT JADWAL BARU (Image 2 Style)
           ========================================== */}
        {isCreateScheduleModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-[32px] border border-slate-100 p-6 md:p-8 max-w-xl w-full shadow-2xl relative space-y-6">
              {/* Close Button */}
              <button 
                onClick={() => setIsCreateScheduleModalOpen(false)}
                className="absolute right-6 top-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all cursor-pointer"
              >
                <Plus className="h-5 w-5 rotate-45" />
              </button>

              {/* Modal Header */}
              <div>
                <h3 className="text-xl font-extrabold text-slate-800 font-display">
                  Buat Jadwal Baru
                </h3>
                <p className="text-xs text-blue-600 font-bold mt-1">
                  Langkah 1 dari 2
                </p>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSaveSchedule} className="space-y-5 text-xs font-bold">
                {/* Pilih Paket Soal */}
                <div className="space-y-1.5">
                  <label className="text-slate-800 text-xs font-extrabold block">Pilih Paket Soal</label>
                  <div className="relative">
                    <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <select 
                      value={schedulePackageId}
                      onChange={(e) => setSchedulePackageId(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-2xl text-slate-700 font-bold text-xs md:text-sm focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 bg-white cursor-pointer"
                    >
                      <option value="">-- Pilih Bank Soal --</option>
                      {bankSoalPackages.map(p => (
                        <option key={p.id} value={p.id}>{p.title} ({p.subject})</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Nama Jadwal Ujian */}
                <div className="space-y-1.5">
                  <label className="text-slate-800 text-xs font-extrabold block">Nama Jadwal Ujian</label>
                  <input 
                    type="text"
                    value={scheduleName}
                    onChange={(e) => setScheduleName(e.target.value)}
                    placeholder="Contoh: UAS Matematika X IPA 1"
                    required
                    className="w-full px-4 py-3.5 border border-slate-200 rounded-2xl text-slate-800 font-extrabold text-xs md:text-sm focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all bg-slate-50/20"
                  />
                </div>

                {/* Waktu Mulai & Waktu Selesai Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-slate-800 text-xs font-extrabold block">Waktu Mulai</label>
                    <input 
                      type="datetime-local"
                      value={scheduleStartTime}
                      onChange={(e) => setScheduleStartTime(e.target.value)}
                      required
                      className="w-full px-4 py-3.5 border border-slate-200 rounded-2xl text-slate-700 font-bold text-xs md:text-sm focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 bg-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-800 text-xs font-extrabold block">Waktu Selesai</label>
                    <input 
                      type="datetime-local"
                      value={scheduleEndTime}
                      onChange={(e) => setScheduleEndTime(e.target.value)}
                      required
                      className="w-full px-4 py-3.5 border border-slate-200 rounded-2xl text-slate-700 font-bold text-xs md:text-sm focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 bg-white"
                    />
                  </div>
                </div>

                {/* Durasi & Token Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Durasi */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-slate-800 text-xs font-extrabold block">Durasi (Menit)</label>
                      <div className="flex items-center gap-1.5">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={scheduleSync} 
                            onChange={(e) => setScheduleSync(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-7 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                        <span className="text-[9px] text-slate-500 uppercase tracking-wider font-extrabold flex items-center gap-0.5">
                          SINKRON JADWAL
                          <HelpCircle className="h-3 w-3 text-slate-400" title="Sinkronisasi waktu mulai dengan durasi otomatis" />
                        </span>
                      </div>
                    </div>
                    <div className="relative">
                      <input 
                        type="number"
                        value={scheduleDuration}
                        onChange={(e) => setScheduleDuration(e.target.value)}
                        required
                        min="1"
                        className="w-full pl-4 pr-16 py-3.5 border border-slate-200 rounded-2xl text-slate-800 font-extrabold text-xs md:text-sm focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 bg-slate-50/20"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-400">
                        MENIT
                      </span>
                    </div>
                  </div>

                  {/* Token */}
                  <div className="space-y-1.5">
                    <label className="text-slate-800 text-xs font-extrabold block">Token Ujian</label>
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        value={scheduleToken}
                        readOnly
                        className="w-full px-4 py-3.5 bg-blue-50/40 border border-blue-100 rounded-2xl text-blue-700 font-mono font-bold text-center tracking-widest text-sm focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleRegenerateToken}
                        className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl text-slate-600 hover:text-slate-800 transition-all shrink-0 cursor-pointer flex items-center justify-center"
                        title="Acak Token Baru"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-between items-center pt-4 border-t border-slate-100 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsCreateScheduleModalOpen(false)}
                    className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-bold text-xs md:text-sm transition-all cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xs md:text-sm shadow-md transition-all cursor-pointer"
                  >
                    <span>Lanjut</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}


      </div>

      {/* ================= MODAL: KONFIRMASI HAPUS BANK SOAL ================= */}
      {deleteBankSoalId !== null && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-100 p-6 space-y-6 animate-scaleUp">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="p-2.5 bg-red-50 rounded-2xl text-red-600">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider font-display">Hapus Paket Bank Soal</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Tindakan ini tidak dapat dibatalkan</p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-slate-600 font-bold leading-relaxed">
                Apakah Anda yakin ingin menghapus paket bank soal ini beserta seluruh pertanyaannya dari sistem?
              </p>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Judul Paket</span>
                <span className="text-sm font-black text-slate-800 block mt-0.5">{deleteBankSoalTitle}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => {
                  setDeleteBankSoalId(null);
                  setDeleteBankSoalTitle('');
                }}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-extrabold text-xs rounded-2xl transition-all cursor-pointer text-center uppercase tracking-wider"
              >
                Batal
              </button>
              <button 
                onClick={confirmDeleteBankSoal}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-2xl transition-all shadow-md shadow-red-100 cursor-pointer text-center uppercase tracking-wider"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: KONFIRMASI HAPUS JADWAL UJIAN ================= */}
      {deleteScheduleId !== null && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-100 p-6 space-y-6 animate-scaleUp">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="p-2.5 bg-red-50 rounded-2xl text-red-600">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider font-display">Hapus Jadwal Ujian</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Tindakan ini tidak dapat dibatalkan</p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-slate-600 font-bold leading-relaxed">
                Apakah Anda yakin ingin menghapus jadwal pelaksanaan ujian berikut? Siswa tidak akan dapat mengakses ujian ini lagi.
              </p>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Nama Jadwal</span>
                <span className="text-sm font-black text-slate-800 block mt-0.5">{deleteScheduleName}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => {
                  setDeleteScheduleId(null);
                  setDeleteScheduleName('');
                }}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-extrabold text-xs rounded-2xl transition-all cursor-pointer text-center uppercase tracking-wider"
              >
                Batal
              </button>
              <button 
                onClick={confirmDeleteSchedule}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-2xl transition-all shadow-md shadow-red-100 cursor-pointer text-center uppercase tracking-wider"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= TOAST NOTIFICATION ================= */}
      {toast && (
        <div className="fixed bottom-24 right-4 md:right-8 z-50 flex items-center gap-3 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-xl border border-slate-800 animate-slideUp">
          <div className="p-1 bg-emerald-500 rounded-lg text-white">
            <Check className="h-4 w-4" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider">{toast.text}</span>
        </div>
      )}

    </div>
  );
}
