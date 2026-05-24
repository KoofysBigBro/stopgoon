import { getWelcomeEmail } from './welcome'
import { getDay1Email } from './day1'
import { getDay3Email } from './day3'
import { getDay5Email } from './day5'
import { getDay7Email } from './day7'
import { getDay10Email } from './day10'
import { getDay14Email } from './day14'

export type EmailType =
  | 'welcome'
  | 'day1'
  | 'day3'
  | 'day5'
  | 'day7'
  | 'day10'
  | 'day14'

export interface EmailDefinition {
  type: EmailType
  delayDays: number
  getContent: () => { subject: string; html: string }
}

export const onboardingEmails: EmailDefinition[] = [
  { type: 'welcome', delayDays: 0, getContent: getWelcomeEmail },
  { type: 'day1',    delayDays: 1, getContent: getDay1Email },
  { type: 'day3',    delayDays: 3, getContent: getDay3Email },
  { type: 'day5',    delayDays: 5, getContent: getDay5Email },
  { type: 'day7',    delayDays: 7, getContent: getDay7Email },
  { type: 'day10',   delayDays: 10, getContent: getDay10Email },
  { type: 'day14',   delayDays: 14, getContent: getDay14Email },
]

export function getEmailByType(type: EmailType) {
  return onboardingEmails.find(e => e.type === type)
}
