// supabase/functions/create-checkout/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@12.0.0?target=deno'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Isso permite que o navegador faça a requisição sem erro de segurança (CORS)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Pegamos a chave secreta do Stripe que vamos configurar no Painel
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
      apiVersion: '2022-11-15',
      httpClient: Stripe.createFetchHttpClient(),
    })

    // Recebe os dados enviados pelo botão do site
    const { planType, userId, returnUrl } = await req.json()

    console.log(`Iniciando checkout: ${planType} para usuário ${userId}`)

    // Configuração dos Preços
    let priceData;
    
    if (planType === 'single') {
      priceData = {
        currency: 'brl',
        product_data: {
          name: 'Consulta Avulsa Miradoc',
          description: 'Relatório detalhado de CRM e Processos',
        },
        unit_amount: 990, // R$ 9,90
      };
    } else if (planType === 'subscription') {
      priceData = {
        currency: 'brl',
        product_data: {
          name: 'Assinatura Mensal Miradoc',
          description: 'Acesso completo à plataforma e comunidade',
        },
        unit_amount: 4990, // R$ 49,90
        recurring: {
          interval: 'month',
        },
      };
    } else {
      throw new Error('Tipo de plano inválido')
    }

    // Cria a sessão de pagamento no Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'boleto'],
      line_items: [
        {
          price_data: priceData,
          quantity: 1,
        },
      ],
      mode: planType === 'subscription' ? 'subscription' : 'payment',
      // Redireciona o usuário de volta para o app com o ID da sessão
      success_url: `${returnUrl}/app?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${returnUrl}/`,
      client_reference_id: userId,
      metadata: {
        userId: userId,
        planType: planType
      }
    })

    // Devolssve o link do Stripe para o site abrir
    return new Response(
      JSON.stringify({ url: session.url }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200, 
      }
    )

  } catch (error) {
    console.error("Erro no checkout:", error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})