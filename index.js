const { Client, MessageEmbed } = require("discord.js");
require('dotenv').config();
const PREFIX = "-";
const bot = new Client();
const { Builder, By, Key, until } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
const chrome = require('selenium-webdriver/chrome');

const firefoxOptions = new firefox.Options();
const chromeOptions = new chrome.Options();
chromeOptions.addArguments("--mute-audio")
chromeOptions.addArguments("--headless")


//firefoxOptions.addArguments("-headless");
//doesnt work
firefoxOptions.addArguments("-mute-audio");
//firefoxOptions.addArguments("-headless");



//const driver = new Builder().forBrowser('firefox').setFirefoxOptions(firefoxOptions).build();
const driver = new Builder().forBrowser('firefox').setFirefoxOptions(firefoxOptions).build();

bot.on('ready', () => {
    (async function example() {
        try {
            //move these to ready 
            await driver.get(process.env.DISCORDSERVER);
            await driver.findElement(By.xpath("//input[@type='email']")).sendKeys(process.env.EMAIL);
            await driver.findElement(By.xpath("//input[@type='password']")).sendKeys(process.env.PASSWORD, Key.RETURN);

            await driver.wait(until.titleIs('#general'), 50000);
        }
        catch (err) {
            console.log(err);
        }
        finally {
            console.log('This bot is active');
            //await driver.quit();
        }
    })();
})

bot.on('message', msg => {
    try {
        let args = msg.content.substring(PREFIX.length).split(" ");
        if (msg.content.substring(0, 1) == "-") {
            console.log(args[0]);

            switch (args[0]) {
                case 'help':
                    var songs = msg.content.substring("!help");

                    var Embed = new MessageEmbed()
                        .setTitle('Helper Ember')
                        .setColor(0xFF0000)
                        .setDescription('Use -queuethese or -qt with commas between songs to queue multiple songs for Groovy');
                    msg.channel.send(Embed);

                    break;
                case 'qt':
                case 'queuethese':
                    var songs = msg.content.substring(3).split(",");

                    var Embed = new MessageEmbed()
                        .setTitle('Adding Songs')
                        .setColor(0xFF0000)
                        .setDescription('Custom Bot Command made by Hoang :)');

                    if (msg.member.voice.channel) {
                        msg.member.voice.channel.join().then(connection => {
                        });

                        //Selenium codes 
                        (async function example() {
                            try {
                                await songs.forEach(function (song, index) {
                                    setTimeout(() => {
                                        driver.findElement(By.className("markup-2BOw-j slateTextArea-1Mkdgw fontSize16Padding-3Wk7zP")).sendKeys('-p', song);
                                        driver.findElement(By.className("markup-2BOw-j slateTextArea-1Mkdgw fontSize16Padding-3Wk7zP")).sendKeys(Key.SPACE);
                                        driver.findElement(By.className("markup-2BOw-j slateTextArea-1Mkdgw fontSize16Padding-3Wk7zP")).sendKeys(Key.ENTER);
                                    }, index * 3000);
                                    //wait 5s between commands
                                });

                                //await console.log("???");
                            }
                            catch (err) {
                                console.log(err);
                            }
                            finally {
                                //await driver.quit();
                            }
                        })();
                    } else {
                        Embed.setDescription('Please enter a voice channel to queue musics :)!');
                    }
                    msg.channel.send(Embed);
                    break;
                default:
                    break;
            }
        }

    } catch(err){console.log(err) }
})

bot.login(process.env.TOKEN);