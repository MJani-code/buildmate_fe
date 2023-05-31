<template>
    <v-row>
        <v-col class="pa-2 col-12 col-sm-3 col-md-3 col-lg-3 col-xl-3">
            <v-card elevation="12" outlined tile height="100%">
                <v-list-item two-line>
                    <v-banner class="custom">
                        <v-avatar slot="icon" color="#359756" size="50">
                            <v-icon icon="mdi-calendar-multiple" color="white" class="ma-2">mdi-file-document</v-icon>
                        </v-avatar>
                    </v-banner>
                    <v-list-item-content>
                        <v-list-item-title class="text-h5 mb-1">
                            <router-link to="documents" class="routerLink">1</router-link>
                        </v-list-item-title>
                        <v-list-item-subtitle class="text-truncate">
                                nyitott számla
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </v-card>
        </v-col>
        <v-col class="pa-2 col-12 col-sm-3 col-md-3 col-lg-3 col-xl-3">
            <v-card elevation="12" outlined tile height="100%">
                <v-list-item two-line>
                    <v-banner class="custom">
                        <v-avatar slot="icon" color="#359756" size="50">
                            <v-icon icon="mdi-calendar-multiple" color="white" class="ma-2">mdi-calendar-multiple</v-icon>
                        </v-avatar>
                    </v-banner>
                    <v-list-item-content>
                        <v-list-item-title class="text-h5 mb-1">
                            <router-link to="events" class="routerLink">5</router-link>
                        </v-list-item-title>
                        <v-list-item-subtitle class="text-truncate">
                                közeli esemény
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </v-card>
        </v-col>
        <v-col class="pa-2 col-12 col-sm-3 col-md-3 col-lg-3 col-xl-3">
            <v-card elevation="12" outlined tile height="100%">
                <v-list-item two-line>
                    <v-banner class="custom">
                        <v-avatar slot="icon" color="#359756" size="50">
                            <v-icon icon="mdi-calendar-multiple" color="white" class="ma-2">mdi-poll</v-icon>
                        </v-avatar>
                    </v-banner>
                    <v-list-item-content>
                        <v-list-item-title class="text-h5 mb-1">
                            <router-link to="polls" class="routerLink">0</router-link>
                        </v-list-item-title>
                        <v-list-item-subtitle class="text-truncate">
                                aktuális szavazások
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </v-card>
        </v-col>
        <v-col class="pa-2 col-12 col-sm-3 col-md-3 col-lg-3 col-xl-3">
            <v-card elevation="12" outlined tile height="100%">
                <v-list-item two-line>
                    <v-banner class="custom">
                        <v-avatar slot="icon" color="#359756" size="50">
                            <v-icon icon="mdi-calendar-multiple" color="white" class="ma-2">mdi-calendar-check</v-icon>
                        </v-avatar>
                    </v-banner>
                    <v-list-item-content>
                        <v-list-item-title class="text-h5 mb-1">
                            <router-link to="todo" class="routerLink">3</router-link>
                        </v-list-item-title>
                        <v-list-item-subtitle class="text-truncate">
                                elvégzendő feladat
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </v-card>
        </v-col>
        <v-col class="pa-2 col-12 col-sm-3 col-md-3 col-lg-3 col-xl-3">
            <v-card elevation="12" outlined tile height="100%">
                <v-list-item two-line>
                    <v-banner class="custom">
                        <v-avatar slot="icon" color="#359756" size="50">
                            <v-icon icon="mdi-calendar-multiple" color="white" class="ma-2">mdi-message-badge</v-icon>
                        </v-avatar>
                    </v-banner>
                    <v-list-item-content>
                        <v-list-item-title class="text-h5 mb-1">
                            <router-link to="statements" class="routerLink">2</router-link>
                        </v-list-item-title>
                        <v-list-item-subtitle class="text-truncate">
                                nyitott bejelentés
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </v-card>
        </v-col>
    </v-row>
</template>

<style >
.custom>div {
    border-bottom: unset !important;
}

.routerLink {
    text-decoration: none;
    color: initial !important;
}
.v-application .text-truncate{
    text-overflow: unset !important;
    white-space: normal !important;
}
</style>