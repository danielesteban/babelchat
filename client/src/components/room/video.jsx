import PropTypes from 'prop-types';
import React, { Component } from 'react';

class Video extends Component {
  constructor(props) {
    super(props);
    this.dom = React.createRef();
  }

  componentDidMount() {
    const { dom } = this;
    const { video } = this.props;
    dom.current.appendChild(video);
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    const { dom } = this;
    return (
      <div ref={dom} />
    );
  }
}

Video.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  video: PropTypes.object.isRequired,
};

export default Video;
