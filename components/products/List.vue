<template>
  <v-app>
    <v-row>
      <v-col class="col-12 col-md-3 col-lg-3 col-xl-3">
        <!-- Szűrő 1 -->
        <v-card>
          <v-expansion-panels v-model="expandedPanels" multiple>
            <v-expansion-panel id="panel1" v-if="showPanel==true">
              <v-expansion-panel-header>Cím</v-expansion-panel-header>
              <v-expansion-panel-content>
                <div class="scrollable-panel">
                  <v-checkbox
                    v-for="(filter, index) in filters.title"
                    :key="index"
                    v-model="filter.active"
                    :label="filter.label"
                    @click="toggleFilter(filter)"
                    class="small-checkbox"
                  ></v-checkbox>
                </div>
              </v-expansion-panel-content>
            </v-expansion-panel>

            <!-- Szűrő 2 -->
            <v-expansion-panel id="panel2" v-if="showPanel==true">
              <v-expansion-panel-header>Kategória</v-expansion-panel-header>
              <v-expansion-panel-content>
                <div class="scrollable-panel">
                  <v-checkbox
                    v-for="(filter, index) in filters.title"
                    :key="index"
                    v-model="filter.active"
                    :label="filter.label"
                    @click="toggleFilter(filter)"
                    class="small-checkbox"
                  ></v-checkbox>
                </div>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
          <div style="display: block; margin: 20px 20px"></div>
        </v-card>
      </v-col>

      <v-col class="col-12 col-md-9 col-lg-9 col-xl-9">
        <div class="container">
          <!-- Legördülő menü a kártyák számának testreszabásához -->
          <v-select
            :items="perPageOptions"
            v-model="perPage"
            label="Találat oldalanként"
            item-text="label"
            item-value="value"
            outlined
          ></v-select>

          <div class="row">
            <div
              class="col-md-4"
              v-for="(product, index) in visibleProducts"
              :key="index"
            >
              <!-- Kártya megjelenítése -->
              <v-card class="mx-auto my-12" max-width="300" v-if="product">
                <template slot="progress">
                  <v-progress-linear
                    color="blue darken-2"
                    height="10"
                    indeterminate
                  ></v-progress-linear>
                </template>

                <v-img height="200" :src="product.url"></v-img>

                <v-card-title class="d-flex">
                  <span class="align-self-start">{{ product.title }}</span>
                  <span>
                    <v-icon
                      class="align-self-end text-subtitle-1 mdi mdi-tag"
                      color="blue darken-2"
                    >
                      {{ product.grossPrice + " " + product.currency }}
                    </v-icon>
                  </span>
                </v-card-title>

                <v-divider class="mx-4"></v-divider>
                <v-card-text>
                  <v-row align="center" class="mb-1"> </v-row>
                  <div class="pb-1">
                    <v-icon
                      class="mt-2 text-subtitle-1 mdi mdi-office-building"
                    >
                      {{ product.shopName }}
                    </v-icon>
                  </div>
                  <div class="pb-1">
                    <v-icon class="mt-2 text-subtitle-1 mdi mdi-map-marker">
                      {{
                        product.reedemPostalCode +
                        " " +
                        product.reedemCity +
                        " " +
                        product.reedemAddress
                      }}
                    </v-icon>
                  </div>
                </v-card-text>

                <div class="d-flex align-center">
                  <v-card-title class="align-self-start subtitle-1">
                    <LandingCountdown
                      :expirationDate="product.validityEndDate"
                    ></LandingCountdown>
                  </v-card-title>
                  <v-card-title class="align-self-end">
                    <v-btn color="blue darken-2" text> Érdekel </v-btn>
                  </v-card-title>
                </div>
              </v-card>
            </div>
          </div>

          <!-- Lapozó -->
          <template>
            <div class="text-center">
              <v-container>
                <v-row justify="center">
                  <v-col cols="8">
                    <v-container class="max-width">
                      <v-pagination
                        class="pagination mb-2"
                        v-model="currentPage"
                        :length="totalPages"
                      ></v-pagination>
                    </v-container>
                  </v-col>
                </v-row>
              </v-container>
            </div>
          </template>
        </div>
      </v-col>
    </v-row>
  </v-app>
</template>

<script>
export default {
  name: "ProductsList",
  props: {
    productsData: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      products: [], // Kártyák listája
      perPageOptions: [
        {label: '5', value: 5},
        {label: '10', value: 10},
        {label: '50', value: 50},
        {label: '100', value: 100},
        {label: 'Összes', value: this.productsData.length}
      ],
      perPage: 5, // Megjelenített elemek száma oldalanként
      currentPage: 1, // Jelenlegi oldal
      expandedPanels: [0,1],
      showPanel: true,
      filters: {
        title: [
          { label: "Szűrés 1", value: "Title 15", active: false },
          { label: "Szűrés 2", value: "Title 16", active: false },
          { label: "Szűrés 3", value: "Title 17", active: false },
        ],
        category: [],
        price: [],
      },
      // Itt adhatsz hozzá további szűrési feltételeket
    };
  },
  // Komponens kódjában
  mounted() {
    console.log(this.perPageOptions);
  },

  created() {
    this.products = [...this.productsData]; // Másolatot készítünk a props-ról
  },
  computed: {
    // Szűrt kártyák listája a szűrők alapján
    filteredProducts() {
      return this.products.filter((product) => {
        const activeFilters = this.filters.title.filter(
          (filter) => filter.active
        );
        const activeValues = activeFilters.map((filter) => filter.value);

        return this.filters.title.every((filter) => {
          if (activeValues.length > 0) {
            return activeValues.some((word) => product.title.includes(word));
          }
          return true; // Ha a szűrő inaktív, akkor ne korlátozzuk a kiválasztást
        });
      });
    },
    // Teljes oldalszám a lapozóhoz
    totalPages() {
      return Math.ceil(this.filteredProducts.length / this.perPage);
    },
    // Az aktuális oldalon látható termékek
    visibleProducts() {
      const startIndex = (this.currentPage - 1) * this.perPage;
      if (this.perPage > this.products.length) {
        return this.filteredProducts.slice(
          startIndex,
          startIndex + this.products.length
        );
      } else {
        return this.filteredProducts.slice(
          startIndex,
          startIndex + this.perPage
        );
      }
    },
  },
  methods: {
    toggleFilter(filter) {
      filter.active != filter.active;
    },
  },
  watch: {
    //
  },
};
</script>

<style >
/* CSS stílusok a komponenshez */
.card {
  margin: 20px 0;
  border: 1px solid #ccc;
  padding: 10px;
}
.scrollable-panel {
  max-height: 200px; /* Itt rögzítheted a panel magasságát */
  overflow-y: auto; /* Ezzel a tulajdonsággal jelenik meg a görgetősáv, ha szükséges */
}

.v-input--selection-controls .v-input__slot > .v-label,
.v-input--selection-controls .v-radio > .v-label {
  font-size: 14px;
}

.v-messages.theme--light {
  display: none;
}
.v-input__slot {
  margin-bottom: 0px;
}

.v-input--selection-controls {
  margin-top: 0px;
  margin-left: 10px;
}
[type="text"]:focus {
  --tw-ring-offset-shadow: unset;
  --tw-ring-shadow: unset;
}
</style>
