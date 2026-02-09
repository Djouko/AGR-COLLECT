<!--
Copyright 2025 AGR-Collect Developers
Rapport PDF pour un formulaire spécifique avec toutes ses soumissions
-->
<template>
  <div class="form-report-container">
    <button type="button" class="btn btn-report" @click="openModal"
      :disabled="!formVersion || formVersion.submissions === 0">
      <span class="icon-file-pdf-o"></span>
      <span>{{ $t('button.report') }}</span>
    </button>

    <modal v-if="showModal" size="full" @hide="closeModal" hideable>
      <template #title>
        <span class="icon-file-text"></span>
        {{ $t('modal.title') }}
      </template>
      <template #body>
        <div v-if="loading" class="text-center p-4">
          <spinner :state="true"/>
          <p>{{ $t('loading') }}</p>
        </div>
        
        <div v-else id="form-report-content" class="report-content">
          <div class="report-header">
            <div class="header-left">
              <h1 class="report-title">AGR-Collect</h1>
              <h2 class="report-subtitle">{{ $t('header.formReport') }}</h2>
            </div>
            <div class="header-right">
              <p><strong>{{ $t('header.date') }}:</strong> {{ currentDate }}</p>
              <p><strong>{{ $t('header.project') }}:</strong> {{ projectName }}</p>
              <p><strong>{{ $t('header.form') }}:</strong> {{ formName }}</p>
            </div>
          </div>

          <section class="report-section">
            <h3 class="section-title">{{ $t('section.summary') }}</h3>
            <div class="stats-cards">
              <div class="stat-card primary">
                <div class="stat-icon"><span class="icon-inbox"></span></div>
                <div class="stat-value">{{ stats.total }}</div>
                <div class="stat-label">{{ $t('stats.totalSubmissions') }}</div>
              </div>
              <div class="stat-card success">
                <div class="stat-icon"><span class="icon-check-circle"></span></div>
                <div class="stat-value">{{ stats.approved }}</div>
                <div class="stat-label">{{ $t('stats.approved') }}</div>
              </div>
              <div class="stat-card warning">
                <div class="stat-icon"><span class="icon-clock-o"></span></div>
                <div class="stat-value">{{ stats.pending }}</div>
                <div class="stat-label">{{ $t('stats.pending') }}</div>
              </div>
              <div class="stat-card danger">
                <div class="stat-icon"><span class="icon-times-circle"></span></div>
                <div class="stat-value">{{ stats.rejected }}</div>
                <div class="stat-label">{{ $t('stats.rejected') }}</div>
              </div>
            </div>
          </section>

          <section class="report-section">
            <h3 class="section-title">{{ $t('section.statusChart') }}</h3>
            <div class="chart-container">
              <div class="pie-chart">
                <svg viewBox="0 0 200 200">
                  <circle v-for="(segment, i) in pieSegments" :key="i"
                    cx="100" cy="100" r="80"
                    :stroke="segment.color"
                    stroke-width="40"
                    fill="none"
                    :stroke-dasharray="segment.dashArray"
                    :stroke-dashoffset="segment.offset"
                    :transform="`rotate(-90 100 100)`"/>
                </svg>
              </div>
              <div class="chart-legend">
                <div v-for="item in legendItems" :key="item.label" class="legend-item">
                  <span class="legend-color" :style="{ background: item.color }"></span>
                  <span class="legend-label">{{ item.label }}</span>
                  <span class="legend-value">{{ item.value }} ({{ item.percent }}%)</span>
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
            <h3 class="section-title">{{ $t('section.dateInfo') }}</h3>
            <div class="date-info-grid">
              <div class="date-info-card">
                <span class="icon-calendar"></span>
                <div class="date-info-content">
                  <span class="date-info-label">{{ $t('dateInfo.firstSubmission') }}</span>
                  <span class="date-info-value">{{ firstSubmissionDate }}</span>
                </div>
              </div>
              <div class="date-info-card">
                <span class="icon-calendar-check-o"></span>
                <div class="date-info-content">
                  <span class="date-info-label">{{ $t('dateInfo.lastSubmission') }}</span>
                  <span class="date-info-value">{{ lastSubmissionDate }}</span>
                </div>
              </div>
              <div class="date-info-card">
                <span class="icon-clock-o"></span>
                <div class="date-info-content">
                  <span class="date-info-label">{{ $t('dateInfo.collectionPeriod') }}</span>
                  <span class="date-info-value">{{ collectionPeriod }}</span>
                </div>
              </div>
              <div class="date-info-card">
                <span class="icon-line-chart"></span>
                <div class="date-info-content">
                  <span class="date-info-label">{{ $t('dateInfo.avgPerDay') }}</span>
                  <span class="date-info-value">{{ avgSubmissionsPerDay }}</span>
                </div>
              </div>
            </div>
          </section>

          <section class="report-section">
            <h3 class="section-title">{{ $t('section.collectors') }}</h3>
            <div class="collectors-summary">
              <p class="collectors-count">
                <strong>{{ collectorsData.length }}</strong> {{ $t('collectors.totalAgents') }}
              </p>
            </div>
            <table class="report-table collectors-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>{{ $t('collectors.name') }}</th>
                  <th>{{ $t('collectors.submissions') }}</th>
                  <th>{{ $t('collectors.approved') }}</th>
                  <th>{{ $t('collectors.pending') }}</th>
                  <th>{{ $t('collectors.rejected') }}</th>
                  <th>{{ $t('collectors.lastActivity') }}</th>
                  <th>{{ $t('collectors.percentage') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(collector, index) in collectorsData" :key="collector.id">
                  <td>{{ index + 1 }}</td>
                  <td class="collector-name">
                    <span class="icon-user"></span>
                    {{ collector.name }}
                  </td>
                  <td class="text-center"><strong>{{ collector.total }}</strong></td>
                  <td class="text-center text-success">{{ collector.approved }}</td>
                  <td class="text-center text-warning">{{ collector.pending }}</td>
                  <td class="text-center text-danger">{{ collector.rejected }}</td>
                  <td>{{ formatDate(collector.lastActivity) }}</td>
                  <td>
                    <div class="progress-bar-mini">
                      <div class="progress-fill" :style="{ width: collector.percentage + '%' }"></div>
                      <span class="progress-text">{{ collector.percentage }}%</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          <section class="report-section">
            <h3 class="section-title">{{ $t('section.recentSubmissions') }}</h3>
            <table class="report-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>{{ $t('table.instanceId') }}</th>
                  <th>{{ $t('table.submitter') }}</th>
                  <th>{{ $t('table.date') }}</th>
                  <th>{{ $t('table.status') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(sub, index) in recentSubmissions" :key="sub.instanceId">
                  <td>{{ index + 1 }}</td>
                  <td class="instance-id">{{ sub.instanceId.substring(0, 8) }}...</td>
                  <td>{{ sub.submitter || '-' }}</td>
                  <td>{{ formatDate(sub.createdAt) }}</td>
                  <td>
                    <span :class="['status-badge', 'status-' + (sub.reviewState || 'received')]">
                      {{ getStatusLabel(sub.reviewState) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
            <p v-if="stats.total > 20" class="table-note">
              {{ $t('table.showingRecent', { shown: Math.min(20, stats.total), total: stats.total }) }}
            </p>
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
  name: 'FormReport',
  components: { Modal, Spinner },
  props: {
    projectId: { type: Number, required: true },
    xmlFormId: { type: String, required: true },
    formVersion: { type: Object, default: null },
    projectName: { type: String, default: '' },
    formName: { type: String, default: '' }
  },
  setup() {
    const { request } = useRequest();
    return { request };
  },
  data() {
    return {
      showModal: false,
      loading: false,
      submissions: [],
      stats: {
        total: 0,
        approved: 0,
        pending: 0,
        rejected: 0,
        hasIssues: 0
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
    pieSegments() {
      const total = this.stats.total || 1;
      const circumference = 2 * Math.PI * 80;
      let offset = 0;
      
      const segments = [
        { value: this.stats.approved, color: '#4caf50' },
        { value: this.stats.pending, color: '#ff9800' },
        { value: this.stats.rejected, color: '#f44336' },
        { value: this.stats.hasIssues, color: '#9c27b0' }
      ];

      return segments.map(seg => {
        const percent = seg.value / total;
        const dashArray = `${percent * circumference} ${circumference}`;
        const result = {
          color: seg.color,
          dashArray,
          offset: -offset
        };
        offset += percent * circumference;
        return result;
      });
    },
    legendItems() {
      const total = this.stats.total || 1;
      return [
        { label: this.$t('stats.approved'), value: this.stats.approved, color: '#4caf50', percent: Math.round(this.stats.approved / total * 100) },
        { label: this.$t('stats.pending'), value: this.stats.pending, color: '#ff9800', percent: Math.round(this.stats.pending / total * 100) },
        { label: this.$t('stats.rejected'), value: this.stats.rejected, color: '#f44336', percent: Math.round(this.stats.rejected / total * 100) },
        { label: this.$t('stats.hasIssues'), value: this.stats.hasIssues, color: '#9c27b0', percent: Math.round(this.stats.hasIssues / total * 100) }
      ];
    },
    timelineData() {
      const months = {};
      const now = new Date();
      
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        months[key] = { label: d.toLocaleDateString('fr-FR', { month: 'short' }), value: 0 };
      }

      this.submissions.forEach(sub => {
        const d = new Date(sub.createdAt);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        if (months[key]) months[key].value++;
      });

      const values = Object.values(months);
      const maxVal = Math.max(...values.map(v => v.value), 1);
      
      return values.map(v => ({
        label: v.label,
        value: v.value,
        height: (v.value / maxVal) * 100
      }));
    },
    recentSubmissions() {
      return this.submissions.slice(0, 20);
    },
    firstSubmissionDate() {
      if (this.submissions.length === 0) return '-';
      const dates = this.submissions.map(s => new Date(s.createdAt)).sort((a, b) => a - b);
      return this.formatDate(dates[0]);
    },
    lastSubmissionDate() {
      if (this.submissions.length === 0) return '-';
      const dates = this.submissions.map(s => new Date(s.createdAt)).sort((a, b) => b - a);
      return this.formatDate(dates[0]);
    },
    collectionPeriod() {
      if (this.submissions.length === 0) return '-';
      const dates = this.submissions.map(s => new Date(s.createdAt)).sort((a, b) => a - b);
      const diffTime = Math.abs(dates[dates.length - 1] - dates[0]);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays === 0) return '1 jour';
      if (diffDays < 30) return `${diffDays} jours`;
      if (diffDays < 365) return `${Math.round(diffDays / 30)} mois`;
      return `${Math.round(diffDays / 365)} an(s)`;
    },
    avgSubmissionsPerDay() {
      if (this.submissions.length === 0) return '0';
      const dates = this.submissions.map(s => new Date(s.createdAt)).sort((a, b) => a - b);
      const diffTime = Math.abs(dates[dates.length - 1] - dates[0]);
      const diffDays = Math.max(Math.ceil(diffTime / (1000 * 60 * 60 * 24)), 1);
      return (this.submissions.length / diffDays).toFixed(1);
    },
    collectorsData() {
      const collectors = {};
      this.submissions.forEach(sub => {
        const submitterId = sub.submitter?.id || sub.submitterId || 'unknown';
        const submitterName = sub.submitter?.displayName || sub.submitter || 'Agent inconnu';
        
        if (!collectors[submitterId]) {
          collectors[submitterId] = {
            id: submitterId,
            name: submitterName,
            total: 0,
            approved: 0,
            pending: 0,
            rejected: 0,
            lastActivity: null
          };
        }
        
        collectors[submitterId].total++;
        if (sub.reviewState === 'approved') collectors[submitterId].approved++;
        else if (sub.reviewState === 'rejected') collectors[submitterId].rejected++;
        else collectors[submitterId].pending++;
        
        const subDate = new Date(sub.createdAt);
        if (!collectors[submitterId].lastActivity || subDate > new Date(collectors[submitterId].lastActivity)) {
          collectors[submitterId].lastActivity = sub.createdAt;
        }
      });
      
      const total = this.stats.total || 1;
      return Object.values(collectors)
        .map(c => ({ ...c, percentage: Math.round((c.total / total) * 100) }))
        .sort((a, b) => b.total - a.total);
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
        const url = `/v1/projects/${this.projectId}/forms/${encodeURIComponent(this.xmlFormId)}/submissions`;
        const response = await this.request({ url });
        this.submissions = response.data || [];
        
        this.stats = {
          total: this.submissions.length,
          approved: this.submissions.filter(s => s.reviewState === 'approved').length,
          pending: this.submissions.filter(s => !s.reviewState || s.reviewState === 'received').length,
          rejected: this.submissions.filter(s => s.reviewState === 'rejected').length,
          hasIssues: this.submissions.filter(s => s.reviewState === 'hasIssues').length
        };
      } catch (error) {
        console.error('Error loading submissions:', error);
        this.submissions = [];
      }
    },
    formatDate(date) {
      if (!date) return '-';
      return new Date(date).toLocaleDateString('fr-FR', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });
    },
    getStatusLabel(status) {
      const labels = {
        approved: this.$t('status.approved'),
        rejected: this.$t('status.rejected'),
        hasIssues: this.$t('status.hasIssues'),
        received: this.$t('status.received'),
        edited: this.$t('status.edited')
      };
      return labels[status] || labels.received;
    },
    exportPDF() {
      const content = document.getElementById('form-report-content');
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
  <title>Rapport Formulaire - ${this.formName} - AGR-Collect</title>
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
    .stat-card.primary, .stat-card.success, .stat-card.warning, .stat-card.danger { border-left: none; }
    .stat-value { font-size: 22px; font-weight: 700; color: #111827; }
    .stat-label { font-size: 10px; color: #6b7280; text-transform: uppercase; margin-top: 4px; }
    .chart-container { display: flex; align-items: center; gap: 30px; }
    .pie-chart { width: 180px; height: 180px; }
    .chart-legend { flex: 1; }
    .legend-item { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; font-size: 12px; }
    .legend-color { width: 10px; height: 10px; border-radius: 2px; }
    .legend-label { flex: 1; color: #374151; }
    .legend-value { font-weight: 600; color: #111827; }
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
    .status-badge { display: inline-block; padding: 2px 7px; border-radius: 3px; font-size: 10px; font-weight: 500; }
    .status-received { background: #f0fdf4; color: #2e7d32; }
    .status-approved { background: #e8f5e9; color: #2e7d32; }
    .status-rejected { background: #fef2f2; color: #dc2626; }
    .status-hasIssues { background: #faf5ff; color: #7b1fa2; }
    .status-edited { background: #fffbeb; color: #d97706; }
    .date-info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; }
    .date-info-card { display: flex; align-items: center; gap: 10px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 12px; }
    .date-info-card > span:first-child { font-size: 18px; color: #2e7d32; }
    .date-info-label { font-size: 10px; color: #6b7280; text-transform: uppercase; }
    .date-info-value { font-size: 14px; font-weight: 600; color: #111827; }
    .collectors-summary { margin-bottom: 12px; }
    .collectors-count { font-size: 14px; color: #111827; }
    .collectors-count strong { font-size: 18px; color: #2e7d32; }
    .collector-name { display: flex; align-items: center; gap: 6px; }
    .collector-name .icon-user { color: #2e7d32; }
    .text-center { text-align: center; }
    .text-success { color: #2e7d32; font-weight: 600; }
    .text-warning { color: #d97706; font-weight: 600; }
    .text-danger { color: #dc2626; font-weight: 600; }
    .progress-bar-mini { position: relative; height: 16px; background: #e5e7eb; border-radius: 3px; overflow: hidden; min-width: 60px; }
    .progress-bar-mini .progress-fill { position: absolute; top: 0; left: 0; height: 100%; background: #2e7d32; border-radius: 3px; }
    .progress-bar-mini .progress-text { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 9px; font-weight: 600; color: #111827; }
    .table-note { margin-top: 8px; font-size: 10px; color: #9ca3af; font-style: italic; }
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

.form-report-container {
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
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
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
    
    &.primary, &.success, &.warning, &.danger { border-left: none; }
    
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
  
  .chart-container {
    display: flex;
    align-items: center;
    gap: 30px;
    flex-wrap: wrap;
  }
  
  .pie-chart {
    width: 180px;
    height: 180px;
  }
  
  .chart-legend {
    flex: 1;
    min-width: 180px;
  }
  
  .legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
    font-size: 13px;
  }
  
  .legend-color {
    width: 12px;
    height: 12px;
    border-radius: 3px;
  }
  
  .legend-label {
    flex: 1;
    color: #374151;
  }
  
  .legend-value {
    font-weight: 600;
    color: #111827;
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
    
    .instance-id {
      font-family: monospace;
      font-size: 11px;
      color: #6b7280;
    }
  }
  
  .status-badge {
    display: inline-block;
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 500;
    
    &.status-received { background: #f0fdf4; color: #2e7d32; }
    &.status-approved { background: #e8f5e9; color: #2e7d32; }
    &.status-rejected { background: #fef2f2; color: #dc2626; }
    &.status-hasIssues { background: #faf5ff; color: #7b1fa2; }
    &.status-edited { background: #fffbeb; color: #d97706; }
  }
  
  .table-note {
    margin-top: 8px;
    font-size: 11px;
    color: #9ca3af;
    font-style: italic;
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
  
  .collectors-summary {
    margin-bottom: 12px;
    
    .collectors-count {
      font-size: 14px;
      color: #111827;
      
      strong {
        font-size: 18px;
        color: #2e7d32;
      }
    }
  }
  
  .collectors-table {
    .collector-name {
      display: flex;
      align-items: center;
      gap: 6px;
      
      .icon-user {
        color: #2e7d32;
      }
    }
    
    .text-center { text-align: center; }
    .text-success { color: #2e7d32; }
    .text-warning { color: #d97706; }
    .text-danger { color: #dc2626; }
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
      "report": "Report PDF"
    },
    "modal": {
      "title": "Form Report"
    },
    "loading": "Loading data...",
    "header": {
      "formReport": "Form Submissions Report",
      "date": "Generated on",
      "project": "Project",
      "form": "Form"
    },
    "section": {
      "summary": "Summary Statistics",
      "statusChart": "Submissions by Status",
      "timeline": "Monthly Submissions (Last 6 months)",
      "dateInfo": "Collection Timeline",
      "collectors": "Field Agents Statistics",
      "recentSubmissions": "Recent Submissions"
    },
    "dateInfo": {
      "firstSubmission": "First Submission",
      "lastSubmission": "Last Submission",
      "collectionPeriod": "Collection Period",
      "avgPerDay": "Average per Day"
    },
    "collectors": {
      "totalAgents": "field agents contributed",
      "name": "Agent Name",
      "submissions": "Submissions",
      "approved": "Approved",
      "pending": "Pending",
      "rejected": "Rejected",
      "lastActivity": "Last Activity",
      "percentage": "Contribution"
    },
    "stats": {
      "totalSubmissions": "Total Submissions",
      "approved": "Approved",
      "pending": "Pending",
      "rejected": "Rejected",
      "hasIssues": "Has Issues"
    },
    "status": {
      "received": "Received",
      "approved": "Approved",
      "rejected": "Rejected",
      "hasIssues": "Has Issues",
      "edited": "Edited"
    },
    "table": {
      "instanceId": "Instance ID",
      "submitter": "Submitter",
      "date": "Date",
      "status": "Status",
      "showingRecent": "Showing {shown} of {total} submissions"
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
      "report": "Rapport PDF"
    },
    "modal": {
      "title": "Rapport du formulaire"
    },
    "loading": "Chargement des données...",
    "header": {
      "formReport": "Rapport des soumissions du formulaire",
      "date": "Généré le",
      "project": "Projet",
      "form": "Formulaire"
    },
    "section": {
      "summary": "Statistiques résumées",
      "statusChart": "Soumissions par statut",
      "timeline": "Soumissions mensuelles (6 derniers mois)",
      "dateInfo": "Chronologie de collecte",
      "collectors": "Statistiques des agents de terrain",
      "recentSubmissions": "Soumissions récentes"
    },
    "dateInfo": {
      "firstSubmission": "Première soumission",
      "lastSubmission": "Dernière soumission",
      "collectionPeriod": "Période de collecte",
      "avgPerDay": "Moyenne par jour"
    },
    "collectors": {
      "totalAgents": "agents de terrain ont contribué",
      "name": "Nom de l'agent",
      "submissions": "Soumissions",
      "approved": "Approuvées",
      "pending": "En attente",
      "rejected": "Rejetées",
      "lastActivity": "Dernière activité",
      "percentage": "Contribution"
    },
    "stats": {
      "totalSubmissions": "Total soumissions",
      "approved": "Approuvées",
      "pending": "En attente",
      "rejected": "Rejetées",
      "hasIssues": "Avec problèmes"
    },
    "status": {
      "received": "Reçue",
      "approved": "Approuvée",
      "rejected": "Rejetée",
      "hasIssues": "Avec problèmes",
      "edited": "Éditée"
    },
    "table": {
      "instanceId": "ID Instance",
      "submitter": "Soumis par",
      "date": "Date",
      "status": "Statut",
      "showingRecent": "Affichage de {shown} sur {total} soumissions"
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
