require('dotenv').config()
const fetch = require('node-fetch')
const countryCode = 'FI'

const { Client, Intents, Message } = require('discord.js')
const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
})

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`)
})

client.login(process.env.CLIENT_TOKEN)

client.on('messageCreate', (msg) => {
	if (msg.content.includes('!w') && !msg.author.bot) {
		const zipCode = msg.content.split(' ')[1]
		if (
			zipCode === undefined ||
			zipCode.length != 5 ||
			parseInt(zipCode) === NaN
		) {
			msg.channel.send('Tarkista postinumero!').catch(console.error)
			return
		} else {
			fetch(
				`https://api.openweathermap.org/data/2.5/weather?zip=${zipCode},${countryCode}&units=metric&appid=${process.env.OPENWEATHERMAP_TOKEN}`
			)
				.then((response) => {
					return response.json()
				})
				.then((parsedWeather) => {
					if (parsedWeather.cod === '404') {
						msg.channel.send(
							'`Postinumeroa ei ole olemassa tai tietoa ei ole saatavilla!`'
						)
					} else {
						const current = new Date()
						msg.channel.send(
							`
              Tämänhetkinen sää:
              Paikkakunta: ${parsedWeather.name}, ${parsedWeather.sys.country}
              Sääennuste:  ${parsedWeather.weather[0].main}
              Lämpötila:   ${parsedWeather.main.temp.toFixed(1)} °C
              Korkein lämpötila: ${parsedWeather.main.temp_max.toFixed(1)} °C
              Alin lämpötila: ${parsedWeather.main.temp_min.toFixed(1)} °C
              Kellonaika: ${current.toLocaleTimeString()}
              `
						)
					}
				})
		}
	}
})
