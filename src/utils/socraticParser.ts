export interface ParsedSocraticResponse {
  conceptFeedback: string;
  hintExample?: string;
  yourTurn: string;
  isStructured: boolean;
  raw: string;
}

/**
 * Parses StudyBuddy's structured format:
 * **Concept / Feedback:** ...
 * **Hint or Example:** ...
 * **Your turn:** ...
 */
export function parseSocraticResponse(text: string): ParsedSocraticResponse {
  if (!text) {
    return {
      conceptFeedback: '',
      yourTurn: '',
      isStructured: false,
      raw: text,
    };
  }

  // Regex patterns to match the headers flexibly (with or without markdown bold or asterisks or headers)
  const conceptRegex = /(?:\*{1,3}|#{1,4}\s*)?Concept\s*(?:\/|&)\s*Feedback\s*:?(?:\*{1,3})?:?/i;
  const hintRegex = /(?:\*{1,3}|#{1,4}\s*)?Hint\s*(?:or|\/|&)\s*Example\s*:?(?:\*{1,3})?:?/i;
  const yourTurnRegex = /(?:\*{1,3}|#{1,4}\s*)?Your\s*turn\s*:?(?:\*{1,3})?:?/i;

  const hasConcept = conceptRegex.test(text);
  const hasYourTurn = yourTurnRegex.test(text);

  if (!hasConcept && !hasYourTurn) {
    return {
      conceptFeedback: text.trim(),
      yourTurn: '',
      isStructured: false,
      raw: text,
    };
  }

  let conceptFeedback = '';
  let hintExample = '';
  let yourTurn = '';

  // Find index of sections
  const conceptMatch = text.search(conceptRegex);
  const hintMatch = text.search(hintRegex);
  const yourTurnMatch = text.search(yourTurnRegex);

  if (conceptMatch !== -1) {
    const endConcept = hintMatch !== -1 ? hintMatch : (yourTurnMatch !== -1 ? yourTurnMatch : text.length);
    const conceptChunk = text.slice(conceptMatch, endConcept);
    conceptFeedback = conceptChunk.replace(conceptRegex, '').trim();
  }

  if (hintMatch !== -1) {
    const endHint = yourTurnMatch !== -1 ? yourTurnMatch : text.length;
    const hintChunk = text.slice(hintMatch, endHint);
    hintExample = hintChunk.replace(hintRegex, '').trim();
  }

  if (yourTurnMatch !== -1) {
    const yourTurnChunk = text.slice(yourTurnMatch);
    yourTurn = yourTurnChunk.replace(yourTurnRegex, '').trim();
  }

  // Clean out empty or "(none needed)" placeholder in hint
  if (
    hintExample.toLowerCase() === '(none needed)' ||
    hintExample.toLowerCase() === 'none' ||
    hintExample.toLowerCase() === '(if needed)' ||
    hintExample.toLowerCase() === 'n/a'
  ) {
    hintExample = '';
  }

  return {
    conceptFeedback: conceptFeedback || (hasYourTurn ? text.slice(0, yourTurnMatch).trim() : text.trim()),
    hintExample: hintExample || undefined,
    yourTurn: yourTurn || '',
    isStructured: true,
    raw: text,
  };
}
