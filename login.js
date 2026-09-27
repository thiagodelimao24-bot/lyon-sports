const form =
    document.getElementById(
        "login-form"
    );


form.addEventListener(

    "submit",

    function(event) {

        event.preventDefault();


        const usuario =

            document
            .getElementById(
                "usuario"
            )
            .value
            .trim();


        const senha =

            document
            .getElementById(
                "senha"
            )
            .value;


        const erro =

            document
            .getElementById(
                "login-error"
            );


        if (
            usuario === "admin"
            &&
            senha === "lyon2026"
        ) {

            sessionStorage.setItem(
                "lyonAdmin",
                "true"
            );


            window.location.href =
                "admin.html";

        } else {

            erro.textContent =
                "Usuário ou senha incorretos.";

        }

    }

);