<template>

    <v-dialog :value="itemDialog" max-width="500px" persistent>
      <v-card>
        <v-card-title> Card Title </v-card-title>
        <v-card-text>
          <v-text-field></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn>Mégsem</v-btn>
          <v-btn> Gomb </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

</template>

<script>
export default {
  props: {
    itemDialog: Boolean,
  },
  methods: {
    //
  },
};
</script>
