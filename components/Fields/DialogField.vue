<template>
  <v-dialog :value="itemDialog" max-width="500px" persistent>
    <v-card>
      <v-card-title>
        {{ getCardTitle() }}
      </v-card-title>
      <v-card-text>
        <v-text-field
          v-if="dialogType === 'edit'"
          v-model="editedItem.title"
          label="Dokumentum neve"
          color="#359756"
        ></v-text-field>
        <v-card-text v-else v-model="editedItem.title"
          >{{ getCardText() }}
        </v-card-text>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="closeDialog">Mégsem</v-btn>
        <v-btn
          :color="dialogType === 'delete' ? 'error' : '#359756'"
          @click="dialogType === 'delete' ? updateItem() : updateItem()"
        >
          {{ dialogType === "delete" ? "Törlés" : "Mentés" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    itemDialog: Boolean,
    dialogType: String,
    editedItem: Object,
  },
  methods: {
    getCardTitle() {
      switch (this.dialogType) {
        case "edit":
          return "Szerkesztés";
        case "delete":
          return "Törlés";
        case "confirm":
          return "Megerősítés";
      }
    },
    getCardText() {
      switch (this.dialogType) {
        case "edit":
          return "Szerkesztés";
        case "delete":
          return "Biztosan törölni szeretnéd?";
        case "confirm":
          return "Biztosan végrehajtja a műveletet?";
      }
    },
    updateItem() {
      switch (this.dialogType) {
        case "edit":
          return this.$emit("update","save", this.editedItem);
        case "delete":
          return this.$emit("update", "delete", this.editedItem);
        case "confirm":
          return this.$emit("update","confirm", this.editedItem);
      }
    },
    closeDialog() {
      this.$emit("close");
    },
  },
};
</script>
