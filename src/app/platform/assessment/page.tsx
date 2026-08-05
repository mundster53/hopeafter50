// ============================================================
// HopeAfter50 — Rebuild Assessment
// 15 questions from Artifact 2
// On submit → generates Rebuild Plan → redirects to /platform/plan
// ============================================================
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

// Question index
const TOTAL_QUESTIONS = 16

export default function AssessmentPage() {
  const router = useRouter()
  const [step, setStep] = useState(0) // 0 = welcome
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [submitting, setSubmitting] = useState(false)

  function update(key: string, value: any) {
    setAnswers(prev => ({ ...prev, [key]: value }))
  }

  function toggleMulti(key: string, value: string) {
    const current: string[] = answers[key] || []
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value]
    update(key, next)
  }

  async function handleSubmit() {
    setSubmitting(true)
    try {
      const res = await fetch('/api/assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answers),
      })
      const data = await res.json()
      // Store plan ID in sessionStorage for the plan page to pick up
      sessionStorage.setItem('rebuildPlan', JSON.stringify(data.plan))
      sessionStorage.setItem('memberName', answers.firstName || 'Friend')
      router.push('/platform/plan')
    } catch (err) {
      console.error(err)
      setSubmitting(false)
    }
  }

  const progressPercent = step === 0 ? 0 : Math.round((step / TOTAL_QUESTIONS) * 100)

  return (
    <div className="min-h-screen bg-warm-white">
      {/* Header */}
      <div className="bg-navy py-4 px-6">
        <p className="font-display text-white text-lg font-bold max-wide mx-auto">HopeAfter50</p>
      </div>

      {/* Progress */}
      {step > 0 && (
        <div className="bg-white border-b border-sage px-6 py-3">
          <div className="max-content mx-auto">
            <div className="flex items-center justify-between mb-2">
              <p className="font-body text-slate-supporting text-sm">Question {step} of {TOTAL_QUESTIONS}</p>
              <p className="font-body text-slate-supporting text-sm">{progressPercent}%</p>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        </div>
      )}

      <div className="max-content mx-auto px-6 py-12">
        {step === 0 && <WelcomeStep onNext={() => setStep(1)} />}
        {step === 1 && <Q1 answers={answers} update={update} onNext={() => setStep(2)} />}
        {step === 2 && <Q2 answers={answers} update={update} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
        {step === 3 && <Q3LastRole answers={answers} update={update} onNext={() => setStep(4)} onBack={() => setStep(2)} />}
        {step === 4 && <Q4 answers={answers} update={update} onNext={() => setStep(5)} onBack={() => setStep(3)} />}
        {step === 5 && <Q5 answers={answers} update={update} onNext={() => setStep(6)} onBack={() => setStep(4)} />}
        {step === 6 && <Q6 answers={answers} update={update} onNext={() => setStep(7)} onBack={() => setStep(5)} />}
        {step === 7 && <Q7 answers={answers} toggle={(v: string) => toggleMulti('workInterests', v)} onNext={() => setStep(8)} onBack={() => setStep(6)} />}
        {step === 8 && <Q8 answers={answers} update={update} onNext={() => setStep(9)} onBack={() => setStep(7)} />}
        {step === 9 && <Q9 answers={answers} update={update} onNext={() => setStep(10)} onBack={() => setStep(8)} />}
        {step === 10 && <Q10 answers={answers} update={update} onNext={() => setStep(11)} onBack={() => setStep(9)} />}
        {step === 11 && <Q11 answers={answers} update={update} onNext={() => setStep(12)} onBack={() => setStep(10)} />}
        {step === 12 && <Q12 answers={answers} toggle={(v: string) => toggleMulti('aiToolsNeeded', v)} onNext={() => setStep(13)} onBack={() => setStep(11)} />}
        {step === 13 && <Q13 answers={answers} update={update} onNext={() => setStep(14)} onBack={() => setStep(12)} />}
        {step === 14 && <Q14 answers={answers} update={update} onNext={() => setStep(15)} onBack={() => setStep(13)} />}
        {step === 15 && <Q15 answers={answers} update={update} onNext={() => setStep(16)} onBack={() => setStep(14)} />}
        {step === 16 && <Q16 answers={answers} update={update} onSubmit={handleSubmit} onBack={() => setStep(15)} submitting={submitting} />}
      </div>
    </div>
  )
}

