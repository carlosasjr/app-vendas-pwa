<template>
  <q-card-section>
    <q-form @submit="onSubmit">
      <q-list class="row">
        <errors
          class="col-12"
          v-for="(error, index) in errors"
          :key="index"
          :error="error"
          @errorClose="errorClose(index)"
        />

        <q-item class="col-12">
          <q-item-section>
            <q-input
              v-model="company.cnpj"
              label="CNPJ *"
              mask="##.###.###/####-##"
              lazy-rules="ondemand"
              :rules="[(val) => (val && val.length > 0) || 'CNPJ obrigatório']"
            />
          </q-item-section>
        </q-item>

        <q-item class="col-12">
          <q-item-section>
            <q-input
              disable
              v-model="company.device"
              label="Dispositivo *"
              lazy-rules="ondemand"
              :rules="[
                (val) =>
                  (val && val.length > 0) || 'Nome do dispositivo obrigatório',
              ]"
            />
          </q-item-section>
        </q-item>
      </q-list>

      <q-card-actions align="right">
        <q-btn
          label="Adicionar"
          type="submit"
          color="primary"
          class="float-right"
        />
        <q-btn
          :to="{ name: 'login' }"
          label="Voltar"
          type="back"
          color="default"
          class="float-right text-grey-10 q-mr-md"
        />
      </q-card-actions>
    </q-form>
  </q-card-section>
</template>

<script>
import Errors from "components/Errors.vue";
import { mapActions } from "vuex";

const BLOCK = 1;
const LICENSE_EXCEEDED = 0;

export default {
  name: "FormCompany",

  mounted() {
    this.company.device =
      window.navigator.appCodeName +
      window.navigator.appName +
      window.navigator.platform;
  },

  data() {
    return {
      errors: {},
      collection: "companies",
      company: {
        cnpj: "",
        device: "",
      },
    };
  },

  methods: {
    ...mapActions(["getApiCompanyByCnpj", "createApiDevice"]),

    async onSubmit() {
      try {
        let params = { ...this.company };

        let company = await this.getApiCompanyByCnpj(params);

        if (company.block == BLOCK) {
          this.$q.notify({
            message:
              "Empresa bloqueada para cadastro! Entre em contato com o administrador!",
            color: "negative",
          });
          return;
        }

        if (company.licenseAvailable == LICENSE_EXCEEDED) {
          this.$q.notify({
            message:
              "Número de licensas excedido! Entre em contato com o administrador!",
            color: "negative",
          });
          return;
        }

        await this.addCompany(company);
      } catch (error) {
        this.errors = error;
        this.$q.notify({
          message:
            "Empresa não encontrada! Entre em contato com o administrador!",
          color: "negative",
        });
      }
    },

    async addCompany(company) {
      try {
        let companyExist = await this.companyExists(company);

        if (!companyExist) {
          let params = {
            company_id: company.id,
            name: this.company.device,
          };

          await this.createApiDevice(params);

          await this.$db.collection(this.collection).add(company);

          this.$q.notify({
            message: "Empresa adicionada com sucesso!",
            color: "positive",
            icon: "check",
          });

          this.$router.push("/");

          return;
        }

        this.$q.notify({
          message: "Empresa já cadastrada!",
          color: "negative",
        });
      } catch (error) {
        this.errors = error;
        this.$q.notify({
          message: "Falha ao criar a empresa!",
          color: "negative",
        });
      }
    },

    async companyExists(company) {
      let result = await this.$db
        .collection(this.collection)
        .doc({ cnpj: company.cnpj })
        .get();

      return result !== undefined;
    },

    errorClose(index) {
      const errors = { ...this.errors };
      delete errors[index];
      this.errors = { ...errors };
    },
  },

  components: {
    Errors,
  },
};
</script>
