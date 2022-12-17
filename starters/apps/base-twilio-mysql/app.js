const {
    createBot,
    createProvider,
    createFlow,
    addKeyword,
    addChild,
} = require('@bot-whatsapp/bot')

const TwilioProvider = require('@bot-whatsapp/provider/twilio')
const MySQLAdapter = require('@bot-whatsapp/database/mysql')

/**
 * Declarando flujo hijo
 */

const flowBolsos2 = addKeyword(['bolsos2', '2'])
    .addAnswer('🤯 *MUCHOS* bolsos ...')
    .addAnswer('y mas bolsos... bla bla')

const flowZapatos2 = addKeyword(['zapatos2', '2'])
    .addAnswer('🤯 repito que tengo *MUCHOS* zapatos.')
    .addAnswer('y algunas otras cosas.')

const flowZapatos = addKeyword(['zapatos', 'ZAPATOS'])
    .addAnswer('🤯 Veo que elegiste zapatos')
    .addAnswer('Tengo muchos zapatos...bla bla')
    .addAnswer(
        ['Manda:', '*2*', 'o', '*zapatos2*', 'para mas información'],
        { capture: true },
        (ctx) => {
            console.log('Aqui puedes ver más info del usuario...')
            console.log('Puedes enviar un mail, hook, etc..')
            console.log(ctx)
        },
        [...addChild(flowZapatos2)]
    )

const flowBolsos = addKeyword(['bolsos', 'BOLSOS'])
    .addAnswer('🙌 Veo que elegiste bolsos')
    .addAnswer('Tengo muchos bolsos...bla bla')
    .addAnswer(
        ['Manda:', '*2*', 'o', '*bolsos2*', 'para mas información.'],
        { capture: true },
        (ctx) => {
            console.log('Aqui puedes ver más info del usuario...')
            console.log('Puedes enviar un mail, hook, etc..')
            console.log(ctx)
        },
        [...addChild(flowBolsos2)]
    )

/**
 * Declarando flujo principal
 */
const flowPrincipal = addKeyword(['hola', 'ole', 'alo'])
    .addAnswer('Hola, bienvenido a mi tienda')
    .addAnswer('Como puedo ayudarte?')
    .addAnswer(['Tengo:', 'Zapatos', 'Bolsos', 'etc..'])
    .addAnswer(
        ['Para continuar escribe:', '*Zapatos*', 'o', '*Bolsos*'],
        { capture: true },
        (ctx) => {
            console.log('Aqui puedes ver más info del usuario...')
            console.log('Puedes enviar un mail, hook, etc..')
            console.log(ctx)
        },
        [...addChild(flowBolsos), ...addChild(flowZapatos)]
    )

const main = async () => {
    const adapterDB = new MySQLAdapter({
        host: MYSQL_DB_HOST,
        user: MYSQL_DB_USER,
        database: MYSQL_DB_NAME,
        password: MYSQL_DB_PASSWORD,
    })
    const adapterFlow = createFlow([flowPrincipal])
    const adapterProvider = createProvider(TwilioProvider, {
        accountSid: 'YOUR_ACCOUNT_SID',
        authToken: 'YOUR_ACCOUNT_TOKEN',
        vendorNumber: '+14155238886',
    })
    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })
}

main()
