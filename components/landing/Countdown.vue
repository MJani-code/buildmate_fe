<!-- Countdown.vue -->
<template>
  <div class="countdown">
    <b
      ><span>{{ countdown }}</span></b
    >
  </div>
</template>

<script>
export default {
  props: ["expirationDate"],
  data() {
    return {
      countdown: "",
    };
  },
  watch: {
    expirationDate: {
      handler(newExpirationDate) {
        // Ellenőrzi, hogy az expirationDate érvényes dátum-e
        if (newExpirationDate) {
          this.startCountdown();
        }
      },
      immediate: true, // Azonnali meghívás a komponens létrehozásakor
    },
  },
  mounted() {
    this.startCountdown();
  },
  methods: {
    startCountdown() {
      // Ellenőrzi, hogy az expirationDate érvényes dátum-e
      if (this.expirationDate) {
        const formattedExpirationDate =
          this.expirationDate.replace(" ", "T") + "Z";
        const targetDate = new Date(formattedExpirationDate).getTime();

        // Ellenőrzi, hogy van-e már futó időzítő, és ha van, leállítja
        if (this.interval) {
          clearInterval(this.interval);
        }

        // Visszaszámlálás frissítése minden másodpercben
        this.interval = setInterval(() => {
          const currentDate = new Date().getTime();
          const timeRemaining = targetDate - currentDate;

          if (timeRemaining <= 0) {
            // Az idő lejárt, állítsuk le a visszaszámlálást
            clearInterval(this.interval);
            this.countdown = "Lejárt";
          } else {
            // Számítsuk ki az napokat, órákat, perceket és másodperceket
            const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
            const hours = Math.floor(
              (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            );
            const minutes = Math.floor(
              (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
            );
            const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

            const formattedSeconds = String(seconds).padStart(2, "0");
            const formattedMinutes = String(minutes).padStart(2, "0");
            const formattedHours = String(hours).padStart(2, "0");

            // Frissítsük a visszaszámlálót a kiszámított értékekkel
            this.countdown = `${days} nap ${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
          }
        }, 1000);
      }
    },
  },
};
</script>

<style scoped>
.countdown span {
  color: #0c66ee;
}
</style>