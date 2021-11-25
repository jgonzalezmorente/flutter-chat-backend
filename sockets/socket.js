const { io } = require('../index')
const { comprobarJWT } = require('../helpers/jwt');
const { usuarioConectado, usuarioDesconectado, grabarMensaje } = require('../controllers/socket');

// Mensajes de Sockets
io.on( 'connection', client => {
    console.log( 'Cliente conectado' );
    
    const [ valido, uid ] = comprobarJWT( client.handshake.headers[ 'x-token' ] );
    if ( !valido ) { return client.disconnect(); }

    usuarioConectado( uid );

    client.join( uid );

    client.on( 'mensaje-personal', async ( payload ) => {        
        await grabarMensaje( payload );
        io.to( payload.para ).emit( 'mensaje-personal', payload );
    });

    console.log( 'Cliente autenticado' );
    client.on( 'disconnect', () => {
        usuarioDesconectado( uid );
    });

});
