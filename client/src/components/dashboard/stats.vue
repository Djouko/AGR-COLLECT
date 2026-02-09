<template>
  <div id="dashboard-stats">
    <page-section>
      <template #heading>
        <span class="icon-bar-chart"></span> {{ $t('title') }}
      </template>
      <template #body>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon projects">
              <span class="icon-archive"></span>
            </div>
            <div class="stat-content">
              <div class="stat-value">
                <template v-if="!projects.initiallyLoading">
                  {{ $n(projects.length, 'default') }}
                </template>
                <spinner v-else inline/>
              </div>
              <div class="stat-label">{{ $t('stats.projects') }}</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon forms">
              <span class="icon-file-text"></span>
            </div>
            <div class="stat-content">
              <div class="stat-value">
                <template v-if="!projects.initiallyLoading">
                  {{ $n(totalForms, 'default') }}
                </template>
                <spinner v-else inline/>
              </div>
              <div class="stat-label">{{ $t('stats.forms') }}</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon submissions">
              <span class="icon-inbox"></span>
            </div>
            <div class="stat-content">
              <div class="stat-value">
                <template v-if="!projects.initiallyLoading">
                  {{ $n(totalSubmissions, 'default') }}
                </template>
                <spinner v-else inline/>
              </div>
              <div class="stat-label">{{ $t('stats.submissions') }}</div>
            </div>
          </div>

          <div class="stat-card" v-if="currentUser.can('user.list')">
            <div class="stat-icon users">
              <span class="icon-users"></span>
            </div>
            <div class="stat-content">
              <div class="stat-value">
                <template v-if="!users.initiallyLoading">
                  {{ $n(users.length, 'default') }}
                </template>
                <spinner v-else inline/>
              </div>
              <div class="stat-label">{{ $t('stats.users') }}</div>
            </div>
          </div>
        </div>

        <div class="submissions-breakdown" v-if="!projects.initiallyLoading && projects.length > 0">
          <h4>{{ $t('breakdown.title') }}</h4>
          <div class="breakdown-list">
            <div 
              v-for="project in topProjects" 
              :key="project.id" 
              class="breakdown-item"
            >
              <div class="breakdown-header">
                <span class="breakdown-name">{{ project.name }}</span>
                <span class="breakdown-count">{{ $n(project.submissions, 'default') }}</span>
              </div>
              <div class="breakdown-bar">
                <div 
                  class="breakdown-progress" 
                  :style="{ width: getProgressWidth(project.submissions) + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div class="recent-activity" v-if="currentUser.can('audit.read')">
          <h4>{{ $t('activity.title') }}</h4>
          <div v-if="audits.initiallyLoading" class="activity-loading">
            <spinner inline/> {{ $t('activity.loading') }}
          </div>
          <div v-else-if="audits.length === 0" class="activity-empty">
            {{ $t('activity.empty') }}
          </div>
          <div v-else class="activity-list">
            <div 
              v-for="audit in audits.slice(0, 5)" 
              :key="audit.loggedAt" 
              class="activity-item"
            >
              <span class="activity-icon" :class="getActivityClass(audit.action)">
                <span :class="getActivityIcon(audit.action)"></span>
              </span>
              <div class="activity-content">
                <span class="activity-action">{{ formatAction(audit.action) }}</span>
                <span class="activity-time">{{ formatTime(audit.loggedAt) }}</span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </page-section>
  </div>
</template>

<script>
import PageSection from '../page/section.vue';
import Spinner from '../spinner.vue';

import { noop } from '../../util/util';
import { useRequestData } from '../../request-data';

export default {
  name: 'DashboardStats',
  components: { PageSection, Spinner },
  setup() {
    const { currentUser, projects, createResource } = useRequestData();
    const users = createResource('users');
    const audits = createResource('audits');
    
    if (currentUser.can('user.list'))
      users.request({ url: '/v1/users' }).catch(noop);
    
    if (currentUser.can('audit.read'))
      audits.request({ url: '/v1/audits?limit=10' }).catch(noop);
    
    return { currentUser, projects, users, audits };
  },
  computed: {
    totalForms() {
      if (!this.projects.dataExists) return 0;
      return this.projects.reduce((sum, p) => sum + (p.forms || 0), 0);
    },
    totalSubmissions() {
      if (!this.projects.dataExists) return 0;
      return this.projects.reduce((sum, p) => sum + (p.lastSubmission ? 1 : 0), 0);
    },
    maxSubmissions() {
      if (!this.projects.dataExists) return 1;
      const max = Math.max(...this.projects.map(p => p.forms || 0));
      return max > 0 ? max : 1;
    },
    topProjects() {
      if (!this.projects.dataExists) return [];
      return [...this.projects]
        .map(p => ({ id: p.id, name: p.name, submissions: p.forms || 0 }))
        .sort((a, b) => b.submissions - a.submissions)
        .slice(0, 5);
    }
  },
  methods: {
    getProgressWidth(submissions) {
      return Math.round((submissions / this.maxSubmissions) * 100);
    },
    getActivityClass(action) {
      if (action.includes('create')) return 'create';
      if (action.includes('delete')) return 'delete';
      if (action.includes('update')) return 'update';
      return 'default';
    },
    getActivityIcon(action) {
      if (action.includes('user')) return 'icon-user';
      if (action.includes('project')) return 'icon-archive';
      if (action.includes('form')) return 'icon-file-text';
      if (action.includes('submission')) return 'icon-inbox';
      return 'icon-circle';
    },
    formatAction(action) {
      return action.replace(/\./g, ' ').replace(/_/g, ' ');
    },
    formatTime(timestamp) {
      const date = new Date(timestamp);
      const now = new Date();
      const diff = now - date;
      
      if (diff < 60000) return this.$t('activity.justNow');
      if (diff < 3600000) return this.$t('activity.minutesAgo', { n: Math.floor(diff / 60000) });
      if (diff < 86400000) return this.$t('activity.hoursAgo', { n: Math.floor(diff / 3600000) });
      return date.toLocaleDateString();
    }
  }
};
</script>

