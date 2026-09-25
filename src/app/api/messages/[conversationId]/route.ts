import { NextResponse } from 'next/server';
import { errorStatus, getWhatsAppClient } from '@/lib/whatsapp-client';

// Previous Kapso message mapping kept for reference while the active client
// reads from the gateway's /evolution-api/messages/:conversationId (EVOLUTION_API_URL).
//
// import {
//   buildKapsoFields,
//   type KapsoMessageExtensions,
//   type MediaData,
//   type MetaMessage
// } from '@kapso/whatsapp-cloud-api';
// import { PHONE_NUMBER_ID } from '@/lib/whatsapp-client';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  const { conversationId } = await params;

  try {
    const whatsappClient = await getWhatsAppClient(request);

    const { searchParams } = new URL(request.url);
    const parsedLimit = Number.parseInt(searchParams.get('limit') ?? '', 10);
    const limit = Number.isFinite(parsedLimit) && parsedLimit > 0 ? Math.min(parsedLimit, 100) : 50;

    const response = await whatsappClient.messages.listByConversation({
      conversationId,
      limit
    });

    return NextResponse.json({
      data: response.data,
      paging: response.paging
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages', conversationId },
      { status: errorStatus(error) }
    );
  }
}
