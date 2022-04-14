<template>
  <q-dialog v-model="dialogProduct">
    <q-card style="width: 700px; max-width: 80vw">
      <q-card-section>
        <q-select
          v-model="item.product"
          use-input
          input-debounce="0"
          label="Produto"
          :options="products"
          @filter="getProducts"
          emit-value
          map-options
          behavior="menu"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> No results </q-item-section>
            </q-item>
          </template>
        </q-select>
      </q-card-section>

      <q-card-section class="col q-pt-none">
        <q-form @submit="onSubmit">
          <q-list class="row">
            <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input
                  input-class="text-right"
                  @keydown="$event.key === '-' ? $event.preventDefault() : null"
                  v-model="item.qtd"
                  label="Quantidade *"
                  v-money="moneyFormat"
                  lazy-rules="ondemand"
                  :rules="[
                    (val) =>
                      (val && val.length > 0 && val > '0') ||
                      'Quantidade obrigatória',
                  ]"
                />
              </q-item-section>
            </q-item>

            <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input
                  @keydown="$event.key === '-' ? $event.preventDefault() : null"
                  v-if="formShow"
                  input-class="text-right"
                  v-model="item.price"
                  label="Preço Unitário"
                  v-money="moneyFormat"
                  hint=""
                />
              </q-item-section>
            </q-item>

            <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input
                  @keydown="$event.key === '-' ? $event.preventDefault() : null"
                  :disable="porcDisable"
                  input-class="text-right"
                  v-model="item.porc"
                  label="Desconto %"
                  v-money="moneyFormat"
                />
              </q-item-section>
            </q-item>

            <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input
                  @keydown="$event.key === '-' ? $event.preventDefault() : null"
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
                <q-input
                  label="Observações"
                  autogrow
                  v-model="item.observation"
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
          </q-list>
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
import { mapActions, mapGetters } from "vuex";
export default {
  name: "addProduct",

  props: {
    dialogProduct: {
      required: true,
      typeof: Boolean,
      default: false,
    },

    productSelected: {
      required: false,
      typeof: Array | Object,
    },

    formShow: {
      required: true,
      typeof: Boolean,
      default: true,
    },
  },

  watch: {
    productSelected() {
      this.item.product = this.productSelected;
    },

    async "item.product"() {
      if (this.item.product) {
        this.$emit("handleFormShow", false);

        this.item.price = parseFloat(this.item.product.price).toFixed(2);

        await this.$helper.sleep(100);

        this.$emit("handleFormShow", true);
      }
    },
  },

  async mounted() {
    if (this.localProductSelect.length == 0) {
      await this.getAllLocalProductsByCompany(this.me.company_id);
    }

    this.products = this.localProductSelect;
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

      products: [],

      item: {
        product: "",
        qtd: "1,00",
        porc: 0,
        desc: 0,
        price: 0,
        observation: "",
      },
    };
  },

  computed: {
    ...mapGetters(["localProductSelect", "me"]),

    productData() {
      return this.products.length > 0 ? this.products : this.productSelected;
    },

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
              this.$helper.strToFloat(this.item.price) *
              this.$helper.strToFloat(this.item.porc)) /
            100;

      return desc;
    },

    total() {
      let vltotal =
        this.$helper.strToFloat(this.item.qtd) *
          this.$helper.strToFloat(this.item.price) -
        this.descReal;
      return isNaN(vltotal) ? 0 : vltotal;
    },
  },

  methods: {
    ...mapActions(["getAllLocalProductsByCompany"]),

    getProducts(val, update) {
      if (val === "") {
        update(() => {
          this.products = this.localProductSelect;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();

        this.products = this.localProductSelect.filter(
          (v) => v.label.toLowerCase().indexOf(needle) > -1
        );
      });
    },

    clear() {
      this.item = {
        qtd: "1,00",
        porc: 0,
        desc: 0,
        price: 0,
        observation: "",
      };
    },

    close() {
      this.clear();
      this.$emit("closeDialog");
    },

    onSubmit() {
      let item = {
        product_id: this.item.product.id,
        product: this.item.product,
        price: this.item.price,
        qtd: this.item.qtd,
        porc: this.item.porc,
        desc: this.item.desc,
        descReal: this.descReal,
        totalItem: this.total,
        observation: this.item.observation,
      };

      console.log(item);

      this.$emit("addProduct", item);

      this.close();
    },
  },
};
</script>