// ----------------------------
// Reusable UI atoms
// ----------------------------
function Radio({ label, value, checked, onChange }: { label: string; value: string; checked: boolean; onChange: () => void }) {
  return (
    <label className={`flex items-center gap-3 p-4 rounded-card border-2 cursor-pointer transition-colors
      ${checked ? 'border-amber-hope bg-amber-pale' : 'border-sage bg-white hover:border-slate-supporting'}`}>
      <input type="radio" className="sr-only" value={value} checked={checked} onChange={onChange} />
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0
        ${checked ? 'border-amber-hope' : 'border-slate-supporting'}`}>
        {checked && <div className="w-2.5 h-2.5 rounded-full bg-amber-hope" />}
      </div>
      <span className="font-body text-navy">{label}</span>
    </label>
  )
}

function Checkbox({ label, value, checked, onChange }: { label: string; value: string; checked: boolean; onChange: () => void }) {
  return (
    <label className={`flex items-center gap-3 p-4 rounded-card border-2 cursor-pointer transition-colors
      ${checked ? 'border-amber-hope bg-amber-pale' : 'border-sage bg-white hover:border-slate-supporting'}`}>
      <input type="checkbox" className="sr-only" value={value} checked={checked} onChange={onChange} />
      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0
        ${checked ? 'border-amber-hope bg-amber-hope' : 'border-slate-supporting'}`}>
        {checked && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>}
      </div>
      <span className="font-body text-navy">{label}</span>
    </label>
  )
}

function NavButtons({ onBack, onNext, nextLabel = 'Continue', disabled = false, submitting = false }: any) {
  return (
    <div className="flex gap-4 mt-8">
      {onBack && (
        <button onClick={onBack} className="btn-ghost">← Back</button>
      )}
      <button
        onClick={onNext}
        disabled={disabled || submitting}
        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? 'Building Your Plan...' : nextLabel}
      </button>
    </div>
  )
}

function QuestionLabel({ children }: { children: React.ReactNode }) {
  return <h2 className="font-display text-display-sm text-navy mb-2">{children}</h2>
}

function QuestionNote({ children }: { children: React.ReactNode }) {
  return <p className="font-body text-slate-supporting mb-6">{children}</p>
}

// ----------------------------
// Welcome
// ----------------------------
function WelcomeStep({ onNext }: { onNext: () => void }) {
  const reassurances = [
    'Nothing you don’t already know the answer to',
    'Takes about 5 minutes',
    'Your plan is ready the moment you finish',
  ]

  return (
    <div className="bg-navy rounded-card px-6 py-12 md:px-12">
      <h1 className="font-display text-display-md text-white mb-4">
        Tell us your story.
      </h1>
      <p className="font-display text-xl text-amber-hope mb-6">
        Where you are, what you're carrying, and what you need right now.
      </p>
      <p className="font-body text-white/80 mb-8">
        There are no wrong answers here. Everything you share helps us build something that actually
        fits your situation — a real plan with real next steps.
      </p>
      <ul className="space-y-3 mb-8">
        {reassurances.map((item) => (
          <li key={item} className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-amber-hope flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-body text-amber-hope">{item}</span>
          </li>
        ))}
      </ul>
      <button onClick={onNext} className="btn-primary">I&rsquo;m ready — let&rsquo;s do this</button>
    </div>
  )
}

