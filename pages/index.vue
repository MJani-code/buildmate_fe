<template>
  <div class="w-full">
    <ResponseHandlerModal></ResponseHandlerModal>

    <!-- First section -->
    <section id="hero" class="w-full pb-24">
      <BaseSection>
        <div
          class="col-span-12 lg:col-span-6 mt-12 xl:mt-10 space-y-4 sm:space-y-6 px-6 text-center sm:text-left"
        >
          <h1
            data-aos="fade-right"
            data-aos-once="true"
            class="text-[2.5rem] sm:text-4xl xl:text-5xl font-bold leading-tight sm:pr-8 xl:pr-10"
          >
            Adj második esélyt a
            <span class="text-header-gradient">termékednek</span>
            <p class="mt-8"></p>
            Vásárold vagy add el nálunk!
          </h1>
          <p
            data-aos="fade-down"
            data-aos-once="true"
            data-aos-delay="300"
            class="paragraph hidden sm:block"
          >
            Célunk, hogy a fenntartható vásárlás és az értékek megőrzése révén
            pozitív változást hozzunk a környezetünkben és az ügyfeleink
            életében.
          </p>
          <div
            data-aos="fade-up"
            data-aos-once="true"
            data-aos-delay="700"
            class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-2"
          >
            <router-link to="/products">
              <BaseButton
                class="max-w-full px-8 py-4 bg-gradient-to-r from-[#468ef9] to-[#0c66ee] border border-[#0c66ee] text-white"
              >
                Ugrás a termékekhez
              </BaseButton>
            </router-link>
          </div>
        </div>
        <div class="hidden sm:block col-span-12 lg:col-span-6">
          <div class="w-full">
            <img
              data-aos="fade-up"
              data-aos-once="true"
              :src="require('~/assets/img/11235588_10814.jpg')"
              class="-mt-4"
              alt=""
            />
          </div>
        </div>
        <img
          data-aos="fade-up"
          data-aos-delay="300"
          :src="require('~/assets/img/pattern/ellipse-1.png')"
          class="hidden sm:block absolute bottom-12 xl:bottom-16 left-4 xl:left-0 w-6"
        />
        <img
          data-aos="fade-up"
          data-aos-delay="300"
          :src="require('~/assets/img/pattern/ellipse-2.png')"
          class="hidden sm:block absolute top-4 sm:top-10 right-64 sm:right-96 xl:right-[32rem] w-6"
        />
        <img
          data-aos="fade-up"
          data-aos-delay="300"
          :src="require('~/assets/img/pattern/ellipse-3.png')"
          class="hidden sm:block absolute bottom-56 right-24 w-6"
        />
        <img
          data-aos="fade-up"
          data-aos-delay="300"
          :src="require('~/assets/img/pattern/star.png')"
          class="hidden sm:block absolute top-20 sm:top-28 right-16 lg:right-0 lg:left-[30rem] w-8"
        />
        <!-- TODO: új termék hozzáadásához gomb és funciot -->
        <!-- <BaseButton @click="addToCart({ name: 'Product' })"
          >Termék hozzáadása a kosárhoz</BaseButton
        >-->
      </BaseSection>
    </section>

    <!-- Second section - New products -->
    <section
      class="max-w-screen-xl mx-2 sm:mx-auto px-4 sm:px-6 lg:px-0 py-6 pb-20 sm:py-8 rounded-[2.25rem] sm:rounded-xl bg-white shadow-lg sm:shadow-md transform lg:-translate-y-12"
      v-if="newProducts"
    >
      <div class="w-full pb-6 items-center">
        <h2
          data-aos="flip-down"
          class="text-3xl sm:text-4xl font-semibold text-center"
        >
          Legújabb termékek
        </h2>
      </div>
      <div class="w-full flex flex-col lg:flex-row items-center justify-center">
        <LandingNewProducts
          v-for="(product, index) in newProducts"
          :key="index"
          data-aos="fade-up"
          :data-aos-delay="index === 0 ? 0 : index === 1 ? 150 : 300"
          :expirationDate="product.validityEndDate"
          :productPrice="product.netPrice"
          :productCurrency="product.currency"
          :productTitle="product.title"
          :productLocation="
            product.reedemPostalCode +
            ' ' +
            product.reedemCity +
            ' ' +
            product.reedemAddress
          "
          :productImage="product.url"
          :productShopName="product.shopName"
          class="xl:border-r border-gray-200 lg:px-8"
        />
      </div>
    </section>

    <!-- Third section -->
    <section class="w-full my-24">
      <BaseSection>
        <LandingWinWin class="sm:hidden mb-8" />
        <div
          data-aos="fade-right"
          class="col-span-12 lg:col-span-6 mt-4 xl:mt-20 space-y-6 px-4"
        >
          <h2 class="text-4xl font-semibold sm:pr-8 xl:pr-12">
            Win-win! <br class="hidden sm:block" />
          </h2>
          <p class="paragraph">
            Ismerd meg új alkalmazásunkat, amely lehetővé teszi vállalkozások
            számára, hogy gyorsan és hatékonyan értékesítsék megmaradt
            erőforrásaikat és termékeiket kiemelkedően alacsony áron. Ők cserébe
            kedvezményesen kínálják termékeiket
            <br class="hidden sm:block" />
            <br class="hidden sm:block" />
            Csatlakozz hozzánk, és segítsünk együtt csökkenteni a veszteséget,
            miközben maximalizáljuk a kihasználtságot és az eredményeket!
          </p>
          <div class="space-y-6 lg:pr-12">
            <router-link to="/products">
              <BaseButton
                class="w-full px-5 py-4 bg-blue-gradient text-white text-base font-medium"
                >Ugrás a termékekhez</BaseButton
              >
            </router-link>
          </div>
        </div>
        <LandingWinWin data-aos="fade-left" class="hidden sm:block" />
      </BaseSection>
    </section>

    <!-- Thourth section - Getting started section -->
    <section
      class="bg-trading-tools relative max-w-full sm:mx-4 xl:mx-10 my-24 shadow sm:rounded-2xl overflow-hidden"
    >
      <div class="w-full py-16 flex flex-col items-center">
        <h2
          data-aos="flip-down"
          class="text-3xl sm:text-4xl font-semibold text-center"
        >
          Hogyan működik?
        </h2>
        <div
          data-aos="fade-up"
          class="relative w-full flex flex-col lg:flex-row items-center justify-between space-y-12 lg:space-y-0 px-4 xl:px-10 mt-16 sm:mt-8"
        >
          <LandingStep v-for="step in steps" :key="step.title" :step="step" />
          <img
            :src="require('~/assets/img/getting-started/arrow.png')"
            class="hidden lg:inline-block absolute top-32 left-64 xl:left-[22rem] w-24 xl:w-[9.5rem]"
            alt=""
          />
          <img
            :src="require('~/assets/img/getting-started/arrow.png')"
            class="hidden lg:inline-block absolute top-32 right-64 xl:right-[22rem] w-24 xl:w-[9.5rem]"
            alt=""
          />
        </div>
      </div>
    </section>

    <!-- Fifth section - Partners section -->
    <section
      class="bg-partner relative max-w-full sm:mx-6 my-24 shadow sm:rounded-2xl overflow-hidden"
      v-if="partners"
    >
      <div
        class="w-full px-6 sm:px-0 py-16 flex flex-col items-center justify-center space-y-4 text-center"
      >
        <h3
          data-aos="flip-down"
          class="text-2xl text-neutral-800 font-semibold"
        >
          Partnereink
        </h3>
        <!-- <p data-aos="flip-down" class="paragraph">
          We're partners with countless major organisations around the globe
        </p> -->
        <div
          data-aos="fade-up"
          class="flex flex-wrap items-center justify-center"
        >
          <LandingPartnerImage
            v-for="img in partners"
            :key="img.id"
            :img="img.companyLogoPath"
          />
        </div>
      </div>
    </section>

    <!-- Credit card section -->
    <!-- <section class="w-full my-36">
      <BaseSection data-aos="fade-down">
        <div class="col-span-12 lg:col-span-7">
          <div class="w-full">
            <img
              :src="require('~/assets/img/nefa-cc.webp')"
              class="w-[95%]"
              alt=""
            />
          </div>
        </div>
        <div class="col-span-12 lg:col-span-5 space-y-6 px-4 sm:px-6 mt-20">
          <h2 class="text-4xl font-semibold">
            Introducing the
            <span class="text-header-gradient">NEFA</span> Credit Card
          </h2>
          <p class="paragraph">
            Subject to cardholder and rewards terms which will be available at
            application.
          </p>
          <ul class="space-y-4 sm:space-y-2">
            <LandingListItem title="Up to 3% back on purchases" />
            <LandingListItem
              title="Earn rewards in bitcoin or any crypto on NEFA"
            />
            <LandingListItem title="No annual fee" />
          </ul>
          <BaseButton
            class="w-full sm:max-w-[240px] px-10 py-4 bg-inherit text-gradient border border-[#0c66ee] text-base"
            >Join the waitlist</BaseButton
          >
        </div>
      </BaseSection>
    </section> -->

    <!-- Advanced trading tools section -->
    <!-- <section
      class="bg-trading-tools relative max-w-full sm:mx-4 my-20 py-16 shadow rounded-2xl overflow-hidden"
    >
      <div
        class="relative max-w-screen-xl px-4 sm:px-2 mx-auto grid grid-cols-12 gap-x-6"
      >
        <LandingTradingToolImage class="sm:hidden" />
        <div
          data-aos="fade-right"
          class="col-span-12 lg:col-span-6 space-y-8 sm:space-y-6 px-4 sm:px-6 mt-8"
        >
          <h2 class="text-4xl font-semibold">
            Advanced Trading <span class="text-header-gradient">Tools</span>
          </h2>
          <div class="space-y-2">
            <h4 class="text-lg font-medium">
              Professional Access, Non-stop Availability
            </h4>
            <p class="paragraph text-sm xl:text-base">
              We provide premium access to crypto trading for both individuals
              and institutions through high liquidity, reliable order execution
              and constant uptime.
            </p>
          </div>
          <div class="space-y-2">
            <h4 class="text-lg font-medium">A Range of Powerful Apis</h4>
            <p class="paragraph text-sm xl:text-base">
              Set up your own trading interface or deploy your algorithmic
              strategy with our high-performance FIX and HTTP APIs. Connect to
              our WebSocket for real-time data streaming.
            </p>
          </div>
          <div class="space-y-2">
            <h4 class="text-lg font-medium">Customer Support</h4>
            <p class="paragraph text-sm xl:text-base">
              Premium 24/7 support available to all customers worldwide by phone
              or email. Dedicated account managers for partners.
            </p>
          </div>
          <div class="flex flex-col sm:flex-row">
            <BaseButton
              class="px-10 py-4 bg-inherit text-gradient border border-[#4A8FF6] text-base"
            >
              Get Started
            </BaseButton>
            <BaseButton
              class="bg-inherit text-[#4A8FF6] px-10 py-4 text-center underline rounded-full"
            >
              Learn More
            </BaseButton>
          </div>
        </div>
        <LandingTradingToolImage data-aos="fade-left" class="hidden sm:block" />
      </div>
    </section> -->

    <!-- Industry-leading security section -->
    <!-- <section class="w-full my-24">
      <div
        class="relative max-w-screen-xl px-8 mx-auto grid grid-cols-12 gap-x-6"
      >
        <div data-aos="fade-right" class="col-span-12 lg:col-span-6">
          <div class="w-full">
            <img
              :src="require('~/assets/img/industry-leading-security.webp')"
              class="w-full"
              alt=""
            />
          </div>
        </div>
        <div
          data-aos="fade-left"
          class="col-span-12 lg:col-span-5 space-y-8 sm:space-y-6 mt-8 xl:px-8"
        >
          <h2 class="text-4xl font-semibold">
            Industry-leading security from day one
          </h2>
          <ul class="space-y-8 sm:space-y-4">
            <LandingListItem title="Safety, security and compliance">
              <p class="text-sm text-gray-700 leading-relaxed">
                NEFA is a licensed New York trust company that undergoes regular
                bank exams and is subject to the cybersecurity audits conducted
                by the New York Department of Financial Services.
                <span class="underline">Learn more</span> about our commitment
                to security.
              </p>
            </LandingListItem>
            <LandingListItem title="Hardware security keys">
              <p class="text-sm text-gray-700 leading-relaxed">
                With NEFA you can secure your account with a hardware security
                key via WebAuthn.
              </p>
            </LandingListItem>
            <LandingListItem title="SOC Certifications">
              <p class="text-sm text-gray-700 leading-relaxed">
                NEFA is <span class="underline">SOC 1 Type 2</span> and
                <span class="underline">SOC 2 Type 2</span> compliant. We are
                the world’s first cryptocurrency exchange and custodian to
                complete these exams.
              </p>
            </LandingListItem>
          </ul>
        </div>
      </div>
    </section> -->

    <!-- FAQ section -->
    <section class="w-full my-24">
      <BaseSection>
        <div
          data-aos="fade-right"
          data-aos-delay="150"
          class="col-span-12 lg:col-span-6"
        >
          <div class="w-full">
            <img
              :src="require('~/assets/img/faq.webp')"
              class="w-full"
              alt=""
            />
          </div>
        </div>
        <div
          data-aos="fade-left"
          data-aos-delay="150"
          class="col-span-12 lg:col-span-6 px-4 sm:px-6 mt-8"
        >
          <span
            class="text-base text-gradient font-semibold uppercase mb-4 sm:mb-2"
            >Support</span
          >
          <h2 class="text-3xl sm:text-4xl font-semibold mb-10 sm:mb-6">
            Frequently asked questions
          </h2>

          <ul class="shadow-box">
            <BaseAccordion
              v-for="(accordion, index) in faq"
              :key="index"
              :accordion="accordion"
            />
          </ul>
        </div>
      </BaseSection>
    </section>

    <!-- Back to top -->
    <div class="w-full my-10 flex justify-center">
      <a
        v-smooth-scroll
        data-aos="flip-down"
        data-aos-delay="150"
        href="#navbar"
        class="px-6 py-3 flex items-center space-x-2 bg-[#FAFAFA] hover:bg-gray-100 hover:shadow-md border border-[#DDDDDD] rounded-md text-gray-700"
      >
        <span>Back to top</span>
        <ArrowUpIcon :size="20" />
      </a>
    </div>
  </div>
