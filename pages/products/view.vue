<template>

    <div class="w-full">
      <section class="w-full pb-24"></section>
      <section
        class="max-w-screen-xl mx-2 sm:mx-auto px-4 sm:px-6 lg:px-0 py-6 pb-20 sm:py-8 rounded-[2.25rem] sm:rounded-xl bg-white shadow-lg sm:shadow-md transform lg:-translate-y-12"
        :style="{ 'display': 'flex' }"
      >
      <v-app class="m-4">
        <div :style="{ 'max-width': '700px' }">
          <v-carousel hide-delimiters>
            <v-carousel-item
              v-for="(item, i) in items"
              :key="i"
              :src="item.src"
            ></v-carousel-item>
          </v-carousel>
        </div>
      </v-app>
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
          src: "https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg",
        },
        {
          src: "https://cdn.vuetifyjs.com/images/carousel/sky.jpg",
        },
        {
          src: "https://cdn.vuetifyjs.com/images/carousel/bird.jpg",
        },
        {
          src: "https://cdn.vuetifyjs.com/images/carousel/planet.jpg",
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