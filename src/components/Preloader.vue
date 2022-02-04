<template>

</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'preloader',
      'textPreloader'
    ])
  },

  watch: {
    preloader: function (val) {
      (val) ? this.$q.loading.show({
        message: this.textPreloader
      }) : this.$q.loading.hide()
    },

    textPreloader: function (val) {
      if (this.preloader) {
        (val) ? this.$q.loading.show({
          message: this.textPreloader
        }) : this.$q.loading.hide()
      }
    }
  }



}
</script>
