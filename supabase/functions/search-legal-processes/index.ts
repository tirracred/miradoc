import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SearchResult {
  id: string;
  title: string;
  link: string;
  snippet: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { doctorName, crm, state } = await req.json();

    if (!doctorName) {
      return new Response(
        JSON.stringify({ success: false, error: 'Nome do médico é obrigatório' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('GOOGLE_API_KEY');
    const cseId = Deno.env.get('GOOGLE_CSE_ID');

    if (!apiKey || !cseId) {
      console.error('Missing Google API credentials');
      return new Response(
        JSON.stringify({ success: true, processes: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build search query for legal processes
    const searchQuery = `"${doctorName}" médico ${crm ? `CRM ${crm}` : ''} ${state || ''} processo`;
    
    console.log(`Searching for legal processes: ${searchQuery}`);

    const url = new URL('https://www.googleapis.com/customsearch/v1');
    url.searchParams.set('key', apiKey);
    url.searchParams.set('cx', cseId);
    url.searchParams.set('q', searchQuery);
    url.searchParams.set('num', '5');

    const response = await fetch(url.toString());
    const data = await response.json();

    if (!response.ok) {
      console.error('Google API error:', data);
      return new Response(
        JSON.stringify({ success: true, processes: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const processes: SearchResult[] = (data.items || []).map((item: any, index: number) => ({
      id: `process-${index}`,
      title: item.title || 'Processo sem título',
      link: item.link || '',
      snippet: item.snippet || '',
    }));

    console.log(`Found ${processes.length} potential legal processes`);

    return new Response(
      JSON.stringify({ success: true, processes }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error searching legal processes:', error);
    return new Response(
      JSON.stringify({ success: true, processes: [] }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});