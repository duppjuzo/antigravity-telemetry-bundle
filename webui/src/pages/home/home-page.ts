import { LitElement, css, html, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { chartStyles } from '../../components/charts';
import { telemetryStore } from '../../state/store';
import type {
  GlobalTrendsCardMode,
  HomeCardId,
  HomeScope,
  HourlyEntry,
  StatsResponse,
} from '../../types/telemetry';
import { renderMdIcon } from '../../utils/format';
import {
  HOME_CARD_REGISTRY,
  getHomeCard,
  getScopeUnavailableMessage,
  homeCardStyles,
  isCardSupportedInScope,
  type HomeCardContext,
  type HomeCardDefinition,
} from './cards';

const SCOPE_LABELS: Record<HomeScope, string> = {
  latest_step: '最新一步',
  session: '当前会话',
  global: '全局',
};

@customElement('home-page')
export class HomePage extends LitElement {
  static styles = [
    chartStyles,
    homeCardStyles,
    css`
      :host {
        display: block;
      }

      .home-root {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding-bottom: 96px;
      }

      .cards-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 14px;
        align-items: stretch;
      }

      .card-wrapper {
        position: relative;
        min-width: 0;
        border-radius: var(--tm-radius-md, 16px);
        transition: transform 0.16s ease, opacity 0.16s ease;
      }

      .card-wrapper.dragging {
        opacity: 0.55;
      }

      .card-wrapper.drag-over {
        outline: 2px dashed var(--md-sys-color-primary);
        outline-offset: 2px;
      }

      .home-card {
        display: block;
        width: 100%;
        height: 100%;
        --md-elevated-card-container-shape: var(--tm-radius-md, 16px);
        --md-elevated-card-container-color: var(
          --md-sys-color-surface-container
        );
        transition: transform 0.15s ease;
      }

      .card-surface {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 12px;
        height: 100%;
        padding: 16px;
        border-radius: var(--tm-radius-md, 16px);
        overflow: hidden;
        outline: none;
      }

      .card-surface.clickable {
        cursor: pointer;
      }

      .card-surface.clickable:hover {
        background: var(--md-sys-color-surface-container-high);
      }

      .card-surface.edit-draggable {
        cursor: grab;
      }

      .card-surface.edit-draggable:active {
        cursor: grabbing;
      }

      .card-header {
        position: relative;
        z-index: 2;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        min-height: 32px;
      }

      .card-title-group {
        display: flex;
        align-items: center;
        gap: 8px;
        min-width: 0;
      }

      .drag-handle {
        display: inline-flex;
        align-items: center;
        color: var(--md-sys-color-on-surface-variant);
        flex-shrink: 0;
      }

      .card-title {
        margin: 0;
        font-size: 15px;
        font-weight: 600;
        line-height: 1.3;
        color: var(--md-sys-color-on-surface);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .scope-tag {
        display: inline-flex;
        align-items: center;
        padding: 2px 7px;
        border-radius: var(--tm-radius-full, 9999px);
        font-size: 10px;
        font-weight: 600;
        background: var(--md-sys-color-surface-container-highest);
        color: var(--md-sys-color-on-surface-variant);
        flex-shrink: 0;
      }

      .card-header-right {
        display: inline-flex;
        align-items: center;
        gap: 2px;
        flex-shrink: 0;
      }

      .edit-controls {
        display: inline-flex;
        align-items: center;
      }

      .card-body {
        position: relative;
        z-index: 1;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      .card-body.dimmed {
        opacity: 0.38;
        pointer-events: none;
        user-select: none;
      }

      .unavailable-overlay {
        position: absolute;
        inset: 0;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 48px 16px 16px;
        background: var(--tm-scrim-disabled);
        pointer-events: none;
        text-align: center;
      }

      .unavailable-text {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 12px;
        border-radius: var(--tm-radius-sm, 12px);
        background: var(--md-sys-color-error-container);
        color: var(--md-sys-color-error);
        font-size: 12px;
        font-weight: 600;
        line-height: 1.4;
      }

      .empty-home-card {
        padding: 24px 20px;
        border-radius: var(--tm-radius-md, 16px);
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
      }

      .empty-home-title {
        margin: 0;
        font-size: 15px;
        font-weight: 600;
        color: var(--md-sys-color-on-surface);
      }

      .empty-home-desc {
        margin: 0;
        font-size: 13px;
        color: var(--md-sys-color-on-surface-variant);
      }

      .edit-action-bar {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        flex-wrap: wrap;
        gap: 10px;
        padding: 12px 16px;
        border-radius: var(--tm-radius-md, 16px);
        background: var(--md-sys-color-surface-container-low);
        border: 1px solid var(--md-sys-color-outline-variant);
      }

      .fab-container {
        position: fixed;
        right: 20px;
        bottom: 20px;
        z-index: 25;
      }

      .dialog-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        min-width: 260px;
        max-width: 420px;
      }

      .dialog-card-item {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        width: 100%;
        padding: 12px;
        border-radius: var(--tm-radius-sm, 12px);
        border: 1px solid var(--md-sys-color-outline-variant);
        background: var(--md-sys-color-surface-container-low);
        color: var(--md-sys-color-on-surface);
        text-align: left;
        font: inherit;
        cursor: pointer;
        overflow: hidden;
      }

      .dialog-card-item:hover:not(:disabled) {
        background: var(--md-sys-color-surface-container);
      }

      .dialog-card-item:disabled {
        opacity: 0.55;
        cursor: not-allowed;
      }

      .dialog-card-left {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        min-width: 0;
        flex: 1;
      }

      .dialog-card-icon {
        color: var(--md-sys-color-primary);
        flex-shrink: 0;
        margin-top: 2px;
      }

      .dialog-card-text {
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 0;
      }

      .dialog-card-title {
        font-size: 14px;
        font-weight: 600;
        color: var(--md-sys-color-on-surface);
      }

      .dialog-card-desc {
        font-size: 12px;
        color: var(--md-sys-color-on-surface-variant);
      }

      .dialog-card-warn {
        font-size: 11px;
        color: var(--md-sys-color-error);
        margin-top: 2px;
      }

      .dialog-added-pill {
        flex-shrink: 0;
        padding: 3px 8px;
        border-radius: var(--tm-radius-full, 9999px);
        font-size: 11px;
        font-weight: 600;
        background: var(--md-sys-color-surface-container-highest);
        color: var(--md-sys-color-on-surface-variant);
      }

      @container (width < 400px) {
        .cards-grid {
          grid-template-columns: 1fr;
          gap: 12px;
        }

        .card-surface {
          padding: 14px;
        }
      }
    `,
  ];

  @state() private homeCards: HomeCardId[] = [...telemetryStore.settings.homeCards];
  @state() private homeScope: HomeScope = telemetryStore.settings.homeScope;
  @state() private editMode = telemetryStore.editMode;
  @state() private liveEnabled = telemetryStore.settings.liveEnabled;
  @state() private isFetching = telemetryStore.isFetching;
  @state() private data: StatsResponse | null = telemetryStore.data;
  @state() private todayHourly: HourlyEntry[] = telemetryStore.todayHourly;
  @state() private globalTrendsMode: GlobalTrendsCardMode =
    telemetryStore.settings.globalTrendsCardMode;

  @state() private fabMenuOpen = false;
  @state() private addDialogOpen = false;
  @state() private dragFromId: HomeCardId | null = null;
  @state() private dragOverId: HomeCardId | null = null;

  private lastMenuClosedAt = 0;
  private unsubscribe?: () => void;

  connectedCallback(): void {
    super.connectedCallback();
    this.syncFromStore();
    this.unsubscribe = telemetryStore.subscribe(() => this.syncFromStore());
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.unsubscribe?.();
  }

  private syncFromStore(): void {
    this.homeCards = [...telemetryStore.settings.homeCards];
    this.homeScope = telemetryStore.settings.homeScope;
    this.editMode = telemetryStore.editMode;
    this.liveEnabled = telemetryStore.settings.liveEnabled;
    this.isFetching = telemetryStore.isFetching;
    this.data = telemetryStore.data;
    this.todayHourly = telemetryStore.todayHourly;
    this.globalTrendsMode = telemetryStore.settings.globalTrendsCardMode;
  }

  private buildCardContext(): HomeCardContext {
    return {
      store: telemetryStore,
      data: this.data,
      scope: this.homeScope,
      todayHourly: this.todayHourly,
      globalTrendsMode: this.globalTrendsMode,
      editMode: this.editMode,
    };
  }

  private handleCardClick(card: HomeCardDefinition, supported: boolean): void {
    if (this.editMode || !supported) return;
    if (card.targetPage) {
      telemetryStore.navigate(card.targetPage);
    }
  }

  private handleCardKeyDown(
    e: KeyboardEvent,
    card: HomeCardDefinition,
    supported: boolean
  ): void {
    if (this.editMode || !supported) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.handleCardClick(card, supported);
    }
  }

  private handleDragStart(e: DragEvent, cardId: HomeCardId): void {
    if (!this.editMode) return;
    this.dragFromId = cardId;
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', cardId);
    }
  }

  private handleDragOver(e: DragEvent, cardId: HomeCardId): void {
    if (!this.editMode || !this.dragFromId || this.dragFromId === cardId) {
      return;
    }
    e.preventDefault();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move';
    }
    if (this.dragOverId !== cardId) {
      this.dragOverId = cardId;
    }
  }

  private handleDragLeave(cardId: HomeCardId): void {
    if (this.dragOverId === cardId) {
      this.dragOverId = null;
    }
  }

  private handleDrop(e: DragEvent, targetId: HomeCardId): void {
    if (!this.editMode) return;
    e.preventDefault();
    const fromId =
      this.dragFromId ||
      ((e.dataTransfer?.getData('text/plain') || '') as HomeCardId);
    this.dragFromId = null;
    this.dragOverId = null;

    if (!fromId || fromId === targetId) return;
    const fromIdx = this.homeCards.indexOf(fromId);
    const toIdx = this.homeCards.indexOf(targetId);
    if (fromIdx !== -1 && toIdx !== -1) {
      telemetryStore.moveCard(fromIdx, toIdx);
    }
  }

  private handleDragEnd(): void {
    this.dragFromId = null;
    this.dragOverId = null;
  }

  private handleFabClick(): void {
    if (!this.fabMenuOpen && performance.now() - this.lastMenuClosedAt < 200) {
      return;
    }
    this.fabMenuOpen = !this.fabMenuOpen;
  }

  private handleMenuClosing(): void {
    this.lastMenuClosedAt = performance.now();
  }

  private handleMenuClosed(): void {
    this.lastMenuClosedAt = performance.now();
    this.fabMenuOpen = false;
  }

  private handleMenuToggleLive(): void {
    this.fabMenuOpen = false;
    telemetryStore.toggleLive();
  }

  private handleMenuRefresh(): void {
    this.fabMenuOpen = false;
    void telemetryStore.refresh(true);
  }

  private handleMenuToggleEdit(): void {
    this.fabMenuOpen = false;
    telemetryStore.setEditMode(!this.editMode);
  }

  private renderCard(
    card: HomeCardDefinition,
    index: number,
    ctx: HomeCardContext
  ) {
    const supported = isCardSupportedInScope(card, this.homeScope);
    if (!supported && !this.editMode) {
      return nothing;
    }

    const totalCount = this.homeCards.length;
    const isInteractive = !this.editMode && supported;
    const isNavigable = isInteractive && Boolean(card.targetPage);
    const unavailableMsg = !supported
      ? getScopeUnavailableMessage(this.homeScope)
      : '';

    const stopBubble = (e: Event): void => {
      e.stopPropagation();
    };

    return html`
      <div
        class="card-wrapper ${this.dragFromId === card.id ? 'dragging' : ''} ${this
          .dragOverId === card.id
          ? 'drag-over'
          : ''}"
        draggable=${this.editMode ? 'true' : 'false'}
        @dragstart=${(e: DragEvent) => this.handleDragStart(e, card.id)}
        @dragover=${(e: DragEvent) => this.handleDragOver(e, card.id)}
        @dragleave=${() => this.handleDragLeave(card.id)}
        @drop=${(e: DragEvent) => this.handleDrop(e, card.id)}
        @dragend=${this.handleDragEnd}
      >
        <md-elevated-card class="home-card">
          <div
            class="card-surface ${isInteractive ? 'clickable' : ''} ${this
              .editMode
              ? 'edit-draggable'
              : ''}"
            tabindex=${isNavigable ? '0' : '-1'}
            role=${isNavigable ? 'button' : 'region'}
            aria-label=${isNavigable
              ? `${card.title}，点击查看详情`
              : card.title}
            @click=${() => this.handleCardClick(card, supported)}
            @keydown=${(e: KeyboardEvent) =>
              this.handleCardKeyDown(e, card, supported)}
          >
            <md-ripple ?disabled=${!isInteractive}></md-ripple>

            <div class="card-header">
              <div class="card-title-group">
                ${this.editMode
                  ? html`
                      <span class="drag-handle" aria-hidden="true">
                        ${renderMdIcon('drag_indicator')}
                      </span>
                    `
                  : nothing}
                <h2 class="card-title">${card.title}</h2>
                ${card.id === 'default'
                  ? html`<span class="scope-tag">${SCOPE_LABELS[this.homeScope]}</span>`
                  : nothing}
              </div>

              <div class="card-header-right">
                ${card.renderHeaderActions ? card.renderHeaderActions(ctx) : nothing}
                ${this.editMode
                  ? html`
                      <div
                        class="edit-controls"
                        @pointerdown=${stopBubble}
                        @click=${stopBubble}
                      >
                        <md-icon-button
                          aria-label="上移卡片"
                          title="上移"
                          ?disabled=${index <= 0}
                          @click=${() => telemetryStore.moveCard(index, index - 1)}
                        >
                          ${renderMdIcon('arrow_upward')}
                        </md-icon-button>
                        <md-icon-button
                          aria-label="下移卡片"
                          title="下移"
                          ?disabled=${index >= totalCount - 1}
                          @click=${() => telemetryStore.moveCard(index, index + 1)}
                        >
                          ${renderMdIcon('arrow_downward')}
                        </md-icon-button>
                        <md-icon-button
                          aria-label="移除卡片"
                          title="移除卡片"
                          @click=${() => telemetryStore.removeCard(card.id)}
                        >
                          ${renderMdIcon('delete')}
                        </md-icon-button>
                      </div>
                    `
                  : nothing}
              </div>
            </div>

            <div class="card-body ${!supported ? 'dimmed' : ''}">
              ${card.renderContent(ctx)}
            </div>

            ${!supported && this.editMode
              ? html`
                  <div class="unavailable-overlay" aria-live="polite">
                    <span class="unavailable-text">
                      ${renderMdIcon('error_outline')}
                      <span>${unavailableMsg}</span>
                    </span>
                  </div>
                `
              : nothing}
          </div>
        </md-elevated-card>
      </div>
    `;
  }

  private renderAddCardDialog() {
    const unaddedFirst = [...HOME_CARD_REGISTRY].sort((a, b) => {
      const aAdded = this.homeCards.includes(a.id) ? 1 : 0;
      const bAdded = this.homeCards.includes(b.id) ? 1 : 0;
      return aAdded - bAdded;
    });

    return html`
      <md-dialog
        .open=${this.addDialogOpen}
        @closed=${() => {
          this.addDialogOpen = false;
        }}
      >
        <div slot="headline">添加卡片</div>
        <div slot="content" class="dialog-list">
          ${unaddedFirst.map((card) => {
            const alreadyAdded = this.homeCards.includes(card.id);
            const scopeOk = isCardSupportedInScope(card, this.homeScope);
            return html`
              <button
                type="button"
                class="dialog-card-item"
                ?disabled=${alreadyAdded}
                @click=${() => {
                  telemetryStore.addCard(card.id);
                }}
              >
                <md-ripple ?disabled=${alreadyAdded}></md-ripple>
                <div class="dialog-card-left">
                  <span class="dialog-card-icon">
                    ${renderMdIcon(card.icon)}
                  </span>
                  <div class="dialog-card-text">
                    <span class="dialog-card-title">${card.title}</span>
                    <span class="dialog-card-desc">${card.description}</span>
                    ${!scopeOk
                      ? html`
                          <span class="dialog-card-warn">
                            ${getScopeUnavailableMessage(this.homeScope)}
                          </span>
                        `
                      : nothing}
                  </div>
                </div>
                ${alreadyAdded
                  ? html`<span class="dialog-added-pill">已添加</span>`
                  : renderMdIcon('add')}
              </button>
            `;
          })}
        </div>
        <md-divider></md-divider>
        <div slot="actions">
          <md-text-button
            @click=${() => {
              this.addDialogOpen = false;
            }}
          >
            关闭
          </md-text-button>
        </div>
      </md-dialog>
    `;
  }

  render() {
    const ctx = this.buildCardContext();
    const resolvedCards = this.homeCards
      .map((id, index) => ({
        card: getHomeCard(id),
        index,
      }))
      .filter(
        (entry): entry is { card: HomeCardDefinition; index: number } =>
          Boolean(entry.card)
      );

    const visibleCardsCount = this.editMode
      ? resolvedCards.length
      : resolvedCards.filter((entry) =>
          isCardSupportedInScope(entry.card, this.homeScope)
        ).length;

    return html`
      <div class="home-root">
        ${visibleCardsCount > 0
          ? html`
              <div class="cards-grid">
                ${resolvedCards.map((entry) =>
                  this.renderCard(entry.card, entry.index, ctx)
                )}
              </div>
            `
          : html`
              <md-outlined-card class="empty-home-card">
                <h2 class="empty-home-title">暂无可显示的卡片</h2>
                <p class="empty-home-desc">
                  当前处于“${SCOPE_LABELS[this.homeScope]}”模式，已添加的卡片在此模式下均不可用或列表为空。
                </p>
                <md-filled-tonal-button
                  @click=${() => telemetryStore.setEditMode(true)}
                >
                  ${renderMdIcon('edit', 'icon')}
                  编辑主页卡片
                </md-filled-tonal-button>
              </md-outlined-card>
            `}
        ${this.editMode
          ? html`
              <div class="edit-action-bar">
                <md-filled-tonal-button
                  @click=${() => {
                    this.addDialogOpen = true;
                  }}
                >
                  ${renderMdIcon('add', 'icon')}
                  添加卡片
                </md-filled-tonal-button>
                <md-filled-button
                  @click=${() => telemetryStore.setEditMode(false)}
                >
                  ${renderMdIcon('check', 'icon')}
                  完成
                </md-filled-button>
              </div>
            `
          : nothing}
      </div>

      <div class="fab-container">
        <md-fab
          id="home-fab"
          variant="primary"
          aria-label="主页快捷操作"
          @click=${this.handleFabClick}
        >
          ${renderMdIcon(this.fabMenuOpen ? 'close' : 'more_vert', 'icon')}
        </md-fab>

        <md-menu
          id="home-fab-menu"
          anchor="home-fab"
          positioning="fixed"
          anchor-corner="start-end"
          menu-corner="end-end"
          .yOffset=${-8}
          .open=${this.fabMenuOpen}
          @closing=${this.handleMenuClosing}
          @closed=${this.handleMenuClosed}
        >
          <md-menu-item @click=${this.handleMenuToggleLive}>
            ${renderMdIcon(this.liveEnabled ? 'pause' : 'play_arrow', 'start')}
            <span slot="headline">
              ${this.liveEnabled ? '暂停刷新' : '恢复刷新'}
            </span>
          </md-menu-item>
          <md-menu-item
            ?disabled=${this.isFetching}
            @click=${this.handleMenuRefresh}
          >
            ${renderMdIcon('refresh', 'start')}
            <span slot="headline">手动刷新</span>
          </md-menu-item>
          <md-menu-item @click=${this.handleMenuToggleEdit}>
            ${renderMdIcon(this.editMode ? 'check' : 'edit', 'start')}
            <span slot="headline">
              ${this.editMode ? '退出编辑' : '编辑'}
            </span>
          </md-menu-item>
        </md-menu>
      </div>

      ${this.renderAddCardDialog()}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'home-page': HomePage;
  }
}
