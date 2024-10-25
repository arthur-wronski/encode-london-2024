// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from '@supabase/supabase-js'
import StellarSdk from 'stellar-sdk';
import { cors } from "https://deno.land/x/cors/mod.ts";

console.log("Creating Stellar wallet function initialized")

// Add CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // In production, replace * with your actual domain
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Handle OPTIONS request for CORS
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Parse the request body to get userId
    const { userId } = await req.json();
    
    if (!userId) {
      throw new Error('userId is required');
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { db: { schema: 'public' } }
    );

    // Create a new random keypair
    const pair = StellarSdk.Keypair.random();

    // Configure Stellar server (testnet)
    const server = new StellarSdk.Horizon.Server("https://horizon-testnet.stellar.org");

    // Fund the account using Friendbot (testnet only)
    const response = await fetch(
      `https://friendbot.stellar.org?addr=${encodeURIComponent(pair.publicKey())}`,
    );
    
    if (!response.ok) {
      throw new Error('Failed to fund account with Friendbot');
    }

    // Store wallet credentials in Supabase
    const { error: dbError } = await supabaseClient
      .from('stellar_wallets')
      .insert({
        user_id: userId,
        public_key: pair.publicKey(),
        private_key: pair.secret()
      });

    if (dbError) {
      throw new Error(`Failed to store wallet credentials: ${dbError.message}`);
    }

    // Get the account details
    const account = await server.loadAccount(pair.publicKey());
    
    // Return only the public information
    return new Response(
      JSON.stringify({
        publicKey: pair.publicKey(),
        balances: account.balances,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );

  } catch (error) {
    console.error("Error creating wallet:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
   2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/create-wallet' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
