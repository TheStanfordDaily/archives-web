import Link from "next/link";
import Loading from "../components/Loading";
import NotFound from "../NotFound";
import React from 'react';
import { fetchPaper } from "../../helpers/papers";
import { getDatePath } from "../../helpers/constants";
import moment from "moment";

const navigationType = {
    ISSUE: "issue",
    ARTICLE: "article"
};

class TodayPaperView extends React.Component {
    constructor(props) {
        super(props);
        let yearsLeft = [];
        for(let i = 1892; i <= 2014; i++){
            yearsLeft.push(i);
        }
        this.state = {
            paperNotFound: false,
            loading: true,
            navigationSelection: navigationType.ISSUE,
            selectedSections: [],
            customNavigationWidth: false,
            width: 1, // it's the ratio of width to height that matters 
            height: 1,  // also these values will be overridden (unless no article can be found for the current day, which shouldn't happen)
            yearsLeft: yearsLeft,
            yearsHistory: [],
            matchParams: null,
        };
    }

    async componentDidMount() {
        let date = moment();

        // get an available paper
        while(!this.paper){
            if(this.state.yearsLeft.length === 0){
                break;
            }
            let yearIndex = Math.floor(Math.random() * this.state.yearsLeft.length)
            let year = this.state.yearsLeft[yearIndex];
            let newYearsLeft=  [...this.state.yearsLeft];
            newYearsLeft.splice(yearIndex, 1);
            this.setState({yearsLeft: newYearsLeft});

            this.state.matchParams = {year: year, month: date.format('MM'), day: date.format('DD')};
            console.log(this.state.matchParams);
            this.paper = await fetchPaper(
                this.state.matchParams.year,
                this.state.matchParams.month,
                this.state.matchParams.day
            );
        }

        if (this.paper === null) {
            this.setState({ paperNotFound: true });
            return;
        }

        this.allPages = await this.paper.getPages();

        var allTileSources = [];
        for (let eachPage of this.allPages) {
            allTileSources.push(eachPage.getTileSource());
        }
        this.setState({ loading: false });

        if(this.state.yearsLeft.length > 0 && typeof document !== 'undefined'){
            const OpenSeadragon = require("openseadragon");
            let viewer = new OpenSeadragon({
                id: "paper-openseadragon",
                prefixUrl: "https://openseadragon.github.io/openseadragon/images/", // TODO: change to local path
                preserveViewport: true,
                visibilityRatio: 0.75,
                defaultZoomLevel: 1,
                sequenceMode: true,
                showReferenceStrip: false,
                showNavigator: true,
                tileSources: allTileSources
            });

            viewer.addHandler('open', () => {
                if(viewer){
                    this.setState({
                        width: (viewer.world.getItemAt(0).source.dimensions.x / window.devicePixelRatio),
                        height: (viewer.world.getItemAt(0).source.dimensions.y / window.devicePixelRatio)
                    });
                }
            });

            this.viewer = viewer;
        }
    }

    render() {
        if (this.state.paperNotFound) {
            return <NotFound />;
        }

        if (this.state.loading) {
            return <Loading />;
        }

        return (
            <div>
                { this.state.yearsLeft.length > 0 ?
                <div>
                    <div className="PaperMainView" ref={ourRef => {this.ourRef = ourRef;}} style={{position: 'relative'}} >
                    {/*note: height is calculated s.t. entire paper fits into the openseadragon component. this.ourRef.clientWidth / window.innerWidth is needed b/c the width of component is not width of window */}
                        <div className="PaperSection" id="paper-openseadragon" style={{ height: 100*(this.state.height / this.state.width * (this.ourRef ? this.ourRef.clientWidth / window.innerWidth: 1)) + "vw", width: '100%' }} />
                    </div>
                </div>
                :
                <p>There are no papers from today!</p> 
                }
                <div style={{width: '100%', padding: '10px'}}>
                    <p>
                    Today's paper is from {this.state.matchParams.month}/{this.state.matchParams.day}/{this.state.matchParams.year}. {moment().format('DD') !== this.state.matchParams.day ? `(no papers published on this day, so we selected the nearest match)` : ' '}
                    <Link
                        href={getDatePath((new Date(`${this.state.matchParams.year}-${this.state.matchParams.month}-${String(Number(this.state.matchParams.day)).padStart(2, '0')}`)))}
                        key={getDatePath((new Date(`${this.state.matchParams.year}-${this.state.matchParams.month}-${String(Number(this.state.matchParams.day)).padStart(2, '0')}`)))}
                    >
                        Go to this paper's page
                    </Link>
                    </p>
                </div>
            </div>
            
        );
    }
}
  
const TodayInHistory = () => {
    // today in history doesn't display properly for smaller windows.
    return (
    <div style={{textAlign: 'center'}}>
        <h2>Today in History</h2>
        <TodayPaperView />
    </div> );
}
 
export default TodayInHistory;