document.getElementById("registerBtn").addEventListener("click", function () {
    const username = document.getElementById("reg-username").value;
    const email = document.getElementById("reg-email").value;
    const password = document.getElementById("reg-password").value;
    const message = document.getElementById("register-message");

    if (username === "" || email === "" || password === "") {
        message.textContent = "Semua field harus diisi!";
        message.style.display = "block";
        return;
    }

    // Ambil data user yang sudah terdaftar
    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Cek apakah username atau email sudah terdaftar
    const existingUser = users.find(user => user.username === username || user.email === email);
    if (existingUser) {
        message.textContent = "Username atau email sudah digunakan!";
        message.style.display = "block";
        return;
    }

    // Simpan data user baru ke LocalStorage
    users.push({ username, email, password });
    localStorage.setItem("users", JSON.stringify(users));

    alert("Registrasi berhasil! Silakan login.");
    window.location.href = "login.html";
});
