import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

class Canvas extends Component {
  constructor(props) {
    super(props);
    this.dom = React.createRef();
    this.onResize = this.onResize.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize, false);
    this.onResize();
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  onResize() {
    const { dom: { current: canvas } } = this;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    this.draw();
  }

  draw() {
    const { dom: { current: canvas } } = this;
    const { meta: { name } } = this.props;
    const ctx = canvas.getContext('2d');
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#999';
    ctx.font = '32px Arial';
    ctx.fillText(`Welcome to: "${name}"`, canvas.width * 0.5, canvas.height * 0.45);
    ctx.fillText('This will be a P2P board with photos/drawings/etc...', canvas.width * 0.5, canvas.height * 0.5);
  }

  render() {
    const { dom } = this;
    return (
      <canvas ref={dom} />
    );
  }
}

Canvas.propTypes = {
  meta: PropTypes.shape({
    name: PropTypes.string,
  }).isRequired,
};

export default connect(
  ({ room: { meta } }) => ({ meta })
)(Canvas);
