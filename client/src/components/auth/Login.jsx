import React, { Fragment, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import {
  Heading,
  Text,
  FormControl,
  FormLabel,
  Button,
  Input,
} from "@chakra-ui/core";
import PropTypes from "prop-types";
import { login } from "../../actions/auth";

const Login = ({ login, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  // Redirect if logged in
  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <Fragment className="login">
      <div className="login">
        <Heading as="h3">Sign In</Heading>
        <Text fontSize="lg">
          <i className="fas fa-user"></i> Sing in to your account
        </Text>
        <div className="auth-form">
          <form onSubmit={(e) => onSubmit(e)}>
            <FormControl isRequired>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input
                id="email"
                type={"email"}
                name="email"
                value={email}
                placeholder="Email"
                onChange={(e) => onChange(e)}
              />
            </FormControl>
            <FormControl isRequired>
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
            </FormControl>
            <Button
              className="authSubmit"
              variantColor="teal"
              variant="outline"
              type={"submit"}
              onClick={(e) => onSubmit(e)}
            >
              Login
            </Button>
          </form>

          <Text fontSize="sm">
            Don't have an account?
            <Button variantColor="teal" variant="ghost">
              <Link to="/register">Sign Up</Link>
            </Button>
          </Text>
        </div>
      </div>
    </Fragment>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { login })(Login);
