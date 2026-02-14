import { StructuredPlan, VersionState } from './types'
import { validatePlan, validateCode } from './validator'
import {
  PLANNER_PROMPT,
  CODE_GENERATOR_PROMPT,
  EXPLAINER_PROMPT,
  MODIFICATION_PLANNER_PROMPT,
  buildPlannerMessage,
  buildModificationMessage,
  buildGeneratorMessage,
  buildExplainerMessage
} from './prompts'
import { stateManager } from './stateManager'
import { callClaudeAPI } from './services/geminiClient'

export interface OrchestratorResult {
  success: boolean
  version?: VersionState
  error?: string
  validationErrors?: string[]
}

export type FlowType = 'new' | 'modify' | 'rollback'

async function callPlannerAgent(userRequest: string, isModification: boolean = false): Promise<StructuredPlan> {
  const currentPlan = stateManager.getCurrent()
  
  let systemPrompt: string
  let userMessage: string

  if (isModification && currentPlan) {
    systemPrompt = MODIFICATION_PLANNER_PROMPT
    userMessage = buildModificationMessage(userRequest, JSON.stringify(currentPlan.plan, null, 2))
  } else {
    systemPrompt = PLANNER_PROMPT
    userMessage = buildPlannerMessage(userRequest)
  }

  const response = await callClaudeAPI(systemPrompt, userMessage)
  
  try {
    const cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const plan = JSON.parse(cleaned)
    return plan as StructuredPlan
  } catch (error) {
    throw new Error(`Failed to parse planner response as JSON: ${error}`)
  }
}

async function callCodeGenerator(plan: StructuredPlan): Promise<string> {
  const userMessage = buildGeneratorMessage(JSON.stringify(plan, null, 2))
  const response = await callClaudeAPI(CODE_GENERATOR_PROMPT, userMessage)
  
  const cleaned = response.replace(/```jsx\n?/g, '').replace(/```typescript\n?/g, '').replace(/```\n?/g, '').trim()
  return cleaned
}

async function callExplainer(userRequest: string, plan: StructuredPlan, isModification: boolean): Promise<string> {
  const userMessage = buildExplainerMessage(
    userRequest,
    JSON.stringify(plan, null, 2),
    isModification
  )
  const response = await callClaudeAPI(EXPLAINER_PROMPT, userMessage)
  return response.trim()
}

async function newUIFlow(userRequest: string): Promise<OrchestratorResult> {
  try {
    console.log('Calling Planner Agent...')
    const plan = await callPlannerAgent(userRequest, false)

    console.log(' Validating Plan...')
    const planValidation = validatePlan(plan)
    if (!planValidation.isValid) {
      return {
        success: false,
        error: 'Plan validation failed',
        validationErrors: planValidation.errors
      }
    }

    console.log('Generating Code...')
    const code = await callCodeGenerator(plan)

    console.log('Validating Code...')
    const codeValidation = validateCode(code)
    if (!codeValidation.isValid) {
      return {
        success: false,
        error: 'Code validation failed',
        validationErrors: codeValidation.errors
      }
    }

    console.log('Generating Explanation...')
    const explanation = await callExplainer(userRequest, plan, false)

    const version: VersionState = {
      version: stateManager.getNextVersionNumber(),
      timestamp: new Date().toISOString(),
      userRequest,
      plan,
      code,
      explanation
    }

    stateManager.store(version)

    console.log('New UI created successfully!')
    return { success: true, version }

  } catch (error) {
    return {
      success: false,
      error: `Error in new UI flow: ${error instanceof Error ? error.message : String(error)}`
    }
  }
}

async function modifyUIFlow(userRequest: string): Promise<OrchestratorResult> {
  try {
    const currentVersion = stateManager.getCurrent()
    if (!currentVersion) {
      return {
        success: false,
        error: 'No existing UI to modify. Create a new UI first.'
      }
    }

    console.log('Calling Modification Planner...')
    const plan = await callPlannerAgent(userRequest, true)

    console.log('Validating Modified Plan...')
    const planValidation = validatePlan(plan)
    if (!planValidation.isValid) {
      return {
        success: false,
        error: 'Modified plan validation failed',
        validationErrors: planValidation.errors
      }
    }

    console.log('Generating Code...')
    const code = await callCodeGenerator(plan)

    console.log('Validating Code...')
    const codeValidation = validateCode(code)
    if (!codeValidation.isValid) {
      return {
        success: false,
        error: 'Code validation failed',
        validationErrors: codeValidation.errors
      }
    }

    console.log('Generating Explanation...')
    const explanation = await callExplainer(userRequest, plan, true)

    const version: VersionState = {
      version: stateManager.getNextVersionNumber(),
      timestamp: new Date().toISOString(),
      userRequest,
      plan,
      code,
      explanation
    }

    stateManager.store(version)

    console.log('UI modified successfully!')
    return { success: true, version }

  } catch (error) {
    return {
      success: false,
      error: `Error in modify UI flow: ${error instanceof Error ? error.message : String(error)}`
    }
  }
}

function rollbackFlow(): OrchestratorResult {
  const previous = stateManager.rollback()
  
  if (!previous) {
    return {
      success: false,
      error: 'Cannot rollback: No previous version exists'
    }
  }

  console.log(`Rolled back to version ${previous.version}`)
  return { success: true, version: previous }
}


export async function orchestrate(
  userInput: string,
  flowType: FlowType
): Promise<OrchestratorResult> {
  console.log(`\n Starting ${flowType} flow...`)
  console.log(`Input: ${userInput}`)

  switch (flowType) {
    case 'new':
      return await newUIFlow(userInput)
    
    case 'modify':
      return await modifyUIFlow(userInput)
    
    case 'rollback':
      return rollbackFlow()
    
    default:
      return {
        success: false,
        error: `Unknown flow type: ${flowType}`
      }
  }
}

export function getCurrentUI(): VersionState | null {
  return stateManager.getCurrent()
}

export function getVersionHistory(): VersionState[] {
  return stateManager.getAllVersions()
}

export function clearHistory(): void {
  stateManager.clear()
}
