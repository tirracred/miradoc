import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface InfosimplesResponse {
  code: number;
  code_message: string;
  data: Array<{
    nome: string;
    inscricao: string;
    situacao: string;
    especialidade?: string;
    especialidade_lista?: Array<{ nome: string; rqe: string }>;
    endereco?: string;
    endereco_uf?: string;
    telefone?: string;
    ano_formatura?: string;
    inscricao_data?: string;
    instituicao_graduacao?: string;
  }>;
  errors?: string[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { crm, uf, name } = await req.json();
    
    console.log("Verify doctor request:", { crm, uf, name });

    const INFOSIMPLES_API_KEY = Deno.env.get('INFOSIMPLES_API_KEY');
    if (!INFOSIMPLES_API_KEY) {
      throw new Error('INFOSIMPLES_API_KEY is not configured');
    }

    // If we have CRM and UF, query directly
    if (crm && uf) {
      const response = await fetch(
        `https://api.infosimples.com/api/v2/consultas/cfm/cadastro?inscricao=${crm}&uf=${uf}&token=${INFOSIMPLES_API_KEY}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data: InfosimplesResponse = await response.json();
      console.log("Infosimples response:", JSON.stringify(data, null, 2));

      if (data.code !== 200 || !data.data || data.data.length === 0) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: data.errors?.[0] || 'Médico não encontrado',
            doctors: [] 
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      const doctors = data.data.map((doc, index) => ({
        id: `${doc.inscricao}-${uf}-${index}`,
        name: doc.nome,
        crm: doc.inscricao,
        state: uf,
        status: doc.situacao?.toUpperCase().includes('ATIVO') ? 'ATIVO' : 'INATIVO',
        specialty: doc.especialidade_lista?.[0]?.nome || doc.especialidade || undefined,
        address: doc.endereco,
        phone: doc.telefone,
        graduationYear: doc.ano_formatura,
        institution: doc.instituicao_graduacao,
        registrationDate: doc.inscricao_data,
        fullSituacao: doc.situacao,
      }));

      return new Response(
        JSON.stringify({ success: true, doctors }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // If only name is provided, we can't search the CFM API directly
    // Return a message indicating CRM+UF is required for verification
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Para verificação no CFM, é necessário informar CRM e Estado.',
        requiresCRM: true,
        doctors: [] 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error("Error in verify-doctor function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro ao verificar médico' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
