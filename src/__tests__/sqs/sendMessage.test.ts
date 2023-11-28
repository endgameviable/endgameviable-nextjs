import { mockClient } from 'aws-sdk-client-mock';
import 'aws-sdk-client-mock-jest';
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { QueueEvent } from '@/data/sqs/event';
import { sendMessage } from '@/data/sqs/send';
import { sqsEventQueueName } from '@config/resourceConfig';

const sqsMock = mockClient(SQSClient);

it('mocks sendMessage', async () => {
    const date = "2023-11-28T08:48:00Z";
    const message: QueueEvent = {
        eventID: 'guid',
        eventType: 'webmention',
        eventHost: 'testhost',
        eventDate: date,
        eventPayload: {
            source: 'source',
            target: 'target',
        },
    };    

    const client = new SQSClient({});
    const result = await sendMessage(client, message);

    expect(result).toBe(true);
    expect(sqsMock).toHaveReceivedCommandWith(SendMessageCommand, {
        QueueUrl: sqsEventQueueName,
        MessageBody: JSON.stringify(message),
    });
});