// ----------------------------
// Q1 — About You
// ----------------------------
function Q1({ answers, update, onNext }: any) {
  const ageOptions = [
    { label: 'Under 50', value: 'under_50' },
    { label: '50–54', value: '50_54' },
    { label: '55–59', value: '55_59' },
    { label: '60–64', value: '60_64' },
    { label: '65+', value: '65_plus' },
  ]
  const genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
  ]
  const canContinue = answers.firstName && answers.email && answers.ageRange

  return (
    <div>
      <QuestionLabel>Tell us about yourself.</QuestionLabel>
      <QuestionNote>This helps us personalize your plan from the start.</QuestionNote>
      <div className="space-y-4 mb-6">
        <div>
          <label className="font-body text-sm text-slate-supporting mb-1 block">First Name</label>
          <input
            type="text"
            value={answers.firstName || ''}
            onChange={e => update('firstName', e.target.value)}
            placeholder="Your first name"
            className="w-full border-2 border-sage rounded-card px-4 py-3 font-body text-navy focus:outline-none focus:border-amber-hope"
          />
        </div>
        <div>
          <label className="font-body text-sm text-slate-supporting mb-1 block">Email Address</label>
          <input
            type="email"
            value={answers.email || ''}
            onChange={e => update('email', e.target.value)}
            placeholder="Your email"
            className="w-full border-2 border-sage rounded-card px-4 py-3 font-body text-navy focus:outline-none focus:border-amber-hope"
          />
        </div>
        <div>
          <p className="font-body text-sm text-slate-supporting mb-2">Age</p>
          <div className="space-y-2">
            {ageOptions.map(o => (
              <Radio key={o.value} label={o.label} value={o.value} checked={answers.ageRange === o.value} onChange={() => update('ageRange', o.value)} />
            ))}
          </div>
        </div>
        <div>
          <p className="font-body text-sm text-slate-supporting mb-2">Gender (optional — allows us to personalize)</p>
          <div className="space-y-2">
            {genderOptions.map(o => (
              <Radio key={o.value} label={o.label} value={o.value} checked={answers.gender === o.value} onChange={() => update('gender', o.value)} />
            ))}
          </div>
        </div>
      </div>
      <NavButtons onNext={onNext} disabled={!canContinue} />
    </div>
  )
}

// ----------------------------
// Q2 — Situation
// ----------------------------
function Q2({ answers, update, onNext, onBack }: any) {
  const options = [
    { label: 'Laid off', value: 'laid_off' },
    { label: 'Position eliminated', value: 'position_eliminated' },
    { label: 'Company closed', value: 'company_closed' },
    { label: 'Forced retirement', value: 'forced_retirement' },
    { label: 'Left and need another opportunity', value: 'left_voluntarily' },
    { label: 'Other', value: 'other' },
  ]
  return (
    <div>
      <QuestionLabel>Which best describes your situation?</QuestionLabel>
      <div className="space-y-2 mb-4">
        {options.map(o => (
          <Radio key={o.value} label={o.label} value={o.value} checked={answers.situation === o.value} onChange={() => update('situation', o.value)} />
        ))}
      </div>
      <NavButtons onBack={onBack} onNext={onNext} disabled={!answers.situation} />
    </div>
  )
}

// ----------------------------
// Q3 — Last role
// ----------------------------
function Q3LastRole({ answers, update, onNext, onBack }: any) {
  return (
    <div>
      <QuestionLabel>What kind of work were you doing before this happened?</QuestionLabel>
      <QuestionNote>Describe it in your own words — your title, the type of work, the industry. Whatever feels most accurate.</QuestionNote>
      <textarea
        value={answers.lastRole || ''}
        onChange={e => update('lastRole', e.target.value)}
        rows={4}
        placeholder="Tell us about the work you were doing..."
        className="w-full border-2 border-sage rounded-card px-4 py-3 font-body text-navy focus:outline-none focus:border-amber-hope resize-none mb-4"
      />
      <NavButtons onBack={onBack} onNext={onNext} />
    </div>
  )
}

