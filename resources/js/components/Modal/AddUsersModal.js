
import React, { Component } from 'react';
import { connect } from "react-redux";

import { db, storage } from '../../firebase';

import assets from '../../assets';

import { getFormattedDate, getFormattedID } from '../../functions';

import {ROLES} from '../../constants/roles';

const INITIAL_STATE = {
  invite_users: [
    { email: '', role: 0, admin: false, },
    { email: '', role: 0, admin: false, },
    { email: '', role: 0, admin: false, },
    { email: '', role: 0, admin: false, },
    { email: '', role: 0, admin: false, }
  ]
}

class AddUsersModal extends Component {

  constructor(props) {
    super(props)

    this.state = { ...INITIAL_STATE };
  }

  onChange = (event, index) => {
    let invite_users = this.state.invite_users
    invite_users[index][event.target.name] = event.target.value
    this.setState(invite_users);
  }

  onInviteUsers = event => {
    event.preventDefault()

    return

    const { authUser, users, room } = this.props
    const {email, role} = this.state
    const user = users[authUser.uid]

    actions.doSendInviteEmail(room, user, email, ROLES[role].role_label, users)
    .then(response => {
      this.openAddUserSuccessModal()
    })
    .catch(error => {
      this.closeModals()
    });

    this.closeDialog()
  }

  onReset = () => {
    this.setState({ ...INITIAL_STATE });
  }

  closeDialog = () => {
    this.onReset()
    $('.modal-background').addClass('d-none')
    $('.adduser-modal').addClass('d-none')
  }

  renderInviteUser = (index) => {
    const { email, role, admin } = this.state.invite_users[index]
    const email_label = `email${index}`
    const role_label = `role${index}`
    return (
      <div key={index} className="row">
        <div className="col-4">
          <label htmlFor={email_label}>Email:</label>
          <input
            name="email"
            id={email_label}
            type="email"
            className="form-control"
            value={email}
            onChange={(event) => {this.onChange(event, index)}}
          />
        </div>
        <div className="col-4">
          <label htmlFor={role_label}>Role:</label>
          <select
            name="role"
            id={role_label}
            value={role}
            onChange={(event) => {this.onChange(event, index)}}
            className="form-control"
          >
            { ROLES.map((role, i) => (
              <option key={i} value={i}>{role.role_label}</option>
            ))}
          </select>
        </div>
        <div className="col-4">
          { index == 0 ?
            <label className="d-block text-center">ClosingRoom Admin:</label>
          :
            <label></label>
          }
          <input
            name="admin"
            type="checkbox"
            className="form-control"
            value={admin}
            onChange={(event) => {this.onChange(event, index)}}
          />
        </div>
      </div>
    )
  }

  renderInviteUsers = () => {
    return _.times(5, (index) => this.renderInviteUser(index))
  }

  render() {
    return (
      <div className="adduser-modal mymodal d-none" onSubmit={this.onInviteUsers}>
        <form className="form-group">
          <div className="header d-flex justify-content-between align-items-center">
            <img src={assets.logo_transparent} className="size-40"/>
            <div className="d-flex align-items-center">
              <span className="title mr-3">Add Users to ClosingRoom</span>
              <img src={assets.upload_white} className="size-30"/>
            </div>
            <div
              className="close"
              onClick={(event) => {this.closeDialog()}}
            >
              <img src={assets.close} className="size-30"/>
            </div>
          </div>
          <div className="content p-4">
            <div className="font-weight-bold mb-1">Invite new users by email</div>
            <div className="mb-5">
              {this.renderInviteUsers()}
            </div>
            <div className="text-center">
              <button type="submit" className="button button-md button-white">
                Invite User(s)
              </button>
            </div>
          </div>
        </form>
      </div>
    )
  }
}

const mapStateToProps = ({ authUser, room, user }) => {
  return {
    authUser,
    room,
    user,
  };
};

export default connect(mapStateToProps)(AddUsersModal);