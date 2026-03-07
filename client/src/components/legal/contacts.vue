<!--
Copyright 2025 AGR-Collect
Page de Contacts
-->
<template>
  <div id="legal-contacts" class="legal-page">
    <page-section>
      <template #heading>
        <span>{{ $t('title') }}</span>
      </template>
      <template #body>
        <div class="legal-content contacts-content">
          <p class="legal-intro">{{ $t('intro') }}</p>
          
          <div class="contact-cards">
            <div class="contact-card">
              <div class="contact-icon">✉</div>
              <h4>{{ $t('email.title') }}</h4>
              <p>{{ $t('email.description') }}</p>
              <a href="mailto:emmanueljuniordequa2@gmail.com" class="contact-link">
                emmanueljuniordequa2@gmail.com
              </a>
            </div>
            
            <div class="contact-card">
              <div class="contact-icon">📞</div>
              <h4>{{ $t('phone.title') }}</h4>
              <p>{{ $t('phone.description') }}</p>
              <a href="tel:+237690624051" class="contact-link">+237 690 624 051</a>
            </div>
            
            <div class="contact-card">
              <div class="contact-icon">📍</div>
              <h4>{{ $t('address.title') }}</h4>
              <p>{{ $t('address.description') }}</p>
              <span class="contact-link">{{ $t('address.value') }}</span>
            </div>
            
            <div class="contact-card">
              <div class="contact-icon">🌐</div>
              <h4>{{ $t('website.title') }}</h4>
              <p>{{ $t('website.description') }}</p>
              <a href="https://www.saahdel.org" target="_blank" class="contact-link">www.saahdel.org</a>
            </div>
          </div>
          
          <h3>{{ $t('hours.title') }}</h3>
          <p>{{ $t('hours.description') }}</p>
          <div class="hours-table">
            <div class="hours-row">
              <span class="hours-day">{{ $t('hours.weekdays') }}</span>
              <span class="hours-time">08:00 – 17:00 (UTC+1)</span>
            </div>
            <div class="hours-row">
              <span class="hours-day">{{ $t('hours.saturday') }}</span>
              <span class="hours-time">09:00 – 13:00 (UTC+1)</span>
            </div>
            <div class="hours-row hours-closed">
              <span class="hours-day">{{ $t('hours.sunday') }}</span>
              <span class="hours-time">{{ $t('hours.closed') }}</span>
            </div>
          </div>
          
          <h3>{{ $t('response.title') }}</h3>
          <p>{{ $t('response.description') }}</p>
          <div class="response-table">
            <div class="response-row">
              <span class="response-type response-critical">{{ $t('response.critical') }}</span>
              <span class="response-time">{{ $t('response.criticalTime') }}</span>
            </div>
            <div class="response-row">
              <span class="response-type response-high">{{ $t('response.high') }}</span>
              <span class="response-time">{{ $t('response.highTime') }}</span>
            </div>
            <div class="response-row">
              <span class="response-type response-normal">{{ $t('response.normal') }}</span>
              <span class="response-time">{{ $t('response.normalTime') }}</span>
            </div>
            <div class="response-row">
              <span class="response-type response-low">{{ $t('response.low') }}</span>
              <span class="response-time">{{ $t('response.lowTime') }}</span>
            </div>
          </div>
          
          <h3>{{ $t('emergency.title') }}</h3>
          <p>{{ $t('emergency.description') }}</p>
          
          <h3>{{ $t('bug.title') }}</h3>
          <p>{{ $t('bug.description') }}</p>
          <ul>
            <li>{{ $t('bug.item1') }}</li>
            <li>{{ $t('bug.item2') }}</li>
            <li>{{ $t('bug.item3') }}</li>
            <li>{{ $t('bug.item4') }}</li>
            <li>{{ $t('bug.item5') }}</li>
          </ul>
          
          <h3>{{ $t('feedback.title') }}</h3>
          <p>{{ $t('feedback.description') }}</p>
          
          <div class="social-links">
            <h4>{{ $t('social.title') }}</h4>
            <p class="social-desc">{{ $t('social.description') }}</p>
            <div class="social-icons">
              <a href="https://www.facebook.com/saahdel" target="_blank" class="social-btn" aria-label="Facebook">
                📘 Facebook — saahdel Officielle
              </a>
              <a href="https://www.saahdel.org" target="_blank" class="social-btn" aria-label="Site web">
                🌍 {{ $t('social.website') }}
              </a>
            </div>
          </div>
          
          <p class="legal-footer">{{ $t('footer') }}</p>
        </div>
      </template>
    </page-section>
  </div>
</template>

<script>
import PageSection from '../page/section.vue';

export default {
  name: 'LegalContacts',
  components: { PageSection }
};
</script>

