require('dotenv').config();
const express = require('express');
const path = require('path');
const routes = require('./src/routes/index');
const db = require('./src/db');

const app = express()

// Middleware para manejar datos JSON
app.use(express.json());

// Middleware para manejar datos codificados en URL (formularios HTML)
app.use(express.urlencoded({ extended: true }));

// Ruta para archivos estáticos (HTML, CSS, imágenes, etc.)
app.use(express.static(path.join(__dirname, 'public')));


app.use(routes)


/* En caso de no encontrar la ruta envia una pagina 404 */
//Static Files
app.use(express.static(path.join(__dirname,'./public')))

app.use((req, res)=>{
  res.sendFile(path.join(__dirname,'./public/404.html'))
})
const PORT = process.env.PORT || 3001

app.listen(PORT, ()=> {
  console.log('Servidor escuchando en el Puerto:' + PORT)
})
