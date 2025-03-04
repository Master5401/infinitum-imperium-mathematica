
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Create Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseKey);

interface OEISSequence {
  id: string;
  number: string;
  name: string;
  description: string;
  values: string;
  formula?: string;
}

// Handle OEIS API fetch and data transformation
async function fetchOEISSequences(start: number, count: number) {
  try {
    // The OEIS API or a service that provides OEIS data
    // Note: This is a simplified example; actual implementation depends on OEIS API specifics
    const response = await fetch(`https://oeis.org/search?q=id:A${start.toString().padStart(6, '0')}..A${(start + count - 1).toString().padStart(6, '0')}&fmt=json`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch OEIS data: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Fetched OEIS data:', data);
    
    // Process and transform the data for our database
    const sequences = data.results.map((seq: any) => {
      return {
        id: seq.number || '',
        number: seq.number || '',
        name: seq.name || '',
        description: seq.description || '',
        values: seq.data || '',
        formula: seq.formula || ''
      };
    });
    
    return sequences;
  } catch (error) {
    console.error('Error fetching OEIS sequences:', error);
    throw error;
  }
}

// Store sequences in Supabase
async function storeSequences(sequences: OEISSequence[]) {
  try {
    const { data, error } = await supabase
      .from('oeis_sequences')
      .upsert(sequences.map(seq => ({
        oeis_id: seq.id,
        name: seq.name,
        description: seq.description,
        values: seq.values,
        formula: seq.formula || null
      })));
    
    if (error) throw error;
    console.log('Successfully stored sequences:', data);
    return data;
  } catch (error) {
    console.error('Error storing sequences in database:', error);
    throw error;
  }
}

// Main function handler
Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Get parameters from request
    const { start = 1, count = 100 } = await req.json();
    
    // Validate input
    if (isNaN(start) || isNaN(count) || count > 500) {
      return new Response(
        JSON.stringify({ error: 'Invalid parameters. Start must be a number and count must be a number <= 500' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Fetch sequences from OEIS
    const sequences = await fetchOEISSequences(start, count);
    
    // Store in database
    if (sequences.length > 0) {
      await storeSequences(sequences);
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Processed ${sequences.length} OEIS sequences`,
        firstSequence: sequences.length > 0 ? sequences[0].id : null,
        lastSequence: sequences.length > 0 ? sequences[sequences.length - 1].id : null
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in import-oeis-sequences function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
