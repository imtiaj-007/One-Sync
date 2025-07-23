import { IncomingWebhook } from '@slack/webhook';
import { EmailDocument } from '../elastic/types.js';
import { log } from '../utils/logger.js';


export async function notifyInterestedEmail(email: EmailDocument) {
    const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
    if (!slackWebhookUrl) throw new Error('Slack Webhook URL is not defined');

    const slack = slackWebhookUrl ? new IncomingWebhook(slackWebhookUrl) : null;
    const message = `
📬 *New Interested Email!*

*Subject:* ${email.subject}
*From:* ${email.from}
*Date:* ${new Date(email.date).toLocaleString()}
*Account:* ${email.account}

*Message Preview:*
${email.text.length > 200 ? email.text.substring(0, 200) + '...' : email.text}
`;

    try {
        if (slack) {
            await slack.send({ text: message });
            log.info('Slack notification sent.');
        }
    } catch (err) {
        log.error('Notification error:', err);
    }
}
