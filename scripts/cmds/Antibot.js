// Stockage en mémoire des warns antibot par utilisateur
const antibotWarns = {}; // key = chatId_userId => nombre de warns

module.exports = {
  nix: {
    name: 'antibot',
    prefix: false,
    role: 0,
    category: 'admin',
    aliases: [],
  },

  async onChatMemberUpdate({ update, bot }) {
    const chatId = update.chat.id;

    // Vérifie si c'est un nouvel utilisateur ajouté
    if (!update.new_chat_members) return;

    for (const newMember of update.new_chat_members) {
      // Si le nouvel utilisateur est un bot
      if (newMember.is_bot) {
        try {
          // Supprime le bot du groupe
          await bot.kickChatMember(chatId, newMember.id);

          // Identifie la personne qui a ajouté le bot
          const addedBy = update.from;
          const key = `${chatId}_${addedBy.id}`;

          // Initialise le compteur si besoin
          if (!antibotWarns[key]) antibotWarns[key] = 0;
          antibotWarns[key]++;

          // Message kawaii d'avertissement
          let warnMsg = `
┌ ❏ ◆ ⌜🚫 ANTIBOT ACTIVÉ ⌟ ◆
│
├◆ Hey ${addedBy.first_name} 🐱🍒
├◆ Tu as ajouté un bot nommé ${newMember.first_name}.
├◆ Les bots ne sont pas autorisés ici !
├◆ C'est ton avertissement antibot n°${antibotWarns[key]}/3.
│
└ ❏`;

          // Si l’utilisateur atteint 3 warns antibot
          if (antibotWarns[key] >= 3) {
            warnMsg = `
┌ ❏ ◆ ⌜⛔ UTILISATEUR SANCTIONNÉ ⌟ ◆
│
├◆ ${addedBy.first_name} a ajouté 3 bots !
├◆ Avertissements antibot atteints.
├◆ Tu as été expulsé pour non-respect des règles 😿
│
└ ❏`;
            // Kick l’utilisateur
            await bot.kickChatMember(chatId, addedBy.id);
            antibotWarns[key] = 0; // reset compteur après kick
          }

          // Envoi du message
          await bot.sendMessage(chatId, warnMsg);

        } catch (e) {
          console.log("Erreur Anti-Bot:", e.message);
        }
      }
    }
  }
};
