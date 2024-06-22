<template>
  <v-container class="lighten-5">
    <Alert :show="showAlert" :message="alertMessage" :type="alertType"></Alert>
    <v-row no-gutters>
      <v-col xs="12" sm="12" md="6" lg="6" xl="6" class="col">
        <v-card
          class="pa-2"
          :class="{
            'create-poll-bg-dark': $vuetify.theme.dark,
            'create-poll-bg-light': !$vuetify.theme.dark,
          }"
          outlined
          tile
        >
          <v-card-title>Szavazás létrehozása</v-card-title>
          <template>
            <v-card-text>
              <v-form>
                <div v-for="(createPoll, index) in createPolls" :key="index">
                  <div class="v-form-group">
                    <v-text-field
                      type="text"
                      v-model="createPoll.question"
                      :placeholder="'Ide írd a kérdést'"
                      color="#359756"
                    ></v-text-field>
                  </div>
                  <div
                    class="v-form-group"
                    v-for="(choice, choiceIndex) in createPoll.choices"
                    :key="choiceIndex"
                  >
                    <v-text-field
                      type="text"
                      v-model="createPoll.choices[choiceIndex]"
                      :placeholder="'Válasz ' + (choiceIndex + 1)"
                      color="#359756"
                    >
                      <template #append>
                        <v-icon
                          class="icon-text-field-icon"
                          @click="addChoice(createPoll.choices)"
                          >mdi-plus</v-icon
                        >
                        <v-icon
                          class="icon-text-field-icon"
                          v-if="choiceIndex > 0"
                          @click="removeChoice(createPoll.choices, choiceIndex)"
                          >mdi-trash-can-outline</v-icon
                        >
                      </template>
                    </v-text-field>
                  </div>
                  <v-text-field
                    v-model="createPoll.deadline"
                    label="Határidő"
                    type="datetime-local"
                    color="#359756"
                  />
                  <v-checkbox
                    style="width: fit-content"
                    v-model="createPoll.multiple"
                    label="Több válasz engedélyezése"
                    color="#359756"
                  >
                  </v-checkbox>
                  <div style="display: block; margin-bottom: 20px">
                    <v-btn
                      style="width: 100%"
                      :color="'error'"
                      class="danger"
                      v-if="index > 0"
                      @click="removequery(index)"
                      >Kérdés eltávolítása</v-btn
                    >
                  </div>
                </div>
                <v-divider class="my-divider"></v-divider>
                <div style="display: block; margin: 20px 20px">
                  <v-btn style="width: 100%" @click="addquery"
                    >Új kérdés hozzáadása</v-btn
                  >
                </div>
                <div style="display: block; margin: 20px 20px">
                  <v-btn style="width: 100%" color="#359756" @click="postQuery"
                    >Szavazás indítása</v-btn
                  >
                </div>
              </v-form>
            </v-card-text>
          </template>
        </v-card>
      </v-col>
      <v-col xs="12" sm="12" md="6" lg="6" xl="6">
        <v-row no-gutters>
          <v-col cols="12">
            <v-card class="ml-2 no-border" outlined tile>
              <PollField @makingPoll="poll" :polls="activePolls"></PollField>
            </v-card>
          </v-col>
          <v-col cols="12">
            <v-card class="ml-2 no-border" outlined tile>
              <FieldsPollResults :polls="activePolls"/>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>


<script>
import PollField from "../../components/Fields/PollField.vue";
import Alert from "../../components/Alert.vue";
import { APIGET, APIUPLOAD, APIPOST, APIPOST2, config } from "~/api/apiHelper";
import PollResults from "../../components/Fields/PollResults.vue";

