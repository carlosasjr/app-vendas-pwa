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

        <q-toolbar-title>SoftPro + Vendas</q-toolbar-title>
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
      show-if-above
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
              <q-expansion-item icon="settings_suggest" label="MENU">
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

export default {
  name: "MainLayout",
  mounted() {},
  data() {
    return {
      left: false,
      device:
        window.navigator.appCodeName +
        window.navigator.appName +
        window.navigator.platform,
    };
  },
  computed: {
    ...mapGetters(["me"]),
  },
  methods: {
    ...mapMutations({
      logout: "LOGOUT",
      setPreload: "SET_PRELOADER",
      textPreload: "SET_TEXT_PRELOADER",
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
          try {
            await this.sync();
            this.$q.notify({
              message: "Sincronização concluída com sucesso!",
              color: "positive",
            });
          } catch (error) {
            this.setPreload(false);
            this.$q.notify({
              message: "Falha ao sincronziar!",
              color: "negative",
            });
          }
        });
    },
    async sync() {
      let params = {
        company_id: this.me.company_id,
        device: this.device,
      };
      this.setPreload(true);

      await this.syncSellers(params);
      await this.syncClients(params);
      await this.syncProducts(params);

      this.setPreload(false);
    },

    async syncSellers(params) {
      this.textPreload("Sincronizando Vendedores...");
      let sellers = await this.getApiSellersByCompany(params);
      await this.createUpdateLocalSellers(sellers);
      await this.getAllLocalSellersByCompany(this.me.company_id);
    },

    async syncClients(params) {
      this.textPreload("Sincronizando Clientes...");
      let clients = await this.getApiClientsByCompany(params);
      await this.createUpdateLocalClient(clients);
      await this.getAllLocalClientsByCompany(this.me.company_id);
    },

    async syncProducts(params) {
      this.textPreload("Sincronizando Produtos...");
      let products = await this.getApiProductsByCompany(params);
      await this.createUpdateLocalProduct(products);
      await this.getAllLocalProductsByCompany(this.me.company_id);
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
  background-image: url(http://theplace.com.br/assets/images/backgroup_menu.jpg) !important;
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
