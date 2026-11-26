import { LitElement, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { telemetryStore } from '../../state/store';

@customElement('home-page')
export class HomePage extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .stub-card {
      padding: 16px;
      border-radius: var(--tm-radius-md, 16px);
      background: var(--md-sys-color-surface-container-low);
      color: var(--md-sys-color-on-surface);
    }

    .stub-title {
      margin: 0 0 6px;
      font-size: 16px;
      font-weight: 600;
    }

    .stub-meta {
      margin: 0;
      font-size: 13px;
      color: var(--md-sys-color-on-surface-variant);
    }
  `;

  @state() private sessionTitle =
    telemetryStore.data?.selected_session?.title ?? '等待遥测数据...';

  private unsubscribe?: () => void;

  connectedCallback(): void {
    super.connectedCallback();
    this.unsubscribe = telemetryStore.subscribe(() => {
      this.sessionTitle =
        telemetryStore.data?.selected_session?.title ?? '暂无会话数据';
    });
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.unsubscribe?.();
  }

  render() {
    return html`
      <md-outlined-card class="stub-card">
        <h2 class="stub-title">主页</h2>
        <p class="stub-meta">${this.sessionTitle}</p>
      </md-outlined-card>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'home-page': HomePage;
  }
}
