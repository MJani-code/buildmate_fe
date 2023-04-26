<!-- alert.vue gyerek komponens -->
<template>
    <div class="alert-container">
        <transition name="alert-animation"> <!-- 1. A transition komponens beállítása az animáció nevére -->
            <v-alert v-if="AlertToShow" class="alert" :class="type"> <!-- Az animációs tranzíció alkalmazása a div-re -->
                <!-- Értesítés tartalma -->
                <v-card-text class="text-center alert-text">Sikeres</v-card-text>
            </v-alert>
        </transition>
    </div>
</template>

<script>
export default {
    name: 'Alert',
    props: {
        show: Boolean,
        showMessage: String
    },
    data() {
        return {
            type: 'success',
            AlertToShow: false,
        };
    },
    methods: {
        showAlert() {
            if (this.props.show === true) {
                this.AlertToShow === true;
                setTimeout(() => {
                    this.AlertToShow = false; // Az értesítés elrejtése
                }, 5000);
            }
        }
    }
};
</script>

<style scoped>
.alert {
    /* Az értesítés stílusa */
    color: white;
    border-radius: 40px;
    padding: 5px;
    position: fixed;
    bottom: 10px;
    /* Az értesítés pozíciója az aljánál */
    left: 0;
    right: 0;
    margin: 0 auto;
    max-width: 300px;
    z-index: 100;
}

/* 2. Az animáció nevének beállítása */
.alert-animation-enter-active,
.alert-animation-leave-active {
    /* 3. Az animációs időtartam beállítása (0.5 másodperces idővel) */
    transition: transform 1s;
}

/* 3. Az animáció beállítása */
.alert-animation-enter {
    transform: translateY(100%);
    /* Az értesítés kiinduló pozíciója (alulról) */
}

.alert-animation-leave-active {
    transform: translateY(100%);
    /* Az értesítés kiinduló pozíciója (alulról) */
}

.alert-text {
    font-size: 15px;
}
</style>
