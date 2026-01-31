/**
 * Individual Opportunity API Route
 * 
 * Handles PATCH (update) and DELETE operations for a single opportunity.
 * 
 * @module api/admin/opportunities/[id]
 */
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'

export const dynamic = 'force-dynamic'

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params
    const payload = await getPayload({ config: configPromise })
    const body = await request.json()
    
    const updated = await payload.update({
      collection: 'opportunities',
      id: parseInt(id),
      data: body,
    })
    
    return NextResponse.json(updated)
  } catch (error) {
    console.error('Failed to update opportunity:', error)
    return NextResponse.json(
      { error: 'Failed to update opportunity' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params
    const payload = await getPayload({ config: configPromise })
    
    await payload.delete({
      collection: 'opportunities',
      id: parseInt(id),
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete opportunity:', error)
    return NextResponse.json(
      { error: 'Failed to delete opportunity' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params
    const payload = await getPayload({ config: configPromise })
    
    const opportunity = await payload.findByID({
      collection: 'opportunities',
      id: parseInt(id),
      depth: 1,
    })
    
    return NextResponse.json(opportunity)
  } catch (error) {
    console.error('Failed to fetch opportunity:', error)
    return NextResponse.json(
      { error: 'Failed to fetch opportunity' },
      { status: 500 }
    )
  }
}
