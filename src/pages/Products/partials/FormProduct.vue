<template>
  <q-dialog v-model="dialogProduct">
    <q-card style="width: 700px; max-width: 80vw">
      <q-card-section>
        <div class="text-h6">
          <strong>Produto: {{ productSelected.description }}</strong>
          {{ productSelected.price }}
        </div>
      </q-card-section>

      <q-card-section class="col q-pt-none">
        <q-form @submit="onSubmit">
          <q-item class="col-12">
            <q-item-section>
              <q-input
                input-class="text-right"
                type="number"
                v-model="item.qtd"
                label="Quantidade *"
                lazy-rules="ondemand"
                :rules="[
                  (val) => (val && val.length > 0) || 'Quantidade obrigatória',
                ]"
              />
            </q-item-section>
          </q-item>

          <q-item class="col-12">
            <q-item-section>
              <q-input
                :disable="porcDisable"
                input-class="text-right"
                v-model="item.porc"
                label="Desconto %"
                v-money="moneyFormat"
              />
            </q-item-section>
          </q-item>

          <q-item class="col-12">
            <q-item-section>
              <q-input
                :disable="descDisable"
                input-class="text-right"
                v-model="item.desc"
                label="Desconto R$"
                v-money="moneyFormat"
              />
            </q-item-section>
          </q-item>

          <q-item class="col-12">
            <q-item-section>
              <strong class="text-right"
                >Total: {{ this.total | formatPrice }}</strong
              >
            </q-item-section>
          </q-item>
        </q-form>
      </q-card-section>

      <q-card-section align="right">
        <q-btn flat color="primary" label="Adicionar" @click="onSubmit" />
        <q-btn flat color="black" label="Cancelar" @click="close" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  name: "FormProduct",

  props: {
    dialogProduct: {
      required: true,
      typeof: Boolean,
      default: false,
    },
    productSelected: {
      required: true,
      typeof: Array | Object,
    },

    formShow: {
      required: false,
      default: true,
      type: Boolean,
    },
  },

  data() {
    return {
      moneyFormat: {
        decimal: ",",
        thousands: ".",
        prefix: "",
        suffix: "",
        precision: 2,
        masked: false,
      },
      item: {
        qtd: 1,
        porc: 0,
        desc: 0,
      },
    };
  },

  computed: {
    porcDisable() {
      return this.item.desc != "0,00";
    },

    descDisable() {
      return this.item.porc != "0,00";
    },

    descReal() {
      let desc =
        this.$helper.strToFloat(this.item.desc) > 0
          ? this.$helper.strToFloat(this.item.desc)
          : (this.$helper.strToFloat(this.item.qtd) *
              this.$helper.strToFloat(this.productSelected.price) *
              this.$helper.strToFloat(this.item.porc)) /
            100;

      return this.$helper.strToFloat(desc).toFixed(2);
    },

    total() {
      let vltotal =
        this.$helper.strToFloat(this.item.qtd) *
          this.$helper.strToFloat(this.productSelected.price) -
        this.descReal;

      return isNaN(vltotal) ? 0 : this.$helper.strToFloat(vltotal).toFixed(2);
    },
  },

  methods: {
    ...mapMutations({
      addCart: "ADD_ITEMS_CART",
    }),

    clear() {
      this.item = {
        qtd: 1,
        porc: 0,
        desc: 0,
      };
    },

    close() {
      this.clear();
      this.$emit("closeDialog");
    },

    onSubmit() {
      let item = {
        product_id: this.productSelected.id,
        product: this.productSelected,
        price: this.productSelected.price,
        qtd: this.item.qtd,
        porc: this.item.porc,
        desc: this.item.desc,
        descReal: this.descReal,
        totalItem: this.total,
      };
      this.addCart(item);

      this.close();
    },
  },
};
</script>
