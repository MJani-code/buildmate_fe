<template>
  <v-app>
    <v-row>
      <v-col class="col-12 col-md-3 col-lg-3 col-xl-3">
        <!-- Szűrési feltételek -->
        <v-card>
          <v-card-title>Szűrés</v-card-title>
          <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-header> </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-form>
                  <v-checkbox
                    v-for="(filter, index) in filters"
                    :key="index"
                    :value="filter.value"
                    :label="filter.label"
                    @change="toggleFilter(filter)"
                    v-model="filter.active"
                    color="#359756"
                  ></v-checkbox>
                </v-form>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
          <div style="display: block; margin: 20px 20px"></div>
        </v-card>
      </v-col>
      <v-col class="col-12 col-md-9 col-lg-9 col-xl-9">
        <div class="container">
          <!-- Legördülő menü a kártyák számának testreszabásához -->
          <div class="form-group">
            <label for="itemsPerPageSelect">Kártyák száma oldalanként:</label>
            <select v-model="selectedPageSize" @change="updatePageSize">
              <option :value="null">Összes listázása</option>
              <option
                v-for="option in pageSizeOptions"
                :key="option"
                :value="option"
              >
                {{ option }}
              </option>
            </select>
          </div>

          <div class="row">
            <div
              class="col-md-4"
              v-for="(product, index) in historyList"
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

          <!-- Lapozó 2 -->
          <template>
            <div class="text-center">
              <v-container>
                <v-row justify="center">
                  <v-col cols="8">
                    <v-container class="max-width">
                      <v-pagination
                        class="pagination mb-2"
                        v-model="page"
                        :length="pages"
                        @input="updatePage"
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
      page: 1,
      selectedPageSize: null, // A kiválasztott pageSize
      pageSizeOptions: [2, 4, 6, 8], // Az elérhető pageSize lehetőségek
      products: [{}],
      listCount: 0,
      historyList: [],
      filters: [
        { label: "Szűrés 1", value: "Title 15", active: false },
        { label: "Szűrés 2", value: "Title 16", active: false },
        { label: "Szűrés 3", value: "Title 17", active: false },
        // Itt adhatsz hozzá további szűrési feltételeket
      ],
    };
  },
  created() {
    this.products = [...this.productsData]; // Másolatot készítünk a props-ról

    this.initPage();
    this.updatePage(this.page);
  },
  methods: {
    initPage() {
      this.listCount = this.products.length;
      this.updatePageSize();
    },
    updatePageSize() {
      if (this.selectedPageSize === null) {
        // Ha az "Összes listázása" van kiválasztva, akkor az összes elemet megjelenítjük
        this.historyList = this.products;
      } else {
        this.listCount = this.historyList.length;

        const filteredProducts = this.products.filter((product) => {
          return (
            this.activeFilters.length === 0 ||
            this.activeFilters.every((activeFilter) => {
              return product.title.includes(activeFilter.value);
            })
          );
        });

        const startIndex = (this.page - 1) * this.selectedPageSize;
        const endIndex = startIndex + this.selectedPageSize;
        this.historyList = filteredProducts.slice(startIndex, endIndex);

      }
    },
    updatePage(pageIndex) {
      if (this.selectedPageSize === null) {
        // Ha az "Összes listázása" van kiválasztva, akkor az összes elemet megjelenítjük
        this.historyList = this.products;
      } else {
        // Frissítjük az oldalak számát az aktív szűrők alapján
        this.listCount = this.historyList.length;

        //Szűrjük az aktív szűrők alapján
        const filteredProducts = this.products.filter((product) => {
          return (
            this.activeFilters.length === 0 ||
            this.activeFilters.every((activeFilter) => {
              return product.title.includes(activeFilter.value);
            })
          );
        });

        // Frissítjük a megjelenített termékek listáját
        const startIndex = (pageIndex - 1) * this.selectedPageSize;
        const endIndex = startIndex + this.selectedPageSize;
        this.historyList = filteredProducts.slice(startIndex, endIndex);

      }
      this.page = pageIndex;
    },
    toggleFilter(filter) {
      // Frissítsd a szűrést minden szűrőváltoztatásnál
      this.updateFilteredItems();
      console.log(this.activeFilters);
    },
    updateActiveFilters() {
      this.updateFilteredItems();
      console.log(this.activeFilters);
    },
    updateFilteredItems() {
      // Szűrjük a termékeket az aktív szűrők alapján
      this.historyList = this.products.filter((product) => {
        // Ellenőrizzük, hogy a termék megfelel-e legalább egy aktív szűrőnek
        return (
          this.activeFilters.some((activeFilter) => {
            return product.title.includes(activeFilter);
          }) ||
          // Ha nincs aktív szűrő, minden terméket megjelenítünk
          this.activeFilters.length === 0
        );
      });
      // Frissítsd a listCount értékét
      this.listCount = this.historyList.length;
      // Alaphelyzetben az első oldalra irányít
      this.page = 1;
    },
  },
  computed: {
    activeFilters() {
      return this.filters
        .filter((filter) => filter.active)
        .map((filter) => filter.value);
    },
    pages() {
      if (this.selectedPageSize === null || this.listCount == null) return 0;
      return Math.ceil(this.listCount / this.selectedPageSize);
    },
  },
};
</script>

<style>
/* Ezen a helyen stílusozd a kártyákat és a lapozót a Bootstrap segítségével */
</style>
