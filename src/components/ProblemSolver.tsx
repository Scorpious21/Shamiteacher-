import React, { useState } from 'react';
import { Upload, Camera, FileText, CheckCircle2, Lightbulb, AlertCircle, ArrowRight, Sparkles, Image as ImageIcon, X } from 'lucide-react';
import { MathRenderer } from './MathRenderer';

interface ProblemStep {
  stepNumber: number;
  heading: string;
  explanation: string;
  formula?: string;
  tip?: string;
}

interface SolutionResult {
  title: string;
  topic: string;
  difficulty: string;
  conceptSummary: string;
  givenData: string[];
  steps: ProblemStep[];
  finalAnswer: string;
  verification: string;
}

interface ProblemSolverProps {
  subject: string;
  gradeLevel: string;
}

export const ProblemSolver: React.FC<ProblemSolverProps> = ({ subject, gradeLevel }) => {
  const [problemText, setProblemText] = useState('');
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [solution, setSolution] = useState<SolutionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        setError('Image file size must be less than 8MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setImageBase64(reader.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSolve = async () => {
    if (!problemText.trim() && !imageBase64) {
      setError('Please type a problem or upload an image of your homework question.');
      return;
    }

    setLoading(true);
    setError(null);
    setSolution(null);

    try {
      const res = await fetch('/api/teacher/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemText,
          imageBase64,
          subject,
          gradeLevel,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to solve problem.');

      setSolution(data);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred while generating solution.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-800 to-indigo-950/60 rounded-2xl p-6 border border-slate-700/60 shadow-xl">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          Step-by-Step Problem & Homework Solver
        </h2>
        <p className="text-xs text-slate-300">
          Enter any equation, word problem, conceptual question, or upload a photo of your assignment for an instant, thorough breakdown.
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/60 shadow-lg space-y-4">
        <div>
          <label htmlFor="problem-input-text" className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-400" />
            Problem Statement or Question:
          </label>
          <textarea
            id="problem-input-text"
            value={problemText}
            onChange={(e) => setProblemText(e.target.value)}
            placeholder="e.g. Find the roots of 2x^2 + 5x - 3 = 0 or explain why a ball thrown upwards slows down."
            rows={4}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-indigo-500 transition-all resize-none"
          />
        </div>

        {/* File / Camera Upload */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-700/50">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <label className="flex items-center gap-2 bg-slate-900 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3.5 py-2 rounded-xl text-xs font-medium cursor-pointer transition-all">
              <Upload className="w-4 h-4 text-indigo-400" />
              Upload Question Photo
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>

            {imageBase64 && (
              <div className="relative inline-block">
                <img src={imageBase64} alt="Uploaded problem" className="w-12 h-12 object-cover rounded-lg border border-indigo-500/50" />
                <button
                  onClick={() => setImageBase64(null)}
                  className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          <button
            id="btn-solve-problem"
            onClick={handleSolve}
            disabled={loading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Analyzing Problem...
              </>
            ) : (
              <>
                Solve Step-by-Step
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-xs text-red-400 bg-red-950/40 border border-red-800/50 rounded-xl p-3">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Solution Output */}
      {solution && (
        <div id="solution-container" className="space-y-5 animate-fade-in">
          {/* Header Card */}
          <div className="bg-slate-800/90 rounded-2xl p-6 border border-slate-700 shadow-xl space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700/60 pb-3">
              <div>
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">{solution.topic}</span>
                <h3 className="text-lg font-bold text-white mt-0.5">{solution.title}</h3>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-slate-900 text-slate-300 border border-slate-700 font-medium">
                Difficulty: {solution.difficulty}
              </span>
            </div>

            {/* Core Concept */}
            <div className="bg-indigo-950/40 border border-indigo-500/20 rounded-xl p-4">
              <h4 className="text-xs font-semibold text-indigo-300 flex items-center gap-1.5 mb-1">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                Key Concept / Governing Principle:
              </h4>
              <MathRenderer content={solution.conceptSummary} />
            </div>

            {/* Given facts */}
            {solution.givenData && solution.givenData.length > 0 && (
              <div className="text-xs text-slate-300">
                <span className="font-semibold text-slate-200">Given Data / Knowns:</span>
                <ul className="list-disc list-inside mt-1 space-y-1 text-slate-400">
                  {solution.givenData.map((fact, idx) => (
                    <li key={idx}>
                      <MathRenderer content={fact} className="inline" />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Steps */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Detailed Step-by-Step Breakdown
            </h4>

            {solution.steps.map((step) => (
              <div
                key={step.stepNumber}
                className="bg-slate-800/70 border border-slate-700/60 rounded-2xl p-5 shadow-lg relative overflow-hidden transition-all hover:border-slate-600"
              >
                <div className="flex items-start gap-4">
                  <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow">
                    {step.stepNumber}
                  </div>
                  <div className="flex-1 space-y-2">
                    <h5 className="text-sm font-bold text-slate-100">{step.heading}</h5>
                    <MathRenderer content={step.explanation} />

                    {step.formula && (
                      <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700/80 text-emerald-300">
                        <MathRenderer content={`$$${step.formula}$$`} />
                      </div>
                    )}

                    {step.tip && (
                      <div className="text-xs text-amber-300/90 bg-amber-950/30 border border-amber-800/30 rounded-lg p-2.5 flex items-start gap-2">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span><strong>Teacher Tip:</strong> {step.tip}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Final Answer Banner */}
          <div className="bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/40 rounded-2xl p-5 shadow-xl space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Final Answer & Conclusion
            </h4>
            <div className="text-base font-bold text-white">
              <MathRenderer content={solution.finalAnswer} />
            </div>
            {solution.verification && (
              <p className="text-xs text-slate-400 border-t border-slate-800 pt-2 mt-2">
                <strong>Verification Check:</strong> {solution.verification}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
