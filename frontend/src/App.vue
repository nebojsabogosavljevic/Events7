<template>
  <v-app>
    <v-main>
      <HeadLine>Event Manager</HeadLine>
      <MainDashboard/>
    </v-main>
  </v-app>
</template>

<script>
import HeadLine from './components/HeadLine.vue'
import MainDashboard from './components/MainDashboard.vue'

export default {
  name: 'App',

  components: {
    MainDashboard,
    HeadLine,
  },

  data: () => ({
    //
  }),
}
</script>
