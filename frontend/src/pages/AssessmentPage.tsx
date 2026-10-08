import React, { useState } from 'react';
import { 
  CheckSquare, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ArrowRight, 
  RotateCcw,
  BookOpen
} from 'lucide-react';
import { api } from '../services/api';
import { Question, AssessmentSubmissionResult } from '../types';

const CATEGORIES = [
  "All",
  "Python",
  "SQL",
  "Machine Learning",
  "Data Structures",
  "Web Development",
  "Statistics",
  "Aptitude"
];

export const AssessmentPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTestActive, setIsTestActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<AssessmentSubmissionResult | null>(null);

  const startAssessment = async () => {
    try {
      const res = await api.getAssessmentQuestions(selectedCategory, 8);
      setQuestions(res.questions);
      setAnswers({});
      setCurrentIndex(0);
      setResult(null);
      setIsTestActive(true);
    } catch (err) {
      console.error('Failed to start assessment:', err);
    }
  };

  const handleSelectOption = (questionId: string, optionIdx: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionIdx
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await api.submitAssessment(answers);
      setResult(res);
      setIsTestActive(false);
    } catch (err) {
      console.error('Submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQ = questions[currentIndex];
  const totalQ = questions.length;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] font-medium text-blue-400 mb-2">
          <CheckSquare className="w-3 h-3" /> Technical Aptitude & Knowledge Evaluation
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Interactive Assessment System
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Take domain-specific assessments. Performance scores automatically feed into your ML profile feature vectors.
        </p>
      </div>

      {!isTestActive && !result && (
        <div className="glass-panel p-8 border-slate-800 text-center max-w-2xl mx-auto">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Choose Assessment Domain</h3>
          <p className="text-xs text-slate-400 mt-1 mb-6">
            Select a specific subject or choose 'All' for a comprehensive multi-category test.
          </p>

          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            onClick={startAssessment}
            className="glow-btn px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-blue-600/25 inline-flex items-center gap-2"
          >
            <span>Start Test Session</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Active Test Screen */}
      {isTestActive && currentQ && (
        <div className="glass-panel p-6 sm:p-8 border-slate-800 space-y-6">
          {/* Progress Bar & Indicators */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-slate-200">
              Question {currentIndex + 1} of {totalQ}
            </span>
            <span className="px-2.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
              Category: {currentQ.category}
            </span>
            <span>{answeredCount}/{totalQ} Answered</span>
          </div>

          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / totalQ) * 100}%` }}
            />
          </div>

          {/* Question Text */}
          <div className="py-2">
            <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed">
              {currentQ.question}
            </h3>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((opt, optIdx) => {
              const isSelected = answers[currentQ.id] === optIdx;
              return (
                <div
                  key={optIdx}
                  onClick={() => handleSelectOption(currentQ.id, optIdx)}
                  className={`p-4 rounded-xl border text-xs sm:text-sm font-medium cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-blue-600/20 border-blue-500 text-white'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <span>{opt}</span>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    isSelected ? 'border-blue-400 bg-blue-500' : 'border-slate-700'
                  }`}>
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-slate-300 rounded-xl text-xs font-semibold"
            >
              Previous
            </button>

            {currentIndex < totalQ - 1 ? (
              <button
                onClick={() => setCurrentIndex(currentIndex + 1)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="glow-btn px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20"
              >
                {isSubmitting ? 'Evaluating...' : 'Submit Test & View Evaluation'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Result Screen */}
      {result && (
        <div className="space-y-6">
          <div className="glass-panel p-8 border-slate-800 text-center bg-gradient-to-r from-blue-950/30 to-purple-950/20">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Assessment Score Summary
            </h3>
            <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 mb-2">
              {result.overall_score}%
            </div>
            <p className="text-xs text-slate-300">
              Answered <span className="text-emerald-400 font-bold">{result.correct_count}</span> out of {result.total_questions} questions correctly.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {Object.entries(result.category_performance).map(([cat, score]) => (
                <div key={cat} className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                  <span className="text-slate-400 block text-[10px]">{cat}</span>
                  <span className="font-bold text-white">{score}%</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setResult(null);
                startAssessment();
              }}
              className="mt-6 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl inline-flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Retake Test
            </button>
          </div>

          {/* Detailed Question Review */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white">Detailed Answer Review</h3>
            {result.detailed_review.map((item, idx) => (
              <div
                key={item.id}
                className="glass-panel p-5 border-slate-800 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">
                    Q{idx + 1} • {item.category}
                  </span>
                  {item.is_correct ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                    </span>
                  ) : (
                    <span className="text-rose-400 font-bold flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" /> Incorrect
                    </span>
                  )}
                </div>

                <p className="text-sm font-semibold text-white">{item.question}</p>

                <div className="grid sm:grid-cols-2 gap-2 text-xs pt-1">
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Your Answer:</span>
                    <span className={item.is_correct ? 'text-emerald-300' : 'text-rose-300 font-medium'}>
                      {item.selected_option}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Correct Answer:</span>
                    <span className="text-emerald-400 font-semibold">{item.correct_option}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-blue-950/20 border border-blue-900/30 text-[11px] text-slate-300 mt-2">
                  <span className="text-blue-400 font-bold">Explanation: </span>
                  {item.explanation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
