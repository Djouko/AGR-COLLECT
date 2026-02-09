<template>
  <tr>
    <td class="display-name">
      <span v-tooltip.text>{{ assignment.actor.displayName }}</span>
    </td>
    <td>
      <form>
        <div class="form-group">
          <select class="form-control" :value="selectedRoleId"
            :aria-label="$t('field.projectRole')"
            :aria-disabled="disabled || awaitingResponse"
            v-tooltip.aria-describedby="disabled ? $t('cannotAssignRole') : null"
            @change="change($event.target.value)">
            <option v-for="role of roles.projectRoles" :key="role.id"
              :value="role.id.toString()">
              {{ $t(`role.${role.system}`) }}
            </option>
            <option value="">{{ $t('role.none') }}</option>
          </select>
          <spinner :state="awaitingResponse"/>
        </div>
      </form>
    </td>
  </tr>
</template>

<script>
import Spinner from '../../spinner.vue';

import useRequest from '../../../composables/request';
import { apiPaths } from '../../../util/request';
import { noop } from '../../../util/util';
import { useRequestData } from '../../../request-data';

export default {
  name: 'ProjectUserRow',
  components: { Spinner },
  props: {
    assignment: {
      type: Object,
      required: true
    }
  },
  emits: ['increment-count', 'decrement-count', 'change'],
  setup() {
    const { currentUser, roles, project } = useRequestData();
    const { request, awaitingResponse } = useRequest();
    return { currentUser, roles, project, request, awaitingResponse };
  },
  data() {
    return {
      selectedRoleId: this.assignment.roleId != null
        ? this.assignment.roleId.toString()
        : ''
    };
  },
  computed: {
    disabled() {
      return this.assignment.actor.id === this.currentUser.id;
    }
  },
  methods: {
    requestChange(method, roleIdString) {
      if (roleIdString === '') return Promise.resolve();
      return this.request({
        method,
        url: apiPaths.projectAssignment(
          this.project.id,
          roleIdString,
          this.assignment.actor.id
        )
      });
    },
    change(roleIdString) {
      this.$emit('increment-count');
      const previousRoleId = this.selectedRoleId;
      this.selectedRoleId = roleIdString;
      const initialRoute = this.$route;
      this.requestChange('DELETE', previousRoleId)
        .then(() => this.requestChange('POST', roleIdString)
          .catch(e => {
            if (previousRoleId !== '' && roleIdString !== '' &&
              this.$route === initialRoute) {
              this.selectedRoleId = '';
              this.$emit('change', this.assignment.actor, null, true);
            }
            throw e;
          }))
        .then(() => {
          const role = roleIdString !== ''
            ? this.roles.find(r => r.id.toString() === roleIdString)
            : null;
          this.$emit('change', this.assignment.actor, role, false);
        })
        .catch(noop)
        .finally(() => {
          if (this.$route === initialRoute) this.$emit('decrement-count');
        });
    }
  }
};
</script>

<style lang="scss">
#project-user-list {
  tr {
    transition: background-color 0.15s;
    &:hover { background-color: #f9fafb; }
  }

  td {
    vertical-align: middle;
    padding: 12px 10px;
    font-size: 14px;
    border-top-color: #f3f4f6;

    &.display-name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-weight: 600;
      color: #111827;
    }

    .form-group {
      margin-bottom: 0;
      padding-bottom: 0;
    }

    .form-control {
      display: inline-block;
      width: 215px;
      font-size: 13px;
      border-radius: 6px;
      border: 1px solid #e5e7eb;
      padding: 4px 8px;
      height: 32px;
    }
  }
}
</style>

<i18n lang="json5">
{
  "en": {
    "cannotAssignRole": "You may not edit your own Project Role.",
    "field": {
      "projectRole": "Project Role"
    }
  }
}
</i18n>

<i18n>
{
  "cs": {
    "cannotAssignRole": "Nemůžete upravovat svou vlastní roli projektu.",
    "field": {
      "projectRole": "Role projektu"
    }
  },
  "de": {
    "cannotAssignRole": "Sie dürfen Ihre eigene Projektrolle nicht bearbeiten.",
    "field": {
      "projectRole": "Projektrolle"
    }
  },
  "es": {
    "cannotAssignRole": "No puede editar su propio rol en el proyecto",
    "field": {
      "projectRole": "Rol en el proyecto"
    }
  },
  "fr": {
    "cannotAssignRole": "Vous ne pouvez pas modifier votre propre rôle dans le projet.",
    "field": {
      "projectRole": "Rôle dans le projet"
    }
  },
  "id": {
    "cannotAssignRole": "Anda tidak dapat mengubah Peran Proyek Anda sendiri.",
    "field": {
      "projectRole": "Peran Proyek"
    }
  },
  "it": {
    "cannotAssignRole": "Non puoi modificare il tuo ruolo nel progetto.",
    "field": {
      "projectRole": "Ruolo del progetto"
    }
  },
  "ja": {
    "cannotAssignRole": "自分自身のプロジェクトの役割を変更することはできません。",
    "field": {
      "projectRole": "プロジェクトでの役割"
    }
  },
  "pt": {
    "cannotAssignRole": "Você não pode alterar a sua própria função no projeto.",
    "field": {
      "projectRole": "Função de projeto"
    }
  },
  "sw": {
    "cannotAssignRole": "Huenda usihariri Jukumu lako la Mradi.",
    "field": {
      "projectRole": "Jukumu la Mradi"
    }
  },
  "zh": {
    "cannotAssignRole": "您无法编辑自己的项目角色。",
    "field": {
      "projectRole": "项目角色"
    }
  },
  "zh-Hant": {
    "cannotAssignRole": "您不得編輯自己的專案角色。",
    "field": {
      "projectRole": "專案角色"
    }
  }
}
</i18n>
