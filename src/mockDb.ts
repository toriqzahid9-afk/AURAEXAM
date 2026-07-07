import { User, Subject, Schedule, Assignment, Grade, TeacherGrade } from './types';

const INITIAL_USERS: User[] = [
  {
    id: 1,
    name: "DZAKWAN",
    email: "dzakwantoriq@gmail.com",
    role: "student",
    class_level: "12 IPA 1",
    password: "123456"
  },
  {
    id: 2,
    name: "DAELAMI",
    email: "daelami@gmail.com",
    role: "teacher",
    password: "123456"
  },
  {
    id: 3,
    name: "ADMINISTRATOR",
    email: "admin@mail.com",
    role: "admin",
    password: "123456"
  }
];

const INITIAL_SUBJECTS: Subject[] = [
  { id: 1, name: "Ilmu Pengetahuan Alam", class_level: "12 IPA 1", teacher_id: 2, teacher_name: "DAELAMI" },
  { id: 2, name: "Matematika Wajib", class_level: "12 IPA 1", teacher_id: 2, teacher_name: "DAELAMI" },
  { id: 3, name: "Bahasa Inggris", class_level: "12 IPA 1", teacher_id: 2, teacher_name: "DAELAMI" },
  { id: 4, name: "Fisika Terapan", class_level: "12 IPA 1", teacher_id: 2, teacher_name: "DAELAMI" }
];

const INITIAL_SCHEDULES: Schedule[] = [
  {
    id: 1,
    subject_id: 1,
    subject_name: "Ilmu Pengetahuan Alam",
    teacher_name: "DAELAMI",
    class_level: "12 IPA 1",
    day: "Senin",
    time_start: "08:00",
    time_end: "10:00",
    room: "Lab IPA"
  },
  {
    id: 2,
    subject_id: 2,
    subject_name: "Matematika Wajib",
    teacher_name: "DAELAMI",
    class_level: "12 IPA 1",
    day: "Senin",
    time_start: "10:30",
    time_end: "12:00",
    room: "Kelas 12"
  },
  {
    id: 3,
    subject_id: 3,
    subject_name: "Bahasa Inggris",
    teacher_name: "DAELAMI",
    class_level: "12 IPA 1",
    day: "Selasa",
    time_start: "08:00",
    time_end: "09:30",
    room: "Lab Bahasa"
  },
  {
    id: 4,
    subject_id: 4,
    subject_name: "Fisika Terapan",
    teacher_name: "DAELAMI",
    class_level: "12 IPA 1",
    day: "Rabu",
    time_start: "09:00",
    time_end: "11:00",
    room: "Lab Fisika"
  }
];

const INITIAL_ASSIGNMENTS: Assignment[] = [
  { 
    id: 1, 
    title: "Fisika: Makalah Kuantum", 
    subject: "Fisika Terapan", 
    deadline: "Besok, 23:59 WIB", 
    status: "Aktif",
    submissions: []
  },
  { 
    id: 2, 
    title: "Matematika: Kalkulus Dasar", 
    subject: "Matematika Wajib", 
    deadline: "3 Juni 2026", 
    status: "Selesai",
    submissions: [
      {
        id: 1,
        studentId: 1,
        studentName: "DZAKWAN",
        fileOrLink: "https://link-tugas-dzakwan.com",
        submittedAt: "2026-06-01 10:00",
        status: "Selesai",
        grade: 95,
        notes: "Sangat baik"
      }
    ]
  }
];

const INITIAL_STUDENT_GRADES: Grade[] = [
  { subject: "Ilmu Pengetahuan Alam", tugas: 90, kuis: 85, ujian: 90 },
  { subject: "Fisika Terapan", tugas: 88, kuis: 82, ujian: 85 },
  { subject: "Matematika Wajib", tugas: 95, kuis: 90, ujian: 92 },
  { subject: "Bahasa Inggris", tugas: 92, kuis: 88, ujian: 90 }
];

const INITIAL_TEACHER_GRADES: TeacherGrade[] = [
  { id: 1, name: "DZAKWAN", tugas: 90, kuis: 85, ujian: 90 },
  { id: 2, name: "BUDI SANTOSO", tugas: 88, kuis: 82, ujian: 85 },
  { id: 3, name: "LUTHFI HANIF", tugas: 95, kuis: 90, ujian: 92 },
  { id: 4, name: "RIAN HIDAYAT", tugas: 85, kuis: 80, ujian: 88 }
];