</template>

<script>
import aosMixin from "@/mixins/aos";
import { APIGET, APIPOST, APIUPLOAD } from "~/api/apiHelper";
import ResponseHandlerModal from "../components/ResponseHandlerModal.vue";
import { mapState, mapActions } from "vuex";

export default {
  name: "IndexPage",
  components: {
    ResponseHandlerModal,
  },
  mixins: [aosMixin],
  async asyncData() {
    try {
      const response = await APIGET("getLandingNewProductsData");
      const response2 = await APIGET("getLandingPartnersData");

      if (!response.data.error && !response2.data.error) {
        const newProducts = response.data.map((item) => ({ ...item }));
        const partners = response2.data.map((item) => ({ ...item }));
        return { newProducts, partners };
      }
      if (response.data.error) {
        let errorMessage = "";
        errorMessage += response.data.error ? response.data.error + ";" : "";
        errorMessage += response2.data.error ? response2.data.error + ";" : "";
        return { error: errorMessage };
      }
    } catch (err) {
      return { error: err.message };
    }
  },
  methods: {
    addToCart(product) {
      this.$store.dispatch("addToCart", product);
      console.log(this.$store.state);
    },
  },
  mounted() {
    if (this.error) {
      this.checkError(this.error, {
        show: true,
        title: "Hiba",
        message: "Hiba történt az adatok lekérése közben: " + this.error,
        options: [],
        type: "error",
      });
    }
  },
  data() {
    return {
      selected: 0,
      dropdownConcurency: false,
      dropdownCrypto: false,
      newProducts: [{}],
      partners: [{}],
      faq: [
        {
          title: "Why should I choose NEFA?",
          description:
            "We're industry pioneers, having been in the cryptocurrency industry since 2016. We've facilitated more than 21 billion USD worth of transactions on our exchange for customers in over 40 countries. Today, we're trusted by over 8 million customers around the world and have received praise for our easy-to-use app, secure wallet, and range of features.",
        },
        {
          title: "How secure is NEFA?",
          description:
            "We're industry pioneers, having been in the cryptocurrency industry since 2016. We've facilitated more than 21 billion USD worth of transactions on our exchange for customers in over 40 countries. Today, we're trusted by over million customers around the world and have received praise for our easy-to-use app, secure wallet, and range of features.",
        },
        {
          title: "Do I have to buy a whole Bitcoin?",
          description:
            "We're industry pioneers, having been in the cryptocurrency industry since 2016. We've facilitated more than 21 billion USD worth of transactions on our exchange for customers in over 40 countries. Today, we're trusted by over million customers around the world and have received praise for our easy-to-use app, secure wallet, and range of features.",
        },
        {
          title: "How do I actually buy Bitcoin?",
          description:
            "We're industry pioneers, having been in the cryptocurrency industry since 2016. We've facilitated more than 21 billion USD worth of transactions on our exchange for customers in over 40 countries. Today, we're trusted by over million customers around the world and have received praise for our easy-to-use app, secure wallet, and range of features.",
        },
      ],
      steps: [
        {
          img: "registration.png",
          title: "Regisztráció",
          description:
            "Csak terméket meghirdető vállakozásoknak kötelező, vásárlók részére opcionális",
        },
        {
          img: "findings.png",
          title: "Vásárlás",
          description:
            "Miután megtaláltad a kiválasztott terméket, nincs más dolgod, mint megvásárolni azt a felületen",
        },
        {
          img: "reedem.png",
          title: "Érvényesítés",
          description:
            "Vásárlás után látogass el a kereskedőhöz és érvényesítsd a kupont a kapott kód alapján",
        },
      ],
    };
  },
};
</script>
<style scoped>
.text-header-gradient {
  background: rgb(57, 132, 244);
  background: linear-gradient(
    169.4deg,
    #3984f4 -6.01%,
    #0cd3ff 36.87%,
    #2f7cf0 78.04%,
    #0e65e8 103.77%
  );
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.bg-partner {
  background: url("../assets/img/partner/background.png");
  background-size: cover;
  background-position: center;
}

.bg-trading-tools {
  background: url("../assets/img/bg-trading-tools.webp");
  background-size: cover;
  background-position: center;
}

.max-h-0 {
  max-height: 0;
}
</style>
