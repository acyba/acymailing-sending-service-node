# AcyMailing node library

## Installation

```bash
npm i @acymailing/sending-service
```

## Usage

```javascript
import {AcyMailer} from '@acymailing/sending-service';

const mailer = new AcyMailer('your-license-key');

const domain = await mailer.addDomain({name: 'example.com'});

const email = {
    to: 'email@recipients.com',
    subject: 'test email from node lib',
    body: '<h1>Hello</h1>, this is a test email from the node lib', // altBody?: string,
    fromEmail: 'email@example.com',
    fromName: 'Email example',
    replyToEmail: 'no-reply@example.com',
    replyToName: 'Email no-reply',
    bounceEmail: 'bounce@example.com', // cc?: string[];
    attachments: [
        '/paht/to/attachment.png'
    ]
};

const response = await mailer.sendEmail(email);
```

## Development

Install the dependencies:

```bash
npm install
```

Build and test:

```bash
npm run test
```


