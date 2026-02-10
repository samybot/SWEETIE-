module.exports = {
  nix: {
    name: 'start',
    prefix: false,
    role: 0,
    category: 'utility',
    aliases: ['help'],
  },

  async onStart({ message, bot }) {
    const cmds = global.teamnix?.cmds;
    if (!cmds) return;

    // ⚡ Construction du message help
    let text =
`˚ ༘♡ ·˚꒰🥍🏀 𝐒𝐖𝐄𝐄𝐓 𝐊𝐈𝐓𝐓𝐘 𝐁𝐎𝐓 🍒🧃꒱ ₊˚ˑ༄

📚 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐄𝐒 DISPONIBLES
━━━━━━━━━━━━━━━━━━━━━━
`;

    const seen = new Set();
    for (const cmd of cmds.values()) {
      if (!seen.has(cmd.nix.name)) {
        seen.add(cmd.nix.name);
        text += `• /${cmd.nix.name}\n`;
      }
    }

    text += `
━━━━━━━━━━━━━━━━━━━━━━
👑 Créateur :
⏤͟͟͞͞🍒🎸𝄒× •-•-•⟮ 𝐒𝐀𝐌 𝐀𝐑𝐂𝐅𝐎𝐗 ⟯•-•-• × ﹝⌨˓👑˒๖ۣ•҉📰🇨🇮
`;

    // 🔘 Boutons dev + groupe
    const keyboard = {
      inline_keyboard: [
        [
          { text: '🍒 Groupe', url: 'https://t.me/+AeazH36wrEcxM2Q0' },
          { text: '🧢 Dev', url: 'https://t.me/Samy_Charles_02' }
        ]
      ]
    };

    // 📤 Envoi du help complet
    await message.reply(text.trim(), {
      reply_markup: keyboard
    });

    // ⏱ Envoi de l’audio juste après (anti-crash)
    setTimeout(() => {
      bot.sendAudio(
        message.chat.id,
        'https://t.me/axislaboffical/9462'
      ).catch(() => {});
    }, 1000);
  }
};
