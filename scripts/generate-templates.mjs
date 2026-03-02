/**
 * Generate all 16 KAM Toolkit template files (8 FR + 8 EN)
 * Run with: node scripts/generate-templates.mjs
 */
import ExcelJS from 'exceljs'
import PptxGenJS from 'pptxgenjs'
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, HeadingLevel, BorderStyle, AlignmentType } from 'docx'
import { writeFileSync, mkdirSync } from 'fs'

const OUT = 'public/templates'
mkdirSync(OUT, { recursive: true })

const KAM_NAVY = '1E3A5F'
const KAM_GOLD = 'C9A84C'
const WHITE = 'FFFFFF'
const LIGHT_GRAY = 'F5F5F5'
const BORDER_GRAY = 'D0D0D0'

// ─── Shared Excel helpers ───

function styleHeader(ws, cols) {
  ws.columns = cols.map(c => ({ header: c.header, key: c.key, width: c.width || 20 }))
  const headerRow = ws.getRow(1)
  headerRow.font = { bold: true, color: { argb: WHITE }, size: 11 }
  headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: KAM_NAVY } }
  headerRow.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
  headerRow.height = 28
}

function addExcelBorders(ws, rowCount) {
  for (let r = 1; r <= rowCount; r++) {
    const row = ws.getRow(r)
    row.eachCell(cell => {
      cell.border = {
        top: { style: 'thin', color: { argb: BORDER_GRAY } },
        bottom: { style: 'thin', color: { argb: BORDER_GRAY } },
        left: { style: 'thin', color: { argb: BORDER_GRAY } },
        right: { style: 'thin', color: { argb: BORDER_GRAY } },
      }
    })
    if (r > 1 && r % 2 === 0) {
      row.eachCell(cell => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: LIGHT_GRAY } }
      })
    }
  }
}

function addValidation(ws, col, row, formula) {
  ws.getCell(`${col}${row}`).dataValidation = {
    type: 'list',
    allowBlank: true,
    formulae: [formula],
  }
}

// ─── 1. Scoring Matrix (xlsx) ───

async function createScoringMatrix(lang) {
  const wb = new ExcelJS.Workbook()
  wb.creator = 'KAM Toolkit'
  const isFR = lang === 'fr'

  const ws = wb.addWorksheet(isFR ? 'Scoring' : 'Scoring')
  const cols = [
    { header: isFR ? 'Compte' : 'Account', key: 'account', width: 25 },
    { header: isFR ? 'Potentiel Revenu (1-5)' : 'Revenue Potential (1-5)', key: 'revenue', width: 22 },
    { header: isFR ? 'Fit Stratégique (1-5)' : 'Strategic Fit (1-5)', key: 'fit', width: 22 },
    { header: isFR ? 'Force Relation (1-5)' : 'Relationship Strength (1-5)', key: 'relationship', width: 24 },
    { header: isFR ? 'Probabilité Croissance (1-5)' : 'Growth Probability (1-5)', key: 'growth', width: 24 },
    { header: isFR ? 'Position Concurrentielle (1-5)' : 'Competitive Position (1-5)', key: 'competitive', width: 26 },
    { header: isFR ? 'Timeline Décision (1-5)' : 'Decision Timeline (1-5)', key: 'timeline', width: 24 },
    { header: isFR ? 'SCORE TOTAL (/30)' : 'TOTAL SCORE (/30)', key: 'total', width: 20 },
    { header: isFR ? 'Priorité' : 'Priority', key: 'priority', width: 18 },
  ]
  styleHeader(ws, cols)

  // Add 15 empty rows with formulas
  for (let i = 2; i <= 16; i++) {
    ws.getCell(`H${i}`).value = { formula: `SUM(B${i}:G${i})` }
    ws.getCell(`I${i}`).value = { formula: `IF(H${i}>=24,"${isFR ? 'Investir' : 'Invest'}",IF(H${i}>=18,"${isFR ? 'Maintenir' : 'Maintain'}","${isFR ? 'Désengager' : 'Divest'}"))` }
    // Data validation for scores 1-5
    for (const col of ['B', 'C', 'D', 'E', 'F', 'G']) {
      addValidation(ws, col, i, '"1,2,3,4,5"')
    }
  }

  // Conditional formatting on total
  ws.addConditionalFormatting({
    ref: 'H2:H16',
    rules: [
      { type: 'cellIs', operator: 'greaterThanOrEqual', formulae: [24], style: { fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: '22C55E' } }, font: { bold: true, color: { argb: WHITE } } }, priority: 1 },
      { type: 'cellIs', operator: 'greaterThanOrEqual', formulae: [18], style: { fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F59E0B' } }, font: { bold: true } }, priority: 2 },
      { type: 'cellIs', operator: 'lessThan', formulae: [18], style: { fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'EF4444' } }, font: { bold: true, color: { argb: WHITE } } }, priority: 3 },
    ],
  })

  addExcelBorders(ws, 16)

  const fn = isFR ? 'scoring-matrix-fr.xlsx' : 'scoring-matrix-en.xlsx'
  await wb.xlsx.writeFile(`${OUT}/${fn}`)
  console.log(`  ✓ ${fn}`)
}

