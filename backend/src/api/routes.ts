import express, { Request, Response } from 'express'
import { orchestrate, getCurrentUI, getVersionHistory, clearHistory } from '../orchestrator.js'

const router = express.Router()

// Generate new UI or modify existing
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const { prompt, flowType } = req.body
    
    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'Prompt is required'
      })
    }

    const type = flowType || 'new'
    const result = await orchestrate(prompt, type)
    
    res.json(result)
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Modify existing UI
router.post('/modify', async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body
    
    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'Prompt is required'
      })
    }

    const result = await orchestrate(prompt, 'modify')
    
    res.json(result)
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Rollback to previous version
router.post('/rollback', async (req: Request, res: Response) => {
  try {
    const result = await orchestrate('', 'rollback')
    res.json(result)
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Get all versions
router.get('/versions', (req: Request, res: Response) => {
  try {
    const versions = getVersionHistory()
    res.json({
      success: true,
      versions
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Get current version
router.get('/current', (req: Request, res: Response) => {
  try {
    const current = getCurrentUI()
    res.json({
      success: true,
      version: current
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Clear history
router.delete('/history', (req: Request, res: Response) => {
  try {
    clearHistory()
    res.json({
      success: true,
      message: 'History cleared'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

export default router
