import React from "react";
import { Link, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { ButtonGroup, Button } from "@chakra-ui/core";

const Landing = ({ isAuthenticated }) => {
  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <section className="landing">
      <div className="dark-overlay">
        <div className="landing-inner">
          <h1 className="x-large">Vine</h1>
          <p className="lead">
            Connect with other developers, share code, posts some stuff, create
            custom vines, build trees and just dream, it's not that hard
          </p>
          <ButtonGroup>
            <Button variantColor="teal" variant="solid">
              <Link to="/register">Sign Up</Link>
            </Button>
            <Button variantColor="teal" variant="outline">
              <Link to="/login">Login</Link>
            </Button>
          </ButtonGroup>
          {/* <div className="buttons">
            <Link to="/register" className="btn btn-primary">
              Sign Up
            </Link>
            <Link to="/login" className="btn btn-light">
              Login
            </Link>
          </div> */}
        </div>
      </div>
    </section>
  );
};

Landing.propTypes = {
  isAUthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, null)(Landing);
