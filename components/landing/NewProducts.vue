<template>
    <v-app>
        <v-card :loading="loading" class="mx-auto my-12" max-width="374">
            <template slot="progress">
                <v-progress-linear color="blue darken-2" height="10" indeterminate></v-progress-linear>
            </template>

            <v-img height="250" src="https://cdn.vuetifyjs.com/images/cards/cooking.png"></v-img>

            <v-card-title class="d-flex">
                <span class="align-self-start">Product Name</span>
                <v-span>
                    <v-icon class="align-self-end text-subtitle-1 mdi mdi-tag" color="blue darken-2">
                        1000 Ft
                    </v-icon>
                </v-span>
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
                <v-card-title id="countdown" class="align-self-start">
                    <span id="days">0 </span>nap <span id="hours">00</span>:<span id="minutes">00</span>:<span
                        id="seconds">60</span>
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
    mounted() {
        // Az elemek kiválasztása
        const daysElement = document.getElementById("days");
        const hoursElement = document.getElementById("hours");
        const minutesElement = document.getElementById("minutes");
        const secondsElement = document.getElementById("seconds");

        // Visszaszámlálás kezdeti értéke (1 nap = 24 óra)
        let days = 1;
        let hours = 0;
        let minutes = 0;
        let seconds = 0;

        // Az időzítő beállítása (1000 ms = 1 másodperc)
        const countdown = setInterval(function () {
            // Másodpercek csökkentése
            seconds--;

            // Ha a másodpercek negatívra váltanak, akkor percek és órák frissítése
            if (seconds < 0) {
                minutes--;
                seconds = 59;

                if (minutes < 0) {
                    hours--;
                    minutes = 59;

                    if (hours < 0) {
                        days--;
                        hours = 23;
                    }
                }
            }

            // Az értékek megjelenítése az elemeken
            daysElement.textContent = days.toString().padStart(1, "0");
            hoursElement.textContent = hours.toString().padStart(2, "0");
            minutesElement.textContent = minutes.toString().padStart(2, "0");
            secondsElement.textContent = seconds.toString().padStart(2, "0");

            // Ha elérjük a 0 nap 0 óra 0 perc 0 másodperc értéket, leállítjuk a visszaszámlálást
            if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
                clearInterval(countdown);
                alert("Vége a visszaszámlálásnak!");
            }
        }, 1000);

    }

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