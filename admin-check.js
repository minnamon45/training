firebase.auth().onAuthStateChanged((user) => {

    if (!user) {

        window.location.href = "login.html";

        return;
    }

    // ايميلات الادمن
    const admins = [

        "admin@test.com",

        "mina@test.com"
    ];

    // ليس أدمن
    if (!admins.includes(user.email)) {

        window.location.href = "index.html";

        return;
    }

    document.body.style.display = "block";
});