<style lang="scss">
.contacts-content {
  .contact-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 20px;
    margin: 24px 0 32px;
  }
  
  .contact-card {
    background: #f0f7f0;
    border: 1px solid #c8e6c9;
    border-radius: 12px;
    padding: 24px;
    text-align: center;
    transition: transform 0.2s, box-shadow 0.2s;
    
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(46, 125, 50, 0.15);
    }
    
    .contact-icon {
      font-size: 36px;
      margin-bottom: 12px;
    }
    
    h4 {
      margin: 0 0 8px;
      color: #1b5e20;
      font-size: 16px;
    }
    
    p {
      color: #6b7280;
      font-size: 13px;
      margin-bottom: 12px;
    }
    
    .contact-link {
      color: #2e7d32;
      font-weight: 600;
      text-decoration: none;
      font-size: 14px;
      word-break: break-all;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
  
  .hours-table, .response-table {
    background: #f8f9fa;
    border-radius: 8px;
    padding: 16px;
    margin: 12px 0 24px;
  }
  
  .hours-row, .response-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    border-bottom: 1px solid #e5e7eb;
    
    &:last-child {
      border-bottom: none;
    }
  }
  
  .hours-day {
    font-weight: 600;
    color: #374151;
  }
  
  .hours-time {
    color: #2e7d32;
    font-weight: 500;
  }
  
  .hours-closed .hours-time {
    color: #dc2626;
  }
  
  .response-type {
    font-weight: 600;
    padding: 2px 10px;
    border-radius: 12px;
    font-size: 13px;
  }
  
  .response-critical {
    background: #fee2e2;
    color: #dc2626;
  }
  
  .response-high {
    background: #fef3c7;
    color: #d97706;
  }
  
  .response-normal {
    background: #dbeafe;
    color: #2563eb;
  }
  
  .response-low {
    background: #d1fae5;
    color: #059669;
  }
  
  .response-time {
    color: #374151;
    font-weight: 500;
  }
  
  .social-links {
    margin-top: 32px;
    padding: 24px;
    background: #f0f7f0;
    border: 1px solid #c8e6c9;
    border-radius: 12px;
    text-align: center;
    
    h4 {
      margin-top: 0;
      margin-bottom: 8px;
      color: #1b5e20;
    }
    
    .social-desc {
      color: #6b7280;
      font-size: 14px;
      margin-bottom: 16px;
    }
    
    .social-icons {
      display: flex;
      justify-content: center;
      gap: 16px;
      flex-wrap: wrap;
    }
    
    .social-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      background: #2e7d32;
      color: #fff;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 500;
      font-size: 14px;
      transition: background 0.2s;
      
      &:hover {
        background: #1b5e20;
      }
    }
  }
}
</style>

