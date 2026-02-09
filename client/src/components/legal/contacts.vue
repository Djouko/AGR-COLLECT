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
              <div class="contact-icon">
                <span class="icon-envelope"></span>
              </div>
              <h4>{{ $t('support.title') }}</h4>
              <p>{{ $t('support.description') }}</p>
              <a href="mailto:support@agr-collect.local" class="contact-link">
                support@agr-collect.local
              </a>
            </div>
            
            <div class="contact-card">
              <div class="contact-icon">
                <span class="icon-phone"></span>
              </div>
              <h4>{{ $t('phone.title') }}</h4>
              <p>{{ $t('phone.description') }}</p>
              <span class="contact-link">+243 XX XXX XXXX</span>
            </div>
            
            <div class="contact-card">
              <div class="contact-icon">
                <span class="icon-map-marker"></span>
              </div>
              <h4>{{ $t('address.title') }}</h4>
              <p>{{ $t('address.description') }}</p>
              <span class="contact-link">
                ONG SAAHDEL<br>
                Kinshasa, RDC
              </span>
            </div>
          </div>
          
          <h3>{{ $t('emergency.title') }}</h3>
          <p>{{ $t('emergency.description') }}</p>
          
          <h3>{{ $t('feedback.title') }}</h3>
          <p>{{ $t('feedback.description') }}</p>
          
          <div class="social-links">
            <h4>{{ $t('social.title') }}</h4>
            <div class="social-icons">
              <a href="#" class="social-icon" aria-label="Facebook">
                <span class="icon-user"></span>
              </a>
              <a href="#" class="social-icon" aria-label="Twitter">
                <span class="icon-comment"></span>
              </a>
              <a href="#" class="social-icon" aria-label="LinkedIn">
                <span class="icon-briefcase"></span>
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
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 24px;
    margin: 24px 0;
  }
  
  .contact-card {
    background: #f8f9fa;
    border-radius: 12px;
    padding: 24px;
    text-align: center;
    transition: transform 0.2s, box-shadow 0.2s;
    
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    }
    
    .contact-icon {
      width: 60px;
      height: 60px;
      background: #009ecc;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
      
      span {
        font-size: 24px;
        color: #fff;
      }
    }
    
    h4 {
      margin: 0 0 8px;
      color: #111827;
    }
    
    p {
      color: #6b7280;
      font-size: 14px;
      margin-bottom: 12px;
    }
    
    .contact-link {
      color: #009ecc;
      font-weight: 600;
      text-decoration: none;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
  
  .social-links {
    margin-top: 32px;
    padding: 24px;
    background: #f8f9fa;
    border-radius: 12px;
    text-align: center;
    
    h4 {
      margin-top: 0;
      margin-bottom: 16px;
    }
    
    .social-icons {
      display: flex;
      justify-content: center;
      gap: 16px;
    }
    
    .social-icon {
      width: 48px;
      height: 48px;
      background: #009ecc;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      text-decoration: none;
      transition: background 0.2s;
      
      &:hover {
        background: #007ea3;
      }
      
      span {
        font-size: 20px;
      }
    }
  }
}
</style>

<i18n lang="json5">
{
  "en": {
    "title": "Contact Us",
    "intro": "Our team is here to help you. Feel free to contact us for any questions, technical assistance, or feedback.",
    "support": {
      "title": "Technical Support",
      "description": "For technical issues or questions about using the platform"
    },
    "phone": {
      "title": "Telephone",
      "description": "Available Monday to Friday, 8am - 5pm"
    },
    "address": {
      "title": "Address",
      "description": "Our headquarters"
    },
    "emergency": {
      "title": "Emergency Contact",
      "description": "For urgent matters outside office hours, please send an email with 'URGENT' in the subject line. Our on-call team will respond as soon as possible."
    },
    "feedback": {
      "title": "Feedback & Suggestions",
      "description": "We value your feedback! If you have suggestions for improving AGR-Collect, please share them with us. Your input helps us create a better platform for everyone."
    },
    "social": {
      "title": "Follow Us"
    },
    "footer": "We strive to respond to all inquiries within 24-48 hours."
  },
  "fr": {
    "title": "Nous Contacter",
    "intro": "Notre équipe est là pour vous aider. N'hésitez pas à nous contacter pour toute question, assistance technique ou retour d'expérience.",
    "support": {
      "title": "Support Technique",
      "description": "Pour les problèmes techniques ou questions sur l'utilisation de la plateforme"
    },
    "phone": {
      "title": "Téléphone",
      "description": "Disponible du lundi au vendredi, 8h - 17h"
    },
    "address": {
      "title": "Adresse",
      "description": "Notre siège"
    },
    "emergency": {
      "title": "Contact d'Urgence",
      "description": "Pour les urgences en dehors des heures de bureau, veuillez envoyer un email avec 'URGENT' dans l'objet. Notre équipe de garde répondra dès que possible."
    },
    "feedback": {
      "title": "Retours & Suggestions",
      "description": "Vos retours sont précieux ! Si vous avez des suggestions pour améliorer AGR-Collect, partagez-les avec nous. Vos contributions nous aident à créer une meilleure plateforme pour tous."
    },
    "social": {
      "title": "Suivez-nous"
    },
    "footer": "Nous nous efforçons de répondre à toutes les demandes dans les 24-48 heures."
  }
}
</i18n>
