module.exports = {
  nix: {
    name: 'restart',
    prefix: false,
    role: 2, // 2 = admin only
    category: 'system',
    aliases: ['reboot'],
  },

  async onStart({ message, bot }) {
    const ADMIN_ID = YOUR_ADMIN_ID; // ← Remplace par ton ID Telegram

    if (message.from.id !== ADMIN_ID) {
      return message.reply("❌ Seul le créateur peut redémarrer le bot !");
    }

    // 🔹 Message stylé Sweet Kitty
    const text = `
˚ ༘♡ ·˚꒰🥍🏀 𝐒𝐖𝐄𝐄𝐓 𝐊𝐈𝐓𝐓𝐘 𝐁𝐎𝐓 🍒🧃꒱ ₊˚ˑ༄
━━━━━━━━━━━━━━━━━━━━━━
♻️ Redémarrage en cours…
💌 Si problème, contacte le dev via le bouton ci-dessous
━━━━━━━━━━━━━━━━━━━━━━
`;

    const keyboard = {
      inline_keyboard: [
        [
          { text: '🧢 Contact Dev', url: 'https://t.me/Samy_Charles_02' }
        ]
      ]
    };

    // 📤 Envoi du message
    await message.reply(text.trim(), {
      reply_markup: keyboard
    });

    // ⏱ Petit délai pour que le message s’affiche avant le restart
    setTimeout(() => {
      process.exit(0); // Node.js s'arrête, PM2 ou autre relance le bot
    }, 1200);
  }
};
