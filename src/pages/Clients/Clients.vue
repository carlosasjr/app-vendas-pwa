<template>
  <q-page padding>
    <q-table
      grid
      title="Clientes"
      :data="localClients"
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
                v-if="!hasCart"
                class="absolute"
                style="right: 3px"
                fab
                icon="shopping_cart"
                color="primary"
                @click="newSale(props.row)"
              />

              <div class="text-h9 q-mr-sm">{{ props.row.name }}</div>

              <div
                class="col-auto text-grey text-caption row no-wrap items-center"
              >
                {{ props.row.fantasy }}
              </div>

              <div
                class="col-auto text-grey text-caption row no-wrap items-center"
              >
                {{ props.row.city }} / {{ props.row.uf }}
              </div>
            </q-card-section>
          </q-card>
        </div>
      </template>
    </q-table>
    <cart />
  </q-page>
</template>

<script>
import { date } from "quasar";
import { mapActions, mapGetters, mapMutations } from "vuex";
import cart from "src/components/Cart.vue";

export default {
  name: "Clients",
  async mounted() {
    await this.getAllLocalClientsByCompany(this.me.company_id);
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
          field: (row) => row.name + " - " + row.cpf_cnpj,
          sortable: true,
        },
        {
          name: "address",
          align: "center",
          field: (row) => row.city + " /" + row.uf,
          sortable: true,
        },
      ],
    };
  },

  computed: {
    ...mapGetters(["localClients", "me", "hasCart"]),
  },

  methods: {
    ...mapActions(["getAllLocalClientsByCompany"]),
    ...mapMutations({
      startCart: "START_CART",
    }),

    newSale(row) {
      this.$q
        .dialog({
          title: "Nova Venda",
          dark: true,
          message:
            "Deseja iniciar uma nova venda para <strong>" +
            row.name +
            "</strong>",
          cancel: true,
          persistent: true,
          html: true,
        })
        .onOk(() => {
          const timeStamp = Date.now();
          const formattedString = date.formatDate(
            timeStamp,
            "YYYY-MM-DD HH:mm:ss"
          );
          this.startCart({
            company_id: this.me.company_id,
            seller_id: this.me.id,
            client_id: row.id,
            client: row,
            status: this.$SaleStatus.OPEN,
            uuid: this.$helper.uuid(),
            created_at: formattedString,
          });

          this.$router.push({ name: "products" });
        });
    },
  },

  components: {
    cart,
  },
};
</script>
