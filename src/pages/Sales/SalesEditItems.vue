<template>
  <q-page padding>
    <q-card class="q-mb-sm" v-for="sale in sales" :key="sale.uuid">
      <q-card-section>
        <div class="text-h6">{{ sale.client.name }}</div>
        <div class="text-subtitle2">{{ sale.created_at | formatDateBr }}</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-list dense padding class="rounded-borders">
          <q-item
            v-for="(item, index) in sale.items"
            :key="index"
            clickable
            v-ripple
          >
            <q-item-section>
              <q-item-label> {{ item.product.description }}</q-item-label>

              <q-item-label class="row">
                <q-input
                  class="col-4 q-mr-sm"
                  v-model="item.qtd"
                  label="Quant."
                />
                <q-input class="col-4" v-model="item.price" label="Valor" />
                <div class="col-3 q-ml-sm" style="margin-top: 30px">
                  <strong>R$ {{ totalItem(item) | formatPrice }}</strong>
                </div>
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <q-separator />

      <q-card-actions vertical>
        <q-btn flat @click="updateSale(sale)">Atualizar</q-btn>
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "SalesEditItems",
  async mounted() {
    let params = {
      company_id: this.me.company_id,
      seller_id: this.me.id,
    };

    let salesFinishLater = await this.getAllLocalSalesFinishLater(params);

    this.sales = salesFinishLater;
  },

  data() {
    return {
      sales: {},
    };
  },

  computed: {
    ...mapGetters(["me"]),
  },

  methods: {
    ...mapActions(["getAllLocalSalesFinishLater", "createUpdateLocalSale"]),

    totalItem(item) {
      let vltotal = item.qtd * item.price;

      item.totalItem = vltotal;

      return isNaN(item.totalItem) ? 0 : item.totalItem;
    },

    subtotal(sale) {
      let total = 0;
      sale.items.map((item) => {
        total += item.totalItem;
      });

      return total;
    },

    async updateSale(sale) {
      sale.total = this.subtotal(sale);
      await this.createUpdateLocalSale(sale);

      this.$q.notify({
        message: "Pedido atualizado com sucesso!",
        color: "positive",
      });
    },
  },
};
</script>
