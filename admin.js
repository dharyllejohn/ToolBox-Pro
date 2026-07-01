const client = supabaseClient;

loadPayments();

async function loadPayments() {

    const { data, error } = await client
        .from("payment_requests")
        .select("*")
        .order("created_at", { ascending: false });

    const container = document.getElementById("payments");

    if (error) {
        console.error(error);
        container.innerHTML = `
            <tr>
                <td colspan="6">Error loading payments.</td>
            </tr>
        `;
        return;
    }

    if (!data || data.length === 0) {
        container.innerHTML = `
            <tr>
                <td colspan="6">No payment requests.</td>
            </tr>
        `;
        return;
    }

    container.innerHTML = "";

    data.forEach(payment => {

        container.innerHTML += `
        <tr>

            <td>${payment.email}</td>

            <td>${payment.method}</td>

            <td>${payment.reference_number}</td>

            <td>
                <a href="${payment.screenshot}" target="_blank">
                    <img src="${payment.screenshot}" width="120">
                </a>
            </td>

            <td>${payment.status}</td>

            <td>

                <button
                onclick="approvePayment('${payment.id}','${payment.user_id}')">
                ✅ Approve
                </button>

                <button
                style="background:#ef4444;margin-left:8px;"
                onclick="rejectPayment('${payment.id}')">
                ❌ Reject
                </button>

            </td>

        </tr>
        `;

    });

}

async function approvePayment(paymentId, userId) {

    console.log("Payment ID:", paymentId);
    console.log("User ID:", userId);

    const expire = new Date();
    expire.setMonth(expire.getMonth() + 1);

    const { data, error } = await client
        .from("profiles")
        .update({
            is_pro: true,
            pro_expire: expire.toISOString()
        })
        .eq("id", userId)
        .select();

    console.log("Updated:", data);
    console.log("Error:", error);

    if (error) {
        alert(error.message);
        return;
    }

    if (!data || data.length === 0) {
        alert("No profile was updated. Check if the user exists in the profiles table.");
        return;
    }

    const { error: paymentError } = await client
        .from("payment_requests")
        .update({
            status: "approved"
        })
        .eq("id", paymentId);

    if (paymentError) {
        alert(paymentError.message);
        return;
    }

    alert("✅ User upgraded to PRO.");
    loadPayments();
}