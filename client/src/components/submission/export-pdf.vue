<!--
Copyright 2025 AGR-Collect
Export PDF Component - BF4.1 du cahier des charges
Permet l'exportation des données collectées sous forme de fichiers PDF
-->
<template>
  <modal id="submission-export-pdf" :state="state" hideable backdrop @hide="$emit('hide')">
    <template #title>{{ $t('title') }}</template>
    <template #body>
      <div class="export-pdf-container">
        <p class="modal-introduction">{{ $t('introduction') }}</p>
        
        <div class="export-options">
          <h4>{{ $t('options.title') }}</h4>
          
          <div class="form-group">
            <label>{{ $t('options.reportTitle') }}</label>
            <input type="text" class="form-control" v-model="reportTitle" 
              :placeholder="$t('options.reportTitlePlaceholder')">
          </div>
          
          <div class="checkbox">
            <label>
              <input type="checkbox" v-model="includeMetadata">
              {{ $t('options.includeMetadata') }}
            </label>
          </div>
          
          <div class="checkbox">
            <label>
              <input type="checkbox" v-model="includeGPS">
              {{ $t('options.includeGPS') }}
            </label>
          </div>
          
          <div class="checkbox">
            <label>
              <input type="checkbox" v-model="includeSummary">
              {{ $t('options.includeSummary') }}
            </label>
          </div>
        </div>
        
        <div class="report-preview" ref="reportContent">
          <div class="report-header">
            <img src="/logo.png" alt="AGR-Collect" class="report-logo" onerror="this.style.display='none'">
            <h1>{{ reportTitle || $t('defaultTitle') }}</h1>
            <p class="report-date">{{ $t('generatedOn') }}: {{ formatDate(new Date()) }}</p>
            <p class="report-project" v-if="project">{{ $t('project') }}: {{ project.name }}</p>
            <p class="report-form" v-if="form">{{ $t('form') }}: {{ form.nameOrId }}</p>
          </div>
          
          <div class="report-summary" v-if="includeSummary">
            <h2>{{ $t('summary.title') }}</h2>
            <div class="summary-stats">
              <div class="summary-item">
                <span class="summary-value">{{ submissionCount }}</span>
                <span class="summary-label">{{ $t('summary.submissions') }}</span>
              </div>
            </div>
          </div>
          
          <div class="report-metadata" v-if="includeMetadata">
            <h2>{{ $t('metadata.title') }}</h2>
            <table class="metadata-table">
              <tr>
                <td>{{ $t('metadata.exportedBy') }}</td>
                <td>{{ currentUser.displayName }}</td>
              </tr>
              <tr>
                <td>{{ $t('metadata.exportDate') }}</td>
                <td>{{ formatDate(new Date()) }}</td>
              </tr>
              <tr v-if="project">
                <td>{{ $t('metadata.project') }}</td>
                <td>{{ project.name }}</td>
              </tr>
              <tr v-if="form">
                <td>{{ $t('metadata.form') }}</td>
                <td>{{ form.nameOrId }}</td>
              </tr>
            </table>
          </div>
          
          <div class="report-footer">
            <p>{{ $t('footer.generated') }} AGR-Collect</p>
            <p>{{ $t('footer.confidential') }}</p>
          </div>
        </div>
      </div>
    </template>
    <template #actions>
      <button type="button" class="btn btn-default" @click="$emit('hide')">
        {{ $t('action.cancel') }}
      </button>
      <button type="button" class="btn btn-primary" @click="exportPDF">
        <span class="icon-file-pdf-o"></span> {{ $t('action.export') }}
      </button>
    </template>
  </modal>
</template>

<script>
import Modal from '../modal.vue';

import { useRequestData } from '../../request-data';

