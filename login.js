// Data login admin (bisa diubah sesuai kebutuhan)
const adminUsername = "admin";
const adminPassword = "1234567890"; // Ganti dengan password yang diinginkan

document.getElementById("loginUser").addEventListener("click", function () {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("error-message");

    // Ambil data user yang terdaftar di LocalStorage
    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Cek apakah username dan password cocok dengan data yang terdaftar
    const user = users.find(user => user.username === username && user.password === password);
    
    if (user) {
        localStorage.setItem("loggedIn", true);
        localStorage.setItem("username", username);
        window.location.href = "dashboard.html"; // Redirect ke dashboard user
    } else {
        errorMessage.textContent = "Username atau password salah!";
        errorMessage.style.display = "block";
    }
});

document.getElementById("loginAdmin").addEventListener("click", function () {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("error-message");

    if (username === adminUsername && password === adminPassword) {
        localStorage.setItem("loggedIn", true);
        localStorage.setItem("username", username);
        window.location.href = "admin-dashboard.html"; // Redirect ke dashboard admin
    } else {
        errorMessage.textContent = "Username atau password salah!";
        errorMessage.style.display = "block";
    }
});

document.getElementById("register").addEventListener("click", function () {
    window.location.href = "register.html"; // Redirect ke halaman pendaftaran
});
localStorage.setItem("userRole", "admin"); // Simpan role admin setelah login
