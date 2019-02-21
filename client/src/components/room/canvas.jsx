import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import { connect } from 'react-redux';
import Touches from 'touches';

class Canvas extends Component {
  constructor(props) {
    super(props);
    this.dom = React.createRef();
    this.onPointerStart = this.onPointerStart.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerEnd = this.onPointerEnd.bind(this);
    this.onResize = this.onResize.bind(this);
    this.photos = {};
  }

  componentDidMount() {
    this.loadPhotos(this.props);
    window.addEventListener('resize', this.onResize, false);
    this.onResize();
    this.touches = Touches(window, {
      filtered: true,
      preventSimulated: false,
    })
      .on('start', this.onPointerStart)
      .on('move', this.onPointerMove)
      .on('end', this.onPointerEnd);
  }

  componentWillReceiveProps(props) {
    this.loadPhotos(props);
    this.draw(props);
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
    this.touches.disable();
  }

  onPointerStart(e, [x, y]) {
    const { dom: { current: canvas } } = this;
    const { meta: { photos }, socket } = this.props;
    const button = e.button || 0;
    x -= canvas.width * 0.5;
    y -= canvas.height * 0.5;
    const intersects = photos
      .filter(({ _id, origin }) => {
        const image = this.photos[_id];
        if (!image) {
          return false;
        }
        const { width, height } = image;
        if (
          x < origin.x
          || x > origin.x + width
          || y < origin.y
          || y > origin.y + height
        ) {
          return false;
        }
        return true;
      });
    intersects.reverse();
    const photo = intersects[0];
    if (photo) {
      switch (button) {
        case 0:
          this.dragging = {
            offset: {
              x: photo.origin.x - x,
              y: photo.origin.y - y,
            },
            photo,
          };
          break;
        case 2:
          socket.send(JSON.stringify({
            type: 'ROOM/REMOVE_PHOTO',
            payload: {
              photo: photo._id,
            },
          }));
          break;
        default:
          break;
      }
    }
  }

  onPointerMove(e, [x, y]) {
    const { dom: { current: canvas }, dragging } = this;
    if (!dragging) {
      return;
    }
    x -= canvas.width * 0.5;
    y -= canvas.height * 0.5;
    const { offset, photo } = dragging;
    photo.origin.x = x + offset.x;
    photo.origin.y = y + offset.y;
    this.draw();
  }

  onPointerEnd() {
    const { dragging } = this;
    const { socket } = this.props;
    delete this.dragging;
    if (dragging) {
      const { _id: photo, origin } = dragging.photo;
      socket.send(JSON.stringify({
        type: 'ROOM/MOVE_PHOTO',
        payload: {
          origin,
          photo,
        },
      }));
    }
  }

  onResize() {
    const { dom: { current: canvas } } = this;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    this.draw();
  }

  draw(props) {
    const { dom: { current: canvas } } = this;
    const { meta: { name, photos } } = props || this.props;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.width;
    ctx.translate(canvas.width * 0.5, canvas.height * 0.5);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#999';
    ctx.font = '32px Arial';
    ctx.fillText(I18n.t('Room.welcome', { name }), 0, 0);
    photos.forEach(({ _id, origin }) => {
      if (this.photos[_id]) {
        ctx.drawImage(this.photos[_id], origin.x, origin.y);
      }
    });
  }

  loadPhotos({ meta: { photos } }) {
    photos.forEach(({ _id, photo }) => {
      if (!this.photos[_id]) {
        const img = new Image();
        img.src = `data:image/jpeg;base64,${photo}`;
        img.onload = () => (
          this.draw()
        );
        this.photos[_id] = img;
      }
    });
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
    name: PropTypes.string.isRequired,
    photos: PropTypes.arrayOf(PropTypes.shape({
      origin: PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
      }),
      photo: PropTypes.string.isRequired,
    })).isRequired,
  }).isRequired,
  socket: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]).isRequired,
};

export default connect(
  ({ room: { meta, socket } }) => ({ meta, socket })
)(Canvas);
