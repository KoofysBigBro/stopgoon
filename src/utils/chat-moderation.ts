const BAD_WORDS = [
  'fuck', 'shit', 'bitch', 'cunt', 'nigger', 'nigga', 'faggot', 'dick', 'cock', 'pussy',
  'whore', 'slut', 'retard', 'porn', 'rape', 'asshole', 'motherfucker', 'bastard', 'fag', 'dyke'
];

function escapeRegExp(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function filterMessageContent(input: string): string {
  let filtered = input;
  for (const word of BAD_WORDS) {
    const regex = new RegExp(`\\b${escapeRegExp(word)}\\b`, 'gi');
    filtered = filtered.replace(regex, (match) => '*'.repeat(match.length));
  }
  return filtered;
}
