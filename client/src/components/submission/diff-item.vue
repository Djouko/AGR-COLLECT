<template>
  <diff-item v-slot="{ parentPath, path, value, isOld }" v-bind="entry">
    <a v-if="isBinary(parentPath, path)" :href="binaryHref(value, isOld)">{{ value }}</a>
    <template v-else>{{ value }}</template>
  </diff-item>
</template>

<script>
import DiffItem from '../diff-item.vue';

import { apiPaths } from '../../util/request';
import { useRequestData } from '../../request-data';

export default {
  name: 'SubmissionDiffItem',
  components: { DiffItem },
  props: {
    projectId: {
      type: String,
      required: true
    },
    xmlFormId: {
      type: String,
      required: true
    },
    instanceId: {
      type: String,
      required: true
    },
    oldVersionId: {
      type: String,
      required: false // only used for making binary file link
    },
    newVersionId: {
      type: String,
      required: false // only used for making binary file link
    },
    entry: {
      type: Object,
      required: true
    }
  },
  setup() {
    const { fields } = useRequestData();
    return { fields };
  },
  methods: {
    isBinary(parentPath, path) {
      const fullPath = parentPath.concat(path.filter((field) => field[0] !== undefined));
      const fullPathStr = fullPath.map((field) => (Array.isArray(field) ? field[0] : field)).join('/');
      const basicPath = `/${fullPathStr}`;
      if (this.fields.binaryPaths.has(basicPath))
        return true;
      return false;
    },
    binaryHref(value, useOldVersion) {
      return apiPaths.submissionVersionAttachment(
        this.projectId,
        this.xmlFormId,
        this.instanceId,
        useOldVersion ? this.oldVersionId : this.newVersionId,
        value
      );
    }
  }
};
</script>