const INITIAL_BANK_SOAL_PACKAGES = [
  {
    id: 1,
    title: 'SAS Geografi Kelas 11',
    description: 'Lingkungan Dan Kependudukan',
    subject: 'Geografi',
    grade: 'XI.1',
    isPublic: false,
    totalQuestions: 5,
    questions: [
      {
        id: 1,
        type: 'Pilihan Ganda',
        weight: 5,
        text: 'Salah satu upaya pelestarian lingkungan hidup berdasarkan prinsip pembangunan berkelanjutan adalah...',
        options: {
          A: 'Pemanfaatan sumber daya alam sebesar-besarnya untuk ekspor',
          B: 'Menggunakan teknologi ramah lingkungan dan terbarukan',
          C: 'Melakukan eksploitasi hutan lindung untuk pembukaan lahan baru',
          D: 'Meningkatkan konsumsi energi fosil untuk percepatan industri',
          E: 'Mengabaikan analisis dampak lingkungan demi investasi asing'
        },
        correctAnswer: 'B',
        essayAnswer: ''
      },
      {
        id: 2,
        type: 'Pilihan Ganda',
        weight: 5,
        text: 'Faktor demografi yang secara langsung mempengaruhi pertumbuhan penduduk suatu wilayah adalah...',
        options: {
          A: 'Natalitas, mortalitas, dan migrasi penduduk',
          B: 'Pendidikan, kesehatan, dan pendapatan perkapita',
          C: 'Adat istiadat, kepercayaan, dan budaya lokal',
          D: 'Letak geografis, topografi, dan iklim wilayah',
          E: 'Pembangunan infrastruktur and industrialisasi'
        },
        correctAnswer: 'A',
        essayAnswer: ''
      },
      {
        id: 3,
        type: 'Pilihan Ganda',
        weight: 5,
        text: 'Dampak ledakan penduduk terhadap aspek sosial ekonomi masyarakat yang paling signifikan adalah...',
        options: {
          A: 'Meningkatnya lapangan kerja secara seimbang',
          B: 'Menurunnya angka pengangguran di daerah perkotaan',
          C: 'Meningkatnya tekanan terhadap lahan pertanian dan permukiman kumuh',
          D: 'Terciptanya ketahanan pangan yang merata',
          E: 'Menurunnya angka kriminalitas jalanan'
        },
        correctAnswer: 'C',
        essayAnswer: ''
      },
      {
        id: 4,
        type: 'Pilihan Ganda',
        weight: 5,
        text: 'Kegiatan eksploitasi mineral tambang yang mengabaikan reklamasi pascatambang dapat menyebabkan...',
        options: {
          A: 'Peningkatan kesuburan tanah sekitar tambang',
          B: 'Terbentuknya lubang raksasa beracun dan kerusakan ekosistem',
          C: 'Berkurangnya curah hujan tahunan daerah setempat',
          D: 'Meningkatnya jumlah spesies fauna endemik',
          E: 'Teratasinya bencana banjir bandang secara alami'
        },
        correctAnswer: 'B',
        essayAnswer: ''
      },
      {
        id: 5,
        type: 'Pilihan Ganda',
        weight: 5,
        text: 'Bagaimana peran serta masyarakat dalam mendukung program zero waste di lingkungan sekolah?',
        options: {
          A: 'Membakar semua sampah plastik di halaman belakang',
          B: 'Menggunakan botol minum isi ulang (tumbler) dan memilah sampah',
          C: 'Membuang seluruh jenis sampah ke tempat pembuangan akhir',
          D: 'Menyerahkan urusan sampah sepenuhnya kepada petugas kebersihan',
          E: 'Membeli jajanan instan berbungkus plastik sekali pakai'
        },
        correctAnswer: 'B',
        essayAnswer: ''
      }
    ]
  },
  {
    id: 2,
    title: 'Ujian Tengah Semester Fisika 12',
    description: 'Materi Listrik Statis & Dinamis',
    subject: 'Fisika Terapan',
    grade: '12 IPA 1',
    isPublic: true,
    totalQuestions: 1,
    questions: [
      {
        id: 1,
        type: 'Pilihan Ganda',
        weight: 4,
        text: 'Dua buah muatan listrik yang terpisah pada jarak r mengalami gaya tarik menarik sebesar F. Jika jarak kedua muatan diubah menjadi 2r, maka gayanya menjadi...',
        options: {
          A: '4 F',
          B: '2 F',
          C: '0.5 F',
          D: '0.25 F',
          E: '0.125 F'
        },
        correctAnswer: 'D',
        essayAnswer: ''
      }
    ]
  },
  {
    id: 3,
    title: 'PAT Matematika Wajib Kelas 10',
    description: 'Fungsi Komposisi & Trigonometri Dasar',
    subject: 'Matematika Wajib',
    grade: '12 IPA 1',
    isPublic: false,
    totalQuestions: 1,
    questions: [
      {
        id: 1,
        type: 'Pilihan Ganda',
        weight: 5,
        text: 'Diketahui f(x) = 2x + 3 dan g(x) = x^2 - 1. Rumus fungsi komposisi (g o f)(x) adalah...',
        options: {
          A: '4x^2 + 12x + 8',
          B: '4x^2 + 12x + 9',
          C: '2x^2 + 1',
          D: '2x^2 + 5',
          E: '4x^2 + 6x + 8'
        },
        correctAnswer: 'A',
        essayAnswer: ''
      }
    ]
  }
];