// ─── 2. Relationship Map (xlsx) ───

async function createRelationshipMap(lang) {
  const wb = new ExcelJS.Workbook()
  const isFR = lang === 'fr'

  const ws = wb.addWorksheet(isFR ? 'Carte Relationnelle' : 'Relationship Map')
  const cols = [
    { header: isFR ? 'Nom' : 'Name', key: 'name', width: 22 },
    { header: isFR ? 'Rôle / Titre' : 'Role / Title', key: 'role', width: 25 },
    { header: isFR ? 'Département' : 'Department', key: 'dept', width: 18 },
    { header: isFR ? 'Niveau Hiérarchique' : 'Hierarchy Level', key: 'level', width: 22 },
    { header: isFR ? 'Influence (H/M/L)' : 'Influence (H/M/L)', key: 'influence', width: 18 },
    { header: isFR ? 'Sentiment' : 'Sentiment', key: 'sentiment', width: 18 },
    { header: isFR ? 'Fréquence Contact' : 'Contact Frequency', key: 'freq', width: 20 },
    { header: isFR ? 'Prochaine Action' : 'Next Action', key: 'action', width: 30 },
    { header: isFR ? 'Notes' : 'Notes', key: 'notes', width: 30 },
  ]
  styleHeader(ws, cols)

  const levels = isFR ? '"C-Level,Directeur,Manager,Opérationnel"' : '"C-Level,Director,Manager,Operational"'
  const influence = '"High,Medium,Low"'
  const sentiments = isFR ? '"Champion,Supporteur,Neutre,Résistant,Bloqueur"' : '"Champion,Supportive,Neutral,Resistant,Blocker"'
  const frequencies = isFR ? '"Hebdo,Bi-mensuel,Mensuel,Trimestriel,Annuel"' : '"Weekly,Bi-weekly,Monthly,Quarterly,Annually"'

  for (let i = 2; i <= 21; i++) {
    addValidation(ws, 'D', i, levels)
    addValidation(ws, 'E', i, influence)
    addValidation(ws, 'F', i, sentiments)
    addValidation(ws, 'G', i, frequencies)
  }

  addExcelBorders(ws, 21)

  const fn = isFR ? 'carte-relationnelle-fr.xlsx' : 'relationship-map-en.xlsx'
  await wb.xlsx.writeFile(`${OUT}/${fn}`)
  console.log(`  ✓ ${fn}`)
}

// ─── 3. Capture Plan (xlsx) ───

