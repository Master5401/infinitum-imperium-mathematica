
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

// List of possible analyses
const analysisPhrases = [
  "This sequence exhibits fascinating mathematical properties with potential applications in {field}.",
  "The pattern reveals an elegant structure related to {concept} theory.",
  "I've detected a connection to {concept}, suggesting deep mathematical significance.",
  "This sequence appears to follow principles from {field}, with remarkable consistency.",
  "Analysis reveals similarities to {concept}, though with novel characteristics.",
  "The mathematical structure suggests connections to both {concept} and {field}.",
  "This sequence demonstrates properties of {concept} with interesting implications for {field}.",
  "The pattern follows a fascinating progression related to {concept} mathematics.",
  "I've identified characteristics of {concept} with unique variations that merit further study.",
  "This sequence appears to be a variant of {concept} with implications for {field} research."
];

const mathematicalConcepts = [
  "fractal", "recursive", "exponential", "logarithmic", "prime number", 
  "Fibonacci", "combinatorial", "harmonic", "geometric", "algebraic",
  "transcendental", "number-theoretic", "topological", "chaotic", "dynamical",
  "ergodic", "elliptic curve", "modular form", "zeta function", "quaternion"
];

const mathematicalFields = [
  "number theory", "complex analysis", "topology", "abstract algebra", 
  "combinatorics", "cryptography", "information theory", "quantum computing",
  "chaos theory", "dynamical systems", "statistical mechanics", "graph theory",
  "category theory", "knot theory", "game theory", "optimization", "differential geometry",
  "algebraic geometry", "probability theory", "mathematical physics"
];

function generateAnalysis(formula: string, latexFormula: string): string {
  const randomPhrase = analysisPhrases[Math.floor(Math.random() * analysisPhrases.length)];
  const randomConcept = mathematicalConcepts[Math.floor(Math.random() * mathematicalConcepts.length)];
  const randomField = mathematicalFields[Math.floor(Math.random() * mathematicalFields.length)];
  
  // Substitute placeholders
  return randomPhrase
    .replace('{concept}', randomConcept)
    .replace('{field}', randomField);
}

serve(async (req) => {
  try {
    const { formula, latexFormula } = await req.json();
    
    if (!formula) {
      return new Response(
        JSON.stringify({ error: 'No formula provided' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Generate an analysis
    const analysis = generateAnalysis(formula, latexFormula || '');
    
    return new Response(
      JSON.stringify({ analysis }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
