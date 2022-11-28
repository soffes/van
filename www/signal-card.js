class SignalCard extends HTMLElement {
  set hass(hass) {
    if (!this.content) {
      this.innerHTML = `
        <ha-card>
          <div class="card-content"></div>
        </ha-card>
        <style>
          .card-content {
            display: flex;
            justify-content: space-between;

            --connected-color: rgb(67, 160, 71);
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
        </style>
      `;
      this.content = this.querySelector('div');
    }

    const signal = hass.states['sensor.peplink_signal'];
    const carrier = hass.states['sensor.peplink_carrier'];
    const network = hass.states['sensor.peplink_network'];

    if (!signal || !carrier || !network) {
      this.content.innerHTML = '<div class="indicator"></div> Unknown';
      return;
    }

    this.content.innerHTML = `
      <div class="status">
        <div class="indicator indicator-connected"></div>
        <span class="carrier">${carrier.state}</span>
        <span class="network">${network.state}</span>
      </div>
      <div class="bars bars-${signal.state}">
        <div></div><div></div><div></div><div></div><div></div>
      </div>
    `;
  }

  setConfig(config) {
    this.config = config;
  }

  getCardSize() {
    return 1;
  }
}

customElements.define('signal-card', SignalCard);
