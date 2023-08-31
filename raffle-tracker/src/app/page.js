"use client";
import { useState, useEffect } from "react";
import "../resources/assets/css/styles.min.css";
import ApexCharts from "apexcharts";
import axios from "axios";
import { motion } from "framer-motion";

export default function Home() {
  const [data, setData] = useState(null);
  const [options, setOptions] = useState(null);

  const [loading, setLoading] = useState("unloaded");
  const [address, setAddress] = useState("");

  const getData = () => {
    setLoading("loading");
    axios
      .request({
        url: "/api/get-all-data",
        method: "GET",
        params: {
          address: address,
        },
      })
      .then((res) => {
        setLoading("loaded");
        //console.log(res.data);
        setData(res.data);
      })
      .catch((err) => {
        console.log("error,", err.message);
        setLoading("error");
      });
  };

  useEffect(() => {
    if (data !== null) {
      setOptions({
        chart: {
          type: "bar",
          height: 345,
          offsetX: -15,
          toolbar: { show: true },
          foreColor: "#adb0bb",
          fontFamily: "inherit",
          sparkline: { enabled: false },
        },
        series: [
          { name: "Tickets Sold", data: data.data_for_graph.tickets_sold },
          { name: "Amount", data: data.data_for_graph.revenue },
        ],
        xaxis: {
          type: "category",
          categories: [
            "10 AM",
            "12 AM",
            "2 PM",
            "4 PM",
            "6 PM",
            "8 PM",
            "10 PM",
          ],
          labels: {
            style: { cssClass: "grey--text lighten-2--text fill-color" },
          },
        },
        colors: ["#E33535", "#F4f4f4"],
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "35%",
            borderRadius: [6],
            borderRadiusApplication: "end",
            borderRadiusWhenStacked: "all",
          },
        },
        markers: { size: 0 },

        dataLabels: {
          enabled: false,
        },

        legend: {
          show: false,
        },
        grid: {
          borderColor: "rgba(0,0,0,0.1)",
          strokeDashArray: 3,
          xaxis: {
            lines: {
              show: false,
            },
          },
        },
        yaxis: {
          show: true,
          min: 0,
          max: 12,
          tickAmount: 4,
          labels: {
            style: {
              cssClass: "grey--text lighten-2--text fill-color",
            },
          },
        },
        stroke: {
          show: true,
          width: 3,
          lineCap: "butt",
          colors: ["transparent"],
        },
        tooltip: { theme: "dark" },
        responsive: [
          {
            breakpoint: 600,
            options: {
              plotOptions: {
                bar: {
                  borderRadius: 3,
                },
              },
            },
          },
        ],
      });
    }
  }, [data]);

  useEffect(() => {
    if (options !== null) {
      var chart = new ApexCharts(document.querySelector("#chart"), options);
      chart.render();
    }
  }, [options]);

  function shortenAddress(address) {
    try {
      var trimmedString = "";
      if (address === "") return "unknown";
      if (address != null || address.length > 16) {
        trimmedString =
          address.substring(0, 8) +
          "..." +
          address.substring(address.length - 5);
      } else {
        trimmedString = address ?? "";
      }
      return trimmedString;
    } catch (error) {
      return address;
    }
  }

  return (
    <div
      className="page-wrapper"
      id="main-wrapper"
      data-layout="vertical"
      data-navbarbg="skin6"
    >
      <div className="body-wrapper" style={{ minHeight: "100vh" }}>
        <div className="container-lg">
          <div className="row pt-4">
            <div className="col-12 col-lg-10">
              <input
                type="text"
                className="form-control rounded-5 text-light"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter Raffle Address"
              />
            </div>
            <div className="col-12 col-lg-2">
              <button
                className="btn theme-red-bg text-light rounded-5 border-light w-100"
                onClick={getData}
              >
                Get Details
              </button>
            </div>
          </div>

          {loading === "unloaded" && (
            <div className="mt-4 pt-4 text-center fw-semibold w-100">
              Please enter Raffle address and Date for getting ticket details
            </div>
          )}
          {loading === "error" && (
            <div className="mt-4 pt-4 text-center text-danger fw-semibold w-100">
              Some error Occured
            </div>
          )}
          {loading === "loading" && (
            <div className="mt-4 pt-4 text-center w-100 mx-auto">
              <div className="lds-heart">
                <div></div>
              </div>
            </div>
          )}
          {loading === "loaded" && data !== null && (
            <div>
              <div className="row pt-5">
                <div className="col-lg-12">
                  <motion.div
                    className="card"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.1,
                      delay: 0.1,
                      y: {
                        type: "spring",
                        damping: 5,
                        stiffness: 50,
                        restDelta: 0.001,
                      },
                    }}
                  >
                    <div className="card-body py-3">
                      <div className="row align-items-start">
                        <div className="col-8">
                          <h5 className="card-title mb-2 fw-semibold">
                            Raffle Address{" "}
                          </h5>
                          <h3 className="fw-semibold mb-0 theme-red-text">
                            {address}
                          </h3>
                        </div>
                        <div className="col-4">
                          <div className="d-flex justify-content-end">
                            <div className="theme-yellow-text border border-2 border-light rounded rounded-5 py-1 px-3 d-flex align-items-center justify-content-center w-50 text-bold">
                              mainnet-beta
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-8 d-flex align-items-strech">
                  <motion.div
                    className="card w-100"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.1,
                      delay: 0.3,
                      y: {
                        type: "spring",
                        damping: 5,
                        stiffness: 50,
                        restDelta: 0.001,
                      },
                    }}
                  >
                    <div className="card-body">
                      <div className="d-sm-flex d-block align-items-center justify-content-between mb-9">
                        <div className="mb-3 mb-sm-0">
                          <h5 className="card-title fw-semibold">
                            Tickets Sold over time
                          </h5>
                        </div>
                        <div></div>
                      </div>
                      <div id="chart"></div>
                    </div>
                  </motion.div>
                </div>
                <div className="col-lg-4">
                  <div className="row">
                    <div className="col-lg-12">
                      <motion.div
                        className="card overflow-hidden"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.1,
                          delay: 0.4,
                          y: {
                            type: "spring",
                            damping: 5,
                            stiffness: 50,
                            restDelta: 0.001,
                          },
                        }}
                      >
                        <div className="card-body p-4">
                          <h5 className="card-title mb-9 fw-semibold">
                            Total Tickets Sold
                          </h5>
                          <div className="row align-items-center">
                            <div className="col-8">
                              <h1 className="fw-semibold mb-1 theme-red-text">
                                {data.agg_data.total_tickets_sold}
                              </h1>
                            </div>
                            <div className="col-4">
                              <div className="d-flex justify-content-end">
                                <div
                                  className="theme-yellow-text theme-border-white rounded-circle p-6 d-flex align-items-center justify-content-center"
                                  style={{
                                    border: "2px solid #FBB901",
                                    marginTop: "-50px",
                                  }}
                                >
                                  <i className="ti ti-chart-bar fs-6"></i>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                    <div className="col-lg-12">
                      <motion.div
                        className="card"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.1,
                          delay: 0.5,
                          y: {
                            type: "spring",
                            damping: 5,
                            stiffness: 50,
                            restDelta: 0.001,
                          },
                        }}
                      >
                        <div className="card-body">
                          <div className="row alig n-items-start">
                            <div className="col-8">
                              <h5 className="card-title mb-9 fw-semibold">
                                Total Earnings
                              </h5>
                              <h2 className="fw-semibold mb-3 theme-red-text">
                                {data.agg_data.total_amount_sold.toFixed(2)}{" "}
                                <small style={{ fontSize: "18px" }}>SOL</small>
                              </h2>
                            </div>
                            <div className="col-4">
                              <div className="d-flex justify-content-end">
                                <div
                                  className="theme-yellow-text theme-border-white rounded-circle p-6 d-flex align-items-center justify-content-center"
                                  style={{ border: "2px solid #FBB901" }}
                                >
                                  <i className="ti ti-currency-dollar fs-6"></i>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                    <div className="col-lg-12">
                      <motion.div
                        className="card overflow-hidden"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.1,
                          delay: 0.6,
                          y: {
                            type: "spring",
                            damping: 5,
                            stiffness: 50,
                            restDelta: 0.001,
                          },
                        }}
                      >
                        <div className="card-body">
                          <div className="row alig n-items-start">
                            <div className="col-8">
                              <h5 className="card-title mb-9 fw-semibold">
                                {" "}
                                Each Ticket Price{" "}
                              </h5>
                              <h2 className="fw-semibold mb-3 theme-red-text">
                                {data.agg_data.each_ticket_price}{" "}
                                <small style={{ fontSize: "18px" }}>SOL</small>
                              </h2>
                            </div>
                            <div className="col-4">
                              <div className="d-flex justify-content-end">
                                <div
                                  className="theme-yellow-text theme-border-white rounded-circle p-6 d-flex align-items-center justify-content-center"
                                  style={{ border: "2px solid #FBB901" }}
                                >
                                  <i className="ti ti-ticket fs-6"></i>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-lg-4 d-flex align-items-stretch">
                  <motion.div
                    class="card w-100"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.1,
                      delay: 0.7,
                      y: {
                        type: "spring",
                        damping: 5,
                        stiffness: 50,
                        restDelta: 0.001,
                      },
                    }}
                  >
                    <div class="card-body p-4">
                      <div class="mb-4">
                        <h5 class="card-title fw-semibold">
                          Recent Transactions
                        </h5>
                      </div>
                      <ul class="timeline-widget mb-0 position-relative mb-n5">
                        {data.formatted_transactions.length > 0 && (
                          <>
                            {data.formatted_transactions.map((txn) => (
                              <li class="timeline-item d-flex position-relative overflow-hidden">
                                <div class="timeline-time text-light flex-shrink-0 text-end">
                                  {new Date(txn.timestamp).getHours()}:
                                  {new Date(txn.timestamp).getMinutes() < 10
                                    ? "0" + new Date(txn.timestamp).getMinutes()
                                    : new Date(txn.timestamp).getMinutes()}
                                </div>
                                <div class="timeline-badge-wrap d-flex flex-column align-items-center">
                                  <span class="timeline-badge border-2 border border-theme-red flex-shrink-0 my-8"></span>
                                  <span class="timeline-badge-border d-block flex-shrink-0"></span>
                                </div>
                                <div class="timeline-desc fs-3 text-light mt-n1">
                                  <span className="theme-yellow-text">
                                    {txn.buyer}
                                  </span>{" "}
                                  bought a total of{" "}
                                  <span className="theme-yellow-text">
                                    {txn.tickets_bought}
                                  </span>{" "}
                                  Tickets
                                </div>
                              </li>
                            ))}
                          </>
                        )}
                      </ul>
                    </div>
                  </motion.div>
                </div>
                <div class="col-lg-8 d-flex align-items-stretch">
                  <motion.div
                    class="card w-100"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.1,
                      delay: 0.9,
                      y: {
                        type: "spring",
                        damping: 5,
                        stiffness: 50,
                        restDelta: 0.001,
                      },
                    }}
                  >
                    <div class="card-body p-4">
                      <h5 class="card-title fw-semibold mb-4">Top Buyers</h5>
                      <div class="table-responsive">
                        <table class="table text-nowrap mb-0 align-middle">
                          <thead class="text-light fs-4">
                            <tr>
                              <th class="border-bottom-0">
                                <h6 class="fw-semibold mb-0">No.</h6>
                              </th>
                              <th class="border-bottom-0">
                                <h6 class="fw-semibold mb-0 text-center">
                                  Buyer
                                </h6>
                              </th>
                              <th class="border-bottom-0">
                                <h6 class="fw-semibold mb-0 text-center">
                                  Each Ticket
                                </h6>
                              </th>
                              <th class="border-bottom-0">
                                <h6 class="fw-semibold mb-0 text-center">
                                  Total Price
                                </h6>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {data.agg_buyers.buyers.length > 0 && (
                              <>
                                {data.agg_buyers.buyers.map((buyer, index) => (
                                  <tr>
                                    <td class="border-bottom-0">
                                      <h6 class="fw-semibold mb-0">{index}</h6>
                                    </td>
                                    <td class="border-bottom-0">
                                      <h6 class="fw-semibold mb-1 text-center">
                                        {shortenAddress(buyer.buyer)}
                                      </h6>
                                      {/* <span class="fw-normal">Project Manager</span>                           */}
                                    </td>
                                    <td class="border-bottom-0">
                                      <h6 class="fw-semibold mb-0 fs-4 text-center">
                                        {buyer.tickets_bought}
                                      </h6>
                                    </td>
                                    <td class="border-bottom-0 text-center">
                                      <div class="text-center">
                                        <span class="badge theme-red-bg rounded-3 fw-semibold">
                                          {buyer.tickets_bought *
                                            data.agg_data.each_ticket_price}
                                        </span>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
