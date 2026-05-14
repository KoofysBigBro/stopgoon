'use client'

import { useState } from 'react'
import { playPop, playSuccess, playError } from '@/utils/sound'
import { CheckCircle2, XCircle, ChevronRight } from 'lucide-react'

interface Question {
  question: string
  options: string[]
  answer: number
}

export default function ArticleQuiz({ quiz }: { quiz: Question[] }) {
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [submitted, setSubmitted] = useState(false)

  const score = Object.entries(answers).filter(
    ([qIdx, ans]) => quiz[Number(qIdx)]?.answer === ans
  ).length

  const handleSelect = (qIdx: number, optIdx: number) => {
    if (submitted) return
    setAnswers(a => ({ ...a, [qIdx]: optIdx }))
    playPop()
  }

  const handleSubmit = () => {
    setSubmitted(true)
    if (score === quiz.length) {
      playSuccess()
    } else {
      playError()
    }
  }

  const allAnswered = quiz.every((_, i) => answers[i] !== undefined)

  return (
    <div className="bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 border border-indigo-500/20 rounded-2xl p-6 md:p-8 my-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">🧠</span>
        <div>
          <h3 className="text-lg font-bold font-heading">Quick Knowledge Check</h3>
          <p className="text-sm text-muted">Test what you learned from this article</p>
        </div>
      </div>

      <div className="space-y-6">
        {quiz.map((q, qIdx) => (
          <div key={qIdx}>
            <p className="font-semibold mb-3 text-sm">{qIdx + 1}. {q.question}</p>
            <div className="grid gap-2">
              {q.options.map((opt, optIdx) => {
                const selected = answers[qIdx] === optIdx
                const isCorrect = submitted && q.answer === optIdx
                const isWrong = submitted && selected && q.answer !== optIdx

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelect(qIdx, optIdx)}
                    className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl text-sm transition-all ${
                      isCorrect
                        ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                        : isWrong
                        ? 'bg-red-500/15 border border-red-500/30 text-red-700 dark:text-red-300'
                        : selected
                        ? 'bg-indigo-500/15 border border-indigo-500/30 text-foreground'
                        : 'bg-background border border-border hover:border-foreground/20 hover:bg-surface'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      isCorrect
                        ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                        : isWrong
                        ? 'bg-red-500/20 text-red-600 dark:text-red-400'
                        : selected
                        ? 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400'
                        : 'bg-surface border border-border text-muted'
                    }`}>
                      {isCorrect ? <CheckCircle2 className="w-4 h-4" /> : isWrong ? <XCircle className="w-4 h-4" /> : String.fromCharCode(65 + optIdx)}
                    </span>
                    {opt}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={!allAnswered}
          className="mt-6 inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-bold text-sm transition-all"
        >
          Check My Answers <ChevronRight className="w-4 h-4" />
        </button>
      ) : (
        <div className={`mt-6 p-4 rounded-xl text-center ${
          score === quiz.length
            ? 'bg-emerald-500/10 border border-emerald-500/20'
            : 'bg-amber-500/10 border border-amber-500/20'
        }`}>
          <p className="text-lg font-bold">
            {score === quiz.length ? '🎉 Perfect Score!' : score >= quiz.length / 2 ? '👍 Good Effort!' : '💪 Keep Learning!'}
          </p>
          <p className="text-sm text-muted mt-1">
            You got <strong>{score}/{quiz.length}</strong> correct
          </p>
          {score < quiz.length && (
            <button
              onClick={() => { setSubmitted(false); setAnswers({}) }}
              className="mt-3 text-sm text-indigo-500 hover:underline font-medium"
            >
              Try again
            </button>
          )}
        </div>
      )}
    </div>
  )
}
