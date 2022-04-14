<template>
  <q-page padding>
    <q-card class="q-mb-sm" v-for="sale in sales" :key="sale.uuid">
      <div class="row justify-between">
        <q-card-section>
          <div class="text-h6">{{ sale.client.name }}</div>
          <div class="text-subtitle2">{{ sale.created_at | formatDateBr }}</div>
        </q-card-section>

        <q-card-section>
          <q-btn icon="add" color="primary" @click="showProduct(sale)" />
        </q-card-section>
      </div>

      <q-separator />

      <q-card-section>
        <q-list dense padding class="rounded-borders">
          <q-item
            v-for="(item, index) in sale.items"
            :key="index"
            class="q-mb-sm"
            :class="{ 'bg-red-2': item.price == '0,00' }"
          >
            <q-item-section>
              <q-item-label> {{ item.product.description }}</q-item-label>

              <q-item-label class="row">
                <q-input
                  @keydown="$event.key === '-' ? $event.preventDefault() : null"
                  class="col-4 q-mr-sm"
                  v-model="item.qtd"
                  label="Quant."
                />
                <q-input
                  v-if="visibleForm"
                  @keydown="$event.key === '-' ? $event.preventDefault() : null"
                  class="col-4"
                  v-model="item.price"
                  label="Valor"
                  v-money="moneyFormat"
                />
                <div class="col-3 q-ml-sm" style="margin-top: 30px">
                  <strong>R$ {{ totalItem(item) | formatPrice }}</strong>
                </div>
                <q-input
                  class="col-12 q-mr-sm"
                  v-model="item.observation"
                  label="Observação"
                />
              </q-item-label>
            </q-item-section>

            <q-item-section avatar>
              <q-btn
                @click="destroy(sale, item)"
                size="12px"
                flat
                dense
                round
                color="red"
                icon="delete"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <q-separator />

      <q-card-actions vertical>
        <q-btn flat @click="updateSale(sale)">Atualizar</q-btn>
      </q-card-actions>
    </q-card>

    <add-product
      :dialogProduct="dialogProduct"
      @closeDialog="closeDialog"
      @addProduct="addProduct"
      :formShow="formShow"
      @handleFormShow="handleFormShow"
    />
  </q-page>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import addProduct from "src/components/AddProduct";

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
      formShow: true,
      dialogProduct: false,
      visibleForm: true,
      sales: {},
      saleSelected: [],
      moneyFormat: {
        decimal: ",",
        thousands: ".",
        prefix: "",
        suffix: "",
        precision: 2,
        masked: false,
      },
    };
  },

  computed: {
    ...mapGetters(["me"]),
  },

  methods: {
    ...mapActions(["getAllLocalSalesFinishLater", "createUpdateLocalSale"]),

    showProduct(sale) {
      this.saleSelected = { ...sale };
      this.dialogProduct = true;
    },

    handleFormShow(status) {
      this.formShow = status;
    },

    closeDialog() {
      this.dialogProduct = false;
    },

    addProduct(item) {
      this.saleSelected.items.push(item);
    },

    destroy(sale, item) {
      this.$q
        .dialog({
          dark: true,
          title: "Confirmação",
          message:
            "Confirma Exclusão do item [" + item.product.description + "]  ?",
          persistent: true,
          ok: {
            push: true,
            color: "positive",
          },
          cancel: {
            push: true,
            color: "negative",
          },
        })
        .onOk(() => {
          try {
            sale.items = sale.items.filter(
              (i) => i.product_id != item.product_id
            );

            this.$q.notify({
              message: "Item excluído com sucesso!",
              color: "positive",
            });
          } catch (error) {
            this.$q.notify({
              message: "Falha ao excluir o item!",
              color: "negative",
            });
          }
        });
    },

    totalItem(item) {
      let vltotal =
        this.$helper.strToFloat(item.qtd) * this.$helper.strToFloat(item.price);

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

  components: {
    addProduct,
  },
};
</script>
