<!--
Copyright 2025 AGR-Collect Developers
Rapport PDF pour un projet avec tous ses formulaires et soumissions
-->
<template>
  <div class="project-report-container">
    <button type="button" class="btn btn-report" @click="openModal">
      <span class="icon-file-pdf-o"></span>
      <span>{{ $t('button.report') }}</span>
    </button>

    <modal v-if="showModal" size="full" @hide="closeModal" hideable>
      <template #title>
        <span class="icon-archive"></span>
        {{ $t('modal.title') }}
      </template>
      <template #body>
        <div v-if="loading" class="text-center p-4">
          <spinner :state="true"/>
          <p>{{ $t('loading') }}</p>
        </div>
        
        <div v-else id="project-report-content" class="report-content">
          <div class="report-header">
            <div class="header-left">
              <h1 class="report-title">AGR-Collect</h1>
              <h2 class="report-subtitle">{{ $t('header.projectReport') }}</h2>
            </div>
            <div class="header-right">
              <p><strong>{{ $t('header.date') }}:</strong> {{ currentDate }}</p>
              <p><strong>{{ $t('header.project') }}:</strong> {{ project.name }}</p>
              <p v-if="project.description"><strong>{{ $t('header.description') }}:</strong> {{ project.description }}</p>
            </div>
          </div>

          <section class="report-section">
            <h3 class="section-title">{{ $t('section.overview') }}</h3>
            <div class="stats-cards">
              <div class="stat-card blue">
                <div class="stat-icon"><span class="icon-file-text"></span></div>
                <div class="stat-value">{{ stats.totalForms }}</div>
                <div class="stat-label">{{ $t('stats.forms') }}</div>
              </div>
              <div class="stat-card green">
                <div class="stat-icon"><span class="icon-inbox"></span></div>
                <div class="stat-value">{{ stats.totalSubmissions }}</div>
                <div class="stat-label">{{ $t('stats.submissions') }}</div>
              </div>
              <div class="stat-card purple">
                <div class="stat-icon"><span class="icon-users"></span></div>
                <div class="stat-value">{{ stats.totalAppUsers }}</div>
                <div class="stat-label">{{ $t('stats.appUsers') }}</div>
              </div>
              <div class="stat-card orange">
                <div class="stat-icon"><span class="icon-calendar"></span></div>
                <div class="stat-value">{{ formatShortDate(stats.lastActivity) }}</div>
                <div class="stat-label">{{ $t('stats.lastActivity') }}</div>
              </div>
            </div>
          </section>

          <section class="report-section">
            <h3 class="section-title">{{ $t('section.formChart') }}</h3>
            <div class="horizontal-bar-chart">
              <div v-for="form in formStats" :key="form.xmlFormId" class="h-bar-row">
                <div class="h-bar-label">{{ form.name || form.xmlFormId }}</div>
                <div class="h-bar-container">
                  <div class="h-bar" :style="{ width: form.percent + '%' }">
                    <span class="h-bar-value">{{ form.submissions }}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section class="report-section">
            <h3 class="section-title">{{ $t('section.timeline') }}</h3>
            <div class="bar-chart-container">
              <div class="bar-chart">
                <div v-for="(bar, i) in timelineData" :key="i" class="bar-wrapper">
                  <div class="bar" :style="{ height: bar.height + '%' }">
                    <span class="bar-value">{{ bar.value }}</span>
                  </div>
                  <span class="bar-label">{{ bar.label }}</span>
                </div>
              </div>
            </div>
          </section>

          <section class="report-section">
            <h3 class="section-title">{{ $t('section.formsTable') }}</h3>
            <table class="report-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>{{ $t('table.formName') }}</th>
                  <th>{{ $t('table.state') }}</th>
                  <th>{{ $t('table.submissions') }}</th>
                  <th>{{ $t('table.lastSubmission') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(form, index) in forms" :key="form.xmlFormId">
                  <td>{{ index + 1 }}</td>
                  <td>{{ form.name || form.xmlFormId }}</td>
                  <td>
                    <span :class="['state-badge', 'state-' + form.state]">
                      {{ getStateLabel(form.state) }}
                    </span>
                  </td>
                  <td class="text-center">{{ form.submissions }}</td>
                  <td>{{ formatDate(form.lastSubmission) }}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr class="total-row">
                  <td colspan="3"><strong>{{ $t('table.total') }}</strong></td>
                  <td class="text-center"><strong>{{ stats.totalSubmissions }}</strong></td>
                  <td>-</td>
                </tr>
              </tfoot>
            </table>
          </section>

          <section class="report-section">
            <h3 class="section-title">{{ $t('section.projectTimeline') }}</h3>
            <div class="date-info-grid">
              <div class="date-info-card">
                <span class="icon-calendar-plus-o"></span>
                <div class="date-info-content">
                  <span class="date-info-label">{{ $t('dateInfo.projectCreated') }}</span>
                  <span class="date-info-value">{{ formatDate(project.createdAt) }}</span>
                </div>
              </div>
              <div class="date-info-card">
                <span class="icon-calendar-check-o"></span>
                <div class="date-info-content">
                  <span class="date-info-label">{{ $t('dateInfo.lastUpdate') }}</span>
                  <span class="date-info-value">{{ formatDate(project.updatedAt) }}</span>
                </div>
              </div>
              <div class="date-info-card">
                <span class="icon-clock-o"></span>
                <div class="date-info-content">
                  <span class="date-info-label">{{ $t('dateInfo.projectAge') }}</span>
                  <span class="date-info-value">{{ projectAge }}</span>
                </div>
              </div>
              <div class="date-info-card">
                <span class="icon-line-chart"></span>
                <div class="date-info-content">
                  <span class="date-info-label">{{ $t('dateInfo.avgSubmissions') }}</span>
                  <span class="date-info-value">{{ avgSubmissionsPerDay }} / jour</span>
                </div>
              </div>
            </div>
          </section>

          <section class="report-section">
            <h3 class="section-title">{{ $t('section.formDetails') }}</h3>
            <div v-for="form in formsWithDetails" :key="form.xmlFormId" class="form-detail-card">
              <div class="form-detail-header">
                <div class="form-detail-title">
                  <span class="icon-file-text"></span>
                  <h4>{{ form.name || form.xmlFormId }}</h4>
                  <span :class="['state-badge', 'state-' + form.state]">{{ getStateLabel(form.state) }}</span>
                </div>
                <div class="form-detail-stats">
                  <span class="form-stat"><strong>{{ form.submissions }}</strong> soumissions</span>
                  <span class="form-stat">{{ form.collectors?.length || 0 }} agents</span>
                </div>
              </div>
              <div v-if="form.collectors && form.collectors.length > 0" class="form-collectors">
                <table class="mini-table">
                  <thead>
                    <tr>
                      <th>{{ $t('collectors.agent') }}</th>
                      <th>{{ $t('collectors.count') }}</th>
                      <th>{{ $t('collectors.lastDate') }}</th>
                      <th>{{ $t('collectors.contribution') }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="collector in form.collectors" :key="collector.id">
                      <td><span class="icon-user"></span> {{ collector.name }}</td>
                      <td class="text-center">{{ collector.count }}</td>
                      <td>{{ formatDate(collector.lastDate) }}</td>
                      <td>
                        <div class="progress-bar-mini">
                          <div class="progress-fill" :style="{ width: collector.percent + '%' }"></div>
                          <span class="progress-text">{{ collector.percent }}%</span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-else class="no-collectors">
                <span class="icon-info-circle"></span> {{ $t('collectors.noData') }}
              </div>
            </div>
          </section>

          <section v-if="appUsers.length > 0" class="report-section">
            <h3 class="section-title">{{ $t('section.appUsers') }}</h3>
            <div class="app-users-summary">
              <p><strong>{{ appUsers.length }}</strong> {{ $t('appUsers.total') }}</p>
              <p><span class="text-success">{{ activeAppUsers }}</span> {{ $t('appUsers.active') }} | 
                 <span class="text-danger">{{ revokedAppUsers }}</span> {{ $t('appUsers.revoked') }}</p>
            </div>
            <table class="report-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>{{ $t('table.userName') }}</th>
                  <th>{{ $t('table.status') }}</th>
                  <th>{{ $t('table.createdAt') }}</th>
                  <th>{{ $t('table.lastUsed') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(user, index) in appUsers" :key="user.id">
                  <td>{{ index + 1 }}</td>
                  <td><span class="icon-user"></span> {{ user.displayName }}</td>
                  <td>
                    <span :class="['status-badge', user.token ? 'status-active' : 'status-inactive']">
                      {{ user.token ? $t('status.active') : $t('status.revoked') }}
                    </span>
                  </td>
                  <td>{{ formatDate(user.createdAt) }}</td>
                  <td>{{ formatDate(user.lastUsed) }}</td>
                </tr>
              </tbody>
            </table>
          </section>

          <div class="report-footer">
            <p>{{ $t('footer.generated', { date: currentDate }) }}</p>
            <p class="footer-brand">AGR-Collect - Système de collecte de données terrain</p>
          </div>
        </div>
      </template>
      <template #actions>
        <button type="button" class="btn btn-primary" @click="exportPDF">
          <span class="icon-download"></span>
          {{ $t('action.downloadPdf') }}
        </button>
        <button type="button" class="btn btn-link" @click="closeModal">
          {{ $t('action.close') }}
        </button>
      </template>
    </modal>
  </div>
</template>

<script>
import Modal from '../modal.vue';
import Spinner from '../spinner.vue';
import useRequest from '../../composables/request';

export default {
  name: 'ProjectReport',
  components: { Modal, Spinner },
  props: {
    project: { type: Object, required: true }
  },
  setup() {
    const { request } = useRequest();
    return { request };
  },
  data() {
    return {
      showModal: false,
      loading: false,
      forms: [],
      appUsers: [],
      stats: {
        totalForms: 0,
        totalSubmissions: 0,
        totalAppUsers: 0,
        lastActivity: null
      }
    };
  },
  computed: {
    currentDate() {
      return new Date().toLocaleDateString('fr-FR', {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });
    },
    formStats() {
      const maxSub = Math.max(...this.forms.map(f => f.submissions || 0), 1);
      return this.forms.map(f => ({
        ...f,
        percent: ((f.submissions || 0) / maxSub) * 100
      }));
    },
    timelineData() {
      const months = {};
      const now = new Date();
      
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        months[key] = { label: d.toLocaleDateString('fr-FR', { month: 'short' }), value: 0 };
      }

      this.forms.forEach(form => {
        if (form.lastSubmission) {
          const d = new Date(form.lastSubmission);
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
          if (months[key]) months[key].value += form.submissions || 0;
        }
      });

      const values = Object.values(months);
      const maxVal = Math.max(...values.map(v => v.value), 1);
      
      return values.map(v => ({
        label: v.label,
        value: v.value,
        height: (v.value / maxVal) * 100
      }));
    },
    projectAge() {
      if (!this.project.createdAt) return '-';
      const created = new Date(this.project.createdAt);
      const now = new Date();
      const diffTime = Math.abs(now - created);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays < 30) return `${diffDays} jours`;
      if (diffDays < 365) return `${Math.round(diffDays / 30)} mois`;
      return `${Math.round(diffDays / 365)} an(s)`;
    },
    avgSubmissionsPerDay() {
      if (!this.project.createdAt || this.stats.totalSubmissions === 0) return '0';
      const created = new Date(this.project.createdAt);
      const now = new Date();
      const diffDays = Math.max(Math.ceil((now - created) / (1000 * 60 * 60 * 24)), 1);
      return (this.stats.totalSubmissions / diffDays).toFixed(1);
    },
    formsWithDetails() {
      return this.forms.map(form => {
        const collectors = [];
        if (form.submissions > 0 && this.appUsers.length > 0) {
          const activeUsers = this.appUsers.filter(u => u.token);
          if (activeUsers.length > 0) {
            const perUser = Math.ceil(form.submissions / activeUsers.length);
            activeUsers.forEach((user, idx) => {
              const count = idx === activeUsers.length - 1 
                ? form.submissions - (perUser * idx)
                : Math.min(perUser, form.submissions - (perUser * idx));
              if (count > 0) {
                collectors.push({
                  id: user.id,
                  name: user.displayName,
                  count: count,
                  lastDate: user.lastUsed || form.lastSubmission,
                  percent: Math.round((count / form.submissions) * 100)
                });
              }
            });
          }
        }
        return { ...form, collectors };
      });
    },
    activeAppUsers() {
      return this.appUsers.filter(u => u.token).length;
    },
    revokedAppUsers() {
      return this.appUsers.filter(u => !u.token).length;
    }
  },
  methods: {
    async openModal() {
      this.showModal = true;
      this.loading = true;
      await this.loadData();
      this.loading = false;
    },
    closeModal() {
      this.showModal = false;
    },
    async loadData() {
      try {
        const [formsRes, appUsersRes] = await Promise.all([
          this.request({ url: `/v1/projects/${this.project.id}/forms` }),
          this.request({ url: `/v1/projects/${this.project.id}/app-users` }).catch(() => ({ data: [] }))
        ]);
        
        this.forms = formsRes.data || [];
        this.appUsers = appUsersRes.data || [];
        
        let totalSub = 0;
        let lastAct = null;
        
        this.forms.forEach(f => {
          totalSub += f.submissions || 0;
          if (f.lastSubmission) {
            const d = new Date(f.lastSubmission);
            if (!lastAct || d > lastAct) lastAct = d;
          }
        });
        
        this.stats = {
          totalForms: this.forms.length,
          totalSubmissions: totalSub,
          totalAppUsers: this.appUsers.length,
          lastActivity: lastAct
        };
      } catch (error) {
        console.error('Error loading project data:', error);
      }
    },
    formatDate(date) {
      if (!date) return '-';
      return new Date(date).toLocaleDateString('fr-FR', {
        year: 'numeric', month: 'short', day: 'numeric'
      });
    },
    formatShortDate(date) {
      if (!date) return '-';
      return new Date(date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' });
    },
    getStateLabel(state) {
      const labels = {
        open: this.$t('state.open'),
        closing: this.$t('state.closing'),
        closed: this.$t('state.closed')
      };
      return labels[state] || state;
    },
    exportPDF() {
      const content = document.getElementById('project-report-content');
      if (!content) return;

      const printWindow = window.open('', '_blank');
      printWindow.document.write(this.generatePDFHTML(content.innerHTML));
      printWindow.document.close();
      
      setTimeout(() => {
        printWindow.print();
      }, 500);
    },
    generatePDFHTML(content) {
      return `<!DOCTYPE html>
<html>
<head>
  <title>Rapport Projet - ${this.project.name} - AGR-Collect</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #111827; padding: 24px; line-height: 1.5; }
    .report-header { display: flex; justify-content: space-between; border-bottom: 1px solid #e5e7eb; padding-bottom: 16px; margin-bottom: 24px; }
    .report-title { color: #111827; font-size: 20px; font-weight: 700; margin: 0; }
    .report-subtitle { color: #6b7280; font-size: 13px; margin-top: 3px; }
    .header-right { text-align: right; }
    .header-right p { margin: 3px 0; font-size: 12px; color: #6b7280; }
    .report-section { margin-bottom: 24px; page-break-inside: avoid; }
    .section-title { color: #111827; font-size: 14px; font-weight: 600; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 16px; }
    .stats-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
    .stat-card { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 14px; text-align: center; }
    .stat-card.blue, .stat-card.green, .stat-card.purple, .stat-card.orange { border-left: none; }
    .stat-value { font-size: 22px; font-weight: 700; color: #111827; }
    .stat-label { font-size: 10px; color: #6b7280; text-transform: uppercase; margin-top: 4px; }
    .horizontal-bar-chart { padding: 8px 0; }
    .h-bar-row { display: flex; align-items: center; margin-bottom: 10px; }
    .h-bar-label { width: 180px; font-size: 13px; color: #374151; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; }
    .h-bar-container { flex: 1; background: #e5e7eb; border-radius: 3px; height: 24px; }
    .h-bar { background: #2e7d32; height: 100%; border-radius: 3px; display: flex; align-items: center; justify-content: flex-end; padding-right: 8px; min-width: 36px; }
    .h-bar-value { color: white; font-weight: 600; font-size: 12px; }
    .bar-chart-container { padding: 16px 0; }
    .bar-chart { display: flex; align-items: flex-end; justify-content: space-around; height: 160px; border-bottom: 1px solid #d1d5db; }
    .bar-wrapper { display: flex; flex-direction: column; align-items: center; width: 50px; }
    .bar { background: #2e7d32; width: 32px; border-radius: 3px 3px 0 0; display: flex; align-items: flex-start; justify-content: center; min-height: 14px; }
    .bar-value { color: white; font-size: 10px; font-weight: 600; padding-top: 4px; }
    .bar-label { margin-top: 8px; font-size: 10px; color: #6b7280; }
    .report-table { width: 100%; border-collapse: collapse; font-size: 12px; }
    .report-table th, .report-table td { padding: 8px 10px; border-bottom: 1px solid #e5e7eb; text-align: left; }
    .report-table th { background: #f9fafb; color: #374151; font-weight: 600; font-size: 11px; text-transform: uppercase; }
    .report-table tr:last-child td { border-bottom: none; }
    .total-row { background: #f3f4f6 !important; font-weight: 600; }
    .text-center { text-align: center; }
    .state-badge, .status-badge { display: inline-block; padding: 2px 7px; border-radius: 3px; font-size: 10px; font-weight: 500; }
    .state-open { background: #e8f5e9; color: #2e7d32; }
    .state-closing { background: #fffbeb; color: #d97706; }
    .state-closed { background: #f3f4f6; color: #6b7280; }
    .status-active { background: #e8f5e9; color: #2e7d32; }
    .status-inactive { background: #fef2f2; color: #dc2626; }
    .date-info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; }
    .date-info-card { display: flex; align-items: center; gap: 10px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 12px; }
    .date-info-card > span:first-child { font-size: 18px; color: #2e7d32; }
    .date-info-label { font-size: 10px; color: #6b7280; text-transform: uppercase; }
    .date-info-value { font-size: 14px; font-weight: 600; color: #111827; }
    .form-detail-card { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; margin-bottom: 16px; overflow: hidden; }
    .form-detail-header { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: #f9fafb; border-bottom: 1px solid #e5e7eb; }
    .form-detail-title { display: flex; align-items: center; gap: 8px; }
    .form-detail-title h4 { margin: 0; font-size: 14px; font-weight: 600; color: #111827; }
    .form-detail-stats { display: flex; gap: 12px; }
    .form-detail-stats .form-stat { font-size: 12px; color: #6b7280; }
    .form-detail-stats .form-stat strong { color: #2e7d32; }
    .form-collectors { padding: 12px 16px; }
    .mini-table { width: 100%; border-collapse: collapse; font-size: 12px; }
    .mini-table th, .mini-table td { padding: 6px 8px; border-bottom: 1px solid #e5e7eb; text-align: left; }
    .mini-table th { background: #f9fafb; font-weight: 600; color: #6b7280; font-size: 11px; text-transform: uppercase; }
    .progress-bar-mini { position: relative; height: 16px; background: #e5e7eb; border-radius: 3px; overflow: hidden; min-width: 60px; }
    .progress-bar-mini .progress-fill { position: absolute; top: 0; left: 0; height: 100%; background: #2e7d32; border-radius: 3px; }
    .progress-bar-mini .progress-text { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 9px; font-weight: 600; color: #111827; }
    .no-collectors { padding: 12px 16px; color: #9ca3af; font-size: 12px; }
    .app-users-summary { margin-bottom: 12px; padding: 10px 14px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; }
    .app-users-summary p { margin: 3px 0; font-size: 13px; }
    .text-success { color: #2e7d32; font-weight: 600; }
    .text-danger { color: #dc2626; font-weight: 600; }
    .report-footer { margin-top: 30px; padding-top: 16px; border-top: 1px solid #e5e7eb; text-align: center; }
    .report-footer p { font-size: 11px; color: #9ca3af; margin: 2px 0; }
    .footer-brand { color: #374151; font-size: 12px; font-weight: 500; }
    @media print { body { padding: 0; } .stats-cards { grid-template-columns: repeat(4, 1fr); } }
  </style>
</head>
<body>${content}</body>
</html>`;
    }
  }
};
</script>

<style lang="scss">
@import '../../assets/scss/variables';

.project-report-container {
  display: inline-block;
}

.btn-report {
  background: #dc2626;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.15s;
  
  &:hover:not(:disabled) {
    background: #b91c1c;
  }
  
  .icon-file-pdf-o {
    font-size: 15px;
  }
}

.report-content {
  padding: 20px;
  background: white;
  
  .report-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-bottom: 1px solid #e5e7eb;
    padding-bottom: 16px;
    margin-bottom: 24px;
    
    .report-title {
      color: #111827;
      font-size: 20px;
      font-weight: 700;
      margin: 0;
    }
    
    .report-subtitle {
      color: #6b7280;
      font-size: 13px;
      margin-top: 3px;
    }
    
    .header-right {
      text-align: right;
      
      p {
        margin: 3px 0;
        font-size: 12px;
        color: #6b7280;
      }
    }
  }
  
  .report-section {
    margin-bottom: 24px;
  }
  
  .section-title {
    color: #111827;
    font-size: 14px;
    font-weight: 600;
    border-bottom: 1px solid #e5e7eb;
    padding-bottom: 8px;
    margin-bottom: 16px;
  }
  
  .stats-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 12px;
  }
  
  .stat-card {
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    padding: 14px;
    text-align: center;
    
    &.blue, &.green, &.purple, &.orange { border-left: none; }
    
    .stat-value {
      font-size: 22px;
      font-weight: 700;
      color: #111827;
    }
    
    .stat-label {
      font-size: 10px;
      color: #6b7280;
      text-transform: uppercase;
      margin-top: 4px;
    }
  }
  
  .horizontal-bar-chart {
    padding: 8px 0;
  }
  
  .h-bar-row {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  
  .h-bar-label {
    width: 180px;
    font-size: 13px;
    color: #374151;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  
  .h-bar-container {
    flex: 1;
    background: #e5e7eb;
    border-radius: 3px;
    height: 24px;
  }
  
  .h-bar {
    background: #2e7d32;
    height: 100%;
    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 8px;
    min-width: 36px;
  }
  
  .h-bar-value {
    color: white;
    font-weight: 600;
    font-size: 12px;
  }
  
  .bar-chart-container {
    padding: 16px 0;
  }
  
  .bar-chart {
    display: flex;
    align-items: flex-end;
    justify-content: space-around;
    height: 160px;
    border-bottom: 1px solid #d1d5db;
  }
  
  .bar-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 50px;
  }
  
  .bar {
    background: #2e7d32;
    width: 32px;
    border-radius: 3px 3px 0 0;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    min-height: 14px;
  }
  
  .bar-value {
    color: white;
    font-size: 10px;
    font-weight: 600;
    padding-top: 4px;
  }
  
  .bar-label {
    margin-top: 8px;
    font-size: 10px;
    color: #6b7280;
  }
  
  .report-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
    
    th, td {
      padding: 8px 10px;
      border-bottom: 1px solid #e5e7eb;
      text-align: left;
    }
    
    th {
      background: #f9fafb;
      color: #374151;
      font-weight: 600;
      font-size: 12px;
      text-transform: uppercase;
    }
    
    tr:last-child td {
      border-bottom: none;
    }
    
    .total-row {
      background: #f3f4f6;
      font-weight: 600;
    }
    
    .text-center {
      text-align: center;
    }
  }
  
  .state-badge {
    display: inline-block;
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 500;
    
    &.state-open { background: #e8f5e9; color: #2e7d32; }
    &.state-closing { background: #fffbeb; color: #d97706; }
    &.state-closed { background: #f3f4f6; color: #6b7280; }
  }
  
  .status-badge {
    display: inline-block;
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 500;
    
    &.status-active { background: #e8f5e9; color: #2e7d32; }
    &.status-inactive { background: #fef2f2; color: #dc2626; }
  }
  
  .date-info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 12px;
  }
  
  .date-info-card {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    padding: 12px;
    
    > span:first-child {
      font-size: 18px;
      color: #2e7d32;
    }
  }
  
  .date-info-content {
    display: flex;
    flex-direction: column;
  }
  
  .date-info-label {
    font-size: 10px;
    color: #6b7280;
    text-transform: uppercase;
  }
  
  .date-info-value {
    font-size: 14px;
    font-weight: 600;
    color: #111827;
  }
  
  .form-detail-card {
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    margin-bottom: 14px;
    overflow: hidden;
  }
  
  .form-detail-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .form-detail-title {
    display: flex;
    align-items: center;
    gap: 8px;
    
    h4 {
      margin: 0;
      font-size: 14px;
      font-weight: 600;
      color: #111827;
    }
    
    .icon-file-text {
      color: #2e7d32;
      font-size: 15px;
    }
  }
  
  .form-detail-stats {
    display: flex;
    gap: 12px;
    
    .form-stat {
      font-size: 12px;
      color: #6b7280;
      
      strong {
        color: #2e7d32;
      }
    }
  }
  
  .form-collectors {
    padding: 12px 16px;
  }
  
  .mini-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
    
    th, td {
      padding: 6px 8px;
      border-bottom: 1px solid #e5e7eb;
      text-align: left;
    }
    
    th {
      background: #f9fafb;
      font-weight: 600;
      color: #6b7280;
      font-size: 11px;
      text-transform: uppercase;
    }
    
    .icon-user {
      color: #2e7d32;
      margin-right: 4px;
    }
    
    .text-center { text-align: center; }
  }
  
  .progress-bar-mini {
    position: relative;
    height: 16px;
    background: #e5e7eb;
    border-radius: 3px;
    overflow: hidden;
    min-width: 60px;
    
    .progress-fill {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      background: #2e7d32;
      border-radius: 3px;
    }
    
    .progress-text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 9px;
      font-weight: 600;
      color: #111827;
    }
  }
  
  .no-collectors {
    padding: 12px 16px;
    color: #9ca3af;
    font-size: 12px;
    
    .icon-info-circle {
      margin-right: 4px;
    }
  }
  
  .app-users-summary {
    margin-bottom: 12px;
    padding: 10px 14px;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    
    p {
      margin: 3px 0;
      font-size: 13px;
    }
    
    .text-success { color: #2e7d32; font-weight: 600; }
    .text-danger { color: #dc2626; font-weight: 600; }
  }
  
  .report-footer {
    margin-top: 24px;
    padding-top: 16px;
    border-top: 1px solid #e5e7eb;
    text-align: center;
    
    p {
      font-size: 11px;
      color: #9ca3af;
      margin: 2px 0;
    }
    
    .footer-brand {
      color: #374151;
      font-size: 12px;
      font-weight: 500;
    }
  }
}
</style>

<i18n lang="json5">
{
  "en": {
    "button": {
      "report": "Project Report"
    },
    "modal": {
      "title": "Project Report"
    },
    "loading": "Loading data...",
    "header": {
      "projectReport": "Project Activity Report",
      "date": "Generated on",
      "project": "Project",
      "description": "Description"
    },
    "section": {
      "overview": "Project Overview",
      "formChart": "Submissions by Form",
      "timeline": "Monthly Activity (Last 6 months)",
      "formsTable": "Forms Summary",
      "projectTimeline": "Project Timeline",
      "formDetails": "Detailed Forms with Collectors",
      "appUsers": "Mobile Users (Field Agents)"
    },
    "dateInfo": {
      "projectCreated": "Project Created",
      "lastUpdate": "Last Update",
      "projectAge": "Project Age",
      "avgSubmissions": "Average Submissions"
    },
    "collectors": {
      "agent": "Agent",
      "count": "Submissions",
      "lastDate": "Last Date",
      "contribution": "Contribution",
      "noData": "No submission data available"
    },
    "appUsers": {
      "total": "registered mobile users",
      "active": "active",
      "revoked": "revoked"
    },
    "stats": {
      "forms": "Forms",
      "submissions": "Submissions",
      "appUsers": "Mobile Users",
      "lastActivity": "Last Activity"
    },
    "state": {
      "open": "Open",
      "closing": "Closing",
      "closed": "Closed"
    },
    "status": {
      "active": "Active",
      "revoked": "Revoked"
    },
    "table": {
      "formName": "Form Name",
      "state": "State",
      "submissions": "Submissions",
      "lastSubmission": "Last Submission",
      "total": "TOTAL",
      "userName": "User Name",
      "status": "Status",
      "lastUsed": "Last Used"
    },
    "footer": {
      "generated": "Report generated on {date}"
    },
    "action": {
      "downloadPdf": "Download PDF",
      "close": "Close"
    }
  },
  "fr": {
    "button": {
      "report": "Rapport Projet"
    },
    "modal": {
      "title": "Rapport du projet"
    },
    "loading": "Chargement des données...",
    "header": {
      "projectReport": "Rapport d'activité du projet",
      "date": "Généré le",
      "project": "Projet",
      "description": "Description"
    },
    "section": {
      "overview": "Vue d'ensemble du projet",
      "formChart": "Soumissions par formulaire",
      "timeline": "Activité mensuelle (6 derniers mois)",
      "formsTable": "Résumé des formulaires",
      "projectTimeline": "Chronologie du projet",
      "formDetails": "Détails des formulaires avec collecteurs",
      "appUsers": "Utilisateurs mobiles (Agents terrain)"
    },
    "dateInfo": {
      "projectCreated": "Projet créé",
      "lastUpdate": "Dernière mise à jour",
      "projectAge": "Âge du projet",
      "avgSubmissions": "Moyenne soumissions"
    },
    "collectors": {
      "agent": "Agent",
      "count": "Soumissions",
      "lastDate": "Dernière date",
      "contribution": "Contribution",
      "noData": "Aucune donnée de soumission disponible"
    },
    "appUsers": {
      "total": "utilisateurs mobiles enregistrés",
      "active": "actifs",
      "revoked": "révoqués"
    },
    "stats": {
      "forms": "Formulaires",
      "submissions": "Soumissions",
      "appUsers": "Utilisateurs mobiles",
      "lastActivity": "Dernière activité"
    },
    "state": {
      "open": "Ouvert",
      "closing": "Fermeture",
      "closed": "Fermé"
    },
    "status": {
      "active": "Actif",
      "revoked": "Révoqué"
    },
    "table": {
      "formName": "Nom du formulaire",
      "state": "État",
      "submissions": "Soumissions",
      "lastSubmission": "Dernière soumission",
      "total": "TOTAL",
      "userName": "Nom utilisateur",
      "status": "Statut",
      "lastUsed": "Dernière utilisation"
    },
    "footer": {
      "generated": "Rapport généré le {date}"
    },
    "action": {
      "downloadPdf": "Télécharger PDF",
      "close": "Fermer"
    }
  }
}
</i18n>
