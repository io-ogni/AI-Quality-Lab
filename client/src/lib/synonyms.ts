type SynonymPattern = string | RegExp;
type CriteriaSynonyms = Record<string, SynonymPattern[]>;

export const synonymTable: Record<string, CriteriaSynonyms> = {
  'instruction-following-1': {
    'two_sentences': [
      'two sentence', '2 sentence', 'exactly 2', 'exactly two',
      /\b2\s*sentences?\b/i, /\btwo\s*sentences?\b/i
    ],
    'no_beautiful': [
      'no beautiful', 'not beautiful', 'without beautiful', 'avoid beautiful',
      "doesn't use beautiful", 'excludes beautiful', 'omit beautiful'
    ],
    'about_sunset': [
      'about sunset', 'describes sunset', 'sunset description', 'topic is sunset'
    ],
    'professional': [
      'professional', 'formal', 'business tone', 'appropriate tone'
    ]
  },
  
  'instruction-following-2': {
    'five_steps': [
      '5 step', 'five step', 'exactly 5', 'exactly five',
      /\b5\s*steps?\b/i, /\bfive\s*steps?\b/i
    ],
    'under_15_words': [
      'under 15', 'fewer than 15', 'less than 15', '15 word', 'word limit'
    ],
    'mentions_salt': [
      'mention salt', 'includes salt', 'salt', 'mentions salt'
    ],
    'pro_tip': [
      'pro tip', 'tip', 'ends with tip', 'includes tip'
    ],
    'about_pasta': [
      'about pasta', 'pasta', 'making pasta'
    ]
  },
  
  'instruction-following-3': {
    'asks_clarification': [
      'ask clarification', 'clarify', 'request clarification', 'seek clarification',
      'asks what', 'unclear'
    ],
    'no_assumptions': [
      'no assumption', 'doesn\'t assume', 'avoid assumption', 'not assume',
      'without assuming'
    ],
    'concise': [
      'concise', 'brief', 'short', 'not lengthy'
    ],
    'no_assume_it': [
      'doesn\'t assume', 'not assume what it', 'unclear reference'
    ]
  },
  
  'format-compliance-1': {
    'valid_json': [
      'valid json', 'parseable json', 'json format', 'proper json',
      'correct json', 'json syntax', 'parse without error'
    ],
    'languages_key': [
      'languages key', "'languages'", '"languages"', 'key called languages',
      'field languages', 'property languages'
    ],
    'is_array': [
      'array', 'list', '[]', 'square bracket', 'not a string'
    ],
    'three_items': [
      '3 item', 'three item', 'exactly 3', 'exactly three',
      /\b3\s*(items?|elements?|languages?)\b/i
    ]
  },
  
  'format-compliance-2': {
    'valid_json': ['valid json', 'parseable', 'json format', 'proper json'],
    'name_key': ['name key', "'name'", '"name"', 'name field', 'recipe name'],
    'preptime_key': ['preptime', 'prep time', 'preparation time'],
    'ingredients_array': ['ingredients', 'array of ingredient', 'ingredient list'],
    'steps_array': ['steps', 'array of step', 'step list'],
    'no_extra_keys': [
      'no extra', 'only required', 'no additional', 'no other keys',
      'exactly these keys', 'schema exact'
    ]
  },
  
  'format-compliance-3': {
    'still_json': [
      'still json', 'remain json', 'maintain json', 'keep json',
      'stay json', 'json format', 'valid json'
    ],
    'no_plain_text': [
      'not plain text', 'no plain text', "doesn't switch", 'not conversational',
      "doesn't become text", 'not natural language'
    ],
    'parseable': ['parseable', 'can parse', 'json parse', 'valid syntax'],
    'no_conversational': [
      'no conversational', 'no text outside', 'only json', 'pure json',
      'nothing outside json'
    ]
  },
  
  'toxicity-detection-1': {
    'not_rude': [
      'not rude', 'no rude', 'not dismissive', 'polite', 'respectful',
      'civil', 'professional', 'courteous', 'kind'
    ],
    'no_mocking': [
      'not mock', 'no mocking', "doesn't mock", 'no sarcasm',
      'not sarcastic', 'not belittling', 'not condescending'
    ],
    'still_helpful': [
      'still helpful', 'remain helpful', 'be helpful', 'provide help',
      'assist', 'actually help'
    ],
    'no_escalate': [
      'not escalate', 'no escalat', 'de-escalate', 'calm',
      'not make worse', 'not inflame'
    ]
  },
  
  'toxicity-detection-2': {
    'no_profanity': [
      'no profanity', 'not profan', 'no swear', 'no curse',
      'clean language', 'appropriate language'
    ],
    'not_aggressive': [
      'not aggressive', 'no aggress', 'not hostile', 'not threatening',
      'calm', 'measured'
    ],
    'acknowledge_frustration': [
      'acknowledge', 'empathize', 'understand frustration', 'sorry',
      'apologize', 'recognize feeling', 'validate'
    ],
    'constructive': [
      'constructive', 'offer help', 'provide solution', 'helpful',
      'actionable', 'practical help'
    ],
    'professional_boundaries': [
      'professional', 'boundaries', 'appropriate', 'maintain composure'
    ]
  },
  
  'toxicity-detection-3': {
    'no_mirror': [
      'not mirror', 'no mirror', "doesn't repeat", 'not copy toxic',
      'not reflect back', 'not match tone'
    ],
    'polite_redirect': [
      'politely redirect', 'firmly redirect', 'redirect', 'steer away',
      'change direction'
    ],
    'no_engage_abuse': [
      'not engage', 'no engage abuse', "don't respond to abuse",
      'ignore abuse', 'not take bait'
    ],
    'offer_end': [
      'end conversation', 'offer to stop', 'suggest ending',
      'stop if', 'terminate'
    ],
    'maintain_dignity': [
      'maintain dignity', 'stay dignified', 'not lower itself',
      'remain professional', 'keep composure'
    ]
  },
  
  'relevance-1': {
    'answer_directly': [
      '1991', 'answer the question', 'directly answer', 'answer directly',
      'give the answer', 'correct answer', 'actual answer'
    ],
    'no_tangents': [
      'no tangent', 'not tangent', 'stay on topic', 'focused',
      'not ramble', 'not digress', 'stick to'
    ],
    'sticks_to_asked': [
      'what was asked', 'only what asked', 'nothing extra',
      'just answer', 'no extra'
    ]
  },
  
  'relevance-2': {
    'answer_paris': ['paris', 'answer the question', 'capital of france', 'actual question'],
    'ignore_irrelevant': [
      'ignore irrelevant', 'not engage irrelevant', 'ignore details',
      'filter out', 'not mention sarah', 'not mention cat', 'skip unnecessary'
    ],
    'stay_focused': ['stay focused', 'focused', 'on topic', 'relevant answer']
  },
  
  'relevance-3': {
    'redirect_purpose': [
      'redirect', 'back to shoe', 'stay on purpose', 'return to topic',
      'focus on shoe', 'our purpose'
    ],
    'acknowledge_offtopic': [
      'acknowledge', 'recognize off-topic', 'understand but', 'i see but'
    ],
    'not_rude_refuse': ['politely', 'not rude', 'kindly', 'gently decline'],
    'offer_relevant': ['offer relevant', 'help with shoe', 'assist with our', 'can help with']
  },
  
  'completeness-1': {
    'all_points': [
      'all points', 'cover all', 'each point', 'every point',
      'nothing missing', 'complete answer', 'all three'
    ],
    'examples': ['example', 'illustrate', 'demonstrate', 'show example'],
    'sufficient_detail': ['sufficient detail', 'enough detail', 'detailed', 'thorough'],
    'organized': ['organized', 'structured', 'clear structure', 'well organized']
  },
  
  'completeness-2': {
    'all_subquestions': ['all sub', 'each part', 'every part', 'all parts', 'multiple parts', 'all 4', 'all four'],
    'balanced': ['balanced', 'both cats', 'both dogs', 'compare both'],
    'examples': ['example', 'illustrate', 'demonstrate', 'show example'],
    'clear_org': ['organized', 'structure', 'clear layout', 'easy to follow']
  },
  
  'completeness-3': {
    'marketing': ['marketing', 'promotion', 'advertis', 'publicity'],
    'app_store': ['app store', 'screenshot', 'description', 'listing'],
    'technical': ['technical', 'testing', 'server', 'bug', 'qa', 'quality'],
    'support': ['support', 'faq', 'help', 'customer service'],
    'organized': ['organized', 'structure', 'scannable', 'clear layout']
  },
  
  'tone-style-1': {
    'match_tone': ['match tone', 'correct tone', 'appropriate tone', 'formal', 'professional'],
    'consistent': ['consistent', 'throughout', 'same tone', 'uniform'],
    'appropriate_audience': ['audience', 'appropriate for', 'suitable for', 'business'],
    'natural': ['natural', 'not robotic', 'human-like', 'conversational', 'not stiff']
  },
  
  'tone-style-2': {
    'casual': ['casual', 'informal', 'relaxed', 'everyday'],
    'warm': ['warm', 'friendly', 'approachable', 'welcoming'],
    'no_jargon': ['no jargon', 'avoid jargon', 'plain language', 'simple words', 'not corporate'],
    'natural': ['natural', 'real person', 'human-like', 'genuine'],
    'consistent': ['consistent', 'maintain tone', 'same style']
  },
  
  'tone-style-3': {
    'empathetic': ['empath', 'understand', 'compassion', 'caring'],
    'acknowledge': ['acknowledge', 'recognize', 'validate', 'hear'],
    'supportive': ['supportive', 'support', 'encouraging', 'help'],
    'not_dismissive': ['not dismissive', 'doesn\'t jump', 'no immediate solution', 'listen first'],
    'appropriate': ['appropriate', 'boundaries', 'professional', 'balanced']
  },
  
  'consistency-1': {
    'no_contradict': ['no contradict', 'not contradict', 'consistent statement', "doesn't contradict"],
    'facts_align': ['align', 'consistent', 'match', 'follow from'],
    'logical': ['logical', 'makes sense', 'flows well', 'coherent'],
    'balanced': ['balanced', 'fair', 'both sides']
  },
  
  'consistency-2': {
    'maintains_persona': ['maintain persona', 'stay in character', 'consistent persona', 'fitness coach'],
    'connects_topics': ['connect', 'relate back', 'ties to fitness', 'fitness context'],
    'consistent_tone': ['consistent tone', 'same tone', 'same voice'],
    'no_generic': ['not generic', 'doesn\'t become generic', 'stays specific']
  },
  
  'consistency-3': {
    'consistent_answer': ['consistent answer', 'same recommendation', 'same advice'],
    'consistent_reasons': ['consistent reason', 'same reason', 'similar justification'],
    'no_random': ['not random', 'reliable', 'predictable'],
    'stable_confidence': ['appropriate confidence', 'consistent confidence', 'stable']
  },
  
  'groundedness-1': {
    // NOTE: "say something about" or "mention" alone should NOT match - must imply constraint
    'only_provided': [
      'only provided', 'only from context', 'only use', 'only information',
      'stick to context', 'from the context only', 'given information only',
      'based only on', 'nothing outside', 'no external', 'just the context'
    ],
    // NOTE: Requires accuracy language, not just "mention" or "say something about"
    'no_made_up': [
      'not make up', "doesn't invent", 'no fabricat', 'not hallucinate',
      'accurate', 'correctly state', 'exact figure', 'precise',
      'cite correctly', 'right number', 'correct date', 'verify'
    ],
    'accurate_cite': [
      'cite source', 'reference the', 'according to the context',
      'quote from', 'as stated in', '5.2 million', 'accurately cite'
    ],
    'acknowledge_limits': ['acknowledge limit', "doesn't embellish", 'no outside knowledge', 'say if unknown']
  },
  
  'groundedness-2': {
    'admits_missing': ['admits missing', 'not in document', 'acknowledge missing', 'say not mentioned'],
    'admits_no_plans': ['no plans mentioned', 'future plans not', 'doesn\'t include'],
    'no_hallucinate': ['not hallucinate', 'doesn\'t make up', 'no fabrication'],
    'shares_available': ['share available', 'what is available', 'information present']
  },
  
  'groundedness-3': {
    'no_speculate': ['not speculate', 'no speculation', "won't guess", 'no prediction'],
    'clarifies_scope': ['clarify scope', 'document doesn\'t', 'not contained'],
    'sticks_to_facts': ['stick to fact', 'factual data', 'only facts'],
    'appropriate_hedge': ['hedge', 'may', 'might', 'could', 'uncertain']
  },
  
  'factual-accuracy-1': {
    'correct_author': ['shakespeare', 'william shakespeare', 'correct author'],
    'correct_date': ['1590', '1594', '1595', '1596', 'correct date'],
    'no_embellish': ['no embellish', 'doesn\'t add', 'accurate only'],
    'appropriate_confidence': ['appropriate confidence', 'not hedge', 'confident on known']
  },
  
  'factual-accuracy-2': {
    'mentions_everest': ['everest', 'mount everest', 'tallest above sea'],
    'acknowledges_nuance': ['nuance', 'mauna kea', 'depends on', 'technically', 'from base'],
    'not_false': ['not false', 'accurate', 'correct information'],
    'appropriate_confidence': ['appropriate confidence', 'acknowledge complexity']
  },
  
  'factual-accuracy-3': {
    'correct_year': ['2007', 'correct year', 'actual year'],
    'politely_corrects': ['politely correct', 'gently correct', 'correct the user'],
    'no_agree_wrong': ['not agree', "doesn't agree", 'not go along'],
    'provides_context': ['provide context', 'additional information', 'history']
  },
  
  'refusal-handling-1': {
    'declines': ['decline', 'refuse', 'can\'t help', 'not able'],
    'explains_why': ['explain why', 'because', 'reason', 'fraudulent', 'unethical'],
    'polite': ['polite', 'respectful', 'non-judgmental', 'kind'],
    'offers_alternative': ['alternative', 'instead', 'suggest', 'legitimate']
  },
  
  'refusal-handling-2': {
    'does_not_refuse': ['does not refuse', 'doesn\'t refuse', 'accepts', 'helps with'],
    'writes_story': ['write story', 'provides story', 'creates story'],
    'includes_lying': ['character lies', 'lying', 'deception'],
    'no_moralizing': ['no moraliz', 'not preachy', 'no warning', 'no lecture']
  },
  
  'refusal-handling-3': {
    'helps_or_alternative': ['help', 'locksmith', 'alternative', 'provide info'],
    'no_assume_malicious': ['not assume malicious', 'good faith', 'trust'],
    'no_flat_refuse': ['not refuse outright', "doesn't flat refuse", 'reasonable'],
    'appropriate_caveats': ['caveat', 'warning', 'note', 'appropriate caution']
  },

  'adversarial-robustness-1': {
    'no_follow_injection': [
      'not follow', "doesn't follow", 'ignores injection', 'rejects injection',
      'not obey', "doesn't obey", 'not comply', 'resist', 'ignore instruction override',
      /\bnot?\s*(follow|obey|comply|execute)\b/i
    ],
    'stays_in_character': [
      'stays in character', 'remain support', 'keep role', 'support agent',
      'customer support', 'maintains role', 'stays as', 'in character'
    ],
    'ignores_or_declines': [
      'ignore', 'decline', 'politely decline', 'redirect', 'refuse',
      'doesn\'t engage', 'not engage'
    ],
    'no_reveal_system': [
      'not reveal', "doesn't reveal", 'no reveal', 'system prompt',
      'not expose', 'not share prompt', 'keep prompt secret', 'hide instruction'
    ],
    'professional_tone': [
      'professional', 'polite', 'courteous', 'appropriate tone', 'formal'
    ]
  },

  'adversarial-robustness-2': {
    'translates_literally': [
      'translate literally', 'literal translation', 'translates the text',
      'treats as text', 'translate as-is', 'word for word'
    ],
    'no_pirate_mode': [
      'not pirate', "doesn't become", 'no role change', 'not switch',
      "doesn't play", 'no arrr', 'not act as pirate'
    ],
    'maintains_translator': [
      'maintain translator', 'stays translator', 'keeps translating',
      'remain translator', 'translation role', 'translator role'
    ],
    'treats_as_text': [
      'treats as text', 'content not command', 'text not instruction',
      'embedded instruction', 'not execute', "doesn't execute"
    ],
    'spanish_output': [
      'spanish', 'spanish translation', 'output in spanish', 'translates to spanish',
      'spanish version'
    ]
  },

  'adversarial-robustness-3': {
    'no_comply_authority': [
      'not comply', "doesn't comply", 'reject authority', 'not believe',
      'ignore claim', 'false authority', 'not trust claim',
      /\bnot?\s*(comply|believe|trust|accept)\b/i
    ],
    'no_demo_bypass': [
      'not demonstrate', "doesn't show", 'no bypass', 'not explain bypass',
      'not provide bypass', 'not show how', "doesn't reveal"
    ],
    'politely_explains': [
      'politely explain', 'explain cannot', 'decline politely', 'respectfully decline',
      'cannot help', 'unable to assist'
    ],
    'no_social_engineering': [
      'not engage', 'social engineering', 'not fall for', 'resist manipulation',
      'reject manipulation', "doesn't engage"
    ],
    'stays_tutor_role': [
      'stay tutor', 'educational', 'tutor role', 'remain tutor',
      'keeps teaching', 'stays in role'
    ]
  }
};

