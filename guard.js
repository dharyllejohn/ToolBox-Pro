/* =========================
   PAGE PROTECTION
========================= */

async function protectPage() {

    try {

        const { data: { session }, error } =
            await supabaseClient.auth.getSession();

        if (error || !session) {
            window.location.replace(LOGIN_PAGE);
            return;
        }

        const user = session.user;

        if (!user.email_confirmed_at) {
            await supabaseClient.auth.signOut();
            window.location.replace(LOGIN_PAGE);
            return;
        }

        const { data, error: dbError } = await supabaseClient
            .from(PROFILE_TABLE)
            .select("is_pro, pro_expire")
            .eq("id", user.id)
            .maybeSingle();

        if (dbError || !data) {
            window.location.replace(HOME_PAGE);
            return;
        }

        if (!data.is_pro) {
            window.location.replace(UPGRADE_PAGE);
            return;
        }

        if (data.pro_expire) {
            const expire = new Date(data.pro_expire);

            if (Date.now() > expire.getTime()) {
                window.location.replace(UPGRADE_PAGE);
                return;
            }
        }

        // SHOW PAGE ONLY IF ALL OK
        document.body.style.opacity = "1";

    } catch (err) {
        console.error("Guard Error:", err);
        window.location.replace(HOME_PAGE);
    }
}

document.addEventListener("DOMContentLoaded", protectPage);