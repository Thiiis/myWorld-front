<template>
  <div class="d-flex justify-content-center gap-2">
    <div v-for="(color, i) in colors" :key="i"
      class="rounded-circle border"
      style="width:50px; height:50px;"
      :style="{ backgroundColor: color }">
    </div>
  </div>
</template>

<script>
export default {
  name: 'ThemePreview',
  props: { theme: String, colors: Array }
};
</script>
