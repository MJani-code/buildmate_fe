<template>
  <v-container class="lighten-5">
    <v-row class="fill-height">
      <Alert :show="showAlert" :message="alertMessage" :type="alertType"></Alert>
      <v-col xs="12" sm="12" md="12" lg="12" xl="12" class="col">
        <div class="selects">
          <v-sheet tile height="auto" color="#359756" class="white-text">
            <v-btn icon class="ma-2" @click="$refs.calendar.prev()">
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <v-select v-model="type" :items="types" dense outlined hide-details class="ma-2 select"
              label="type"></v-select>
            <v-select v-model="weekday" :items="weekdays" dense outlined hide-details label="weekdays"
              class="ma-2 select"></v-select>
            <v-toolbar-title v-if="$refs.calendar" class="month">
              {{ $refs.calendar.title }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon class="ma-2" @click="$refs.calendar.next()">
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
            <v-toolbar-title v-if="$refs.calendar" class="monthonmobile">
              {{ $refs.calendar.title }}
            </v-toolbar-title>
          </v-sheet>
        </div>
        <v-sheet height="500">
          <v-calendar ref="calendar" v-model="value" color="primary" :type="type" :events="events" :weekdays="weekday"
            :event-color="getEventColor" :event-overlap-mode="mode" :event-ripple="false" @click:event="editEvent"
            @change="getEvents" @mousedown:event="startDrag" @mousedown:time="startTime" @mousemove:time="mouseMove"
            @mouseup:event="endDrag" @mouseleave.native="cancelDrag">
            <!-- kivettem a v-calendarból: @mouseup:time="endDrag" -->

            <template v-slot:event="{ event, timed, eventSummary }">
              <div class="v-event-draggable">
                <component :is="{ render: eventSummary }"> </component>
                <p>{{ event.name }} - {{ event.flat }}</p>
              </div>
              <div v-if="timed" class="v-event-drag-bottom" @mousedown.stop="extendBottom(event)"></div>
              <v-btn class="mx-2" fab dark color="primary" @click.stop="deleteEvent(event)">
                <v-icon dark> mdi-minus </v-icon>
              </v-btn>
            </template>
          </v-calendar>
          <v-dialog v-model="dialogOpen" width="400">
            <v-card>
              <v-card-title>{{ eventToEdit.name }} szerkesztése</v-card-title>
              <v-card-text>
                <v-form ref="form">
                  <v-text-field color="#359756" v-model="eventToEdit.name" label="Esemény neve" />
                  <datePicker :starttime="eventToEdit.start" :endtime="eventToEdit.end"
                    @startTimeUnix="handlerStartUnixData" @endTimeUnix="handlerEndUnixData"></datePicker>
                  <v-select color="#359756" v-model="selectedCategoryId" :items="eventCategories" item-text="name"
                    item-value="id" label="Kategória" :rules="rules.select">
                  </v-select>
                  <v-autocomplete v-model="eventToEdit.responsibles" :items="responsibleNames" chips color="#359756"
                    label="Felelősök" full-width hide-details hide-no-data hide-selected multiple
                    single-line></v-autocomplete>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn @click="closeDialog">Mégsem</v-btn>
                <v-btn @click="saveEvent(eventToEdit)" color="#359756">Mentés</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="confirmDialog" max-width="500px" persistent>
            <v-card>
              <v-card-title> Esemény törlése </v-card-title>
              <v-card-text>
                Biztosan törölni szeretnéd ezt az eseményt?
              </v-card-text>
              <v-card-actions>
                <v-btn @click="confirmDialog = false">Mégsem</v-btn>
                <v-btn color="error" @click="confirmDeletion">Törlés</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-sheet>
      </v-col>
    </v-row>
    <v-row>
      <v-col xs="12" sm="12" md="12" lg="6" xl="6" class="col">
        <table border="1" class="table table-striped eventsToTableView" :data-bs-theme="getBootstrapThemeAttribute">
          <thead>
            <tr>
              <th></th>
              <th scope="col" colspan="2">Kuka-kommunális</th>
              <th scope="col" colspan="2">Kuka-szelektív</th>
              <th scope="col" colspan="2">Fűnyírás</th>
            </tr>
            <tr>
              <th>Hónap</th>
              <th>Dátum</th>
              <th>Lakás</th>
              <th>Dátum</th>
              <th>Lakás</th>
              <th>Dátum</th>
              <th>Lakás</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(event, index) in eventsToTableView" :key="index">
              <td>{{ event.month }}</td>
              <td>{{ event["Kuka-kommunális"].dates }}</td>
              <td>{{ event["Kuka-kommunális"].flat }}</td>
              <td>{{ event["Kuka-szelektív"].dates }}</td>
              <td>{{ event["Kuka-szelektív"].flat }}</td>
              <td>{{ event["Fűnyírás"] ? event["Fűnyírás"].dates : "" }}</td>
              <td>{{ event["Fűnyírás"] ? event["Fűnyírás"].flat : "" }}</td>
            </tr>
          </tbody>
        </table>
      </v-col>
      <v-col xs="12" sm="12" md="12" lg="6" xl="6" class="col">
        <v-data-table dense :headers="eventsToTableViewHeaders" :items="filteredEvents" item-key="id"
          class="elevation-1">
          <template v-slot:item.comment="{ item, index }">
            <div>
              <v-text-field v-model="item.comment" dense hide-details solo
                :append-icon="item.commentIcon ? 'mdi-check' : ''" color="#359756" class="m-2"
                :disabled="isCommentDisabled" @click:append="setComment(item)" @input="handleInputChange(item)"
                @blur="handleChangeInput(item)">
              </v-text-field>
            </div>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import datePicker from "../../components/Fields/datepicker.vue";
import Alert from "../../components/Alert.vue";
import { APIGET, APIUPLOAD, APIPOST, APIPOST2 } from "~/api/apiHelper";

export default {
  data: () => ({
    dialogOpen: false,
    confirmDialog: false,
    showAlert: false,
    alertMessage: "",
    alertType: "",
    eventToEdit: [],
    eventName: "",
    selectedCategoryId: null,
    userId: null,
    emitStartTimeUnix: null,
    emitEndTimeUnix: null,
    users: [],
    responsibleNames: [],
    selectedResponsibles: [],
    eventCategories: [],
    evenToDeleteId: null,
    drag: false,
    isMobile: false,
    rules: {
      select: [(v) => !!v || "Válassz a listából egy kategóriát"],
    },
    type: "week",
    types: ["month", "week", "day", "4day"],
    mode: "stack",
    modes: ["stack", "column"],
    weekday: [1, 2, 3, 4, 5, 6, 0],
    weekdays: [
      { text: "Mon - Sun", value: [1, 2, 3, 4, 5, 6, 0] },
      { text: "Sun - Sat", value: [0, 1, 2, 3, 4, 5, 6] },
      { text: "Mon - Fri", value: [1, 2, 3, 4, 5] },
      { text: "Mon, Wed, Fri", value: [1, 3, 5] },
    ],
    value: "",
    events: [],
    eventsToTableView: [],
    eventsToTableViewHeaders: [
      {
        text: "Feladat",
        align: "start",
        filterable: true,
        value: "name",
      },
      {
        text: "Dátum",
        align: "start",
        filterable: true,
        value: "start_event",
      },
      {
        text: "Lakás",
        align: "start",
        filterable: true,
        value: "flat",
      },
      {
        text: "Megjegyzés",
        align: "start",
        filterable: true,
        value: "comment",
      },
    ],
    eventsToTableViewComment: "",
    dragEvent: null,
    dragEvent2: null,
    dragStart: null,
    createEvent: null,
    createStart: null,
    extendOriginal: null,
    userData: null,
    isCommentDisabled: true,
  }),
  components: {
    datePicker,
    Alert,
  },
  watch: {
    selectedCategoryId(newId) {
      const selectedType = this.eventCategories.find(
        (item) => item.id === newId
      );
      if (selectedType) {
        this.eventToEdit.categoryId = newId;
        this.eventToEdit.category = selectedType.name;
      }
    },
  },
  computed: {
    getBootstrapThemeAttribute() {
      return this.$vuetify.theme.dark ? "dark" : null;
    },
    filteredEvents() {
      // Szűrd le az összes objektumot, ahol van 'Fűnyírás' kategória
      const fűnyírásCategories = this.eventsToTableView
        .filter((categoryObj) => categoryObj.hasOwnProperty("Fűnyírás"))
        .map((categoryObj) => categoryObj.Fűnyírás);

      // Gyűjtsd össze a 'Fűnyírás' kategória eseményeit
      const fűnyírásEvents = fűnyírásCategories.reduce(
        (events, category) => events.concat(category.events),
        []
      );
      return fűnyírásEvents;
    },
  },
  mounted() {
    const dataFromLocalStorage = localStorage.getItem("apiLogin");
    const parsedData = JSON.parse(dataFromLocalStorage);

    this.userData = parsedData;
    this.userId = parsedData.userId;

    if (this.$store.state.auth.userRole === "admin") {
      this.isCommentDisabled = false;
    }
    this.handleResize = () => {
      this.type = window.innerWidth < 768 ? 'day' : 'week';
    };
    window.addEventListener('resize', this.handleResize);
    this.handleResize();

  },
  methods: {
    startDrag({ event, timed }) {
      if (event && timed) {
        this.dragEvent = event;
        this.dragTime = null;
        this.extendOriginal = null;
      }
    },
    startTime(tms) {
      const mouse = this.toTime(tms);

      if (this.dragEvent && this.dragTime === null) {
        const start = this.dragEvent.start;
        this.dragTime = mouse - start;
      } else {
        this.createStart = this.roundTime(mouse);
        const randomIndex = Math.floor(
          Math.random() * this.eventCategories.length
        );
        this.createEvent = {
          name: `Event #${this.events.length}`,
          color: this.eventCategories[randomIndex].color,
          start: this.createStart,
          end: this.createStart,
          timed: true,
        };
        this.events.push(this.createEvent);
      }
    },
    extendBottom(event) {
      this.createEvent = event;
      this.createStart = event.start;
      this.extendOriginal = event.end;
      this.dragEvent = event;
      if (event.id) {
        this.dragEvent2 = true;
      }
    },
    mouseMove(tms) {
      const mouse = this.toTime(tms);

      if (this.dragEvent && this.dragTime !== null) {
        const start = this.dragEvent.start;
        const end = this.dragEvent.end;
        const duration = end - start;
        const newStartTime = mouse - this.dragTime;
        const newStart = this.roundTime(newStartTime);
        const newEnd = newStart + duration;

        this.dragEvent2 = true;
        this.dragEvent.start = newStart;
        this.dragEvent.end = newEnd;
      } else if (this.createEvent && this.createStart !== null) {
        const mouseRounded = this.roundTime(mouse, false);
        const min = Math.min(mouseRounded, this.createStart);
        const max = Math.max(mouseRounded, this.createStart);

        this.createEvent.start = min;
        this.createEvent.end = max;
      }
    },
    endDrag({ event, nativeEvent }) {
      if (this.dragEvent2 && event.id) {
        if (window.innerWidth > 768) {
          this.saveEventByDrag(event);
        }
      }
      //this.dragEvent2 = false;
      this.dragTime = null;
      this.dragEvent = null;
      this.createEvent = null;
      this.createStart = null;
      this.extendOriginal = null;
    },
    cancelDrag() {
      if (this.createEvent) {
        if (this.extendOriginal) {
          this.createEvent.end = this.extendOriginal;
        } else {
          const i = this.events.indexOf(this.createEvent);
          if (i !== -1) {
            this.events.splice(i, 1);
          }
        }
      }
      this.createEvent = null;
      this.createStart = null;
      this.dragTime = null;
      this.dragEvent = null;
    },
    roundTime(time, down = true) {
      const roundTo = 15; // minutes
      const roundDownTime = roundTo * 60 * 1000;

      return down
        ? time - (time % roundDownTime)
        : time + (roundDownTime - (time % roundDownTime));
    },
    toTime(tms) {
      return new Date(
        tms.year,
        tms.month - 1,
        tms.day,
        tms.hour,
        tms.minute
      ).getTime();
    },
    getEventColor(event) {
      const rgb = parseInt(event.color.substring(1), 16);
      const r = (rgb >> 16) & 0xff;
      const g = (rgb >> 8) & 0xff;
      const b = (rgb >> 0) & 0xff;

      return event === this.dragEvent
        ? `rgba(${r}, ${g}, ${b}, 0.7)`
        : event === this.createEvent
          ? `rgba(${r}, ${g}, ${b}, 0.7)`
          : event.color;
    },
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a;
    },
    rndElement(arr) {
      return arr[this.rnd(0, arr.length - 1)];
    },
    editEvent({ event, nativeEvent }) {
      nativeEvent.stopPropagation();
      this.eventToEdit = event;
      this.eventName = event.category;
      this.selectedCategoryId = event.categoryId;
      if (this.dragEvent2 == null) {
        this.dialogOpen = true;
      }
    },
    async getEvents() {
      const dataFromLocalStorage = localStorage.getItem("apiLogin");
      const parsedData = JSON.parse(dataFromLocalStorage);

      this.userData = parsedData;
      try {
        const response = await APIPOST2("getEvents", this.userData);
        if (response.data) {
          this.events = response.data.result;
          this.eventCategories = response.data.categories;

          this.responsibleNames = response.data.users.map((item) => item.name);
          this.users = response.data.users;

          this.eventsToTableView = response.data.responseToTableView;
        } else {
          const error = response.data;
          this.showServerError(error);
        }
      } catch (error) {
        this.showCatchError(error);
      }
    },
    async saveEvent(eventToEdit) {
      eventToEdit.userId = this.userId;
      eventToEdit.token = this.userData.token;

      const responsiblesIds = [];
      if (eventToEdit.responsibles) {
        eventToEdit.responsibles.forEach((responsibleNames) => {
          const talalat = this.users.find(
            (item) => item.name === responsibleNames
          );
          if (talalat) {
            responsiblesIds.push(talalat.id);
          }
        });
        eventToEdit.responsiblesIds = responsiblesIds;
      }

      const isValid = await this.$refs.form.validate();
      if (!isValid) {
        return;
      } else {
        try {
          const response = await APIPOST("addEvent", eventToEdit);
          if (response.data.confirmAddNewEvent == true) {
            this.dialogOpen = false;
            this.events[this.events.length - 1].id = response.data.eventId;
            this.showServerResponse();
          } else if (response.data.confirmUpdateEvent == true) {
            this.dialogOpen = false;
            this.showServerResponse();
          } else {
            const error = response.data;
            this.showServerError(error);
          }
        } catch (error) {
          this.showCatchError(error);
        }
      }
    },
    async saveEventByDrag(event) {
      event.token = this.userData.token;
      try {
        const response = await APIPOST("addEvent", event);
        if (response.data.confirmUpdateEvent == true) {
          this.showServerResponse();
          this.dragEvent2 = null;
        } else {
          const error = response.data.error;
          this.showServerError(error);
        }
      } catch (error) {
        this.showCatchError(error);
      }
    },
    deleteEvent(event) {
      this.evenToDeleteId = event.id;
      this.confirmDialog = true;
    },
    async confirmDeletion() {
      try {
        const response = await APIPOST("deleteEvent", {
          id: this.evenToDeleteId,
        });
        if (response.data.confirmDeleteEvent == true) {
          const indexToDelete = this.events.findIndex(
            (item) => item.id === this.evenToDeleteId
          );
          if (indexToDelete !== -1) {
            this.events.splice(indexToDelete, 1);
            this.evenToDeleteId = null;
          }
          this.showServerResponse();
        } else {
          const error = response.data.error;
          this.showServerError(error);
        }
      } catch (error) {
        this.showCatchError(error);
      }
      this.confirmDialog = false;
    },
    handlerStartUnixData(newUnixData) {
      this.emitStartTimeUnix = newUnixData;
      this.eventToEdit.start = newUnixData;
    },
    handlerEndUnixData(newUnixData) {
      this.emitEndTimeUnix = newUnixData;
      this.eventToEdit.end = newUnixData;
    },
    async setComment(item) {
      console.log("update comment: " + item.comment + "id: " + item.id);
      const data = item;
      item.token = this.userData.token;

      try {
        const response = await APIPOST("addEvent", data);
        item.commentIcon = false;
        if (response.data.confirmUpdateEvent == true) {
          this.showServerResponse();
        } else {
          const error = response.data.error;
          this.showServerError(error);
        }
      } catch (error) {
        this.showCatchError(error);
      }
    },
    handleInputChange(item) {
      item.commentIcon = false;
      item.commentIcon = true;
    },
    handleChangeInput(item) {
      item.commentIcon = false;
    },
    showServerResponse() {
      this.uploadDialog = false;
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
      this.$store.dispatch("setResponseHandler", {
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
        message: `Hiba történt az adatok lekérése közben: ${error.code} - ${error.name} - ${error.message}`,
        options: [],
        type: {
          action: "error",
        },
      });
    },
    closeDialog() {
      this.dialogOpen = false;
    },
  },
};
</script>

