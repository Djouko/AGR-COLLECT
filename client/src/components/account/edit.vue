<template>
  <user-edit :id="currentUser.id.toString()"/>
</template>

<script setup>
import UserEdit from '../user/edit.vue';

import { useRequestData } from '../../request-data';

defineOptions({
  name: 'AccountEdit'
});

const { currentUser } = useRequestData();
</script>
