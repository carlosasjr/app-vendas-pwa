<template>
  <q-page padding>
    <q-table
      grid
      title="Histórico de vendas"
      :data="sales"
      :columns="columns"
      row-key="uuid"
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
          <sale :sale="props.row" />
        </div>
      </template>
    </q-table>
  </q-page>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import Sale from "src/components/Sale.vue";

export default {
  components: { Sale },

  name: "History",
  async mounted() {
    this.load();
  },

  data() {
    return {
      filter: "",
      initialPagination: {
        sortBy: "desc",
        descending: false,
        page: 1,
        rowsPerPage: 25,
      },
      columns: [
        {
          name: "name",
          align: "center",
          field: (row) => row.client.name,
          sortable: true,
        },

        {
          name: "status",
          align: "center",
          field: (row) => row.status,
          sortable: true,
        },

        {
          name: "created_at",
          align: "center",
          field: (row) => row.created_at,
          sortable: true,
        },
      ],
    };
  },

  computed: {
    ...mapGetters(["sales", "me"]),
  },

  methods: {
    ...mapActions(["getApiSalesByCompanySeller"]),
    ...mapMutations({
      showCart: "SHOW_CART",
    }),

    async load() {
      let params = {
        company_id: this.me.company_id,
        seller_id: this.me.id,
      };

      try {
        await this.getApiSalesByCompanySeller(params);
      } catch (error) {
        this.$q.notify({
          message: "Falha ao carregar o histórico de vendas",
        });
      }
    },
  },
};
</script>


