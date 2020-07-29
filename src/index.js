if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const app = require('./server');

app.listen(app.get('port'), () => {
    console.log('Servidor en el puerto', app.get('port'));
});