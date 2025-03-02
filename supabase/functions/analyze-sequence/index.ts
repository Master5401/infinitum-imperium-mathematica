
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
    const { sequence } = await req.json();
    
    if (!sequence) {
      return new Response(
        JSON.stringify({ 
          error: "Missing sequence parameter" 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
    
    console.log("Analyzing sequence:", sequence);
    
    // Simple algorithm to detect common sequences
    // In a real application, you'd use a more sophisticated approach or an AI model
    const analysis = analyzeSequence(sequence);
    
    return new Response(
      JSON.stringify({
        analysis
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("Error analyzing sequence:", error);
    
    return new Response(
      JSON.stringify({
        error: "Failed to analyze sequence"
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});

function analyzeSequence(sequenceStr: string) {
  // Parse the sequence
  const numbers = sequenceStr
    .split(",")
    .map(s => s.trim())
    .filter(s => !s.includes("...")) // Remove ellipsis entries
    .map(s => parseFloat(s));
  
  if (numbers.length < 3) {
    return {
      pattern: "Unknown",
      description: "Need at least 3 terms to identify a pattern",
      formula: "Insufficient data",
      confidence: 0
    };
  }
  
  // Check for arithmetic sequence (constant difference)
  const firstDiff = numbers[1] - numbers[0];
  let isArithmetic = true;
  
  for (let i = 2; i < numbers.length; i++) {
    if (Math.abs((numbers[i] - numbers[i-1]) - firstDiff) > 0.0001) {
      isArithmetic = false;
      break;
    }
  }
  
  if (isArithmetic) {
    return {
      pattern: "Arithmetic Sequence",
      description: `Terms increase by a constant difference of ${firstDiff}`,
      formula: `a(n) = ${numbers[0]} + (n-1) * ${firstDiff}`,
      confidence: 0.9
    };
  }
  
  // Check for geometric sequence (constant ratio)
  const firstRatio = numbers[1] / numbers[0];
  let isGeometric = true;
  
  for (let i = 2; i < numbers.length; i++) {
    if (Math.abs((numbers[i] / numbers[i-1]) - firstRatio) > 0.0001) {
      isGeometric = false;
      break;
    }
  }
  
  if (isGeometric) {
    return {
      pattern: "Geometric Sequence",
      description: `Terms increase by a constant ratio of ${firstRatio.toFixed(2)}`,
      formula: `a(n) = ${numbers[0]} * ${firstRatio.toFixed(2)}^(n-1)`,
      confidence: 0.9
    };
  }
  
  // Check for square numbers
  let isSquare = true;
  for (let i = 0; i < numbers.length; i++) {
    if (Math.abs(Math.sqrt(numbers[i]) - Math.round(Math.sqrt(numbers[i]))) > 0.0001) {
      isSquare = false;
      break;
    }
  }
  
  if (isSquare) {
    return {
      pattern: "Square Numbers",
      description: "Each term is a perfect square",
      formula: "a(n) = n²",
      confidence: 0.8
    };
  }
  
  // Check for Fibonacci-like sequence (each term is the sum of the two preceding ones)
  let isFibonacci = true;
  for (let i = 2; i < numbers.length; i++) {
    if (Math.abs((numbers[i-1] + numbers[i-2]) - numbers[i]) > 0.0001) {
      isFibonacci = false;
      break;
    }
  }
  
  if (isFibonacci) {
    return {
      pattern: "Fibonacci-like Sequence",
      description: "Each term is the sum of the two preceding terms",
      formula: `F(n) = F(n-1) + F(n-2) with F(1) = ${numbers[0]}, F(2) = ${numbers[1]}`,
      confidence: 0.85
    };
  }
  
  // Check for cubic numbers
  let isCubic = true;
  for (let i = 0; i < numbers.length; i++) {
    const cbrt = Math.cbrt(numbers[i]);
    if (Math.abs(cbrt - Math.round(cbrt)) > 0.0001) {
      isCubic = false;
      break;
    }
  }
  
  if (isCubic) {
    return {
      pattern: "Cubic Numbers",
      description: "Each term is a perfect cube",
      formula: "a(n) = n³",
      confidence: 0.8
    };
  }
  
  // If no specific pattern is recognized
  return {
    pattern: "Complex Pattern",
    description: "This appears to be a more complex or custom sequence",
    formula: "Could not determine a simple formula",
    confidence: 0.3
  };
}
