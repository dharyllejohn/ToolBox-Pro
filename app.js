/* =========================
   TABS
========================= */

function showTab(tabId) {
    document.querySelectorAll(".tab").forEach(tab => {
        tab.classList.remove("active");
    });

    const target = document.getElementById(tabId);

    if (target) {
        target.classList.add("active");
    }
}

function goBack() {
    window.location.href = "../index.html";
}

/* =========================
   PRO SYSTEM
========================= */

function lockProTools() {
    document.querySelectorAll(".locked").forEach(el => {
        el.classList.add("pro-locked");
    });
}

function unlockProTools() {
    document.querySelectorAll(".locked").forEach(el => {
        el.classList.remove("pro-locked");
    });
}

/* =========================
   CHECK USER
========================= */

async function checkUser() {

    try {

        const {
            data: { session },
            error
        } = await client.auth.getSession();

        if (error || !session) {
            lockProTools();
            return;
        }

        const user = session.user;

        if (!user.email_confirmed_at) {
            lockProTools();
            return;
        }

        const { data, error: dbError } = await client
            .from(PROFILE_TABLE)
            .select("is_pro, pro_expire")
            .eq("id", user.id)
            .single();

        if (dbError || !data) {
            lockProTools();
            return;
        }

        if (!data.is_pro) {
            lockProTools();
            return;
        }

        if (data.pro_expire) {

            const expire = new Date(data.pro_expire);

            if (Date.now() > expire.getTime()) {
                lockProTools();
                return;
            }
        }

        unlockProTools();

    } catch (err) {

        console.error("checkUser:", err);

        lockProTools();

    }

}

/* =========================
   CARD NAVIGATION
========================= */

document.querySelectorAll(".card").forEach(card => {

    card.addEventListener("click", function (e) {

        if (card.classList.contains("pro-locked")) {

            e.preventDefault();

            window.location.href = UPGRADE_PAGE;

            return;

        }

        const link = card.dataset.link;

        if (link) {
            window.location.href = link;
        }

    });

});

/* =========================
   START
========================= */

window.addEventListener("DOMContentLoaded", async () => {

    await checkUser();

});