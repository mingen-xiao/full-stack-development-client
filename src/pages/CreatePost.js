import React, { useContext, useEffect } from "react";
// "Formik": This library is easy to validate the data to be able to submit
//           (tell the user if they got a filed before submitting a form)
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

const CreatePost = () => {
  const { authState } = useContext(AuthContext);

  let navigate = useNavigate();

  //   To pass the values inside
  const initialValues = {
    title: "",
    postText: "",
  };

  // If not logged in, not able to see the "create a post", but redirect to "login"
  useEffect(() => {
    // When refresh the page, it makes a request to ask if status is "false", will redirect to HOME page
    // which cause rerender the page at the same time, so cannot use (!authState.status), 
    // but validate by checking the "accessToken" from "localStorage"
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
    }
  }, []); // "[]": To avioid running infinity

  // Contains each one of the fields we need in the form
  // Use "Yup" to validate 驗證 what exactly we need
  const validationSchema = Yup.object().shape({
    // "Yup" helps to validate whether the input is a "String"
    // "required()" means "title" is necessary
    title: Yup.string().required("You must input a Title!"),
    postText: Yup.string().required(),
  });

  //   To get the data from the form automatically when clicked
  const onSubmit = (data) => {
    axios
      .post("http://localhost:3001/posts", data, {
        // Instead of sending the username from the frontend (cuz no more entering username when creating a post),
        // so in order to get the username, we are passing the "access token"
        // and validating the user who trying to create the post is exactly the user who is logged in now.
        // If yes, call the validate token middleware
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        // Set the list of posts = the response data from the API request
        navigate("/"); // To display data received into the application
      });
  };

  return (
    <div className="createPostPage">
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className="formContainer">
          <label>Title: </label>
          <ErrorMessage name="title" component="span" />
          {/* "Field": An input that would be used in the form (i.e. The tile of the Post) */}
          {/* "id": Random unique ID */}
          {/* "name": Same as the field in the database */}
          {/* "placeholder": Describe what should be written here (i.e. input) */}
          <Field
            id="inputCreatePost"
            name="title"
            placeholder="(Ex. Title...)"
          />
          <label>Post: </label>
          <ErrorMessage name="postText" component="span" />
          <Field
            id="inputCreatePost"
            name="postText"
            placeholder="(Ex. Post...)"
          />

          <button type="submit">Create Post</button>
        </Form>
      </Formik>
    </div>
  );
};

export default CreatePost;
