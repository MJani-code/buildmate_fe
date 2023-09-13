<template>
  <v-app class="px-4">
    <v-row>
      <v-col class="col-12 col-md-3 col-lg-3 col-xl-3">
        <!-- Szűrő 1 -->
        <v-card>
          <v-expansion-panels v-model="expandedPanels" multiple>
            <v-expansion-panel id="panel1" v-if="showPanel == true">
              <v-expansion-panel-header>Település</v-expansion-panel-header>
              <v-expansion-panel-content>
                <div class="scrollable-panel">
                  <v-checkbox
                    v-for="(filter, index) in filters.reedemCity"
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
            <v-expansion-panel id="panel2" v-if="showPanel == true">
              <v-expansion-panel-header>Kerület</v-expansion-panel-header>
              <v-expansion-panel-content>
                <div class="scrollable-panel">
                  <v-checkbox
                    v-for="(filter, index) in filters.reedemDistrict"
                    :key="index"
                    v-model="filter.active"
                    :label="filter.label"
                    @click="toggleFilter(filter)"
                    class="small-checkbox"
                  ></v-checkbox>
                </div>
              </v-expansion-panel-content>
            </v-expansion-panel>

            <!-- Szűrő 3 -->
            <v-expansion-panel id="panel3" v-if="showPanel == true">
              <v-expansion-panel-header>Kategória</v-expansion-panel-header>
              <v-expansion-panel-content>
                <div class="scrollable-panel">
                  <v-checkbox
                    v-for="(filter, index) in filters.category"
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

          <div class="row listing-products">
            <div
              class="col-md-4"
              v-for="(product, index) in visibleProducts"
              :key="index"
            >
              <!-- Kártya megjelenítése -->
              <v-card class="mx-auto" max-width="300" v-if="product">
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
                  <v-card-title class="align-self-start subtitle-1 countdown-parent">
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
        { label: "5", value: 5 },
        { label: "10", value: 10 },
        { label: "50", value: 50 },
        { label: "100", value: 100 },
        { label: "Összes", value: this.productsData.length },
      ],
      perPage: 5, // Megjelenített elemek száma oldalanként
      currentPage: 1, // Jelenlegi oldal
      expandedPanels: [0, 1, 2],
      showPanel: true,
      filters: {
        reedemCity: [{}],
        reedemDistrict: [{}],
        category: [{}],
        price: [],
      },
      // Itt adhatsz hozzá további szűrési feltételeket
    };
  },
  // Komponens kódjában
  mounted() {
    //
  },

  created() {
    this.products = [...this.productsData]; // Másolatot készítünk a props-ról
    this.filters2;
  },

  computed: {
    // Szűrt kártyák listája a szűrők alapján
    filteredProducts() {
      const activeCityFilters = this.filters.reedemCity.filter(
        (filter) => filter.active
      );
      const activeDistrictFilters = this.filters.reedemDistrict.filter(
        (filter) => filter.active
      );
      const activeCategoryFilters = this.filters.category.filter(
        (filter) => filter.active
      );

      return this.products.filter((product) => {
        const cityMatches =
          activeCityFilters.length === 0 ||
          activeCityFilters.some((filter) =>
            product.reedemCity.includes(filter.value)
          );

          console.log(product.reedemDistrict);
        const districtMatches =
          activeDistrictFilters.length === 0 ||
          activeDistrictFilters.some((filter) =>
            product.reedemDistrict.toString().includes(filter.value)
          );
        const categoryMatches =
          activeCategoryFilters.length === 0 ||
          activeCategoryFilters.some((filter) =>
            product.category.includes(filter.value)
          );

        // Ellenőrizd, hogy a bevitt szöveg megegyezik-e a title vagy category mezőkkel
        // const searchMatches =
        //   product.title.toLowerCase().includes(searchText) ||
        //   product.category.toLowerCase().includes(searchText);

        return cityMatches && categoryMatches && districtMatches;
      });
    },
    filters2() {
      this.filters.reedemCity = [];
      this.filters.reedemDistrict = [];
      this.filters.category = [];

      let categories = [];
      let uniqueCategories = [];

      let reedemDistricts = [];
      let uniqueReedemDistricts = [];

      return this.filteredProducts.forEach((product) => {
        this.filters.reedemCity.push({
          label: product.reedemCity,
          value: product.reedemCity,
          active: false,
        });

        reedemDistricts.push({
          label: product.reedemDistrict.toString(),
          value: product.reedemDistrict.toString(),
          active: false,
        });

        categories.push({
          label: product.category,
          value: product.category,
          active: false,
        });

        for (const key in categories) {
          let value = categories[key].label;
          if (!uniqueCategories.some((category) => category.label === value)) {
            uniqueCategories.push({
              label: value,
              value: categories[key].value,
              active: false,
            });
          }
        }
        this.filters.category = uniqueCategories;

        for (const key in reedemDistricts) {
          let value = reedemDistricts[key].label;
          if (!uniqueReedemDistricts.some((reedemDistrict) => reedemDistrict.label === value)) {
            uniqueReedemDistricts.push({
              label: value.toString(),
              value: reedemDistricts[key].value,
              active: false,
            });
          }
        }
         this.filters.reedemDistrict = uniqueReedemDistricts;
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
.listing-products{
  max-height: 100vh;
  overflow: auto;
}
.countdown-parent{
  padding: 8px;
  margin: auto;
}
</style>
