// ============================================================
// HopeAfter50 — Admin display labels for assessment answers
// Maps the raw enum values stored in Member/Assessment back to the
// human-readable option text shown in the assessment flow, so the
// admin member detail page reads like the original questionnaire.
// ============================================================

const OPTION_LABELS: Record<string, string> = {
  // ageRange
  under_50: 'Under 50',
  '50_54': '50–54',
  '55_59': '55–59',
  '60_64': '60–64',
  '65_plus': '65+',
  // gender
  male: 'Male',
  female: 'Female',
  // situation
  laid_off: 'Laid off',
  position_eliminated: 'Position eliminated',
  company_closed: 'Company closed',
  forced_retirement: 'Forced retirement',
  left_voluntarily: 'Left and need another opportunity',
  other: 'Other',
  // rebuildDuration / financialRunway (shared values)
  under_30_days: 'Less than 30 days',
  '1_3_months': '1–3 months',
  '3_6_months': '3–6 months',
  '6_12_months': '6–12 months',
  over_1_year: 'More than one year',
  under_1_month: 'Less than one month',
  // primaryFear
  replacing_income: 'Replacing my income',
  paying_bills: 'Paying the bills',
  retirement: 'Retirement',
  finding_leadership_role: 'Finding another leadership role',
  losing_confidence: 'Losing confidence',
  dont_know_where_to_start: "I don't know what to do next",
  // clarityLevel
  knows_what_wants: 'I know what I want to do but need help getting there.',
  has_ideas_unsure: "I have several ideas but don't know which one to pursue.",
  no_idea_where_to_start: "I honestly don't know where to start.",
  // workInterests
  same_type_of_work: 'Find a job like the one I lost',
  better_opportunity: 'Find something better than what I had',
  consulting: 'Work for myself — consulting or advising',
  own_business: 'Start or buy my own business',
  flexible_work: 'Work part-time or in a flexible role',
  open_to_anything: "I'm not sure yet — just help me figure it out",
  // interviewFrequency
  frequently: 'Frequently',
  occasionally: 'Occasionally',
  rarely: 'Rarely',
  none: 'None',
  // hasCurrentResume
  yes: 'Yes',
  mostly: 'Mostly',
  no: 'No',
  // contactPreference
  self_serve: "I'd rather work through the tools myself.",
  email: 'Email me.',
  text: 'Text me.',
  direct_message: 'Direct message me.',
  schedule_call: "I'd like to schedule a call.",
}

export function labelFor(value: string | null | undefined): string {
  if (!value) return '—'
  return OPTION_LABELS[value] ?? value
}

export function labelForList(values: string[] | null | undefined): string {
  if (!values || values.length === 0) return '—'
  return values.map(labelFor).join(', ')
}
