
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

interface Challenge {
  sequence: string;
  hints: string[];
  difficulty: number;
  solution: string;
}

// Collection of possible challenges
const challengeCollection: Challenge[] = [
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
    sequence: "1, 1, 2, 3, 5, 8, 13, 21, ...",
    hints: [
      "Look for a pattern in consecutive terms",
      "Consider the sum of previous terms",
      "Each term is the sum of the two terms that precede it"
    ],
    difficulty: 3,
    solution: "The Fibonacci sequence: a(n) = a(n-1) + a(n-2) with a(1) = a(2) = 1"
  },
  {
    sequence: "1, 3, 6, 10, 15, 21, ...",
    hints: [
      "These are known as triangular numbers",
      "Think about how many points are needed to form an equilateral triangle",
      "The nth term is the sum of the first n natural numbers"
    ],
    difficulty: 4,
    solution: "a(n) = n(n+1)/2"
  },
  {
    sequence: "1, 4, 9, 16, 25, 36, ...",
    hints: [
      "These numbers have a special geometric meaning",
      "Think about areas",
      "Each number is a perfect square"
    ],
    difficulty: 2,
    solution: "a(n) = n²"
  },
  {
    sequence: "2, 3, 5, 7, 11, 13, 17, 19, ...",
    hints: [
      "These numbers have a special property",
      "Each is divisible only by 1 and itself",
      "These are the prime numbers"
    ],
    difficulty: 3,
    solution: "a(n) = the nth prime number"
  },
  {
    sequence: "1, 11, 21, 1211, 111221, 312211, ...",
    hints: [
      "Look at the digits, not just the numerical value",
      "Each term is a description of the previous term",
      "Read the digits of the previous term aloud: 'one 1' becomes 11, 'two 1s' becomes 21, etc."
    ],
    difficulty: 8,
    solution: "The Look-and-Say sequence: each term describes the digits of the previous term"
  },
  {
    sequence: "0, 1, 1, 2, 4, 7, 13, 24, 44, ...",
    hints: [
      "Unlike Fibonacci, this uses more than the previous two terms",
      "Each term is the sum of the three previous terms",
      "a(n) = a(n-1) + a(n-2) + a(n-3)"
    ],
    difficulty: 5,
    solution: "The Tribonacci sequence: a(n) = a(n-1) + a(n-2) + a(n-3) with a(0) = 0, a(1) = a(2) = 1"
  },
  {
    sequence: "3, 7, 31, 127, 8191, 131071, ...",
    hints: [
      "These numbers have a binary representation of all 1s",
      "Each number is one less than a power of 2",
      "These are the Mersenne numbers"
    ],
    difficulty: 9,
    solution: "a(n) = 2^n - 1, where n is a prime number"
  }
];

// CORS headers for browser requests
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
    console.log("Generating daily challenge");
    
    // Select a random challenge from the collection
    const randomIndex = Math.floor(Math.random() * challengeCollection.length);
    const challenge = challengeCollection[randomIndex];
    
    console.log(`Selected challenge: ${challenge.sequence}`);
    
    // Return the challenge with CORS headers
    return new Response(
      JSON.stringify({
        challenge,
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error("Error generating challenge:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