// ----------------------------
// Q4 — How long rebuilding
// ----------------------------
function Q4({ answers, update, onNext, onBack }: any) {
  const options = [
    { label: 'Less than 30 days', value: 'under_30_days' },
    { label: '1–3 months', value: '1_3_months' },
    { label: '3–6 months', value: '3_6_months' },
    { label: '6–12 months', value: '6_12_months' },
    { label: 'More than one year', value: 'over_1_year' },
  ]
  return (
    <div>
      <QuestionLabel>How long have you been rebuilding?</QuestionLabel>
      <div className="space-y-2 mb-4">
        {options.map(o => (
          <Radio key={o.value} label={o.label} value={o.value} checked={answers.rebuildDuration === o.value} onChange={() => update('rebuildDuration', o.value)} />
        ))}
      </div>
      <NavButtons onBack={onBack} onNext={onNext} disabled={!answers.rebuildDuration} />
    </div>
  )
}

// ----------------------------
// Q5 — Primary fear
// ----------------------------
function Q5({ answers, update, onNext, onBack }: any) {
  const options = [
    { label: 'Replacing my income', value: 'replacing_income' },
    { label: 'Paying the bills', value: 'paying_bills' },
    { label: 'Retirement', value: 'retirement' },
    { label: 'Finding another leadership role', value: 'finding_leadership_role' },
    { label: 'Losing confidence', value: 'losing_confidence' },
    { label: "I don't know what to do next", value: 'dont_know_where_to_start' },
  ]
  return (
    <div>
      <QuestionLabel>What's keeping you up at night?</QuestionLabel>
      <QuestionNote>Choose one. This tells us where to begin.</QuestionNote>
      <div className="space-y-2 mb-4">
        {options.map(o => (
          <Radio key={o.value} label={o.label} value={o.value} checked={answers.primaryFear === o.value} onChange={() => update('primaryFear', o.value)} />
        ))}
      </div>
      <NavButtons onBack={onBack} onNext={onNext} disabled={!answers.primaryFear} />
    </div>
  )
}

// ----------------------------
// Q6 — Clarity level
// ----------------------------
function Q6({ answers, update, onNext, onBack }: any) {
  const options = [
    { label: 'I know what I want to do but need help getting there.', value: 'knows_what_wants' },
    { label: "I have several ideas but don't know which one to pursue.", value: 'has_ideas_unsure' },
    { label: "I honestly don't know where to start.", value: 'no_idea_where_to_start' },
  ]
  return (
    <div>
      <QuestionLabel>Which statement feels most like you?</QuestionLabel>
      <div className="space-y-2 mb-4">
        {options.map(o => (
          <Radio key={o.value} label={o.label} value={o.value} checked={answers.clarityLevel === o.value} onChange={() => update('clarityLevel', o.value)} />
        ))}
      </div>
      <NavButtons onBack={onBack} onNext={onNext} disabled={!answers.clarityLevel} />
    </div>
  )
}

// ----------------------------
// Q7 — Work interests (multi)
// ----------------------------
function Q7({ answers, toggle, onNext, onBack }: any) {
  const options = [
    { label: 'Find a job like the one I lost', value: 'same_type_of_work' },
    { label: 'Find something better than what I had', value: 'better_opportunity' },
    { label: 'Work for myself — consulting or advising', value: 'consulting' },
    { label: 'Start or buy my own business', value: 'own_business' },
    { label: 'Work part-time or in a flexible role', value: 'flexible_work' },
    { label: "I'm not sure yet — just help me figure it out", value: 'open_to_anything' },
  ]
  const selected: string[] = answers.workInterests || []
  return (
    <div>
      <QuestionLabel>What type of work are you most interested in?</QuestionLabel>
      <QuestionNote>Select all that apply.</QuestionNote>
      <div className="space-y-2 mb-4">
        {options.map(o => (
          <Checkbox key={o.value} label={o.label} value={o.value} checked={selected.includes(o.value)} onChange={() => toggle(o.value)} />
        ))}
      </div>
      <NavButtons onBack={onBack} onNext={onNext} disabled={selected.length === 0} />
    </div>
  )
}