<style lang="scss">
@import '../../assets/scss/variables';

#dashboard-stats {
  margin-bottom: 24px;

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 32px;
  }

  .stat-card {
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transition: transform 0.2s, box-shadow 0.2s;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
    }

    .stat-icon {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      
      span {
        font-size: 24px;
        color: #fff;
      }

      &.projects { background: linear-gradient(135deg, #667eea, #764ba2); }
      &.forms { background: linear-gradient(135deg, #11998e, #38ef7d); }
      &.submissions { background: linear-gradient(135deg, #fc4a1a, #f7b733); }
      &.users { background: linear-gradient(135deg, #4facfe, #00f2fe); }
    }

    .stat-content {
      .stat-value {
        font-size: 28px;
        font-weight: 700;
        color: #111827;
        line-height: 1.2;
      }

      .stat-label {
        font-size: 14px;
        color: #6b7280;
        margin-top: 4px;
      }
    }
  }

  .submissions-breakdown {
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

    h4 {
      margin: 0 0 16px;
      color: #111827;
      font-size: 16px;
    }

    .breakdown-item {
      margin-bottom: 16px;

      &:last-child {
        margin-bottom: 0;
      }

      .breakdown-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 6px;

        .breakdown-name {
          font-weight: 500;
          color: #111827;
        }

        .breakdown-count {
          color: #6b7280;
          font-size: 14px;
        }
      }

      .breakdown-bar {
        height: 8px;
        background: #e9ecef;
        border-radius: 4px;
        overflow: hidden;

        .breakdown-progress {
          height: 100%;
          background: linear-gradient(90deg, #009ecc, #00d4ff);
          border-radius: 4px;
          transition: width 0.5s ease;
        }
      }
    }
  }

  .recent-activity {
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

    h4 {
      margin: 0 0 16px;
      color: #111827;
      font-size: 16px;
    }

    .activity-loading,
    .activity-empty {
      color: #6b7280;
      font-size: 14px;
      padding: 12px 0;
    }

    .activity-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 0;
      border-bottom: 1px solid #f0f0f0;

      &:last-child {
        border-bottom: none;
      }

      .activity-icon {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;

        span {
          font-size: 14px;
          color: #fff;
        }

        &.create { background: #2e7d32; }
        &.update { background: #ffc107; }
        &.delete { background: #dc3545; }
        &.default { background: #6b7280; }
      }

      .activity-content {
        flex: 1;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .activity-action {
          font-size: 14px;
          color: #111827;
          text-transform: capitalize;
        }

        .activity-time {
          font-size: 12px;
          color: #9ca3af;
        }
      }
    }
  }
}
</style>

<i18n lang="json5">
{
  "en": {
    "title": "Dashboard",
    "stats": {
      "projects": "Projects",
      "forms": "Forms",
      "submissions": "Submissions",
      "users": "Users"
    },
    "breakdown": {
      "title": "Forms by Project"
    },
    "activity": {
      "title": "Recent Activity",
      "loading": "Loading activity...",
      "empty": "No recent activity",
      "justNow": "Just now",
      "minutesAgo": "{n} min ago",
      "hoursAgo": "{n} hours ago"
    }
  },
  "fr": {
    "title": "Tableau de Bord",
    "stats": {
      "projects": "Projets",
      "forms": "Formulaires",
      "submissions": "Soumissions",
      "users": "Utilisateurs"
    },
    "breakdown": {
      "title": "Formulaires par Projet"
    },
    "activity": {
      "title": "Activité Récente",
      "loading": "Chargement de l'activité...",
      "empty": "Aucune activité récente",
      "justNow": "À l'instant",
      "minutesAgo": "Il y a {n} min",
      "hoursAgo": "Il y a {n} heures"
    }
  }
}
</i18n>