export default {
  name: 'SubmissionExportPdf',
  components: { Modal },
  props: {
    state: Boolean,
    submissionCount: {
      type: Number,
      default: 0
    }
  },
  emits: ['hide'],
  setup() {
    const { currentUser, project, form } = useRequestData();
    return { currentUser, project, form };
  },
  data() {
    return {
      reportTitle: '',
      includeMetadata: true,
      includeGPS: true,
      includeSummary: true
    };
  },
  methods: {
    formatDate(date) {
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    exportPDF() {
      const printWindow = window.open('', '_blank');
      const reportContent = this.$refs.reportContent.innerHTML;
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${this.reportTitle || this.$t('defaultTitle')}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              padding: 40px;
              color: #111827;
            }
            .report-header {
              text-align: center;
              border-bottom: 2px solid #009ecc;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .report-logo {
              max-height: 60px;
              margin-bottom: 10px;
            }
            h1 {
              color: #009ecc;
              font-size: 28px;
              margin-bottom: 10px;
            }
            h2 {
              color: #111827;
              font-size: 18px;
              margin: 20px 0 15px;
              border-bottom: 1px solid #e5e7eb;
              padding-bottom: 8px;
            }
            .report-date, .report-project, .report-form {
              color: #6b7280;
              font-size: 14px;
              margin: 5px 0;
            }
            .summary-stats {
              display: flex;
              gap: 30px;
              justify-content: center;
              margin: 20px 0;
            }
            .summary-item {
              text-align: center;
              padding: 20px;
              background: #f8f9fa;
              border-radius: 8px;
              min-width: 120px;
            }
            .summary-value {
              display: block;
              font-size: 36px;
              font-weight: bold;
              color: #009ecc;
            }
            .summary-label {
              display: block;
              font-size: 14px;
              color: #6b7280;
              margin-top: 5px;
            }
            .metadata-table {
              width: 100%;
              border-collapse: collapse;
              margin: 15px 0;
            }
            .metadata-table td {
              padding: 10px;
              border-bottom: 1px solid #f3f4f6;
            }
            .metadata-table td:first-child {
              font-weight: 600;
              width: 40%;
              color: #6b7280;
            }
            .report-footer {
              margin-top: 50px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              text-align: center;
              font-size: 12px;
              color: #9ca3af;
            }
            @media print {
              body { padding: 20px; }
              @page { margin: 1cm; }
            }
          </style>
        </head>
        <body>
          ${reportContent}
        </body>
        </html>
      `);
      
      printWindow.document.close();
      
      printWindow.onload = () => {
        printWindow.print();
      };
      
      this.$emit('hide');
    }
  }
};
</script>

<style lang="scss">
#submission-export-pdf {
  .export-pdf-container {
    max-height: 60vh;
    overflow-y: auto;
  }
  
  .export-options {
    background: #f8f9fa;
    padding: 16px;
    border-radius: 8px;
    margin-bottom: 20px;
    
    h4 {
      margin: 0 0 12px;
      font-size: 14px;
      color: #111827;
    }
    
    .form-group {
      margin-bottom: 12px;
      
      label {
        display: block;
        margin-bottom: 4px;
        font-size: 13px;
        color: #6b7280;
      }
    }
    
    .checkbox {
      margin-bottom: 8px;
      
      label {
        font-size: 13px;
      }
    }
  }
  
  .report-preview {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 24px;
    background: #fff;
    
    .report-header {
      text-align: center;
      border-bottom: 2px solid #009ecc;
      padding-bottom: 16px;
      margin-bottom: 20px;
      
      .report-logo {
        max-height: 50px;
        margin-bottom: 8px;
      }
      
      h1 {
        color: #009ecc;
        font-size: 22px;
        margin-bottom: 8px;
      }
      
      .report-date,
      .report-project,
      .report-form {
        color: #6b7280;
        font-size: 13px;
        margin: 4px 0;
      }
    }
    
    .report-summary {
      h2 {
        font-size: 16px;
        color: #111827;
        margin-bottom: 12px;
        border-bottom: 1px solid #f3f4f6;
        padding-bottom: 6px;
      }
      
      .summary-stats {
        display: flex;
        gap: 20px;
        justify-content: center;
        
        .summary-item {
          text-align: center;
          padding: 16px;
          background: #f8f9fa;
          border-radius: 8px;
          min-width: 100px;
          
          .summary-value {
            display: block;
            font-size: 28px;
            font-weight: bold;
            color: #009ecc;
          }
          
          .summary-label {
            display: block;
            font-size: 12px;
            color: #6b7280;
            margin-top: 4px;
          }
        }
      }
    }
    
    .report-metadata {
      h2 {
        font-size: 16px;
        color: #111827;
        margin: 16px 0 12px;
        border-bottom: 1px solid #f3f4f6;
        padding-bottom: 6px;
      }
      
      .metadata-table {
        width: 100%;
        font-size: 13px;
        
        td {
          padding: 8px;
          border-bottom: 1px solid #f0f0f0;
          
          &:first-child {
            font-weight: 600;
            color: #6b7280;
            width: 40%;
          }
        }
      }
    }
    
    .report-footer {
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      font-size: 11px;
      color: #9ca3af;
      
      p {
        margin: 2px 0;
      }
    }
  }
}
</style>

<i18n lang="json5">
{
  "en": {
    "title": "Export PDF Report",
    "introduction": "Generate a PDF report of your data. You can customize the report content and format below.",
    "defaultTitle": "AGR-Collect Data Report",
    "generatedOn": "Generated on",
    "project": "Project",
    "form": "Form",
    "options": {
      "title": "Report Options",
      "reportTitle": "Report Title",
      "reportTitlePlaceholder": "Enter a custom title for your report",
      "includeMetadata": "Include export metadata",
      "includeGPS": "Include GPS coordinates",
      "includeSummary": "Include summary statistics"
    },
    "summary": {
      "title": "Summary",
      "submissions": "Submissions"
    },
    "metadata": {
      "title": "Export Information",
      "exportedBy": "Exported by",
      "exportDate": "Export date",
      "project": "Project",
      "form": "Form"
    },
    "footer": {
      "generated": "Report generated by",
      "confidential": "This document contains confidential data."
    },
    "action": {
      "cancel": "Cancel",
      "export": "Export PDF"
    }
  },
  "fr": {
    "title": "Exporter Rapport PDF",
    "introduction": "Générez un rapport PDF de vos données. Vous pouvez personnaliser le contenu et le format du rapport ci-dessous.",
    "defaultTitle": "Rapport de Données AGR-Collect",
    "generatedOn": "Généré le",
    "project": "Projet",
    "form": "Formulaire",
    "options": {
      "title": "Options du Rapport",
      "reportTitle": "Titre du Rapport",
      "reportTitlePlaceholder": "Entrez un titre personnalisé pour votre rapport",
      "includeMetadata": "Inclure les métadonnées d'export",
      "includeGPS": "Inclure les coordonnées GPS",
      "includeSummary": "Inclure les statistiques récapitulatives"
    },
    "summary": {
      "title": "Résumé",
      "submissions": "Soumissions"
    },
    "metadata": {
      "title": "Informations d'Export",
      "exportedBy": "Exporté par",
      "exportDate": "Date d'export",
      "project": "Projet",
      "form": "Formulaire"
    },
    "footer": {
      "generated": "Rapport généré par",
      "confidential": "Ce document contient des données confidentielles."
    },
    "action": {
      "cancel": "Annuler",
      "export": "Exporter PDF"
    }
  }
}
</i18n>
