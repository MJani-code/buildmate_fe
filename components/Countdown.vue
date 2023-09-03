<!-- Countdown.vue -->
<template>
    <div class="countdown">
        <b><span>{{ countdown }}</span></b>
    </div>
</template>

<script>
export default {
    props: ['expirationDate'],
    data() {
        return {
            countdown: '',
        };
    },
    mounted() {
        // Itt kell kiszámítani és frissíteni a countdown értékét a megadott expirationDate alapján.
        this.startCountdown();
    },
    methods: {
        startCountdown() {
            // Az expirationDate-ben található dátumot JavaScript Date objektummá alakítjuk
            const formattedExpirationDate = this.expirationDate.replace(" ", "T") + "Z";
            const targetDate = new Date(formattedExpirationDate).getTime();

            // Visszaszámlálás frissítése minden másodpercben
            const interval = setInterval(() => {
                const currentDate = new Date().getTime();
                const timeRemaining = targetDate - currentDate;

                if (timeRemaining <= 0) {
                    // Az idő lejárt, állítsuk le a visszaszámlálást
                    clearInterval(interval);
                    this.countdown = 'Lejárt';
                } else {
                    // Számítsuk ki az napokat, órákat, perceket és másodperceket
                    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

                    // Frissítsük a visszaszámlálót a kiszámított értékekkel
                    this.countdown = `${days} nap ${hours}:${minutes}:${seconds}`;
                }
            }, 1000);
        }
    },
};
</script>

<style scoped>
.countdown span{
    color: #0c66ee;
}
</style>