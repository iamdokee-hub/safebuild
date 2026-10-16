(() => {
  "use strict";

  const STORAGE_KEY = "f1-projects-v1";
  const WORK_TYPES = [
    { id: "reinforced-concrete", label: "철근콘크리트", icon: "🏗️" },
    { id: "steel-frame", label: "철골", icon: "🏢" },
    { id: "earthwork", label: "토공", icon: "🚜" },
    { id: "electrical", label: "전기", icon: "⚡" },
    { id: "mechanical", label: "기계·설비", icon: "🔧" },
    { id: "windows", label: "창호·유리", icon: "🪟" }
  ];

  const RISK_LIBRARY = {
    "reinforced-concrete": [
      { title: "개구부·단부 추락", cause: "슬래브 개구부 또는 작업발판 가장자리에서 작업 중 추락", measure: "개구부 덮개를 고정·표시하고 안전난간과 안전대 부착설비를 확인합니다.", severity: "상", likelihood: "중" },
      { title: "거푸집·동바리 붕괴", cause: "조립 불량, 지지력 부족 또는 콘크리트 타설 중 편심 하중", measure: "조립 상태와 받침·연결부를 점검하고 타설 순서 및 하중을 관리합니다.", severity: "상", likelihood: "중" },
      { title: "철근에 찔림·베임", cause: "돌출 철근이나 절단·결속 작업 중 신체 접촉", measure: "돌출부에 보호캡을 설치하고 보안경·장갑 등 보호구를 착용합니다.", severity: "중", likelihood: "중" },
      { title: "자재 양중 중 낙하·충돌", cause: "인양물 결속 불량 또는 작업반경 내 근로자 접근", measure: "줄걸이 상태와 인양구를 확인하고 신호수를 배치해 출입을 통제합니다.", severity: "상", likelihood: "중" }
    ],
    "steel-frame": [
      { title: "철골 조립 중 추락", cause: "고소 위치에서 철골 부재를 연결하거나 이동 중 추락", measure: "작업발판·안전난간을 설치하고 안전대 걸이시설과 체결 상태를 확인합니다.", severity: "상", likelihood: "중" },
      { title: "철골 부재 전도·붕괴", cause: "임시 고정이 불충분한 상태에서 다음 부재를 설치", measure: "조립 순서와 임시 버팀을 확인하고 구조적으로 안정된 뒤 다음 공정을 진행합니다.", severity: "상", likelihood: "중" },
      { title: "인양 자재 낙하·협착", cause: "크레인 인양 중 결속 해제 또는 부재와 구조물 사이 끼임", measure: "인양구·줄걸이를 점검하고 유도자를 배치하며 협착 구역에 접근하지 않습니다.", severity: "상", likelihood: "중" },
      { title: "용접·절단 불티 화재", cause: "불티가 가연물에 튀거나 화기작업 주변 정리가 미흡", measure: "가연물을 제거·차폐하고 소화기와 화재감시자를 배치합니다.", severity: "상", likelihood: "하" }
    ],
    earthwork: [
      { title: "굴착면 붕괴·매몰", cause: "굴착 깊이·지반 상태에 맞지 않는 구배 또는 흙막이 미설치", measure: "지반과 굴착 깊이에 맞게 흙막이·구배를 계획하고 작업 전 상태를 점검합니다.", severity: "상", likelihood: "중" },
      { title: "굴착장비와 근로자 충돌", cause: "장비 후진·회전 반경 내 근로자 접근 또는 시야 사각", measure: "장비 작업반경을 구획하고 유도자를 배치하며 후방 확인장치를 점검합니다.", severity: "상", likelihood: "중" },
      { title: "굴착부 추락", cause: "굴착부 가장자리 접근 또는 야간 식별 어려움", measure: "안전난간·덮개와 접근 통제선을 설치하고 야간 조명을 확보합니다.", severity: "상", likelihood: "중" },
      { title: "매설물 손상", cause: "지하 매설물 위치 확인 없이 굴착 작업 진행", measure: "도면·탐사로 매설물 위치를 확인하고 관계자 입회 및 시험 굴착을 실시합니다.", severity: "상", likelihood: "하" }
    ],
    electrical: [
      { title: "충전부 접촉 감전", cause: "전원 차단·검전 없이 배선이나 설비에 접촉", measure: "전원을 차단·잠금 표시하고 검전 및 접지 상태를 확인한 뒤 작업합니다.", severity: "상", likelihood: "중" },
      { title: "임시전기 누전", cause: "손상된 케이블·접속부 또는 습윤 장소에서 전기 사용", measure: "누전차단기와 케이블 피복을 확인하고 통로·물기와 분리합니다.", severity: "상", likelihood: "중" },
      { title: "사다리·고소작업 추락", cause: "불안정한 사다리에서 양손 작업 또는 과도한 몸 뻗기", measure: "안전한 작업발판을 우선 사용하고 사다리 고정·보조자 배치를 확인합니다.", severity: "상", likelihood: "중" },
      { title: "천공 중 매설 전선 손상", cause: "벽체·바닥 내부 배선 위치를 확인하지 않고 천공", measure: "도면과 탐지기로 배선 경로를 확인하고 작업구역을 표시합니다.", severity: "중", likelihood: "중" }
    ],
    mechanical: [
      { title: "중량 설비 양중 중 낙하", cause: "중량물 무게·인양점 확인 부족 또는 줄걸이 불량", measure: "중량·무게중심과 인양구 허용하중을 확인하고 시험 인양 후 이동합니다.", severity: "상", likelihood: "중" },
      { title: "회전체·구동부 끼임", cause: "가동 상태에서 점검하거나 방호덮개가 열린 설비에 접근", measure: "정지·잠금 표시 후 작업하고 방호장치를 복구한 뒤 재가동합니다.", severity: "상", likelihood: "중" },
      { title: "배관 연결 중 협착", cause: "배관 정렬·고정 중 손이나 신체가 접합부에 위치", measure: "정렬용 공구를 사용하고 배관을 지지·고정한 상태에서 연결합니다.", severity: "중", likelihood: "중" },
      { title: "용접·절단 불티 화재", cause: "보온재·포장재 주변 화기작업 또는 환기 부족", measure: "가연물을 치우고 불티 비산을 막으며 소화기와 화재감시자를 둡니다.", severity: "상", likelihood: "하" }
    ],
    windows: [
      { title: "외벽·창호 설치 중 추락", cause: "개구부 주변 또는 고소 작업대에서 설치 중 추락", measure: "작업발판·난간을 확인하고 안전대 부착설비에 체결합니다.", severity: "상", likelihood: "중" },
      { title: "유리 파손·절상", cause: "유리 운반·세우기 중 파손 또는 날카로운 모서리 접촉", measure: "전용 흡착기와 운반구를 사용하고 절단방지 장갑·보안경을 착용합니다.", severity: "중", likelihood: "중" },
      { title: "창호·유리 자재 낙하", cause: "고정 전 자재가 바람·충격으로 이탈하거나 아래로 떨어짐", measure: "임시 고정과 낙하 방지 조치를 확인하고 하부 출입을 통제합니다.", severity: "상", likelihood: "중" },
      { title: "양중·운반 중 손 끼임", cause: "창호 프레임을 세우거나 위치를 맞추는 중 손이 끼임", measure: "작업자 간 신호를 정하고 손 대신 보조 공구를 사용해 위치를 조정합니다.", severity: "중", likelihood: "중" }
    ]
  };

  const $ = (selector) => document.querySelector(selector);
  const form = $("#project-form");
  const workTypeSelect = $("#work-type");
  const amountInput = $("#contract-amount");
  const amountReading = $("#amount-reading");
  const amountError = $("#amount-error");
  const formError = $("#form-error");
  const resultSection = $("#result-section");
  const riskList = $("#risk-list");
  let currentProject = null;

  function getWorkType(id) {
    return WORK_TYPES.find((workType) => workType.id === id);
  }

  function getAmount() {
    const normalized = amountInput.value.replace(/[,\s]/g, "");
    if (!/^\d+$/.test(normalized)) {
      return null;
    }
    const amount = Number(normalized);
    return Number.isSafeInteger(amount) && amount > 0 ? amount : null;
  }

  function renderWorkTypes() {
    for (const workType of WORK_TYPES) {
      const option = document.createElement("option");
      option.value = workType.id;
      option.textContent = `${workType.icon} ${workType.label}`;
      workTypeSelect.append(option);
    }
  }

  function updateAmountReading() {
    const amount = getAmount();
    amountError.textContent = "";
    amountReading.textContent = amount
      ? `입력 금액: ${window.F1Calculator.readKoreanAmount(amount)}`
      : "금액을 입력하면 한글 금액으로 보여드려요.";
  }

  function createRiskItem(risk) {
    const item = document.createElement("article");
    item.className = "risk-item";

    const text = document.createElement("div");
    const title = document.createElement("p");
    title.className = "risk-title";
    title.textContent = risk.title;
    const cause = document.createElement("p");
    cause.className = "risk-detail";
    cause.textContent = `위험 상황: ${risk.cause}`;
    const measure = document.createElement("p");
    measure.className = "risk-detail";
    measure.textContent = `초기 대책: ${risk.measure}`;
    text.append(title, cause, measure);

    const tags = document.createElement("div");
    tags.className = "risk-tags";
    for (const [label, value] of [["중대성", risk.severity], ["가능성", risk.likelihood]]) {
      const tag = document.createElement("span");
      tag.className = `risk-tag${value === "상" ? " high" : ""}`;
      tag.textContent = `${label} ${value}`;
      tags.append(tag);
    }
    item.append(text, tags);
    return item;
  }

  function calculateProject(event) {
    event.preventDefault();
    amountError.textContent = "";
    formError.textContent = "";
    const workType = getWorkType(workTypeSelect.value);
    const contractAmount = getAmount();
    if (!workType) {
      workTypeSelect.focus();
      formError.textContent = "공종을 선택해 주세요.";
      return;
    }
    if (!contractAmount) {
      amountInput.focus();
      amountError.textContent = "0보다 큰 금액을 숫자로 입력해 주세요.";
      return;
    }

    const basisRatio = Number($("#basis-ratio").value);
    const rate = Number($("#demo-rate").value);
    let estimate;
    try {
      estimate = window.F1Calculator.calculateEstimate(contractAmount, basisRatio, rate);
    } catch (error) {
      formError.textContent = error.message;
      return;
    }

    const risks = RISK_LIBRARY[workType.id];
    currentProject = {
      id: null,
      workTypeId: workType.id,
      workTypeLabel: workType.label,
      contractAmount,
      basisRatio,
      rate,
      targetAmount: estimate.targetAmount,
      budgetEstimate: estimate.estimate,
      risks,
      createdAt: new Date().toISOString()
    };

    $("#result-title").textContent = `${workType.label} 프로젝트 안전 세팅`;
    $("#estimated-budget").textContent = window.F1Calculator.formatWon(estimate.estimate);
    $("#breakdown-contract").textContent = window.F1Calculator.formatWon(contractAmount);
    $("#breakdown-ratio").textContent = `${basisRatio}% · ${window.F1Calculator.formatWon(estimate.targetAmount)}`;
    $("#breakdown-rate").textContent = `${rate}% (예시)`;
    $("#risk-count").textContent = String(risks.length);
    riskList.replaceChildren(...risks.map(createRiskItem));
    $("#save-status").textContent = "";
    resultSection.hidden = false;
    resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function loadProjects() {
    try {
      const value = localStorage.getItem(STORAGE_KEY);
      if (!value) {
        return [];
      }
      const projects = JSON.parse(value);
      if (!Array.isArray(projects)) {
        throw new Error("저장 데이터의 형식이 올바르지 않습니다.");
      }
      return projects;
    } catch (error) {
      throw new Error(`저장된 프로젝트를 읽을 수 없습니다: ${error.message}`);
    }
  }

  function saveProjects(projects) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch (error) {
      throw new Error(`프로젝트를 저장하지 못했습니다: ${error.message}`);
    }
  }

  function renderSavedProjects() {
    const container = $("#saved-projects");
    let projects;
    try {
      projects = loadProjects();
    } catch (error) {
      container.replaceChildren();
      const message = document.createElement("p");
      message.className = "empty-state";
      message.textContent = error.message;
      container.append(message);
      return;
    }

    $("#saved-count").textContent = `${projects.length}개`;
    if (projects.length === 0) {
      const empty = document.createElement("p");
      empty.className = "empty-state";
      empty.textContent = "아직 저장한 프로젝트가 없습니다. 위에서 안전 세팅을 만들고 저장해 보세요.";
      container.replaceChildren(empty);
      return;
    }

    container.replaceChildren(...projects.map((project) => {
      const card = document.createElement("article");
      card.className = "saved-project";
      const details = document.createElement("div");
      const title = document.createElement("h3");
      title.textContent = `${project.workTypeLabel} 프로젝트`;
      const summary = document.createElement("p");
      const date = new Date(project.createdAt);
      summary.textContent = `${window.F1Calculator.formatWon(project.contractAmount)} · 예시 ${window.F1Calculator.formatWon(project.budgetEstimate)} · ${date.toLocaleDateString("ko-KR")}`;
      details.append(title, summary);
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "delete-button";
      remove.textContent = "삭제";
      remove.setAttribute("aria-label", `${project.workTypeLabel} 프로젝트 삭제`);
      remove.addEventListener("click", () => deleteProject(project.id));
      card.append(details, remove);
      return card;
    }));
  }

  function saveCurrentProject() {
    if (!currentProject) {
      return;
    }
    try {
      const projects = loadProjects();
      const project = { ...currentProject, id: crypto.randomUUID() };
      saveProjects([project, ...projects]);
      $("#save-status").textContent = "이 기기에 프로젝트를 저장했습니다.";
      renderSavedProjects();
    } catch (error) {
      $("#save-status").textContent = error.message;
    }
  }

  function deleteProject(id) {
    try {
      const projects = loadProjects();
      saveProjects(projects.filter((project) => project.id !== id));
      renderSavedProjects();
    } catch (error) {
      const status = $("#save-status");
      status.textContent = error.message;
    }
  }

  renderWorkTypes();
  renderSavedProjects();
  form.addEventListener("submit", calculateProject);
  amountInput.addEventListener("input", updateAmountReading);
  document.querySelectorAll("[data-amount]").forEach((button) => {
    button.addEventListener("click", () => {
      amountInput.value = new Intl.NumberFormat("ko-KR").format(Number(button.dataset.amount));
      updateAmountReading();
      amountInput.focus();
    });
  });
  $("#save-button").addEventListener("click", saveCurrentProject);
  $("#print-button").addEventListener("click", () => window.print());
})();
