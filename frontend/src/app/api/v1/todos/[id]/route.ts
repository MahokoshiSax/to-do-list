import { NextRequest, NextResponse } from 'next/server';
import { fetchInternalApi } from '@/utils/internal/internal-api';

export async function GET(req: NextRequest) {
  try {
    return fetchInternalApi(req);
  } catch (error) {
    console.error('Failed to fetch todos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch todos' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    return fetchInternalApi(req);
  } catch (error) {
    console.error('Failed to create todo:', error);
    return NextResponse.json(
      { error: 'Failed to create todo' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    return fetchInternalApi(req);
  } catch (error) {
    console.error('Failed to update todo:', error);
    return NextResponse.json(
      { error: 'Failed to update todo' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    return fetchInternalApi(req);
  } catch (error) {
    console.error('Failed to delete todo:', error);
    return NextResponse.json(
      { error: 'Failed to delete todo' },
      { status: 500 }
    );
  }
} 