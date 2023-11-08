const Discord = require('discord.js');
const fs = require('fs');
const db = require('quick.db');

exports.run = async (client, message, args) => {
    const ownerId = '985126554306773063';  // Sahip (owner) Discord ID

    if (message.author.id !== ownerId) {
        return message.reply('Bu komutu sadece sahip kullanabilir!');
    }

    const userId = args[0];

    if (!userId) {
        return message.reply('Bir kullanıcı etiketleyin veya ID girin!');
    }

    // Ayarlar dosyasından premium üye ID'lerini al
    let ayarlar = JSON.parse(fs.readFileSync('ayarlar.json', 'utf8'));
    const premiumIDs = ayarlar.premiumIDs;

    // Kullanıcının ID'si premium ID'ler arasında mı kontrol et
    if (premiumIDs.includes(userId)) {
        // Kullanıcının premium bilgilerini sil
        db.delete(`premium_${userId}`);
        db.delete(`premiumExpiration_${userId}`);
        const updatedPremiumIDs = premiumIDs.filter(id => id !== userId);
        ayarlar.premiumIDs = updatedPremiumIDs;
        fs.writeFileSync('ayarlar.json', JSON.stringify(ayarlar, null, 2), 'utf8');
        return message.reply(`Kullanıcının premium bilgileri başarıyla silindi ve premium üyelikten çıkarıldı!`);
    } else {
        return message.reply('Bu üye premium üye değil!');
    }
};

exports.conf = {
    enabled: true,
    aliases: ['premumsil', 'deactivatepremium','presil'],
};

exports.help = {
    name: 'premium-sil',
    description: 'Belirtilen kullanıcının premium bilgilerini siler (sadece sahip).',
    usage: 'premium-sil <kullanıcı_etiketi veya kullanıcı_id>',
};