export default {
  data: () => ({
    alertMessage: "",
    showAlert: false,
    alertType: "",
    createPolls: [{ question: "", multiple: false, deadline: "", choices: [""], token: '' }],
    activePolls: [],
    pollData: {},
  }),
  components: {
    PollField,
    Alert,
  },
  mounted() {
    this.getActivePolls();
    this.$nuxt.$on("response-handled-in-page", this.handlePollConfirm);
  },
  beforeDestroy() {
    // Az eseményhallgatás megszüntetése az oldal megsemmisülése előtt
    this.$nuxt.$off("response-handled-in-page", this.handlePollConfirm);
  },
  methods: {
    addChoice(choices) {
      choices.push("");
    },
    removeChoice(choices, index) {
      choices.splice(index, 1);
    },
    addquery() {
      this.createPolls.push({
        question: "",
        multiple: false,
        choices: ["", ""],
      });
    },
    removequery(index) {
      this.createPolls.splice(index, 1);
    },
    async getActivePolls() {
      var token = this.$store.state.auth.token;
      try {
        const response = await APIPOST2("getPolls", { token: token });
        if (response.data) {
          this.activePolls = response.data.result;
        } else {
          const error = response.data;
          this.showServerError(error);
        }
      } catch (error) {
        this.showCatchError(error);
      }
    },
    async postQuery() {
      var token = this.$store.state.auth.token;
      var condominiumId = this.$store.state.auth.condominiumId;
      this.createPolls[0].token = token
      this.createPolls[0].condominiumId = condominiumId
      try {
        const response = await APIPOST("addPolls", this.createPolls);
        if (response.data.confirmAddPolls == true) {
          this.showServerResponse();
          this.getActivePolls();
          this.createPolls = [{ question: "", multiple: false, deadline: "", choices: [""], token: '' }];
        } else {
          const error = response.data;
          this.showServerError(error);
        }
      } catch (error) {
        this.showCatchError(error);
      }
    },
    poll(poll) {
      this.$store.dispatch("setResponseHandler", {
        show: true,
        title: "Szavazás megerősítése",
        message: "Megerősíted a szavazatodat?",
        options: ["Mégsem", "Igen"],
        type: {
          action: "confirmPoll",
        },
      });
      this.pollData.questionId = poll.questionId;
      const options = poll.options;
      const checkedIds = options
        .filter((option) => option.checked)
        .map((option) => option.id);
      this.pollData.answerIds = checkedIds;
    },
    async handlePollConfirm(response) {
      // Esemény kezelése az oldalon
      if ((response == "confirmPoll" && this.pollData)) {
        //API hívás
        var token = this.$store.state.auth.token;
        var userId = this.$store.state.auth.userId;

        this.pollData.token = token;
        this.pollData.userId = userId;

        // console.log("Oldal: Válasz a ResponseHandlerModal-ból:", this.pollData);

        try {
          const response = await APIPOST("addVotes", this.pollData);
          if (response.data.confirmAddVotes == true) {
            this.showServerResponse();
            //Sikeres hívás után eltűntetjük a kérdést
            this.activePolls.forEach((item) => {
              if (item.questionId === this.pollData.questionId) {
                item.active = 0;
              }
            });
            this.pollData = {};
          } else {
            const error = response.data;
            this.showServerError(error);
          }
        } catch (error) {
          this.showCatchError(error);
        }
      }
    },
    showServerResponse() {
      //If succes
      this.alertMessage = "A művelet sikeres volt!";
      this.alertType = "success";
      this.showAlert = true;
      if ((this.showAlert = true)) {
        setTimeout(() => {
          this.showAlert = false; // Az értesítés elrejtése
        }, 3000);
      }
    },
    showServerError(error) {
      this.checkError(error, {
        show: true,
        title: "Hiba",
        message: error,
        options: [],
        type: {
          action: "error",
        },
      });
    },
    showCatchError(error) {
      this.checkError(error, {
        show: true,
        title: "Hiba",
        message: `${error.code} - ${error.name} - ${error.message}`,
        options: [],
        type: {
          action: "error",
        },
      });
    },
  },
};
</script>

<style scoped>
.no-border {
  border: none !important;
}
</style>