async function createCapturePlan(lang) {
  const wb = new ExcelJS.Workbook()
  const isFR = lang === 'fr'

  // Sheet 1: Account Overview
  const ws1 = wb.addWorksheet(isFR ? 'Vue d\'ensemble' : 'Overview')
  const fields = isFR
    ? ['Nom du Compte', 'CA Annuel', 'Date de Renouvellement', 'Mois Restants', 'Sponsor Principal', 'Concurrent Principal', 'Niveau de Risque (1-10)', 'Objectif Stratégique']
    : ['Account Name', 'Annual Revenue', 'Renewal Date', 'Months Remaining', 'Main Sponsor', 'Main Competitor', 'Risk Level (1-10)', 'Strategic Objective']

  fields.forEach((f, i) => {
    const cell = ws1.getCell(`A${i + 1}`)
    cell.value = f
    cell.font = { bold: true, color: { argb: WHITE } }
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: KAM_NAVY } }
    ws1.getCell(`B${i + 1}`).value = ''
  })
  ws1.getColumn(1).width = 30
  ws1.getColumn(2).width = 40

  // Sheet 2: Timeline
  const ws2 = wb.addWorksheet('Timeline')
  const timelineCols = [
    { header: isFR ? 'Jalon' : 'Milestone', key: 'milestone', width: 15 },
    { header: isFR ? 'Date Cible' : 'Target Date', key: 'date', width: 15 },
    { header: isFR ? 'Action' : 'Action', key: 'action', width: 35 },
    { header: isFR ? 'Responsable' : 'Owner', key: 'owner', width: 20 },
    { header: isFR ? 'Statut' : 'Status', key: 'status', width: 15 },
  ]
  styleHeader(ws2, timelineCols)
  const milestones = ['D-180', 'D-150', 'D-120', 'D-90', 'D-60', 'D-30', 'D-15', 'D-Day']
  milestones.forEach((m, i) => {
    ws2.getCell(`A${i + 2}`).value = m
    addValidation(ws2, 'E', i + 2, isFR ? '"À faire,En cours,Fait,Bloqué"' : '"To Do,In Progress,Done,Blocked"')
  })
  addExcelBorders(ws2, milestones.length + 1)

  // Sheet 3: Risks
  const ws3 = wb.addWorksheet(isFR ? 'Risques' : 'Risks')
  const riskCols = [
    { header: isFR ? 'Risque' : 'Risk', key: 'risk', width: 30 },
    { header: isFR ? 'Type' : 'Type', key: 'type', width: 18 },
    { header: isFR ? 'Probabilité (1-5)' : 'Probability (1-5)', key: 'prob', width: 18 },
    { header: isFR ? 'Impact (1-5)' : 'Impact (1-5)', key: 'impact', width: 15 },
    { header: isFR ? 'Score' : 'Score', key: 'score', width: 12 },
    { header: isFR ? 'Mitigation' : 'Mitigation', key: 'mitigation', width: 35 },
  ]
  styleHeader(ws3, riskCols)
  for (let i = 2; i <= 11; i++) {
    addValidation(ws3, 'B', i, isFR ? '"Compétitif,Interne,Budget,Relation,Contractuel"' : '"Competitive,Internal,Budget,Relationship,Contractual"')
    addValidation(ws3, 'C', i, '"1,2,3,4,5"')
    addValidation(ws3, 'D', i, '"1,2,3,4,5"')
    ws3.getCell(`E${i}`).value = { formula: `C${i}*D${i}` }
  }
  addExcelBorders(ws3, 11)

  const fn = isFR ? 'capture-plan-fr.xlsx' : 'capture-plan-en.xlsx'
  await wb.xlsx.writeFile(`${OUT}/${fn}`)
  console.log(`  ✓ ${fn}`)
}

// ─── 4. Gap Analysis (xlsx) ───

async function createGapAnalysis(lang) {
  const wb = new ExcelJS.Workbook()
  const isFR = lang === 'fr'

  const ws = wb.addWorksheet(isFR ? 'Analyse des Écarts' : 'Gap Analysis')
  const cols = [
    { header: isFR ? 'Compte' : 'Account', key: 'account', width: 22 },
    { header: isFR ? 'CA Actuel' : 'Current Revenue', key: 'current', width: 18 },
    { header: isFR ? 'CA Potentiel' : 'Potential Revenue', key: 'potential', width: 18 },
    { header: isFR ? 'Écart (€)' : 'Gap ($)', key: 'gap', width: 16 },
    { header: isFR ? 'Écart (%)' : 'Gap (%)', key: 'gapPct', width: 14 },
    { header: isFR ? 'Produits Non Vendus' : 'Unsold Products', key: 'unsold', width: 28 },
    { header: isFR ? 'Départements Non Couverts' : 'Uncovered Departments', key: 'uncovered', width: 28 },
    { header: isFR ? 'Stratégie d\'Expansion' : 'Expansion Strategy', key: 'strategy', width: 30 },
    { header: isFR ? 'Priorité' : 'Priority', key: 'priority', width: 14 },
  ]
  styleHeader(ws, cols)

  for (let i = 2; i <= 16; i++) {
    ws.getCell(`D${i}`).value = { formula: `C${i}-B${i}` }
    ws.getCell(`E${i}`).value = { formula: `IF(B${i}>0,(C${i}-B${i})/B${i},"")` }
    ws.getCell(`E${i}`).numFmt = '0%'
    ws.getCell(`B${i}`).numFmt = '#,##0'
    ws.getCell(`C${i}`).numFmt = '#,##0'
    ws.getCell(`D${i}`).numFmt = '#,##0'
    addValidation(ws, 'I', i, isFR ? '"Haute,Moyenne,Basse"' : '"High,Medium,Low"')
  }

  addExcelBorders(ws, 16)

  const fn = isFR ? 'gap-analysis-fr.xlsx' : 'gap-analysis-en.xlsx'
  await wb.xlsx.writeFile(`${OUT}/${fn}`)
  console.log(`  ✓ ${fn}`)
}

