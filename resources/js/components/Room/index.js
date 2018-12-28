import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import { connect } from "react-redux";

import { db } from '../../firebase'

import * as actions from "../../actions";

import RoomHeader from '../Header/RoomHeader';

import UserList from './UserList';
import Messages from './Messages';
import Tasks from './Tasks';
import ViewFiles from './ViewFiles';

const INITIAL_STATE = {
  users: null,
  receiver_id: null,
  viewFiles: false,
}

class RoomPage extends Component {
  state = { ...INITIAL_STATE };

  componentWillMount() {
    const { room_id } = this.props.match.params
    const { fetchRoom } = this.props
    fetchRoom(room_id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps != this.props) {
      this.init(nextProps)
    }
  }

  init = (props) => {
    const {room} = props
    let users = props.users;
    if (!room || !users) {
      return
    }

    Object.keys(users).map(key => {
      users[key].registered = false
    })
    Object.keys(room.users).map(key => {
      users[key].registered = true
    })

    this.setState({users})
  }

  handleSelectReceiver = (receiver_id) => {
    if (this.state.receiver_id === receiver_id) {
      receiver_id = null;
    }
    // this.setState({
    //   receiver_id,
    // })
    // console.log(receiver_id)
  }

  handleInviteUser = (user_id) => {
    const { room_id } = this.props.match.params
    db.doInviteUserToRoom(room_id, user_id)
  }

  handleViewFiles = (viewFiles) => {
    this.setState({viewFiles})
  }

  render() {
    const { authUser, room } = this.props
    const { users, receiver_id, viewFiles } = this.state

    if (!room || !users) {
      return <div></div>
    }

    return (
      <div className="room-page d-flex flex-column h-100">
        <RoomHeader/>
        <div className="page-content flex-grow-1 d-flex flex-row">
          <UserList users={users} receiver_id={receiver_id} handleSelectReceiver={this.handleSelectReceiver} handleInviteUser={this.handleInviteUser}/>
          { !viewFiles ?
            <div className="flex-grow-1 d-flex flex-row">
              <Messages users={users} receiver_id={receiver_id}/>
              <Tasks user_id={users[authUser.uid].id} handleViewFiles={this.handleViewFiles}/>
            </div>
          :
            <ViewFiles user_id={users[authUser.uid].id} handleViewFiles={this.handleViewFiles}/>
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ authUser, users, room }) => {
  return {
    authUser,
    users,
    room,
  };
};

export default withRouter(connect(mapStateToProps, actions)(RoomPage));