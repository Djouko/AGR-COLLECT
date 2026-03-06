<template>
  <span :title="rawCoords">{{ displayValue }}</span>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { parseGeopoint, formatCoords, reverseGeocode, getCachedPlaceName } from '../../util/reverse-geocode';

const props = defineProps({
  value: {
    default: null
  }
});

const displayValue = ref('');
const rawCoords = ref('');

onMounted(async () => {
  if (props.value == null) {
    displayValue.value = '';
    return;
  }

  const parsed = parseGeopoint(props.value);
  if (!parsed) {
    displayValue.value = typeof props.value === 'object' ? JSON.stringify(props.value) : String(props.value);
    return;
  }

  rawCoords.value = `${parsed.lat}, ${parsed.lon}`;

  // Show cached place name or formatted coordinates immediately
  const cached = getCachedPlaceName(parsed.lat, parsed.lon);
  if (cached) {
    displayValue.value = cached;
    return;
  }

  // Show formatted coordinates while fetching
  displayValue.value = formatCoords(parsed.lat, parsed.lon);

  // Async resolve place name
  const placeName = await reverseGeocode(parsed.lat, parsed.lon);
  if (placeName) {
    displayValue.value = placeName;
  }
});
</script>
