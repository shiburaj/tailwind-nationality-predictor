const { createApp } = Vue

  createApp({
    data() {
      return {
        name: '',
        countries: [],
        selectedCountry: [],
        country_details: [],
        step: 1,
      }
    },
    methods: {
        async fetchCountry() {
            if(this.name.length < 3) {
                return;
            }
            this.step = 2;
            const res = await fetch(`https://api.nationalize.io/?name=${this.name}`);
            const res_data = await res.json();
            this.countries = res_data.country;
            await this.fetchCountryDetails();
            this.step = 3;
            console.log(this.country_details);
        },
        async fetchCountryDetails() {
            // sort the countries by population
            const selected_country = this.countries.reduce((a, b) => {
                if(b && a.population < b.population) {
                    return b;
                }
                return a;
            });
            
            if(selected_country.country_id == null || selected_country.country_id == '') {
                this.country_details = [];
                return;
            }
            this.selected_country = selected_country;
            const res = await fetch(`https://restcountries.com/v3.1/alpha/${selected_country.country_id}`);
            const res_data = await res.json();
            this.country_details = res_data[0];
        }

    },
}).mount('#app')