// ─── 5. 30-60-90 Day Plan (xlsx) ───

async function create306090(lang) {
  const wb = new ExcelJS.Workbook()
  const isFR = lang === 'fr'

  const phases = [
    { name: isFR ? '30 Jours — Découverte' : '30 Days — Discovery', days: '1-30' },
    { name: isFR ? '60 Jours — Fondations' : '60 Days — Foundations', days: '31-60' },
    { name: isFR ? '90 Jours — Accélération' : '90 Days — Acceleration', days: '61-90' },
  ]

  for (const phase of phases) {
    const ws = wb.addWorksheet(phase.name.split(' — ')[0])
    const cols = [
      { header: isFR ? 'Objectif' : 'Objective', key: 'objective', width: 30 },
      { header: isFR ? 'Actions Clés' : 'Key Actions', key: 'actions', width: 35 },
      { header: isFR ? 'Responsable' : 'Owner', key: 'owner', width: 18 },
      { header: isFR ? 'Deadline' : 'Deadline', key: 'deadline', width: 15 },
      { header: isFR ? 'KPI / Métrique' : 'KPI / Metric', key: 'kpi', width: 25 },
      { header: isFR ? 'Statut' : 'Status', key: 'status', width: 15 },
    ]
    styleHeader(ws, cols)
    for (let i = 2; i <= 11; i++) {
      addValidation(ws, 'F', i, isFR ? '"À faire,En cours,Fait"' : '"To Do,In Progress,Done"')
    }
    addExcelBorders(ws, 11)
  }

  const fn = isFR ? 'plan-30-60-90-fr.xlsx' : '30-60-90-plan-en.xlsx'
  await wb.xlsx.writeFile(`${OUT}/${fn}`)
  console.log(`  ✓ ${fn}`)
}

// ─── 6. Account Plan (docx) ───

