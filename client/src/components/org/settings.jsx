import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { TiTick, TiTimes } from 'react-icons/ti';
import { connect } from 'react-redux';
import { Translate } from 'react-redux-i18n';
import { withRouter } from 'react-router';
import styled from 'styled-components';
import { hide } from '@/actions/dialog';
import { remove, update } from '@/actions/org';
import Button from '@/components/ui/button';
import Dialog from '@/components/ui/dialog';
import Form from '@/components/ui/form';

const Tabs = styled.div`
  display: flex;
  margin: -1rem;
  margin-bottom: 1rem;
  background-color: #111;
  color: #eee;
  > div {
    font-weight: 700;
    padding: 0.5rem 1rem;
    cursor: pointer;
    transition: background-color ease-out .2s;
    will-change: background-color, color;
    &:hover {
      background-color: #333;
    }
    &.active {
      background-color: #eee;
      color: #353535;
      cursor: default;
    }
  }
`;

const DangerZone = styled(Form)`
  background: #933;
  border-radius: 2px;
  padding: 2.188rem 0;
  > div > button {
    margin-top: 0;
    background: #933;
  }
`;

class Settings extends PureComponent {
  constructor(props) {
    super(props);
    this.onRemove = this.onRemove.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.state = { tab: 'organization' };
  }

  onRemove() {
    const { history, remove } = this.props;
    remove()
      .then(() => (
        history.replace('/')
      ));
  }

  onSubmit(e) {
    const { hide, update } = this.props;
    const { target: form } = e;
    e.preventDefault();
    const name = form.name.value;
    if (!name) {
      return;
    }
    update({ name })
      .then(() => hide('Org.Settings'));
  }

  render() {
    const { name } = this.props;
    const { tab } = this.state;
    return (
      <Dialog
        id="Org.Settings"
      >
        <Tabs>
          <div
            className={tab === 'organization' ? 'active' : ''}
            onClick={() => this.setState({ tab: 'organization' })}
          >
            <Translate value="Org.Settings.organization" />
          </div>
          <div
            className={tab === 'dangerzone' ? 'active' : ''}
            onClick={() => this.setState({ tab: 'dangerzone' })}
          >
            <Translate value="Org.Settings.dangerZone" />
          </div>
        </Tabs>
        {tab === 'organization' ? (
          <Form onSubmit={this.onSubmit}>
            <div>
              <label>
                <Translate value="Org.Settings.name" />
              </label>
              <input
                defaultValue={name}
                type="text"
                name="name"
                required
                autoFocus
              />
            </div>
            <div className="submit">
              <Button
                type="submit"
              >
                <TiTick />
                <Translate value="Org.Settings.save" />
              </Button>
            </div>
          </Form>
        ) : null}
        {tab === 'dangerzone' ? (
          <DangerZone>
            <div className="submit">
              <Button
                type="button"
                onClick={this.onRemove}
              >
                <TiTimes />
                <Translate value="Org.Settings.remove" />
              </Button>
            </div>
          </DangerZone>
        ) : null}
      </Dialog>
    );
  }
}

Settings.propTypes = {
  /* eslint-disable react/forbid-prop-types */
  history: PropTypes.object.isRequired,
  /* eslint-enable react/forbid-prop-types */
  name: PropTypes.string.isRequired,
  hide: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
  update: PropTypes.func.isRequired,
};

export default withRouter(connect(
  ({ org: { name } }) => ({ name }),
  {
    hide,
    remove,
    update,
  }
)(Settings));
