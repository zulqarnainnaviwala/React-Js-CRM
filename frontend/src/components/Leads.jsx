import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Table, Form, Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { PencilSquare } from "react-bootstrap-icons";
import { getUsers } from "../app/reducers/userSlice.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { parseISO, isBefore, startOfDay, endOfDay } from "date-fns";
import Spinner from "./Spinner";
import {
  getCustomers,
  reset as resetCustomer,
} from "../app/reducers/customerSlice.js";
import {
  getAllStatus,
  reset as resetStatus,
} from "../app/reducers/statusSlice.js";
import {
  getProducts,
  reset as resetProduct,
} from "../app/reducers/productSlice.js";
import Pagination from "./Pagination";
import DeleteCustomer from "./DeleteCustomer";

const Leads = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { customers, isLoading } = useSelector((state) => state.customers);
  const { statuses } = useSelector((state) => state.statuses);
  const { products } = useSelector((state) => state.products);
  const { users } = useSelector((state) => state.users);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const admin = user && user.userRole === "admin";
  const manager = user && user.userRole === "manager";

  const blackSortOrder = {
    companyName: "none",
    state: "none",
    city: "none",
    user: "none",
    status: "none",
    date: "none",
  };
  const [sortOrders, setSortOrders] = useState(blackSortOrder);

  useEffect(() => {
    const fetchData = async () => {
      if (admin || manager) {
        await dispatch(getUsers());
      }
      if (user) {
        await dispatch(resetCustomer());
        await dispatch(resetStatus());
        await dispatch(resetProduct());

        await dispatch(getAllStatus());
        await dispatch(getProducts());
        await dispatch(getCustomers());
      }
    };
    fetchData();
  }, [dispatch, user]);

  const handleSearchChange = (event) => {
    setSearchKeyword(event.target.value);
  };

  const handleUserChange = (event) => {
    setSelectedUser(event.target.value);
  };

  const handleStartDateChange = (date) => {
    setSelectedStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setSelectedEndDate(date);
  };

  const toggleSortOrder = (field) => {
    let newSortOrders = { ...blackSortOrder };
    newSortOrders[field] = sortOrders[field] === "asc" ? "desc" : "asc";
    setSortOrders(newSortOrders);
  };

  const freshLeads = customers.filter(
    (customer) => !customer.status || customer.status === ""
  );

  const sortedCustomers = freshLeads.slice().sort((a, b) => {
    if (Object.values(sortOrders).every((value) => value === "none")) {
      return parseISO(b.createdAt) - parseISO(a.createdAt);
    }

    for (const field in sortOrders) {
      if (sortOrders[field] !== "none") {
        if (field === "date") {
          const dateA = parseISO(a.createdAt);
          const dateB = parseISO(b.createdAt);

          if (sortOrders[field] === "asc") {
            return dateA - dateB; // Sort dates in ascending order
          } else {
            return dateB - dateA; // Sort dates in descending order
          }
        } else {
          const nameA = a[field].toLowerCase();
          const nameB = b[field].toLowerCase();

          if (sortOrders[field] === "asc") {
            return nameA.localeCompare(nameB);
          } else {
            return nameB.localeCompare(nameA);
          }
        }
      }
    }
    return 0;
  });

  const filteredCustomers = sortedCustomers.filter((customer) => {
    const keyword = searchKeyword.toLowerCase();

    const isUserMatch = selectedUser === "" || customer.user === selectedUser;
    const creationDate = parseISO(customer.createdAt);
    const startOfSelectedStartDate = startOfDay(selectedStartDate);
    const endOfSelectedEndDate = endOfDay(selectedEndDate);
    const isStartDateMatch =
      !selectedStartDate || isBefore(creationDate, endOfSelectedEndDate);
    const isEndDateMatch =
      !selectedEndDate || isBefore(startOfSelectedStartDate, creationDate);

    return (
      (customer.companyName.toLowerCase().includes(keyword) ||
        customer.state.toLowerCase().includes(keyword) ||
        customer.city.toLowerCase().includes(keyword)) &&
      isUserMatch &&
      isStartDateMatch &&
      isEndDateMatch
    );
  });

  const renderCustomers = filteredCustomers.map((item) => {
    const customer = {
      ...item,
      status:
        statuses.find((status) => status._id === item.status)?.status ||
        "Unknown",
      user: users.find((user) => user._id === item.user)?.userName || "Unknown",
      products: products.filter((product) =>
        item.products.includes(product._id)
      ),
    };

    return (
      <tr key={customer._id} className="atim">
        <td className="td">{customer.companyName}</td>
        <td className="td">{customer.state}</td>
        <td className="td">{customer.city}</td>
        {(admin || manager) && <td className="td">{customer.user}</td>}
        <td className="td">{customer.status}</td>
        <td className="td">
          {new Date(customer.createdAt).toLocaleDateString()}
        </td>
        <td className="td">
          <Button
            variant="link"
            className="symbol-button tdd"
            as={Link}
            to={{
              pathname: `/customers/editCustomer/${customer._id}`,
            }}
          >
            <PencilSquare />
          </Button>
          {admin && <DeleteCustomer className="tdd" customer={customer} />}
        </td>
      </tr>
    );
  });

  const isSortActive = Object.values(sortOrders).some(
    (order) => order !== "none"
  );

  const clearSort = () => {
    setSortOrders(blackSortOrder);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
  };

  const indexOfLastCustomer = currentPage * itemsPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - itemsPerPage;
  const currentCustomers = renderCustomers.slice(
    indexOfFirstCustomer,
    indexOfLastCustomer
  );

  return (
    <div className="customer_div">
      <section className="customer-sec">
        <Container className="customer-container">
          <Form>
            <Row className="customer-row">
              <Col lg={10}>
                <Row>
                  <Col lg={4}>
                    <Form.Group controlId="companyName" className="mb-2">
                      <Form.Control
                        type="text"
                        value={searchKeyword}
                        onChange={handleSearchChange}
                        placeholder="Search Business ..."
                      />
                    </Form.Group>
                  </Col>

                  {(admin || manager) && (
                    <Col lg={2}>
                      <Form.Group controlId="userFilter" className="mb-2">
                        <Form.Control
                          className="col_7 Select-status"
                          as="select"
                          value={selectedUser}
                          onChange={handleUserChange}
                        >
                          <option value="">Select User</option>
                          {users.map((user) => (
                            <option key={user._id} value={user._id}>
                              {user.userName}
                            </option>
                          ))}
                        </Form.Control>
                      </Form.Group>
                    </Col>
                  )}
                  <Col lg={2}>
                    <Form.Group controlId="startDateFilter" className="mb-2">
                      <DatePicker
                        selected={selectedStartDate}
                        onChange={handleStartDateChange}
                        placeholderText="Start Date"
                        dateFormat="yyyy-MM-dd"
                        className="form-control date_picker start"
                      />
                    </Form.Group>
                  </Col>
                  <Col lg={2}>
                    <Form.Group
                      controlId="endDateFilter"
                      className="mb-2 end_date "
                    >
                      <DatePicker
                        selected={selectedEndDate}
                        onChange={handleEndDateChange}
                        placeholderText="End Date"
                        dateFormat="yyyy-MM-dd"
                        className="form-control date_picker start"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
              <Col lg={2}>
                <Row>
                  <Col lg={12}>
                    <Form.Group className="mb-1">
                      <Link to="/addCustomers">
                        <Button variant="secondary" type="submit">
                          Create Customer
                        </Button>
                      </Link>
                    </Form.Group>
                    {(admin || manager) && (
                      <Form.Group className="mb-1">
                        <Link to="/customers/upload">
                          <Button variant="secondary" type="submit">
                            Upload
                          </Button>
                        </Link>
                      </Form.Group>
                    )}
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
          <Table className="customers_table">
            <thead>
              <tr>
                <th className="custoner-col-name">
                  Business Name
                  <span
                    className="table-header"
                    onClick={() => toggleSortOrder("companyName")}
                    style={{
                      float: "right",
                      marginRight: "15px",
                      padding: "0px 10px",
                    }}
                  >
                    {sortOrders.companyName === "asc"
                      ? " ↓"
                      : sortOrders.companyName === "desc"
                      ? " ↑"
                      : " ↓↑"}
                  </span>
                </th>
                <th className="custoner-col-name">
                  State
                  <span
                    className="table-header"
                    onClick={() => toggleSortOrder("state")}
                    style={{
                      float: "right",
                      marginRight: "15px",
                      padding: "0px 10px",
                    }}
                  >
                    {sortOrders.state === "asc"
                      ? " ↓"
                      : sortOrders.state === "desc"
                      ? " ↑"
                      : " ↓↑"}
                  </span>
                </th>
                <th className="custoner-col-name">
                  City
                  <span
                    className="table-header"
                    onClick={() => toggleSortOrder("city")}
                    style={{
                      float: "right",
                      marginRight: "15px",
                      padding: "0px 10px",
                    }}
                  >
                    {sortOrders.city === "asc"
                      ? " ↓"
                      : sortOrders.city === "desc"
                      ? " ↑"
                      : " ↓↑"}
                  </span>
                </th>
                {(admin || manager) && (
                  <th className="custoner-col-name">User</th>
                )}
                <th className="custoner-col-name">Status</th>
                <th className="custoner-col-name">
                  Date
                  <span
                    className="table-header"
                    onClick={() => toggleSortOrder("date")}
                    style={{
                      float: "right",
                      marginRight: "15px",
                      padding: "0px 10px",
                    }}
                  >
                    {sortOrders.date === "asc"
                      ? " ↓"
                      : sortOrders.date === "desc"
                      ? " ↑"
                      : " ↓↑"}
                  </span>
                </th>
                <th className="custoner-col-name">Action</th>
              </tr>
            </thead>
            <tbody className="tbody">
              {currentCustomers.length === 0
                ? "No Customers"
                : currentCustomers}
            </tbody>
          </Table>
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredCustomers.length / itemsPerPage)}
            onPageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
          {isSortActive && (
            <div className="clear-sort" onClick={clearSort}>
              ✖ clear
            </div>
          )}
          {isLoading && <Spinner />}
        </Container>
      </section>
    </div>
  );
};

export default Leads;