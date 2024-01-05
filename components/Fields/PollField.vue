<template>
  <v-card>
    <v-card-title>Szavazás</v-card-title>
    <v-expansion-panels>
      <v-expansion-panel v-for="(poll, index) in activePolls" :key="index">
        <v-expansion-panel-header>
          {{ poll.questionText }}
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-form :ref="index">
            <v-checkbox
              v-for="(choice, choiceIndex) in poll.options"
              :key="choiceIndex"
              :id="choice.id.toString()"
              :label="choice.value"
              :disabled="choice.disabled"
              v-model="choice.checked"
              color="#359756"
              @click="handleClick(poll, choice, index)"
            ></v-checkbox>
            <v-btn
              :disabled="!hasCheckedOptions(poll)"
              color="#359756"
              @click="makingPoll(poll, index)"
              >Szavazok</v-btn
            >
          </v-form>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <div style="display: block; margin: 20px 20px"></div>
  </v-card>
</template>

<script>
export default {
  name: "PollField",
  props: {
    polls: {
      type: Array(),
    },
  },
  data: () => ({}),
  computed: {
    activePolls() {
      // Szűrjük csak azokat az elemeket, ahol a 'active' érték true
      return this.polls.filter((poll) => poll.active);
    },
  },
  methods: {
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