import { useState, useEffect } from 'react';
import { 
  Atom, 
  Clock, 
  Send, 
  ChevronLeft, 
  ChevronRight, 
  Grid,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Question } from '../types';
import { mockDb } from '../mockDb';

const MOCK_QUESTIONS: Question[] = [
  {
    id: 1,
    question: "Apa fungsi utama dari organel mitokondria dalam sel hewan?",
    options: [
      "Tempat sintesis rantai asam amino protein",
      "Pusat respirasi seluler aerobil dan produksi energi utama (ATP)",
      "Mengatur seluruh regulasi masuk-keluar cairan sel",
      "Tempat berlangsungnya fotosintesis klorofil"
    ]
  },
  {
    id: 2,
    question: "Hukum gravitasi universal pertama kali dirumuskan oleh ilmuwan bernama...",
    options: [
      "Albert Einstein",
      "Nikola Tesla",
      "Sir Isaac Newton",
      "Galileo Galilei"
    ]
  },
  {
    id: 3,
    question: "Jika sebuah mobil melaju stabil dengan kecepatan 60 km/jam, berapa jarak total yang ditempuh dalam waktu 2,5 jam?",
    options: [
      "120 km",
      "150 km",
      "175 km",
      "160 km"
    ]
  }
];

interface CbtEngineProps {
  onExamFinish: (score: number) => void;
  activeExam: any;
}

