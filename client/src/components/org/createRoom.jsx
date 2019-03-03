import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { TiPlus } from 'react-icons/ti';
import { connect } from 'react-redux';
import { Translate } from 'react-redux-i18n';
import { createRoom } from '@/actions/org';
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
    const peerLimit = parseInt(form.peerLimit.value, 10);
    if (!flag || !name || !peerLimit) {
      return;
    }
    createRoom({ flag, name, peerLimit });
  }

  render() {
    return (
      <Dialog
        id="Org.CreateRoom"
      >
        <Form onSubmit={this.onSubmit}>
          <div>
            <label>
              <Translate value="Org.CreateRoom.name" />
            </label>
            <input
              type="text"
              name="name"
              required
              autoFocus
            />
          </div>
          <div>
            <label>
              <Translate value="Org.CreateRoom.flag" />
            </label>
            <select name="flag" defaultValue="gb" required>
              {Countries.map(({ code, name }) => (
                <option
                  key={code}
                  value={code}
                >
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>
              <Translate value="Org.CreateRoom.peerLimit" />
            </label>
            <input
              type="number"
              name="peerLimit"
              min="2"
              max="8"
              defaultValue="8"
              required
            />
          </div>
          <div className="submit">
            <Button
              type="submit"
            >
              <TiPlus />
              <Translate value="Org.CreateRoom.submit" />
            </Button>
          </div>
        </Form>
      </Dialog>
    );
  }
}

CreateRoom.propTypes = {
  createRoom: PropTypes.func.isRequired,
};

export default connect(
  () => ({}),
  {
    createRoom,
  }
)(CreateRoom);
