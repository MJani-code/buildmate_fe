<template>
  <div class="w-full lg:w-1/3 mt-6 lg:mt-0 overflow-hidden space-y-6" v-bind="$attrs">
    <div class="w-full flex items-center justify-between">
      <span class="font-medium">{{ title }}</span>
      <button
        href="#"
        class="px-3 py-1 text-sm font-medium text-blue-500 flex items-center space-x-1 rounded-md hover:bg-blue-50 transition duration-300"
      >


      </button>
    </div>
    <div class="flex flex-col">
      <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="px-2 sm:px-6 py-2 align-middle inline-block min-w-full overflow-hidden">

        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'LandingCryptoStatistic',
  props: {
    title: {
      type: String,
      default: '',
    },
    datasets: {
      type: Array,
      default: () => [],
    },
  },
}
</script>
