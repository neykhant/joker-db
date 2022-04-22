import { Navigate } from "react-router-dom";
import { connect } from "react-redux";

const AuthRoute = ({ auth, children }) => {
  if (!auth.isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

const mapStateToProps = (store) => ({
  auth: store.auth,
});

export default connect(mapStateToProps)(AuthRoute);
