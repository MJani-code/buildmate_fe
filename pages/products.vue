<template>
  <div class="w-full">
    <section id="products" class="w-full pb-24">
      <p>from products page</p>
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
export default {
  name: "ProductsPage",
};
</script>

<style>
</style>