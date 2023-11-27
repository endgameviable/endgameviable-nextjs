import { SendMessageCommand } from '@aws-sdk/client-sqs';
import { QueueEvent } from './event';
import { sqsClient, sqsEventQueueName } from '@config/resourceConfig';

export async function sendMessage(payload: QueueEvent): Promise<boolean> {
    const command = new SendMessageCommand({
        QueueUrl: sqsEventQueueName,
        MessageBody: JSON.stringify(payload),
    });
    try {
        const response = await sqsClient.send(command);
        console.log(response);
        return true;
    } catch (error) {
        // How are we supposed to handle these errors?
        console.log(error);
    }
    return false;
}
