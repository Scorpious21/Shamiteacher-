import React, { useState } from 'react';
import { HelpCircle, CheckCircle, XCircle, Sparkles, RefreshCw, Award, Lightbulb } from 'lucide-react';
import { MathRenderer } from './MathRenderer';

interface QuizQuestion {
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  hint?: string;
}

interface QuizGeneratorProps {
  subject: string;
  gradeLevel: string;
}

export const QuizGenerator: React.FC<QuizGeneratorProps> = ({ subject, gradeLevel }) => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showHints, setShowHints] = useState<Record<number, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  const handleGenerateQuiz = async () => {
    setLoading(true);
    setError(null);
    setSelectedAnswers({});
    setShowHints({});

    try {
      const res = await fetch('/api/teacher/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          topic: topic.trim() || subject,
          gradeLevel,
          count: 4,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate quiz');

      setQuestions(data.questions || []);
    } catch (err: any) {
      setError(err.message || 'Error generating quiz questions.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (qIdx: number, optIdx: number) => {
    if (selectedAnswers[qIdx] !== undefined) return; // already answered
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctOptionIndex) {
        score += 1;
      }
    });
    return score;
  };

  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 shadow-xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-600/20 text-indigo-400 rounded-xl border border-indigo-500/30">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Interactive Concept Check & Practice Quiz</h2>
            <p className="text-xs text-slate-300">Generate tailored practice questions for any topic to test your mastery.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder={`Enter specific topic in ${subject} (e.g. Quadratic Formula, Photosynthesis)...`}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-indigo-500 transition-all"
          />
          <button
            id="btn-generate-quiz"
            onClick={handleGenerateQuiz}
            disabled={loading}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 shrink-0"
          >
            {loading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Creating Quiz...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Practice Quiz
              </>
            )}
          </button>
        </div>

        {error && <p className="text-xs text-red-400 bg-red-950/40 border border-red-800/50 p-2.5 rounded-lg">{error}</p>}
      </div>

      {/* Quiz Area */}
      {questions.length > 0 && (
        <div className="space-y-6">
          {/* Scoreboard if completed */}
          {answeredCount === questions.length && (
            <div className="bg-gradient-to-r from-indigo-950 to-slate-900 border border-indigo-500/40 rounded-2xl p-6 shadow-xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Award className="w-8 h-8 text-amber-400" />
                <div>
                  <h3 className="text-base font-bold text-white">Quiz Completed!</h3>
                  <p className="text-xs text-slate-300">
                    You scored <strong className="text-emerald-400">{calculateScore()}</strong> out of <strong>{questions.length}</strong> ({Math.round((calculateScore() / questions.length) * 100)}%)
                  </p>
                </div>
              </div>

              <button
                onClick={handleGenerateQuiz}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-600 rounded-xl flex items-center gap-2 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Try Another Set
              </button>
            </div>
          )}

          {/* Question list */}
          {questions.map((q, qIdx) => {
            const isAnswered = selectedAnswers[qIdx] !== undefined;
            const selectedOpt = selectedAnswers[qIdx];
            const isCorrect = selectedOpt === q.correctOptionIndex;

            return (
              <div
                key={qIdx}
                className="bg-slate-800/70 border border-slate-700/60 rounded-2xl p-5 shadow-lg space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-sm font-bold text-slate-100 flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-700 text-indigo-300 text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {qIdx + 1}
                    </span>
                    <MathRenderer content={q.question} />
                  </h3>

                  {q.hint && !isAnswered && (
                    <button
                      onClick={() => setShowHints((prev) => ({ ...prev, [qIdx]: !prev[qIdx] }))}
                      className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 shrink-0"
                    >
                      <Lightbulb className="w-3.5 h-3.5" />
                      {showHints[qIdx] ? 'Hide Hint' : 'Hint'}
                    </button>
                  )}
                </div>

                {showHints[qIdx] && q.hint && (
                  <div className="text-xs text-amber-300/90 bg-amber-950/30 border border-amber-800/30 rounded-lg p-2.5">
                    💡 <strong>Hint:</strong> {q.hint}
                  </div>
                )}

                {/* Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {q.options.map((opt, optIdx) => {
                    let btnStyle = 'bg-slate-900/80 border-slate-700/80 text-slate-200 hover:border-indigo-500/50';

                    if (isAnswered) {
                      if (optIdx === q.correctOptionIndex) {
                        btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-semibold';
                      } else if (optIdx === selectedOpt) {
                        btnStyle = 'bg-red-950/80 border-red-500 text-red-200 font-semibold';
                      } else {
                        btnStyle = 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(qIdx, optIdx)}
                        disabled={isAnswered}
                        className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${btnStyle}`}
                      >
                        <MathRenderer content={opt} className="inline" />
                        {isAnswered && optIdx === q.correctOptionIndex && (
                          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                        )}
                        {isAnswered && optIdx === selectedOpt && optIdx !== q.correctOptionIndex && (
                          <XCircle className="w-4 h-4 text-red-400 shrink-0 ml-2" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Feedback explanation */}
                {isAnswered && (
                  <div
                    className={`p-3.5 rounded-xl text-xs space-y-1 border ${
                      isCorrect
                        ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-200'
                        : 'bg-indigo-950/30 border-indigo-800/40 text-indigo-200'
                    }`}
                  >
                    <p className="font-semibold text-slate-100">
                      {isCorrect ? '✅ Correct!' : '❌ Not quite right.'}
                    </p>
                    <MathRenderer content={q.explanation} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