async function createAccountPlan(lang) {
  const isFR = lang === 'fr'

  const makeBorderedCell = (text, opts = {}) => {
    return new TableCell({
      children: [new Paragraph({ children: [new TextRun({ text, ...opts })], spacing: { after: 100 } })],
      width: { size: opts.width || 50, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 1, color: BORDER_GRAY },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: BORDER_GRAY },
        left: { style: BorderStyle.SINGLE, size: 1, color: BORDER_GRAY },
        right: { style: BorderStyle.SINGLE, size: 1, color: BORDER_GRAY },
      },
    })
  }

  const sections = isFR
    ? [
        { title: '1. Vue d\'Ensemble', fields: ['Nom du Compte', 'Secteur', 'CA Annuel', 'Taille (effectif)', 'Durée de la relation'] },
        { title: '2. Contacts Clés', fields: ['Sponsor Exécutif', 'Décideur Principal', 'Champion Interne', 'Utilisateur Clé'] },
        { title: '3. Objectifs Stratégiques', fields: ['Objectif #1', 'Objectif #2', 'Objectif #3'] },
        { title: '4. Analyse SWOT', fields: ['Forces', 'Faiblesses', 'Opportunités', 'Menaces'] },
        { title: '5. Plan d\'Action (90 jours)', fields: ['Action #1 — Deadline — Responsable', 'Action #2 — Deadline — Responsable', 'Action #3 — Deadline — Responsable'] },
        { title: '6. Métriques de Succès', fields: ['KPI #1', 'KPI #2', 'KPI #3'] },
      ]
    : [
        { title: '1. Overview', fields: ['Account Name', 'Industry', 'Annual Revenue', 'Company Size (headcount)', 'Relationship Tenure'] },
        { title: '2. Key Contacts', fields: ['Executive Sponsor', 'Primary Decision-Maker', 'Internal Champion', 'Key User'] },
        { title: '3. Strategic Objectives', fields: ['Objective #1', 'Objective #2', 'Objective #3'] },
        { title: '4. SWOT Analysis', fields: ['Strengths', 'Weaknesses', 'Opportunities', 'Threats'] },
        { title: '5. Action Plan (90 days)', fields: ['Action #1 — Deadline — Owner', 'Action #2 — Deadline — Owner', 'Action #3 — Deadline — Owner'] },
        { title: '6. Success Metrics', fields: ['KPI #1', 'KPI #2', 'KPI #3'] },
      ]

  const docSections = []

  // Title
  docSections.push(
    new Paragraph({
      children: [new TextRun({ text: isFR ? 'PLAN DE COMPTE — 1 PAGE' : 'ONE-PAGE ACCOUNT PLAN', bold: true, size: 32, color: KAM_NAVY })],
      spacing: { after: 200 },
      alignment: AlignmentType.CENTER,
    }),
    new Paragraph({
      children: [new TextRun({ text: isFR ? 'Date : ____________    Auteur : ____________' : 'Date: ____________    Author: ____________', size: 20, color: '666666' })],
      spacing: { after: 400 },
      alignment: AlignmentType.CENTER,
    })
  )

  for (const section of sections) {
    docSections.push(
      new Paragraph({
        children: [new TextRun({ text: section.title, bold: true, size: 24, color: KAM_NAVY })],
        spacing: { before: 300, after: 150 },
      })
    )

    const rows = section.fields.map(f =>
      new TableRow({
        children: [
          makeBorderedCell(f, { bold: true, size: 20, width: 35 }),
          makeBorderedCell('', { size: 20, width: 65 }),
        ],
      })
    )

    docSections.push(new Table({ rows, width: { size: 100, type: WidthType.PERCENTAGE } }))
  }

  const doc = new Document({
    sections: [{ children: docSections }],
    creator: 'KAM Toolkit',
  })

  const buffer = await Packer.toBuffer(doc)
  const fn = isFR ? 'plan-de-compte-fr.docx' : 'account-plan-en.docx'
  writeFileSync(`${OUT}/${fn}`, buffer)
  console.log(`  ✓ ${fn}`)
}

// ─── 7. Strategic Conversation Canvas (docx) ───

