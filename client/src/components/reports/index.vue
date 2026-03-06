<template>
  <div id="reports-page">
    <page-head v-show="projects.dataExists">
      <template #title>
        <span class="icon-bar-chart"></span> {{ $t('title') }}
      </template>
      <template #body>{{ $t('introduction') }}</template>
    </page-head>
    <page-body>
      <loading :state="initiallyLoading"/>
      
      <template v-if="!initiallyLoading">
        <div class="panel panel-default reports-filters">
          <div class="panel-heading">
            <h3 class="panel-title">
              <span class="icon-filter"></span> {{ $t('filters.title') }}
            </h3>
          </div>
          <div class="panel-body">
            <div class="row filters-row">
              <div class="col-md-3">
                <div class="form-group filter-group">
                  <label><span class="icon-archive"></span> {{ $t('filters.project') }}</label>
                  <select v-model="selectedProject" class="form-control" @change="onProjectChange">
                    <option :value="null">{{ $t('filters.allProjects') }}</option>
                    <option v-for="p in projectsList" :key="p.id" :value="p.id">
                      {{ p.name }} ({{ p.formList ? p.formList.length : 0 }} formulaires)
                    </option>
                  </select>
                </div>
              </div>
              
              <div class="col-md-3">
                <div class="form-group filter-group">
                  <label><span class="icon-file-text"></span> {{ $t('filters.form') }}</label>
                  <select v-model="selectedForm" class="form-control" :disabled="!selectedProject || loadingForms">
                    <option :value="null">{{ loadingForms ? $t('filters.loading') : $t('filters.allForms') }}</option>
                    <option v-for="f in availableForms" :key="f.xmlFormId" :value="f.xmlFormId">
                      {{ f.name || f.xmlFormId }}
                    </option>
                  </select>
                  <spinner v-if="loadingForms" :state="true" inline/>
                </div>
              </div>
              
              <div class="col-md-3">
                <div class="form-group filter-group">
                  <label><span class="icon-user"></span> {{ $t('filters.user') }}</label>
                  <select v-model="selectedUser" class="form-control" :disabled="!selectedProject || loadingUsers">
                    <option :value="null">{{ loadingUsers ? $t('filters.loading') : $t('filters.allUsers') }}</option>
                    <option v-for="u in availableUsers" :key="u.id" :value="u.id">
                      {{ u.displayName || u.email || ('ID: ' + u.id) }}
                    </option>
                  </select>
                  <spinner v-if="loadingUsers" :state="true" inline/>
                </div>
              </div>
            </div>
            
            <div class="row filters-row">
              <div class="col-md-3">
                <div class="form-group filter-group">
                  <label><span class="icon-calendar"></span> {{ $t('filters.period') }}</label>
                  <select v-model="selectedPeriod" class="form-control">
                    <option value="all">{{ $t('filters.allTime') }}</option>
                    <option value="today">{{ $t('filters.today') }}</option>
                    <option value="yesterday">{{ $t('filters.yesterday') }}</option>
                    <option value="week">{{ $t('filters.thisWeek') }}</option>
                    <option value="lastweek">{{ $t('filters.lastWeek') }}</option>
                    <option value="month">{{ $t('filters.thisMonth') }}</option>
                    <option value="lastmonth">{{ $t('filters.lastMonth') }}</option>
                    <option value="year">{{ $t('filters.thisYear') }}</option>
                    <option value="custom">{{ $t('filters.custom') }}</option>
                  </select>
                </div>
              </div>
              
              </div>
            
            <div class="row filters-row" v-if="selectedPeriod === 'custom'">
              <div class="col-md-6 col-md-offset-3">
                <div class="form-group filter-group">
                  <label><span class="icon-clock-o"></span> {{ $t('filters.dateRange') }}</label>
                  <div class="date-inputs">
                    <input type="date" v-model="customStartDate" class="form-control"/>
                    <span class="date-separator">→</span>
                    <input type="date" v-model="customEndDate" class="form-control"/>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="row actions-row">
              <div class="col-md-12">
                <div class="actions-buttons">
                  <button type="button" class="btn btn-primary btn-lg" @click="generateReport" 
                    :disabled="generating">
                    <span class="icon-bar-chart"></span>
                    {{ $t('actions.generate') }}
                    <spinner v-if="generating" :state="true" inline/>
                  </button>
                  <button type="button" class="btn btn-danger btn-lg" @click="exportPDF" 
                    :disabled="!reportData || generating">
                    <span class="icon-file-pdf-o"></span>
                    {{ $t('actions.exportPdf') }}
                  </button>
                  <button type="button" class="btn btn-default" @click="resetFilters">
                    <span class="icon-refresh"></span>
                    {{ $t('actions.reset') }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="reportData" id="report-content" class="report-container">
          
          <div class="report-header-section">
            <div class="report-branding">
              <img src="/logo-agr-collect.png" alt="AGR-Collect" class="report-logo" style="height:48px;margin-right:12px"/>
              <div class="brand-info">
                <h1>AGR-Collect</h1>
                <p>Système de collecte de données terrain - SAAHDEL</p>
              </div>
            </div>
            <div class="report-info">
              <h2 v-if="reportType === 'user'">
                {{ $t('reportTitle.user') }}: {{ selectedUserName }}
              </h2>
              <h2 v-else-if="reportType === 'form'">
                {{ $t('reportTitle.form') }}: {{ selectedFormName }}
              </h2>
              <h2 v-else-if="reportType === 'project'">
                {{ $t('reportTitle.project') }}: {{ selectedProjectName }}
              </h2>
              <h2 v-else>{{ $t('reportTitle.global') }}</h2>
              
              <div class="report-meta-grid">
                <div class="meta-item">
                  <strong>{{ $t('report.generatedOn') }}:</strong> {{ reportDate }}
                </div>
                <div class="meta-item" v-if="reportType !== 'global'">
                  <strong>{{ $t('report.project') }}:</strong> {{ selectedProjectName }}
                </div>
                <div class="meta-item" v-if="reportType === 'form' || (reportType === 'user' && selectedForm)">
                  <strong>{{ $t('report.form') }}:</strong> {{ selectedFormName }}
                </div>
                <div class="meta-item" v-if="reportType === 'user'">
                  <strong>{{ $t('report.user') }}:</strong> {{ selectedUserName }}
                </div>
                <div class="meta-item">
                  <strong>{{ $t('report.period') }}:</strong> {{ periodLabel }}
                </div>
                <div class="meta-item">
                  <strong>Total:</strong> {{ reportData.totalSubmissions }} {{ $t('stats.submissions').toLowerCase() }}
                </div>
              </div>
            </div>
          </div>

          <section class="report-section" v-if="reportData.submissionsWithData && reportData.submissionsWithData.length > 0">
            <h3 class="section-title">
              <span class="icon-table"></span> {{ $t('formReport.submissionsData') }}
              <span class="section-count">({{ reportData.submissionsWithData.length }})</span>
            </h3>
            <div class="table-responsive">
              <table class="report-table data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th v-if="!selectedForm">{{ $t('table.form') }}</th>
                    <th>{{ $t('formReport.submitter') }}</th>
                    <th>{{ $t('formReport.date') }}</th>
                    <th>{{ $t('formReport.status') }}</th>
                    <th v-for="field in reportData.formFields" :key="field.path">
                      {{ field.name || field.path.split('/').pop() }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(sub, index) in reportData.submissionsWithData" :key="sub.instanceId">
                    <td class="text-center">{{ index + 1 }}</td>
                    <td v-if="!selectedForm">{{ sub.formName || '-' }}</td>
                    <td class="submitter-cell">{{ sub.submitterName }}</td>
                    <td>{{ formatDateTime(sub.createdAt) }}</td>
                    <td>
                      <span :class="['status-badge', 'status-' + sub.reviewState]">
                        {{ getStatusLabel(sub.reviewState) }}
                      </span>
                    </td>
                    <td v-for="field in reportData.formFields" :key="field.path" class="data-cell">
                      <geopoint-value v-if="field.type === 'geopoint' && sub.fieldValues[field.path.split('/').pop()] != null" :value="sub.fieldValues[field.path.split('/').pop()]"/>
                      <template v-else>{{ formatFieldValue(sub.fieldValues[field.path.split('/').pop()]) }}</template>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section class="report-section" v-if="!reportData.submissionsWithData || reportData.submissionsWithData.length === 0">
            <div class="alert alert-info" style="text-align:center;padding:24px">
              <p style="margin:0"><strong>{{ $t('noData.title') }}</strong></p>
              <p style="margin:4px 0 0">{{ $t('noData.message') }}</p>
            </div>
          </section>

          <!-- OLD SECTIONS REMOVED: data-only reports per client request -->
          <!-- FOOTER FOLLOWS -->
          <div class="report-footer-section">
            <p class="footer-generated">{{ $t('report.footer', { date: reportDate }) }}</p>
            <p class="footer-brand">AGR-Collect - Système de collecte de données terrain pour SAAHDEL</p>
            <p class="footer-note">{{ $t('report.confidential') }}</p>
          </div>
        </div>

        <div v-else-if="noData" class="alert alert-warning no-data-alert">
          <span class="icon-exclamation-triangle"></span>
          <div>
            <strong>{{ $t('noData.title') }}</strong>
            <p>{{ $t('noData.message') }}</p>
          </div>
        </div>
        
        <div v-else-if="!reportData && !noData" class="welcome-section">
          <div class="welcome-icon">
            <span class="icon-bar-chart"></span>
          </div>
          <h3>{{ $t('welcome.title') }}</h3>
          <p>{{ $t('welcome.message') }}</p>
          <ul class="welcome-steps">
            <li><span class="step-num">1</span> {{ $t('welcome.step1') }}</li>
            <li><span class="step-num">2</span> {{ $t('welcome.step2') }}</li>
            <li><span class="step-num">3</span> {{ $t('welcome.step3') }}</li>
          </ul>
        </div>
      </template>
    </page-body>
  </div>
</template>



<script>
import Loading from '../loading.vue';
import PageBody from '../page/body.vue';
import PageHead from '../page/head.vue';
import Spinner from '../spinner.vue';

import useRequest from '../../composables/request';
import useProjects from '../../request-data/projects';
import { useRequestData } from '../../request-data';
import { noop } from '../../util/util';
import { formatGeopoint, formatCoords, getCachedPlaceName } from '../../util/reverse-geocode';
import GeopointValue from '../submission/geopoint-value.vue';

export default {
  name: 'ReportsIndex',
  components: { Loading, PageBody, PageHead, Spinner, GeopointValue },
  setup() {
    const { request } = useRequest();
    const projects = useProjects();
    const { createResource } = useRequestData();
    const users = createResource('users');
    return { request, projects, users };
  },
  data() {
    return {
      selectedProject: null,
      selectedForm: null,
      selectedUser: null,
      selectedPeriod: 'all',
      customStartDate: '',
      customEndDate: '',
      reportData: null,
      generating: false,
      noData: false,
      loadingForms: false,
      loadingUsers: false,
      availableForms: [],
      availableUsers: [],
      allSubmissions: [],
      allAppUsers: [],
      reportType: 'global'
    };
  },
  computed: {
    initiallyLoading() {
      return this.projects.initiallyLoading;
    },
    projectsList() {
      if (!this.projects.dataExists) return [];
      return Array.from(this.projects);
    },
    reportDate() {
      return new Date().toLocaleDateString('fr-FR', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });
    },
    selectedProjectName() {
      if (!this.selectedProject || !this.projects.dataExists) return null;
      const p = this.projectsList.find(p => p.id === this.selectedProject);
      return p ? p.name : null;
    },
    selectedFormName() {
      if (!this.selectedForm) return null;
      const f = this.availableForms.find(f => f.xmlFormId === this.selectedForm);
      return f ? (f.name || f.xmlFormId) : null;
    },
    selectedUserName() {
      if (!this.selectedUser) return null;
      const u = this.availableUsers.find(u => u.id === this.selectedUser);
      return u ? (u.displayName || u.email || `ID: ${u.id}`) : null;
    },
    periodLabel() {
      const labels = {
        all: this.$t('filters.allTime'),
        today: this.$t('filters.today'),
        yesterday: this.$t('filters.yesterday'),
        week: this.$t('filters.thisWeek'),
        lastweek: this.$t('filters.lastWeek'),
        month: this.$t('filters.thisMonth'),
        lastmonth: this.$t('filters.lastMonth'),
        year: this.$t('filters.thisYear'),
        custom: `${this.customStartDate || '...'} → ${this.customEndDate || '...'}`
      };
      return labels[this.selectedPeriod] || this.selectedPeriod;
    },
    displayedSubmissions() {
      if (!this.reportData || !this.reportData.submissionsList) return [];
      return this.reportData.submissionsList.slice(0, 50);
    },
    dateRange() {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      let start = null, end = new Date();
      
      switch (this.selectedPeriod) {
        case 'today':
          start = today;
          break;
        case 'yesterday':
          start = new Date(today.getTime() - 86400000);
          end = today;
          break;
        case 'week':
          start = new Date(today.getTime() - (today.getDay() * 86400000));
          break;
        case 'lastweek':
          const thisWeekStart = new Date(today.getTime() - (today.getDay() * 86400000));
          start = new Date(thisWeekStart.getTime() - (7 * 86400000));
          end = thisWeekStart;
          break;
        case 'month':
          start = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'lastmonth':
          start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          end = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'year':
          start = new Date(now.getFullYear(), 0, 1);
          break;
        case 'custom':
          if (this.customStartDate) start = new Date(this.customStartDate);
          if (this.customEndDate) end = new Date(this.customEndDate + 'T23:59:59');
          break;
        default:
          start = null;
      }
      return { start, end };
    }
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      await Promise.all([
        this.projects.request({ url: '/v1/projects?forms=true' }).catch(noop),
        this.users.request({ url: '/v1/users' }).catch(noop)
      ]);
    },
    async onProjectChange() {
      this.selectedForm = null;
      this.selectedUser = null;
      this.availableForms = [];
      this.availableUsers = [];
      
      if (this.selectedProject) {
        this.loadingForms = true;
        this.loadingUsers = true;
        try {
          const res = await this.request({ url: `/v1/projects/${this.selectedProject}/forms` });
          this.availableForms = res.data || [];
        } catch (e) {
          console.error('Error loading forms:', e);
        } finally {
          this.loadingForms = false;
        }
        try {
          const usersRes = await this.request({ url: `/v1/projects/${this.selectedProject}/app-users` });
          this.availableUsers = usersRes.data || [];
        } catch (e) {
          console.error('Error loading users:', e);
        } finally {
          this.loadingUsers = false;
        }
      }
    },
    resetFilters() {
      this.selectedProject = null;
      this.selectedForm = null;
      this.selectedUser = null;
      this.selectedPeriod = 'all';
      this.customStartDate = '';
      this.customEndDate = '';
      this.availableForms = [];
      this.availableUsers = [];
      this.reportData = null;
      this.noData = false;
    },
    async generateReport() {
      this.generating = true;
      this.noData = false;
      this.reportData = null;
      
      try {
        if (this.selectedUser && this.selectedProject) {
          this.reportType = 'user';
        } else if (this.selectedProject && this.selectedForm) {
          this.reportType = 'form';
        } else if (this.selectedProject) {
          this.reportType = 'project';
        } else {
          this.reportType = 'global';
        }

        const data = {
          reportType: this.reportType,
          totalProjects: 0,
          totalForms: 0,
          totalSubmissions: 0,
          totalAppUsers: 0,
          projects: [],
          formDetails: [],
          collectors: [],
          submissionsList: [],
          submissionsWithData: [],
          formFields: [],
          userInfo: null,
          userFormDetails: [],
          statusBreakdown: { approved: 0, pending: 0, rejected: 0, other: 0 },
          timeline: [],
          firstSubmission: null,
          lastSubmission: null,
          selectedProjectInfo: null,
          selectedFormInfo: null,
          analytics: {
            submissionsBySource: { mobile: 0, web: 0, unknown: 0 },
            peakDay: null,
            peakDayCount: 0,
            avgSubmissionsPerDay: 0,
            avgSubmissionsPerCollector: 0,
            approvalRate: 0,
            rejectionRate: 0,
            mostActiveCollector: null,
            mostActiveForm: null,
            dailyDistribution: {},
            weeklyDistribution: { lun: 0, mar: 0, mer: 0, jeu: 0, ven: 0, sam: 0, dim: 0 },
            hourlyDistribution: {},
            trend: 'stable', // 'up', 'down', 'stable'
            trendPercent: 0
          }
        };

        let projectsToProcess = this.projectsList;
        
        if (this.selectedProject) {
          projectsToProcess = projectsToProcess.filter(p => p.id === this.selectedProject);
          if (projectsToProcess.length > 0) {
            data.selectedProjectInfo = projectsToProcess[0];
          }
        }

        data.totalProjects = projectsToProcess.length;
        
        const allCollectors = [];
        const allSubmissions = [];
        const monthlyData = {};
        const { start: periodStart, end: periodEnd } = this.dateRange;
        
        const webUsersCache = {};

        for (const project of projectsToProcess) {
          let projectForms = [];
          try {
            const formsRes = await this.request({ url: `/v1/projects/${project.id}/forms` });
            projectForms = formsRes.data || [];
          } catch (e) {
            console.error('Error loading forms for project', project.id, e);
          }
          
          let projectAppUsers = [];
          try {
            const appUsersRes = await this.request({ url: `/v1/projects/${project.id}/app-users` });
            projectAppUsers = appUsersRes.data || [];
            data.totalAppUsers += projectAppUsers.length;
            
            if (this.selectedUser) {
              const selectedUserObj = projectAppUsers.find(u => u.id === this.selectedUser);
              if (selectedUserObj) {
                data.userInfo = selectedUserObj;
              }
            }

            projectAppUsers.forEach(user => {
              allCollectors.push({
                ...user,
                projectId: project.id,
                projectName: project.name,
                submissions: 0,
                approved: 0,
                pending: 0,
                rejected: 0,
                percent: 0,
                lastActivity: null
              });
            });
          } catch (e) {
            console.error('Error loading app users for project', project.id, e);
          }

          if (this.selectedForm) {
            projectForms = projectForms.filter(f => f.xmlFormId === this.selectedForm);
            if (projectForms.length > 0) {
              data.selectedFormInfo = projectForms[0];
            }
          }

          let projectSubmissions = 0;
          let projectLastSubmission = null;

          for (const form of projectForms) {
            let formSubmissions = [];
            let formSubmitters = [];
            
            try {
              const subRes = await this.request({ 
                url: `/v1/projects/${project.id}/forms/${encodeURIComponent(form.xmlFormId)}/submissions` 
              });
              formSubmissions = subRes.data || [];
            } catch (e) {
              console.error('Error loading submissions:', e);
            }
            
            try {
              const submittersRes = await this.request({ 
                url: `/v1/projects/${project.id}/forms/${encodeURIComponent(form.xmlFormId)}/submissions/submitters` 
              });
              formSubmitters = submittersRes.data || [];
              formSubmitters.forEach(s => {
                webUsersCache[s.id] = s;
              });
            } catch (e) {
            }

            if (periodStart) {
              formSubmissions = formSubmissions.filter(s => {
                const subDate = new Date(s.createdAt);
                return subDate >= periodStart && subDate <= periodEnd;
              });
            }

            if (this.selectedUser) {
              formSubmissions = formSubmissions.filter(s => s.submitterId === this.selectedUser);
            }

            if ((this.reportType === 'form' || (this.reportType === 'user' && this.selectedForm)) && formSubmissions.length > 0) {
              try {
                const fieldsRes = await this.request({
                  url: `/v1/projects/${project.id}/forms/${encodeURIComponent(form.xmlFormId)}/fields?odata=true`
                });
                const allFields = fieldsRes.data || [];
                data.formFields = allFields.filter(f => 
                  f.type !== 'structure' && f.type !== 'repeat' && !f.path.includes('/meta/')
                ).slice(0, 10); // Limiter à 10 champs pour lisibilité
                
                const odataRes = await this.request({
                  url: `/v1/projects/${project.id}/forms/${encodeURIComponent(form.xmlFormId)}.svc/Submissions?$top=100`
                });
                const odataValues = odataRes.data?.value || [];
                
                formSubmissions.forEach(sub => {
                  const odataRow = odataValues.find(v => v.__id === sub.instanceId);
                  const fieldValues = {};
                  if (odataRow) {
                    data.formFields.forEach(field => {
                      const fieldName = field.path.split('/').pop();
                      fieldValues[fieldName] = odataRow[fieldName] ?? '-';
                    });
                  }
                  data.submissionsWithData.push({
                    instanceId: sub.instanceId,
                    submitterName: this.getSubmitterName(sub, webUsersCache),
                    submitterType: this.getSubmitterType(sub),
                    createdAt: sub.createdAt,
                    reviewState: sub.reviewState || 'received',
                    fieldValues: fieldValues
                  });
                });
              } catch (e) {
                console.error('Error loading OData:', e);
              }
            }

            if ((this.reportType === 'user' && !this.selectedForm) || this.reportType === 'project' || this.reportType === 'global') {
              if (formSubmissions.length > 0) {
                formSubmissions.forEach(sub => {
                  data.submissionsWithData.push({
                    instanceId: sub.instanceId,
                    submitterName: this.getSubmitterName(sub, webUsersCache),
                    submitterType: this.getSubmitterType(sub),
                    createdAt: sub.createdAt,
                    reviewState: sub.reviewState || 'received',
                    formName: form.name || form.xmlFormId,
                    fieldValues: {}
                  });
                });
              }
            }

            formSubmissions.forEach(sub => {
              const state = sub.reviewState || 'received';
              if (state === 'approved') data.statusBreakdown.approved++;
              else if (state === 'hasIssues' || state === 'rejected') data.statusBreakdown.rejected++;
              else if (state === 'edited') data.statusBreakdown.other++;
              else data.statusBreakdown.pending++;
              
              const subDate = new Date(sub.createdAt);
              const monthKey = `${subDate.getFullYear()}-${String(subDate.getMonth() + 1).padStart(2, '0')}`;
              monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1;
              
              if (!data.firstSubmission || subDate < new Date(data.firstSubmission)) {
                data.firstSubmission = sub.createdAt;
              }
              if (!data.lastSubmission || subDate > new Date(data.lastSubmission)) {
                data.lastSubmission = sub.createdAt;
              }
              
              if (sub.submitterId) {
                const collector = allCollectors.find(c => c.id === sub.submitterId);
                if (collector) {
                  collector.submissions++;
                  if (state === 'approved') collector.approved++;
                  else if (state === 'hasIssues' || state === 'rejected') collector.rejected++;
                  else collector.pending++;
                  if (!collector.lastActivity || subDate > new Date(collector.lastActivity)) {
                    collector.lastActivity = sub.createdAt;
                  }
                }
              }
              
              allSubmissions.push({
                instanceId: sub.instanceId,
                submitterId: sub.submitterId,
                submitterName: this.getSubmitterName(sub, webUsersCache),
                submitterType: this.getSubmitterType(sub),
                createdAt: sub.createdAt,
                updatedAt: sub.updatedAt,
                reviewState: sub.reviewState || 'received',
                formId: form.xmlFormId,
                formName: form.name || form.xmlFormId,
                projectId: project.id,
                projectName: project.name,
                deviceId: sub.deviceId
              });
            });

            const submissions = formSubmissions.length;
            projectSubmissions += submissions;
            
            if (form.lastSubmission) {
              const formLast = new Date(form.lastSubmission);
              if (!projectLastSubmission || formLast > projectLastSubmission) {
                projectLastSubmission = formLast;
              }
            }

            if (this.reportType === 'user') {
              const userFormStat = {
                xmlFormId: form.xmlFormId,
                name: form.name || form.xmlFormId,
                submissions: formSubmissions.length,
                approved: formSubmissions.filter(s => s.reviewState === 'approved').length,
                pending: formSubmissions.filter(s => !s.reviewState || s.reviewState === 'received' || s.reviewState === null).length,
                rejected: formSubmissions.filter(s => s.reviewState === 'hasIssues' || s.reviewState === 'rejected').length,
                lastSubmission: formSubmissions.length > 0 ? formSubmissions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0].createdAt : null,
                percent: 0
              };
              if (userFormStat.submissions > 0) {
                data.userFormDetails.push(userFormStat);
              }
            }

            if (this.reportType === 'project') {
              const formWithSubs = {
                xmlFormId: form.xmlFormId,
                name: form.name,
                projectId: project.id,
                projectName: project.name,
                submissions: submissions,
                state: form.state,
                lastSubmission: form.lastSubmission,
                collectors: projectAppUsers.length,
                percent: 0,
                createdAt: form.createdAt,
                submissionsList: formSubmissions.map(sub => ({
                  instanceId: sub.instanceId,
                  submitterName: this.getSubmitterName(sub, webUsersCache),
                  submitterType: this.getSubmitterType(sub),
                  createdAt: sub.createdAt,
                  reviewState: sub.reviewState || 'received'
                }))
              };
              data.formDetails.push(formWithSubs);
            } else {
              data.formDetails.push({
                xmlFormId: form.xmlFormId,
                name: form.name,
                projectId: project.id,
                projectName: project.name,
                submissions: submissions,
                state: form.state,
                lastSubmission: form.lastSubmission,
                collectors: projectAppUsers.length,
                percent: 0,
                createdAt: form.createdAt
              });
            }
          }

          data.totalForms += projectForms.length;
          data.totalSubmissions += projectSubmissions;

          data.projects.push({
            id: project.id,
            name: project.name,
            forms: projectForms.length,
            submissions: projectSubmissions,
            appUsers: projectAppUsers.length,
            lastSubmission: projectLastSubmission,
            archived: project.archived
          });
        }

        if (data.totalSubmissions > 0) {
          data.formDetails.forEach(f => {
            f.percent = Math.round((f.submissions / data.totalSubmissions) * 100);
          });
          allCollectors.forEach(c => {
            c.percent = Math.round((c.submissions / data.totalSubmissions) * 100);
          });
          data.userFormDetails.forEach(f => {
            f.percent = Math.round((f.submissions / data.totalSubmissions) * 100);
          });
        }

        const total = data.totalSubmissions || 1;
        data.statusBreakdown.approvedPercent = Math.round((data.statusBreakdown.approved / total) * 100);
        data.statusBreakdown.pendingPercent = Math.round((data.statusBreakdown.pending / total) * 100);
        data.statusBreakdown.rejectedPercent = Math.round((data.statusBreakdown.rejected / total) * 100);
        data.statusBreakdown.otherPercent = Math.round((data.statusBreakdown.other / total) * 100);

        const now = new Date();
        for (let i = 5; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
          data.timeline.push({
            label: d.toLocaleDateString('fr-FR', { month: 'short' }),
            value: monthlyData[key] || 0,
            height: 0
          });
        }
        const maxValue = Math.max(...data.timeline.map(t => t.value), 1);
        data.timeline.forEach(t => { t.height = (t.value / maxValue) * 100; });

        data.collectors = allCollectors.filter(c => c.submissions > 0 || c.token)
          .sort((a, b) => b.submissions - a.submissions);

        data.submissionsList = allSubmissions.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );

        if (data.submissionsWithData.length > 0) {
          data.submissionsWithData.sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
          );
        }

        if (data.firstSubmission && data.lastSubmission) {
          const first = new Date(data.firstSubmission);
          const last = new Date(data.lastSubmission);
          const diffDays = Math.max(1, Math.ceil((last - first) / (1000 * 60 * 60 * 24)));
          data.collectionPeriod = `${diffDays} jour${diffDays > 1 ? 's' : ''}`;
          data.avgPerDay = (data.totalSubmissions / diffDays).toFixed(1);
          data.analytics.avgSubmissionsPerDay = parseFloat(data.avgPerDay);
        }

        if (allSubmissions.length > 0) {
          const weekDays = ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam'];
          
          allSubmissions.forEach(sub => {
            const source = sub.submitterType || 'unknown';
            data.analytics.submissionsBySource[source] = (data.analytics.submissionsBySource[source] || 0) + 1;
            
            const dateKey = new Date(sub.createdAt).toISOString().split('T')[0];
            data.analytics.dailyDistribution[dateKey] = (data.analytics.dailyDistribution[dateKey] || 0) + 1;
            
            const dayOfWeek = weekDays[new Date(sub.createdAt).getDay()];
            data.analytics.weeklyDistribution[dayOfWeek]++;
            
            const hour = new Date(sub.createdAt).getHours();
            data.analytics.hourlyDistribution[hour] = (data.analytics.hourlyDistribution[hour] || 0) + 1;
          });
          
          const dailyEntries = Object.entries(data.analytics.dailyDistribution);
          if (dailyEntries.length > 0) {
            const peak = dailyEntries.reduce((max, curr) => curr[1] > max[1] ? curr : max);
            data.analytics.peakDay = peak[0];
            data.analytics.peakDayCount = peak[1];
          }
          
          data.analytics.approvalRate = Math.round((data.statusBreakdown.approved / data.totalSubmissions) * 100);
          data.analytics.rejectionRate = Math.round((data.statusBreakdown.rejected / data.totalSubmissions) * 100);
          
          const activeCollectors = data.collectors.filter(c => c.submissions > 0).length;
          data.analytics.avgSubmissionsPerCollector = activeCollectors > 0 
            ? Math.round(data.totalSubmissions / activeCollectors) : 0;
          
          if (data.collectors.length > 0) {
            data.analytics.mostActiveCollector = data.collectors[0];
          }
          
          if (data.formDetails.length > 0) {
            data.analytics.mostActiveForm = data.formDetails.reduce((max, f) => 
              f.submissions > (max?.submissions || 0) ? f : max, null);
          }
          
          if (data.timeline.length >= 2) {
            const lastMonth = data.timeline[data.timeline.length - 1].value;
            const prevMonth = data.timeline[data.timeline.length - 2].value;
            if (prevMonth > 0) {
              const change = ((lastMonth - prevMonth) / prevMonth) * 100;
              data.analytics.trendPercent = Math.round(change);
              data.analytics.trend = change > 10 ? 'up' : (change < -10 ? 'down' : 'stable');
            }
          }
        }

        this.reportData = data;
        
        if (data.totalProjects === 0 || (data.totalSubmissions === 0 && this.selectedPeriod !== 'all')) {
          this.noData = true;
          this.reportData = null;
        }
      } catch (error) {
        console.error('Error generating report:', error);
        this.noData = true;
      } finally {
        this.generating = false;
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
    formatDateTime(date) {
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
        hasIssues: this.$t('status.rejected'),
        received: this.$t('status.pending'),
        edited: this.$t('status.other')
      };
      return labels[status] || this.$t('status.pending');
    },
    formatFieldValue(value) {
      if (value === null || value === undefined || value === '') return '-';
      if (typeof value === 'boolean') return value ? '✓ Oui' : '✗ Non';
      
      if (Array.isArray(value)) {
        if (value.length === 0) return '-';
        return value.map(v => this.formatFieldValue(v)).join(', ');
      }
      
      if (typeof value === 'object') {
        if (value.type === 'Point' && Array.isArray(value.coordinates) && value.coordinates.length >= 2) {
          return `📍 ${formatGeopoint(value)}`;
        }
        if (value.coordinates) {
          const coords = value.coordinates;
          if (Array.isArray(coords) && coords.length >= 2) {
            return `📍 ${formatCoords(coords[1], coords[0])}`;
          }
        }
        if (value.latitude && value.longitude) {
          const cached = getCachedPlaceName(value.latitude, value.longitude);
          return `📍 ${cached || formatCoords(value.latitude, value.longitude)}`;
        }
        try {
          const str = JSON.stringify(value);
          return str.length > 40 ? str.substring(0, 37) + '...' : str;
        } catch {
          return '[Objet]';
        }
      }
      
      if (typeof value === 'number') {
        if (Number.isInteger(value)) return String(value);
        return value.toFixed(2);
      }
      
      const strVal = String(value);
      if (/^\d{4}-\d{2}-\d{2}(T|$)/.test(strVal)) {
        try {
          const date = new Date(strVal);
          if (!isNaN(date.getTime())) {
            return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
          }
        } catch { /* ignore */ }
      }
      
      if (strVal.length > 60) return strVal.substring(0, 57) + '...';
      return strVal;
    },
    getSubmitterName(sub, usersCache = {}) {
      if (sub.submitter) {
        if (typeof sub.submitter === 'object') {
          if (sub.submitter.displayName) return sub.submitter.displayName;
          if (sub.submitter.email) return sub.submitter.email;
        }
        if (typeof sub.submitter === 'string' && sub.submitter.trim()) {
          return sub.submitter;
        }
      }
      
      if (sub.currentActor?.displayName) return sub.currentActor.displayName;
      if (sub.currentActor?.email) return sub.currentActor.email;
      
      if (sub.submitterId && usersCache[sub.submitterId]) {
        const user = usersCache[sub.submitterId];
        return user.displayName || user.email || `Utilisateur ${user.id}`;
      }
      
      if (sub.deviceId) {
        const shortId = sub.deviceId.length > 12 ? sub.deviceId.substring(0, 12) + '...' : sub.deviceId;
        return `Mobile: ${shortId}`;
      }
      
      if (sub.submitterId) return `ID: ${sub.submitterId}`;
      return 'Anonyme';
    },
    getSubmitterType(sub) {
      if (sub.deviceId) return 'mobile';
      if (sub.submitter?.type === 'user') return 'web';
      if (sub.currentActor) return 'web';
      return 'unknown';
    },
    exportPDF() {
      const printContent = document.getElementById('report-content');
      if (!printContent) return;

      const printWindow = window.open('', '_blank', 'width=1200,height=800');
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Rapport AGR-Collect - ${this.reportDate}</title>
          <meta charset="UTF-8">
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: 'Segoe UI', Tahoma, Arial, sans-serif; padding: 20px; color: #111827; line-height: 1.4; background: white; }
            .report-header-section { border-bottom: 2px solid #2e7d32; padding-bottom: 16px; margin-bottom: 20px; }
            .report-branding { display: flex; align-items: center; margin-bottom: 12px; }
            .report-logo { height: 40px; margin-right: 12px; }
            .brand-info h1 { color: #2e7d32; font-size: 18px; font-weight: 700; margin: 0; }
            .brand-info p { color: #6b7280; font-size: 11px; margin: 0; }
            .report-info h2 { color: #111827; font-size: 14px; font-weight: 600; margin-bottom: 6px; }
            .report-meta-grid { display: flex; flex-wrap: wrap; gap: 16px; }
            .meta-item { font-size: 11px; color: #6b7280; }
            .meta-item strong { color: #374151; }
            .report-section { margin-bottom: 20px; }
            .section-title { color: #111827; font-size: 13px; font-weight: 600; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; margin-bottom: 12px; }
            .section-count { font-size: 11px; font-weight: normal; color: #9ca3af; margin-left: 6px; }
            .table-responsive { overflow-x: visible; }
            .report-table, .data-table { width: 100%; border-collapse: collapse; font-size: 10px; }
            .report-table th, .data-table th { background: #f3f4f6; color: #374151; font-weight: 600; font-size: 9px; text-transform: uppercase; padding: 6px 5px; border: 1px solid #d1d5db; text-align: left; }
            .report-table td, .data-table td { padding: 5px; border: 1px solid #e5e7eb; vertical-align: top; }
            .report-table tr:nth-child(even) td, .data-table tr:nth-child(even) td { background: #f9fafb; }
            .text-center { text-align: center; }
            .submitter-cell { min-width: 80px; }
            .data-cell { max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
            .status-badge { display: inline-block; padding: 1px 5px; border-radius: 3px; font-size: 9px; font-weight: 500; }
            .status-approved { background: #e8f5e9; color: #2e7d32; }
            .status-received, .status-pending, .status-null { background: #fffbeb; color: #d97706; }
            .status-rejected, .status-hasIssues { background: #fef2f2; color: #dc2626; }
            .status-edited { background: #f0fdf4; color: #2e7d32; }
            .report-footer-section { margin-top: 24px; padding-top: 12px; border-top: 1px solid #e5e7eb; text-align: center; }
            .footer-generated { color: #9ca3af; font-size: 10px; margin-bottom: 2px; }
            .footer-brand { color: #374151; font-size: 11px; font-weight: 500; margin-bottom: 2px; }
            .footer-note { color: #9ca3af; font-size: 9px; }
            .alert { display: none; }
            [class*="icon-"] { font-family: inherit; }
            @media print { body { padding: 10px; } .report-section { page-break-inside: avoid; } }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
          <script>
            setTimeout(function() { window.print(); }, 300);
          <\/script>
        </body>
        </html>
      `);
      printWindow.document.close();
    }
  }
};
</script>

<style lang="scss">
@import '../../assets/scss/variables';

#reports-page {
  .reports-filters {
    margin-bottom: 24px;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    background: #fff;

    .panel-heading {
      background: #f9fafb;
      border-bottom: 1px solid #e5e7eb;
      padding: 14px 20px;
      border-radius: 10px 10px 0 0;

      .panel-title {
        font-size: 15px;
        font-weight: 600;
        color: #111827;
        margin: 0;
      }
    }

    .panel-body { padding: 20px; }

    .filters-row { margin-bottom: 16px; }

    .filter-group {
      label {
        font-size: 13px;
        font-weight: 600;
        color: #374151;
        margin-bottom: 6px;
        display: flex;
        align-items: center;
        gap: 6px;

        span { color: #2e7d32; }
      }

      .form-control {
        height: 40px;
        border-radius: 8px;
        border: 1.5px solid #d1d5db;
        padding: 0 12px;
        font-size: 14px;
        color: #111827;
        transition: border-color 0.15s, box-shadow 0.15s;

        &:focus { border-color: #2e7d32; box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.08); outline: none; }
        &:disabled { background: #f9fafb; color: #9ca3af; }
      }
    }

    .date-inputs {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;

      .form-control { flex: 1; min-width: 140px; }
      .date-separator { color: #9ca3af; font-weight: 500; flex-shrink: 0; }

      @media (max-width: 576px) {
        flex-direction: column;
        .date-separator { display: none; }
        .form-control { width: 100%; }
      }
    }

    .actions-row { margin-top: 16px; padding-top: 16px; border-top: 1px solid #e5e7eb; }

    .actions-buttons {
      display: flex;
      justify-content: center;
      gap: 12px;
      flex-wrap: wrap;

      .btn-lg {
        padding: 10px 28px;
        font-size: 14px;
        font-weight: 600;
        border-radius: 8px;
        border: none;
        cursor: pointer;
        transition: background 0.15s, box-shadow 0.15s;
      }
      .btn-primary {
        background: #2e7d32;
        color: #fff;
        &:hover { background: #1b5e20; box-shadow: 0 2px 8px rgba(46,125,50,0.2); }
      }
      .btn-danger {
        background: #dc2626;
        color: #fff;
        &:hover { background: #b91c1c; }
      }
    }
  }
  
  .report-container {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    overflow: hidden;
  }

  .report-header-section {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 24px;
    background: #f9fafb;
    border-bottom: 1px solid #e5e7eb;

    .report-branding {
      display: flex;
      align-items: center;
      gap: 14px;

      .brand-logo {
        width: 48px;
        height: 48px;
        background: #2e7d32;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 22px;
      }

      .brand-info {
        h1 { color: #111827; font-size: 20px; font-weight: 700; margin: 0; }
        p { color: #6b7280; font-size: 13px; margin: 2px 0 0; }
      }
    }

    .report-info {
      text-align: right;

      h2 { color: #111827; font-size: 16px; font-weight: 600; margin: 0 0 10px; }

      .report-meta-grid {
        display: flex;
        flex-direction: column;
        gap: 4px;

        .meta-item {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 6px;
          font-size: 13px;
          color: #6b7280;

          span:first-child { color: #2e7d32; font-size: 12px; }
          strong { color: #374151; }
        }
      }
    }
  }

  .report-section {
    padding: 20px 24px;
    border-bottom: 1px solid #f3f4f6;

    &:last-of-type { border-bottom: none; }
  }

  .section-title {
    color: #111827;
    font-size: 15px;
    font-weight: 600;
    border-bottom: 1px solid #e5e7eb;
    padding-bottom: 10px;
    margin: 0 0 20px;
    display: flex;
    align-items: center;
    gap: 8px;

    span[class^="icon-"] { color: #2e7d32; font-size: 14px; }
  }
  
  .stats-grid-4 {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
  }

  .stat-card {
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 12px;

    .stat-icon { font-size: 24px; color: #6b7280; }
    .stat-content { flex: 1; }
    .stat-value { font-size: 22px; font-weight: 700; color: #111827; }
    .stat-label { font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.3px; margin-top: 2px; }

    &.card-blue { .stat-icon { color: #2e7d32; } }
    &.card-green { .stat-icon { color: #4caf50; } }
    &.card-orange { .stat-icon { color: #e65100; } }
    &.card-purple { .stat-icon { color: #7b1fa2; } }
    &.card-red { .stat-icon { color: #c62828; } }
  }

  .charts-row { display: flex; gap: 24px; }

  .pie-chart-container {
    display: flex;
    gap: 30px;
    align-items: center;
    padding: 16px;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
  }

  .pie-legend {
    display: flex;
    flex-direction: column;
    gap: 10px;

    .legend-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;

      .legend-color { width: 12px; height: 12px; border-radius: 3px; }
      .legend-label { flex: 1; color: #374151; }
      .legend-value { color: #6b7280; font-size: 12px; }
    }

    .color-approved { background: #4caf50; }
    .color-pending { background: #ff9800; }
    .color-rejected { background: #ef4444; }
    .color-other { background: #9ca3af; }
  }

  .bar-chart-container {
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 20px;
  }

  .bar-chart {
    display: flex;
    align-items: flex-end;
    justify-content: space-around;
    height: 180px;
    border-bottom: 1px solid #d1d5db;
    padding-bottom: 8px;
  }

  .bar-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    max-width: 70px;
  }

  .bar-fill {
    background: #2e7d32;
    width: 36px;
    border-radius: 4px 4px 0 0;
    min-height: 6px;
    display: flex;
    align-items: flex-start;
    justify-content: center;
  }

  .bar-value { color: #fff; font-size: 11px; font-weight: 600; padding-top: 6px; }
  .bar-label { font-size: 11px; color: #6b7280; margin-top: 8px; }

  .table-responsive {
    overflow-x: auto;
    max-height: 600px;
    overflow-y: auto;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
  }

  .report-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;

    th, td { padding: 10px 14px; border-bottom: 1px solid #e5e7eb; text-align: left; }
    th { background: #f9fafb; color: #374151; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.02em; }
    tr:last-child td { border-bottom: none; }
    tbody tr:hover { background: #f9fafb; }
    .total-row { background: #f3f4f6 !important; font-weight: 600; }
    .text-center { text-align: center; }

    .project-name, .collector-name {
      display: flex;
      align-items: center;
      gap: 6px;
      span { color: #2e7d32; font-size: 13px; }
    }
  }

  .status-badge, .state-badge {
    display: inline-block;
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 500;
  }

  .status-active, .state-open { background: #e8f5e9; color: #2e7d32; }
  .status-inactive { background: #f3f4f6; color: #6b7280; }
  .status-revoked { background: #fef2f2; color: #dc2626; }
  .status-approved { background: #e8f5e9; color: #2e7d32; }
  .status-received, .status-pending { background: #fffbeb; color: #d97706; }
  .status-rejected, .status-hasIssues { background: #fef2f2; color: #dc2626; }
  .status-edited { background: #f0fdf4; color: #2e7d32; }
  .state-closing { background: #fffbeb; color: #d97706; }
  .state-closed { background: #f3f4f6; color: #6b7280; }

  .submissions-table {
    font-size: 13px;

    .instance-id code {
      background: #f3f4f6;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 11px;
      color: #6b7280;
    }

    .submitter-name {
      display: flex;
      align-items: center;
      gap: 6px;
      span { color: #2e7d32; }
    }
  }

  .section-count {
    font-size: 13px;
    font-weight: normal;
    color: #9ca3af;
    margin-left: 8px;
  }

  .table-note {
    margin-top: 10px;
    font-size: 12px;
    color: #9ca3af;
    font-style: italic;
    text-align: center;
  }

  .form-info-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;

    .info-card {
      background: #f9fafb;
      padding: 14px;
      border-radius: 8px;
      border: 1px solid #e5e7eb;

      .info-label { display: block; font-size: 11px; color: #6b7280; text-transform: uppercase; margin-bottom: 6px; }
      .info-value { font-size: 15px; font-weight: 600; color: #111827;
        &.highlight { color: #2e7d32; font-size: 20px; }
        code { background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-size: 12px; }
      }
    }
  }

  .collectors-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 14px;

    .collector-card {
      display: flex;
      align-items: center;
      gap: 12px;
      background: #f9fafb;
      padding: 14px;
      border-radius: 8px;
      border: 1px solid #e5e7eb;

      .collector-avatar {
        width: 40px;
        height: 40px;
        background: #2e7d32;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        span { color: white; font-size: 18px; }
      }

      .collector-info {
        flex: 1;
        strong { display: block; font-size: 14px; color: #111827; margin-bottom: 2px; }
        .collector-stats { display: block; font-size: 12px; color: #6b7280; margin-bottom: 4px; }
        .collector-breakdown {
          display: flex;
          gap: 10px;
          font-size: 11px;
          .approved { color: #2e7d32; }
          .pending { color: #d97706; }
          .rejected { color: #dc2626; }
        }
      }
    }
  }

  .form-summary-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    margin-bottom: 16px;
    padding: 12px;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 8px;

    .summary-item {
      .summary-label { display: block; font-size: 10px; color: #6b7280; text-transform: uppercase; margin-bottom: 3px; }
      code { background: #f3f4f6; padding: 2px 5px; border-radius: 3px; font-size: 11px; }
    }
  }

  .form-section-title {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;

    .state-badge { font-size: 11px; }
    .section-count { font-size: 13px; font-weight: normal; color: #9ca3af; }
  }

  .compact-table {
    font-size: 12px;
    th, td { padding: 8px 10px; }
  }

  .no-submissions-note {
    padding: 14px;
    background: #fffbeb;
    border: 1px solid #fde68a;
    border-radius: 6px;
    color: #92400e;
    font-size: 13px;
    text-align: center;
  }

  .text-success { color: #2e7d32; }
  .text-warning { color: #d97706; }

  .insights-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
  }

  .insight-card {
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 16px;

    .insight-icon { font-size: 20px; color: #2e7d32; margin-bottom: 8px; }

    .insight-content {
      h4 { margin: 0 0 6px; font-size: 12px; font-weight: 600; color: #374151; text-transform: uppercase; }
      p { margin: 3px 0; font-size: 12px; color: #6b7280; }
    }

    &.insight-source .insight-icon { color: #7b1fa2; }
    &.insight-trend .insight-icon { color: #d97706; }
    &.trend-up .insight-icon { color: #2e7d32; }
    &.trend-down .insight-icon { color: #dc2626; }
  }

  .trend-text-up { color: #2e7d32; font-weight: 600; }
  .trend-text-down { color: #dc2626; font-weight: 600; }
  .trend-text-stable { color: #6b7280; }

  .data-table {
    font-size: 12px;
    width: 100%;

    th, td {
      padding: 8px 10px;
      vertical-align: middle;
      border-bottom: 1px solid #e5e7eb;
    }

    th {
      background: #f9fafb;
      font-weight: 600;
      font-size: 11px;
      text-transform: uppercase;
      color: #6b7280;
      position: sticky;
      top: 0;
      z-index: 1;
    }

    tbody tr:hover { background: #f9fafb; }

    .submitter-cell {
      display: flex;
      align-items: center;
      gap: 5px;
      min-width: 130px;
      span { color: #2e7d32; }
    }

    .data-cell {
      max-width: 160px;
      min-width: 70px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      &:hover { white-space: normal; word-break: break-word; max-width: none; }
    }

    .text-center { text-align: center; }
  }

  .form-cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 14px;
  }

  .form-detail-card {
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 16px;

    .form-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      h4 { margin: 0; font-size: 14px; font-weight: 600; color: #111827; }
    }

    .form-card-body {
      display: flex;
      justify-content: space-around;
      margin-bottom: 12px;
      padding: 12px 0;
      border-top: 1px solid #e5e7eb;
      border-bottom: 1px solid #e5e7eb;
    }

    .form-stat {
      text-align: center;
      .form-stat-value { display: block; font-size: 18px; font-weight: 700; color: #111827; }
      .form-stat-label { font-size: 10px; color: #6b7280; text-transform: uppercase; }
    }

    .form-progress {
      .progress-bar { height: 6px; background: #e5e7eb; border-radius: 3px; overflow: hidden; }
      .progress-fill { height: 100%; background: #2e7d32; border-radius: 3px; }
      .progress-text { font-size: 11px; color: #6b7280; margin-top: 4px; }
    }
  }

  .temporal-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
  }

  .temporal-card {
    display: flex;
    align-items: center;
    gap: 12px;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 14px;

    > span:first-child { font-size: 20px; color: #2e7d32; }

    .temporal-content {
      .temporal-label { display: block; font-size: 10px; color: #6b7280; text-transform: uppercase; }
      .temporal-value { display: block; font-size: 15px; font-weight: 600; color: #111827; }
    }
  }

  .mini-progress {
    position: relative;
    height: 18px;
    background: #e5e7eb;
    border-radius: 4px;
    overflow: hidden;
    min-width: 70px;

    .mini-progress-fill {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      background: #2e7d32;
      border-radius: 4px;
    }

    span {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 10px;
      font-weight: 600;
      color: #111827;
    }
  }

  .user-profile-card {
    display: flex;
    align-items: center;
    gap: 16px;
    background: #f9fafb;
    padding: 20px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;

    .user-avatar-large {
      width: 52px;
      height: 52px;
      background: #2e7d32;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      span { color: white; font-size: 24px; }
    }

    .user-profile-info {
      flex: 1;
      h4 { margin: 0 0 3px; font-size: 17px; font-weight: 600; color: #111827; }
      .user-role { color: #2e7d32; font-weight: 600; margin: 0 0 3px; font-size: 13px; }
      .user-project {
        color: #6b7280; font-size: 13px; margin: 0;
        display: flex; align-items: center; gap: 5px;
        .user-form-badge {
          background: #f3f4f6; padding: 2px 6px; border-radius: 4px;
          font-size: 11px; color: #374151; margin-left: 8px;
          display: inline-flex; align-items: center; gap: 3px;
        }
      }
    }

    .user-status-badge { flex-shrink: 0; }
  }

  .report-footer-section {
    padding: 20px 24px;
    text-align: center;
    border-top: 1px solid #e5e7eb;

    .footer-line { display: none; }
    .footer-generated { color: #9ca3af; font-size: 12px; margin-bottom: 4px; }
    .footer-brand { color: #374151; font-size: 13px; font-weight: 500; margin-bottom: 4px; display: flex; align-items: center; justify-content: center; gap: 6px; }
    .footer-note { color: #9ca3af; font-size: 11px; }
  }

  .welcome-section {
    text-align: center;
    padding: 48px 32px;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 10px;

    .welcome-icon { font-size: 48px; color: #2e7d32; margin-bottom: 16px; opacity: 0.5; }
    h3 { color: #111827; font-size: 18px; font-weight: 600; margin-bottom: 10px; }
    p { color: #6b7280; font-size: 14px; max-width: 440px; margin: 0 auto 24px; line-height: 1.5; }

    .welcome-steps {
      list-style: none;
      padding: 0;
      display: flex;
      justify-content: center;
      gap: 24px;

      li {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 13px;
        color: #374151;

        .step-num {
          width: 26px;
          height: 26px;
          background: #2e7d32;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
        }
      }
    }
  }

  .no-data-alert {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px 20px;
    background: #fffbeb;
    border: 1px solid #fde68a;
    border-radius: 8px;

    > span:first-child { font-size: 24px; color: #d97706; }
    strong { display: block; color: #92400e; margin-bottom: 3px; font-size: 14px; }
    p { margin: 0; color: #6b7280; font-size: 13px; }
  }

  @media (max-width: 992px) {
    .stats-grid-4, .temporal-grid, .insights-grid { grid-template-columns: repeat(2, 1fr); }
    .form-info-grid { grid-template-columns: repeat(2, 1fr); }
    .report-header-section { flex-direction: column; gap: 16px; .report-info { text-align: left; } }
  }

  @media (max-width: 576px) {
    .stats-grid-4, .temporal-grid, .insights-grid, .form-info-grid { grid-template-columns: 1fr; }
    .welcome-steps { flex-direction: column; align-items: center; }
    .form-summary-grid { grid-template-columns: repeat(2, 1fr); }
  }
}
</style>

<i18n lang="json5">
{
  "en": {
    "title": "Reports & Statistics",
    "introduction": "Generate detailed reports on your data collection activities. Filter by project, form, and period, then export to PDF for sharing with partners.",
    "filters": {
      "title": "Report Filters",
      "project": "Project",
      "form": "Form",
      "period": "Period",
      "allProjects": "All projects",
      "allForms": "All forms",
      "loading": "Loading...",
      "allTime": "All time",
      "today": "Today",
      "yesterday": "Yesterday",
      "thisWeek": "This week",
      "lastWeek": "Last week",
      "thisMonth": "This month",
      "lastMonth": "Last month",
      "thisYear": "This year",
      "custom": "Custom dates",
      "dateRange": "Date range",
      "user": "Agent / User",
      "allUsers": "All agents"
    },
    "actions": {
      "generate": "Generate Report",
      "exportPdf": "Download PDF",
      "reset": "Reset"
    },
    "stats": {
      "projects": "Projects",
      "forms": "Forms",
      "submissions": "Submissions",
      "fieldAgents": "Field Agents",
      "collectors": "Collectors"
    },
    "section": {
      "overview": "Overview",
      "statusChart": "Submissions by Status",
      "timeline": "Monthly Activity (Last 6 months)",
      "projectsTable": "Projects Summary",
      "formDetails": "Forms Details",
      "collectors": "Field Agents / Collectors",
      "submissionsList": "Detailed Submissions List",
      "temporal": "Collection Timeline"
    },
    "submissions": {
      "instanceId": "ID",
      "project": "Project",
      "form": "Form",
      "submitter": "Submitter",
      "date": "Date/Time",
      "status": "Status",
      "showingNote": "Showing {shown} of {total} submissions (most recent)"
    },
    "status": {
      "approved": "Approved",
      "pending": "Pending",
      "rejected": "Rejected",
      "other": "Other"
    },
    "projectStatus": {
      "active": "Active",
      "empty": "No data"
    },
    "collectorStatus": {
      "active": "Active",
      "revoked": "Revoked"
    },
    "collector": {
      "name": "Name",
      "project": "Project",
      "submissions": "Submissions",
      "lastActivity": "Last Activity",
      "status": "Status",
      "contribution": "Contribution"
    },
    "temporal": {
      "firstSubmission": "First Submission",
      "lastSubmission": "Last Submission",
      "collectionPeriod": "Collection Period",
      "avgPerDay": "Daily Average"
    },
    "reportTitle": {
      "global": "Global Activity Report",
      "project": "Project Report",
      "form": "Form Report",
      "user": "Agent Report"
    },
    "formReport": {
      "info": "Form Information",
      "formId": "Form ID",
      "state": "State",
      "totalSubmissions": "Total Submissions",
      "collectors": "Collectors",
      "statusBreakdown": "Submissions by Status",
      "submissionsData": "Detailed Submissions Data",
      "submitter": "Submitted by",
      "date": "Date/Time",
      "status": "Status",
      "showingFirst": "Showing first {count} of {total} submissions",
      "collectorsContribution": "Collectors Contribution"
    },
    "projectReport": {
      "overview": "Project Overview",
      "formId": "Form ID",
      "created": "Created",
      "lastSubmission": "Last Submission",
      "collectors": "Collectors",
      "showingRecent": "Showing {shown} most recent of {total} submissions",
      "noSubmissions": "No submissions for this form"
    },
    "report": {
      "generatedOn": "Generated on",
      "title": "Detailed Activity Report",
      "date": "Generated on",
      "project": "Project",
      "form": "Form",
      "user": "Agent",
      "period": "Period",
      "footer": "Report generated on {date} by AGR-Collect",
      "confidential": "Confidential document - For internal use only"
    },
    "table": {
      "project": "Project",
      "form": "Form",
      "forms": "Forms",
      "submissions": "Submissions",
      "agents": "Agents",
      "lastActivity": "Last Activity",
      "status": "Status",
      "total": "TOTAL"
    },
    "noData": {
      "title": "No data available",
      "message": "No data matches the selected filters. Please adjust your criteria or select a different period."
    },
    "welcome": {
      "title": "Generate a detailed report",
      "message": "Select your filters above and click Generate to create a comprehensive report with statistics, charts, and detailed data.",
      "step1": "Select a project (optional)",
      "step2": "Choose a period",
      "step3": "Click Generate"
    },
    "userReport": {
      "profile": "Agent Profile",
      "fieldAgent": "Field Agent",
      "keyStats": "Key Statistics",
      "formsContributed": "Forms Contributed",
      "detailedSubmissions": "Detailed Submissions",
      "performance": "Performance & Analysis",
      "activityTimeline": "Activity Timeline"
    },
    "analytics": {
      "title": "Insights & Analysis",
      "performance": "Performance",
      "avgPerDay": "{count} submissions/day average",
      "peakDay": "Peak: {date} ({count} submissions)",
      "quality": "Data Quality",
      "approvalRate": "{rate}% approval rate",
      "rejectionRate": "{rate}% rejection rate",
      "sources": "Submission Sources",
      "mobile": "Mobile (AGR-Collect)",
      "web": "Web",
      "trend": "Monthly Trend",
      "vsLastMonth": "vs last month"
    }
  },
  "fr": {
    "title": "Rapports & Statistiques",
    "introduction": "Générez des rapports détaillés sur vos activités de collecte de données. Filtrez par projet, formulaire et période, puis exportez en PDF pour partager avec vos partenaires.",
    "filters": {
      "title": "Filtres du rapport",
      "project": "Projet",
      "form": "Formulaire",
      "period": "Période",
      "allProjects": "Tous les projets",
      "allForms": "Tous les formulaires",
      "loading": "Chargement...",
      "allTime": "Toute la période",
      "today": "Aujourd'hui",
      "yesterday": "Hier",
      "thisWeek": "Cette semaine",
      "lastWeek": "Semaine dernière",
      "thisMonth": "Ce mois-ci",
      "lastMonth": "Mois dernier",
      "thisYear": "Cette année",
      "custom": "Dates personnalisées",
      "dateRange": "Plage de dates",
      "user": "Agent / Utilisateur",
      "allUsers": "Tous les agents"
    },
    "actions": {
      "generate": "Générer le rapport",
      "exportPdf": "Télécharger PDF",
      "reset": "Réinitialiser"
    },
    "stats": {
      "projects": "Projets",
      "forms": "Formulaires",
      "submissions": "Soumissions",
      "fieldAgents": "Agents terrain",
      "collectors": "Collecteurs"
    },
    "section": {
      "overview": "Vue d'ensemble",
      "statusChart": "Soumissions par statut",
      "timeline": "Activité mensuelle (6 derniers mois)",
      "projectsTable": "Résumé des projets",
      "formDetails": "Détail des formulaires",
      "collectors": "Agents de terrain / Collecteurs",
      "submissionsList": "Liste détaillée des soumissions",
      "temporal": "Chronologie de collecte"
    },
    "submissions": {
      "instanceId": "ID",
      "project": "Projet",
      "form": "Formulaire",
      "submitter": "Soumis par",
      "date": "Date/Heure",
      "status": "Statut",
      "showingNote": "Affichage de {shown} sur {total} soumissions (les plus récentes)"
    },
    "status": {
      "approved": "Approuvées",
      "pending": "En attente",
      "rejected": "Rejetées",
      "other": "Autres"
    },
    "projectStatus": {
      "active": "Actif",
      "empty": "Aucune donnée"
    },
    "collectorStatus": {
      "active": "Actif",
      "revoked": "Révoqué"
    },
    "collector": {
      "name": "Nom",
      "project": "Projet",
      "submissions": "Soumissions",
      "lastActivity": "Dernière activité",
      "status": "Statut",
      "contribution": "Contribution"
    },
    "temporal": {
      "firstSubmission": "Première soumission",
      "lastSubmission": "Dernière soumission",
      "collectionPeriod": "Période de collecte",
      "avgPerDay": "Moyenne journalière"
    },
    "reportTitle": {
      "global": "Rapport d'activité global",
      "project": "Rapport du projet",
      "form": "Rapport du formulaire",
      "user": "Rapport de l'agent"
    },
    "formReport": {
      "info": "Informations du formulaire",
      "formId": "Identifiant",
      "state": "État",
      "totalSubmissions": "Total soumissions",
      "collectors": "Collecteurs",
      "statusBreakdown": "Répartition par statut",
      "submissionsData": "Données des soumissions",
      "submitter": "Soumis par",
      "date": "Date/Heure",
      "status": "Statut",
      "showingFirst": "Affichage des {count} premières sur {total} soumissions",
      "collectorsContribution": "Contribution des collecteurs"
    },
    "projectReport": {
      "overview": "Vue d'ensemble du projet",
      "formId": "Identifiant",
      "created": "Créé le",
      "lastSubmission": "Dernière soumission",
      "collectors": "Collecteurs",
      "showingRecent": "Affichage des {shown} plus récentes sur {total} soumissions",
      "noSubmissions": "Aucune soumission pour ce formulaire"
    },
    "report": {
      "generatedOn": "Généré le",
      "title": "Rapport d'activité détaillé",
      "date": "Généré le",
      "project": "Projet",
      "form": "Formulaire",
      "user": "Agent",
      "period": "Période",
      "footer": "Rapport généré le {date} par AGR-Collect",
      "confidential": "Document confidentiel - Usage interne uniquement"
    },
    "table": {
      "project": "Projet",
      "form": "Formulaire",
      "forms": "Formulaires",
      "submissions": "Soumissions",
      "agents": "Agents",
      "lastActivity": "Dernière activité",
      "status": "Statut",
      "total": "TOTAL"
    },
    "noData": {
      "title": "Aucune donnée disponible",
      "message": "Aucune donnée ne correspond aux filtres sélectionnés. Veuillez ajuster vos critères ou sélectionner une période différente."
    },
    "welcome": {
      "title": "Générez un rapport détaillé",
      "message": "Sélectionnez vos filtres ci-dessus et cliquez sur Générer pour créer un rapport complet avec statistiques, graphiques et données détaillées.",
      "step1": "Sélectionnez un projet (optionnel)",
      "step2": "Choisissez une période",
      "step3": "Cliquez sur Générer"
    },
    "userReport": {
      "profile": "Profil de l'agent",
      "fieldAgent": "Agent de terrain",
      "keyStats": "Statistiques cl\u00e9s",
      "formsContributed": "Formulaires contribu\u00e9s",
      "detailedSubmissions": "Soumissions d\u00e9taill\u00e9es",
      "performance": "Performance & Analyse",
      "activityTimeline": "Chronologie d'activit\u00e9"
    },
    "analytics": {
      "title": "Analyses & Insights",
      "performance": "Performance",
      "avgPerDay": "{count} soumissions/jour en moyenne",
      "peakDay": "Pic: {date} ({count} soumissions)",
      "quality": "Qualité des données",
      "approvalRate": "Taux d'approbation: {rate}%",
      "rejectionRate": "Taux de rejet: {rate}%",
      "sources": "Sources des soumissions",
      "mobile": "Mobile (AGR-Collect)",
      "web": "Web",
      "trend": "Tendance mensuelle",
      "vsLastMonth": "vs mois précédent"
    }
  }
}
</i18n>

