import React from 'react';
import { Heart, MessageSquareHeart, Sparkles } from 'lucide-react';

const STUDENT_MESSAGES = [
  {
    name: 'Veda Barve',
    message:
      'Thank you, Shami Teacher, for making every science lesson interesting and encouraging us to stay curious. Happy Guru Purnima!',
  },
  {
    name: 'Krushad Naik',
    message:
      'Your guidance has helped us understand not just science, but also the value of discipline and hard work. Wishing you a Happy Guru Purnima!',
  },
  {
    name: 'Shivam Naik',
    message:
      'Thank you for always motivating us to ask questions, explore new ideas, and never stop learning. Happy Guru Purnima!',
  },
  {
    name: 'Atharva Potfode',
    message:
      'Your patience, dedication, and encouragement have inspired us throughout the year. Thank you for being an amazing teacher. Happy Guru Purnima!',
  },
  {
    name: 'Tejam Barde',
    message:
      'Science became more exciting because of your teaching. Thank you for inspiring us to discover and learn every day. Happy Guru Purnima!',
  },
  {
    name: 'Aizaan Dodamani',
    message:
      'We are grateful for your constant support, kindness, and the confidence you have given us. Wishing you a joyful Guru Purnima!',
  },
];

export const SectionAppreciation: React.FC = () => {
  return (
    <section id="section-appreciation" className="py-20 px-4 max-w-6xl mx-auto space-y-12">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 border border-amber-500/30 text-amber-300 text-xs font-semibold">
          <MessageSquareHeart className="w-4 h-4 text-amber-400" />
          SECTION 4
        </div>
        <h2 className="text-2xl md:text-4xl font-bold text-white font-serif tracking-wide">
          Student Appreciation
        </h2>
        <p className="text-xs md:text-sm text-slate-400 max-w-xl mx-auto">
          Heartfelt tributes and messages from the students of Class 10B.
        </p>
      </div>

      {/* Floating Glass Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {STUDENT_MESSAGES.map((item, idx) => (
          <div
            key={idx}
            className="group relative bg-slate-900/60 border border-amber-500/20 hover:border-amber-400/60 rounded-3xl p-6 backdrop-blur-md shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                  Class 10B Student
                </span>
                <Heart className="w-4 h-4 text-amber-400/60 group-hover:text-amber-400 group-hover:scale-110 transition-all" />
              </div>

              <p className="text-xs md:text-sm text-slate-200 leading-relaxed italic">
                "{item.message}"
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white font-serif">{item.name}</h3>
              <Sparkles className="w-3.5 h-3.5 text-amber-400/80 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Credit */}
      <div className="text-center pt-8 border-t border-slate-900">
        <p className="text-xs md:text-sm text-amber-300/80 font-medium">
          Designed & Developed with ❤️ by <span className="text-amber-200 font-bold">Tej Khobarekar</span>
        </p>
      </div>
    </section>
  );
};
