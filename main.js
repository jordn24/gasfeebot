const axios = require('axios')
const discord = require('discord.js')
const { MessageEmbed } = require('discord.js');

const { prefix } = require('./config.json');
const { token } = require('./api_keys.json');

const client = new discord.Client();

async function getCurrentGasPrices() {
    let response = await axios.get('https://ethgasstation.info/json/ethgasAPI.json')
    let prices = {
        low: response.data.safeLow / 10,
        medium: response.data.average / 10,
        high: response.data.fast / 10
    }
    // console.log(`Current ETH Gas Prices (in GWEI):`)
    // console.log(`Low: ${prices.low} (transaction completes in < 30 minutes)`)
    // console.log(`Standard: ${prices.medium} (transaction completes in < 5 minutes)`)
    // console.log(`Fast: ${prices.high} (transaction completes in < 2 minutes)`)
    return prices;
}


client.on('ready', () => {
    setInterval(() => {
        getCurrentGasPrices().then((prices) => {
            const Guilds = client.guilds.cache.map(guild => guild);
            for (var i = 0; i < Guilds.length; i++){
                console.log(`${prices.high}`)
                Guilds[i].me
                        .setNickname(`$${prices.high} USD`)
                    .then( () => {
                        console.log(`You are now ${prices.high}!`);
                    })
                    .catch(err => {
                        console.log(err);
                    });
            } 
        })
    }, 60000);
});

client.on('message', async message => {


    if (message.content.toLowerCase().includes(prefix + 'gas')){
        getCurrentGasPrices().then((prices) => {

            const gasFeeEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`Current ETH Gas Prices :`)
            .addFields(
                { name: 'Low: (transaction completes in < 30 minutes)', value: `$${prices.low} USD`},
                { name: 'Standard: (transaction completes in < 5 minutes)', value: `$${prices.medium} USD`},
                { name: 'Fast: (transaction completes in < 2 minutes)', value: `$${prices.high} USD`}
            )
        
            message.channel.send(gasFeeEmbed)
            message.guild.me
                .setNickname(`$${prices.high} USD`)
                .then( () => {
                    console.log(`You are now ${prices.high}!`);
                })
                .catch(err => {
                    console.log(err);
                });

        }).catch(console.log)
    }

});

client.login(token)
