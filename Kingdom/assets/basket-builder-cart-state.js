import { signal, batch, computed } from 'preact_signals_standalone';
import { monetize} from 'foundry_utility_helpers';

const BB_CONFIG_REWARDS = window.FOUNDRY_DATA.basket_builder_rewards
const MAXIMUM_REWARD_THRESHOLD_AMOUNT = Math.max(...BB_CONFIG_REWARDS.map((r) => monetize(r.threshold_price.amount)))

let cartData = {}
const redeemedVariantIds = signal([])
const rewardTotal = signal(0)
const cartItemIds = signal([]);
const cartTotal = signal(0);
const undiscountedTotal = computed(() => {
  return cartTotal.value - rewardTotal.value
})

/*
Return 0.00 if currentAmount >= goalAmount. Otherwise return the difference.
@return [String] a money-formatted number. (i.e. 2.digits)
Will return a whole number (as String) if the cents are 0.
*/
const distanceOfAmounts = (goalAmount, currentAmount) => {
  const num = Math.max((goalAmount - currentAmount), 0)
  return monetize(num)
}

const extractVariantId = (variantUrl) => {
  if(!variantUrl) return

  return parseInt(variantUrl.match(/\d+$/)?.[0])
}


/*
Convert the rewards specified in the metaobject basket builder config into objects
that contain signals and reactivity. This is the heart of the entire basket builder.
Each reward will know its own state, triggered every time the signals are updated.
Signals can be found in `setSignalsFromCart` function.

The rewards are also sorted by `minimumOrderAmount` in ascending order so as to
ensure the progress meter will always be correct, regardless of how the admin
configured the rewards.
*/
const rewards = BB_CONFIG_REWARDS.map((r) => {
  const minimumOrderAmount = monetize(r.threshold_price.amount)
  const variantUrl = r.variant
  const variantId = extractVariantId(variantUrl)
  const name = r.name
  return {
    name,
    variantUrl,
    variantId,
    variantRedeemed: computed(() => {
      if(!variantUrl) return false

      const found = redeemedVariantIds.value.includes(variantId)
      return found
    }),
    minimumOrderAmount,
    maxRewardPercentage: (minimumOrderAmount / MAXIMUM_REWARD_THRESHOLD_AMOUNT) * 100,
    achieved: computed(() => distanceOfAmounts(minimumOrderAmount, undiscountedTotal.value) <= 0),
    achievedMessage: r.message_once_achieved || `You have earned ${r.name}`,
    progressMessage: computed(() => {
      return `You are $${distanceOfAmounts(minimumOrderAmount, undiscountedTotal.value)} away from ${r.name}`;
    }),
    markerText: name
  }
}).sort((r1, r2) => r1.minimumOrderAmount - r2.minimumOrderAmount)

const nextReward = computed(() => {
  return rewards.find((reward) => !reward.achieved.value)
});


/*
 Return a computed value of variantIds that have not been redeemed yet.
 Must meet all of the following criteria:
 1. Has a variant.
 2. Variant NOT in cart (yet).
 3. Cart total threshold has been achieved.
 @return {Array[Object]} Item objects with quantity 1 and properties {_isReward: true}
*/
const redeemableItems = computed(() => {
  return rewards.map((reward) => {
    if (reward.variantId && reward.achieved.value && !reward.variantRedeemed.value) {
      return {id: reward.variantId, quantity: 1, properties: {_isReward: true}}
    }
  }).filter(Boolean)
})

const revokableItems = computed(() => {
  const updates = {}
  rewards.forEach((reward) => {
    if (reward.variantId && !reward.achieved.value && reward.variantRedeemed.value) {
      updates[reward.variantId] = 0
    }
  })
  return updates
})


const progressPercent = computed(() => {
  if (!MAXIMUM_REWARD_THRESHOLD_AMOUNT) return 0;

  const calculatedProgress =
    (cartTotal.value / MAXIMUM_REWARD_THRESHOLD_AMOUNT) * 100;
  return Math.min(calculatedProgress, 100);
});

const extractDataForSignals = (cart) => {
  const data = {
    cartTotal: cart.total_price / 100,
    redeemedVariantIds: [],
    rewardTotal: 0,
    cartItemIds: []
  }
  cart.items.forEach((item) => {
    data.cartItemIds.push(item.variant_id)
    if (item.properties._isReward) {
      data.redeemedVariantIds.push(item.variant_id)
      data.rewardTotal += item.line_price / 100
    }
  })
  return data
}

/*
 Set the signals from the cart. Also update the cartData global variable here
 so that we can see the total state of the cart at the time the signals were
 updated.
*/
const setSignalsFromCart = (cart) => {
  cartData = cart // Re-assign the cartData var to whatever cart is.
  const data = extractDataForSignals(cart)
  batch(() => {
    redeemedVariantIds.value = data.redeemedVariantIds
    rewardTotal.value = data.rewardTotal
    cartItemIds.value = data.cartItemIds
    cartTotal.value = data.cartTotal
  });
};

export {
  rewards,
  cartData,
  cartItemIds,
  cartTotal,
  nextReward,
  progressPercent,
  setSignalsFromCart,
  redeemableItems,
  revokableItems
};
