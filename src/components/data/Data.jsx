import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  getDocs,
  getCountFromServer,
} from "firebase/firestore";
import { db } from "../../firebase-config";
import withAuth from "../HOC/withAuth";
import { MoonLoader } from "react-spinners";
import { Col, Form, Row, Button, InputGroup } from "react-bootstrap";
import Header from "../header/Header";
import { CSVLink } from "react-csv";
import { IoReload } from "react-icons/io5";

function Data({ user, server }) {
  const [allData, setAllData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [searchNumber, setSearchNumber] = useState("");
  const [totalCount, setTotalCount] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedMode, setSelectedMode] = useState("input");

  const [page, setPage] = useState(1);
  const itemsPerPage = 20;

  // fetch all data
  const fetchAllData = async () => {
    setIsLoading(true);
    const q = query(collection(db, server), orderBy("timestamp", "desc"));
    const snapshot = await getDocs(q);
    const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setAllData(docs);
    setIsLoading(false);
  };

  // fetch data by date
  const fetchDataByDate = async (dateStr) => {
    if (!dateStr) return fetchAllData();

    setIsLoading(true);
    const dateObj = new Date(dateStr);
    dateObj.setHours(0, 0, 0, 0);
    const start = dateObj.getTime() / 1000;
    const end = start + 86400000 - 1;

    const q = query(collection(db, server), orderBy("timestamp"));
    const snapshot = await getDocs(q);
    const docs = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((item) => item.timestamp >= start && item.timestamp <= end);

    setAllData(docs);
    setPage(1);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // handle search
  const handleSearch = async () => {
    const trimmed = searchNumber.trim();
    if (!/^\d{10}$/.test(trimmed)) {
      alert("Please enter a valid 10-digit WhatsApp number.");
      return;
    }

    setIsLoading(true);
    setIsSearching(true);

    const q = query(collection(db, server), orderBy("number"));
    const snapshot = await getDocs(q);
    const results = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((item) => item.number?.toString().includes(trimmed));

    setSearchResults(results);
    setPage(1);
    setIsLoading(false);
  };

  // handle total count
  const handleTotalCount = async () => {
    setIsLoading(true);
    try {
      const coll = collection(db, server);
      const snapshot = await getCountFromServer(coll);
      setTotalCount(snapshot.data().count);
    } catch (error) {
      console.error("Error getting document count:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // generate date
  const generateDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const dataToShow = isSearching ? searchResults : allData;
  const totalPages = Math.ceil(dataToShow.length / itemsPerPage);
  const displayedData = dataToShow.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // handle clear filters
  const handleClearFilters = () => {
    setSelectedDate("");
    setSearchNumber("");
    setIsSearching(false);
    setSearchResults([]);
    setPage(1);
    fetchAllData();
  };

  let headText;
  if (server === "output_server1") {
    headText = "1";
  } else if (server === "input_images2") {
    headText = "2";
  } else if (server === "input_images3") {
    headText = "3";
  } else if (server === "input_images4") {
    headText = "4";
  }

  console.log(displayedData);

  // const handleShowOutputData = async (e) => {
  //   e.preventDefault();

  //   const mode = e.target.value;
  //   setSelectedMode(mode);

  //   let collectionMap = {
  //     input_images: { input: "input_images", output: "output_server1" },
  //     input_images2: { input: "input_images2", output: "output_images2" },
  //     input_images3: { input: "input_images3", output: "output_images3" },
  //   };

  //   let outputColName = collectionMap[server]?.[mode];

  //   if (!outputColName) {
  //     console.error("Invalid server or mode selected");
  //     return;
  //   }

  //   setIsLoading(true);

  //   try {
  //     const q = query(
  //       collection(db, outputColName),
  //       orderBy("timestamp", "desc")
  //     );
  //     const snapshot = await getDocs(q);
  //     const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  //     setAllData(docs);
  //   } catch (err) {
  //     console.error("Error fetching data: ", err);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <div className="Data container-fluid p-2 d-flex flex-column gap-5 bg-light vh-100 overflow-auto">
      <Header user={user} />
      <h1 className="text-center fw-bold p-3" style={{ color: "#eb1c25" }}>
        Sunrise Bengal Heritage Data (Server {headText})
      </h1>

      <div className="table-responsive p-xl-3">
        <div className="mb-3">
          <Form.Group as={Row} controlId="formDate">
            <Form.Label>Select Date</Form.Label>
            <Col sm={4}>
              <Form.Control
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSearchNumber("");
                  setIsSearching(false);
                  fetchDataByDate(e.target.value);
                }}
              />
            </Col>
            <Col sm={6} className="mt-2 mt-md-0">
              <Button variant="secondary" onClick={handleTotalCount}>
                <span>
                  Total Count {totalCount && `: ${totalCount}`}{" "}
                  <IoReload className="fs-5" />
                </span>
              </Button>
            </Col>
          </Form.Group>
        </div>

        <div className="mb-4">
          <Form.Group as={Row} controlId="searchNumber">
            <Form.Label>Search by WhatsApp Number</Form.Label>
            <Col sm={4} md={6}>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Enter WhatsApp number"
                  value={searchNumber}
                  onChange={(e) => setSearchNumber(e.target.value)}
                />
                <Button variant="danger" onClick={handleSearch}>
                  Search
                </Button>
              </InputGroup>
            </Col>
            <Col sm={4} className="mt-2 mt-md-0">
              <Button variant="secondary" onClick={handleClearFilters}>
                Clear Filters
              </Button>{" "}
              {allData.length > 0 && (
                <CSVLink data={allData} filename="bengal_heritage-data.csv">
                  <Button variant="secondary">Download CSV</Button>
                  {/* <button>Download CSV</button> */}
                </CSVLink>
              )}
            </Col>
          </Form.Group>
        </div>

        {isLoading ? (
          <div className="d-flex justify-content-center align-items-center p-5">
            <MoonLoader size={40} color="#eb1c25" />
          </div>
        ) : (
          <>
            <table className="table table-striped table-bordered table-hover">
              <thead>
                <tr>
                  <th>Sr.</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Age Group</th>
                  <th>Gender</th>
                  <th>Style</th>
                  {/* <th>Time</th> */}
                </tr>
              </thead>
              <tbody>
                {displayedData.length > 0 ? (
                  displayedData.map((item, idx) => (
                    <tr key={item.id}>
                      <th>{(page - 1) * itemsPerPage + idx + 1}</th>
                      <td>{item.name}</td>
                      <td>{item.whatsapp || item.number}</td>
                      <td>{item.ageGroup || item.age}</td>
                      <td>{item.gender}</td>
                      <td>{item.style}</td>
                      {/* <td>{generateDate(item.timestamp)}</td> */}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center">
                      No data found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="d-flex justify-content-center gap-3 py-3">
              <button
                className="btn btn-danger"
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
              >
                Previous
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                className="btn btn-danger"
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default withAuth(Data);
