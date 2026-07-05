import AppLogo from './AppLogo';
import { 
  ArrowLeft, 
  CheckCircle2, 
  MessageSquare,
  School
} from 'lucide-react';

interface RegisterScreenProps {
  onBackToLanding: () => void;
}

export default function RegisterScreen({ onBackToLanding }: RegisterScreenProps) {
  return (
    <div id="view-register" className="fixed inset-0 z-50 overflow-y-auto bg-[#020617] text-white w-full font-sans flex flex-col items-center justify-start sm:justify-center p-4 md:p-6 select-none">
      {/* Mesh Gradient Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute top-[20%] right-[5%] w-[30%] h-[30%] bg-indigo-600/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[35%] h-[35%] bg-blue-500/10 rounded-full blur-[110px]"></div>
      </div>

      <div className="w-full max-w-lg md:max-w-3xl relative z-10 my-4 sm:my-8 animate-scaleUp">
        
        {/* Upper Navigation & Close Row */}
        <div className="flex items-center justify-between mb-4 px-1">
          <button 
            onClick={onBackToLanding}
            className="flex items-center gap-2 text-slate-400 hover:text-white group transition-colors text-xs sm:text-sm font-extrabold uppercase tracking-wider cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>Kembali ke Beranda</span>
          </button>
        </div>

        {/* Combined Unified Card */}
        <div className="bg-slate-900/95 backdrop-blur-2xl border border-slate-800 rounded-3xl overflow-hidden shadow-2xl shadow-orange-500/5">
          {/* Header Section with Gradient */}
          <div className="bg-gradient-to-br from-[#f05a22] to-red-600 p-6 sm:p-8 md:p-10 text-center relative overflow-hidden border-b border-orange-400/10">
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
            <div className="relative z-10">
              <AppLogo className="h-14 w-14 mx-auto mb-4" />
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black font-display mb-1.5 tracking-tight">
                Daftarkan Sekolah Anda
              </h1>
              <p className="text-orange-100 text-[11px] sm:text-xs md:text-sm font-semibold leading-relaxed max-w-md mx-auto">
                Bergabunglah dengan ratusan sekolah digital terkemuka lainnya di Indonesia.
              </p>
            </div>
          </div>

          {/* Body Section */}
          <div className="p-6 sm:p-8 md:p-10">
            {/* Process Info */}
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-xs sm:text-sm md:text-base font-extrabold font-display text-white mb-2 uppercase tracking-wider">
                Proses Pendaftaran Cepat & Aman
              </h2>
              <p className="text-slate-400 text-[11px] sm:text-xs md:text-sm leading-relaxed max-w-xl mx-auto font-medium">
                Untuk menjaga tingkat keamanan dan keaslian data sekolah, pembuatan akun diverifikasi langsung oleh tim kami secara berkala dalam waktu 1x24 jam.
              </p>
            </div>

            {/* Benefits & Requirements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 mb-6 sm:mb-8">
              {/* Benefits list */}
              <div className="bg-slate-950/40 border border-slate-800/40 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <h3 className="text-[10px] md:text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-4">
                    Yang Anda Dapatkan:
                  </h3>
                  <ul className="space-y-3.5">
                    <li className="flex items-center gap-3">
                      <div className="h-6 w-6 rounded-full bg-emerald-500/15 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      </div>
                      <span className="text-slate-300 text-xs font-semibold">Akun Super-Admin Sekolah</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="h-6 w-6 rounded-full bg-emerald-500/15 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      </div>
                      <span className="text-slate-300 text-xs font-semibold">Akses Fitur LMS & CBT Lengkap</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="h-6 w-6 rounded-full bg-emerald-500/15 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      </div>
                      <span className="text-slate-300 text-xs font-semibold">Bimbingan Penggunaan Penuh</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="h-6 w-6 rounded-full bg-emerald-500/15 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      </div>
                      <span className="text-slate-300 text-xs font-semibold">Laporan Akademik Siap Cetak</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Requirements */}
              <div className="bg-slate-800/30 rounded-2xl p-5 border border-slate-800/40 flex flex-col justify-between">
                <div>
                  <h3 className="text-[10px] md:text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-4">
                    Data yang Diperlukan:
                  </h3>
                  <ul className="space-y-4 font-semibold text-xs text-slate-300">
                    <li className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
                        <School className="h-4 w-4 text-orange-400" />
                      </div>
                      <span>Nama Resmi Sekolah</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="h-4 w-4 text-orange-400" />
                      </div>
                      <span>Alamat Email Aktif</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="h-4 w-4 text-orange-400" />
                      </div>
                      <span>Nomor WhatsApp Aktif</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* CTA & Actions Container */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="https://wa.me/6285890588706?text=Halo%20Admin%2C%20saya%20tertarik%20untuk%20mendaftarkan%20sekolah%20saya%20di%20AuraExam.%20Bagaimana%20prosedur%20selanjutnya%3F"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2.5 flex-1 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-extrabold py-4 px-6 rounded-xl shadow-xl shadow-emerald-500/10 transition-all active:scale-[0.98] text-xs uppercase tracking-wider cursor-pointer text-center"
              >
                <MessageSquare className="h-5 w-5 fill-current shrink-0" />
                <span>Hubungi Admin Via WhatsApp</span>
              </a>

              <button 
                onClick={onBackToLanding}
                className="py-4 px-6 border border-slate-800 hover:bg-slate-800/30 text-slate-400 hover:text-white rounded-xl text-xs font-extrabold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Batalkan & Kembali
              </button>
            </div>

            <p className="text-center text-[10px] text-slate-500 font-extrabold uppercase tracking-widest mt-6">
              Verifikasi & Aktivasi membutuhkan waktu maks 1×24 jam.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
