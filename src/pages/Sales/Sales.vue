<template>
  <q-page padding>
    <div class="text-center">
      <q-btn-group rounded>
        <q-btn
          rounded
          color="primary"
          icon="edit"
          @click="filterStatus($SaleStatus.FINISH_LATER)"
        />

        <q-btn
          rounded
          color="primary"
          icon="check"
          @click="filterStatus($SaleStatus.FINISH)"
        />
        <q-btn
          rounded
          color="primary"
          icon="done_all"
          @click="filterStatus($SaleStatus.INTEGRATED)"
        />
        <q-btn
          rounded
          color="primary"
          icon="playlist_add_check_circle"
          @click="filterStatus($SaleStatus.PROCESSED)"
        />

        <q-btn rounded color="primary" icon="filter_alt" @click="allStatus()" />
      </q-btn-group>
    </div>
    <q-table
      grid
      title="Vendas"
      :data="localSales"
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
          <q-card>
            <q-card-section>
              <q-list class="my-card">
                <q-item clickable v-ripple @click="edit(props.row)">
                  <q-item-section avatar>
                    <q-icon
                      name="edit"
                      v-if="props.row.status == $SaleStatus.FINISH_LATER"
                    />
                    <q-icon
                      name="check"
                      v-else-if="props.row.status == $SaleStatus.FINISH"
                    />

                    <q-icon
                      name="done_all"
                      v-else-if="props.row.status == $SaleStatus.INTEGRATED"
                    />

                    <q-icon
                      name="playlist_add_check_circle"
                      v-else-if="props.row.status == $SaleStatus.PROCESSED"
                    />
                  </q-item-section>

                  <q-item-section>
                    <q-item-label lines="1">
                      {{ props.row.client.name }}
                    </q-item-label>
                    <q-item-label caption>
                      {{ props.row.created_at | formatDateBr }}
                    </q-item-label>
                    <q-item-label caption lines="1">
                      {{ props.row.status }}
                    </q-item-label>
                    <q-item-label
                      caption
                      lines="1"
                      v-if="props.row.code_erp !== ''"
                    >
                      Erp: {{ props.row.code_erp }}
                    </q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <q-item-label
                      >R$ {{ props.row.total | formatPrice }}</q-item-label
                    >
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </div>
      </template>
    </q-table>
  </q-page>
</template>

<script>
import { date } from "quasar";
import { mapActions, mapGetters, mapMutations } from "vuex";

export default {
  name: "Sales",
  async mounted() {
    this.allStatus();
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
    ...mapGetters(["localSales", "me"]),
  },

  methods: {
    ...mapActions(["getAllLocalSalesByCompany", "getAllLocalSalesByStatus"]),
    ...mapMutations({
      showCart: "SHOW_CART",
    }),

    filterStatus(status) {
      let params = {
        company_id: this.me.company_id,
        seller_id: this.me.id,
        status,
      };
      this.getAllLocalSalesByStatus(params);
    },

    allStatus() {
      let params = {
        company_id: this.me.company_id,
        seller_id: this.me.id,
      };

      this.getAllLocalSalesByCompany(params);
    },

    async edit(sale) {
      await this.showCart(sale);
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
