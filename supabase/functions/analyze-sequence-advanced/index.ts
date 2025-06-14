
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
          analysis: "AI analysis is currently unavailable. Please check back later." 
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const systemPrompt = `You are a brilliant mathematician and sequence analyst. You specialize in:
    - Identifying patterns in mathematical sequences
    - Explaining mathematical concepts clearly and engagingly
    - Providing insights into sequence properties and relationships
    - Connecting sequences to broader mathematical concepts
    
    Always be precise, educational, and inspiring. Format your responses to be clear and engaging.
    
    Current sequence: ${sequence}
    Context: ${context || 'general analysis'}`;

    const userPrompt = question || `Analyze this sequence: ${sequence}. What patterns do you observe? What mathematical principles govern this sequence? Provide insights that would help someone understand and appreciate the underlying mathematics.`;

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
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const analysis = data.choices[0]?.message?.content || "I'm unable to analyze this sequence right now.";

    return new Response(
      JSON.stringify({ analysis }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in analyze-sequence-advanced function:", error);
    
    return new Response(
      JSON.stringify({
        analysis: "I'm experiencing technical difficulties. Please try again in a moment."
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
