<template>
    <div>
        <p>Welcome to Admin</p>
    </div>
</template>

<script>
import { checkOnlyNumber, checkRequired } from '@/utils/validationRules'
import { IS_OPTIONAL, IS_REQUIRED } from '@/utils/constans'
import moment from "moment/moment";
import ProcessLoading from "~/components/Process/Loading.vue";

export default {
  name: "index",
  components: { ProcessLoading },
  layout: 'DefaultLayout',
  setup() {
    return {
      checkRequired,
      checkOnlyNumber,
      IS_OPTIONAL,
      IS_REQUIRED,
    }
  },
  async beforeMount() {

  },
  data() {
    return {
      isLoading: false,
      show: false
    };
  },
  computed: {
    //
  },
  watch: {
    //
  },
  methods: {
    formatDate(date) {
      return moment(date.trim(), 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD');
    },
  }
}
</script>