import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { TiPlus } from 'react-icons/ti';
import { connect } from 'react-redux';
import { Translate } from 'react-redux-i18n';
import { createRoom, hideCreateRoom as hide } from '@/actions/org';
import Button from '@/components/ui/button';
import Dialog from '@/components/ui/dialog';
import Form from '@/components/ui/form';
import Countries from '@/locales/countries';

class CreateRoom extends PureComponent {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(e) {
    const { createRoom } = this.props;
    const { target: form } = e;
    e.preventDefault();
    const flag = form.flag.value;
    const name = form.name.value;
    if (!flag || !name) {
      return;
    }
    createRoom({ flag, name });
  }

  render() {
    const { isShowingCreateRoom, hide } = this.props;
    if (!isShowingCreateRoom) {
      return null;
    }
    return (
      <Dialog
        title="Room.Create.title"
        hide={hide}
      >
        <Form onSubmit={this.onSubmit}>
          <div>
            <label><Translate value="Room.Create.name" /></label>
            <input type="text" name="name" />
          </div>
          <div>
            <label><Translate value="Room.Create.flag" /></label>
            <select name="flag" defaultValue="gb">
              {Countries.map(({ code, name }) => (
                <option value={code}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div className="submit">
            <Button
              type="submit"
            >
              <TiPlus />
              <Translate value="Room.Create.submit" />
            </Button>
          </div>
        </Form>
      </Dialog>
    );
  }
}

CreateRoom.propTypes = {
  isShowingCreateRoom: PropTypes.bool.isRequired,
  createRoom: PropTypes.func.isRequired,
  hide: PropTypes.func.isRequired,
};

export default connect(
  ({
    org: {
      isShowingCreateRoom,
    },
  }) => ({
    isShowingCreateRoom,
  }),
  {
    createRoom,
    hide,
  }
)(CreateRoom);
