import { NextResponse } from 'next/server';
import { errorStatus, getWhatsAppClient } from '@/lib/whatsapp-client';

export async function GET(request: Request) {
  try {
    const whatsappClient = await getWhatsAppClient(request);

    const wabaId = process.env.WABA_ID;

    if (!wabaId) {
      return NextResponse.json(
        { error: 'WABA_ID not configured' },
        { status: 500 }
      );
    }

    const response = await whatsappClient.templates.list({
      businessAccountId: wabaId,
      limit: 100
    });

    return NextResponse.json({
      data: response.data,
      paging: response.paging
    });
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: errorStatus(error) }
    );
  }
}
