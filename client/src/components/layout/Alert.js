import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

//now we use a map through the alerts and output whatever the message along with class for styling so in adiition to that i want to make sure that its not null i also want to make sure that there is actully somthing in the array i dont want to
//anything if the array is zero
const Alert = ({ alerts }) =>
  alerts !== null && alerts.length > 0 && alerts.map(alert => (
    // <div className="container" style={{marginTop: "50px"}}>
    <div key={alert.id} className={`alert alert-${alert.alertType}`}>
     {alert.msg}
     </div>
    //  </div>
  ));

Alert.propTypes = {
  //alerts in now gonna be a propes so we need to add that here
  alerts: PropTypes.array.isRequired,
};

//so now in this state we actually want to get the alert state and that array we want to fetch that into this component
const mapStateToProps = (state) => ({
  alerts: state.alert,
}); //so this will maping the redux state to props in this component so we have access to it. in this case its goingn to be array of alert

export default connect(mapStateToProps)(Alert);
