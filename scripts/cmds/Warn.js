const warnSettings = {}; // chatId => true/false
const userWarns = {}; // key = chatId_userId => nombre d'avertissements

module.exports = {
  nix: {
    name: 'warn',
    prefix: false,
    role: 2,
    category: 'admin',
    aliases: [],
  },

  async onStart({ message, bot, args }) {
    const chatId = message.chat.id;
    const sender = message.from;

    // Vérifie si l'utilisateur est admin
    const chatAdmins = await bot.getChatAdministrators(chatId);
    const isAdmin = chatAdmins.some(a => a.user.id === sender.id);

    if (!isAdmin) return message.reply("❌ Seul un admin peut activer ou désactiver le système.");

    const cmd = message.text.toLowerCase();

    if (cmd === '/warn-on') {
      warnSettings[chatId] = true;
      return message.reply("✅ Anti-liens activé ! Je vais surveiller tous les liens envoyés et avertir les utilisateurs.");
    }

    if (cmd === '/warn-off') {
      warnSettings[chatId] = false;
      return message.reply("⚠️ Anti-liens désactivé. Les liens ne seront plus surveillés.");
    }

    message.reply("ℹ️ Utilise `/warn-on` ou `/warn-off` pour activer ou désactiver.");
  },

  async onMessage({ message, bot }) {
    const chatId = message.chat.id;
    if (!warnSettings[chatId]) return; // système désactivé
    if (!message.text) return;

    const userId = message.from.id;
    const key = `${chatId}_${userId}`;
    const text = message.text;

    // Vérifie la présence de lien
    const linkRegex = /(https?:\/\/\S+|t\.me\/\S+|discord\.gg\/\S+)/gi;
    if (!linkRegex.test(text)) return;

    try {
      // Supprime le message contenant le lien
      await bot.deleteMessage(chatId, message.message_id);

      // Compteur warn
      if (!userWarns[key]) userWarns[key] = 0;
      userWarns[key]++;

      // Message kawaii avertissement
      if (userWarns[key] < 3) {
        await bot.sendMessage(chatId, 
`┌ ❏ ◆ ⌜⚠️ AVERTISSEMENT ⚠️⌟ ◆
│
├◆ Salut @${message.from.username || message.from.first_name} !
├◆ Tu as envoyé un lien interdit dans le groupe.
├◆ C'est ton avertissement n°${userWarns[key]}/3.
├◆ Merci de faire attention pour rester dans le groupe 🐱🍒
│
└ ❏`);
      } else {
        // Kick après 3 warns
        await bot.kickChatMember(chatId, userId);
        await bot.sendMessage(chatId,
`┌ ❏ ◆ ⌜⛔ UTILISATEUR EXPULSÉ ⌟ ◆
│
├◆ ${message.from.first_name} a atteint 3 avertissements.
├◆ Le lien interdit a été supprimé.
├◆ Bye bye 😿
│
└ ❏`);
        userWarns[key] = 0; // reset compteur
      }
    } catch (e) {
      console.log("Erreur anti-lien:", e.message);
    }
  }
};
