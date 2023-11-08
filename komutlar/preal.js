const Discord = require('discord.js');
const db = require('quick.db');
const fs = require('fs'); // fs modülünü ekle

exports.run = async (client, message, args) => {
    const userId = message.author.id;  // Kullanıcının Discord id'si
    const userMoney = db.fetch(`para_${userId}`) || 0;
    const cost = 1500000;

    // Kullanıcının premium alıp almadığını kontrol et
    const isPremium = db.fetch(`premium_${userId}`);
    if (isPremium) {
        return message.reply('Zaten premium üyesiniz!');
    }

    // Kullanıcının premium süresinin dolup dolmadığını kontrol et (örneğin, 30 gün)
    const premiumExpiration = db.fetch(`premiumExpiration_${userId}`);
    if (premiumExpiration && premiumExpiration > Date.now()) {
        return message.reply('Premium süreniz henüz dolmadı!');
    }

    if (userMoney < cost) {
        const neededMoney = cost - userMoney;
        return message.reply(`Yetersiz RiseBunny cash. Premium satın almak için ${neededMoney} TL daha biriktir!`);
    }

    db.subtract(`para_${userId}`, cost);

    const premiumMessage = `Premium satın alındı! Kullanıcı Adı: ${message.author.tag} ve Kullanıcı id si: ${userId}`;
    const premiumChannel = client.channels.cache.get('1126493377748275280'); // Kanal ID'si
    if (premiumChannel) {
        premiumChannel.send(premiumMessage);
    } else {
        console.log('Belirtilen kanal bulunamadı.');
    }

    message.reply('Premium satın alındı!');
    const premiumDuration = 30 * 24 * 60 * 60 * 1000; // 30 gün süre
    const premiumExpirationDate = Date.now() + premiumDuration;
    db.set(`premiumExpiration_${userId}`, premiumExpirationDate);
    db.set(`premium_${userId}`, true);

    // ayarlar.json dosyasını oku
    const settings = JSON.parse(fs.readFileSync('ayarlar.json', 'utf8'));
    // premiumIDs özelliğini kontrol et
    if (!settings.premiumIDs) settings.premiumIDs = [];
    // premiumIDs dizisine kullanıcının id'sini ekle
    settings.premiumIDs.push(userId);
    // ayarlar.json dosyasına yeni verileri yaz
    fs.writeFileSync('ayarlar.json', JSON.stringify(settings, null, 2));
};

exports.conf = {
    enabled: true,
    aliases: ['alpremium', 'premiumal', 'preal', 'alpre'],
};

exports.help = {
    name: 'satinal-premium',
    description: 'Premium satın almak için kullanılır.',
    usage: 'satinal-premium',
};
