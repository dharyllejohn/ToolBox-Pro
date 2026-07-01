function goHome() {
    location.href = "../index.html";
}

async function logout() {
    await supabaseClient.auth.signOut();
    location.href = "../auth.html";
}

function copyText(text) {
    navigator.clipboard.writeText(text);
}

function downloadFile(filename, content, type) {
    const blob = new Blob([content], { type });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
}