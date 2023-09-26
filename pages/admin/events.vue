<template>
  <v-row class="fill-height">
    <Alert :show="showAlert" :message="alertMessage" :type="alertType"></Alert>
    <v-col>
      <div class="selects">
        <v-sheet tile height="54" color="#359756" class="d-flex white-text">
          <v-btn icon class="ma-2" @click="$refs.calendar.prev()">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-select
            v-model="type"
            :items="types"
            dense
            outlined
            hide-details
            class="ma-2"
            label="type"
          ></v-select>
          <v-select
            v-model="weekday"
            :items="weekdays"
            dense
            outlined
            hide-details
            label="weekdays"
            class="ma-2"
          ></v-select>
          <v-spacer></v-spacer>
          <v-btn icon class="ma-2" @click="$refs.calendar.next()">
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </v-sheet>
      </div>
      <v-sheet height="600">
        <v-calendar
          ref="calendar"
          v-model="value"
          color="primary"
          :type="type"
          :events="events"
          :weekdays="weekday"
          :event-color="getEventColor"
          :event-overlap-mode="mode"
          :event-ripple="false"
          @click:event="editEvent"
          @change="getEvents"
          @mousedown:event="startDrag"
          @mousedown:time="startTime"
          @mousemove:time="mouseMove"
          @mouseup:time="endDrag"
          @mouseup:event="endDrag"
          @mouseleave.native="cancelDrag"
        >
          <template v-slot:event="{ event, timed, eventSummary }">
            <div class="v-event-draggable">
              <component :is="{ render: eventSummary }"> </component>
              <p>{{ event.name }}</p>
            </div>
            <div
              v-if="timed"
              class="v-event-drag-bottom"
              @mousedown.stop="extendBottom(event)"
            ></div>
          </template>
        </v-calendar>
        <v-dialog v-model="dialogOpen" width="400">
          <v-card>
            <v-card-title>{{ eventToEdit.name }} szerkesztése</v-card-title>
            <v-card-text>
              <v-form ref="form">
                <v-text-field
                  color="#359756"
                  v-model="eventToEdit.name"
                  label="Esemény neve"
                />
                <datePicker
                  :starttime="eventToEdit.start"
                  :endtime="eventToEdit.end"
                  @startTimeUnix="handlerStartUnixData"
                  @endTimeUnix="handlerEndUnixData"
                ></datePicker>
                <v-select
                  color="#359756"
                  v-model="selectedCategoryId"
                  :items="eventCategories"
                  item-text="name"
                  item-value="id"
                  label="Kategória"
                  :rules="rules.select"
                >
                </v-select>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn @click="closeDialog">Mégsem</v-btn>
              <v-btn @click="saveUploadedItem(eventToEdit)" color="#359756"
                >Mentés</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import datePicker from "../../components/Fields/datepicker.vue";
import Alert from "../../components/Alert.vue";
import { APIGET, APIUPLOAD, APIPOST2 } from "~/api/apiHelper";

export default {
  data: () => ({
    dialogOpen: false,
    showAlert: false,
    alertMessage: "",
    alertType: "",
    eventToEdit: [],
    eventName: "",
    selectedCategoryId: null,
    userId: null,
    emitStartTimeUnix: null,
    emitEndTimeUnix: null,
    eventCategories: [
      { id: 3, name: "Kerti esemény", color: "#b5f556" },
      { id: 1, name: "Kuka-kommunális", color: "#19542b" },
      { id: 2, name: "Kuka-szelektív", color: "#c7c420" },
      { id: 4, name: "Fűnyírás", color: "#359756" },
      { id: 5, name: "Közgyűlés", color: "#c29844" },
      { id: 6, name: "Egyéb", color: "#56f5e8" },
    ],
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
    dragEvent: null,
    dragStart: null,
    createEvent: null,
    createStart: null,
    extendOriginal: null,
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
  mounted() {
    this.getEvents();
    const dataFromLocalStorage = localStorage.getItem("apiLogin");
    const parsedData = JSON.parse(dataFromLocalStorage);

    this.userId = parsedData.userId;
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
    endDrag({event, nativeEvent }) {
      this.dragTime = null;
      this.dragEvent = null;
      this.createEvent = null;
      this.createStart = null;
      this.extendOriginal = null;
      this.editEvent({event, nativeEvent});
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
      // save the event to edit and open the dialog
      this.eventToEdit = event;
      this.eventName = event.category;
      this.selectedCategoryId = event.categoryId;
      this.dialogOpen = true;
    },
    async getEvents() {
      try {
        const response = await APIGET("getEvents");
        if (response.data) {
          this.events = response.data.result;
        } else {
          const error = response.data;
          this.showServerError(error);
        }
      } catch (error) {
        this.showCatchError(error);
      }
    },
    async saveUploadedItem(eventToEdit) {
      eventToEdit.userId = this.userId;
      const isValid = await this.$refs.form.validate();
      if (!isValid) {
        return;
      } else {
        try {
          const response = await APIPOST2("addEvent", eventToEdit);
          if (response.data.confirmAddNewEvent == true) {
            this.dialogOpen = false;
            this.events.push(eventToEdit);
            this.showServerResponse();
          } else if (response.data.confirmUpdateEvent == true) {
            this.dialogOpen = false;
            this.showServerResponse();
          } else {
            const error = response.data.error;
            this.showServerError(error);
          }
        } catch (error) {
          this.showCatchError(error);
        }
      }
    },
    handlerStartUnixData(newUnixData){
      this.emitStartTimeUnix = newUnixData;

    },
    handlerEndUnixData(newUnixData){
      this.emitEndTimeUnix = newUnixData;

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
      this.checkError(error, {
        show: true,
        title: "Hiba",
        message: `Hiba történt az adatok lekérése közben: ${error}`,
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
</style>