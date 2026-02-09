<template>
  <div>
    <form-version-table @view-xml="viewXml.show()"/>
    <loading :state="formVersions.initiallyLoading"/>

    <form-version-view-xml v-bind="viewXml" @hide="viewXml.hide()"/>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue';

import FormVersionTable from './table.vue';
import Loading from '../loading.vue';

import { apiPaths } from '../../util/request';
import { loadAsync } from '../../util/load-async';
import { modalData } from '../../util/reactivity';
import { noop } from '../../util/util';
import { useRequestData } from '../../request-data';

export default {
  name: 'FormVersionList',
  components: {
    FormVersionTable,
    FormVersionViewXml: defineAsyncComponent(loadAsync('FormVersionViewXml')),
    Loading
  },
  props: {
    projectId: {
      type: String,
      required: true
    },
    xmlFormId: {
      type: String,
      required: true
    }
  },
  setup() {
    const { formVersions } = useRequestData();
    return { formVersions };
  },
  data() {
    return {
      viewXml: modalData('FormVersionViewXml')
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.formVersions.request({
        url: apiPaths.formVersions(this.projectId, this.xmlFormId),
        extended: true,
        resend: false
      }).catch(noop);
    }
  }
};
</script>