<style scoped lang="scss">
.v-event-draggable {
  padding-left: 6px;
}

.v-event-timed {
  user-select: none;
  -webkit-user-select: none;
}

.v-event-drag-bottom {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 4px;
  height: 4px;
  cursor: ns-resize;

  &::after {
    display: none;
    position: absolute;
    left: 50%;
    height: 4px;
    border-top: 1px solid white;
    border-bottom: 1px solid white;
    width: 16px;
    margin-left: -8px;
    opacity: 0.8;
    content: "";
  }

  &:hover::after {
    display: block;
  }
}

::v-deep .white-text * {
  color: white !important;
}

button.mx-2.v-btn.v-btn--is-elevated.v-btn--fab.v-btn--has-bg.v-btn--round.theme--dark.v-size--default.primary {
  //display: none;
  position: absolute;
  z-index: 1;
  right: -20px;
  top: -10px;
  max-height: 20px !important;
  max-width: 20px !important;
  background-color: #35975659 !important;
}

p .v-btn--fab.v-size--default,
.v-icon.notranslate.mdi.mdi-minus.theme--dark {
  max-height: 20px !important;
  max-width: 20px !important;
  color: white;
}

@media (min-width: 1024px) {
  button.mx-2.v-btn.v-btn--is-elevated.v-btn--fab.v-btn--has-bg.v-btn--round.theme--dark.v-size--default.primary {
    display: none;
  }

  .v-event-timed.white--text:hover {
    button.mx-2.v-btn.v-btn--is-elevated.v-btn--fab.v-btn--has-bg.v-btn--round.theme--dark.v-size--default.primary {
      display: inline-block;
    }
  }
}

.v-toolbar__title {
  margin: auto;
}

.monthonmobile {
  display: none !important;
}

@media (max-width: 767px) {
  .month {
    display: none !important;
  }

  .monthonmobile {
    display: block !important;
  }

  .spacer {
    display: none;
  }

  .select {
    max-width: min-content;
    display: inline-flex;
  }

  .v-toolbar__title {
    width: fit-content;
  }
}

@media (min-width: 468px) {
  .white-text {
    display: flex !important;
  }
}

table.eventsToTableView {
  border-collapse: collapse !important;
}

table.eventsToTableView td {
  padding: 10px;
}
</style>

<style>
.container {
  max-width: unset;
  max-width: 100% !important;
}

table.eventsToTableView {
  font-size: 12px;
  width: 100%;
  --bs-table-bg: transparent;
}
</style>