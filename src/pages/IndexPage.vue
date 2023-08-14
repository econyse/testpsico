<template>
  <q-page class="flex flex-center">
    <!-- <img
      alt="Quasar logo"
      src="~assets/quasar-logo-vertical.svg"
      style="width: 200px; height: 200px"
    > -->
    <img
      src="~assets/UT-Bis.png"
      alt="UT LOGO"
      :style="
        $q.screen.lt.md
          ? 'width: auto; height: 200px'
          : 'width: auto; height: 500px'
      "
    />
  </q-page>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "IndexPage",
});
</script>
