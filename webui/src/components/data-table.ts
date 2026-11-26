import { css } from 'lit';

/* M3-WEB-PLACEHOLDER: Data Table (not provided by @material/web@2.5.0) */

export const tableStyles = css`
  .tm-table-wrap {
    width: 100%;
    overflow-x: auto;
    border-radius: var(--tm-radius-sm, 12px);
    border: 1px solid var(--md-sys-color-outline-variant);
    background: var(--md-sys-color-surface-container-low);
    container-type: inline-size;
  }

  table.tm-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
    color: var(--md-sys-color-on-surface);
  }

  table.tm-table thead th {
    text-align: left;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.03em;
    color: var(--md-sys-color-on-surface-variant);
    background: var(--md-sys-color-surface-container);
    padding: 10px 12px;
    border-bottom: 1px solid var(--md-sys-color-outline-variant);
    white-space: nowrap;
  }

  table.tm-table tbody tr {
    position: relative;
    border-bottom: 1px solid var(--md-sys-color-outline-variant);
    transition: background-color 0.15s ease;
  }

  table.tm-table tbody tr:last-child {
    border-bottom: none;
  }

  table.tm-table tbody tr.clickable {
    cursor: pointer;
  }

  table.tm-table tbody tr.clickable:hover {
    background: var(--md-sys-color-surface-container-high);
  }

  table.tm-table tbody th,
  table.tm-table tbody td {
    padding: 10px 12px;
    vertical-align: middle;
    text-align: left;
    font-variant-numeric: tabular-nums;
  }

  table.tm-table tbody th {
    font-weight: 600;
    color: var(--md-sys-color-on-surface);
  }

  @container (width < 560px) {
    table.tm-table thead {
      display: none;
    }

    table.tm-table,
    table.tm-table tbody,
    table.tm-table tr,
    table.tm-table th,
    table.tm-table td {
      display: block;
      width: 100%;
    }

    table.tm-table tbody tr {
      padding: 10px 12px;
      background: var(--md-sys-color-surface-container-low);
    }

    table.tm-table tbody th {
      padding: 0 0 6px 0;
      border-bottom: 1px solid var(--md-sys-color-outline-variant);
      margin-bottom: 6px;
    }

    table.tm-table tbody td {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      padding: 4px 0;
    }

    table.tm-table tbody td::before {
      content: attr(data-label);
      font-size: 11px;
      font-weight: 600;
      color: var(--md-sys-color-on-surface-variant);
      flex-shrink: 0;
    }
  }
`;