// ----------------------------
// Q8 — Financial runway
// ----------------------------
function Q8({ answers, update, onNext, onBack }: any) {
  const options = [
    { label: 'Less than one month', value: 'under_1_month' },
    { label: '1–3 months', value: '1_3_months' },
    { label: '3–6 months', value: '3_6_months' },
    { label: '6–12 months', value: '6_12_months' },
    { label: 'More than one year', value: 'over_1_year' },
  ]
  return (
    <div>
      <QuestionLabel>How much time do you have before you run out of money to pay your bills?</QuestionLabel>
      <QuestionNote>Be as honest as you can. This helps us focus on what matters most right now.</QuestionNote>
      <div className="space-y-2 mb-4">
        {options.map(o => (
          <Radio key={o.value} label={o.label} value={o.value} checked={answers.financialRunway === o.value} onChange={() => update('financialRunway', o.value)} />
        ))}
      </div>
      <NavButtons onBack={onBack} onNext={onNext} disabled={!answers.financialRunway} />
    </div>
  )
}

// ----------------------------
// Q9 — Using savings
// ----------------------------
function Q9({ answers, update, onNext, onBack }: any) {
  return (
    <div>
      <QuestionLabel>Have you started using your savings to pay your bills?</QuestionLabel>
      <div className="space-y-2 mb-4">
        <Radio label="Yes" value="yes" checked={answers.usingSavings === 'yes'} onChange={() => update('usingSavings', 'yes')} />
        <Radio label="No" value="no" checked={answers.usingSavings === 'no'} onChange={() => update('usingSavings', 'no')} />
      </div>
      <NavButtons onBack={onBack} onNext={onNext} disabled={!answers.usingSavings} />
    </div>
  )
}

// ----------------------------
// Q10 — Interview frequency
// ----------------------------
function Q10({ answers, update, onNext, onBack }: any) {
  const options = [
    { label: 'Frequently', value: 'frequently' },
    { label: 'Occasionally', value: 'occasionally' },
    { label: 'Rarely', value: 'rarely' },
    { label: 'None', value: 'none' },
  ]
  return (
    <div>
      <QuestionLabel>Have you been getting interviews?</QuestionLabel>
      <QuestionNote>This tells us a lot about where the gap is.</QuestionNote>
      <div className="space-y-2 mb-4">
        {options.map(o => (
          <Radio key={o.value} label={o.label} value={o.value} checked={answers.interviewFrequency === o.value} onChange={() => update('interviewFrequency', o.value)} />
        ))}
      </div>
      <NavButtons onBack={onBack} onNext={onNext} disabled={!answers.interviewFrequency} />
    </div>
  )
}

// ----------------------------
// Q11 — Resume status
// ----------------------------
function Q11({ answers, update, onNext, onBack }: any) {
  const options = [
    { label: 'Yes', value: 'yes' },
    { label: 'Mostly', value: 'mostly' },
    { label: 'No', value: 'no' },
  ]
  return (
    <div>
      <QuestionLabel>Do you have an up-to-date résumé?</QuestionLabel>
      <div className="space-y-2 mb-4">
        {options.map(o => (
          <Radio key={o.value} label={o.label} value={o.value} checked={answers.hasCurrentResume === o.value} onChange={() => update('hasCurrentResume', o.value)} />
        ))}
      </div>
      <NavButtons onBack={onBack} onNext={onNext} disabled={!answers.hasCurrentResume} />
    </div>
  )
}

