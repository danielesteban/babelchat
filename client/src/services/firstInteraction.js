
import Touches from 'touches';

class FirstInteraction {
  constructor() {
    this.promises = [];
    this.getPromise = this.getPromise.bind(this);
    this.onKey = this.onKey.bind(this);
    this.onPointer = this.onPointer.bind(this);
    this.touches = Touches(window, {
      filtered: true,
      preventSimulated: false,
    }).on('start', this.onPointer).on('end', this.onPointer);
    window.addEventListener('keydown', this.onKey, false);
    window.addEventListener('keyup', this.onKey, false);
  }

  getPromise() {
    const { isReady, promises } = this;
    return new Promise((resolve) => {
      if (isReady) {
        resolve();
        return;
      }
      promises.push(resolve);
    });
  }

  onFirstInteraction() {
    const { promises, touches } = this;
    touches.disable();
    window.removeEventListener('keydown', this.onKey);
    window.removeEventListener('keyup', this.onKey);
    this.isReady = true;
    promises.forEach(resolve => resolve());
  }

  onKey() {
    this.onFirstInteraction();
  }

  onPointer() {
    this.onFirstInteraction();
  }
}

export default (new FirstInteraction()).getPromise;
