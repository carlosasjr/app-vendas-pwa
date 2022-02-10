<template>
  <q-page-sticky v-if="hasCart" position="bottom-left" :offset="[18, 18]">
    <q-btn fab icon="shopping_cart" color="primary" @click="goToCheckout">
      <q-badge rounded color="red" floating>{{ cart.items.length }}</q-badge>
    </q-btn>
  </q-page-sticky>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Cart",

  data() {
    return {};
  },

  computed: {
    ...mapGetters(["me", "hasCart", "cart"]),
  },

  methods: {
    goToCheckout() {
      this.$router.push("/checkout");
    },
  },
};
</script>
