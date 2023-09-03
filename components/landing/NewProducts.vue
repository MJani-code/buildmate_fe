<template>
    <v-app>
        <v-card :loading="loading" class="mx-auto my-12" max-width="300">
            <template slot="progress">
                <v-progress-linear color="blue darken-2" height="10" indeterminate></v-progress-linear>
            </template>

            <v-img height="250" src="https://cdn.vuetifyjs.com/images/cards/cooking.png"></v-img>

            <v-card-title class="d-flex">
                <span class="align-self-start">Product Name</span>
                <span>
                    <v-icon class="align-self-end text-subtitle-1 mdi mdi-tag" color="blue darken-2">
                        1000 Ft
                    </v-icon>
                </span>
            </v-card-title>

            <v-divider class="mx-4"></v-divider>
            <v-card-text>
                <v-row align="center" class="mb-1">
                </v-row>
                <div class="pb-1">
                    <v-icon class="mt-2 text-subtitle-1 mdi mdi-map-marker">
                        Location
                    </v-icon>
                </div>
            </v-card-text>

            <div class="d-flex align-center">
                <v-card-title class="align-self-start subtitle-1">
                    <Countdown :expirationDate = "expirationDate"></Countdown>
                    <!-- <span id="days">0 </span>nap <span id="hours">00</span>:<span id="minutes">00</span>:<span
                        id="seconds">60</span> -->
                </v-card-title>
                <v-card-title class="align-self-end">
                    <v-btn color="blue darken-2" text @click="reserve">
                        Érdekel
                    </v-btn>
                </v-card-title>
            </div>
        </v-card>
    </v-app>
</template>

<script>
export default {
    props: ['expirationDate'],
    data: () => ({
        loading: false,
        selection: 1,
    }),

    methods: {
        reserve() {
            this.loading = true

            setTimeout(() => (this.loading = false), 2000)
        },
    },

}
</script>

<style >
.v-application--wrap {
    min-height: 0 !important;
}

.d-flex {
    justify-content: space-between;
}

.align-self-start {
    align-self: flex-start;
}

.align-self-end {
    align-self: flex-end;
}
</style>

<style scoped>
.subtitle-1{
    margin: auto 0;
}
</style>