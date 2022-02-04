<template>
  <div>
    <q-banner dense inline-actions class="text-white bg-red">
      <template v-slot:avatar>
        <q-icon name="feedback" color="white" />
      </template>

      <p class="text-white">{{ error[0] }}</p>

      <template v-slot:action>
        <q-btn
          flat
          color="white"
          label="x"
          @click.native="$emit('errorClose')"
        />
      </template>
    </q-banner>
    <br />
  </div>
</template>

<script>
export default {
  name: "Errors",
  props: {
    error: {
      required: true,
      type: Array | Object,
    },
  },
};
</script>

<style scoped></style>
