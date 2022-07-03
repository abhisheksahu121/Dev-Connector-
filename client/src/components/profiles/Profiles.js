//so in this component we have list out all the profile and show the indivisual profile

//i am also use useEffect bcs as soon as the profile load we need to call thet getprofile action that we created early
import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
//all the profile are loading so we want to show the spinner
import Spinner from "../layout/Spinner";
import ProfileItem from './ProfileItem';
import { getProfiles  } from "../../actions/profile";
const Profiles = ({ getProfiles, profile: { profiles, loading } }) => {
  //as soon as this load we want to run getprofile and we just wanted to run once
  useEffect(() => {
    getProfiles();
  }, [getProfiles]);
  //we only want to show the getProfiles when the loading is false and if loading is true we only want to show the spinner

  return <Fragment>
    { 
    //if the loading in true then we show the spinner otherwise we show the fragment
     loading ? <Spinner/> : <Fragment>
      <h1 className="large text-primary">Developers</h1>
      <p className="lead">
        <i className="fab fa-connectdevlop"></i> Brows and connect with Developers
        </p>
        <div className='profiles'>
        {profiles.length > 0 ? (
          profiles.map(profile => (
            <ProfileItem key={profile._id} profile={profile} />
          ))
        ): <h4>No profiles found...</h4>}
        </div>
    
    </Fragment>

    }
    </Fragment>;
};

Profiles.propTypes = {
  getProfiles: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  profile: state.profile
});

export default connect(mapStateToProps, { getProfiles })(Profiles);
