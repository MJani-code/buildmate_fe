<template>
  <v-app>
    <v-row>
      <v-col class="col-12 col-md-3 col-lg-3 col-xl-3">Szűrők</v-col>
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

            <!-- <select
              class="form-control"
              id="itemsPerPageSelect"
              v-model="itemsPerPage"
            >
              <option
                v-for="(option, index) in itemsPerPageOptions"
                :key="index"
                :value="option"
              >
                {{ option }}
              </option>
            </select> -->
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

          <!-- Lapozó
          <nav aria-label="Page navigation">
            <ul class="pagination">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <a class="page-link" href="#" @click="prevPage">Previous</a>
              </li>
              <li
                class="page-item"
                v-for="page in totalPages"
                :key="page"
                :class="{ active: page === currentPage }"
              >
                <a class="page-link" href="#" @click="gotoPage(page)">{{
                  page
                }}</a>
              </li>
              <li
                class="page-item"
                :class="{ disabled: currentPage === totalPages }"
              >
                <a class="page-link" href="#" @click="nextPage">Next</a>
              </li>
            </ul>
          </nav>-->

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
        const startIndex = (this.page - 1) * this.selectedPageSize;
        const endIndex = startIndex + this.selectedPageSize;
        this.historyList = this.products.slice(startIndex, endIndex);
      }
    },
    updatePage(pageIndex) {
      if (this.selectedPageSize === null) {
        // Ha az "Összes listázása" van kiválasztva, akkor az összes elemet megjelenítjük
        this.historyList = this.products;
      } else {
        const startIndex = (pageIndex - 1) * this.selectedPageSize;
        const endIndex = pageIndex * this.selectedPageSize;
        this.historyList = this.products.slice(startIndex, endIndex);
      }
      this.page = pageIndex;
    },
  },
  computed: {
    pages() {
      if (this.selectedPageSize === null || this.listCount == null) return 0;
      return Math.ceil(this.listCount / this.selectedPageSize);
    },
  },
};

// export default {
//   name: "ProductsList",
//   props: {
//     productsData: {
//       type: Array,
//       required: true,
//     },
//   },
//   data() {
//     return {
//       products: [{}],
//       itemsPerPageOptions: [4, 8, 12, 16], // A legördülő menü opciói
//       itemsPerPage: 4, // Az egy oldalon megjelenítendő kártyák száma
//       currentPage: 1,
//       page: 1,
//       pageSize: 2,
//       listCount: 0,
//       historyList: [],
//     };
//   },
//   mounted() {
//     if (this.error) {
//       this.checkError(this.error, {
//         show: true,
//         title: "Hiba",
//         message: "Hiba történt az adatok lekérése közben: " + this.error,
//         options: [],
//         type: "error",
//       });
//     }
//   },
//   created() {
//     this.products = [...this.productsData]; // Másolatot készítünk a props-ról

//     // Új módszer
//     let _this = this;
//     _this.initPage();
//     _this.updatePage(_this.page);
//   },
//   computed: {
//     paginatedProducts() {
//       const startIndex = (this.currentPage - 1) * this.itemsPerPage;
//       const endIndex = startIndex + this.itemsPerPage;
//       return this.products.slice(startIndex, endIndex);
//     },
//     totalPages() {
//       return Math.ceil(this.products.length / this.itemsPerPage);
//     },

//     // Új módszer
//     pages() {
//       let _this = this;
//       if (_this.itemsPerPage == null || _this.listCount == null) return 0;
//       return Math.ceil(_this.listCount / _this.itemsPerPage);
//     },
//   },
//   methods: {
//     prevPage() {
//       if (this.currentPage > 1) {
//         this.currentPage--;
//       }
//     },
//     nextPage() {
//       if (this.currentPage < this.totalPages) {
//         this.currentPage++;
//       }
//     },
//     gotoPage(page) {
//       this.currentPage = page;
//     },

//     // Új módszer
//     initPage: function () {
//       let _this = this;
//       _this.listCount = _this.products.length;
//       if (_this.listCount < _this.itemsPerPage) {
//         _this.historyList = _this.products;

//       } else {
//         _this.historyList = _this.products.slice(0, _this.itemsPerPage);

//       }
//     },
//     updatePage: function (pageIndex) {
//       console.log("updatelődik az oldal");
//       let _this = this;
//       let _start = (pageIndex - 1) * _this.itemsPerPage;
//       let _end = pageIndex * _this.itemsPerPage;
//       _this.historyList = _this.products.slice(_start, _end);
//       _this.page = pageIndex;

//     },
//   },
// };
</script>

<style>
/* Ezen a helyen stílusozd a kártyákat és a lapozót a Bootstrap segítségével */
</style>
