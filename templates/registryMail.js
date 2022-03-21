const registryMail = () => {
    return `
<body style="margin: 10px; box-sizing: border-box; padding: 0">
    <style>
        .hover-rotate {
            display: block;
            margin: 0 auto;
            padding-top: 30px;
            overflow: hidden;
            min-width: 60px;
            max-width: 80px;
            width: 100%;
        }

        .hover-rotate img {
            transition: all 0.8s;
            box-sizing: border-box;
            max-width: 80%;
        }

        .hover-rotate:hover img {
            transform: scale(1.2) rotate(12deg);
        }

        a, a:visited{
            color: white;
            text-decoration: none;
        }
    </style>
    <section
        style="
            width: 450px;
            height: 250px;
            border-radius: 1px solid red;
            text-align: center;
            background-color: rebeccapurple;
            color: whitesmoke;
        "
    >
        <h3>Activa tu cuenta de usuario en Balloon</h3>
        <p>Para completar el registro</p>
        <p>pulsa en el globo</p>
        <a href="http://localhost:3000/account?register=ok" target="_blank" rel="noreferrer"><figure class="hover-rotate">
                <img
                    src="https://imagizer.imageshack.com/img922/9099/Sj6jBW.png"
                    alt="🎈 Logo Balloon"
                    width="60px"
                /></figure
        ></a>
    </section>
</body>`;
};

module.exports = registryMail;
