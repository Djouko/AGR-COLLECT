<template>
  <tr class="project-form-row">
    <td class="col-icon">
      <span v-if="showIcon" class="icon-file"></span>
    </td>
    <td class="form-name">
      <template v-if="canLinkToDraftStatus">
        <form-link :form="form"/>
      </template>
      <template v-else-if="canLinkToSubmissions">
        <form-link :form="form" :to="submissionsPath.all"/>
      </template>
      <template v-else>
        <template v-if="canLinkToEnketo">
          <a :href="enketoPath" target="_blank">{{ form.nameOrId }}</a>
        </template>
        <template v-else>
          {{ form.nameOrId }}
        </template>
      </template>

      <span v-if="showIdForDuplicateName" class="duplicate-form-id">({{ form.xmlFormId }})</span>
    </td>
    <template v-if="form.publishedAt != null">
      <td v-for="reviewState of visibleReviewStates" :key="reviewState" class="review-state">
        <span v-tooltip.no-aria="$t(`reviewState.${reviewState}`)">
          <template v-if="canLinkToSubmissions">
            <router-link :to="submissionsPath[reviewState]">
              <span>{{ $n(form.reviewStates[reviewState], 'default') }}</span>
              <span :class="reviewStateIcon(reviewState)"></span>
            </router-link>
          </template>
          <template v-else>
            <span>{{ $n(form.reviewStates[reviewState], 'default') }}</span>
            <span :class="reviewStateIcon(reviewState)"></span>
          </template>
        </span>
      </td>
      <td class="last-submission">
        <span v-tooltip.no-aria="lastSubmissionTooltip">
          <template v-if="form.lastSubmission != null">
            <template v-if="canLinkToSubmissions">
              <router-link :to="submissionsPath.all">
                <date-time :iso="form.lastSubmission" relative="past"
                  :tooltip="false"/>
                <span class="icon-clock-o"></span>
              </router-link>
            </template>
            <template v-else>
              <date-time :iso="form.lastSubmission" relative="past"
                :tooltip="false"/>
              <span class="icon-clock-o"></span>
            </template>
          </template>
          <template v-else>{{ $t('submission.noSubmission') }}</template>
        </span>
      </td>
      <td class="total-submissions">
        <span v-tooltip.no-aria="$t('common.totalSubmissions')">
          <template v-if="canLinkToSubmissions">
            <router-link :to="submissionsPath.all">
              <span>{{ $n(form.submissions, 'default') }}</span>
              <span class="icon-asterisk"></span>
            </router-link>
          </template>
          <template v-else>
            <span>{{ $n(form.submissions, 'default') }}</span>
            <span class="icon-asterisk"></span>
          </template>
        </span>
      </td>
    </template>
    <template v-else>
      <td class="not-published" colspan="5">
        <span>{{ $t('formState.unpublished') }}</span>
        <span class="icon-asterisk"></span>
      </td>
    </template>
  </tr>
</template>

<script>
import { DateTime } from 'luxon';

import DateTimeComponent from '../date-time.vue';
import FormLink from '../form/link.vue';

import useReviewState from '../../composables/review-state';
import useRoutes from '../../composables/routes';
import { formatDateTime } from '../../util/date-time';
import { useRequestData } from '../../request-data';

export default {
  name: 'ProjectFormRow',
  components: { DateTime: DateTimeComponent, FormLink },
  props: {
    form: {
      type: Object,
      required: true
    },
    project: {
      type: Object,
      required: true
    },
    showIcon: {
      type: Boolean,
      required: true
    }
  },
  setup() {
    const { projects } = useRequestData();
    const { duplicateFormNamesPerProject } = projects.toRefs();
    const { formPath, newSubmissionPath } = useRoutes();
    const { reviewStateIcon } = useReviewState();
    return {
      duplicateFormNamesPerProject,
      formPath,
      newSubmissionPath,
      reviewStateIcon
    };
  },
  computed: {
    canLinkToDraftStatus() {
      return this.form.publishedAt == null && this.project.permits('form.update');
    },
    canLinkToSubmissions() {
      return this.project.permits('submission.list');
    },
    canLinkToEnketo() {
      return this.form.publishedAt != null && this.form.state === 'open' && this.form.enketoId !== null;
    },
    visibleReviewStates: () => ['received', 'hasIssues', 'edited'],
    submissionsPath() {
      const submissionPath = this.formPath(
        this.form.projectId,
        this.form.xmlFormId,
        'submissions'
      );
      return {
        received: `${submissionPath}?reviewState=null`,
        edited: `${submissionPath}?reviewState=%27edited%27`,
        hasIssues: `${submissionPath}?reviewState=%27hasIssues%27`,
        all: submissionPath
      };
    },
    enketoPath() {
      return this.newSubmissionPath(this.form.projectId, this.form.xmlFormId, !this.form.publishedAt);
    },
    showIdForDuplicateName() {
      const formNames = this.duplicateFormNamesPerProject[this.project.id];
      if (formNames) {
        return formNames.has(this.form.nameOrId.toLocaleLowerCase());
      }
      return false;
    },
    lastSubmissionTooltip() {
      const { lastSubmission } = this.form;
      const header = this.$t('header.lastSubmission');
      if (lastSubmission == null) return header;
      const formatted = formatDateTime(DateTime.fromISO(lastSubmission));
      return `${header}\n${formatted}`;
    }
  }
};
</script>

<style lang="scss">
@import '../../assets/scss/mixins';

.project-form-row {
  transition: background-color 0.15s;

  &:hover {
    background-color: #f9fafb !important;
  }

  td {
    font-size: 15px;
    padding: 8px 6px 8px 10px;
    color: #111827;
    border-top: 1px solid #f3f4f6;

    a {
      @include text-link;
      font-weight: 500;
    }
  }

  .form-name {
    font-weight: 500;
  }

  .duplicate-form-id {
    font-family: $font-family-monospace;
    font-size: 11px;
    padding-left: 6px;
    color: #9ca3af;
  }

  .review-state, .total-submissions, .not-published {
    text-align: right;
    padding-right: 12px;
    width: 80px;
    font-size: 13px;
    color: #6b7280;
  }

  .last-submission {
    text-align: right;
    width: 170px;
    font-size: 13px;
    color: #6b7280;
  }

  .not-published {
    color: #9ca3af;
    font-style: italic;
    font-size: 13px;
  }

  [class*='icon'] {
    margin-left: 5px;
    color: #d1d5db;
  }
}
</style>
