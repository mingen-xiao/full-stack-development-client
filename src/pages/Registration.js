import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup"; // To make sure user put in the correct info
import axios from "axios";

function Registration() {
  //   To pass the values inside
  const initialValues = {
    username: "",
    password: "",
  };

  // Contains each one of the fields we need in the form
  // Use "Yup" to validate 驗證 what exactly we need
  const validationSchema = Yup.object().shape({
    // "Yup" helps to validate whether the input is a "String"
    // "min()" & "max()" means the size
    username: Yup.string().min(3).max(16).required(),
    password: Yup.string().min(6).max(28).required(),
  });

  const onSubmit = (data) => {
    axios.post("https://full-stack-development-mingen-e00e505197b4.herokuapp.com/auth", data).then(() => {
      console.log(data);
    });
  };

  return (
    <div>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className="formContainer">
          <label>Username: </label>
          <ErrorMessage name="username" component="span" />
          <Field
            id="inputCreatePost"
            name="username"
            placeholder="(Ex. Enzo123...)"
          />

          <label>Password: </label>
          <ErrorMessage name="password" component="span" />
          <Field
            type="password"  // nonvisible password shown
            id="inputCreatePost"
            name="password"
            placeholder="Your Password..."
          />

          <button type="submit">Register</button>
        </Form>
      </Formik>
    </div>
  );
}

export default Registration;
