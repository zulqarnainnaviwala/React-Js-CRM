import React, { useState, useEffect, useRef } from "react";
import { Col, Form, Row, Container } from "react-bootstrap";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useDispatch } from "react-redux";
import { MultiSelect } from "react-multi-select-component";
import { useSelector } from "react-redux";
import {
  addCustomer,
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

import { reset as resetUsers } from "../app/reducers/userSlice.js";
import Toast from "./Toast";
import Spinner from "./Spinner";

const AddCustomer = () => {
  const dispatch = useDispatch();
  const newCommentInputRef = useRef(null);

  const blankForm = {
    companyName: "",
    companyPhone: "",
    companyFax: "",
    companyAddress: "",
    country: "",
    state: "",
    city: "",
    zipCode: "",
    personName: "",
    personPhone: "",
    personEmail: "",
    comments: [{ text: "", name: "", time: new Date() }],
    status: "",
    products: [],
  };
  const [formData, setFormData] = useState(blankForm);
  const { isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.customers
  );
  const { statuses } = useSelector((state) => state.statuses);
  const { products } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        await dispatch(resetUsers());
        await dispatch(resetCustomer());
        await dispatch(resetStatus());
        await dispatch(resetProduct());

        await dispatch(getAllStatus());
        await dispatch(getProducts());
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (isSuccess) {
      setFormData(blankForm);
    }
  }, [isSuccess]);

  const productNames = products.map((product) => ({
    label: product.product,
    value: product.slug,
    _id: product._id,
  }));

  // const handleCommentChange = (index, value) => {
  //   const newComments = [...formData.comments];
  //   newComments[index] = value;
  //   setFormData((formData) => ({
  //     ...formData,
  //     comments: newComments,
  //   }));
  // };
  const handleCommentChange = (index, value) => {
    const newComments = [...formData.comments];
    newComments[index] = { text: value, name: user.fullName, time: new Date() };
    setFormData((formData) => ({
      ...formData,
      comments: newComments,
    }));
  };

  // const addCommentField = () => {
  //   if (formData.comments[formData.comments.length - 1].trim() !== "") {
  //     setFormData((formData) => ({
  //       ...formData,
  //       comments: [...formData.comments, ""],
  //     }));

  //   } else {
  //     if (newCommentInputRef.current) {
  //       newCommentInputRef.current.focus();
  //     }
  //   }
  // };
  const addCommentField = () => {
    const lastComment = formData.comments[formData.comments.length - 1];
    if (lastComment.text.trim() !== "") {
      setFormData((formData) => ({
        ...formData,
        comments: [
          ...formData.comments,
          { text: "", name: user.fullName, time: new Date() },
        ],
      }));
    } else {
      if (newCommentInputRef.current) {
        // Focus on the newly added comment field
        newCommentInputRef.current.focus();
      }
    }
  };

  const handleChange = async (event) => {
    setFormData((formData) => ({
      ...formData,
      [event.target.name]: event.target.value,
    }));
  };

  const handleInputChange = (name, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   const nonEmptyComments = await formData.comments.filter(
  //     (comment) => comment.trim() !== ""
  //   );
  //   await dispatch(addCustomer({ ...formData, comments: nonEmptyComments }));
  // };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Filter out comments with empty text
    const nonEmptyComments = formData.comments.filter(
      (comment) => comment.text.trim() !== ""
    );

    // Create a new array with comments containing only text and time properties
    const commentsForSubmission = nonEmptyComments.map(
      ({ text, name, time }) => ({
        text,
        name,
        time,
      })
    );

    // Dispatch the action with the updated formData
    await dispatch(
      addCustomer({ ...formData, comments: commentsForSubmission })
    );
  };

  return (
    <main className="Addcustomer_main">
      <Container className="Addcustomer-container">
        <Form onSubmit={handleSubmit}>
          <Row className="Addcustomer_row">
            <Col md={8}>
              <Form.Group as={Row} controlId="companyName" className="mb-2">
                <Form.Label className="label" column sm={3}>
                  Company Name
                </Form.Label>
                <Col sm={9}>
                  <Form.Control
                    className="input"
                    type="text"
                    placeholder=""
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId="companyPhone" className="mb-2">
                <Form.Label className="label" column sm={3}>
                  Phone
                </Form.Label>
                <Col sm={9}>
                  <PhoneInput
                    name="companyPhone"
                    value={formData.companyPhone}
                    onChange={(value) =>
                      handleInputChange("companyPhone", value)
                    }
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId="companyFax" className="mb-2">
                <Form.Label className="label" column sm={3}>
                  Fax
                </Form.Label>
                <Col sm={9}>
                  <Form.Control
                    className="input"
                    type="text"
                    placeholder=""
                    name="companyFax"
                    value={formData.companyFax}
                    onChange={handleChange}
                    // required
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId="companyAddress" className="mb-2">
                <Form.Label className="label" column sm={3}>
                  Address
                </Form.Label>
                <Col sm={9}>
                  <Form.Control
                    className="input"
                    type="text"
                    placeholder=""
                    name="companyAddress"
                    value={formData.companyAddress}
                    onChange={handleChange}
                    // required
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId="country" className="mb-2">
                <Form.Label className="label" column sm={3}>
                  Country
                </Form.Label>
                <Col sm={9}>
                  <Form.Control
                    className="input"
                    type="text"
                    placeholder=""
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    // required
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId="SCZ" className="mb-2">
                <Form.Label column sm={3}></Form.Label>
                <Col sm={3}>
                  <Form.Group as={Col} controlId="state" className="mb-2">
                    <Form.Label className="label">State</Form.Label>
                    <Form.Control
                      className="input"
                      type="text"
                      placeholder=""
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      // required
                    />
                  </Form.Group>
                </Col>

                <Col sm={3}>
                  <Form.Group as={Col} controlId="city" className="mb-2">
                    <Form.Label className="label">City</Form.Label>
                    <Form.Control
                      className="input"
                      type="text"
                      placeholder=""
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      // required
                    />
                  </Form.Group>
                </Col>

                <Col sm={3}>
                  <Form.Group as={Col} controlId="zipCode" className="mb-2">
                    <Form.Label className="label">Zip Code</Form.Label>
                    <Form.Control
                      className="input"
                      type="number"
                      placeholder=""
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      // required
                    />
                  </Form.Group>
                </Col>
              </Form.Group>
              <h5 className="label">Contact Person</h5>
              <Form.Group as={Row} controlId="personName" className="mb-2">
                <Form.Label className="label" column sm={3}>
                  Name
                </Form.Label>
                <Col sm={9}>
                  <Form.Control
                    className="input"
                    type="text"
                    placeholder=""
                    name="personName"
                    value={formData.personName}
                    onChange={handleChange}
                    // required
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId="personPhone" className="mb-2">
                <Form.Label className="label" column sm={3}>
                  Phone
                </Form.Label>
                <Col sm={9}>
                  <PhoneInput
                    name="personPhone"
                    value={formData.personPhone}
                    onChange={(value) =>
                      handleInputChange("personPhone", value)
                    }
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId="personEmail" className="mb-2">
                <Form.Label className="label" column sm={3}>
                  Email
                </Form.Label>
                <Col sm={9}>
                  <Form.Control
                    className="input"
                    type="email"
                    placeholder=""
                    name="personEmail"
                    value={formData.personEmail}
                    onChange={handleChange}
                    // required
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId="comments" className="mb-2">
                <Form.Label className="label" column sm={3}>
                  Comments
                </Form.Label>
                <Col
                  sm={9}
                  style={{
                    maxHeight: "200px",
                    overflow: "auto",
                  }}
                >
                  {/* {formData.comments.map((comment, index) => (
                    <Form.Control
                      ref={newCommentInputRef}
                      className="input"
                      as="textarea"
                      placeholder=""
                      rows={2}
                      value={comment}
                      onChange={(e) =>
                        handleCommentChange(index, e.target.value)
                      }
                    />
                  ))} */}
                  {formData.comments.map((comment, index) => (
                    // <div key={index} className="comment-container">
                    <Form.Control
                      key={index}
                      ref={newCommentInputRef}
                      className="Select-status mb-1"
                      as="textarea"
                      placeholder=""
                      rows={2}
                      value={comment.text}
                      onChange={(e) =>
                        handleCommentChange(index, e.target.value)
                      }
                    />
                    //   <div className="comment-details">
                    //     <span className="comment-time">
                    //       {new Date(comment.time).toLocaleString("en-US", {
                    //         year: "numeric",
                    //         month: "long",
                    //         day: "numeric",
                    //         hour: "numeric",
                    //         minute: "numeric",
                    //         hour12: true,
                    //       })}
                    //     </span>
                    //   </div>
                    // </div>
                  ))}
                </Col>
                <Col>
                  <button
                    type="button"
                    onClick={addCommentField}
                    className="plus-check"
                  >
                    +
                  </button>
                </Col>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group as={Row} className="mb-2 submt">
                <button
                  className=" btn_f submit "
                  variant="secondary"
                  type="submit"
                >
                  Submit
                </button>
              </Form.Group>
              <div className="drop-container">
                <Form.Group as={Row} className="mb-2">
                  <Col sm={12}>
                    <Form.Select
                      className="input"
                      // className="Select-status mb-1"

                      value={formData.status}
                      name="status"
                      onChange={handleChange}
                      required
                    >
                      <option value="" disabled>
                        Select Status
                      </option>

                      {statuses?.map((option) => (
                        <option key={option._id} value={option._id}>
                          {option.status}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-2 drop">
                  <Col sm={12}>
                    <MultiSelect
                      name="products"
                      options={productNames}
                      value={formData.products}
                      onChange={(selected) =>
                        handleInputChange("products", selected)
                      }
                      labelledBy="Select"
                    />
                  </Col>
                </Form.Group>
              </div>
            </Col>
          </Row>
        </Form>
        {isLoading && <Spinner />}
        {isSuccess && <Toast isSuccess={isSuccess} message={message} />}
        {isError && <Toast isError={isError} message={message} />}
      </Container>
    </main>
  );
};

export default AddCustomer;
