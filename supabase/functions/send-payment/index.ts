// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from '@supabase/supabase-js'
import StellarSdk from 'stellar-sdk';

console.log("Send payment function initialized")

Deno.serve(async (req) => {
  try {
    // Parse request body
    const { userId, amount, destinationAddress } = await req.json();
    
    if (!userId || !amount || !destinationAddress) {
      throw new Error('userId, amount, and destinationAddress are required');
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { db: { schema: 'public' } }
    );

    // Get wallet credentials from database
    const { data: wallet, error: dbError } = await supabaseClient
      .from('stellar_wallets')
      .select('public_key, private_key')
      .eq('user_id', userId)
      .single();

    if (dbError || !wallet) {
      throw new Error('Failed to retrieve wallet credentials');
    }

    // Configure Stellar server (testnet)
    const server = new StellarSdk.Horizon.Server("https://horizon-testnet.stellar.org");
    const sourceKeypair = StellarSdk.Keypair.fromSecret(wallet.private_key);

    // Create transaction
    const sourceAccount = await server.loadAccount(wallet.public_key);
    const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: "100000", // 0.01 XLM
      networkPassphrase: StellarSdk.Networks.TESTNET
    })
      .addOperation(StellarSdk.Operation.payment({
        destination: destinationAddress,
        asset: StellarSdk.Asset.native(), // Using XLM
        amount: amount.toString()
      }))
      .setTimeout(180)
      .build();

    // Sign and submit transaction
    transaction.sign(sourceKeypair);
    const result = await server.submitTransaction(transaction);

    return new Response(
      JSON.stringify({
        success: true,
        transaction: result
      }),
      { 
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        } 
      }
    );

  } catch (error) {
    console.error("Error sending payment:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        } 
      }
    );
  }
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
   2. Make an HTTP request:
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/send-payment' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
