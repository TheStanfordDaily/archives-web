import Loading from "../components/Loading";
import NotFound from "../NotFound";
import OpenSeadragon from "openseadragon";
import React from 'react';
import { fetchPaper } from "../../helpers/papers";
import moment from "moment";

const navigationType = {
    ISSUE: "issue",
    ARTICLE: "article"
};

class TodayPaperView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            paperNotFound: false,
            loading: true,
            navigationSelection: navigationType.ISSUE,
            selectedSections: [],
            customNavigationWidth: false,
            width: 1, // it's the ratio of width to height that matters 
            height: 1,  // also these values will be overridden (unless no article can be found for the current day, which shouldn't happen)
        };
    }

    async componentDidMount() {
        let date = moment();

        let yearsLeft = [];
        for(let i = 1892; i <= 2014; i++){
            yearsLeft.push(i);
        }

        // get an available paper
        while(!this.paper){
            if(yearsLeft.length === 0){
                break;
            }
            let yearIndex = Math.floor(Math.random() * yearsLeft.length)
            let year = yearsLeft[yearIndex];
            yearsLeft.splice(yearIndex, 1);

            let matchParams = {year: year, month: date.format('MM'), day: date.format('DD')};
            this.paper = await fetchPaper(
                matchParams.year,
                matchParams.month,
                matchParams.day
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

        let viewer = new OpenSeadragon({
            id: "paper-openseadragon",
            prefixUrl: "https://openseadragon.github.io/openseadragon/images/", // TODO: change to local path
            preserveViewport: true,
            visibilityRatio: 0.75,
            defaultZoomLevel: .95,
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

    render() {
        if (this.state.paperNotFound) {
            return <NotFound />;
        }

        if (this.state.loading) {
            return <Loading />;
        }

        console.log(this.state.height, this.state.width, this.state.height / this.state.width * window.screen.width, window.screen.width);

        return (
            <div className="PaperMainView" ref={ourRef => {this.ourRef = ourRef;}} style={{position: 'relative'}} >
                <div className="PaperSection" id="paper-openseadragon" style={{ height: 100*(this.state.height / this.state.width * (this.ourRef ? this.ourRef.clientWidth / window.screen.width: 1)) + "vw", width: '100%' }} />
            </div>
        );
    }
}
  
  
const TodayInHistory = () => {
    // today in history doesn't display properly for smaller windows.
    return (
    <div style={{textAlign: 'center', marginTop: '20px'}}>
        <h2>Today in History</h2>
        <TodayPaperView />
    </div> );
}
 
export default TodayInHistory;