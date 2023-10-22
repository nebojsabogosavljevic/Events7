// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { VDataTable } from 'vuetify/labs/VDataTable'

// Vuetify
import { createVuetify } from 'vuetify'
import { mdiAccount } from '@mdi/js'

export default createVuetify({
  components: {
    VDataTable,
    mdiAccount,
  },
}
  // https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
)
