<template>
  <div>
    <form-head v-show="dataExists"/>
    <page-body>
      <loading :state="initiallyLoading"/>
      <!-- <router-view> may send its own requests before the server has
      responded to the requests from FormShow. -->
      <router-view v-show="dataExists" @fetch-project="fetchProject"
        @fetch-form="fetchForm" @fetch-linked-datasets="fetchLinkedDatasets"/>
    </page-body>
  </div>
</template>

<script setup>
import { nextTick, watchEffect } from 'vue';

import FormHead from './head.vue';
import Loading from '../loading.vue';
import PageBody from '../page/body.vue';

import useDatasets from '../../request-data/datasets';
import useForm from '../../request-data/form';
import { apiPaths } from '../../util/request';
import { noop } from '../../util/util';
import { useRequestData } from '../../request-data';

defineOptions({
  name: 'FormShow'
});
const props = defineProps({
  projectId: {
    type: String,
    required: true
  },
  xmlFormId: {
    type: String,
    required: true
  }
});

const { project, resourceStates } = useRequestData();
const { form, publishedAttachments, formDatasetDiff, appUserCount } = useForm();
useDatasets();
const { initiallyLoading, dataExists } = resourceStates([project, form]);

const fetchProject = (resend) => {
  project.request({
    url: apiPaths.project(props.projectId),
    extended: true,
    resend
  }).catch(noop);
};
const fetchForm = () => {
  form.request({
    url: apiPaths.form(props.projectId, props.xmlFormId),
    extended: true
  }).catch(noop);
};
const fetchLinkedDatasets = () => {
  Promise.allSettled([
    publishedAttachments.request({
      url: apiPaths.publishedAttachments(props.projectId, props.xmlFormId)
    }),
    formDatasetDiff.request({
      url: apiPaths.formDatasetDiff(props.projectId, props.xmlFormId)
    })
  ]);
};

fetchProject(false);
fetchForm();
const stopAppUsersEffect = watchEffect(() => {
  if (!project.dataExists) return;
  if (project.permits('assignment.list')) {
    appUserCount.request({
      url: apiPaths.formActors(props.projectId, props.xmlFormId, 'app-user')
    }).catch(noop);
  }
  /* It doesn't work to call stopAppUsersEffect() synchronously. You can see
  that if you remove the nextTick() and try running tests. I think the reason
  why is that if you navigate from another page that has fetched `project`
  already (e.g., the form list), then project.dataExists will be `true`, so the
  watch effect will complete synchronously during component setup. But in that
  case, watchEffect() won't have had a chance to return a value:
  stopAppUsersEffect won't be assigned yet. */
  nextTick(() => stopAppUsersEffect());
});
const stopDatasetsEffect = watchEffect(() => {
  if (!(form.dataExists)) return;
  if (form.publishedAt != null)
    fetchLinkedDatasets();
  stopDatasetsEffect();
});
</script>
