// From weather-card
const fireEvent = (node, type, detail, options) => {
  options = options || {};
  detail = detail === null || detail === undefined ? {} : detail;
  const event = new Event(type, {
    bubbles: options.bubbles === undefined ? true : options.bubbles,
    cancelable: Boolean(options.cancelable),
    composed: options.composed === undefined ? true : options.composed
  });
  event.detail = detail;
  node.dispatchEvent(event);
  return event;
};

class SignalCard extends HTMLElement {
  set hass(hass) {
    if (!this.content) {
      this.innerHTML = `
        <ha-card>
          <div class="card-content">
            <div class="status">
              <div class="indicator"></div>
              <span class="carrier"></span>
              <span class="network"></span>
            </div>
            <div class="bars">
              <div></div><div></div><div></div><div></div><div></div>
            </div>
          </div>
        </ha-card>
        <style>
          :host {
            --connected-color: rgb(67, 160, 71);
          }

          .card-content {
            display: flex;
            justify-content: space-between;
          }

          .indicator {
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 6px;
            background: var(--primary-background-color);
            margin-right: 6px;
          }

          .indicator.indicator-connected {
            background: var(--connected-color);
          }

          .indicator.indicator-flash {
            animation-name: flash;
            animation-duration: 1s;
            animation-iteration-count: infinite;
          }

          @keyframes flash {
            0% {
              opacity: 0;
            }
            50% {
              opactiy: 1;
            }
            100% {
              opacity: 0;
            }
          }

          .carrier {
            font-weight: 500;
          }

          .network {
            color: var(--secondary-text-color);
          }

          .bars {
            height: 16px;
            display: flex;
            align-items: end;
            gap: 2px;
          }

          .bars div {
            background: var(--primary-background-color);
            width: 6px;
          }

          .bars div:nth-child(1) {
            height: 20%;
          }

          .bars div:nth-child(2) {
            height: 40%;
          }

          .bars div:nth-child(3) {
            height: 60%;
          }

          .bars div:nth-child(4) {
            height: 80%;
          }

          .bars div:nth-child(5) {
            height: 100%;
          }

          .bars.bars-1 div:nth-child(1),
          .bars.bars-2 div:nth-child(1), .bars.bars-2 div:nth-child(2),
          .bars.bars-3 div:nth-child(1), .bars.bars-3 div:nth-child(2), .bars.bars-3 div:nth-child(3),
          .bars.bars-4 div:nth-child(1), .bars.bars-4 div:nth-child(2), .bars.bars-4 div:nth-child(3), .bars.bars-4 div:nth-child(4),
          .bars.bars-5 div:nth-child(1), .bars.bars-5 div:nth-child(2), .bars.bars-5 div:nth-child(3), .bars.bars-5 div:nth-child(4), .bars.bars-5 div:nth-child(5)
          {
            background-color: rgb(3, 155, 229);
          }

          .carrier, .network, .bars {
            cursor: pointer;
          }
        </style>
      `;
      this.content = this.querySelector('div');
    }

    const state = JSON.parse(hass.states['sensor.peplink_cellular'].state);

    const status = state['status'];
    const message = state['message'];
    const carrier = state['carrier'];
    const network = state['network'];
    const signal = state['signal'];

    if (!signal || !carrier || !network) {
      this.content.innerHTML = `
        <div class="status">
          <div class="indicator"></div>
          <span class="carrier">No connection</span>
          <span class="network"></span>
        </div>
        <div class="bars">
          <div></div><div></div><div></div><div></div><div></div>
        </div>
      `;
    } else {
      this.content.innerHTML = `
        <div class="status">
          <div class="indicator indicator-connected indicator-${status}"></div>
          <span class="carrier">${carrier}</span>
          <span class="network">${network}</span>
        </div>
        <div class="bars bars-${signal}">
          <div></div><div></div><div></div><div></div><div></div>
        </div>
      `;
    }

    const card = this.querySelector('ha-card').addEventListener('click', event => {
      fireEvent(this, 'hass-more-info', { entityId: 'sensor.peplink_cellular' });
    });
  }

  setConfig(config) {
    this.config = config;
  }

  getCardSize() {
    return 1;
  }
}

customElements.define('signal-card', SignalCard);
