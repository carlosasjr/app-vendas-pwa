<template>
  <q-form @submit="onSubmit" class="q-gutter-md">
    <q-select
      v-model="form.company_id"
      :options="this.localCompanies"
      label="Empresa"
      lazy-rules="ondemand"
      emit-value
      map-options
      @input="this.searchSellers"
      :rules="[(val) => !!val || 'Empresa obrigatória']"
    />

    <q-select
      v-model="form.vendedor_id"
      :options="this.localSellers"
      label="Vendedor"
      lazy-rules="ondemand"
      emit-value
      map-options
      :rules="[(val) => !!val || 'Vendedor obrigatório']"
    />
    <q-input
      type="password"
      v-model="form.password"
      label="Senha"
      lazy-rules="ondemand"
      :rules="[(val) => (val && val.length > 0) || 'Senha obrigatória']"
    />

    <div>
      <q-btn label="Login" type="submit" color="primary" />
      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn fab icon="add" color="primary" @click="goToCompany" />
      </q-page-sticky>
    </div>
  </q-form>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";

export default {
  mounted() {
    this.getLocalCompanies();
    console.log(this.$store.state.company);
  },

  data() {
    return {
      collection: "companies",
      device:
        window.navigator.appCodeName +
        window.navigator.appName +
        window.navigator.platform,

      form: {
        company_id: "",
        vendedor_id: "",
        password: "",
      },
    };
  },

  computed: {
    ...mapGetters(["localCompanies", "localSellers"]),
  },

  methods: {
    ...mapActions([
      "getLocalCompanies",
      "getApiSellersByCompany",
      "getAllLocalSellersByCompany",
      "createUpdateLocalSellers",
      "getLocalSellerById",
    ]),

    ...mapMutations({
      setMe: "SET_ME",
      setAuthenticated: "SET_AUTHENTICATED",
    }),

    goToCompany() {
      this.$router.push("/companies");
    },

    async searchSellers() {
      await this.getAllLocalSellersByCompany(this.form.company_id);

      if (this.localSellers.length == 0) {
        this.syncSellers();
      }
    },

    async syncSellers() {
      try {
        let sellers = await this.getApiSellersByCompany({
          company_id: this.form.company_id,
          device: this.device,
        });

        await this.createUpdateLocalSellers(sellers);
        await this.getAllLocalSellersByCompany(this.form.company_id);
      } catch (error) {
        this.$q.notify({
          message: "Falha ao sincronizar os vendedores",
          color: "red",
        });
      }
    },

    onSubmit() {
      this.auth();
    },

    async auth() {
      try {
        let seller = await this.getLocalSellerById(this.form.vendedor_id);

        if (seller.password == this.form.password) {
          this.setAuthenticated(true);
          this.setMe(seller);
          this.$router.push("/admin");
        } else {
          this.$q.notify({
            message: "Dados inválidos, verifique novamente",
            color: "red",
          });
        }
      } catch (Exception) {
        this.$q.notify({
          message: "Dados inválidos, verifique novamente",
          color: "red",
        });
      }
    },
  },
};
</script>

<style></style>
