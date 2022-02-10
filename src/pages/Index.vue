<template>
  <q-page class="flex flex-center">
    <img
      alt="Quasar logo"
      src="~assets/quasar-logo-vertical.svg"
      style="width: 200px; height: 200px"
    />
    <cart />
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-fab color="purple" direction="up">
        <template v-slot:icon="{ opened }">
          <q-icon
            :class="{ 'example-fab-animate--hover': opened !== true }"
            name="keyboard_arrow_up"
          />
        </template>

        <template v-slot:active-icon="{ opened }">
          <q-icon
            :class="{ 'example-fab-animate': opened === true }"
            name="close"
          />
        </template>

        <q-fab-action
          color="secondary"
          external-label
          icon="shopping_cart"
          to="/sales"
        />

        <q-fab-action
          color="secondary"
          external-label
          icon="category"
          to="/products"
        />

        <q-fab-action
          color="secondary"
          external-label
          icon="people"
          to="/clients"
        />
      </q-fab>
    </q-page-sticky>
  </q-page>
</template>

<script>
import cart from "src/components/Cart.vue";
export default {
  name: "PageIndex",

  components: {
    cart,
  },
};
</script>
