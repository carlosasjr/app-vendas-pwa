<template>
  <q-card>
    <q-card-section>
      <q-list class="my-card">
        <q-item clickable v-ripple @click="edit()">
          <q-item-section avatar>
            <q-icon
              name="edit"
              v-if="sale.status == $SaleStatus.FINISH_LATER"
            />
            <q-icon
              name="check"
              v-else-if="sale.status == $SaleStatus.FINISH"
            />

            <q-icon
              name="done_all"
              v-else-if="sale.status == $SaleStatus.INTEGRATED"
            />

            <q-icon
              name="playlist_add_check_circle"
              v-else-if="sale.status == $SaleStatus.PROCESSED"
            />
          </q-item-section>

          <q-item-section>
            <q-item-label lines="1">
              {{ sale.client.name }}
            </q-item-label>
            <q-item-label caption>
              {{ sale.created_at | formatDateBr }}
            </q-item-label>
            <q-item-label caption lines="1">
              {{ sale.status }}
            </q-item-label>
            <q-item-label caption lines="1" v-if="sale.code_erp !== ''">
              Erp: {{ sale.code_erp }}
            </q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-item-label>R$ {{ sale.total | formatPrice }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  name: "Sale",

  props: {
    sale: {
      type: Array | Object,
      require: true,
    },
  },

  methods: {
    ...mapMutations({
      showCart: "SHOW_CART",
    }),

    async edit() {
      await this.showCart(this.sale);
      this.goToCheckout();
    },

    goToCheckout() {
      this.$router.push("checkout");
    },
  },
};
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 290px
  margin: 0
</style>
