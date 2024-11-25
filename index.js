const app = require("../jobify (Front)");

async function main() {
    const port = 3001;
    await app.listen(port);
    console.log("Servidor funcionando en el puerto "+port);
}

main();