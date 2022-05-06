const root = ReactDOM.createRoot(document.getElementById('root'));

const SearchByName = ({fetchCountry}) => {

    const handleChange = (e) => {
        e.preventDefault();
        let name = e.target.elements.name.value;
        if(name.length < 3) {
            return;
        }
        fetchCountry(name);

    }


    return (
        <form method="POST" action="#" onSubmit={handleChange} className=" flex flex-col gap-5 justify-center mt-5 mx-3">
            <input type="text" name="name"  className="text-3xl rounded py-2 px-4 text-left shadow-lg" />
            <div className="mx-auto">
                <button className="text-3xl bg-blue-70 border-2 py-5 px-8 rounded-full text-blue-50 hover:text-blue-700 hover:bg-blue-50 transition-all duration-300 ease-in-out">Country?</button>
            </div>
        </form>
    );
}

const Loading = () => {

    return (
        <div className=" flex flex-col gap-5 justify-center mt-5 mx-3">
            <div className="flex justify-center items-center text-blue-300 animate-spin">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
            </div>
            <h1 className="text-center text-blue-300">Predicting...</h1>
        </div>
    );
}

const ResultView = ({user,country,flag,prob,setStep}) => {

    return (
        <div  className=" bg-white text-gray-700 m-5 p-3 text-xl text-center rounded shadow-lg">
            <div className="relative">
                <button onClick={(e) => {setStep(1)}} className="absolute top-0 right-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <h1>Looks like <span className="font-bold italic">{user}</span> must be from,</h1>
                <h2 className="text-5xl italic font-bold m-5">{ country }</h2>
                <div className="text-center mx-auto">
                    <img className="mx-auto w-32 rounded-lg" src={flag} alt="India" />
                </div>
                <div className="mt-5">
                    <span className="text-xs uppercase m-5 py-1 px-3 rounded-full bg-blue-800 text-gray-100">
                        Probability : { Math.round(prob * 100,0) }% 
                    </span>
                </div>
            </div>
        </div>
    );
}




class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            countries: [],
            selectedCountry: [],
            country_details: [],
            step: 1,
        };
    }

    setStep = (step) => {
        this.setState({
            step: step,
        });
    }

    fetchCountry = async (name) => {
        this.setState({
            name: name,
        });
        this.setStep(2);
        const res = await fetch(`https://api.nationalize.io/?name=${name}`);
        const res_data = await res.json();
        this.countries = res_data.country;
        await this.fetchCountryDetails(this.countries);
        this.setStep(3);
    }

    fetchCountryDetails = async (countries) => {
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
        
        const res = await fetch(`https://restcountries.com/v3.1/alpha/${selected_country.country_id}`);
        const res_data = await res.json();
        this.setState({
            selectedCountry: selected_country,
            country_details: res_data[0]
        });
    }

    render() {
        return (
            <div className="w-full">
                <div className="text-center">
                    <h1 className="text-blue-50 font-bold uppercase text-6xl mx-5">Nationality Predictor</h1>
                    <h2 className="text-blue-200 mx-5">Enter a name to get a prediction of the country to which it may belong.</h2>
                </div>
                {(this.state.step === 1)? <SearchByName fetchCountry={this.fetchCountry} /> : null}
                {(this.state.step === 2)? <Loading /> : null}
                {(this.state.step === 3)? 
                    <ResultView 
                        user={this.state.name} 
                        country={this.state.country_details.name.common} 
                        flag={this.state.country_details.flags.png} 
                        prob={this.state.selectedCountry.probability}
                        setStep={this.setStep} /> : null}
            </div>
        );


    }
}

root.render(<App />);