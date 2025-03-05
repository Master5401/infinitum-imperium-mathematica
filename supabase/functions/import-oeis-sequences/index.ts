import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { load } from 'https://esm.sh/cheerio@1.0.0-rc.12';

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
  oeis_id: string;
  name: string;
  description: string;
  values: string;
  formula?: string;
  source: string;
  is_public: boolean;
}

// Handle OEIS data fetch and scraping
async function fetchOEISSequence(sequenceNumber: number): Promise<OEISSequence | null> {
  try {
    const paddedNumber = sequenceNumber.toString().padStart(6, '0');
    const oeis_id = `A${paddedNumber}`;
    const url = `https://oeis.org/${oeis_id}`;
    
    console.log(`Fetching sequence ${oeis_id} from ${url}`);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`Failed to fetch OEIS sequence ${oeis_id}: ${response.status}`);
      return null;
    }
    
    const html = await response.text();
    const $ = load(html);
    
    // Extract the sequence information
    const name = $('title').text().replace('- OEIS', '').trim();
    const description = $('.sequence').first().text().trim();
    
    // Extract the values
    let values = '';
    $('.sequence').each((i, el) => {
      const text = $(el).text().trim();
      if (text.match(/^\d/)) {
        values = text;
        return false; // Break the loop
      }
    });
    
    // Extract formula if available
    let formula = '';
    $('td:contains("Formula")').each((i, el) => {
      const formulaRow = $(el).closest('tr');
      formula = formulaRow.find('td').eq(1).text().trim();
    });
    
    return {
      oeis_id,
      name,
      description,
      values,
      formula: formula || null,
      source: 'OEIS',
      is_public: true
    };
  } catch (error) {
    console.error(`Error fetching sequence ${sequenceNumber}:`, error);
    return null;
  }
}

// Store sequences in Supabase
async function storeSequences(sequences: OEISSequence[]) {
  if (sequences.length === 0) return;
  
  try {
    const filteredSequences = sequences.filter(seq => seq !== null);
    console.log(`Storing ${filteredSequences.length} sequences in database`);
    
    const { data, error } = await supabase
      .from('oeis_sequences')
      .upsert(filteredSequences, { onConflict: 'oeis_id' });
    
    if (error) throw error;
    
    console.log('Successfully stored sequences');
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
    const { start = 1, count = 100, bulkImport = false } = await req.json();
    
    // Validate input
    if (isNaN(start) || isNaN(count) || (bulkImport && count > 10000) || (!bulkImport && count > 500)) {
      return new Response(
        JSON.stringify({ 
          error: bulkImport 
            ? 'Invalid parameters. Start must be a number and count must be a number <= 10000 for bulk import' 
            : 'Invalid parameters. Start must be a number and count must be a number <= 500' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log(`Importing OEIS sequences from ${start} to ${start + count - 1}, bulkImport: ${bulkImport}`);
    
    // Fetch sequences in parallel with batching to avoid overwhelming the server
    const batchSize = bulkImport ? 50 : 10;
    const sequences: OEISSequence[] = [];
    const successCount = { value: 0 };
    const failCount = { value: 0 };
    
    // For bulk imports, we'll process batches and store them as we go
    // to avoid memory issues and provide incremental progress
    for (let batchStart = start; batchStart < start + count; batchStart += batchSize) {
      const batchEnd = Math.min(batchStart + batchSize, start + count);
      console.log(`Processing batch from ${batchStart} to ${batchEnd - 1}`);
      
      const batchPromises = [];
      for (let i = batchStart; i < batchEnd; i++) {
        batchPromises.push(
          fetchOEISSequence(i)
            .then(result => {
              if (result) successCount.value++;
              else failCount.value++;
              return result;
            })
        );
      }
      
      const batchResults = await Promise.all(batchPromises);
      const validResults = batchResults.filter(Boolean) as OEISSequence[];
      
      if (validResults.length > 0) {
        // Store each batch to reduce memory usage
        await storeSequences(validResults);
        
        // For non-bulk imports, keep track of all sequences for response
        if (!bulkImport) {
          sequences.push(...validResults);
        }
      }
      
      // For bulk imports, return partial progress updates
      if (bulkImport && batchStart % 500 === 0 && batchStart > start) {
        console.log(`Progress update: Processed ${batchStart - start} out of ${count} sequences`);
      }
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Processed ${successCount.value + failCount.value} OEIS sequences (${successCount.value} succeeded, ${failCount.value} failed)`,
        firstSequence: sequences.length > 0 ? sequences[0].oeis_id : null,
        lastSequence: sequences.length > 0 ? sequences[sequences.length - 1].oeis_id : null,
        totalImported: successCount.value
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
