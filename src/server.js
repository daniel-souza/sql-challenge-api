import app from './app.js'

const PORT = process.env.APP_PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor iniciado na porta 3000!");
});