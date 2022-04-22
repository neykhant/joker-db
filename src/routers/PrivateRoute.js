import { Navigate } from "react-router-dom";
import { connect } from "react-redux";

const PrivateRoute = ({ auth, children }) => {
  if (auth.isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

const mapStateToProps = (store) => ({
  auth: store.auth,
});

export default connect(mapStateToProps)(PrivateRoute);
