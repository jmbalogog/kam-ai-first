export const config = { runtime: 'edge', maxDuration: 30 }

interface ChatRequest {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
  category: string
  lang: 'fr' | 'en'
}

const SYSTEM_PROMPTS: Record<string, Record<string, string>> = {
  'account-analysis': {
    fr: `Tu es un expert en Key Account Management spécialisé dans l'analyse de comptes stratégiques B2B. Tu aides les KAMs à comprendre en profondeur leurs comptes : structure organisationnelle, enjeux business, potentiel de croissance, risques et opportunités. Réponds toujours en français professionnel et de manière actionnable.`,
    en: `You are a Key Account Management expert specialized in strategic B2B account analysis. You help KAMs deeply understand their accounts: organizational structure, business challenges, growth potential, risks and opportunities. Always respond in professional English with actionable advice.`,
  },
  'qbr': {
    fr: `Tu es un expert en Key Account Management spécialisé dans les QBR (Quarterly Business Reviews). Tu aides les KAMs à préparer, structurer et animer leurs revues trimestrielles pour maximiser la rétention et l'expansion des comptes stratégiques. Réponds toujours en français professionnel.`,
    en: `You are a Key Account Management expert specialized in QBRs (Quarterly Business Reviews). You help KAMs prepare, structure and run their quarterly reviews to maximize retention and expansion of strategic accounts. Always respond in professional English.`,
  },
  'capture-plan': {
    fr: `Tu es un expert en Key Account Management spécialisé dans les Capture Plans et la rétention proactive. Tu aides les KAMs à anticiper les renouvellements, identifier les risques de churn et construire des plans d'action pour sécuriser leurs contrats stratégiques. Réponds toujours en français professionnel.`,
    en: `You are a Key Account Management expert specialized in Capture Plans and proactive retention. You help KAMs anticipate renewals, identify churn risks and build action plans to secure strategic contracts. Always respond in professional English.`,
  },
  'objections': {
    fr: `Tu es un expert en Key Account Management spécialisé dans le traitement des objections complexes en environnement grands comptes. Tu aides les KAMs à anticiper, préparer et répondre aux objections des décideurs C-level et des comités d'achat. Réponds toujours en français professionnel.`,
    en: `You are a Key Account Management expert specialized in handling complex objections in enterprise environments. You help KAMs anticipate, prepare and respond to objections from C-level decision-makers and buying committees. Always respond in professional English.`,
  },
  'relationship-mapping': {
    fr: `Tu es un expert en Key Account Management spécialisé dans le mapping relationnel et la cartographie des parties prenantes. Tu aides les KAMs à identifier les décideurs, influenceurs, champions et bloqueurs au sein de leurs comptes stratégiques. Réponds toujours en français professionnel.`,
    en: `You are a Key Account Management expert specialized in relationship mapping and stakeholder cartography. You help KAMs identify decision-makers, influencers, champions and blockers within their strategic accounts. Always respond in professional English.`,
  },
  'scoring': {
    fr: `Tu es un expert en Key Account Management spécialisé dans le scoring et la priorisation de portefeuille. Tu aides les KAMs à évaluer, scorer et prioriser leurs comptes pour allouer leur temps et leurs ressources de manière optimale. Réponds toujours en français professionnel.`,
    en: `You are a Key Account Management expert specialized in scoring and portfolio prioritization. You help KAMs evaluate, score and prioritize their accounts to allocate time and resources optimally. Always respond in professional English.`,
  },
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const { messages, category, lang } = (await request.json()) as ChatRequest

    const systemPrompt =
      SYSTEM_PROMPTS[category]?.[lang] ||
      SYSTEM_PROMPTS['account-analysis'][lang] ||
      SYSTEM_PROMPTS['account-analysis']['fr']

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://kam-toolkit.vercel.app',
        'X-Title': 'KAM Toolkit IA',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-sonnet-4-5',
        messages: [{ role: 'system', content: systemPrompt }, ...messages],
        max_tokens: 1500,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      return new Response(JSON.stringify({ error: 'AI provider error', details: errorText }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || ''

    return new Response(JSON.stringify({ content }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch {
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
