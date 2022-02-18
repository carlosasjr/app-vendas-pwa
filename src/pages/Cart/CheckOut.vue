<template>
  <q-page>
    <q-card class="my-card">
      <q-card-section>
        <div class="row no-wrap items-center">
          <div class="col text-h6 ellipsis">{{ cart.client.name }}</div>
          <div
            class="col-auto text-grey text-caption q-pt-md row no-wrap items-center"
          >
            <q-icon name="people" />
          </div>
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="text-subtitle1">Pedido de Venda</div>
        <div class="text-caption text-grey">
          {{ cart.status }} - {{ cart.created_at | formatDateBr }}
        </div>
        <div class="text-caption text-grey">
          {{ cart.uuid }}
        </div>
      </q-card-section>

      <q-separator />

      <div class="q-pa-md">
        <q-list>
          <q-item
            v-for="(item, index) in cart.items"
            :key="index"
            clickable
            v-ripple
          >
            <q-item-section avatar v-if="statusOpen">
              <q-btn
                @click="destroyItem(item)"
                size="12px"
                flat
                dense
                round
                color="red"
                icon="delete"
              />
            </q-item-section>

            <q-item-section>
              <q-item-label> {{ item.product.description }}</q-item-label>
              <q-item-label caption lines="1"
                >{{ item.qtd }} X {{ item.price }}</q-item-label
              >
              <q-item-label v-if="item.descReal != ''" caption lines="1"
                >Desc. R${{ item.descReal | formatPrice }}</q-item-label
              >
            </q-item-section>

            <q-item-section side>
              <q-item-label>R$ {{ item.totalItem | formatPrice }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>

      <q-separator />

      <div class="q-pa-md">
        <q-list>
          <q-item>
            <q-item-section>
              <q-item-label><strong> Total</strong></q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-item-label
                ><strong> R$ {{ subtotal | formatPrice }}</strong></q-item-label
              >
            </q-item-section>
          </q-item>
        </q-list>
      </div>

      <q-separator />

      <div class="q-pa-md">
        <q-card-section class="q-pt-none">
          <div class="text-subtitle1">Formas de Pagamento</div>
        </q-card-section>

        <q-list>
          <q-item
            v-for="(item, index) in cart.payments"
            :key="index"
            clickable
            v-ripple
          >
            <q-item-section avatar v-if="statusOpen">
              <q-btn
                @click="destroyForm(item)"
                size="12px"
                flat
                dense
                round
                color="red"
                icon="delete"
              />
            </q-item-section>

            <q-item-section>
              <q-item-label lines="1">
                {{ item.formPayment.description }}
              </q-item-label>
              <q-item-label caption lines="1">{{
                item.conditionPayment.description
              }}</q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-item-label>R$ {{ item.price }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>

        <q-list>
          <q-item>
            <q-item-section>
              <q-item-label><strong> Total Formas</strong></q-item-label>
              <q-item-label>Restante</q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-item-label
                ><strong>
                  R$ {{ totalFormas | formatPrice }}</strong
                ></q-item-label
              >
              <q-item-label>R$ {{ balance | formatPrice }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>

      <q-separator />

      <q-btn
        v-if="this.balance != '0'"
        @click="newForm"
        color="green"
        class="q-mb-sm full-width"
        label="Novo Forma de Pagamento"
      />
    </q-card>

    <q-btn
      v-if="statusOpen"
      color="black"
      class="q-mb-sm full-width"
      label="Finalizar Mais Tarde"
      @click="finishLater"
    />
    <q-btn
      v-if="statusOpen"
      color="red"
      class="q-mb-sm full-width"
      label="Excluir Pedido"
      @click="destroyCart"
    />
    <q-btn
      v-if="statusOpen && this.balance == 0"
      color="blue"
      class="q-mb-sm full-width"
      label="Finalizar"
      @click="finish"
    />

    <q-btn
      v-if="!statusOpen"
      color="blue"
      class="q-mb-sm full-width"
      label="Voltar"
      @click="gotoSales"
    />

    <dialog-form
      :balance="balance"
      :dialogForms="dialogForms"
      :formShow="formShow"
      @closeDialogForms="closeDialogForms"
    />
  </q-page>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import dialogForm from "./partials/NewFormPayment.vue";

export default {
  name: "Checkout",
  data() {
    return {
      dialogForms: false,
      formShow: true,
    };
  },

  computed: {
    ...mapGetters(["me", "cart"]),

    statusOpen() {
      return (
        this.cart.status == this.$SaleStatus.OPEN ||
        this.cart.status == this.$SaleStatus.FINISH_LATER
      );
    },

    subtotal() {
      let total = 0;
      this.cart.items.map((item) => {
        total += item.totalItem;
      });

      return total;
    },

    totalFormas() {
      let total = 0;
      this.cart.payments.map((item) => {
        total += this.$helper.strToFloat(item.price);
      });

      return total;
    },

    balance() {
      return this.subtotal - this.totalFormas;
    },
  },

  methods: {
    ...mapActions(["createUpdateLocalSale", "deleteLocalSale"]),

    ...mapMutations({
      removeItemCart: "REMOVE_PRODUCT_CART",
      removeFormCart: "REMOVE_FORM_CART",
      clearCart: "CLEAR_CART",
    }),

    closeDialogForms() {
      this.dialogForms = false;
    },

    newForm() {
      this.formShow = false;
      this.dialogForms = true;
      this.formShow = true;
    },

    destroyItem(item) {
      this.$q
        .dialog({
          dark: true,
          title: "Confirmação",
          message:
            "Confirma Exclusão do item [" + item.product.description + "]  ?",
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
        .onOk(() => {
          try {
            this.removeItemCart(item);

            this.$q.notify({
              message: "Item excluído com sucesso!",
              color: "positive",
            });
          } catch (error) {
            this.$q.notify({
              message: "Falha ao excluir o item!",
              color: "negative",
            });
          }
        });
    },

    destroyForm(item) {
      this.$q
        .dialog({
          dark: true,
          title: "Confirmação",
          message:
            "Confirma Exclusão da Forma de Pagamento [" +
            item.formPayment.description +
            "]  ?",
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
        .onOk(() => {
          try {
            this.removeFormCart(item);

            this.$q.notify({
              message: "Forma de Pagamento excluída com sucesso!",
              color: "positive",
            });
          } catch (error) {
            this.$q.notify({
              message: "Falha ao excluir a Forma de Pagamento!",
              color: "negative",
            });
          }
        });
    },

    destroyCart(item) {
      this.$q
        .dialog({
          dark: true,
          title: "Atenção! Este processo é inrreversível!",
          message: "Confirma a exclusão do pedido ?",
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
        .onOk(() => {
          try {
            if (this.cart.status == this.$SaleStatus.OPEN) {
              this.clearCart();
            } else if (this.cart.status == this.$SaleStatus.FINISH_LATER) {
              this.deleteLocalSale(this.cart.uuid);
            }

            this.gotoSales();

            this.$q.notify({
              message: "Pedido excluído com sucesso!",
              color: "positive",
            });
          } catch (error) {
            this.$q.notify({
              message: "Falha ao excluir o pedido!",
              color: "negative",
            });
          }
        });
    },

    finishLater() {
      this.$q
        .dialog({
          dark: true,
          title: "Confirmação",
          message: "Finalizar a venda mais tarde?",
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
        .onOk(() => {
          try {
            let newSale = { ...this.cart };

            newSale.status = this.$SaleStatus.FINISH_LATER;
            newSale.total = this.subtotal;
            newSale.totalFormas = this.totalFormas;

            this.createUpdateLocalSale(newSale);
            this.clearCart();

            this.gotoSales();

            this.$q.notify({
              message: "Pedido salvo com sucesso!",
              color: "positive",
            });
          } catch (error) {
            this.$q.notify({
              message: "Falha ao salvar a venda!",
              color: "negative",
            });
          }
        });
    },

    finish() {
      this.$q
        .dialog({
          dark: true,
          title: "Confirmação",
          message: "Finalizar a venda?",
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
        .onOk(() => {
          try {
            let newSale = { ...this.cart };

            newSale.status = this.$SaleStatus.FINISH;
            newSale.total = this.subtotal;
            newSale.totalFormas = this.totalFormas;

            this.createUpdateLocalSale(newSale);
            this.clearCart();

            this.gotoSales();

            this.$q.notify({
              message: "Pedido finalizado com sucesso!",
              color: "positive",
            });
          } catch (error) {
            this.$q.notify({
              message: "Falha ao finalizar a venda!",
              color: "negative",
            });
          }
        });
    },

    gotoSales() {
      this.$router.push("/sales");
    },
  },

  components: {
    dialogForm,
  },
};
</script>
