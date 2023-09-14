<template>
  <div class="w-full">
    <section class="w-full pb-24"></section>

    <section
      class="max-w-screen-xl mx-2 sm:mx-auto px-4 sm:px-6 lg:px-0 py-6 pb-20 sm:py-8 rounded-[2.25rem] sm:rounded-xl bg-white shadow-lg sm:shadow-md transform lg:-translate-y-12"
      :style="{ display: 'flex' }"
    >
      <div :style="{ 'width': '700px' }">
        <v-app class="m-4">
          <template>
            <v-carousel hide-delimiters>
              <v-carousel-item
                v-for="(item, i) in items"
                :key="i"
                :src="item.src"
                eager
              ></v-carousel-item>
            </v-carousel>
          </template>
        </v-app>
      </div>
      <div class="p-8">
        <a href="#">
          <h5 class="text-xl font-semibold tracking-tight">Cím</h5>
        </a>
        <div>
          <p>Vállalkozás neve</p>
        </div>
        <div>
          <p>Beváltóhely</p>
        </div>
        <div>
          <p>Kategória</p>
        </div>
        <div>
          <p>részletek</p>
        </div>
        <div>
          <p>tagek</p>
        </div>
        <div>
          <p>mennyiség</p>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-3xl font-bold">$599</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      product: [],
      items: [
        {
          src: require("~/assets/img/7446783_3661698.png"),
        },
        {
          src: require("~/assets/img/11235588_10814.jpg"),
        },
        {
          src: require("~/assets/img/eco-system-5019188-4196246.png"),
        },
        {
          src: require("~/assets/img/save-planet-8429926-6723330.png"),
        },
      ],
    };
  },
  asyncData({ query }) {
    const productId = parseInt(query.id);
    const product = [
      {
        id: productId,
      },
    ];
    return { product };
  },
  mounted() {
    console.log(this.product);
  },
};
export const head = {
  link: [{}],
};
</script>

<style scoped>
</style>