"use client";
import { useState, useEffect } from "react";
import "../resources/assets/css/styles.min.css";
import ApexCharts from "apexcharts";
import Chart from 'react-apexcharts'
import axios from "axios";
import { motion } from "framer-motion";
import "react-datetime/css/react-datetime.css";
import Datetime from "react-datetime";
const options = {
  chart: {
    width: 380,
    type: 'pie',
  },
  labels: ['Others', 'SOL'],
  colors:['#ffd8be', '#9381ff',],
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
export default function Home() {
  const [data, setData] = useState(null);
  // const [options, setOptions] = useState(null);

  const [loading, setLoading] = useState("unloaded");
  const [address, setAddress] = useState("");
  const [dateTime,setDateTime] = useState("");

  const getData = () => {
    setLoading("loading");
    axios
      .request({
        url: "/api/get-all-data",
        method: "GET",
        params: {
          address: address,
          date_time: dateTime
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
      <div className="body-wrapper body_background" style={{ minHeight: "100vh" }}>
        <div className="container-lg">
          <div className="row pt-4">
            <div className="col-12 col-lg-8">
              <input
                type="text"
                className="form-control rounded-5 text-light"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter Token Address"
              />
            </div>
            <div className="col-12 col-lg-2">
              <Datetime className="date_picker_color" onChange={(e) => setDateTime(new Date(e).toISOString())}/>
            </div>
            <div className="col-12 col-lg-2">
              <button
                className="btn text-light rounded-5 border-light w-100 purple_back_button"
                onClick={getData}
              >
                Track Swaps
              </button>
            </div>
            
          </div>
          

          {loading === "unloaded" && (
            <div className="mt-4 pt-4 text-center fw-semibold w-100">
              Please enter Token Address and Date to monitor swaps for an hour
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
                            Token Address{" "}
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
              <div className="col-lg-8">
                  <div className="row">
                    <div className="col-lg-6">
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
                            Total Swaps
                          </h5>
                          <div className="row align-items-center">
                            <div className="col-8">
                              <h1 className="fw-semibold mb-1 theme-red-text">
                                {data.additional_data.total_swaps}
                              </h1>
                            </div>
                            <div className="col-4">
                              
                            </div>
                          </div>
                        </div>
                      </motion.div>
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
                            Total Volume Swapped
                          </h5>
                          <div className="row align-items-center">
                            <div className="col-8">
                              <h1 className="fw-semibold mb-1 theme-red-text">
                                {data.additional_data.total_volume.toFixed(2)}
                              </h1>
                            </div>
                            <div className="col-4">
                              <div className="d-flex justify-content-end">
                                
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                    <div className="col-lg-6">
                      <motion.div
                        className="card overflow-hidden"
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
                        <div className="card-body p-4">
                          <div className="row align-items-start">
                            <div className="col-8">
                              <h5 className="card-title mb-9 fw-semibold">
                                Swapped from
                              </h5>
                              <h2 className="fw-semibold mb-3 theme-red-text">
                                {data.additional_data.volume_from.toFixed(2)}{" "}
                                
                              </h2>
                            </div>
                            <div className="col-4">
                              <div className="d-flex justify-content-end">
                                
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                      <motion.div
                        className="card overflow-hidden"
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
                        <div className="card-body p-4">
                          <div className="row alig n-items-start">
                            <div className="col-8">
                              <h5 className="card-title mb-9 fw-semibold">
                                Swapped To
                              </h5>
                              <h2 className="fw-semibold mb-3 theme-red-text">
                                {data.additional_data.volume_to.toFixed(2)}{" "}{" "}
                                
                              </h2>
                            </div>
                            <div className="col-4">
                              <div className="d-flex justify-content-end">
                                
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 d-flex align-items-stretch">
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
                            Tokens Involved in Swapping
                          </h5>
                        </div>
                        <div></div>
                      </div>
                      <Chart options={options} series={data.additional_data.graph_data} type="pie" width={300} height={300} />
                    </div>
                  </motion.div>
                </div>
                
              </div>
              <div class="row">
                <div class="col-lg-12">
                  {
                    data.transactions.map((txn,index) => (
                    <motion.div
                      class="txn_container"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.1,
                        delay: 0.2,
                        y: {
                          type: "spring",
                          damping: 5,
                          stiffness: 50,
                          restDelta: 0.001,
                        },
                      }}
                    >
                      <div className="row pb-3">
                        <div className="col-2 sm_text">
                            {new Date(txn.timestamp).toLocaleString()}
                        </div>
                        <div className="col-8 main_text">
                          Tokens Swap
                        </div>
                        <div className="col-2 text-end sm_text">
                          Orca Whirlpool
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-1">
                          <div className="token_details">
                            <div className="token_image">
                              <img src={txn.actions[0].info.tokens_swapped.in.image_uri ?? "https://images.wallpapersden.com/image/download/4k-gradient-cool-art_bWdsZWeUmZqaraWkpJRobWllrWdma2U.jpg"}/>
                            </div>
                            <div className="token_sym">
                              {txn.actions[0].info.tokens_swapped.in.symbol ?? "UNKNOWN"}
                            </div>
                            <div className="token_value">
                              {txn.actions[0].info.tokens_swapped.in.amount.toFixed(2) ?? 0}
                            </div>
                          </div>
                        </div>
                        <div className="col-10 pt-1">
                            <div className="forward_arrow">
                                ➤➤➤➤➤➤➤➤➤➤➤➤➤➤➤➤➤➤➤➤➤➤➤
                            </div>
                            <div className="reverse_arrow">
                                ➤➤➤➤➤➤➤➤➤➤➤➤➤➤➤➤➤➤➤➤➤➤➤
                            </div>
                        </div>
                        <div className="col-1">
                        <div className="token_details">
                            <div className="token_image">
                              <img src={txn.actions[0].info.tokens_swapped.out.image_uri ?? "https://images.wallpapersden.com/image/download/4k-gradient-cool-art_bWdsZWeUmZqaraWkpJRobWllrWdma2U.jpg"}/>
                            </div>
                            <div className="token_sym">
                              {txn.actions[0].info.tokens_swapped.out.symbol ?? "UNKNOWN"}
                            </div>
                            <div className="token_value">
                              {txn.actions[0].info.tokens_swapped.out.amount.toFixed(2) ?? 0}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                    ))
                  }
                  
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
