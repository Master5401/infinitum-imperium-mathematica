
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sequence, question, context } = await req.json();

    if (!openAIApiKey) {
      return new Response(
        JSON.stringify({ 
          analysis: "AI analysis is currently unavailable. The OpenAI API key is not configured. Please check back later." 
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const systemPrompt = `You are an expert mathematician and sequence analyst with deep knowledge of:
    - Number theory and mathematical sequences (Fibonacci, primes, triangular, etc.)
    - Pattern recognition and mathematical relationships
    - OEIS (Online Encyclopedia of Integer Sequences) database
    - Advanced mathematical concepts and their applications
    
    Provide clear, educational, and insightful analysis. Be engaging and help users understand the beauty of mathematics.
    
    Sequence being analyzed: ${sequence}
    Analysis context: ${context || 'daily mathematical challenge'}`;

    const userPrompt = question || `Please analyze this mathematical sequence: ${sequence}

    Provide a comprehensive analysis including:
    1. Pattern identification and mathematical rule
    2. Next few terms if possible
    3. Mathematical properties and significance
    4. Connections to famous sequences or mathematical concepts
    5. Any interesting observations or insights
    
    Make your explanation clear and educational.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1200,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenAI API error: ${response.status} - ${errorText}`);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const analysis = data.choices[0]?.message?.content || "I'm unable to provide a detailed analysis of this sequence right now. Please try again later.";

    return new Response(
      JSON.stringify({ analysis }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in analyze-sequence function:", error);
    
    return new Response(
      JSON.stringify({
        analysis: "I'm experiencing technical difficulties analyzing this sequence. This could be due to API limitations or connectivity issues. Please try again in a few moments."
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
