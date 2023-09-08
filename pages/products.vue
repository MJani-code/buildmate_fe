<template>
  <div class="w-full">
    <ResponseHandlerModal></ResponseHandlerModal>
    <section id="products" class="w-full pb-24"></section>

    <section
      class="max-w-screen-xl mx-2 sm:mx-auto px-4 sm:px-6 lg:px-0 py-6 pb-20 sm:py-8 rounded-[2.25rem] sm:rounded-xl bg-white shadow-lg sm:shadow-md transform lg:-translate-y-12"
    >
      <ProductsList :productsData="products"></ProductsList>
    </section>

    <!-- Back to top -->
    <div class="w-full my-10 flex justify-center">
      <a
        v-smooth-scroll
        data-aos="flip-down"
        data-aos-delay="150"
        href="#navbar"
        class="px-6 py-3 flex items-center space-x-2 bg-[#FAFAFA] hover:bg-gray-100 hover:shadow-md border border-[#DDDDDD] rounded-md text-gray-700"
      >
        <span>Back to top</span>
        <ArrowUpIcon :size="20" />
      </a>
    </div>
  </div>
</template>

<script>
import { APIGET } from "../api/apiHelper";
import ResponseHandlerModal from "../components/ResponseHandlerModal.vue";

export default {
  name: "ProductsPage",
  components: {
    ResponseHandlerModal,
  },
  data() {
    return {
      products: [{}],
    };
  },
  async asyncData() {
    try {
      const response = await APIGET("getProductsData");

      if (!response.data.error) {
        const products = response.data.map((item) => ({ ...item }));
        return { products };
      }
      if (response.data.error) {
        let errorMessage = "";
        errorMessage += response.data.error ? response.data.error + ";" : "";
        return { error: errorMessage };
      }
    } catch (err) {
      return { error: err.message };
    }
  },
  mounted() {
    if (this.error) {
      this.checkError(this.error, {
        show: true,
        title: "Hiba",
        message: "Hiba történt az adatok lekérése közben: " + this.error,
        options: [],
        type: "error",
      });
    }
  },
};
</script>

<style>
</style>