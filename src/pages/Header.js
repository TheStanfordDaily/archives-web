import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Header = function () {
    return (

        <div className="tsd-donate-header">
            <div className="container">
                <div className="row">
                    <a className="tsd-donate-header-close" href="#">
                        <i className="fas fa-times" />
                    </a>
                    <div className="col-12 col-lg-8">
                        <h3 style={{ marginTop: '0px', textAlign: 'center' }}>
                            <mark style={{ color: 'black' }}>
                                Support independent, student-run journalism.
                  </mark>
                        </h3>
                        <div className="tsd-hidden-sm" style={{ textAlign: 'left' }}>
                            <FontAwesomeIcon icon="newspaper" size="4x" style={{ float: 'left', margin: '5px 30px 0px 30px' }} />
                            Your support helps give staff members from all backgrounds the opportunity to conduct meaningful reporting on important issues at Stanford. All contributions are tax-deductible.
                </div>
                    </div>
                    <div className="col-12 col-lg-4">
                        <form action="https://www.paypal.com/cgi-bin/webscr" method="post" className="tsd-donation-form">
                            <input type="hidden" name="business" defaultValue="coo@stanforddaily.com" />
                            <input type="hidden" name="cmd" defaultValue="_donations" />
                            <input type="hidden" name="item_name" defaultValue="Stanford Daily Donation" />
                            <input type="hidden" name="item_number" defaultValue={`Archives Site - From Header in Page: ${window.location.href}`} />
                            <input type="hidden" name="currency_code" defaultValue="USD" />
                            <button className="tsd-button" type="submit" name="submit">Support the Daily</button>
                            <select name="amount" className="tsd-select form-control">
                                <option value={5}>$5</option>
                                <option value={10}>$10</option>
                                <option value={25}>$25</option>
                                <option value={50}>$50</option>
                                <option value={100}>$100</option>
                                <option value={500}>$500</option>
                                <option value={1000}>$1,000</option>
                            </select>
                            {/* <div className="checkbox" style={{
                                marginTop: '10px'
                            }} name="monthly-donation">
                                <label><input type="checkbox" className="monthlyDonation" defaultValue style={{ marginRight: '10px' }} />Make my donation a monthly donation.</label>
                            </div> */}
                            <img alt width={1} height={1} src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" style={{ display: 'none' }} />
                        </form>
                        <form action="https://www.paypal.com/cgi-bin/webscr" method="post" className="tsd-donation-form-recurring">
                            <input type="hidden" name="business" defaultValue="coo@stanforddaily.com" />
                            <input type="hidden" name="cmd" defaultValue="_xclick-subscriptions" />
                            <input type="hidden" name="item_name" defaultValue="Stanford Daily Donation" />
                            <input type="hidden" name="item_number" defaultValue="From header" />
                            <input type="hidden" name="custom" defaultValue />
                            <input type="hidden" name="no_note" defaultValue={1} />
                            <input type="hidden" name="currency_code" defaultValue="USD" />
                            <input type="hidden" name="src" defaultValue={1} />
                            <input type="hidden" name="a3" defaultValue={5} />
                            <input type="hidden" name="p3" defaultValue={1} />
                            <input type="hidden" name="t3" defaultValue="M" />
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Header;