const INITIAL_EXAM_SCHEDULES = [
  { 
    id: 1, 
    name: 'Ujian Akhir Semester Ganjil', 
    subject: 'Fisika Terapan', 
    date: '2026-07-05', 
    time: '08:00 - 10:00', 
    startTime: '2026-07-05T08:00',
    endTime: '2026-07-05T10:00',
    duration: '120 Menit', 
    class: '12 IPA 1', 
    status: 'Tersedia',
    token: 'AQX8YF',
    sync: true,
    packageId: 2
  },
  { 
    id: 2, 
    name: 'Kuis Bab 2 Trigonometri', 
    subject: 'Matematika Wajib', 
    date: '2026-07-06', 
    time: '10:00 - 11:00', 
    startTime: '2026-07-06T10:00',
    endTime: '2026-07-06T11:00',
    duration: '60 Menit', 
    class: '12 IPA 1', 
    status: 'Tersedia',
    token: 'T6Y8UZ',
    sync: true,
    packageId: 3
  }
];

const INITIAL_EXAM_HISTORY = [
  {
    id: 'ex-h01',
    studentId: 1,
    name: 'Ujian Akhir Semester (UAS) Fisika',
    subject: 'Fisika Terapan',
    date: '2026-06-28',
    score: 88,
    status: 'Lulus'
  },
  {
    id: 'ex-h02',
    studentId: 1,
    name: 'Ujian Tengah Semester (UTS) Kimia',
    subject: 'Kimia',
    date: '2026-06-24',
    score: 92,
    status: 'Lulus'
  },
  {
    id: 'ex-h03',
    studentId: 1,
    name: 'Kuis Harian Logika Matematika',
    subject: 'Matematika Wajib',
    date: '2026-06-15',
    score: 85,
    status: 'Lulus'
  }
];

// Helper to check and initialize
function getFromStorage<T>(key: string, initial: T): T {
  const item = localStorage.getItem(key);
  if (!item) {
    localStorage.setItem(key, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(item);
}

function setToStorage<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data));
}

export const mockDb = {
  getUsers: () => {
    const users = getFromStorage<User[]>('aura_users', INITIAL_USERS);
    const filteredUsers = users.filter(u => !u.email.toLowerCase().includes('smasbinabhakti'));
    if (filteredUsers.length !== users.length) {
      setToStorage('aura_users', filteredUsers);
    }
    return filteredUsers;
  },
  setUsers: (users: User[]) => setToStorage<User[]>('aura_users', users),

  getSubjects: () => {
    const subjects = getFromStorage<Subject[]>('aura_subjects', INITIAL_SUBJECTS);
    const users = mockDb.getUsers();
    // Map teacher names
    return subjects.map(s => {
      const teacher = users.find(u => u.id === s.teacher_id);
      return { ...s, teacher_name: teacher ? teacher.name : 'Belum ditentukan' };
    });
  },
  setSubjects: (subjects: Subject[]) => setToStorage<Subject[]>('aura_subjects', subjects),

  getSchedules: () => {
    const schedules = getFromStorage<Schedule[]>('aura_schedules', INITIAL_SCHEDULES);
    const subjects = mockDb.getSubjects();
    return schedules.map(s => {
      const sub = subjects.find(x => x.id === s.subject_id);
      return {
        ...s,
        subject_name: sub ? sub.name : s.subject_name,
        teacher_name: sub ? sub.teacher_name : 'Belum ditentukan',
        class_level: sub ? sub.class_level : s.class_level
      };
    });
  },
  setSchedules: (schedules: Schedule[]) => setToStorage<Schedule[]>('aura_schedules', schedules),

  getAssignments: () => getFromStorage<Assignment[]>('aura_assignments', INITIAL_ASSIGNMENTS),
  setAssignments: (assignments: Assignment[]) => setToStorage<Assignment[]>('aura_assignments', assignments),

  getStudentGrades: () => getFromStorage<Grade[]>('aura_student_grades', INITIAL_STUDENT_GRADES),
  setStudentGrades: (grades: Grade[]) => setToStorage<Grade[]>('aura_student_grades', grades),

  getTeacherGrades: () => getFromStorage<TeacherGrade[]>('aura_teacher_grades', INITIAL_TEACHER_GRADES),
  setTeacherGrades: (grades: TeacherGrade[]) => setToStorage<TeacherGrade[]>('aura_teacher_grades', grades),

  getBankSoalPackages: () => getFromStorage<any[]>('aura_bank_soal_packages', INITIAL_BANK_SOAL_PACKAGES),
  setBankSoalPackages: (packages: any[]) => setToStorage<any[]>('aura_bank_soal_packages', packages),

  getExamSchedules: () => getFromStorage<any[]>('aura_exam_schedules', INITIAL_EXAM_SCHEDULES),
  setExamSchedules: (schedules: any[]) => setToStorage<any[]>('aura_exam_schedules', schedules),

  getExamHistory: () => getFromStorage<any[]>('aura_exam_history', INITIAL_EXAM_HISTORY),
  setExamHistory: (history: any[]) => setToStorage<any[]>('aura_exam_history', history)
};
