document.addEventListener("DOMContentLoaded", async () => {

    const {
        data: { user },
        error
    } = await supabase.auth.getUser();

    if (!user) {
        alert("Please login first.");
        window.location.href = "../auth.html";
        return;
    }

    const form = document.getElementById("ticketForm");

    form.addEventListener("submit", async (e) => {

        e.preventDefault();

        const subject = document.getElementById("subject").value.trim();
        const category = document.getElementById("category").value;
        const message = document.getElementById("message").value.trim();

        const { data: ticket, error: ticketError } = await supabase
            .from("support_tickets")
            .insert({
                user_id: user.id,
                subject,
                category
            })
            .select()
            .single();

        if (ticketError) {
            alert(ticketError.message);
            return;
        }

        const { error: messageError } = await supabase
            .from("support_messages")
            .insert({
                ticket_id: ticket.id,
                sender_id: user.id,
                message
            });

        if (messageError) {
            alert(messageError.message);
            return;
        }

        alert("Support ticket submitted successfully!");

        form.reset();

    });

});