async function createStrategicConversation(lang) {
  const isFR = lang === 'fr'

  const makeBorderedCell = (text, opts = {}) => {
    return new TableCell({
      children: [new Paragraph({ children: [new TextRun({ text, ...opts })], spacing: { after: 80 } })],
      width: { size: opts.width || 50, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 1, color: BORDER_GRAY },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: BORDER_GRAY },
        left: { style: BorderStyle.SINGLE, size: 1, color: BORDER_GRAY },
        right: { style: BorderStyle.SINGLE, size: 1, color: BORDER_GRAY },
      },
    })
  }

  const blocks = isFR
    ? [
        { title: '1. Préparation', prompts: ['Quel est l\'objectif de cette conversation ?', 'Quels insights business préparer ?', 'Quelles questions poser ?', 'Quel résultat idéal ?'] },
        { title: '2. Ouverture (5 min)', prompts: ['Contexte / Ice breaker', 'Agenda proposé', 'Objectif partagé'] },
        { title: '3. Découverte (15 min)', prompts: ['Enjeux business du client', 'Défis actuels', 'Priorités stratégiques', 'Budget / Timeline'] },
        { title: '4. Proposition de Valeur (10 min)', prompts: ['Alignement solution ↔ enjeux', 'Valeur quantifiée', 'Différenciation vs alternatives'] },
        { title: '5. Engagements Mutuels (5 min)', prompts: ['Prochaine étape concrète', 'Qui fait quoi, quand ?', 'Prochaine réunion ?'] },
        { title: '6. Débrief Post-Réunion', prompts: ['Ce qui s\'est bien passé', 'Ce qui doit être amélioré', 'Actions immédiates', 'Suivi email envoyé ? (Oui/Non)'] },
      ]
    : [
        { title: '1. Preparation', prompts: ['What is the objective of this conversation?', 'What business insights to prepare?', 'What questions to ask?', 'What is the ideal outcome?'] },
        { title: '2. Opening (5 min)', prompts: ['Context / Ice breaker', 'Proposed agenda', 'Shared objective'] },
        { title: '3. Discovery (15 min)', prompts: ['Client\'s business challenges', 'Current challenges', 'Strategic priorities', 'Budget / Timeline'] },
        { title: '4. Value Proposition (10 min)', prompts: ['Solution ↔ challenges alignment', 'Quantified value', 'Differentiation vs alternatives'] },
        { title: '5. Mutual Commitments (5 min)', prompts: ['Concrete next step', 'Who does what, when?', 'Next meeting?'] },
        { title: '6. Post-Meeting Debrief', prompts: ['What went well', 'What needs improvement', 'Immediate actions', 'Follow-up email sent? (Yes/No)'] },
      ]

  const docSections = []

  docSections.push(
    new Paragraph({
      children: [new TextRun({ text: isFR ? 'CANVAS — CONVERSATION STRATÉGIQUE' : 'STRATEGIC CONVERSATION CANVAS', bold: true, size: 32, color: KAM_NAVY })],
      spacing: { after: 150 },
      alignment: AlignmentType.CENTER,
    }),
    new Paragraph({
      children: [new TextRun({ text: isFR ? 'Compte : ____________    Date : ____________    Interlocuteur : ____________' : 'Account: ____________    Date: ____________    Contact: ____________', size: 20, color: '666666' })],
      spacing: { after: 400 },
      alignment: AlignmentType.CENTER,
    })
  )

  for (const block of blocks) {
    docSections.push(
      new Paragraph({
        children: [new TextRun({ text: block.title, bold: true, size: 24, color: KAM_NAVY })],
        spacing: { before: 300, after: 150 },
      })
    )

    const rows = block.prompts.map(p =>
      new TableRow({
        children: [
          makeBorderedCell(p, { size: 20, width: 40, italics: true }),
          makeBorderedCell('', { size: 20, width: 60 }),
        ],
      })
    )

    docSections.push(new Table({ rows, width: { size: 100, type: WidthType.PERCENTAGE } }))
  }

  const doc = new Document({
    sections: [{ children: docSections }],
    creator: 'KAM Toolkit',
  })

  const buffer = await Packer.toBuffer(doc)
  const fn = isFR ? 'conversation-strategique-fr.docx' : 'strategic-conversation-en.docx'
  writeFileSync(`${OUT}/${fn}`, buffer)
  console.log(`  ✓ ${fn}`)
}

// ─── 8. QBR Template (pptx) ───

