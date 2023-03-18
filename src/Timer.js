function clamp(num, min, max) {
	return Math.min(Math.max(num, min), max)
}

export default class {
	constructor() {
		this.id = 0;
		this.rate = Infinity;
		this.skip = Infinity;
	}

	start(duration) {
		if (this.id === 0) {
			this.skip = 3
			this.rate = clamp(Math.ceil(duration), 3, 90)
		}
		this.id = setInterval(this.decrease.bind(this), 1000)
	}

	stop() {
		clearInterval(this.id)
	}

	decrease() {
		if (this.rate > 0) {
			this.rate -= 1
		}
		if (this.skip > 0) {
			this.skip -= 1
		}
	}
}

// export class Timer {
// 	constructor() {
// 		this._id = 0;
// 		this.counter = Infinity;
// 	}

// 	start(duration) {
// 		if (this._id === 0) {
// 			this.counter = Math.ceil(duration);
// 		}
// 		this._id = setInterval(this.tick.bind(this), 1000);
// 	}

// 	stop() {
// 		clearInterval(this._id)
// 	}

// 	tick() {
// 		if (this.counter > 0) {
// 			this.counter--
// 		} else {
// 			this.stop();
// 		}
// 	}
// }