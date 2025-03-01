
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

// Mapping of common mathematical terms to LaTeX
const mathTerms = {
  'square root': '\\sqrt{#}',
  'squared': '^2',
  'cubed': '^3',
  'infinity': '\\infty',
  'sum': '\\sum',
  'integral': '\\int',
  'pi': '\\pi',
  'theta': '\\theta',
  'alpha': '\\alpha',
  'beta': '\\beta',
  'delta': '\\delta',
  'gamma': '\\gamma',
  'lambda': '\\lambda',
  'omega': '\\omega',
  'times': '\\times',
  'divided by': '\\div',
  'for all': '\\forall',
  'there exists': '\\exists',
  'greater than or equal to': '\\geq',
  'less than or equal to': '\\leq',
  'not equal': '\\neq',
  'approximately': '\\approx',
  'subset': '\\subset',
  'superset': '\\superset',
  'union': '\\cup',
  'intersection': '\\cap',
  'element of': '\\in',
  'not element of': '\\notin',
  'factorial': '!',
  'product': '\\prod',
};

// Basic conversion function
function convertToLatex(text: string): string {
  let result = text;
  
  // Replace math terms
  for (const [term, latex] of Object.entries(mathTerms)) {
    const regex = new RegExp(term, 'gi');
    result = result.replace(regex, latex);
  }
  
  // Handle specific patterns
  result = result
    .replace(/square root of ([^,]+)/gi, '\\sqrt{$1}')
    .replace(/cubed/gi, '^3')
    .replace(/squared/gi, '^2')
    .replace(/infinity/gi, '\\infty')
    .replace(/sum of ([^,]+)/gi, '\\sum $1')
    .replace(/integral of ([^,]+)/gi, '\\int $1')
    .replace(/for all ([a-z])/gi, '\\forall $1')
    .replace(/there exists ([a-z])/gi, '\\exists $1')
    .replace(/([a-z]) approaches ([a-z0-9]+)/gi, '$1 \\to $2')
    .replace(/([a-z]) choose ([a-z])/gi, '{$1 \\choose $2}')
    .replace(/product of ([^,]+) from ([a-z]) to ([a-z0-9]+)/gi, '\\prod_{$2}^{$3} $1');

  return result;
}

serve(async (req) => {
  try {
    const { text } = await req.json();
    
    if (!text) {
      return new Response(
        JSON.stringify({ error: 'No text provided' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Convert the text to LaTeX
    const latexFormula = convertToLatex(text);
    
    return new Response(
      JSON.stringify({ latexFormula }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
