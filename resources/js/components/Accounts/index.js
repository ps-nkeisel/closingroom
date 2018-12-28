import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { connect } from "react-redux";

import { db } from '../../firebase';

import * as routes from '../../constants/routes';
import assets from '../../assets';

import * as functions from '../../functions';

import DefaultHeader from '../Header/DefaultHeader';

import * as actions from "../../actions";

import _ from 'lodash';

import KYCApprovalsItem from '../Sidebar/KYCApprovalsItem';


const INITIAL_STATE = {

}

class AccountsPage extends Component {
  state = { ...INITIAL_STATE };

  componentWillMount() {
    this.init(this.props)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps != this.props) {
      this.init(nextProps)
    }
  }

  init = (props) => {
    const { users } = props
    if (!users) {
      return
    }
  }

  render() {
    const { users, rooms } = this.props;

    if (!users || !rooms) {
      return <div></div>
    }

    return (
      <div className="accounts-page d-flex flex-column">
        <DefaultHeader title="Accounts" />
        <div className="page-content flex-grow-1">
          <div className="header row mx-0 align-items-center">
            <div className="search-area col-4 d-flex align-items-center">
              <div className="col-2 text-white">Search</div>
              <div className="col-10"><input type="text" className="px-3"/></div>
            </div>
            <div className="kyc-area col-4">
              <KYCApprovalsItem color="white"/>
            </div>
          </div>
          <table className="table mytable accounts">
            <thead>
              <tr>
                <th>User ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>User Level</th>
                <th>Join Date</th>
                <th>Active Rooms</th>
                <th></th>
              </tr>
            </thead>
            { users &&
              <tbody>
                {Object.keys(users).map(key =>
                  <UserRow key={key} user={users[key]} rooms={rooms}/>
                )}
              </tbody>
            }
          </table>
        </div>
      </div>
    );
  }
}

const UserRow = ({user, rooms}) => {

  const renderActiveRooms = () => {
    let activeRooms = 0
    _.forEach(rooms, function(room) {
      let isActiveInRoom = false
      _.forEach(room.users, function(room_user, key) {
        if (key === user.uid) {
          isActiveInRoom = true
        }
      })
      activeRooms += isActiveInRoom
    });
    return activeRooms
  }

  return (
    <tr>
      <td>{functions.getFormattedID(user.id, 7)}</td>
      <td>{user.firstname}</td>
      <td>{user.lastname}</td>
      <td>{user.level}</td>
      <td>{functions.getFormattedDate(new Date(user.join_date))}</td>
      <td>{renderActiveRooms()}</td>
      <td className="action">
        {/* <Link to={`/rooms/${room.room_id}`}> */}
          <button className="button button-md button-blue">
            More
          </button>
        {/* </Link> */}
      </td>
    </tr>
  )
}

const mapStateToProps = ({ users, rooms }) => {
  return {
    users,
    rooms,
  };
};

export default withRouter(connect(mapStateToProps, actions)(AccountsPage));