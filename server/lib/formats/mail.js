const { parse, render } = require('mustache');
const { mergeRight } = require('ramda');

const message = (subject, body) => {
  parse(subject);
  parse(body);
  return (data, env) => {
    const localData = mergeRight(data, env);
    return { subject: render(subject, localData), html: render(body, localData) };
  };
};

const emailWrapper = (content) => `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head><body style="margin:0;padding:0;background-color:#f4f6f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif"><table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f4;padding:40px 20px"><tr><td align="center"><table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)"><tr><td style="background:linear-gradient(135deg,#1b5e20,#2e7d32);padding:32px 36px;text-align:center"><h1 style="margin:0;color:#fff;font-size:22px;font-weight:800;letter-spacing:-0.5px">AGR-Collect</h1><p style="margin:6px 0 0;color:rgba(255,255,255,0.8);font-size:12px;letter-spacing:0.5px;text-transform:uppercase;font-weight:500">Collecte de données terrain</p></td></tr><tr><td style="padding:36px 36px 28px">${content}</td></tr><tr><td style="padding:20px 36px;background:#fafafa;border-top:1px solid #f0f0f0;text-align:center"><p style="margin:0;font-size:11px;color:#9e9e9e;letter-spacing:0.3px">SAAHDEL &mdash; AGR-Collect &mdash; Collecte de données fiable</p></td></tr></table></td></tr></table></body></html>`;

const btnStyle = 'display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#2e7d32,#43a047);color:#fff;text-decoration:none;border-radius:10px;font-size:15px;font-weight:700;letter-spacing:0.3px';
const pStyle = 'margin:0 0 16px;color:#424242;font-size:15px;line-height:1.7';
const linkStyle = 'color:#2e7d32;text-decoration:none;font-weight:600';

const messages = {
  accountCreated: message('Compte AGR-Collect créé', emailWrapper(`<p style="${pStyle}">Bonjour,</p><p style="${pStyle}">Un compte a été créé pour vous sur la plateforme <strong>AGR-Collect</strong>.</p><p style="${pStyle}">Si ce message est inattendu, ignorez-le simplement. Sinon, cliquez sur le bouton ci-dessous pour définir votre mot de passe et activer votre compte :</p><p style="text-align:center;margin:28px 0"><a href="{{{domain}}}/account/claim?token={{token}}" style="${btnStyle}">Activer mon compte</a></p><p style="${pStyle};font-size:13px;color:#757575">Ce lien est valide pendant 24 heures. Après ce délai, vous pourrez en demander un nouveau via la <a href="{{{domain}}}/reset-password" style="${linkStyle}">réinitialisation du mot de passe</a>.</p>`)),

  accountCreatedWithPassword: message('Compte AGR-Collect créé', emailWrapper(`<p style="${pStyle}">Bonjour,</p><p style="${pStyle}">Un compte a été créé pour vous sur la plateforme <strong>AGR-Collect</strong> avec un mot de passe prédéfini.</p><p style="${pStyle}">Si ce message est inattendu, ignorez-le simplement.</p><p style="text-align:center;margin:28px 0"><a href="{{{domain}}}" style="${btnStyle}">Se connecter</a></p><p style="${pStyle};font-size:13px;color:#757575">Si vous n'avez pas reçu le mot de passe ou l'avez oublié, vous pouvez le <a href="{{{domain}}}/reset-password" style="${linkStyle}">réinitialiser ici</a>.</p>`)),

  accountCreatedForOidc: message('Compte AGR-Collect créé', emailWrapper(`<p style="${pStyle}">Bonjour,</p><p style="${pStyle}">Un compte a été créé pour vous sur la plateforme <strong>AGR-Collect</strong>.</p><p style="${pStyle}">Si ce message est inattendu, ignorez-le simplement.</p><p style="text-align:center;margin:28px 0"><a href="{{{domain}}}" style="${btnStyle}">Accéder à AGR-Collect</a></p>`)),

  accountEmailChanged: message('Email du compte AGR-Collect modifié', emailWrapper(`<p style="${pStyle}">Bonjour,</p><p style="${pStyle}">L'adresse email associée à votre compte <strong>AGR-Collect</strong> a été modifiée de <strong>{{oldEmail}}</strong> vers <strong>{{newEmail}}</strong>.</p><p style="${pStyle}">Si cette modification est normale, vous pouvez ignorer cet email.</p><p style="${pStyle};color:#c62828;font-weight:600">Si vous n'êtes pas à l'origine de cette modification, contactez immédiatement votre administrateur.</p>`)),

  accountReset: message('Réinitialisation du mot de passe AGR-Collect', emailWrapper(`<p style="${pStyle}">Bonjour,</p><p style="${pStyle}">Une demande de réinitialisation de mot de passe a été effectuée pour votre compte <strong>AGR-Collect</strong>.</p><p style="${pStyle}">Si ce message est inattendu, ignorez-le simplement. Sinon, cliquez sur le bouton ci-dessous :</p><p style="text-align:center;margin:28px 0"><a href="{{{domain}}}/account/claim?token={{token}}" style="${btnStyle}">Réinitialiser mon mot de passe</a></p><p style="${pStyle};font-size:13px;color:#757575">Ce lien est valide pendant 24 heures. Après ce délai, vous pourrez en <a href="{{{domain}}}/reset-password" style="${linkStyle}">demander un nouveau</a>.</p>`)),

  accountResetDeleted: message('Réinitialisation du mot de passe AGR-Collect', emailWrapper(`<p style="${pStyle}">Bonjour,</p><p style="${pStyle}">Une demande de réinitialisation de mot de passe a été effectuée pour cette adresse email, mais le compte associé a été <strong>supprimé</strong>.</p><p style="${pStyle}">Si ce message est inattendu, ignorez-le. Sinon, veuillez vérifier l'adresse email de votre compte et contacter votre administrateur.</p>`)),

  accountPasswordChanged: message('Mot de passe AGR-Collect modifié', emailWrapper(`<p style="${pStyle}">Bonjour,</p><p style="${pStyle}">Le mot de passe de votre compte <strong>AGR-Collect</strong> vient d'être modifié.</p><p style="${pStyle}">Si cette modification est normale, vous pouvez ignorer cet email.</p><p style="${pStyle};color:#c62828;font-weight:600">Si vous n'êtes pas à l'origine de cette modification, contactez immédiatement votre administrateur.</p>`))
};

module.exports = { messages };

