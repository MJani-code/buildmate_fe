<template>
  <v-menu
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    min-width="auto"
  >
    <template v-slot:activator="{ on, attrs }">
      <div>
        <v-text-field
          v-model="startTime"
          label="Start Time"
          type="datetime-local"
          color="#359756"
        />
        <v-text-field
          v-model="endTime"
          label="End Time"
          type="datetime-local"
          color="#359756"
        />
        <ul></ul>
      </div>
    </template>
  </v-menu>
</template>

<script>
import moment from "moment";

export default {
  name: "datePicker",
  props: {
    starttime: {
      //type: Number,
    },
    endtime: {
      //type: Number,
    },
  },
  data: () => ({
    startTime: "",
    endTime: "",
    startTimeUnix: null,
    endTimeUnix: null,
  }),
  methods: {
    //
  },
  mounted() {
    this.startTime = moment(this.starttime).format("YYYY-MM-DD HH:mm");
    this.endTime = moment(this.endtime).format("YYYY-MM-DD HH:mm");
  },
  watch: {
    starttime: function (newVal, oldVal) {
      // do something when starttime prop changes
      this.startTime = moment(newVal).format("YYYY-MM-DD HH:mm");

    },
    endtime: function (newVal, oldVal) {
      // do something when endtime prop changes
      this.endTime = moment(newVal).format("YYYY-MM-DD HH:mm");

    },
    startTime: function (newVal, oldVal) {
      this.startTimeUnix = moment(newVal).unix() * 1000;
      if (this.startTimeUnix) {
        this.$emit("startTimeUnix", this.startTimeUnix);
      } else {
        this.$emit("startTimeUnix", this.starttime);
      }
    },
    endTime: function (newVal, oldVal) {
      this.endTimeUnix = moment(newVal).unix() * 1000;
      if (this.endTimeUnix) {
        this.$emit("endTimeUnix", this.endTimeUnix);
      } else {
        this.$emit("endTimeUnix", this.endtime);
      }
    },
  },
};
</script>