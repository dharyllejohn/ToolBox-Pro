import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  // CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  try {
    const { payment_id } = await req.json();

    if (!payment_id) {
      return new Response(
        JSON.stringify({ error: "Missing payment_id" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Kunin payment
    const { data: payment, error: paymentError } = await supabase
      .from("payment_requests")
      .select("*")
      .eq("id", payment_id)
      .single();

    if (paymentError || !payment) {
      return new Response(
        JSON.stringify({ error: "Payment not found" }),
        {
          status: 404,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Already approved?
    if (payment.status === "approved") {
      return new Response(
        JSON.stringify({ error: "Already approved" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Expire after 30 days
    const expire = new Date();
    expire.setDate(expire.getDate() + 30);

    // Upgrade user
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        is_pro: true,
        pro_expire: expire.toISOString(),
      })
      .eq("id", payment.user_id);

    if (profileError) {
      return new Response(
        JSON.stringify(profileError),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Approve payment
    const { error: paymentUpdateError } = await supabase
      .from("payment_requests")
      .update({
        status: "approved",
      })
      .eq("id", payment_id);

    if (paymentUpdateError) {
      return new Response(
        JSON.stringify(paymentUpdateError),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({
        error: err.message,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});