<i18n lang="json5">
{
  "en": {
    "title": "Contact Us",
    "intro": "The SAAHDEL team behind AGR-Collect is committed to providing you with excellent support. Whether you need technical assistance, have a question about using the platform, want to report an issue, or simply wish to share feedback — we are here to help. Please find below all the ways to reach us.",
    "email": {
      "title": "Email Support",
      "description": "For technical issues, questions, feature requests, or general inquiries about the platform"
    },
    "phone": {
      "title": "Phone Support",
      "description": "Speak directly with our support team for urgent matters or complex questions"
    },
    "address": {
      "title": "Office Address",
      "description": "Visit our headquarters or send postal mail",
      "value": "ONG SAAHDEL, Cameroun"
    },
    "website": {
      "title": "Website",
      "description": "Visit our official website for news, projects, and additional resources"
    },
    "hours": {
      "title": "Office Hours",
      "description": "Our support team is available during the following hours (West Africa Time, UTC+1):",
      "weekdays": "Monday – Friday",
      "saturday": "Saturday",
      "sunday": "Sunday & Holidays",
      "closed": "Closed"
    },
    "response": {
      "title": "Expected Response Times",
      "description": "We prioritize inquiries based on urgency. Here are our typical response times:",
      "critical": "Critical",
      "criticalTime": "Within 4 hours (platform down, data loss)",
      "high": "High",
      "highTime": "Within 24 hours (sync issues, login problems)",
      "normal": "Normal",
      "normalTime": "Within 48 hours (questions, feature requests)",
      "low": "Low",
      "lowTime": "Within 5 business days (suggestions, feedback)"
    },
    "emergency": {
      "title": "Emergency Contact",
      "description": "If you experience a critical issue outside of office hours (e.g., the platform is completely inaccessible, data synchronization is blocked for all agents, or there is a suspected security breach), please send an email to emmanueljuniordequa2{'@'}gmail.com with the word \"URGENT\" in the subject line. Include a clear description of the problem, any error messages, and your contact phone number. Our on-call team will respond as quickly as possible."
    },
    "bug": {
      "title": "How to Report a Bug",
      "description": "If you encounter a bug or unexpected behavior, please help us resolve it quickly by providing the following information in your email:",
      "item1": "A clear description of what happened and what you expected to happen instead",
      "item2": "The exact steps to reproduce the issue (e.g., \"I clicked on 'Send Data', then the app froze\")",
      "item3": "Your device information: device model, operating system version, and app version (found in the app settings)",
      "item4": "Screenshots or screen recordings showing the error, if possible",
      "item5": "The time and date when the issue occurred, and whether it happens consistently or intermittently"
    },
    "feedback": {
      "title": "Feedback & Suggestions",
      "description": "Your feedback is invaluable in helping us improve AGR-Collect. Whether you have ideas for new features, suggestions for improving the user experience, or observations about how the platform could better serve your fieldwork needs — we want to hear from you. Send your feedback to emmanueljuniordequa2{'@'}gmail.com with the subject \"Feedback\". Every suggestion is reviewed by our team and considered for future updates."
    },
    "social": {
      "title": "Follow Us Online",
      "description": "Stay updated on AGR-Collect news, updates, and SAAHDEL's humanitarian activities by following us on social media:",
      "website": "www.saahdel.org — Official Website"
    },
    "footer": "Thank you for using AGR-Collect. We are dedicated to supporting your fieldwork and ensuring the best possible experience with our platform."
  },
  "fr": {
    "title": "Nous Contacter",
    "intro": "L'équipe SAAHDEL derrière AGR-Collect s'engage à vous fournir un support de qualité. Que vous ayez besoin d'assistance technique, une question sur l'utilisation de la plateforme, que vous souhaitiez signaler un problème ou simplement partager vos retours — nous sommes là pour vous aider. Retrouvez ci-dessous tous les moyens de nous contacter.",
    "email": {
      "title": "Support par Email",
      "description": "Pour les problèmes techniques, questions, demandes de fonctionnalités ou renseignements généraux sur la plateforme"
    },
    "phone": {
      "title": "Support Téléphonique",
      "description": "Parlez directement avec notre équipe de support pour les questions urgentes ou complexes"
    },
    "address": {
      "title": "Adresse du Bureau",
      "description": "Visitez notre siège ou envoyez du courrier postal",
      "value": "ONG SAAHDEL, Cameroun"
    },
    "website": {
      "title": "Site Web",
      "description": "Visitez notre site officiel pour les actualités, projets et ressources supplémentaires"
    },
    "hours": {
      "title": "Heures d'Ouverture",
      "description": "Notre équipe de support est disponible aux horaires suivants (Heure d'Afrique de l'Ouest, UTC+1) :",
      "weekdays": "Lundi – Vendredi",
      "saturday": "Samedi",
      "sunday": "Dimanche & Jours fériés",
      "closed": "Fermé"
    },
    "response": {
      "title": "Délais de Réponse Estimés",
      "description": "Nous priorisons les demandes selon leur urgence. Voici nos délais de réponse typiques :",
      "critical": "Critique",
      "criticalTime": "Sous 4 heures (plateforme inaccessible, perte de données)",
      "high": "Élevé",
      "highTime": "Sous 24 heures (problèmes de sync, connexion)",
      "normal": "Normal",
      "normalTime": "Sous 48 heures (questions, demandes de fonctionnalités)",
      "low": "Faible",
      "lowTime": "Sous 5 jours ouvrables (suggestions, retours)"
    },
    "emergency": {
      "title": "Contact d'Urgence",
      "description": "Si vous rencontrez un problème critique en dehors des heures de bureau (ex : la plateforme est totalement inaccessible, la synchronisation des données est bloquée pour tous les agents, ou il y a une suspicion de faille de sécurité), veuillez envoyer un email à emmanueljuniordequa2{'@'}gmail.com avec le mot « URGENT » dans l'objet. Incluez une description claire du problème, les messages d'erreur éventuels et votre numéro de téléphone. Notre équipe de garde répondra le plus rapidement possible."
    },
    "bug": {
      "title": "Comment Signaler un Bug",
      "description": "Si vous rencontrez un bug ou un comportement inattendu, aidez-nous à le résoudre rapidement en fournissant les informations suivantes dans votre email :",
      "item1": "Une description claire de ce qui s'est passé et de ce que vous attendiez à la place",
      "item2": "Les étapes exactes pour reproduire le problème (ex : « J'ai cliqué sur 'Envoyer les données', puis l'appli s'est figée »)",
      "item3": "Les informations de votre appareil : modèle, version du système d'exploitation et version de l'application (disponible dans les paramètres de l'appli)",
      "item4": "Des captures d'écran ou enregistrements vidéo montrant l'erreur, si possible",
      "item5": "L'heure et la date auxquelles le problème s'est produit, et s'il se produit de manière constante ou intermittente"
    },
    "feedback": {
      "title": "Retours & Suggestions",
      "description": "Vos retours sont inestimables pour nous aider à améliorer AGR-Collect. Que vous ayez des idées de nouvelles fonctionnalités, des suggestions pour améliorer l'expérience utilisateur, ou des observations sur comment la plateforme pourrait mieux servir vos besoins terrain — nous voulons vous entendre. Envoyez vos retours à emmanueljuniordequa2{'@'}gmail.com avec l'objet « Retour ». Chaque suggestion est examinée par notre équipe et considérée pour les futures mises à jour."
    },
    "social": {
      "title": "Suivez-nous en Ligne",
      "description": "Restez informé des actualités d'AGR-Collect, des mises à jour et des activités humanitaires de SAAHDEL en nous suivant sur les réseaux sociaux :",
      "website": "www.saahdel.org — Site Officiel"
    },
    "footer": "Merci d'utiliser AGR-Collect. Nous sommes dédiés au soutien de votre travail terrain et à garantir la meilleure expérience possible avec notre plateforme."
  }
}
</i18n>
