
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.33.1";

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // First check if we already have a challenge for today
    const today = new Date().toISOString().split('T')[0];
    const { data: existingChallenge } = await supabase
      .from('daily_challenges')
      .select('*')
      .eq('date', today)
      .single();

    if (existingChallenge) {
      console.log("Found existing challenge for today");
      return new Response(JSON.stringify({ challenge: existingChallenge }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // If no challenge exists for today, generate a new one
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': geminiApiKey,
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Generate a challenging mathematical sequence puzzle with a hidden pattern. 
                   Format the response as a JSON object with these fields:
                   - sequence: string (the sequence to solve, just numbers separated by commas)
                   - hints: array of strings (3 helpful hints of increasing clarity for solving)
                   - difficulty: number (1-10)
                   - solution: string (detailed explanation of the pattern)
                   Make it engaging and educational for mathematics enthusiasts.`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    });

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    
    // Extract JSON from the response text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const challenge = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

    if (!challenge) {
      throw new Error("Failed to parse challenge from AI response");
    }

    // Insert the new challenge into the database
    const { data: savedChallenge, error } = await supabase
      .from('daily_challenges')
      .insert([challenge])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return new Response(JSON.stringify({ challenge: savedChallenge }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-daily-challenge function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
