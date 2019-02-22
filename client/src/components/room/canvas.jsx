import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import { connect } from 'react-redux';
import Touches from 'touches';
import { addWheelListener, removeWheelListener } from 'wheel';

class Canvas extends Component {
  constructor(props) {
    super(props);
    this.dom = React.createRef();
    this.onDrop = this.onDrop.bind(this);
    this.onPointerStart = this.onPointerStart.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerEnd = this.onPointerEnd.bind(this);
    this.onPointerWheel = this.onPointerWheel.bind(this);
    this.onResize = this.onResize.bind(this);
    this.origin = { x: 0, y: 0 };
    this.photos = {};
    this.scale = 1;
  }

  componentDidMount() {
    const { dom: { current: canvas } } = this;
    this.loadPhotos(this.props);
    canvas.addEventListener('dragover', Canvas.onDragOver, false);
    canvas.addEventListener('drop', this.onDrop, false);
    window.addEventListener('resize', this.onResize, false);
    this.onResize();
    this.touches = Touches(window, {
      filtered: true,
      preventSimulated: false,
    })
      .on('start', this.onPointerStart)
      .on('move', this.onPointerMove)
      .on('end', this.onPointerEnd);
    addWheelListener(window, this.onPointerWheel);
  }

  componentWillReceiveProps(props) {
    this.loadPhotos(props);
    this.draw(props);
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillUnmount() {
    const { dom: { current: canvas } } = this;
    canvas.removeEventListener('dragover', Canvas.onDragOver);
    canvas.removeEventListener('drop', this.onDrop);
    window.removeEventListener('resize', this.onResize);
    this.touches.disable();
    removeWheelListener(window, this.onPointerWheel);
  }

  static onDragOver(e) {
    e.preventDefault();
  }

  onDrop(e) {
    const { socket } = this.props;
    const {
      clientX,
      clientY,
      dataTransfer: { files: [file] },
    } = e;
    e.preventDefault();
    if (!file) {
      return;
    }
    const origin = this.getPointer([clientX, clientY]);
    const reader = new FileReader();
    reader.onload = () => {
      socket.send(JSON.stringify({
        type: 'ROOM/ADD_PHOTO',
        payload: {
          origin,
          photo: reader.result.substr(reader.result.indexOf('base64') + 7),
        },
      }));
    };
    reader.readAsDataURL(file);
  }

  onPointerStart(e, pointer) {
    const { meta: { photos }, socket } = this.props;
    const button = e.button || 0;
    const { x, y } = this.getPointer(pointer);
    // Get photo at pointer
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
    // Reverse the filtered photos to get
    // the one renderded on top first
    intersects.reverse();
    const photo = intersects[0];
    // Pointer is on top of a photo
    if (photo) {
      switch (button) {
        // Left click moves the photo
        case 0:
          this.dragging = {
            offset: {
              x: photo.origin.x - x,
              y: photo.origin.y - y,
            },
            photo,
          };
          break;
        // Right click removes the photo
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
    } else if (button === 2) {
      // Right click anywhere else moves the canvas origin
      this.dragging = {
        canvas: pointer,
      };
    }
  }

  onPointerMove(e, pointer) {
    const { dragging, origin, scale } = this;
    if (!dragging) {
      return;
    }
    if (dragging.canvas) {
      origin.x += (pointer[0] - dragging.canvas[0]) / scale;
      origin.y += (pointer[1] - dragging.canvas[1]) / scale;
      dragging.canvas = pointer;
    }
    if (dragging.photo) {
      const { offset, photo } = dragging;
      const { x, y } = this.getPointer(pointer);
      photo.origin.x = x + offset.x;
      photo.origin.y = y + offset.y;
    }
    this.draw();
  }

  onPointerEnd() {
    const { dragging } = this;
    const { socket } = this.props;
    if (!dragging) {
      return;
    }
    delete this.dragging;
    if (dragging.photo) {
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

  onPointerWheel({ deltaY }) {
    const normalized = 1 + (Math.min(Math.max(-deltaY, -1), 1) * 0.1);
    this.scale *= normalized;
    this.scale = Math.min(Math.max(this.scale, 0.25), 2);
    this.draw();
  }

  onResize() {
    const { dom: { current: canvas } } = this;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    this.draw();
  }

  getPointer([x, y]) {
    const { dom: { current: canvas }, origin, scale } = this;
    return {
      x: ((x - (canvas.width * 0.5)) / scale) - origin.x,
      y: ((y - (canvas.height * 0.5)) / scale) - origin.y,
    };
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

  draw(props) {
    const { dom: { current: canvas }, origin, scale } = this;
    const { meta: { name, photos } } = props || this.props;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.width;
    ctx.translate(canvas.width * 0.5, canvas.height * 0.5);
    ctx.scale(scale, scale);
    ctx.translate(origin.x, origin.y);
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
