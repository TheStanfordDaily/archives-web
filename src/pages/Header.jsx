import GithubCorner from "react-github-corner";
import { IoMdPaper } from "react-icons/io";
import React from "react";

const Header = function() {
  return (
    <>
      <GithubCorner
        size="65"
        href="https://github.com/TheStanfordDaily/archives-web"
      />
      <div className="DonateHeader">
        <div className="container">
          <div className="row DonateBannerRow">
            <h3 className="DonateBannerTitle">
              <IoMdPaper size="1.5em" className="DonateBannerTitleIcon" />
              <span className="DonateBannerTitleText">
                Help us preserve <em>your</em> history today!
              </span>
            </h3>
            <form
              action="https://www.paypal.com/cgi-bin/webscr"
              method="post"
              className="tsd-donation-form"
            >
              <input
                type="hidden"
                name="business"
                defaultValue="coo@stanforddaily.com"
              />
              <input type="hidden" name="cmd" defaultValue="_donations" />
              <input
                type="hidden"
                name="item_name"
                defaultValue="Stanford Daily Donation"
              />
              <input
                type="hidden"
                name="item_number"
                defaultValue={`Archives Site - From Header in Page: ${
                  window.location.href
                }`}
              />
              <input type="hidden" name="currency_code" defaultValue="USD" />
              <button className="tsd-button" type="submit" name="submit">
                Support<span className="HideOnSmallScreen"> the Daily</span>
              </button>
              <select name="amount" className="tsd-select form-control">
                <option value={50}>$50</option>
                <option value={200}>$200</option>
                <option value={1000}>$1,000</option>
                <option value="">Other</option>
              </select>
              {/* <div className="checkbox" style={{
                                marginTop: '10px'
                            }} name="monthly-donation">
                                <label><input type="checkbox" className="monthlyDonation" defaultValue style={{ marginRight: '10px' }} />Make my donation a monthly donation.</label>
                            </div> */}
              <img
                alt=""
                width={1}
                height={1}
                src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif"
                style={{ display: "none" }}
              />
            </form>
            <form
              action="https://www.paypal.com/cgi-bin/webscr"
              method="post"
              className="tsd-donation-form-recurring"
            >
              <input
                type="hidden"
                name="business"
                defaultValue="coo@stanforddaily.com"
              />
              <input
                type="hidden"
                name="cmd"
                defaultValue="_xclick-subscriptions"
              />
              <input
                type="hidden"
                name="item_name"
                defaultValue="Stanford Daily Donation"
              />
              <input
                type="hidden"
                name="item_number"
                defaultValue="From header"
              />
              <input type="hidden" name="custom" defaultValue />
              <input type="hidden" name="no_note" defaultValue={1} />
              <input type="hidden" name="currency_code" defaultValue="USD" />
              <input type="hidden" name="src" defaultValue={1} />
              <input type="hidden" name="a3" defaultValue={50} />
              <input type="hidden" name="p3" defaultValue={1} />
              <input type="hidden" name="t3" defaultValue="M" />
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
export default Header;