async function createQBR(lang) {
  const isFR = lang === 'fr'
  const pptx = new PptxGenJS()
  pptx.author = 'KAM Toolkit'
  pptx.title = isFR ? 'Template QBR' : 'QBR Template'

  const addSlide = (title, bullets) => {
    const slide = pptx.addSlide()
    // Title bar
    slide.addShape('rect', { x: 0, y: 0, w: '100%', h: 0.9, fill: { color: KAM_NAVY } })
    slide.addText(title, { x: 0.5, y: 0.15, w: 9, h: 0.6, fontSize: 24, bold: true, color: WHITE })
    // Bullets
    const bodyText = bullets.map(b => ({ text: b, options: { fontSize: 16, color: '333333', bullet: true, breakLine: true, paraSpaceBefore: 8 } }))
    slide.addText(bodyText, { x: 0.5, y: 1.2, w: 9, h: 4.2 })
    // Footer
    slide.addText('KAM Toolkit', { x: 0.3, y: 5.2, w: 3, h: 0.3, fontSize: 10, color: KAM_GOLD })
  }

  const slides = isFR
    ? [
        { title: 'Agenda & Objectifs', bullets: ['Revue du trimestre passé', 'Valeur délivrée & métriques d\'impact', 'Incidents et résolutions', 'Vision stratégique — prochains 90 jours', 'Opportunités identifiées', 'Plan d\'action conjoint'] },
        { title: 'Bilan du Trimestre', bullets: ['Objectif 1 : [résultat vs cible]', 'Objectif 2 : [résultat vs cible]', 'Objectif 3 : [résultat vs cible]', 'Commentaire global sur la performance'] },
        { title: 'Valeur Délivrée', bullets: ['Métrique #1 : [valeur]', 'Métrique #2 : [valeur]', 'Métrique #3 : [valeur]', 'Total valeur délivrée ce trimestre : [€ / %]'] },
        { title: 'Incidents & Résolutions', bullets: ['Incident #1 : [description] → Résolu le [date]', 'Incident #2 : [description] → Résolu le [date]', 'Actions préventives mises en place', 'Engagement SLA pour le prochain trimestre'] },
        { title: 'Vision Stratégique — Prochains 90 Jours', bullets: ['Priorité stratégique #1', 'Priorité stratégique #2', 'Priorité stratégique #3', 'Investissements prévus de notre côté'] },
        { title: 'Opportunités Identifiées', bullets: ['Opportunité #1 : [description, valeur estimée]', 'Opportunité #2 : [description, valeur estimée]', 'Prochaines étapes pour explorer ces opportunités'] },
        { title: 'Plan d\'Action Conjoint', bullets: ['Action #1 — Responsable : [nom] — Deadline : [date]', 'Action #2 — Responsable : [nom] — Deadline : [date]', 'Action #3 — Responsable : [nom] — Deadline : [date]', 'Prochaine QBR prévue le : [date]'] },
        { title: 'Merci !', bullets: ['Questions ?', 'Contact : [votre email]', 'Prochaine réunion : [date]'] },
      ]
    : [
        { title: 'Agenda & Objectives', bullets: ['Last quarter review', 'Value delivered & impact metrics', 'Incidents and resolutions', 'Strategic vision — next 90 days', 'Identified opportunities', 'Joint action plan'] },
        { title: 'Quarter Review', bullets: ['Goal 1: [result vs target]', 'Goal 2: [result vs target]', 'Goal 3: [result vs target]', 'Overall performance commentary'] },
        { title: 'Value Delivered', bullets: ['Metric #1: [value]', 'Metric #2: [value]', 'Metric #3: [value]', 'Total value delivered this quarter: [$ / %]'] },
        { title: 'Incidents & Resolutions', bullets: ['Incident #1: [description] → Resolved on [date]', 'Incident #2: [description] → Resolved on [date]', 'Preventive actions implemented', 'SLA commitment for next quarter'] },
        { title: 'Strategic Vision — Next 90 Days', bullets: ['Strategic priority #1', 'Strategic priority #2', 'Strategic priority #3', 'Planned investments on our side'] },
        { title: 'Identified Opportunities', bullets: ['Opportunity #1: [description, estimated value]', 'Opportunity #2: [description, estimated value]', 'Next steps to explore these opportunities'] },
        { title: 'Joint Action Plan', bullets: ['Action #1 — Owner: [name] — Deadline: [date]', 'Action #2 — Owner: [name] — Deadline: [date]', 'Action #3 — Owner: [name] — Deadline: [date]', 'Next QBR scheduled for: [date]'] },
        { title: 'Thank You!', bullets: ['Questions?', 'Contact: [your email]', 'Next meeting: [date]'] },
      ]

  for (const s of slides) {
    addSlide(s.title, s.bullets)
  }

  const fn = isFR ? 'qbr-template-fr.pptx' : 'qbr-template-en.pptx'
  await pptx.writeFile({ fileName: `${OUT}/${fn}` })
  console.log(`  ✓ ${fn}`)
}

// ─── Run all ───

console.log('Generating KAM Toolkit templates...\n')

await Promise.all([
  createScoringMatrix('fr'),
  createScoringMatrix('en'),
  createRelationshipMap('fr'),
  createRelationshipMap('en'),
  createCapturePlan('fr'),
  createCapturePlan('en'),
  createGapAnalysis('fr'),
  createGapAnalysis('en'),
  create306090('fr'),
  create306090('en'),
  createAccountPlan('fr'),
  createAccountPlan('en'),
  createStrategicConversation('fr'),
  createStrategicConversation('en'),
  createQBR('fr'),
  createQBR('en'),
])

console.log(`\nDone! 16 templates generated in ${OUT}/`)