// ----------------------------
// Q12 — AI tools (multi)
// ----------------------------
function Q12({ answers, toggle, onNext, onBack }: any) {
  const options = ['Resume', 'LinkedIn', 'Cover Letter', 'Interview Prep', 'Networking']
  const selected: string[] = answers.aiToolsNeeded || []
  return (
    <div>
      <QuestionLabel>Which AI tools would help most?</QuestionLabel>
      <QuestionNote>Select all that apply.</QuestionNote>
      <div className="space-y-2 mb-4">
        {options.map(o => (
          <Checkbox key={o} label={o} value={o} checked={selected.includes(o)} onChange={() => toggle(o)} />
        ))}
      </div>
      <NavButtons onBack={onBack} onNext={onNext} disabled={selected.length === 0} />
    </div>
  )
}

// ----------------------------
// Q13 — Contact preference
// ----------------------------
function Q13({ answers, update, onNext, onBack }: any) {
  const options = [
    { label: "I'd rather work through the tools myself.", value: 'self_serve' },
    { label: 'Email me.', value: 'email' },
    { label: 'Text me.', value: 'text' },
    { label: 'Direct message me.', value: 'direct_message' },
    { label: "I'd like to schedule a call.", value: 'schedule_call' },
  ]
  return (
    <div>
      <QuestionLabel>How would you like to work with us?</QuestionLabel>
      <QuestionNote>No pressure. You choose.</QuestionNote>
      <div className="space-y-2 mb-4">
        {options.map(o => (
          <Radio key={o.value} label={o.label} value={o.value} checked={answers.contactPreference === o.value} onChange={() => update('contactPreference', o.value)} />
        ))}
      </div>
      <NavButtons onBack={onBack} onNext={onNext} disabled={!answers.contactPreference} />
    </div>
  )
}

// ----------------------------
// Q14 — Faith-based
// ----------------------------
function Q14({ answers, update, onNext, onBack }: any) {
  return (
    <div>
      <QuestionLabel>Would you like faith-based encouragement included?</QuestionLabel>
      <div className="space-y-2 mb-4">
        <Radio label="Yes" value="yes" checked={answers.faithBased === 'yes'} onChange={() => update('faithBased', 'yes')} />
        <Radio label="No" value="no" checked={answers.faithBased === 'no'} onChange={() => update('faithBased', 'no')} />
      </div>
      <NavButtons onBack={onBack} onNext={onNext} disabled={!answers.faithBased} />
    </div>
  )
}

// ----------------------------
// Q15 — Additional context
// ----------------------------
function Q15({ answers, update, onNext, onBack }: any) {
  return (
    <div>
      <QuestionLabel>Is there anything else we should know?</QuestionLabel>
      <QuestionNote>Optional. Share whatever feels important.</QuestionNote>
      <textarea
        value={answers.additionalContext || ''}
        onChange={e => update('additionalContext', e.target.value)}
        rows={5}
        placeholder="Anything you'd like us to know about your situation..."
        className="w-full border-2 border-sage rounded-card px-4 py-3 font-body text-navy focus:outline-none focus:border-amber-hope resize-none mb-4"
      />
      <NavButtons onBack={onBack} onNext={onNext} nextLabel="Almost Done →" />
    </div>
  )
}

// ----------------------------
// Q16 — Success vision
// ----------------------------
function Q16({ answers, update, onSubmit, onBack, submitting }: any) {
  return (
    <div>
      <QuestionLabel>One final question.</QuestionLabel>
      <p className="font-display text-lg text-navy italic mb-2">
        What would make you look back one year from now and say, "I'm so glad I found HopeAfter50"?
      </p>
      <QuestionNote>This tells us what success looks like to you — not to us.</QuestionNote>
      <textarea
        value={answers.successVision || ''}
        onChange={e => update('successVision', e.target.value)}
        rows={5}
        placeholder="Describe what a successful rebuild looks like for you..."
        className="w-full border-2 border-sage rounded-card px-4 py-3 font-body text-navy focus:outline-none focus:border-amber-hope resize-none mb-4"
      />
      <NavButtons onBack={onBack} onNext={onSubmit} nextLabel="Build My Rebuild Plan" submitting={submitting} />
    </div>
  )
}
