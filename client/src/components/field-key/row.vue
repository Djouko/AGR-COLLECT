<template>
  <tr class="field-key-row" :class="{ success: fieldKey.id === highlighted }">
    <td class="display-name">
      <span v-tooltip.text>{{ fieldKey.displayName }}</span>
    </td>
    <td>
      <time-and-user :iso="fieldKey.createdAt" :user="fieldKey.createdBy"/>
    </td>
    <td><date-time :iso="fieldKey.lastUsed"/></td>
    <td>
      <a v-if="fieldKey.token != null" ref="popoverLink" href="#"
        class="field-key-row-popover-link" role="button"
        @click.prevent="toggleQr">
        <span class="icon-qrcode"></span>{{ $t('seeCode') }}
      </a>
      <template v-else>
        {{ $t('accessRevoked') }}
      </template>
    </td>
    <td>
      <div class="dropdown">
        <button :id="actionsId" type="button"
          class="btn btn-default dropdown-toggle" data-toggle="dropdown"
          aria-haspopup="true" aria-expanded="false">
          <span class="icon-cog"></span><span class="caret"></span>
        </button>
        <ul class="dropdown-menu dropdown-menu-right"
          :aria-labelledby="actionsId">
          <li v-if="fieldKey.token != null" :class="{ disabled: fieldKey.token == null }">
            <a href="#" @click.prevent="$emit('revoke', fieldKey)">
              {{ $t('action.revokeAccess') }}&hellip;
            </a>
          </li>
          <li v-if="fieldKey.token == null">
            <a href="#" @click.prevent="$emit('restore', fieldKey)">
              {{ $t('action.restoreAccess') }}&hellip;
            </a>
          </li>
          <li>
            <a href="#" @click.prevent="$emit('edit', fieldKey)">
              {{ $t('action.editProfile') }}
            </a>
          </li>
          <li class="divider" role="separator"></li>
          <li>
            <a href="#" class="text-danger" @click.prevent="$emit('delete', fieldKey)">
              {{ $t('action.delete') }}&hellip;
            </a>
          </li>
        </ul>
      </div>
    </td>
  </tr>
</template>

<script>
import DateTime from '../date-time.vue';
import TimeAndUser from '../time-and-user.vue';

export default {
  name: 'FieldKeyRow',
  components: { DateTime, TimeAndUser },
  props: {
    fieldKey: {
      type: Object,
      required: true
    },
    highlighted: Number
  },
  emits: ['toggle-qr', 'revoke', 'restore', 'edit', 'delete'],
  computed: {
    actionsId() {
      return `field-key-row-actions${this.fieldKey.id}`;
    }
  },
  methods: {
    toggleQr() {
      this.$emit('toggle-qr', this.fieldKey, this.$refs.popoverLink);
    }
  }
};
</script>

<style lang="scss">
.field-key-row {
  .table tbody & td {
    vertical-align: middle;
    padding: 12px 10px;
    font-size: 14px;
    border-top-color: #f3f4f6;
  }
  transition: background-color 0.15s;
  &:hover { background-color: #f9fafb; }

  .display-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 600;
    color: #111827;
  }

  .field-key-row-popover-link {
    color: #2e7d32;
    font-weight: 500;
    font-size: 13px;
  }
}
</style>

<i18n lang="json5">
{
  "en": {
    // Clicking on this text displays an App User QR code for configuring AGR-Collect Mobile.
    "seeCode": "See code",
    // This text is shown for an App User whose access has been revoked.
    "accessRevoked": "Access revoked",
    "action": {
      "revokeAccess": "Revoke access",
      "restoreAccess": "Restore access",
      "editProfile": "Edit profile",
      "delete": "Delete user"
    }
  }
}
</i18n>

<i18n>
{
  "cs": {
    "seeCode": "Viz kód",
    "accessRevoked": "Přístup byl zrušen",
    "action": {
      "revokeAccess": "Odebrat přístup"
    }
  },
  "de": {
    "seeCode": "QR-Code",
    "accessRevoked": "Zugriffsberechtigung zurückgezogen",
    "action": {
      "revokeAccess": "Zugriffsberechtigung entziehen"
    }
  },
  "es": {
    "seeCode": "Ver código",
    "accessRevoked": "Acceso revocado",
    "action": {
      "revokeAccess": "Revocar el acceso"
    }
  },
  "fr": {
    "seeCode": "Voir le code",
    "accessRevoked": "Accès retiré",
    "action": {
      "revokeAccess": "Retirer l'accès"
    }
  },
  "id": {
    "seeCode": "Lihat kode",
    "accessRevoked": "Akses dicabut",
    "action": {
      "revokeAccess": "Cabut akses"
    }
  },
  "it": {
    "seeCode": "Mostra il codice",
    "accessRevoked": "Accesso revocato",
    "action": {
      "revokeAccess": "Revoca l'accesso utente"
    }
  },
  "ja": {
    "seeCode": "QRコードを表示",
    "accessRevoked": "アクセス権の取消済み",
    "action": {
      "revokeAccess": "アクセス権の取消"
    }
  },
  "pt": {
    "seeCode": "Ver código",
    "accessRevoked": "Acesso removido",
    "action": {
      "revokeAccess": "Remover acesso"
    }
  },
  "sw": {
    "seeCode": "Angalia msimbo",
    "accessRevoked": "Ufikiaji umebatilishwa",
    "action": {
      "revokeAccess": "Batilisha ufikiaji"
    }
  },
  "zh": {
    "seeCode": "查看代码",
    "accessRevoked": "权限已撤销",
    "action": {
      "revokeAccess": "撤销权限"
    }
  },
  "zh-Hant": {
    "seeCode": "查看 QR code",
    "accessRevoked": "存取權限被撤銷",
    "action": {
      "revokeAccess": "撤銷存取權限"
    }
  }
}
</i18n>
