<template>
  <div id="home-summary-container">
    <div id="home-summary">
      <home-summary-item icon="archive">
        <template #header>
          <template v-if="!projects.initiallyLoading">
            {{ $n(projects.length, 'default') }}
          </template>
          <template v-else>
            <spinner inline/>
          </template>
        </template>
        <template #subheader>{{ $tc('plural.project', projects.length ?? 0) }}</template>
        <template #body>{{ $t('projects.body') }}</template>
      </home-summary-item>
      <home-summary-item v-if="currentUser.can('user.list')" to="/users" icon="user-circle">
        <template #header>
          <template v-if="!users.initiallyLoading">
            {{ $n(users.length, 'default') }}
          </template>
          <template v-else>
            <spinner inline/>
          </template>
        </template>
        <template #subheader>{{ $tc('plural.user', users.length ?? 0) }}</template>
        <template #body>{{ $t('users.body') }}</template>
      </home-summary-item>
    </div>
  </div>
</template>

<script setup>
import HomeSummaryItem from './summary/item.vue';
import Spinner from '../spinner.vue';

import { noop } from '../../util/util';
import { useRequestData } from '../../request-data';

defineOptions({
  name: 'HomeSummary'
});

const { currentUser, projects, createResource } = useRequestData();
const users = createResource('users');
if (currentUser.can('user.list'))
  users.request({ url: '/v1/users' }).catch(noop);
</script>

<style lang="scss">
@use 'sass:math';
@import '../../assets/scss/variables';

#home-summary-container {
  background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 40%, #f0f9ff 100%);
  margin-left: -15px;
  margin-right: -15px;
  padding: 32px 20px;
  border-bottom: 1px solid #e5e7eb;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -60px;
    right: -40px;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background: rgba(46, 125, 50, 0.04);
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -80px;
    left: -60px;
    width: 240px;
    height: 240px;
    border-radius: 50%;
    background: rgba(21, 101, 192, 0.03);
    pointer-events: none;
  }
}

#home-summary {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 20px;
  margin-left: auto;
  margin-right: auto;
  max-width: $max-width-page-body;
  position: relative;
  z-index: 1;

  > * {
    flex: 1 1 0%;
    min-width: 0;
  }

  @media (max-width: $screen-sm-min) {
    flex-direction: column;
    gap: 12px;
  }
}
</style>

<i18n lang="json5">
{
  "en": {
    "projects": {
      "body": "AGR-Collect est organisé en Projets, chacun contenant ses propres Formulaires et données."
    },
    "users": {
      "body": "Users can be assigned to Projects to manage them, collect data, or review Submissions."
    },
    "docs": {
      "body": "Un guide de démarrage et la documentation utilisateur sont disponibles."
    },
    "forum": {
      "body": "Need help? Visit the forum to ask questions or browse past discussions."
    }
  }
}
</i18n>

<i18n>
{
  "de": {
    "projects": {
      "body": "AGR-Collect ist in Projekte organisiert, die jeweils ihre eigenen Formulare und zugehörigen Daten enthalten."
    },
    "users": {
      "body": "Benutzer können Projekten zugewiesen werden, um sie zu verwalten oder eingereichte Daten zu sammeln oder Übermittlungen zu überprüfen."
    },
    "docs": {
      "body": "Es gibt ein Erste-Schritte-Tutorial und die Benutzerdokumentation."
    },
    "forum": {
      "body": "Brauchen Sie Hilfe? Besuchen Sie das Forum, um Fragen zu stellen oder frühere Diskussionen zu verfolgen."
    }
  },
  "es": {
    "projects": {
      "body": "AGR-Collect está organizada en Proyectos, cada uno de los cuales contiene sus propios Formularios y datos relacionados."
    },
    "users": {
      "body": "Los usuarios pueden asignarse a Proyectos para administrarlos o para recopilar o revisar los datos enviados."
    },
    "docs": {
      "body": "Hay una guía de inicio y documentación del usuario disponibles."
    },
    "forum": {
      "body": "¿Necesita ayuda? Visite el foro para hacer preguntas o consultar debates anteriores."
    }
  },
  "fr": {
    "projects": {
      "body": "AGR-Collect est organisé en Projets, ayant chacun ses propres formulaires et les données associées."
    },
    "users": {
      "body": "Les utilisateurs peuvent être assignés à des Projets pour les gérer, collecter des données ou passer en revue les soumissions."
    },
    "docs": {
      "body": "Un Guide de Démarrage et une documentation utilisateur sont disponibles."
    },
    "forum": {
      "body": "Besoin d'aide ? Visitez le forum pour poser des questions ou parcourir les anciennes discussions."
    }
  },
  "it": {
    "projects": {
      "body": "AGR-Collect è organizzato in Progetti, ognuno dei quali contiene i propri Formulari e i relativi dati."
    },
    "users": {
      "body": "Gli utenti possono essere assegnati ai progetti per gestirli, per raccogliere o rivedere i dati inviati."
    },
    "docs": {
      "body": "Sono disponibili una guida introduttiva e una documentazione per l'utente."
    },
    "forum": {
      "body": "Avete bisogno di aiuto? Visitate il forum per porre domande o consultare le discussioni precedenti."
    }
  },
  "pt": {
    "projects": {
      "body": "AGR-Collect é organizado em Projetos, cada um contendo seus próprios Formulários e os dados relacionados a eles."
    },
    "users": {
      "body": "Usuários podem ser atribuídos a Projetos para gerenciá-los, coletar dados ou revisar Respostas."
    },
    "docs": {
      "body": "Um Guia de Início Rápido e a documentação de usuário estão disponíveis."
    },
    "forum": {
      "body": "Precisa de ajuda? Visite o fórum para fazer perguntas ou visualizar discussões existentes."
    }
  },
  "zh": {
    "projects": {
      "body": "AGR-Collect采用项目制管理，每个项目包含独立的表单及相关数据。"
    },
    "users": {
      "body": "用户可被分配至不同项目，以执行管理、数据收集或提交审核等任务。"
    },
    "docs": {
      "body": "提供入门指南和用户手册。"
    },
    "forum": {
      "body": "需要帮助？欢迎访问论坛提问或浏览历史讨论。"
    }
  },
  "zh-Hant": {
    "projects": {
      "body": "AGR-Collect 以專案為單位組織，每個專案包含其表單與相關數據。"
    },
    "users": {
      "body": "使用者可被指派至專案，以管理專案、收集資料或檢閱提交內容。"
    },
    "docs": {
      "body": "提供入門指南和使用者文件。"
    },
    "forum": {
      "body": "需要協助嗎？訪問論壇提問或瀏覽過去的討論。"
    }
  }
}
</i18n>
