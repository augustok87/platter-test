import { html } from 'preact_signals_standalone';
import { progressPercent, rewards } from 'bb_cart_state';

export function ProgressBar() {
  const progressBarMarkerHTML = () => {
    return rewards.map((reward, index) => {
      const levelNum = index + 1
      const rewardText = reward.variantId ? '' : reward.name
      return html`
        <div class="bb-progress-reward" data-level="${levelNum}" data-achieved="${reward.achieved.value}" aria-label="${reward.name}" title="${reward.name}">
          <div class="bb-progress-reward-text">${rewardText}</div>
          <div class="level-threshold">$${reward.minimumOrderAmount}</div>
        </div>
      `
    })
  }

  return html`
    <div class="bb-progress-bar-container">
      <div class="bb-progress-bar">
        <span class="progress-bar-fill" style="width: ${progressPercent}%;"></span>
      </div>
      <div class="bb-progress-rewards-container">
        ${progressBarMarkerHTML()}
      </div>
    </div>  
  `
}
