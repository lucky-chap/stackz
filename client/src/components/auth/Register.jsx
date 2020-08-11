import React, { Fragment, useState } from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { setAlert } from "../../actions/alert";
import { register } from "../../actions/auth";
import PropTypes from "prop-types";
import {
  Heading,
  Text,
  FormControl,
  FormLabel,
  Button,
  Input,
} from "@chakra-ui/core";

const Register = ({ setAlert, register, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });

  const { name, email, password, password2 } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    if (password !== password2) {
      setAlert("Passwords do not match", "danger");
    } else {
      register(name, email, password);
    }
  };

  // Redirect if logged in
  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <Fragment className="login">
      <div className="login">
        <Heading as="h3">Sign Up</Heading>
        <Text fontSize="lg">
          <i className="fas fa-user"></i> Create Your Account
        </Text>
        <div className="auth-form">
          <form onSubmit={(e) => onSubmit(e)}>
            <FormControl isRequired>
              <FormLabel htmlFor="name">Name</FormLabel>
              <Input
                id="name"
                type={"text"}
                name="name"
                value={name}
                placeholder="Name"
                onChange={(e) => onChange(e)}
              />
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input
                id="email"
                type={"email"}
                name="email"
                value={email}
                placeholder="Email"
                onChange={(e) => onChange(e)}
              />
              <p>
                This site uses Gravatar so if you want a profile image, use a
                Gravatar email
              </p>
              <FormLabel htmlFor="password">Password</FormLabel>
              <Input
                id="password"
                placeholder="Password"
                type={"password"}
                name="password"
                minLength="6"
                value={password}
                onChange={(e) => onChange(e)}
              />
              <FormLabel htmlFor="password">Confirm Password</FormLabel>
              <Input
                id="password2"
                placeholder="Confirm Password"
                type={"password"}
                name="password2"
                minLength="6"
                value={password2}
                onChange={(e) => onChange(e)}
              />
            </FormControl>

            <Button
              className="authSubmit"
              variantColor="teal"
              variant="outline"
              type={"submit"}
              onClick={(e) => onSubmit(e)}
            >
              Register
            </Button>
          </form>

          <Text fontSize="sm">
            Already a member?
            <Button variantColor="teal" variant="ghost">
              <Link to="/login">Log In</Link>
            </Button>
          </Text>
        </div>
      </div>
    </Fragment>
  );
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { setAlert, register })(Register);
