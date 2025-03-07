
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
    const { formula } = await req.json();
    
    if (!formula) {
      return new Response(
        JSON.stringify({ 
          error: "Missing formula parameter" 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
    
    console.log("Converting formula to LaTeX:", formula);
    
    // Convert formula to LaTeX
    const latex = convertToLatex(formula);
    
    return new Response(
      JSON.stringify({
        latex
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("Error converting to LaTeX:", error);
    
    return new Response(
      JSON.stringify({
        error: "Failed to convert formula to LaTeX"
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});

function convertToLatex(formula: string): string {
  // This is a basic conversion - in a real application, you would use a more sophisticated method
  // or an AI model for more complex formulas
  
  let latex = formula
    // Replace powers
    .replace(/\^(\d+)/g, "^{$1}")
    .replace(/\^([a-zA-Z])/g, "^{$1}")
    
    // Replace square roots
    .replace(/sqrt\(([^)]+)\)/g, "\\sqrt{$1}")
    
    // Replace fractions
    .replace(/(\d+)\/(\d+)/g, "\\frac{$1}{$2}")
    
    // Replace common mathematical functions
    .replace(/sin/g, "\\sin")
    .replace(/cos/g, "\\cos")
    .replace(/tan/g, "\\tan")
    .replace(/log/g, "\\log")
    .replace(/ln/g, "\\ln")
    
    // Replace infinity
    .replace(/infinity/g, "\\infty")
    .replace(/inf/g, "\\infty")
    
    // Replace common symbols
    .replace(/pi/g, "\\pi")
    .replace(/theta/g, "\\theta")
    .replace(/alpha/g, "\\alpha")
    .replace(/beta/g, "\\beta")
    .replace(/gamma/g, "\\gamma")
    .replace(/delta/g, "\\delta")
    .replace(/epsilon/g, "\\epsilon")
    
    // Special cases for perfect numbers
    .replace(/sum of its divisors/gi, "\\sum_{d|n, d \\neq n} d = n")
    
    // Special cases for Armstrong numbers
    .replace(/sum of its digits/gi, "\\sum_{i} d_i")
    .replace(/each digit raised to power/gi, "\\sum_{i} d_i^k")
    
    // Special cases for Harshad numbers
    .replace(/divisible by the sum of its digits/gi, "n \\mod (\\sum_{i} d_i) = 0");
  
  return latex;
}
