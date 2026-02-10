const warnSettings = {}; 
const userWarns = {};

module.exports = {
  nix: {
    name: 'warn',
    prefix: false,
    role: 2,
    category: 'admin',
  },

  async onStart({ message, bot }) {
    if (!message || !message.from) return;
    const chatId = message.chat.id;
    const sender = message.from;

    // Vérifie admin
    let chatAdmins;
    try {
      chatAdmins = await bot.getChatAdministrators(chatId);
    } catch {
      return message.reply("❌ Je dois être admin pour gérer warn !");
    }

    const isAdmin = chatAdmins.some(a => a.user.id === sender.id);
    if (!isAdmin) return message.reply("❌ Seul un admin peut activer/désactiver warn.");

    const cmd = message.text.toLowerCase();

    if (cmd === '/warn-on') {
      warnSettings[chatId] = true;
      return message.reply("✅ Anti-liens activé !");
    }

    if (cmd === '/warn-off') {
      warnSettings[chatId] = false;
      return message.reply("⚠️ Anti-liens désactivé !");
    }

    return message.reply("ℹ️ Utilise `/warn-on` ou `/warn-off` pour activer/désactiver.");
  },

  async onMessage({ message, bot }) {
    if (!message || !message.from || !message.chat) return;
    const chatId = message.chat.id;
    const userId = message.from.id;

    if (!warnSettings[chatId]) return; // Si système désactivé
    if (!message.text) return;

    const linkRegex = /(https?:\/\/\S+|t\.me\/\S+|discord\.gg\/\S+)/gi;
    if (!linkRegex.test(message.text)) return;

    const key = `${chatId}_${userId}`;
    try {
      await bot.deleteMessage(chatId, message.message_id);

      if (!userWarns[key]) userWarns[key] = 0;
      userWarns[key]++;

      if (userWarns[key] < 3) {
        await bot.sendMessage(chatId,
`┌ ❏ ◆ ⌜⚠️ AVERTISSEMENT ⚠️⌟ ◆
│
├◆ Salut ${message.from.first_name} 🐱🍒
├◆ Tu as envoyé un lien interdit.
├◆ Avertissement n°${userWarns[key]}/3.
│
└ ❏`);
      } else {
        await bot.kickChatMember(chatId, userId);
        await bot.sendMessage(chatId,
`┌ ❏ ◆ ⌜⛔ UTILISATEUR EXPULSÉ ⌟ ◆
│
├◆ ${message.from.first_name} a atteint 3 avertissements.
├◆ Les liens ont été supprimés.
│
└ ❏`);
        userWarns[key] = 0;
      }
    } catch (e) {
      console.log("Erreur warn:", e.message);
    }
  }
};
