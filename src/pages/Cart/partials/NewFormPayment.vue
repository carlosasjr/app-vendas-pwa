<template>
  <q-dialog v-model="dialogForms">
    <q-card style="width: 700px; max-width: 80vw">
      <q-form @submit="onSubmit">
        <q-card-section class="col q-pt-none">
          <q-select
            class="col-12"
            v-model="form.form_payment_id"
            :options="this.localFormPayments"
            label="Forma de Pagamento"
            emit-value
            map-options
            :rules="[(val) => !!val || 'Forma de Pagamento obrigatória']"
          />

          <q-select
            class="col-12"
            v-model="form.condition_payment_id"
            :options="this.localConditionPayments"
            label="Condição de Pagamento"
            emit-value
            map-options
            :rules="[(val) => !!val || 'Condição de Pagamento obrigatória']"
          />

          <q-item-section>
            <q-input
              class="col-12"
              lazy-rules
              input-class="text-right"
              v-model="form.price"
              label="Valor"
              v-money="moneyFormat"
              :rules="[(val) => val != '0,00' || 'Valor obrigatório']"
            />
          </q-item-section>
        </q-card-section>

        <q-list>
          <q-item>
            <q-item-section> </q-item-section>

            <q-item-section side>
              <q-item-label
                ><strong
                  >Saldo: R$ {{ balance | formatPrice }}</strong
                ></q-item-label
              >
            </q-item-section>
          </q-item>
        </q-list>

        <q-card-section align="right">
          <q-btn flat type="submit" color="primary" label="Adicionar" />
          <q-btn flat color="black" label="Cancelar" @click="close" />
        </q-card-section>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
export default {
  name: "NewFormPayment",

  props: {
    dialogForms: {
      required: true,
      typeof: Boolean,
      default: false,
    },

    balance: {
      require: true,
    },
  },

  async mounted() {
    await this.getAllLocalFormPaymentByCompany(this.me.company_id);
    await this.getAllLocalConditionPaymentByCompany(this.me.company_id);
  },

  data() {
    return {
      form: {
        form_payment_id: "",
        condition_payment_id: "",
        price: "",
      },
      moneyFormat: {
        decimal: ",",
        thousands: ".",
        prefix: "",
        suffix: "",
        precision: 2,
        masked: false,
      },
    };
  },

  computed: {
    ...mapGetters(["me", "localFormPayments", "localConditionPayments"]),
  },

  methods: {
    ...mapActions([
      "getAllLocalFormPaymentByCompany",
      "getAllLocalConditionPaymentByCompany",
      "getLocalFormPaymentById",
      "getLocalConditionPaymentById",
    ]),

    ...mapMutations({
      addNewForm: "ADD_FORMS_CART",
    }),

    async onSubmit() {
      try {
        let formPayment = await this.getLocalFormPaymentById(
          this.form.form_payment_id
        );

        let conditionPayment = await this.getLocalConditionPaymentById(
          this.form.condition_payment_id
        );

        this.form.price = this.$helper.strToFloat(this.form.price);

        let newForm = {
          formPayment,
          conditionPayment,
          ...this.form,
        };

        this.addNewForm(newForm);

        this.close();
      } catch (error) {
        this.$q.notify({
          message: "Falha ao incluir forma de pagamento",
          color: "red",
        });
      }
    },

    clear() {
      this.form = {
        form_payment_id: "",
        condition_payment_id: "",
        price: "",
      };
    },

    close() {
      this.clear();
      this.$emit("closeDialogForms");
    },
  },
};
</script>
