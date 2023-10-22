<template>
  <v-app>
    <v-main>
      <HeadLine/>
      <MainDashboard/>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import HeadLine from './components/HeadLine.vue'
import MainDashboard from './components/MainDashboard.vue'

export default defineComponent({
  name: 'App',

  components: {
    HeadLine,
    MainDashboard,
  },

  data () {
    return {
      //
    }
  },
})
</script>
