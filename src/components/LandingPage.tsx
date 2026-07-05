import { useState, useEffect, useRef } from 'react';
import heroIllustration from '../assets/images/hero_illustration_1783001266486.jpg';
import AppLogo from './AppLogo';
import { 
  GraduationCap, 
  School, 
  ShieldCheck, 
  Clock, 
  Headphones, 
  QrCode, 
  Laptop, 
  BookOpen, 
  Users, 
  Award, 
  TrendingUp, 
  Bolt, 
  Smartphone, 
  MessageCircle,
  Sparkles,
  Play,
  ArrowRight,
  Cloud,
  Instagram,
  Facebook,
  MapPin,
  Mail,
  Cpu,
  Check,
  Circle,
  Menu,
  X
} from 'lucide-react';

interface LandingPageProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

export default function LandingPage({ onLoginClick, onRegisterClick }: LandingPageProps) {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Stats Counters state
  const [siswaCount, setSiswaCount] = useState(0);
  const [guruCount, setGuruCount] = useState(0);
  const [soalCount, setSoalCount] = useState(0);
  const [uptime, setUptime] = useState(0);

  const statsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    let animationFrameId: number;

    // Dynamic stats increment animation
    const animateStats = () => {
      const duration = 1500;
      const startTime = performance.now();

      const updateStats = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = progress * (2 - progress); // easeOutQuad

        setSiswaCount(Math.floor(ease * 1200));
        setGuruCount(Math.floor(ease * 85));
        setSoalCount(Math.floor(ease * 5000));
        setUptime(parseFloat((ease * 99.9).toFixed(1)));

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(updateStats);
        } else {
          setSiswaCount(1200);
          setGuruCount(85);
          setSoalCount(5000);
          setUptime(99.9);
        }
      };

      animationFrameId = requestAnimationFrame(updateStats);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
          }
          animateStats();
        } else {
          if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
          }
          setSiswaCount(0);
          setGuruCount(0);
          setSoalCount(0);
          setUptime(0);
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <div id="view-landing" className="relative w-full overflow-x-hidden bg-white font-sans text-slate-800 antialiased">
      
      {/* ===== HEADER / NAVBAR ===== */}
      <nav 
        id="landing-nav" 
        className={`fixed top-0 left-0 w-full z-50 bg-white border-b border-slate-100 transition-all duration-300 ${isScrolled ? 'shadow-lg py-3' : 'py-5'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 shrink-0 select-none">
            <AppLogo />
            <div className="leading-none">
              <span className="text-base font-black font-display tracking-tight text-slate-900">
                AURA<span className="text-orange-500">EXAM</span>
              </span>
              <span className="block text-[9px] text-slate-400 font-bold tracking-widest uppercase mt-0.5">
                Platform LMS & CBT
              </span>
            </div>
          </a>

          {/* Nav Links */}
          <div className="hidden lg:flex items-center gap-8">
            <a href="#solusi" className="text-xs font-bold text-slate-600 hover:text-orange-600 transition-colors uppercase tracking-wider">Solusi</a>
            <a href="#keunggulan" className="text-xs font-bold text-slate-600 hover:text-orange-600 transition-colors uppercase tracking-wider">Keunggulan</a>
            <a href="#biaya" className="text-xs font-bold text-slate-600 hover:text-orange-600 transition-colors uppercase tracking-wider">Biaya</a>
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <button 
              onClick={onLoginClick}
              className="text-xs font-extrabold text-orange-600 hover:text-orange-700 px-4 py-2.5 rounded-xl hover:bg-orange-50 transition-all"
            >
              Masuk Portal
            </button>
            <button 
              onClick={onRegisterClick}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white text-xs font-extrabold px-4 sm:px-5 py-2.5 rounded-xl shadow-md shadow-orange-500/25 transition-all active:scale-95"
            >
              <School className="h-4 w-4 shrink-0" />
              <span>Daftar Sekolah</span>
            </button>
          </div>

          {/* Hamburger Menu Button Mobile */}
          <div className="flex lg:hidden items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-1 text-slate-700 hover:text-slate-950 transition-all focus:outline-none"
            >
              <Menu className="h-6 w-6" strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Mobile Nav Overlay/Drawer */}
        {isMobileMenuOpen && (
          <div className="fixed inset-x-0 top-0 bg-white z-50 border-b border-slate-150 shadow-xl p-5 sm:p-6 lg:hidden animate-fade-in-down">
            {/* Mobile Header */}
            <div className="flex items-center justify-between mb-8">
              {/* Logo */}
              <a href="#" className="flex items-center gap-2.5 select-none" onClick={() => setIsMobileMenuOpen(false)}>
                <AppLogo />
                <div className="leading-none">
                  <span className="text-base font-black font-display tracking-tight text-slate-900">
                    AURA<span className="text-orange-500">EXAM</span>
                  </span>
                  <span className="block text-[9px] text-slate-400 font-bold tracking-widest uppercase mt-0.5">
                    Platform LMS & CBT
                  </span>
                </div>
              </a>
              {/* Close Button: square outline with X */}
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 border border-slate-800 rounded-lg text-slate-800 hover:bg-slate-50 transition-all"
              >
                <X className="h-5 w-5" strokeWidth={2.5} />
              </button>
            </div>

            {/* Navigation Links */}
            <div className="flex flex-col gap-6 mb-6">
              <a 
                href="#solusi" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-base font-bold text-slate-700 hover:text-orange-600 transition-colors"
              >
                Solusi
              </a>
              <a 
                href="#keunggulan" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-base font-bold text-slate-700 hover:text-orange-600 transition-colors"
              >
                Keunggulan
              </a>
              <a 
                href="#biaya" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-base font-bold text-slate-700 hover:text-orange-600 transition-colors"
              >
                Biaya
              </a>
            </div>

            {/* Separator Line */}
            <div className="border-t border-slate-100 my-5"></div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onLoginClick();
                }}
                className="w-full py-3.5 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-2xl font-black text-sm text-center transition-all cursor-pointer"
              >
                Masuk Portal
              </button>
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onRegisterClick();
                }}
                className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white rounded-2xl font-black text-sm text-center transition-all cursor-pointer shadow-md shadow-orange-500/20"
              >
                Daftar Sekolah
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer to prevent overlap by fixed navbar */}
      <div className="h-20 sm:h-24"></div>

      {/* ===== HERO SECTION ===== */}
      <section className="pt-8 pb-16 md:pt-16 md:pb-24 px-4 sm:px-6 bg-gradient-to-b from-orange-50/40 via-white to-white relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute top-1/3 -right-24 w-80 h-80 bg-red-50 rounded-full blur-3xl opacity-40"></div>
          <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-amber-50 rounded-full blur-3xl opacity-60"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Column: Title and CTA */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-5 rounded-full bg-orange-50 border border-orange-100 text-orange-700 text-[10px] font-bold tracking-wider uppercase">
                <Sparkles className="h-3 w-3 text-orange-500 animate-pulse" />
                <span>Platform LMS & CBT Sekolah Terbaik</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black font-display text-slate-900 leading-[1.1] mb-6 tracking-tight">
                Sekolah Digital<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">Modern Revolusi</span><br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-amber-500">Ujian Anti-Curang</span>
              </h1>
              <p className="text-slate-500 text-sm sm:text-base md:text-lg max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed font-medium">
                Tinggalkan cara lama. Kelola <strong className="text-slate-700 font-bold">Jurnal Guru</strong>, dan <strong className="text-slate-700 font-bold">Ujian CBT berbasis digital dalam satu platform terintegrasi.</strong> Dilengkapi <strong className="text-slate-700 font-bold">proteksi ganda anti-contek, bank soal lengkap, dan rekap nilai otomatis</strong> yang dirancang khusus untuk sekolah Anda.
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <button 
                  onClick={onLoginClick}
                  className="inline-flex items-center gap-2.5 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-extrabold px-7 py-4 rounded-2xl shadow-xl shadow-orange-500/30 hover:-translate-y-0.5 transition-all text-xs active:scale-95"
                >
                  <ArrowRight className="h-4 w-4 shrink-0" />
                  <span>Mulai Gunakan Sekarang</span>
                </button>
                <a 
                  href="#solusi" 
                  className="inline-flex items-center gap-2.5 bg-white border border-slate-200 hover:border-orange-300 text-slate-700 hover:text-orange-600 font-extrabold px-7 py-4 rounded-2xl shadow-sm hover:shadow-md transition-all text-xs"
                >
                  <Play className="h-4 w-4 shrink-0 fill-current" />
                  <span>Lihat Fitur Lengkap</span>
                </a>
              </div>

              {/* Trust Badges */}
              <div className="mt-10 flex flex-wrap items-center gap-5 justify-center lg:justify-start">
                <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold bg-slate-50 border border-slate-100 px-3.5 py-1.5 rounded-xl">
                  <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Data Aman & Terenkripsi</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold bg-slate-50 border border-slate-100 px-3.5 py-1.5 rounded-xl">
                  <Clock className="h-4 w-4 text-orange-500 shrink-0" />
                  <span>Uptime Server 99.9%</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold bg-slate-50 border border-slate-100 px-3.5 py-1.5 rounded-xl">
                  <Headphones className="h-4 w-4 text-indigo-500 shrink-0" />
                  <span>Layanan Support 24/7</span>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Mockup */}
            <div className="relative flex items-center justify-center lg:justify-end">
              <div className="relative w-full max-w-lg lg:max-w-xl">
                {/* Decorative background blobs to blend the image seamlessly */}
                <div className="absolute -top-10 -right-10 w-72 h-72 bg-gradient-to-br from-orange-200/20 to-red-200/20 rounded-full blur-3xl opacity-70"></div>
                <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-gradient-to-tr from-amber-200/20 to-orange-200/20 rounded-full blur-3xl opacity-70"></div>
                
                {/* Floating elements to mimic a network/digital feel, just like the second image */}
                <div className="absolute top-1/4 -left-6 w-3 h-3 rounded-full bg-orange-400 opacity-60 animate-bounce"></div>
                <div className="absolute bottom-1/4 -right-4 w-4 h-4 rounded-full bg-red-400 opacity-50 animate-pulse"></div>
                <div className="absolute -bottom-6 left-1/3 w-2.5 h-2.5 rounded-full bg-amber-400 opacity-60"></div>
                
                {/* Network-like connection lines (using a light SVG background pattern) */}
                <svg className="absolute inset-0 w-full h-full text-slate-100 -z-10 opacity-75" fill="none" viewBox="0 0 400 400">
                  <path d="M50 100 L150 120 L250 80 L350 150" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
                  <path d="M100 250 L180 200 L280 300 L320 220" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
                  <circle cx="50" cy="100" r="3" fill="#f05a22" opacity="0.3" />
                  <circle cx="150" cy="120" r="4" fill="#f05a22" opacity="0.3" />
                  <circle cx="250" cy="80" r="3" fill="#f05a22" opacity="0.3" />
                  <circle cx="350" cy="150" r="4" fill="#f05a22" opacity="0.3" />
                  <circle cx="100" cy="250" r="4" fill="#f05a22" opacity="0.3" />
                  <circle cx="180" cy="200" r="3" fill="#f05a22" opacity="0.3" />
                  <circle cx="280" cy="300" r="4" fill="#f05a22" opacity="0.3" />
                  <circle cx="320" cy="220" r="3" fill="#f05a22" opacity="0.3" />
                </svg>

                {/* Main Illustration (rendered directly to blend seamlessly into the white page background, no border, no white box card container) */}
                <div className="relative group select-none transition-transform duration-500 hover:scale-[1.02]">
                  <img 
                    src={heroIllustration} 
                    alt="AuraExam Digital School Illustration" 
                    className="w-full h-auto object-contain mix-blend-multiply"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ===== STATS STRIP ===== */}
      <section ref={statsRef} className="py-10 border-y border-slate-100 bg-slate-50/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-black text-orange-500 mb-1 font-display">{formatNumber(siswaCount)}+</div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Siswa Aktif Terdaftar</p>
            </div>
            <div>
              <div className="text-3xl font-black text-orange-500 mb-1 font-display">{guruCount}+</div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Guru Pengampu</p>
            </div>
            <div>
              <div className="text-3xl font-black text-orange-500 mb-1 font-display">{formatNumber(soalCount)}+</div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Soal CBT Tersedia</p>
            </div>
            <div>
              <div className="text-3xl font-black text-orange-500 mb-1 font-display">{uptime}%</div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Uptime Server</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SOLUSI: 6 INDIVIDUAL COLORED HOVER CARDS ===== */}
      <section id="solusi" className="py-20 md:py-28 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 mb-3 rounded-full bg-orange-50 text-orange-600 text-[10px] font-bold tracking-widest uppercase border border-orange-100">
              Solusi Lengkap
            </span>
            <h2 className="text-3xl md:text-4xl font-black font-display text-slate-900 mb-4 tracking-tight leading-tight">
              Satu Platform, Semua Solusi<br className="hidden md:block" />Manajemen Sekolah
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
              Tidak perlu menginstall banyak aplikasi terpisah. AuraExam menghadirkan 6 modul terintegrasi yang saling terhubung otomatis untuk kebutuhan akademik sekolah Anda.
            </p>
          </div>

          <div id="features-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Module 1: Proteksi Anti-Curang (Orange) */}
            <div className="card-item card-item--orange">
              <div className="card-item-icon">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="card-item-title">Proteksi Anti-Curang</h3>
              <p className="card-item-desc">
                Siswa terkunci di halaman ujian. Mendeteksi pindah tab, split screen, dan menonaktifkan screenshot di perangkat tertentu.
              </p>
              <ul className="card-item-list">
                <li><Award className="h-4 w-4 check-icon shrink-0" /> <span>Kunci Halaman Fullscreen</span></li>
                <li><Award className="h-4 w-4 check-icon shrink-0" /> <span>Deteksi Tab & Split Screen</span></li>
                <li><Award className="h-4 w-4 check-icon shrink-0" /> <span>Blokir Screenshot Perangkat</span></li>
              </ul>
            </div>

            {/* Module 2: Ujian Online (CBT) (Orange) */}
            <div className="card-item card-item--orange">
              <div className="card-item-icon">
                <Laptop className="h-6 w-6" />
              </div>
              <h3 className="card-item-title">Ujian Online (CBT)</h3>
              <p className="card-item-desc">
                Pelaksanaan Ujian Tengah Semester (UTS) dan Ujian Akhir Semester (UAS) yang praktis dan hemat kertas.
              </p>
              <ul className="card-item-list">
                <li><Award className="h-4 w-4 check-icon shrink-0" /> <span>Ujian Tengah & Akhir Semester</span></li>
                <li><Award className="h-4 w-4 check-icon shrink-0" /> <span>Bank Soal & Pengacakan Otomatis</span></li>
                <li><Award className="h-4 w-4 check-icon shrink-0" /> <span>Koreksi Instan & Rekap Otomatis</span></li>
              </ul>
            </div>

            {/* Module 3: AI Question Generator (Orange) */}
            <div className="card-item card-item--orange">
              <div className="card-item-icon">
                <Cpu className="h-6 w-6" />
              </div>
              <h3 className="card-item-title">AI Question Generator</h3>
              <p className="card-item-desc">
                Bikin soal 10x lebih cepat. Cukup masukkan topik atau materi, AI akan membuatkan soal pilihan ganda lengkap dengan kunci jawaban.
              </p>
              <ul className="card-item-list">
                <li><Award className="h-4 w-4 check-icon shrink-0" /> <span>Pembuatan Soal Instan</span></li>
                <li><Award className="h-4 w-4 check-icon shrink-0" /> <span>Berbasis Topik & Materi</span></li>
                <li><Award className="h-4 w-4 check-icon shrink-0" /> <span>Kunci Jawaban Otomatis</span></li>
              </ul>
            </div>

            {/* Module 4: Jurnal Mengajar Digital (Orange) */}
            <div className="card-item card-item--orange">
              <div className="card-item-icon">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="card-item-title">Jurnal Mengajar Digital</h3>
              <p className="card-item-desc">
                Guru mencatat materi, kompetensi dasar, dan kehadiran kelas secara digital. Kepala Sekolah memantau progres kapan saja.
              </p>
              <ul className="card-item-list">
                <li><Award className="h-4 w-4 check-icon shrink-0" /> <span>Pencatatan KBM Harian</span></li>
                <li><Award className="h-4 w-4 check-icon shrink-0" /> <span>Monitoring Progres Belajar</span></li>
                <li><Award className="h-4 w-4 check-icon shrink-0" /> <span>Export Jurnal ke format PDF</span></li>
              </ul>
            </div>

            {/* Module 5: Rekap Nilai & Rapor Digital (Orange) */}
            <div className="card-item card-item--orange">
              <div className="card-item-icon">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="card-item-title">Rekap Nilai & Rapor</h3>
              <p className="card-item-desc">
                Nilai tugas, kuis, dan ujian terekap otomatis dalam sistem. Rapor digital terbuat dalam hitungan detik dan siap diunduh PDF.
              </p>
              <ul className="card-item-list">
                <li><Award className="h-4 w-4 check-icon shrink-0" /> <span>Kalkulasi Nilai Otomatis</span></li>
                <li><Award className="h-4 w-4 check-icon shrink-0" /> <span>Analisis Capaian per Mapel</span></li>
                <li><Award className="h-4 w-4 check-icon shrink-0" /> <span>Rapor PDF Siap Cetak Resmi</span></li>
              </ul>
            </div>

            {/* Module 6: Monitoring Real-Time (Orange) */}
            <div className="card-item card-item--orange">
              <div className="card-item-icon">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="card-item-title">Monitoring Real-Time</h3>
              <p className="card-item-desc">
                Kepala Sekolah memantau seluruh aktivitas akademik secara real-time: kehadiran kelas, proses ujian, dan progres kurikulum.
              </p>
              <ul className="card-item-list">
                <li><Award className="h-4 w-4 check-icon shrink-0" /> <span>Dashboard Eksekutif Kepala Sekolah</span></li>
                <li><Award className="h-4 w-4 check-icon shrink-0" /> <span>Notifikasi Real-Time Sistem</span></li>
                <li><Award className="h-4 w-4 check-icon shrink-0" /> <span>Laporan Statistik Mingguan</span></li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* ===== KEUNGGULAN ===== */}
      <section id="keunggulan" className="py-20 md:py-28 px-4 sm:px-6 bg-[#f8fafc] border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            
            {/* Left Column: Title & Vertical Features Stack */}
            <div className="flex flex-col gap-6">
              <div>
                <span className="inline-block px-3 py-1.5 mb-3 rounded-full bg-orange-50 text-[#f05a22] text-[10px] sm:text-[11px] font-extrabold tracking-widest uppercase border border-orange-100 shadow-sm">
                  Satu Platform Terpadu
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-display text-slate-900 mb-4 leading-tight tracking-tight">
                  Mengapa AuraExam<br />Lebih dari Sekadar LMS?
                </h2>
                <p className="text-slate-500 leading-relaxed text-sm sm:text-base md:text-[15px]">
                  Tidak seperti aplikasi biasa yang hanya mengurus satu hal, AuraExam menghubungkan semua peran sekolah dalam satu ekosistem digital yang saling terkoneksi secara otomatis.
                </p>
              </div>

              {/* Compact features sub-container to match the right side perfectly */}
              <div className="flex flex-col gap-4">
                {/* Feature 1: Sinkronisasi Data Instan */}
                <div 
                  className={`group flex items-start gap-5 p-5.5 rounded-2xl transition-all duration-300 cursor-pointer select-none border ${
                    activeFeature === 0 
                      ? 'bg-[#f05a22] border-transparent shadow-lg shadow-orange-500/25' 
                      : 'bg-white border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200'
                  }`}
                  onMouseEnter={() => setActiveFeature(0)}
                  onClick={() => setActiveFeature(0)}
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                    activeFeature === 0 
                      ? 'bg-white text-[#f05a22] shadow-md' 
                      : 'bg-[#f05a22] text-white shadow-md shadow-orange-500/10'
                  }`}>
                    <Bolt className="h-5.5 w-5.5" />
                  </div>
                  <div>
                    <h4 className={`font-extrabold text-sm sm:text-base mb-1 transition-colors duration-300 ${
                      activeFeature === 0 ? 'text-white' : 'text-slate-900'
                    }`}>
                      Sinkronisasi Data Instan
                    </h4>
                    <p className={`text-[11px] sm:text-xs md:text-[13px] leading-relaxed transition-colors duration-300 ${
                      activeFeature === 0 ? 'text-orange-100' : 'text-slate-500'
                    }`}>
                      Setiap perubahan data (nilai, absensi, jadwal) langsung terlihat oleh semua pihak terkait secara real-time.
                    </p>
                  </div>
                </div>

                {/* Feature 2: Portal Khusus Multi-Peran */}
                <div 
                  className={`group flex items-start gap-5 p-5.5 rounded-2xl transition-all duration-300 cursor-pointer select-none border ${
                    activeFeature === 1 
                      ? 'bg-[#f05a22] border-transparent shadow-lg shadow-orange-500/25' 
                      : 'bg-white border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200'
                  }`}
                  onMouseEnter={() => setActiveFeature(1)}
                  onClick={() => setActiveFeature(1)}
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                    activeFeature === 1 
                      ? 'bg-white text-[#f05a22] shadow-md' 
                      : 'bg-[#f05a22] text-white shadow-md shadow-orange-500/10'
                  }`}>
                    <Users className="h-5.5 w-5.5" />
                  </div>
                  <div>
                    <h4 className={`font-extrabold text-sm sm:text-base mb-1 transition-colors duration-300 ${
                      activeFeature === 1 ? 'text-white' : 'text-slate-900'
                    }`}>
                      Portal Khusus Multi-Peran
                    </h4>
                    <p className={`text-[11px] sm:text-xs md:text-[13px] leading-relaxed transition-colors duration-300 ${
                      activeFeature === 1 ? 'text-orange-100' : 'text-slate-500'
                    }`}>
                      Siswa, Guru, dan Admin masing-masing memiliki tampilan dan akses yang berbeda sesuai kebutuhannya.
                    </p>
                  </div>
                </div>

                {/* Feature 3: Akses dari Semua Perangkat */}
                <div 
                  className={`group flex items-start gap-5 p-5.5 rounded-2xl transition-all duration-300 cursor-pointer select-none border ${
                    activeFeature === 2 
                      ? 'bg-[#f05a22] border-transparent shadow-lg shadow-orange-500/25' 
                      : 'bg-white border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200'
                  }`}
                  onMouseEnter={() => setActiveFeature(2)}
                  onClick={() => setActiveFeature(2)}
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                    activeFeature === 2 
                      ? 'bg-white text-[#f05a22] shadow-md' 
                      : 'bg-[#f05a22] text-white shadow-md shadow-orange-500/10'
                  }`}>
                    <Smartphone className="h-5.5 w-5.5" />
                  </div>
                  <div>
                    <h4 className={`font-extrabold text-sm sm:text-base mb-1 transition-colors duration-300 ${
                      activeFeature === 2 ? 'text-white' : 'text-slate-900'
                    }`}>
                      Akses dari Semua Perangkat
                    </h4>
                    <p className={`text-[11px] sm:text-xs md:text-[13px] leading-relaxed transition-colors duration-300 ${
                      activeFeature === 2 ? 'text-orange-100' : 'text-slate-500'
                    }`}>
                      Tampilan yang responsif dan optimal di smartphone, tablet, maupun komputer tanpa perlu instal aplikasi.
                    </p>
                  </div>
                </div>

                {/* Feature 4: Keamanan Tingkat Tinggi */}
                <div 
                  className={`group flex items-start gap-5 p-5.5 rounded-2xl transition-all duration-300 cursor-pointer select-none border ${
                    activeFeature === 3 
                      ? 'bg-[#f05a22] border-transparent shadow-lg shadow-orange-500/25' 
                      : 'bg-white border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200'
                  }`}
                  onMouseEnter={() => setActiveFeature(3)}
                  onClick={() => setActiveFeature(3)}
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                    activeFeature === 3 
                      ? 'bg-white text-[#f05a22] shadow-md' 
                      : 'bg-[#f05a22] text-white shadow-md shadow-orange-500/10'
                  }`}>
                    <ShieldCheck className="h-5.5 w-5.5" />
                  </div>
                  <div>
                    <h4 className={`font-extrabold text-sm sm:text-base mb-1 transition-colors duration-300 ${
                      activeFeature === 3 ? 'text-white' : 'text-slate-900'
                    }`}>
                      Keamanan Tingkat Tinggi
                    </h4>
                    <p className={`text-[11px] sm:text-xs md:text-[13px] leading-relaxed transition-colors duration-300 ${
                      activeFeature === 3 ? 'text-orange-100' : 'text-slate-500'
                    }`}>
                      Enkripsi SSL, autentikasi berlapis, dan perlindungan data siswa sesuai standar keamanan digital pendidikan.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Role Visualizer and Performance Badges */}
            <div className="relative flex flex-col justify-center gap-6 self-stretch h-full pt-10 lg:pt-0 max-w-[520px] mx-auto w-full">
              {/* Platform Terintegrasi Orange Badge */}
              <div className="flex justify-center">
                <div className="bg-[#f05a22] text-white rounded-[2rem] px-10 py-7.5 shadow-xl w-full max-w-[320px] text-center flex flex-col items-center justify-center transition-all duration-300">
                  <h3 className="text-3xl font-black mb-1 font-display tracking-tight">AuraExam</h3>
                  <p className="text-[11px] font-extrabold tracking-widest uppercase mb-4 text-orange-100">
                    Platform Terintegrasi
                  </p>
                  <div className="flex justify-center gap-2">
                    <span className="text-[10px] bg-white/20 text-white px-3.5 py-1 rounded-full font-extrabold uppercase">LMS</span>
                    <span className="text-[10px] bg-white/20 text-white px-3.5 py-1 rounded-full font-extrabold uppercase">CBT</span>
                    <span className="text-[10px] bg-white/20 text-white px-3.5 py-1 rounded-full font-extrabold uppercase">Absensi</span>
                  </div>
                </div>
              </div>

              {/* Middle Grid: 3 Role Cards */}
              <div className="grid grid-cols-3 gap-4">
                {/* Siswa Card */}
                <div className="bg-white border border-slate-100 rounded-3xl p-5 text-center shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-[#f05a22] text-white flex items-center justify-center shadow-md shadow-orange-500/20">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <h5 className="font-extrabold text-slate-800 text-sm mb-1">Siswa</h5>
                  <p className="text-slate-400 text-[10px] leading-tight">Absen, ujian & lihat nilai</p>
                </div>

                {/* Guru Card */}
                <div className="bg-white border border-slate-100 rounded-3xl p-5 text-center shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-[#f05a22] text-white flex items-center justify-center shadow-md shadow-orange-500/20">
                    <Laptop className="h-5 w-5" />
                  </div>
                  <h5 className="font-extrabold text-slate-800 text-sm mb-1">Guru</h5>
                  <p className="text-slate-400 text-[10px] leading-tight">Buat soal, nilai & jurnal</p>
                </div>

                {/* Admin Card */}
                <div className="bg-white border border-slate-100 rounded-3xl p-5 text-center shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-[#f05a22] text-white flex items-center justify-center shadow-md shadow-orange-500/20">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <h5 className="font-extrabold text-slate-800 text-sm mb-1">Admin</h5>
                  <p className="text-slate-400 text-[10px] leading-tight">Kelola akun & laporan</p>
                </div>
              </div>

              {/* Bottom Grid: 2 Performance Cards */}
              <div className="grid grid-cols-2 gap-4">
                {/* Performa Card */}
                <div className="bg-white border border-slate-100 rounded-2xl p-4 sm:p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#f05a22] flex items-center justify-center shrink-0">
                    <Bolt className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold tracking-wider uppercase">Performa</p>
                    <p className="text-xs sm:text-sm font-black text-slate-800 mt-0.5">Super Cepat</p>
                  </div>
                </div>

                {/* Cloud Storage Card */}
                <div className="bg-white border border-slate-100 rounded-2xl p-4 sm:p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#f05a22] flex items-center justify-center shrink-0">
                    <Cloud className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold tracking-wider uppercase">Cloud Storage</p>
                    <p className="text-xs sm:text-sm font-black text-slate-800 mt-0.5">Auto Backup</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ===== BIAYA / PRICING SECTION ===== */}
      <section id="biaya" className="pricing-orange-section py-20 md:py-28 px-4 sm:px-6 relative overflow-hidden text-white">
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-white blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-orange-300 blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 mb-3 rounded-full bg-white/15 text-white text-[10px] font-bold tracking-widest uppercase border border-white/20">
              Biaya Layanan
            </span>
            <h2 className="text-3xl md:text-4xl font-black font-display text-white mb-4 tracking-tight leading-tight">
              Investasi Pendidikan Terbaik
            </h2>
            <p className="text-orange-100 max-w-2xl mx-auto mb-8 text-xs sm:text-sm leading-relaxed">
              Harga transparan, tanpa biaya tambahan tersembunyi. Pilih paket yang sesuai dengan jumlah siswa sekolah Anda. Hemat lebih banyak dengan billing tahunan.
            </p>

            {/* Billing Toggle */}
            <div className="inline-flex items-center gap-2 bg-black/15 border border-white/10 rounded-2xl p-1.5 shadow-inner select-none">
              <button 
                onClick={() => setBillingPeriod('monthly')}
                className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all ${billingPeriod === 'monthly' ? 'bg-white text-orange-600 shadow-md' : 'text-white/80 hover:text-white'}`}
              >
                Bulanan
              </button>
              <button 
                onClick={() => setBillingPeriod('yearly')}
                className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all ${billingPeriod === 'yearly' ? 'bg-white text-orange-600 shadow-md' : 'text-white/80 hover:text-white'}`}
              >
                Tahunan <span className="ml-1 text-[9px] bg-red-500 text-white px-2 py-0.5 rounded-full font-black">Hemat 20%</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">
            
            {/* Plan 1: Rintisan */}
            <div className="pricing-card-orange p-7 flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-black text-orange-200 uppercase tracking-widest mb-3">Paket Rintisan</div>
                <div className="mb-1">
                  <span className="text-3xl font-black font-display">
                    {billingPeriod === 'monthly' ? 'Rp 500rb' : 'Rp 4.8jt'}
                  </span>
                  <span className="text-xs text-orange-200 font-bold ml-1">
                    {billingPeriod === 'monthly' ? '/ Bulan' : '/ Tahun'}
                  </span>
                </div>
                <p className="text-xs text-orange-100 mb-6 leading-relaxed">Pilihan tepat untuk digitalisasi awal kelas kecil.</p>
                <div className="h-px bg-white/10 mb-6"></div>
                <ul className="space-y-3 mb-7 text-xs text-orange-50 font-medium">
                  <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-orange-200 shrink-0" /> <span>Max 50 Siswa & 5 Guru</span></li>
                  <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-orange-200 shrink-0" /> <span>Modul Ujian Online (CBT)</span></li>
                  <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-orange-200 shrink-0" /> <span>CBT Engine Standard (50 Soal)</span></li>
                  <li className="flex items-center gap-2 text-white/45 line-through"><Circle className="h-2 w-2 mx-0.5 text-white/20 shrink-0" /> <span>Jurnal Mengajar Digital</span></li>
                  <li className="flex items-center gap-2 text-white/45 line-through"><Circle className="h-2 w-2 mx-0.5 text-white/20 shrink-0" /> <span>Rapor Digital PDF</span></li>
                </ul>
              </div>
              <a 
                href="https://wa.me/6285890588706?text=Halo%20Admin%20AuraExam%2C%20saya%20tertarik%20dengan%20Paket%20Rintisan."
                target="_blank" 
                rel="noreferrer"
                className="w-full py-3 rounded-xl border border-white/20 text-white font-extrabold text-xs text-center hover:bg-white hover:text-orange-600 transition-all active:scale-95 shadow-md"
              >
                Pilih Paket Rintisan
              </a>
            </div>

            {/* Plan 2: Standar (Featured) */}
            <div className="pricing-card-orange featured p-7 flex flex-col justify-between relative">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-yellow-400 text-slate-900 text-[9px] font-black uppercase px-4 py-1.5 rounded-full shadow-md featured-badge tracking-wider">
                Paling Populer
              </div>
              <div>
                <div className="text-[10px] font-black text-orange-100 uppercase tracking-widest mb-3 mt-1">Paket Standar</div>
                <div className="mb-1">
                  <span className="text-3xl font-black font-display text-white">
                    {billingPeriod === 'monthly' ? 'Rp 1.5jt' : 'Rp 14.4jt'}
                  </span>
                  <span className="text-xs text-orange-100 font-bold ml-1">
                    {billingPeriod === 'monthly' ? '/ Bulan' : '/ Tahun'}
                  </span>
                </div>
                <p className="text-xs text-orange-100 mb-6 leading-relaxed">Solusi lengkap untuk 1 sekolah dengan fitur penuh.</p>
                <div className="h-px bg-white/15 mb-6"></div>
                <ul className="space-y-3 mb-7 text-xs text-white font-medium">
                  <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-yellow-300 shrink-0" /> <span>Max 150 Siswa & Guru Unlimited</span></li>
                  <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-yellow-300 shrink-0" /> <span>Semua 6 Modul Aktif Penuh</span></li>
                  <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-yellow-300 shrink-0" /> <span>CBT Anti-Cheat Ganda & Deteksi Tab</span></li>
                  <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-yellow-300 shrink-0" /> <span>Rapor PDF Otomatis</span></li>
                  <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-yellow-300 shrink-0" /> <span>Layanan Support Prioritas</span></li>
                </ul>
              </div>
              <a 
                href="https://wa.me/6285890588706?text=Halo%20Admin%20AuraExam%2C%20saya%20tertarik%20dengan%20Paket%20Standar."
                target="_blank" 
                rel="noreferrer"
                className="w-full py-3.5 rounded-xl bg-white text-orange-600 font-extrabold text-xs text-center hover:bg-orange-50 transition-all shadow-lg active:scale-95"
              >
                Aktifkan Sekarang
              </a>
            </div>

            {/* Plan 3: Besar */}
            <div className="pricing-card-orange p-7 flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-black text-orange-200 uppercase tracking-widest mb-3">Paket Besar</div>
                <div className="mb-1">
                  <span className="text-3xl font-black font-display">
                    {billingPeriod === 'monthly' ? 'Rp 3jt' : 'Rp 28.8jt'}
                  </span>
                  <span className="text-xs text-orange-200 font-bold ml-1">
                    {billingPeriod === 'monthly' ? '/ Bulan' : '/ Tahun'}
                  </span>
                </div>
                <p className="text-xs text-orange-100 mb-6 leading-relaxed">Dioptimalkan untuk sekolah besar berkapasitas tinggi.</p>
                <div className="h-px bg-white/10 mb-6"></div>
                <ul className="space-y-3 mb-7 text-xs text-orange-50 font-medium">
                  <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-orange-200 shrink-0" /> <span>Max 300 Siswa & Guru Unlimited</span></li>
                  <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-orange-200 shrink-0" /> <span>Semua Fitur Paket Standar</span></li>
                  <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-orange-200 shrink-0" /> <span>Analisis AI & Dashboard Statistik</span></li>
                  <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-orange-200 shrink-0" /> <span>Cloud Storage File 50 GB</span></li>
                  <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-orange-200 shrink-0" /> <span>SLA Server 99.9% Dijamin</span></li>
                </ul>
              </div>
              <a 
                href="https://wa.me/6285890588706?text=Halo%20Admin%20AuraExam%2C%20saya%20tertarik%20dengan%20Paket%20Besar."
                target="_blank" 
                rel="noreferrer"
                className="w-full py-3 rounded-xl border border-white/20 text-white font-extrabold text-xs text-center hover:bg-white hover:text-orange-600 transition-all active:scale-95 shadow-md"
              >
                Pilih Paket Besar
              </a>
            </div>

            {/* Plan 4: Enterprise */}
            <div className="pricing-card-orange p-7 flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-black text-orange-200 uppercase tracking-widest mb-3">Enterprise</div>
                <div className="mb-1">
                  <span className="text-3xl font-black font-display">Custom</span>
                </div>
                <p className="text-xs text-orange-100 mb-6 leading-relaxed">Kustomisasi khusus untuk yayasan besar atau dinas.</p>
                <div className="h-px bg-white/10 mb-6"></div>
                <ul className="space-y-3 mb-7 text-xs text-orange-50 font-medium">
                  <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-orange-200 shrink-0" /> <span>Multi-Sekolah / Satu Yayasan</span></li>
                  <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-orange-200 shrink-0" /> <span>Integrasi Dapodik & Database Lokal</span></li>
                  <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-orange-200 shrink-0" /> <span>Instalasi Server On-Premise</span></li>
                  <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-orange-200 shrink-0" /> <span>Tim Technical Account Dedicated</span></li>
                  <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-orange-200 shrink-0" /> <span>Kontrak Hukum & SLA Resmi</span></li>
                </ul>
              </div>
              <a 
                href="https://wa.me/6285890588706?text=Halo%20Admin%20AuraExam%2C%20saya%20tertarik%20dengan%20Paket%20Enterprise."
                target="_blank" 
                rel="noreferrer"
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs text-center transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-lg border border-emerald-400/20"
              >
                <MessageCircle className="h-4 w-4 fill-current shrink-0" />
                <span>Hubungi Sales</span>
              </a>
            </div>

          </div>

          <p className="text-center text-xs text-orange-200 mt-16 font-medium">
            Semua paket dapat diuji coba <strong className="text-white font-extrabold underline decoration-white/30 decoration-2">gratis 30 hari</strong> tanpa kartu kredit · Batalkan kapan saja.
          </p>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-20 md:py-28 px-4 sm:px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 rounded-[2.5rem] p-10 md:p-16 relative overflow-hidden shadow-2xl shadow-orange-500/20">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
            
            <div className="relative z-10">
              <div className="text-5xl mb-5">🚀</div>
              <h2 className="text-3xl md:text-4xl font-black font-display text-white mb-4 leading-tight tracking-tight">
                Siap Memajukan<br />Sekolah Anda?
              </h2>
              <p className="text-orange-100 text-sm sm:text-base md:text-lg mb-10 max-w-xl mx-auto leading-relaxed">
                Bergabunglah dengan ratusan sekolah yang telah merasakan kemudahan sistem digitalisasi modern bersama AuraExam.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <button 
                  onClick={onLoginClick}
                  className="inline-flex items-center gap-2 bg-white text-orange-600 font-extrabold px-8 py-4 rounded-2xl shadow-xl hover:bg-orange-50 hover:scale-[1.01] transition-all text-xs active:scale-95"
                >
                  <ArrowRight className="h-4 w-4 shrink-0" />
                  <span>Mulai Sekarang — Gratis!</span>
                </button>
                <a 
                  href="https://wa.me/6285890588706" 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-2.5 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-extrabold px-8 py-4 rounded-2xl transition-all text-xs shadow-md"
                >
                  <MessageCircle className="h-4 w-4 fill-current shrink-0" />
                  <span>Chat via WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-slate-950 text-slate-400 py-16 px-4 sm:px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
            
            {/* Brand column */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2.5 mb-5">
                <AppLogo className="h-9 w-9" />
                <div>
                  <span className="text-base font-black font-display tracking-tight text-white">
                    AURA<span className="text-orange-400">EXAM</span>
                  </span>
                  <span className="block text-[8px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">
                    Platform LMS & CBT
                  </span>
                </div>
              </div>
              <p className="text-xs leading-relaxed text-slate-500 mb-6">
                Platform LMS & CBT terlengkap untuk digitalisasi kegiatan belajar mengajar sekolah menengah kejuruan.
              </p>
              {/* Social Media Icons */}
              <div className="flex gap-3">
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-9 h-9 rounded-xl bg-[#0b1329] border border-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center transition-all duration-300"
                >
                  <Instagram className="h-4.5 w-4.5" />
                </a>
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-9 h-9 rounded-xl bg-[#0b1329] border border-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center transition-all duration-300"
                >
                  <Facebook className="h-4.5 w-4.5" />
                </a>
                <a 
                  href="https://wa.me/6285890588706" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-9 h-9 rounded-xl bg-[#0b1329] border border-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center transition-all duration-300"
                >
                  <MessageCircle className="h-4.5 w-4.5" />
                </a>
              </div>
            </div>

            {/* Platform links */}
            <div>
              <h5 className="text-white font-extrabold text-xs uppercase tracking-widest mb-4">PLATFORM</h5>
              <ul className="space-y-3 text-xs">
                <li><a href="#solusi" className="hover:text-orange-400 transition-colors">Ujian Online (CBT)</a></li>
                <li><a href="#solusi" className="hover:text-orange-400 transition-colors">Ujian CBT Online</a></li>
                <li><a href="#solusi" className="hover:text-orange-400 transition-colors">Jurnal Mengajar</a></li>
                <li><a href="#solusi" className="hover:text-orange-400 transition-colors">AI Question Generator</a></li>
                <li><a href="#solusi" className="hover:text-orange-400 transition-colors">Rekap Nilai & Rapor</a></li>
              </ul>
            </div>

            {/* Information links */}
            <div>
              <h5 className="text-white font-extrabold text-xs uppercase tracking-widest mb-4">INFORMASI</h5>
              <ul className="space-y-3 text-xs">
                <li><a href="#keunggulan" className="hover:text-orange-400 transition-colors">Keunggulan</a></li>
                <li><a href="#biaya" className="hover:text-orange-400 transition-colors">Paket Harga</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Unduh Brosur</a></li>
              </ul>
            </div>

            {/* Contact details */}
            <div>
              <h5 className="text-white font-extrabold text-xs uppercase tracking-widest mb-4">KONTAK KAMI</h5>
              <ul className="space-y-3 text-xs">
                <li className="flex items-center gap-3 text-slate-400">
                  <MapPin className="h-4 w-4 text-orange-500 shrink-0" />
                  <span>Tanggerang, Banten</span>
                </li>
                <li className="flex items-center gap-3 text-slate-400">
                  <MessageCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                  <a href="https://wa.me/6285890588706" target="_blank" rel="noreferrer" className="hover:text-orange-400 transition-colors font-medium">
                    +62 858-9058-8706
                  </a>
                </li>
                <li className="flex items-center gap-3 text-slate-400">
                  <Mail className="h-4 w-4 text-orange-500 shrink-0" />
                  <a href="mailto:info@auraexam.id" className="hover:text-orange-400 transition-colors">
                    info@auraexam.id
                  </a>
                </li>
              </ul>
            </div>

          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-600">
            <p>© 2026 AuraExam. Hak cipta dilindungi.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-slate-400 transition-colors">Kebijakan Privasi</a>
              <a href="#" className="hover:text-slate-400 transition-colors">Syarat Layanan</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
