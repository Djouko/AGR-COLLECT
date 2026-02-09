<template>
  <div id="submission-download-button" class="btn-group">
    <div class="dropdown">
      <button type="button" class="btn btn-primary"
        :data-toggle="filtered ? 'dropdown' : null"
        v-bind="$attrs"
        @click="download">
        <span class="icon-arrow-circle-down"></span>
        <span>{{ $t('action.download') }}</span>
      </button>
      <ul class="dropdown-menu dropdown-menu-right">
        <li>
          <button type="button" class="btn btn-link dropdown-item"
            @click="$emit('downloadFiltered')">
            <span>{{ downloadFiltered }}</span>
          </button>
        </li>
        <li v-if="formVersion.dataExists">
          <button type="button" class="btn btn-link dropdown-item"
            @click="$emit('download')">
            <span>{{ $tcn('action.download.unfiltered', formVersion.submissions) }}</span>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { useRequestData } from '../../request-data';

export default {
  name: 'SubmissionDownloadButton',
  props: {
    formVersion: Object,
    filtered: Boolean
  },
  emits: ['download', 'downloadFiltered'],
  setup() {
    const { odata } = useRequestData();
    return { odata };
  },
  computed: {
    downloadFiltered() {
      return !this.odata.dataExists
        ? this.$t('action.download.filtered.withoutCount')
        : this.$tcn('action.download.filtered.withCount', this.odata.count);
    }
  },
  methods: {
    download() {
      if (!this.filtered) {
        this.$emit('download');
      }
    }
  }
};
</script>

<style lang="scss">
@import '../../assets/scss/variables';

#submission-download-button{
  display: flex;
  gap: 8px;
  
  .dropdown {
    .btn-primary {
      display: block;
    }
  }

  .dropdown-item {
    width: 100%;
    text-align: left;
    color: $color-text;

    &:hover {
      color: #262626;
      text-decoration: none;
      background-color: #f5f5f5;
    }
  }
  
  .btn-default {
    display: flex;
    align-items: center;
    gap: 4px;
    
    .icon-file-pdf-o {
      color: #dc3545;
    }
    
    .btn-label {
      font-size: 12px;
      font-weight: 600;
    }
  }
}
</style>

<i18n lang="json5">
{
  // @transifexKey component.SubmissionDownloadDropdown
  "en": {
    "action": {
      "download": {
        "unfiltered": "Download {count} Submission | Download all {count} Submissions",
        "filtered": {
          // This is the text of a button. This text is shown when the number of
          // matching Submissions is unknown.
          "withoutCount": "Download all Submissions matching the filter",
          "withCount": "Download {count} Submission matching the filter | Download {count} Submissions matching the filter"
        }
      },
      "exportPdf": "Export PDF Report"
    }
  },
  "fr": {
    "action": {
      "download": {
        "unfiltered": "Télécharger {count} soumission | Télécharger toutes les {count} soumissions",
        "filtered": {
          "withoutCount": "Télécharger toutes les soumissions filtrées",
          "withCount": "Télécharger {count} soumission filtrée | Télécharger {count} soumissions filtrées"
        }
      },
      "exportPdf": "Exporter Rapport PDF"
    }
  }
}
</i18n>

<i18n>
{
  "de": {
    "action": {
      "download": {
        "unfiltered": "{count} Übermittlung herunterladen | Alle {count} Übermittlungen herunterladen",
        "filtered": {
          "withoutCount": "Alle Übermittlungen herunterladen, die dem Filter entsprechen",
          "withCount": "{count} Übermittlung herunterladen, die dem Filter entsprechen | {count} Übermittlungen herunterladen, die dem Filter entsprechen"
        }
      }
    }
  },
  "es": {
    "action": {
      "download": {
        "unfiltered": "Descargar {count} envío | Descargar todos los {count} envíos | Descargar todos los {count} envíos",
        "filtered": {
          "withoutCount": "Descargar todos los envíos que coincidan con el filtro",
          "withCount": "Descargar {count} envío que coincidan con el filtro | Descargar {count} envíos que coincidan con el filtro | Descargar {count} envíos que coincidan con el filtro"
        }
      }
    }
  },
  "fr": {
    "action": {
      "download": {
        "unfiltered": "Télécharger {count} soumission | Télécharger toutes les {count} soumissions | Télécharger toutes les {count} soumissions",
        "filtered": {
          "withoutCount": "Télécharger toutes les entitées filtrées",
          "withCount": "Télécharger {count} soumission filtrée | Télécharger {count} soumissions filtrées | Télécharger {count} soumissions filtrées"
        }
      }
    }
  },
  "it": {
    "action": {
      "download": {
        "unfiltered": "Scarica {count} Invio | Scarica tutti i {count} Invii | Scarica tutti i {count} Invii",
        "filtered": {
          "withoutCount": "Scaricare tutti gli invii che corrispondono al filtro",
          "withCount": "Scaricare il {count} invio che corrisponde al filtro | Scaricare gli {count} invii che corrispondono al filtro | Scaricare gli {count} invii che corrispondono al filtro"
        }
      }
    }
  },
  "pt": {
    "action": {
      "download": {
        "unfiltered": "Baixar {count} Resposta | Baixar todas as {count} Respostas | Baixar todas as {count} Respostas",
        "filtered": {
          "withoutCount": "Baixar todas as Respostas filtradas",
          "withCount": "Baixar {count} Resposta filtrada | Baixar {count} Respostas filtradas | Baixar {count} Respostas filtradas"
        }
      }
    }
  },
  "zh": {
    "action": {
      "download": {
        "unfiltered": "下载全部{count}个提交的内容",
        "filtered": {
          "withoutCount": "下载符合条件的所有提交内容",
          "withCount": "下载个{count}个符合筛选条件的提交"
        }
      }
    }
  },
  "zh-Hant": {
    "action": {
      "download": {
        "unfiltered": "下載全部{count} 個提交資料",
        "filtered": {
          "withoutCount": "下載符合篩選條件的所有提交內容",
          "withCount": "下載{count}個符合篩選條件的提交內容"
        }
      }
    }
  }
}
</i18n>
