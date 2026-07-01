/* ==========================================
   TOOLBOX PAYMENT
========================================== */

const PRICE = 199;
const PLAN = "monthly";

paypal.Buttons({

    createOrder(data, actions) {

        return actions.order.create({

            purchase_units: [

                {

                    description: "ToolBox Pro Monthly",

                    amount: {

                        currency_code: "PHP",

                        value: PRICE.toFixed(2)

                    }

                }

            ]

        });

    },

    async onApprove(data, actions) {

        try {

            const details = await actions.order.capture();

            const {

                data: {

                    user

                }

            } = await client.auth.getUser();

            if (!user) {

                alert("Please login first.");

                window.location.href = "../auth.html";

                return;

            }

            /* Check existing pending request */

            const {

                data: pending,
                error: pendingError

            } = await client

                .from("payment_requests")

                .select("id")

                .eq("user_id", user.id)

                .eq("status", "pending");

            if (pendingError) throw pendingError;

            if (pending && pending.length > 0) {

                alert("You already have a pending payment request.");

                return;

            }

            /* Save payment request */

            const {

                error

            } = await client

                .from("payment_requests")

                .insert({

                    user_id: user.id,

                    email: user.email,

                    payment_method: "paypal",

                    transaction_id: details.id,

                    amount: PRICE,

                    plan: PLAN,

                    status: "pending"

                });

            if (error) throw error;

            alert("✅ Payment submitted successfully!\n\nPlease wait for admin approval.");

            window.location.href = "../dashboard.html";

        }

        catch (err) {

            console.error(err);

            alert(err.message);

        }

    },

    onCancel() {

        alert("Payment cancelled.");

    },

    onError(err) {

        console.error(err);

        alert("PayPal payment failed.");

    }

}).render("#paypal-button-container");