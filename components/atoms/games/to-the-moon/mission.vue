<template>
  <div class="mission">
    <div class="mission_header">
      <img src="/games/to-the-moon/arrow.svg" alt="left_arrow">
      <p>Mission Status</p>
      <img src="/games/to-the-moon/arrow.svg" alt="right_arrow">
    </div>
    <table>
      <thead>
        <tr>
          <th>Round</th>
          <th>Player</th>
          <th>Jackpot</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>#0001</td>
          <td>0xbe....fas21</td>
          <td>
            <div>
              50.000.00
              <img src="/games/to-the-moon/usdt.svg" alt="token">
            </div>
          </td>
          <td>
            <button class="btn">
              Claim
            </button>
          </td>
        </tr>
        <tr>
          <td>#0001</td>
          <td>0xsa....2a32</td>
          <td>
            <div>
              25.000.00
              <img src="/games/to-the-moon/btc.svg" alt="token">
            </div>
          </td>
          <td>
            <button disabled class="btn">
              Claim
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.mission {
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  background: #201a29;
  padding: 8px 12px;
  backdrop-filter: blur(20px);
  color: #e6e6e6;

  &_header {
    display: flex;
    justify-content: space-between;
    font-weight: 700;
    img:last-child {
      transform: scaleX(-1);
      cursor: pointer;
    }
  }
  table {
    border-collapse: separate;
    border-spacing: 0 5px;
  }
  th {
    font-weight: 700;
    font-size: 12px;
  }

  tbody > tr > td {
    font-size: 12px;
    background: #2c2634;
    padding: 4px;
    & > div {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    &:first-child {
      border-top-left-radius: 8px;
      border-bottom-left-radius: 8px;
    }
    &:last-child {
      border-top-right-radius: 8px;
      border-bottom-right-radius: 8px;
    }
  }

  .btn {
    color: #f5f5f7;
    font-weight: 700;
    background-color: #9e68ff;
    padding: 4px 16px;
    border-radius: 6px;
    &:hover:not(:disabled) {
      background-color: #60f !important;
      box-shadow: 0px 0px 14px 0px #60f;
    }
    &:active:not(:disabled) {
      color: #ffdc7e;
    }
    &:disabled {
      background-color: #424245 !important;
      color: #6f6c75;
    }
  }
}
</style>
