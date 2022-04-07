<template>
  <q-layout view="lHh LpR lFf">
    <preloader />
    <q-header reveal class="bg-system">
      <q-toolbar>
        <q-btn
          @click="left = !left"
          flat
          round
          dense
          icon="menu"
          class="q-mr-sm"
        />

        <q-toolbar-title @click="goToIndex">SoftPro + Vendas</q-toolbar-title>
        <q-btn @click="btnSync" flat round dense icon="sync" class="q-mr-xs">
          <q-tooltip content-class="bg-indigo"> Sincronizar </q-tooltip>
        </q-btn>
        <q-btn flat round dense icon="circle_notifications" class="q-mr-xs" />
        <q-btn flat round dense icon="fas fa-sign-out-alt" @click="exit">
          <q-tooltip content-class="bg-indigo"> Logout </q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      class="left-navigation text-white"
      v-model="left"
      style="
        background-image: url(https://demos.creative-tim.com/vue-material-dashboard/img/sidebar-2.32103624.jpg) !important;
      "
      side="left"
      elevated
    >
      <div
        class="full-height"
        :class="$q.dark.isActive ? 'drawer_dark' : 'drawer_normal'"
      >
        <div style="height: calc(100% - 117px); padding: 10px">
          <q-item>
            <q-toolbar>
              <q-avatar>
                <!-- IMAGE USER -->
                <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
              </q-avatar>
              <q-toolbar-title class="text-white">{{
                me.name
              }}</q-toolbar-title>
            </q-toolbar>
          </q-item>
          <hr />
          <q-scroll-area style="height: 100%">
            <q-list padding>
              <!--SISTEMA -->
              <q-expansion-item icon="menu" label="MENU">
                <!--CLIENTS-->
                <q-item
                  dense
                  active-class="bg-system"
                  to="/clients"
                  exact
                  class="q-ma-sm navigation-item"
                  clickable
                  v-ripple
                >
                  <q-item-section avatar>
                    <q-icon name="people" />
                  </q-item-section>

                  <q-item-section>Clientes</q-item-section>
                </q-item>

                <!--PRODUCTS-->
                <q-item
                  dense
                  active-class="bg-system"
                  to="/products"
                  exact
                  class="q-ma-sm navigation-item"
                  clickable
                  v-ripple
                >
                  <q-item-section avatar>
                    <q-icon name="category" />
                  </q-item-section>

                  <q-item-section>Produtos</q-item-section>
                </q-item>

                <!--SALES-->
                <q-item
                  dense
                  active-class="bg-system"
                  to="/sales"
                  exact
                  class="q-ma-sm navigation-item"
                  clickable
                  v-ripple
                >
                  <q-item-section avatar>
                    <q-icon name="shopping_cart" />
                  </q-item-section>

                  <q-item-section>Vendas</q-item-section>
                </q-item>

                <q-item
                  dense
                  active-class="bg-system"
                  to="/sales/items"
                  exact
                  class="q-ma-sm navigation-item"
                  clickable
                  v-ripple
                >
                  <q-item-section avatar>
                    <q-icon name="checklist" />
                  </q-item-section>

                  <q-item-section>Itens</q-item-section>
                </q-item>
              </q-expansion-item>
              <!-- FIM SISTEMA -->
            </q-list>
          </q-scroll-area>
        </div>
      </div>
    </q-drawer>

    <q-page-container>
      <q-page class="row no-wrap">
        <div class="col">
          <div class="full-height">
            <q-scroll-area class="col q-pr-sm full-height" visible>
              <router-view />
            </q-scroll-area>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from "vuex";
import Preloader from "src/components/Preloader.vue";
import { api } from "src/boot/axios";

export default {
  name: "MainLayout",
  async mounted() {
    let device = await this.$db.collection("device").get();
    this.device = device[0].device;

    setInterval(async () => {
      const online = await this.checkOnlineStatus();

      if (online) {
        await this.sync();
      }
    }, 60000);
  },

  data() {
    return {
      synchronizing: false,
      left: false,
      spinner: false,
      message: "",
      device: "",
    };
  },
  computed: {
    ...mapGetters(["me", "localSales"]),

    messageSpinner() {
      return this.message;
    },
  },

  methods: {
    ...mapMutations({
      logout: "LOGOUT",
      setPreload: "SET_PRELOADER",
      textPreload: "SET_TEXT_PRELOADER",
      updateStatusIntegrated: "UPDATE_STATUS_SALE_INTEGRATED",
      updateStatusProcessed: "UPDATE_STATUS_SALE_PROCESSED",
    }),
    ...mapActions([
      "getApiSellersByCompany",
      "createUpdateLocalSellers",
      "getAllLocalSellersByCompany",

      "getApiClientsByCompany",
      "createUpdateLocalClient",
      "getAllLocalClientsByCompany",

      "getApiProductsByCompany",
      "createUpdateLocalProduct",
      "getAllLocalProductsByCompany",

      "getApiFormPaymentByCompany",
      "createUpdateLocalFormPayment",
      "getAllLocalFormPaymentByCompany",

      "getApiConditionPaymentByCompany",
      "createUpdateLocalConditionPayment",
      "getAllLocalConditionPaymentByCompany",

      "getAllLocalSalesFinish",
      "createApiSale",
      "updateLocalSaleIntegrated",
      "updateLocalSaleProcessed",
      "getApiAllProcessedByCompany",

      "updateApiDeviceSync",
    ]),
    btnSync() {
      this.$q
        .dialog({
          dark: true,
          title: "Confirmação",
          message: "Confirma Sincronização?",
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
        .onOk(async () => {
          await this.sync();
        });
    },

    async sync() {
      try {
        this.spinner = true;
        let params = {
          company_id: this.me.company_id,
          device: this.device,
          seller_id: this.me.id,
        };

        this.loadSpinner();

        await this.syncSellers(params);
        await this.syncClients(params);
        await this.syncProducts(params);
        await this.syncFormPayments(params);
        await this.syncConditionPayments(params);
        await this.syncLocalSales(params);
        await this.syncSalesProcessed(params);
        await this.updateApiDeviceSync(params);
      } catch (error) {
        //this.$q.notify({
        // message: "Falha ao sincronziar!",
        //  color: "negative",
        // });
      } finally {
        this.spinner = false;
      }
    },

    async syncSellers(params) {
      let sellers = await this.getApiSellersByCompany(params);
      if (sellers.length > 0) {
        this.message = "Sincronizando Vendedores...";
        await this.createUpdateLocalSellers(sellers);
        await this.getAllLocalSellersByCompany(this.me.company_id);
      }
    },

    async syncClients(params) {
      let clients = await this.getApiClientsByCompany(params);
      if (clients.length > 0) {
        this.message = "Sincronizando Clientes...";
        await this.createUpdateLocalClient(clients);
        await this.getAllLocalClientsByCompany(this.me.company_id);
      }
    },

    async syncProducts(params) {
      let products = await this.getApiProductsByCompany(params);
      if (products.length > 0) {
        this.message = "Sincronizando Produtos...";
        await this.createUpdateLocalProduct(products);
        await this.getAllLocalProductsByCompany(this.me.company_id);
      }
    },

    async syncFormPayments(params) {
      let formPayments = await this.getApiFormPaymentByCompany(params);
      if (formPayments.length > 0) {
        this.message = "Sincronizando Formas de Pagamento...";
        await this.createUpdateLocalFormPayment(formPayments);
        await this.getAllLocalFormPaymentByCompany(this.me.company_id);
      }
    },

    async syncConditionPayments(params) {
      let conditionPayments = await this.getApiConditionPaymentByCompany(
        params
      );

      if (conditionPayments.length > 0) {
        this.message = "Sincronizando Condições de Pagamento...";
        await this.createUpdateLocalConditionPayment(conditionPayments);
        await this.getAllLocalConditionPaymentByCompany(this.me.company_id);
      }
    },

    async syncLocalSales(params) {
      params.status = this.$SaleStatus.FINISH;
      let sales = await this.getAllLocalSalesFinish(params);

      if (sales.length > 0) {
        this.message = "Sincronizando Vendas...";
        Promise.all(
          sales.map(async (sale) => {
            await this.createApiSale(sale);
            await this.updateLocalSaleIntegrated(sale.uuid);
            this.updateStatusIntegrated(sale.uuid);
          })
        );
      }
    },

    async syncSalesProcessed(params) {
      let sales = await this.getApiAllProcessedByCompany(params);

      if (sales.length > 0) {
        this.message = "Sincronizando Vendas Processadas...";

        Promise.all(
          sales.map(async (sale) => {
            await this.updateLocalSaleProcessed(sale);
            this.updateStatusProcessed(sale);
          })
        );
      }
    },

    loadSpinner() {
      this.synchronizing = true;
      const notif = this.$q.notify({
        group: false,
        timeout: 0,
        spinner: this.spinner,
        message: "",
      });

      const interval = setInterval(() => {
        notif({
          message: this.message,
        });

        if (!this.spinner) {
          this.synchronizing = false;
          notif({
            icon: "done",
            spinner: false,
            message: "Sincronização concluída",
            timeout: 600,
          });

          clearInterval(interval);
        }
      }, 500);
    },

    async checkOnlineStatus() {
      try {
        const online = await api("/ok");
        return (
          online.status >= 200 && online.status < 300 && !this.synchronizing
        );
      } catch (err) {
        return false;
      }
    },

    goToIndex() {
      this.$router.push("/admin");
    },

    exit() {
      try {
        this.logout();
        this.$router.push({ name: "login" });
        this.$q.notify({
          message: "Logout realizado com sucesso!",
        });
      } catch (error) {
        this.$q.notify({
          message: "Falha ao realizar o logout!",
        });
      }
    },
  },
  components: { Preloader },
};
</script>

<style>
.q-drawer {
  background-image: url("../assets/images/backgroup_menu.jpg") !important;
  background-size: cover !important;
}

.drawer_normal {
  background-color: rgba(1, 1, 1, 0.75);
}

.drawer_dark {
  background-color: #010101f2;
}

.navigation-item {
  border-radius: 5px;
}

body {
  background: #f1f1f1 !important;
}

.header_normal {
  background: linear-gradient(145deg, rgb(237, 0, 0) 15%, rgb(86, 31, 42) 70%);
}

.header_dark {
  background: linear-gradient(145deg, rgb(61, 14, 42) 15%, rgb(14, 43, 78) 70%);
}
</style>
