<template>
  <q-page padding>
    <q-table
      grid
      title="Produtos"
      :data="localProducts"
      :columns="columns"
      row-key="id"
      :filter="filter"
      hide-header
      :pagination.sync="initialPagination"
    >
      <template v-slot:top-right>
        <q-input
          borderless
          dense
          debounce="300"
          v-model="filter"
          placeholder="Pesquisar"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <template v-slot:item="props">
        <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
          <q-card>
            <q-card-section>
              <q-btn
                v-if="hasCart"
                class="absolute"
                style="right: 3px"
                fab
                icon="add_shopping_cart"
                color="primary"
                @click="addProduct(props.row)"
              />

              <div class="text-h9 q-mr-sm">{{ props.row.description }}</div>

              <div
                class="col-auto text-grey text-caption row no-wrap items-center"
              >
                Preço: {{ props.row.price | formatPrice }}
              </div>

              <div
                class="col-auto text-grey text-caption row no-wrap items-center"
              >
                Estoque: {{ props.row.stock }}
              </div>
            </q-card-section>
          </q-card>
        </div>
      </template>
    </q-table>

    <form-product
      :dialogProduct="dialogProduct"
      :productSelected="productSelected"
      :formShow="formShow"
      @closeDialog="closeDialog"
    />
    <cart />
  </q-page>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import formProduct from "./partials/FormProduct";
import cart from "src/components/Cart.vue";

export default {
  name: "Products",
  async mounted() {
    await this.getAllLocalProductsByCompany(this.me.company_id);
  },

  data() {
    return {
      formShow: true,
      filter: "",
      dialogProduct: false,
      productSelected: [],
      initialPagination: {
        sortBy: "desc",
        descending: false,
        page: 1,
        rowsPerPage: 25,
      },
      columns: [
        {
          name: "description",
          align: "center",
          field: "description",
          sortable: true,
        },
        {
          name: "price",
          align: "center",
          field: "price",
          sortable: true,
        },
      ],
    };
  },

  computed: {
    ...mapGetters(["localProducts", "me", "hasCart"]),
  },

  methods: {
    ...mapActions(["getAllLocalProductsByCompany"]),

    addProduct(row) {
      this.formShow = false;
      this.dialogProduct = true;
      this.productSelected = row;
      this.formShow = true;
    },

    closeDialog() {
      this.dialogProduct = false;
    },
  },

  components: {
    formProduct,
    cart,
  },
};
</script>
