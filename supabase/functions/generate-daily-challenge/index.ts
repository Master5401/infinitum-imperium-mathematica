
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Generating a new daily challenge");
    
    // We'll generate a random sequence and difficulty level
    const sequences = [
      {
        sequence: "1, 1, 2, 3, 5, 8, 13, 21, ...",
        hints: [
          "Add the two previous terms to get the next one",
          "It's a famous sequence named after an Italian mathematician",
          "The ratio of consecutive terms approaches the golden ratio"
        ],
        difficulty: 3,
        solution: "Fibonacci sequence: F(n) = F(n-1) + F(n-2) with F(0) = 0, F(1) = 1"
      },
      {
        sequence: "1, 4, 9, 16, 25, 36, ...",
        hints: [
          "Look at the pattern of differences between consecutive terms",
          "Think about operations that result in these values",
          "Think of geometric shapes"
        ],
        difficulty: 2,
        solution: "Square numbers: a(n) = n²"
      },
      {
        sequence: "2, 3, 5, 7, 11, 13, 17, ...",
        hints: [
          "These are numbers with special divisibility properties",
          "Each number has exactly two factors",
          "These numbers are only divisible by 1 and themselves"
        ],
        difficulty: 2,
        solution: "Prime numbers: numbers with exactly two factors (1 and themselves)"
      },
      {
        sequence: "1, 3, 6, 10, 15, 21, ...",
        hints: [
          "Look at the differences between consecutive terms",
          "The differences form their own sequence",
          "Think about summing up numbers"
        ],
        difficulty: 3,
        solution: "Triangular numbers: T(n) = n(n+1)/2 = sum of numbers from 1 to n"
      },
      {
        sequence: "0, 1, 1, 2, 3, 5, 8, 13, 21, ...",
        hints: [
          "The first two terms are fixed",
          "Each subsequent term is the sum of the two preceding ones",
          "It's related to the golden ratio"
        ],
        difficulty: 3,
        solution: "Fibonacci sequence starting from 0: F(0) = 0, F(1) = 1, F(n) = F(n-1) + F(n-2) for n > 1"
      },
      {
        sequence: "1, 2, 6, 24, 120, 720, ...",
        hints: [
          "Each term is related to the previous term by multiplication",
          "Think about multiplying by an increasing value",
          "This sequence is important in combinatorics"
        ],
        difficulty: 4,
        solution: "Factorial sequence: n! = n × (n-1) × ... × 2 × 1"
      },
      {
        sequence: "2, 4, 8, 16, 32, 64, ...",
        hints: [
          "Each term is double the previous term",
          "Think about powers",
          "This sequence grows exponentially"
        ],
        difficulty: 1,
        solution: "Powers of 2: a(n) = 2^n"
      },
      {
        sequence: "3, 9, 27, 81, 243, ...",
        hints: [
          "Each term is triple the previous term",
          "Think about powers",
          "This is an exponential sequence"
        ],
        difficulty: 2,
        solution: "Powers of 3: a(n) = 3^n"
      },
      {
        sequence: "2, 4, 16, 256, 65536, ...",
        hints: [
          "Consider powers",
          "Look at how each term relates to the previous one",
          "Each term is the previous term raised to a power of 2"
        ],
        difficulty: 7,
        solution: "a(n) = 2^(2^(n-1)) for n ≥ 1"
      },
      {
        sequence: "1, 4, 27, 256, 3125, ...",
        hints: [
          "These numbers are related to powers",
          "Consider the relationship between the position and the value",
          "Think about exponentials"
        ],
        difficulty: 5,
        solution: "Powers: a(n) = n^n"
      }
    ];
    
    // Select a random sequence
    const randomIndex = Math.floor(Math.random() * sequences.length);
    const challenge = sequences[randomIndex];
    
    console.log("Generated challenge:", challenge);
    
    return new Response(
      JSON.stringify({
        challenge
      }),
      {
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json" 
        },
      }
    );
  } catch (error) {
    console.error("Error generating challenge:", error);
    
    return new Response(
      JSON.stringify({
        error: "Failed to generate challenge"
      }),
      {
        status: 500,
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json" 
        },
      }
    );
  }
});
