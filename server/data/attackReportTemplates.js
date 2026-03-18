/**
 * ShieldBox.io - Strategic Report Assembly Hub (Final Production)
 * [위치] server/data/attackReportTemplates.js
 */

// 1. 7개의 정밀 보안 템플릿 임포트
const dictionaryTmpl        = require('./reportTemplates/dictionaryTemplate');
const rainbowTableTmpl      = require('./reportTemplates/rainbowTableTemplate');
const sideChannelTmpl       = require('./reportTemplates/sideChannelTemplate');
const bruteForceTmpl        = require('./reportTemplates/bruteForceTemplate');
const credentialStuffingTmpl = require('./reportTemplates/credentialStuffingTemplate');
const maskAttackTmpl        = require('./reportTemplates/maskAttackTemplate');
const ruleBasedTmpl         = require('./reportTemplates/ruleBasedTemplate');
const collisionTmpl         = require('./reportTemplates/collisionTemplate');

/**
 * [공격 엔진 - 템플릿 매핑 테이블]
 */
const attackReportTemplates = {
  dictionary:         dictionaryTmpl,
  rainbow_table:      rainbowTableTmpl,
  side_channel:       sideChannelTmpl,
  brute_force:        bruteForceTmpl,
  credential_stuffing: credentialStuffingTmpl,
  mask_attack:        maskAttackTmpl,
  rule_based:         ruleBasedTmpl,
  collision_attack:   collisionTmpl,
};

/**
 * [generateReport]
 * 엔진 결과(res)와 서사 템플릿을 결합하여 UI용 analysisResult를 생성합니다.
 */
const generateReport = (type, res) => {
  // 해당 타입의 템플릿을 찾고, 없으면 기본값으로 브루트 포스 사용
  const factory = attackReportTemplates[type] || attackReportTemplates.brute_force;
  
  // 템플릿 실행 (엔진의 모든 결과 데이터를 주입)
  const dynamicContent = factory(res);

  // React 컴포넌트(ReportModal.jsx)가 요구하는 필드 구조로 최종 조립
  return {
    // 1. 엔진의 기본 데이터 (grade, score, algorithm, pwLen 등)
    ...res,
    
    // 2. 템플릿의 서사 데이터 (summary, metaphor, narrative, vulnerability 등)
    ...dynamicContent,

    // 3. UI 필드 누락 방지 로직 (UI가 요구하는 특정 필드들 최종 매핑)
    attackVector:   dynamicContent.attackVector || res.attackVector || `${type.toUpperCase()} Analysis`,
    cryptoAnalysis: dynamicContent.cryptoAnalysis || "Cryptographic integrity scan completed.",
    
    // 4. [중요] MITIGATION ROADMAP 필드 보강
    // 템플릿에 정의된 구체적 처방전이 있으면 그것을 쓰고, 없으면 엔진의 penalties를 포맷팅하여 사용
    mitigation: dynamicContent.mitigation || (res.penalties && res.penalties.map((p, i) => ({
      step: (i + 1).toString().padStart(2, '0'),
      title: "Security Action",
      desc: p
    }))) || [],

    // 5. [중요] FORENSIC EVIDENCE 필드 보강
    // 템플릿에서 정의한 지표가 있으면 그것을 쓰고, 없으면 공통 지표 노출
    evidence: dynamicContent.evidence || [
      { label: 'ALGORITHM',   value: res.algorithm?.toUpperCase() || 'UNKNOWN', unit: '' },
      { label: 'COMPLEXITY',  value: res.pwLen || 0, unit: 'chars' },
      { label: 'SCORE',       value: res.score || 0, unit: 'pts' },
      { label: 'HARDWARE',    value: res.hardware || 'Standard PC', unit: '' }
    ]
  };
};

module.exports = { generateReport };