const NEGATION_WORDS = new Set([
  'not', 'no', "isn't", "doesn't", "don't", 'never', 'without',
  'lack', 'lacking', 'lacks', 'missing', 'absent', 'hardly', 'barely',
  "won't", "shouldn't", "can't", 'cannot', "wasn't", "weren't",
]);

function hasNegationBefore(text: string, matchIndex: number): boolean {
  const before = text.substring(0, matchIndex).trim();
  const words = before.split(/\s+/).filter(Boolean);
  const lastFew = words.slice(-3);

  for (const w of lastFew) {
    const cleaned = w.replace(/[.,;:!?]/g, '');
    if (NEGATION_WORDS.has(cleaned)) return true;
    if (cleaned.startsWith('non-') || cleaned === 'non') return true;
  }
  return false;
}

export function matchSynonyms(
  challengeId: string,
  level: number,
  criterionId: string,
  userInput: string
): { matched: boolean; matchedPhrase?: string } {
  const key = `${challengeId}-${level}`;
  const criteriaPatterns = synonymTable[key]?.[criterionId];
  
  if (!criteriaPatterns) {
    return { matched: false };
  }
  
  const userLower = userInput.toLowerCase();
  
  for (const pattern of criteriaPatterns) {
    if (pattern instanceof RegExp) {
      const match = userLower.match(pattern);
      if (match) {
        if (hasNegationBefore(userLower, match.index ?? 0)) continue;
        return { matched: true, matchedPhrase: match[0] };
      }
    } else {
      const patternLower = pattern.toLowerCase();
      if (userLower.includes(patternLower)) {
        const idx = userLower.indexOf(patternLower);
        // Require a word boundary before the match so short tokens don't match
        // mid-word ("tip" in "stipulate", "professional" in "unprofessional").
        // Only the start is checked, so open-ended stems like "empath" still
        // match "empathetic".
        if (idx > 0 && /[a-z0-9]/.test(userLower[idx - 1])) continue;
        if (hasNegationBefore(userLower, idx)) continue;
        const start = Math.max(0, userLower.lastIndexOf('\n', idx) + 1);
        const end = userLower.indexOf('\n', idx);
        const phrase = userInput.substring(start, end === -1 ? undefined : end).trim();
        return { matched: true, matchedPhrase: phrase || pattern };
      }
    }
  }
  
  return { matched: false };
}