export default function CbtEngine({ onExamFinish, activeExam }: CbtEngineProps) {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(() => {
    if (activeExam && activeExam.duration) {
      const parsed = parseInt(activeExam.duration);
      if (!isNaN(parsed)) {
        return parsed * 60;
      }
    }
    return 120 * 60;
  });

  // Load questions dynamically from mockDb by packageId
  const questionsToUse: any[] = (() => {
    if (activeExam && activeExam.packageId) {
      const allPackages = mockDb.getBankSoalPackages();
      const pkg = allPackages.find((p: any) => p.id === Number(activeExam.packageId));
      if (pkg && pkg.questions && pkg.questions.length > 0) {
        return pkg.questions.map((q: any) => {
          const optionKeys = Object.keys(q.options || {}).sort();
          const optionValues = optionKeys.map(k => q.options[k]);
          return {
            id: q.id,
            question: q.text,
            options: optionValues.length > 0 ? optionValues : [q.options.A || q.text, q.options.B, q.options.C, q.options.D].filter(Boolean),
            correctKey: q.correctAnswer || 'A',
            optionKeys: optionKeys
          };
        });
      }
    }
    // Fallback to MOCK_QUESTIONS
    return MOCK_QUESTIONS.map(q => ({
      ...q,
      correctKey: q.id === 1 ? 'B' : q.id === 2 ? 'C' : 'B',
      optionKeys: ['A', 'B', 'C', 'D']
    }));
  })();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [answers]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectAnswer = (qId: number, option: string) => {
    setAnswers(prev => ({
      ...prev,
      [qId]: option
    }));
  };

  const handleSubmit = () => {
    // Grade exam
    let correctCount = 0;
    
    questionsToUse.forEach((q: any) => {
      const selectedValue = answers[q.id];
      if (selectedValue) {
        const selectedIdx = q.options.indexOf(selectedValue);
        if (selectedIdx !== -1) {
          const selectedKey = q.optionKeys[selectedIdx];
          if (selectedKey === q.correctKey) {
            correctCount++;
          }
        }
      }
    });

    const finalScore = questionsToUse.length > 0 ? Math.round((correctCount / questionsToUse.length) * 100) : 100;
    onExamFinish(finalScore);
  };

  const currentQ = questionsToUse[currentQIndex];
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = questionsToUse.length - answeredCount;
  const isLastQuestion = currentQIndex === questionsToUse.length - 1;

  const optionLabels = ['A', 'B', 'C', 'D'];

  return (
    <div id="view-exam" className="fixed inset-0 z-40 bg-slate-100 flex flex-col w-full overflow-hidden font-sans">
      {/* Exam Header */}
      <nav className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4 flex justify-between items-center shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center font-bold text-xl border border-orange-200/50 shadow-inner">
            <Atom className="h-5 w-5 text-orange-600 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <div>
            <h1 className="font-extrabold text-slate-800 leading-tight font-display text-xs sm:text-sm">{activeExam?.name || 'Ilmu Pengetahuan Alam'}</h1>
            <p className="text-[9px] text-slate-400 uppercase tracking-widest font-black">{activeExam?.subject || 'Ujian Akhir Semester Genap'}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Timer Widget */}
          <div className={`flex items-center gap-2 border px-4 py-2 rounded-xl font-mono text-xs sm:text-sm font-black transition-colors ${timeLeft <= 300 ? 'bg-red-50 border-red-200 text-red-600 animate-pulse' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
            <Clock className={`h-4 w-4 ${timeLeft <= 300 ? 'text-red-500' : 'text-slate-400'}`} />
            <span>{formatTime(timeLeft)}</span>
          </div>

          <button 
            onClick={() => setShowConfirmModal(true)}
            className="bg-red-500 hover:bg-red-600 text-white px-4 sm:px-5 py-2.5 rounded-xl font-extrabold transition-all shadow-md shadow-red-100 flex items-center gap-2 text-xs uppercase tracking-wider cursor-pointer active:scale-95"
          >
            <span>Kumpulkan</span>
            <Send className="h-3.5 w-3.5 shrink-0" />
          </button>
        </div>
      </nav>

      {/* Main Exam Area */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto p-4 sm:p-6 gap-6 overflow-hidden">
        
        {/* Left Column: Active Question */}
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 flex-1 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <span className="bg-orange-50 border border-orange-100 text-orange-600 font-extrabold px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-wider">
                    Soal No. {currentQIndex + 1}
                  </span>
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Pilihan Ganda</span>
                </div>
                <span className="text-[10px] font-black text-slate-400 bg-slate-100 border border-slate-100 px-2.5 py-1 rounded-md uppercase tracking-wider">
                  Bobot: 10 Poin
                </span>
              </div>

              <p className="text-base sm:text-lg font-extrabold text-slate-800 mb-8 leading-relaxed font-display">
                {currentQ.question}
              </p>

              <div className="space-y-3">
                {currentQ.options.map((opt, index) => {
                  const isSelected = answers[currentQ.id] === opt;
                  return (
                    <button 
                      key={index}
                      onClick={() => handleSelectAnswer(currentQ.id, opt)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-4 group cursor-pointer text-xs sm:text-sm ${isSelected ? 'border-orange-500 bg-orange-50' : 'border-slate-200 hover:border-orange-200 hover:bg-slate-50 bg-white'}`}
                    >
                      <span className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center font-black text-xs transition-colors ${isSelected ? 'bg-orange-600 text-white shadow-sm' : 'bg-slate-100 text-slate-500 group-hover:bg-orange-100 group-hover:text-orange-600'}`}>
                        {optionLabels[index]}
                      </span>
                      <span className={`${isSelected ? 'text-slate-900 font-bold' : 'text-slate-600 font-semibold'}`}>
                        {opt}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-100">
              <button 
                disabled={currentQIndex === 0}
                onClick={() => setCurrentQIndex(prev => prev - 1)}
                className="flex items-center gap-1.5 px-5 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-all text-xs cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Sebelumnya</span>
              </button>

              {isLastQuestion ? (
                <button 
                  onClick={() => setShowConfirmModal(true)}
                  className="flex items-center gap-1.5 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-extrabold transition-all shadow-md shadow-emerald-100 text-xs uppercase tracking-wider cursor-pointer active:scale-95"
                >
                  <span>Selesai &amp; Kirim</span>
                  <CheckCircle2 className="h-4 w-4" />
                </button>
              ) : (
                <button 
                  onClick={() => setCurrentQIndex(prev => prev + 1)}
                  className="flex items-center gap-1.5 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-extrabold transition-all shadow-md shadow-orange-100 text-xs uppercase tracking-wider cursor-pointer active:scale-95"
                >
                  <span>Selanjutnya</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </div>

          </div>
        </div>

        {/* Right Column: Navigation Grid */}
        <div className="w-full lg:w-80 shrink-0 hidden sm:block">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-extrabold text-slate-800 mb-5 flex items-center gap-2 font-display text-xs uppercase tracking-wider">
              <Grid className="h-4.5 w-4.5 text-slate-400 shrink-0" />
              <span>Navigasi Soal Ujian</span>
            </h3>

            <div className="grid grid-cols-5 gap-2.5 pr-1 pb-2">
              {questionsToUse.map((q, idx) => {
                const isAnswered = answers[q.id] !== undefined;
                const isCurrent = currentQIndex === idx;
                return (
                  <button 
                    key={q.id}
                    onClick={() => setCurrentQIndex(idx)}
                    className={`aspect-square rounded-xl flex items-center justify-center font-black text-xs transition-all border-2 cursor-pointer ${isCurrent ? 'ring-4 ring-orange-100 border-orange-500 bg-orange-50 text-orange-600' : isAnswered ? 'bg-orange-600 text-white border-orange-600 shadow-sm' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col gap-3 text-[11px] font-bold">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-500">
                  <div className="w-3.5 h-3.5 rounded bg-orange-600"></div>
                  <span>Sudah Dijawab</span>
                </div>
                <span className="font-black text-slate-800 text-xs">{answeredCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-500">
                  <div className="w-3.5 h-3.5 rounded border border-slate-200 bg-white"></div>
                  <span>Belum Dijawab</span>
                </div>
                <span className="font-black text-slate-800 text-xs">{unansweredCount}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ================= MODAL: KONFIRMASI KUMPULKAN UJIAN ================= */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-100 p-6 space-y-6 animate-scaleUp">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="p-2.5 bg-red-50 rounded-2xl text-red-600">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider font-display">Konfirmasi Kumpulkan Ujian</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Selesaikan Sesi Ujian CBT</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-500">Total Soal:</span>
                  <span className="font-black text-slate-800">{questionsToUse.length} Soal</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-500">Sudah Dijawab:</span>
                  <span className="font-black text-emerald-600">{answeredCount} Soal</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-500">Belum Dijawab:</span>
                  <span className={`font-black ${unansweredCount > 0 ? 'text-red-500' : 'text-slate-400'}`}>{unansweredCount} Soal</span>
                </div>
              </div>

              {unansweredCount > 0 && (
                <div className="p-3.5 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2 text-[11px] text-red-600 font-bold leading-relaxed">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>Peringatan: Masih ada {unansweredCount} soal yang belum Anda jawab. Apakah Anda yakin ingin mengumpulkan ujian sekarang?</span>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-extrabold text-xs rounded-2xl transition-all cursor-pointer text-center uppercase tracking-wider"
              >
                Kembali
              </button>
              <button 
                onClick={() => {
                  setShowConfirmModal(false);
                  handleSubmit();
                }}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-2xl transition-all shadow-md shadow-emerald-100 cursor-pointer text-center uppercase tracking-wider"
              >
                Ya, Kumpulkan
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
export { MOCK_QUESTIONS };
