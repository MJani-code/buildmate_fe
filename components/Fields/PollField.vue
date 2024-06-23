<template>
  <v-card>
    <v-card-title>Szavazás</v-card-title>
    <v-expansion-panels>
      <v-expansion-panel v-for="(poll, index) in activePolls" :key="index">
        <v-expansion-panel-header>
          {{ poll.questionText }}
          <small class="text-muted">{{ poll.countdown }}</small>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-form :ref="index">
            <v-checkbox v-for="(choice, choiceIndex) in poll.options" :key="choiceIndex" :id="choice.id"
              :label="choice.value" :disabled="choice.disabled" v-model="choice.checked" color="#359756"
              @click="handleClick(poll, choice, index)"></v-checkbox>
            <v-btn :disabled="!hasCheckedOptions(poll)" color="#359756"
              @click="makingPoll(poll, index)">Szavazok</v-btn>
          </v-form>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <div style="display: block; margin: 20px 20px"></div>
  </v-card>
</template>

<script>
import { APIGET, APIUPLOAD, APIPOST, APIPOST2, config } from "~/api/apiHelper";

export default {
  name: "PollField",
  props: {
    polls: {
      type: Array(),
    },
  },
  data: () => ({}),
  mounted() {
    if(this.polls){
      this.updateCountdowns();
      setInterval(this.updateCountdowns, 1000);
    }
  },
  computed: {
    activePolls() {
      // Szűrjük csak azokat az elemeket, ahol a 'active' érték true
      if (this.polls) {
        return this.polls.filter((poll) => poll.active);
      }else{
        console.log("nincsen aktív szavazás");
      }
    },
  },
  methods: {
    updateCountdowns() {
      this.activePolls.forEach(poll => {
        const deadline = new Date(poll.deadline);
        const now = new Date();
        const timeRemaining = deadline - now;

        if (timeRemaining > 0) {
          const seconds = Math.floor((timeRemaining / 1000) % 60);
          const minutes = Math.floor((timeRemaining / 1000 / 60) % 60);
          const hours = Math.floor((timeRemaining / 1000 / 60 / 60) % 24);
          const days = Math.floor(timeRemaining / 1000 / 60 / 60 / 24);

          poll.countdown = `${days}nap ${hours}:${minutes}:${seconds}`;
        } else {
          poll.countdown = 'Lejárt';
          poll.active = 0;
          this.fetchResults(poll.questionId);
        }
      });
    },
    async fetchResults(id) {
      var token = this.$store.state.auth.token;
      var questionId = id;
      try {
        const response = await APIPOST2("getPollResults", { token: token, id: questionId });
        console.log(`Eredmények a ${questionId} azonosítójú kérdéshez:`, response.data);
      } catch (error) {
        console.error('Hiba az eredmények lekérésekor:', error);
      }
    },
    hasCheckedOptions(poll) {
      return poll.options.some((option) => option.checked);
    },
    handleClick(poll, choice, index) {
      if (poll.multiple === 0) {
        if (choice.checked == true) {
          poll.options.forEach((otherChoice) => {
            if (otherChoice.id !== choice.id) {
              otherChoice.disabled = true;
            }
          });
        } else {
          choice.checked = false;
          poll.options.forEach((otherChoice) => {
            if (otherChoice !== choice) {
              otherChoice.disabled = false;
            }
          });
        }
      } else {
        choice.checked == !choice.checked;
      }
      this.$nextTick(() => {
        this.validate(index);
      });
    },
    validate(index) {
      const data = this.$refs[index][0];
      return data.$children.some(
        (children) => children.$options.propsData.inputValue
      );
    },
    makingPoll(poll, index) {
      this.validate(index);
      this.$emit("makingPoll", poll);
    },
  },
};
</script>

<style>
.v-application--is-ltr .v-expansion-panel-header {
  text-align: end;
}
</style>