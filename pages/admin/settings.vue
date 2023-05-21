<template>
    <v-row>
        <v-col cols="12" md="6" lg="6" xl="6">
            <v-card class="profile">
                <v-card-title class="profile-title">Felhasználói profil</v-card-title>
                <v-card-text>
                    <v-form>
                        <v-container>
                            <v-row>
                                <v-col cols="12" sm="6" md="6" lg="6" xl="6">
                                    <v-text-field color="#359756" v-model="user.firstName" :readonly="!editMode"
                                        :filled="!editMode" label="Vezetéknév"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6" md="6" lg="6" xl="6">
                                    <v-text-field color="#359756" v-model="user.lastName" :readonly="!editMode"
                                        :filled="!editMode" label="Keresztnév"></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12">
                                    <v-text-field color="#359756" v-model="user.email" :readonly="!editMode"
                                        :filled="!editMode" label="E-mail"></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12" sm="6" md="6" lg="5" xl="6">
                                    <v-text-field color="#359756" v-model="user.phoneNumber" :readonly="!editMode"
                                        :filled="!editMode" label="Telefonszám"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6" md="6" lg="4" xl="6">
                                    <v-text-field color="#359756" v-model="user.stairCase" :readonly="!editMode"
                                        :filled="!editMode" label="Lépcsőház"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6" md="6" lg="3" xl="6">
                                    <v-text-field color="#359756" v-model="user.flat" :readonly="!editMode"
                                        :filled="!editMode" label="Lakás"></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row>

                            </v-row>
                        </v-container>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-btn v-if="editMode" @click="editMode = false">Mégsem</v-btn>
                    <v-btn v-if="!editMode" @click="editMode = true">Szerkesztés</v-btn>
                    <v-btn v-else color="#359756" @click="saveProfile">Profil mentése</v-btn>
                </v-card-actions>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
export default {
    data() {
        return {
            user: {
                firstName: '',
                lastName: '',
                email: '',
                phoneNumber: '',
                stairCase: '',
                flat: '',
            },
            editMode: false
        };
    },
    mounted() {
        // Profiladatok lekérdezése
        this.fetchProfileData();
    },
    methods: {
        saveProfile() {
            // Felhasználói profil mentése
            //TODO implementálni a mentési logikát a profil mentésére (pl. API hívás)
            console.log('Profil mentve:', this.user);
            this.editMode = false;
        },
        fetchProfileData() {
            // TODO implementálni a profiladatok lekérésének logikáját (pl. API hívás)
            // A profiladatokat a `user` adat tulajdonságba mentheted
            this.user = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                phoneNumber: '1212444',
                stairCase: 'A',
                flat: '3',
            };
        }
    }
};
</script>

<style scoped>
.profile {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.profile-title {
    font-size: 24px;
    text-align: center;
    margin-bottom: 20px;
}
</style>
