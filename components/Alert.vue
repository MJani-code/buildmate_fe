<!-- alert.vue gyerek komponens -->
<template>
    <div class="alert-container">
        <transition name="alert-animation"> <!-- 1. A transition komponens beállítása az animáció nevére -->
            <v-alert v-if="show" class="alert" :class="type"> <!-- Az animációs tranzíció alkalmazása a div-re -->
                <!-- Értesítés tartalma -->
                <v-card-text class="text-center alert-text">{{ this.message }}</v-card-text>
            </v-alert>
        </transition>
    </div>
</template>

<script>
export default {
    name: 'Alert',
    props: {
        message: {
            type: String,
            required: true,
        },
        show: {
            type: Boolean,
            required: true,
        },
        type: '',
    },
    methods: {

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
    transition: transform 0.5s;
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
