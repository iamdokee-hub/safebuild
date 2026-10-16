(function (root, factory) {
  const calculator = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = calculator;
  } else {
    root.F1Calculator = calculator;
  }
})(globalThis, function () {
  "use strict";

  function calculateEstimate(contractAmount, basisRatioPercent, ratePercent) {
    if (!Number.isSafeInteger(contractAmount) || contractAmount <= 0) {
      throw new RangeError("계약금액은 0보다 큰 원 단위 정수여야 합니다.");
    }
    if (!Number.isFinite(basisRatioPercent) || basisRatioPercent <= 0 || basisRatioPercent > 100) {
      throw new RangeError("대상액 비중은 0 초과 100 이하로 입력해야 합니다.");
    }
    if (!Number.isFinite(ratePercent) || ratePercent <= 0 || ratePercent > 20) {
      throw new RangeError("예시 요율은 0 초과 20 이하로 입력해야 합니다.");
    }

    const targetAmount = Math.floor(contractAmount * basisRatioPercent / 100);
    const estimate = Math.floor(targetAmount * ratePercent / 100);
    return { targetAmount, estimate };
  }

  function formatWon(amount) {
    return `${new Intl.NumberFormat("ko-KR").format(amount)}원`;
  }

  function readKoreanAmount(amount) {
    if (!Number.isSafeInteger(amount) || amount <= 0) {
      return "";
    }
    const units = ["", "만", "억", "조"];
    const chunks = [];
    let remaining = amount;
    let unitIndex = 0;
    while (remaining > 0 && unitIndex < units.length) {
      const chunk = remaining % 10000;
      if (chunk > 0) {
        chunks.unshift(`${new Intl.NumberFormat("ko-KR").format(chunk)}${units[unitIndex]}`);
      }
      remaining = Math.floor(remaining / 10000);
      unitIndex += 1;
    }
    return `${chunks.join(" ")} 원`;
  }

  return { calculateEstimate, formatWon, readKoreanAmount };
});
