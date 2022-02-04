<template>
  <q-layout>
    <preloader />
    <q-page-container>
      <q-page class="flex flex-center">
        <div id="particles-js" class="bg_fundo"></div>
        <q-card
          class="login-form"
          v-bind:style="
            $q.platform.is.mobile ? { width: '80%' } : { width: '30%' }
          "
        >
          <q-card-section>
            <div class="text-center">
              <img
                src="~assets/images/logo_mais_vendas.png"
                style="width: 180px; height: 100px"
              />
            </div>
          </q-card-section>
          <q-card-section>
            <router-view></router-view>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {};
</script>

<style>
#particles-js {
  position: absolute;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50% 50%;
}

.bg_fundo {
  background-image: url("../assets/images/fundo.jpeg");
  background-repeat: no-repeat;
  background-size: contain;
}

.login-form {
  position: absolute;
  opacity: 0.7;
}
</style>
