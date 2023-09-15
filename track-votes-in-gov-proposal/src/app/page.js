"use client";
import { useState, useEffect } from "react";
import "../resources/assets/css/styles.min.css";
// import ApexCharts from "apexcharts";
import Chart from 'react-apexcharts'
import axios from "axios";
import { motion } from "framer-motion";

export default function Home() {
  const [data, setData] = useState(null);
  // const [options, setOptions] = useState(null);

  const [loading, setLoading] = useState("unloaded");
  const [address, setAddress] = useState("");

  const getData = () => {
    setLoading("loading");
    axios
      .request({
        url: "/api/get-voting-details",
        method: "GET",
        params: {
          proposal: address,
        },
      })
      .then((res) => {
        setLoading("loaded");
        console.log(res.data);
        setData(res.data);
      })
      .catch((err) => {
        console.log("error,", err.message);
        setLoading("error");
      });
  };
  const options = {
    chart: {
      width: 380,
      type: 'pie',
    },
    labels: ['Yes', 'No'],
    colors:['#00a86b', '#ff2400',],
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };
  // useEffect(() => {
  //   if (data !== null) {
  //     setOptions({
  //         chart: {
  //           width: 380,
  //           type: 'pie',
  //         },
  //         labels: ['Yes', 'No'],
  //         responsive: [{
  //           breakpoint: 480,
  //           options: {
  //             chart: {
  //               width: 200
  //             },
  //             legend: {
  //               position: 'bottom'
  //             }
  //           }
  //         }]
  //       });
  //   }
  // }, [data]);

  // useEffect(() => {
  //   if (options !== null) {
  //     var chart = new ApexCharts(document.querySelector("#chart"), options);
  //     chart.render();
  //   }
  // }, [options]);

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
                placeholder="Enter Proposal Address"
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
              Please enter proposal address to get details
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
                            Proposal{" "}
                          </h5>
                          <h3 className="fw-semibold mb-1 theme-red-text">
                            {data.transactions.proposal_name}
                          </h3>
                          <small className="mb-0">
                            {address}
                          </small>
                        </div>
                        <div className="col-4">
                          {data.votes_data.motion_passed?<div className="d-flex justify-content-end">
                            <div className="theme-green-text border border-2 border-light rounded rounded-5 py-1 px-3 d-flex align-items-center justify-content-center w-50 text-bold">
                              Motion Passed
                            </div>
                          </div>:
                          <div className="d-flex justify-content-end">
                            <div className="theme-yellow-text border border-2 border-light rounded rounded-5 py-1 px-3 d-flex align-items-center justify-content-center w-50 text-bold">
                              Motion Failed
                            </div>
                        </div>}
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
                            {data.transactions.proposal_name}
                          </h5>
                        </div>
                        <div></div>
                      </div>
                      <Chart options={options} series={data.votes_data.vote_map} type="pie" width={500} height={320} />
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
                          <div className="row align-items-center mb-2">
                            <div className="col-8">
                              <h1 className="fw-semibold mb-1 theme-red-text">
                                {data.votes_data.total_votes}
                              </h1>
                            </div>
                            <div className="col-4">
                              <div className="d-flex justify-content-end">
                                
                              </div>
                            </div>
                          </div>
                          <h5 className="card-title mb-0 fw-semibold">
                            Total Votes Cast
                          </h5>
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
                          <div className="row align-items-start mb-1">
                            <div className="col-8">
                              <h2 className="fw-semibold mb-1 theme-red-text">
                                {data.votes_data.approved}
                              </h2>
                            </div>
                            <div className="col-4">
                              <div className="d-flex justify-content-end">
                                
                              </div>
                            </div>
                          </div>
                          <h5 className="card-title mb-0 fw-semibold">
                            Approved the proposal
                          </h5>
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
                          <div className="row align-items-start mb-1">
                            <div className="col-8">
                              <h2 className="fw-semibold mb-1 theme-red-text">
                                {data.votes_data.disapproved}
                              </h2>
                            </div>
                            <div className="col-4">
                              <div className="d-flex justify-content-end">
                                
                              </div>
                            </div>
                          </div>
                          <h5 className="card-title mb-0 fw-semibold">
                            Refused the proposal
                          </h5>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="row">
                  <div className="col-md-4">
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
                          <div className="row align-items-start mb-2">
                            <div className="col-8">
                              <h2 className="fw-semibold mb-1 theme-yellow-text">
                                {shortenAddress(data.misc_data.governance_address)}{" "}
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
                          <h5 className="card-title mb-0 fw-semibold">
                            Governance
                          </h5>
                        </div>
                      </motion.div>
                  </div>
                  <div className="col-md-4">
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
                          <div className="row align-items-start mb-2">
                            <div className="col-8">
                              <h2 className="fw-semibold mb-1 theme-yellow-text">
                                {data.misc_data.governing_token_details?.name}{" "}
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
                          <h5 className="card-title mb-0 fw-semibold">
                            Governing Token
                          </h5>
                        </div>
                      </motion.div>
                  </div>
                  <div className="col-md-4">
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
                          <div className="row align-items-start mb-2">
                            <div className="col-8">
                              <h2 className="fw-semibold mb-1 theme-yellow-text">
                                {shortenAddress(data.misc_data.realm_address)}{" "}
                                
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
                          <h5 className="card-title mb-0 fw-semibold">
                            Realm Address
                          </h5>
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
