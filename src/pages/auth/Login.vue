<template>
  <q-form @submit="onSubmit" class="q-gutter-md">
    <q-select
      v-model="form.company_id"
      :options="this.localCompanies"
      label="Empresa"
      lazy-rules="ondemand"
      emit-value
      map-options
      :rules="[(val) => !!val || 'Empresa obrigatória']"
    />

    <q-select
      v-model="form.vendedor_id"
      :options="vendedores"
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
  },

  data() {
    return {
      collection: "companies",
      form: {
        company_id: "",
        vendedor_id: "",
        password: "",
      },
      vendedores: [],
    };
  },

  computed: {
    ...mapGetters(["localCompanies"]),
  },

  methods: {
    ...mapActions(["getLocalCompanies"]),

    goToCompany() {
      this.$router.push("/companies");
    },

    onSubmit() {
      this.auth();
    },

    async auth() {
      const params = {
        device_name: this.deviceName,
        ...this.form,
      };

      try {
        try {
        } catch (Exception) {
          this.$q.notify({
            message: "Dados inválidos, verifique novamente",
            color: "red",
          });
        }
      } finally {
      }
    },
  },
};
</script>

<style></style>
