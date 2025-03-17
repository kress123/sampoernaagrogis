// Cek apakah admin sudah login
if (!localStorage.getItem("loggedIn")) {
    window.location.href = "login.html"; // Redirect ke halaman login jika belum login
}

// Fungsi Logout
document.getElementById("logoutButton").addEventListener("click", function () {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("username");
    window.location.href = "login.html"; // Kembali ke halaman login
});

// Tambahkan fitur lain khusus admin di sini
console.log("Admin Dashboard Loaded");
